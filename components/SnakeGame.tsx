'use client'

import { useEffect, useRef, useState } from 'react'

interface SnakeGameProps {
  onClose: () => void
}

export default function SnakeGame({ onClose }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Game configuration
  const gridSize = 20
  const cellSize = 15
  
  useEffect(() => {
    // Load high score
    const saved = localStorage.getItem('snake_highscore')
    if (saved) setHighScore(parseInt(saved, 10))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get color variables
    const textPrimary = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#f8f8f2'
    const accentPrimary = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim() || '#00ff66'
    const accentSecondary = getComputedStyle(document.documentElement).getPropertyValue('--accent-secondary').trim() || '#bd93f9'
    const cardBg = getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim() || '#0f0f0f'

    // Init snake
    let snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]
    
    // Init food
    let food = { x: 15, y: 10 }
    
    // Direction
    let dx = 1
    let dy = 0
    let nextDx = 1
    let nextDy = 0

    // Score
    let currentScore = 0
    
    // Food placement helper
    const randomFoodPosition = () => {
      let rx = 0, ry = 0
      let onSnake = true
      while (onSnake) {
        rx = Math.floor(Math.random() * gridSize)
        ry = Math.floor(Math.random() * gridSize)
        onSnake = snake.some(part => part.x === rx && part.y === ry)
      }
      return { x: rx, y: ry }
    }

    food = randomFoodPosition()

    // Handle inputs
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault() // prevent page scroll
      }

      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === ' ' && !gameOver) {
        setIsPaused(p => !p)
        return
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (dy !== 1) {
            nextDx = 0
            nextDy = -1
          }
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          if (dy !== -1) {
            nextDx = 0
            nextDy = 1
          }
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (dx !== 1) {
            nextDx = -1
            nextDy = 0
          }
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (dx !== -1) {
            nextDx = 1
            nextDy = 0
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    let gameInterval: NodeJS.Timeout

    const gameLoop = () => {
      if (gameOver || isPaused) return

      // Update direction to avoid rapid turns crashing into self
      dx = nextDx
      dy = nextDy

      // Move head
      const head = { x: snake[0].x + dx, y: snake[0].y + dy }

      // Check wall collision
      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        handleGameOver()
        return
      }

      // Check self collision
      if (snake.some(part => part.x === head.x && part.y === head.y)) {
        handleGameOver()
        return
      }

      // Add new head
      snake.unshift(head)

      // Check food eating
      if (head.x === food.x && head.y === food.y) {
        currentScore += 10
        setScore(currentScore)
        food = randomFoodPosition()
      } else {
        // Remove tail
        snake.pop()
      }

      // Draw everything
      draw()
    }

    const handleGameOver = () => {
      setGameOver(true)
      const saved = localStorage.getItem('snake_highscore')
      const topScore = saved ? parseInt(saved, 10) : 0
      if (currentScore > topScore) {
        localStorage.setItem('snake_highscore', currentScore.toString())
        setHighScore(currentScore)
      }
    }

    const draw = () => {
      // Clear board
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid lines (subtle)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.lineWidth = 1
      for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath()
        ctx.moveTo(i * cellSize, 0)
        ctx.lineTo(i * cellSize, canvas.height)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(0, i * cellSize)
        ctx.lineTo(canvas.width, i * cellSize)
        ctx.stroke()
      }

      // Draw food
      ctx.fillStyle = accentSecondary
      ctx.shadowColor = accentSecondary
      ctx.shadowBlur = 8
      ctx.fillRect(food.x * cellSize + 2, food.y * cellSize + 2, cellSize - 4, cellSize - 4)
      ctx.shadowBlur = 0 // Reset

      // Draw snake
      snake.forEach((part, index) => {
        const isHead = index === 0
        ctx.fillStyle = isHead ? accentPrimary : 'rgba(255, 255, 255, 0.7)'
        if (isHead) {
          ctx.shadowColor = accentPrimary
          ctx.shadowBlur = 8
        }
        ctx.fillRect(part.x * cellSize + 1, part.y * cellSize + 1, cellSize - 2, cellSize - 2)
        ctx.shadowBlur = 0 // Reset
      })
    }

    // Start interval
    gameInterval = setInterval(gameLoop, 100)
    
    // Initial draw
    draw()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearInterval(gameInterval)
    }
  }, [gameOver, isPaused, onClose])

  const restartGame = () => {
    setScore(0)
    setGameOver(false)
    setIsPaused(false)
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black/95 z-40 absolute inset-0 font-mono text-sm">
      <div className="mb-4 flex gap-8 justify-between w-[300px] border-b border-[var(--card-border)] pb-2 text-[var(--accent-primary)] font-bold">
        <span>SCORE: {score}</span>
        <span>HIGH: {highScore}</span>
      </div>

      <div className="relative border-2 border-[var(--accent-primary)] rounded shadow-[0_0_15px_var(--accent-primary)] bg-black">
        <canvas 
          ref={canvasRef} 
          width={gridSize * cellSize} 
          height={gridSize * cellSize}
          className="block"
        />

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-4">
            <h3 className="text-xl font-bold text-red-500 animate-pulse mb-2">GAME OVER</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4">You scored {score} points!</p>
            <div className="flex gap-4">
              <button 
                onClick={restartGame}
                className="px-3 py-1 bg-[var(--accent-primary)] text-black font-bold rounded hover:bg-[var(--accent-primary)]/80 cursor-pointer"
              >
                PLAY AGAIN
              </button>
              <button 
                onClick={onClose}
                className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-500/10 cursor-pointer"
              >
                EXIT
              </button>
            </div>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
            <h3 className="text-lg font-bold text-[var(--accent-primary)] animate-pulse">PAUSED</h3>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-xs text-[var(--text-secondary)] space-y-1">
        <p>Use [Arrow Keys] or [WASD] to control the snake</p>
        <p>Press [Space] to Pause • Press [Esc] to Exit Game</p>
      </div>
    </div>
  )
}
