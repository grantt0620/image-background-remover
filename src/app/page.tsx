'use client'

import { useState, useCallback } from 'react'
import Uploader from '@/components/Uploader'
import ResultPreview from '@/components/ResultPreview'

export type ProcessingState = 'idle' | 'processing' | 'done' | 'error'

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [state, setState] = useState<ProcessingState>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [originalName, setOriginalName] = useState<string>('image')

  const handleFile = useCallback(async (file: File) => {
    setOriginalUrl(URL.createObjectURL(file))
    setOriginalName(file.name.replace(/\.[^.]+$/, ''))
    setResultUrl(null)
    setState('processing')
    setErrorMsg('')

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch('/api/remove-bg', { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      const blob = await res.blob()
      setResultUrl(URL.createObjectURL(blob))
      setState('done')
    } catch (e: unknown) {
      setState('error')
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong')
    }
  }, [])

  const handleReset = () => {
    setOriginalUrl(null)
    setResultUrl(null)
    setState('idle')
    setErrorMsg('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <span className="text-2xl">✂️</span>
          <span className="text-xl font-bold text-gray-800">BG Remover</span>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center py-12 px-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Remove Image Background Free &amp; Instantly
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Upload a JPG, PNG, or WEBP — AI removes the background in seconds. No signup required.
        </p>
      </section>

      {/* Main */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pb-16">
        {state === 'idle' && <Uploader onFile={handleFile} />}

        {state === 'processing' && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-lg">Removing background...</p>
          </div>
        )}

        {state === 'error' && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-red-500 text-lg">⚠️ {errorMsg}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {state === 'done' && originalUrl && resultUrl && (
          <ResultPreview
            originalUrl={originalUrl}
            resultUrl={resultUrl}
            originalName={originalName}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 py-6 border-t border-gray-200">
        <p>Images are processed in memory and never stored. &nbsp;|&nbsp;
          <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>
        </p>
      </footer>
    </div>
  )
}
