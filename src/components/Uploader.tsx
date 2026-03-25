'use client'

import { useCallback, useRef, useState } from 'react'

interface UploaderProps {
  onFile: (file: File) => void
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export default function Uploader({ onFile }: UploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [validationError, setValidationError] = useState('')

  const validate = (file: File): string => {
    if (!ACCEPTED.includes(file.type)) return 'Only JPG, PNG, and WEBP files are supported.'
    if (file.size > MAX_SIZE) return 'File size must be under 10MB.'
    return ''
  }

  const handleFile = (file: File) => {
    const err = validate(file)
    if (err) { setValidationError(err); return }
    setValidationError('')
    onFile(file)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer transition
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'}`}
      >
        <span className="text-5xl mb-4">🖼️</span>
        <p className="text-lg font-semibold text-gray-700">Drop your image here</p>
        <p className="text-sm text-gray-400 mt-1">or click to browse</p>
        <p className="text-xs text-gray-400 mt-3">JPG, PNG, WEBP · Max 10MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onInputChange}
        />
      </div>
      {validationError && (
        <p className="text-red-500 text-sm">{validationError}</p>
      )}
    </div>
  )
}
