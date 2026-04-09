import { useRef, useEffect } from 'react'

interface LetterGlitchIntroProps {
  glitchColors?: string[]
  glitchSpeed?: number
  centerVignette?: boolean
  outerVignette?: boolean
  smooth?: boolean
  characters?: string
  targetWord?: string
  onComplete?: () => void
}

const LetterGlitchIntro = ({
  glitchColors = ['#2b4539', '#61dca3', '#61b3dc'],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789',
  targetWord = 'WELCOME',
  onComplete,
}: LetterGlitchIntroProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const letters = useRef<
    {
      char: string
      color: string
      targetColor: string
      colorProgress: number
      locked: boolean
    }[]
  >([])

  const grid = useRef({ columns: 0, rows: 0 })
  const context = useRef<CanvasRenderingContext2D | null>(null)

  // Timing
  const startTimeRef = useRef<number>(0)
  const lastGlitchTime = useRef<number>(0)
  const isDoneRef = useRef(false)

  // Timeline (ms)
  const T_GLITCH = 1000      // 0 - 1s: full random
  const T_COLLAPSE = 3000    // 1s - 3s: collapse from edges
  const T_RESOLVE = 4000     // 3s - 4s: resolve target word text
  const T_HOLD = 5500        // 4s - 5.5s: hold full clear text

  const lettersAndSymbols = Array.from(characters)
  const targetChars = Array.from(targetWord)

  const fontSize = 48
  const charWidth = 32
  const charHeight = 50

  const getRandomChar = () => {
    return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)]
  }

  const getRandomColor = () => {
    return glitchColors[Math.floor(Math.random() * glitchColors.length)]
  }

  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b)
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
      : null
  }

  const interpolateColor = (
    start: { r: number; g: number; b: number },
    end: { r: number; g: number; b: number },
    factor: number
  ) => {
    const result = {
      r: Math.round(start.r + (end.r - start.r) * factor),
      g: Math.round(start.g + (end.g - start.g) * factor),
      b: Math.round(start.b + (end.b - start.b) * factor),
    }
    return `rgb(${result.r}, ${result.g}, ${result.b})`
  }

  const calculateGrid = (width: number, height: number) => {
    const columns = Math.ceil(width / charWidth)
    const rows = Math.ceil(height / charHeight)
    return { columns, rows }
  }

  const initializeLetters = (columns: number, rows: number) => {
    grid.current = { columns, rows }
    const totalLetters = columns * rows
    letters.current = Array.from({ length: totalLetters }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1,
      locked: false,
    }))
  }

  const resizeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return

    const dpr = window.devicePixelRatio || 1
    const rect = parent.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    if (context.current) {
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const { columns, rows } = calculateGrid(rect.width, rect.height)
    initializeLetters(columns, rows)
  }

  // Easing function for smooth collapse
  const easeInOutCubic = (x: number): number => {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  const drawLetters = (elapsed: number) => {
    if (!context.current || letters.current.length === 0) return
    const ctx = context.current
    const { width, height } = canvasRef.current!.getBoundingClientRect()
    ctx.clearRect(0, 0, width, height)
    ctx.font = `bold ${fontSize}px monospace`
    ctx.textBaseline = 'top'

    const { columns, rows } = grid.current

    // Dynamically word-wrap the target word so it doesn't get cut off on mobile
    const maxCols = Math.max(1, columns - 2) // Leave a 1 col margin if possible
    const targetLines: string[] = []
    let currentLine = ''
    const words = targetWord.split(' ')

    words.forEach((word) => {
      // Force split words that are longer than the screen itself
      if (word.length > maxCols) {
        if (currentLine) {
          targetLines.push(currentLine)
          currentLine = ''
        }
        let tempWord = word
        while (tempWord.length > maxCols) {
          targetLines.push(tempWord.slice(0, maxCols))
          tempWord = tempWord.slice(maxCols)
        }
        currentLine = tempWord
        return
      }

      if ((currentLine + (currentLine ? ' ' : '') + word).length <= maxCols) {
        currentLine += (currentLine ? ' ' : '') + word
      } else {
        targetLines.push(currentLine)
        currentLine = word
      }
    })
    if (currentLine) targetLines.push(currentLine)

    // Calculate bounding box for Target Word block
    const startY = Math.floor((rows - targetLines.length) / 2)
    let minX = columns, maxX = 0, minY = rows, maxY = 0
    let totalTargetChars = 0

    const targetCells = new Map<string, { char: string; index: number }>()

    if (targetLines.length > 0) {
      minY = startY
      maxY = startY + targetLines.length - 1
      targetLines.forEach((line, i) => {
        const lineY = startY + i
        const lineStartX = Math.floor((columns - line.length) / 2)
        minX = Math.min(minX, lineStartX)
        maxX = Math.max(maxX, lineStartX + line.length - 1)
        for (let j = 0; j < line.length; j++) {
          const char = line[j]
          if (char !== ' ') {
            targetCells.set(`${lineStartX + j},${lineY}`, { char, index: totalTargetChars })
          }
          totalTargetChars++
        }
      })
    } else {
      minX = 0; maxX = 0; minY = 0; maxY = 0;
    }

    // Calculate maximum distance to corners for normalization
    const maxDist = Math.max(minX, columns - 1 - maxX, minY, rows - 1 - maxY)

    // Current threshold for normalized distance (1 down to -FADE_WIDTH)
    const FADE_WIDTH = 0.3 // 30% of max distance used for the fade gradient
    let currentThreshold = 1.0
    if (elapsed > T_GLITCH && elapsed <= T_COLLAPSE) {
      const progress = (elapsed - T_GLITCH) / (T_COLLAPSE - T_GLITCH)
      currentThreshold = 1.0 - easeInOutCubic(progress) * (1.0 + FADE_WIDTH)
    } else if (elapsed > T_COLLAPSE) {
      currentThreshold = -FADE_WIDTH
    }

    letters.current.forEach((letter, index) => {
      const x = index % columns
      const y = Math.floor(index / columns)

      // Distance to target word box (Chebyshev distance)
      const distToBoxX = x < minX ? minX - x : x > maxX ? x - maxX : 0
      const distToBoxY = y < minY ? minY - y : y > maxY ? y - maxY : 0
      const distToBox = Math.max(distToBoxX, distToBoxY)
      const isTargetBox = distToBox === 0

      const cellHash = `${x},${y}`
      const targetCellInfo = targetCells.get(cellHash)

      let opacity = 1.0
      if (!isTargetBox) {
        const normDist = maxDist > 0 ? distToBox / maxDist : 0
        const diff = currentThreshold - normDist
        if (diff < 0) {
          opacity = Math.max(0, 1.0 + diff / FADE_WIDTH)
        }
      } else if (!targetCellInfo && elapsed > T_COLLAPSE) {
        // Clear cells inside the bounding box that are empty spaces
        opacity = 0.0
      }

      if (opacity > 0) {
        // In Phase 3, we reveal the real letters one by one
        let displayChar = letter.char
        let displayColor = letter.color

        if (isTargetBox && targetCellInfo && elapsed > T_COLLAPSE) {
          const charIndex = targetCellInfo.index
          const resolveProgress = (elapsed - T_COLLAPSE) / (T_RESOLVE - T_COLLAPSE)
          
          // Randomize resolve timing so they don't all flip instantly
          const revealThreshold = (charIndex / Math.max(1, totalTargetChars)) * 0.8 + 0.1 // 0.1 to 0.9

          if (resolveProgress > revealThreshold) {
            displayChar = targetCellInfo.char
            
            // Give lock color - white/bright
            if (!letter.locked) {
              letter.locked = true
              letter.char = displayChar
              letter.targetColor = '#ffffff'
              letter.colorProgress = 0 // Transition to white
            }
          }
        }

        ctx.globalAlpha = opacity
        ctx.fillStyle = displayColor
        ctx.fillText(displayChar, x * charWidth, y * charHeight)
        ctx.globalAlpha = 1.0 // Reset for next iteration
      }
    })
  }

  const updateLetters = (elapsed: number) => {
    if (!letters.current || letters.current.length === 0) return

    // Limit update rate
    const updateCount = Math.max(1, Math.floor(letters.current.length * 0.05))

    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * letters.current.length)
      const letter = letters.current[index]
      if (!letter || letter.locked) continue

      letter.char = getRandomChar()
      letter.targetColor = getRandomColor()

      if (!smooth) {
        letter.color = letter.targetColor
        letter.colorProgress = 1
      } else {
        letter.colorProgress = 0
      }
    }
  }

  const handleSmoothTransitions = () => {
    let needsRedraw = false
    letters.current.forEach((letter) => {
      if (letter.colorProgress < 1) {
        letter.colorProgress += 0.05
        if (letter.colorProgress > 1) letter.colorProgress = 1

        const startRgb = hexToRgb(letter.color)
        const endRgb = hexToRgb(letter.targetColor)
        if (startRgb && endRgb) {
          letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress)
          needsRedraw = true
        }
      }
    })
    return needsRedraw
  }

  const animate = () => {
    const now = Date.now()
    if (startTimeRef.current === 0) {
      startTimeRef.current = now
      lastGlitchTime.current = now
    }

    const elapsed = now - startTimeRef.current

    if (elapsed > T_HOLD) {
      if (!isDoneRef.current) {
        isDoneRef.current = true
        onComplete?.()
      }
      return // Stop animation loop
    }

    let needsRedraw = false

    if (now - lastGlitchTime.current >= glitchSpeed) {
      updateLetters(elapsed)
      needsRedraw = true
      lastGlitchTime.current = now
    }

    if (smooth) {
      const transitions = handleSmoothTransitions()
      if (transitions) needsRedraw = true
    }

    // Always draw if in collapse phase to handle disappearing boundaries
    if (elapsed > T_GLITCH && elapsed < T_COLLAPSE) {
      needsRedraw = true
    }

    if (needsRedraw) {
      drawLetters(elapsed)
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    context.current = canvas.getContext('2d')
    resizeCanvas()

    startTimeRef.current = 0
    isDoneRef.current = false
    animate()

    let resizeTimeout: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current)
        resizeCanvas()
        animate()
      }, 100)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', handleResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glitchSpeed, smooth, targetWord])

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="block w-full h-full absolute inset-0" />
      {outerVignette && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle,_rgba(0,0,0,0)_60%,_rgba(0,0,0,1)_100%)]"></div>
      )}
      {centerVignette && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,0)_60%)]"></div>
      )}
    </div>
  )
}

export default LetterGlitchIntro
