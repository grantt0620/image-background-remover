import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Simple in-memory rate limit (per-edge-instance, resets on cold start)
const ipHits = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 20
const WINDOW_MS = 60 * 60 * 1000 // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = ipHits.get(ip)
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Max 20 requests per hour.' }, { status: 429 })
  }

  const apiKey = process.env.REMOVE_BG_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  const image = formData.get('image') as File | null
  if (!image) {
    return NextResponse.json({ error: 'No image provided.' }, { status: 400 })
  }

  if (image.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 })
  }

  // Forward to Remove.bg
  const bgForm = new FormData()
  bgForm.append('image_file', image)
  bgForm.append('size', 'auto')

  const bgRes = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': apiKey },
    body: bgForm,
  })

  if (!bgRes.ok) {
    const errText = await bgRes.text().catch(() => '')
    return NextResponse.json(
      { error: `Remove.bg error: ${bgRes.status} ${errText}` },
      { status: bgRes.status }
    )
  }

  const resultBuffer = await bgRes.arrayBuffer()
  return new NextResponse(resultBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline',
    },
  })
}
