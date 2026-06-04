'use client'

import { useEffect, useState, useRef } from 'react'

interface TypingGameProps {
  onClose: () => void
}

const SNIPPETS = [
  "const response = await fetch('/api/data')",
  "function fibonacci(n) { return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2) }",
  "import React, { useState, useEffect } from 'react'",
  "git commit -m 'fix: resolve stack overflow memory leaks'",
  "docker-compose up --build -d database api web",
  "const root = ReactDOM.createRoot(document.getElementById('root'))",
  "npm run dev -- --port 3000 --host 0.0.0.0",
  "sudo apt-get update && sudo apt-get upgrade -y"
]

export default function TypingGame({ onClose }: TypingGameProps) {
  const [snippet, setSnippet] = useState('')
  const [userInput, setUserInput] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [completed, setCompleted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Select random snippet
    const rand = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]
    setSnippet(rand)
  }, [])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [snippet])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!startTime) {
      setStartTime(Date.now())
    }

    setUserInput(value)

    // Calculate accuracy
    let correctChars = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] === snippet[i]) {
        correctChars++
      }
    }
    const acc = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100
    setAccuracy(acc)

    // Check completion
    if (value === snippet) {
      setCompleted(true)
      const endTime = Date.now()
      const timeInMinutes = (endTime - (startTime || endTime)) / 60000
      const words = snippet.length / 5 // standard word length is 5 chars
      const calculatedWpm = timeInMinutes > 0 ? Math.round(words / timeInMinutes) : 0
      setWpm(calculatedWpm)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const restartGame = () => {
    const rand = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]
    setSnippet(rand)
    setUserInput('')
    setStartTime(null)
    setWpm(0)
    setAccuracy(100)
    setCompleted(false)
  }

  // Render character by character helper
  const renderSnippet = () => {
    return snippet.split('').map((char, index) => {
      let colorClass = 'text-[var(--text-primary)] opacity-40' // not typed yet
      if (index < userInput.length) {
        colorClass = userInput[index] === char 
          ? 'text-[var(--accent-primary)] font-bold' // correct
          : 'bg-red-500/20 text-red-500 font-bold border-b-2 border-red-500' // incorrect
      }
      return (
        <span key={index} className={colorClass}>
          {char}
        </span>
      )
    })
  }

  return (
    <div 
      className="flex flex-col items-center justify-center p-6 bg-black/95 z-40 absolute inset-0 font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="max-w-xl w-full border border-[var(--card-border)] bg-[var(--card-bg)] p-6 rounded shadow-[0_0_15px_rgba(0,0,0,0.5)] space-y-6">
        <div className="flex justify-between items-center border-b border-[var(--card-border)] pb-3">
          <span className="text-[var(--accent-primary)] font-bold">SPEED TYPING CHALLENGE</span>
          <span className="text-xs text-[var(--text-secondary)]">ESC to Exit</span>
        </div>

        {/* Typing metrics */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="border border-[var(--card-border)] p-2 rounded">
            <div className="text-xs text-[var(--text-secondary)]">ACCURACY</div>
            <div className="text-lg font-bold text-[var(--accent-primary)]">{accuracy}%</div>
          </div>
          <div className="border border-[var(--card-border)] p-2 rounded">
            <div className="text-xs text-[var(--text-secondary)]">SPEED</div>
            <div className="text-lg font-bold text-[var(--accent-primary)]">{completed ? `${wpm} WPM` : 'Typing...'}</div>
          </div>
        </div>

        {/* Text prompt to type */}
        <div className="p-4 bg-black/60 rounded border border-[var(--card-border)] text-base font-mono leading-relaxed select-none min-h-[60px] flex items-center justify-center text-center">
          <div>{renderSnippet()}</div>
        </div>

        {/* Input field */}
        {!completed ? (
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className="w-full bg-black/40 border border-[var(--card-border)] px-3 py-2 rounded focus:outline-none focus:border-[var(--accent-primary)] text-sm font-mono text-[var(--text-primary)]"
              placeholder="Type the code snippet above as fast as you can..."
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>
        ) : (
          <div className="flex gap-4 justify-center">
            <button
              onClick={restartGame}
              className="px-4 py-2 bg-[var(--accent-primary)] text-black font-bold rounded hover:bg-[var(--accent-primary)]/80 cursor-pointer text-xs"
            >
              TRY ANOTHER
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500/10 cursor-pointer text-xs"
            >
              EXIT GAME
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-xs text-[var(--text-secondary)]">
        Click anywhere on the screen to focus typing input.
      </div>
    </div>
  )
}
