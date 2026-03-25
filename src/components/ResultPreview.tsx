'use client'

import { useState } from 'react'

interface ResultPreviewProps {
  originalUrl: string
  resultUrl: string
  originalName: string
  onReset: () => void
}

export default function ResultPreview({ originalUrl, resultUrl, originalName, onReset }: ResultPreviewProps) {
  const [bgColor, setBgColor] = useState<'transparent' | 'white' | 'black'>('transparent')

  const download = () => {
    const a = document.createElement('a')
    a.href = resultUrl
    a.download = `${originalName}-removed-bg.png`
    a.click()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setBgColor('transparent')}
            className={`px-4 py-2 rounded-lg border transition ${bgColor === 'transparent' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}
          >
            Transparent
          </button>
          <button
            onClick={() => setBgColor('white')}
            className={`px-4 py-2 rounded-lg border transition ${bgColor === 'white' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}
          >
            White
          </button>
          <button
            onClick={() => setBgColor('black')}
            className={`px-4 py-2 rounded-lg border transition ${bgColor === 'black' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}
          >
            Black
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={download}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
          >
            ⬇️ Download PNG
          </button>
          <button
            onClick={onReset}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Upload New
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-600">Original</p>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <img src={originalUrl} alt="Original" className="w-full h-auto" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-600">Background Removed</p>
          <div
            className={`border border-gray-300 rounded-lg overflow-hidden ${
              bgColor === 'transparent' ? 'checkerboard' : bgColor === 'white' ? 'bg-white' : 'bg-black'
            }`}
          >
            <img src={resultUrl} alt="Result" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}
