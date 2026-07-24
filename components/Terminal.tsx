'use client'

import React, { useState, useEffect, useRef } from 'react'
import type { PortfolioData } from '@/lib/types'
import { COMMANDS, getVFS, resolvePath } from '@/lib/commands'
import MatrixRain from '@/components/MatrixRain'
import SnakeGame from '@/components/SnakeGame'
import TypingGame from '@/components/TypingGame'

// Powerline chevron divider for p10k theme segments
const Chevron = ({ fromColor, toColor }: { fromColor: string; toColor: string }) => (
  <svg 
    width="10" 
    height="20" 
    viewBox="0 0 10 20" 
    preserveAspectRatio="none" 
    className="h-5 w-2.5 inline-block align-middle select-none pointer-events-none"
    style={{ fill: fromColor }}
  >
    {toColor !== 'transparent' && <rect x="0" y="0" width="10" height="20" fill={toColor} />}
    <path d="M0,0 L0,20 L10,10 Z" />
  </svg>
)

const ASCII_BANNER = `
   ______ _   _   ___  _____  _   __  ___  _    _  _____ _   _ 
  /  ____| | | | / _ \\|_   _|| | / / / _ \\| |  | ||_   _| \\ | |
 |  |    | |_| |/ /_\\ \\ | |  | |/ / / /_\\ \\ |  | |  | | |  \\| |
 |  |    |  _  ||  _  | | |  |    \\ |  _  | |/\\| |  | | | . \` |
 |  \`____| | | || | | | | |  | |\\  \\| | | |\\  /\\  /_| |_| |\\  |
  \\______|/   \\|/   \\|/ /    \\_/ \\_/ /   \\| \\/  \\/ \\___/\\_|_|_/
`

interface TerminalProps {
  data: PortfolioData
  setMode: (mode: 'terminal' | 'gui') => void
  activeTheme: string
  setTheme: (theme: string) => void
}

interface LogLine {
  id: string
  type: 'input' | 'output' | 'error' | 'system'
  content: React.ReactNode
}

export default function Terminal({ data, setMode, activeTheme, setTheme }: TerminalProps) {
  const [inputVal, setInputVal] = useState('')
  const [logs, setLogs] = useState<LogLine[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isBooting, setIsBooting] = useState(true)
  const [currentPath, setCurrentPath] = useState('/')
  
  // Terminal UI Modes & Expansions
  const [matrixActive, setMatrixActive] = useState(false)
  const [activeGame, setActiveGame] = useState<null | 'snake' | 'typing' | 'panic'>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [fontScale, setFontScale] = useState(1.0)
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({
    about: true,
    projects: true,
    skills: true,
    certifications: false,
    contact: false,
    secret: false
  })
  
  // Interactive Contact Flow States
  const [contactState, setContactState] = useState<null | 'email' | 'message' | 'confirm'>(null)
  const [contactData, setContactData] = useState({ email: '', message: '' })

  const inputRef = useRef<HTMLInputElement>(null)
  const logsEndRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Focus input automatically
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Set default sidebar and font scale depending on viewport width on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSidebarOpen(window.innerWidth >= 768)
      
      const width = window.innerWidth
      if (width > 2560) {
        setFontScale(1.4) // 4K default
      } else if (width > 1920) {
        setFontScale(1.2) // 2K default
      } else {
        setFontScale(1.0) // 1080p and lower
      }
    }
  }, [])

  useEffect(() => {
    focusInput()
  }, [matrixActive, activeGame, isBooting, contactState, isSidebarOpen])

  // Scroll to bottom whenever logs change
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs])

  // Simulated Boot Sequence
  useEffect(() => {
    if (!isBooting) return

    const bootLines = [
      ASCII_BANNER,
      '-----------------------------------------------------------------',
      '[BOOT] Initializing Web Terminal OS v1.0.0...',
      '[BOOT] Loading oh-my-zsh framework configs...',
      '[BOOT] Loading Powerlevel10k shell theme presets...',
      '[BOOT] Kernel version: Next.js 16.2.2 & React 19.2.4',
      '[BOOT] GPU: Browser Sandbox Hardware Acceleration Active',
      '[BOOT] Matrix rain screen saver initialized.',
      '[BOOT] Theme engine loaded successfully.',
      `[BOOT] Active Developer Profile: ${data.profile.name}`,
      `[BOOT] Terminal connection SECURE (SSL/TLS active)`,
      '[BOOT] STATUS: READY. Type "help" to see available commands.'
    ]

    let currentLine = 0
    setLogs([])

    const interval = setInterval(() => {
      if (currentLine < bootLines.length) {
        setLogs((prev) => [
          ...prev,
          {
            id: `boot-${Date.now()}-${currentLine}`,
            type: 'system',
            content: bootLines[currentLine]
          }
        ])
        currentLine++
      } else {
        clearInterval(interval)
        setIsBooting(false)
      }
    }, 120)

    return () => clearInterval(interval)
  }, [isBooting, data.profile.name])

  // Simulated panic reboot loop
  useEffect(() => {
    if (activeGame === 'panic') {
      const timer = setTimeout(() => {
        // Scramble logs
        setLogs([
          { id: 'scramble-1', type: 'error', content: 'FATAL ERROR: KERNEL PANIC' },
          { id: 'scramble-2', type: 'error', content: 'SYSTEM MEMORY DUMP: 0x00FF32AC' },
          { id: 'scramble-3', type: 'error', content: 'REBOOTING SYSTEM DIAGNOSTICS...' }
        ])
        
        // Boot again
        setTimeout(() => {
          setCurrentPath('/')
          setContactState(null)
          setContactData({ email: '', message: '' })
          setMatrixActive(false)
          setInputVal('')
          setActiveGame(null)
          setIsBooting(true)
        }, 1500)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [activeGame])

  // Core Actions passed to command executions
  const actions = {
    setTheme: (t: string) => setTheme(t),
    clearHistory: () => setLogs([]),
    setMode: (m: 'terminal' | 'gui') => setMode(m),
    startMatrix: () => setMatrixActive(true),
    startGame: (g: 'snake' | 'typing' | 'panic') => setActiveGame(g as any),
    startContactFlow: () => {
      setContactState('email')
      setLogs((prev) => [
        ...prev,
        { id: `contact-prompt-email-${Date.now()}`, type: 'system', content: 'Enter your email address: ' }
      ])
    },
    historyList: commandHistory,
    currentPath,
    setCurrentPath: (p: string) => setCurrentPath(p)
  }

  // Core execution of shell commands
  const executeCommand = (cmdText: string) => {
    const trimmed = cmdText.trim()
    if (!trimmed) return

    // Add to logs (using p10k output style)
    const lineId = Date.now().toString()
    const promptPath = currentPath === '/' ? '~' : `~${currentPath}`
    setLogs((prev) => [
      ...prev,
      {
        id: `input-${lineId}`,
        type: 'input',
        content: (
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-0 h-5 opacity-70">
              <span className="text-indigo-400/50 mr-1 select-none">╭─</span>
              <span className="bg-[#4f46e5]/80 text-white px-2 py-0.5 font-bold flex items-center gap-1 h-5 text-xs rounded-l">
                <span>💻</span>
                <span>guest@portfolio</span>
              </span>
              <Chevron fromColor="rgba(79, 70, 229, 0.8)" toColor="rgba(59, 130, 246, 0.8)" />
              
              <span className="bg-[#3b82f6]/80 text-white px-2 py-0.5 font-bold flex items-center gap-1 h-5 text-xs">
                <span>📁</span>
                <span>{promptPath}</span>
              </span>
              <Chevron fromColor="rgba(59, 130, 246, 0.8)" toColor="rgba(16, 185, 129, 0.8)" />

              <span className="bg-[#10b981]/80 text-black px-2 py-0.5 font-bold flex items-center gap-1 h-5 text-xs rounded-r">
                <span>🌿</span>
                <span>main</span>
              </span>
              <Chevron fromColor="rgba(16, 185, 129, 0.8)" toColor="transparent" />
            </div>
            <div className="flex items-center gap-1.5 pl-0.5">
              <span className="text-indigo-400 select-none">╰─ ❯</span>
              <span className="text-[var(--text-primary)]">{trimmed}</span>
            </div>
          </div>
        )
      }
    ])

    // Save to command history
    const updatedHistory = [...commandHistory, trimmed]
    setCommandHistory(updatedHistory)
    setHistoryIndex(-1)

    // Tokenize
    const tokens = trimmed.split(/\s+/)
    const commandName = tokens[0].toLowerCase()
    const args = tokens.slice(1)

    // Handle ./ script execution — treat as `cat <path>` + trigger side-effects
    if (commandName.startsWith('./') || commandName.startsWith('/')) {
      const scriptPath = commandName.startsWith('./') ? commandName.slice(2) : commandName.slice(1)
      // send_message.sh → trigger contact flow
      if (scriptPath.endsWith('send_message.sh') || scriptPath === 'contact/send_message.sh') {
        actions.startContactFlow()
        return
      }
      // Unknown script
      setLogs((prev) => [
        ...prev,
        {
          id: `err-${lineId}`,
          type: 'error',
          content: `bash: ${commandName}: Permission denied or script not found`
        }
      ])
      return
    }

    const cmd = COMMANDS[commandName]
    if (cmd) {
      try {
        const result = cmd.execute(args, data, actions)
        if (result !== null) {
          setLogs((prev) => [
            ...prev,
            { id: `out-${lineId}`, type: 'output', content: result }
          ])
        }
      } catch (err) {
        setLogs((prev) => [
          ...prev,
          { id: `err-${lineId}`, type: 'error', content: `Execution error: ${(err as Error).message}` }
        ])
      }
    } else {
      setLogs((prev) => [
        ...prev,
        {
          id: `err-${lineId}`,
          type: 'error',
          content: `Command not found: "${commandName}". Type "help" to view all available commands.`
        }
      ])
    }
  }

  // Handle Command Submission from standard Form
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputVal.trim()
    setInputVal('')

    if (isBooting || activeGame) return

    // If in contact flow
    if (contactState) {
      handleContactFlowInput(trimmed)
      return
    }

    executeCommand(trimmed)
  }

  // Handle Interactive Contact Flow
  const handleContactFlowInput = (value: string) => {
    const lineId = Date.now().toString()
    setLogs((prev) => [...prev, { id: `contact-in-${lineId}`, type: 'input', content: value }])

    if (contactState === 'email') {
      const isValid = value.includes('@') && value.indexOf('@') > 0
      if (!isValid) {
        setLogs((prev) => [
          ...prev,
          { id: `contact-err-${lineId}`, type: 'error', content: 'Invalid email format. Please enter email: ' }
        ])
        return
      }

      setContactData((prev) => ({ ...prev, email: value }))
      setContactState('message')
      setLogs((prev) => [
        ...prev,
        { id: `contact-prompt-msg-${lineId}`, type: 'system', content: 'Enter your message: ' }
      ])
    } else if (contactState === 'message') {
      if (!value.trim()) {
        setLogs((prev) => [
          ...prev,
          { id: `contact-err-${lineId}`, type: 'error', content: 'Message cannot be empty. Enter your message: ' }
        ])
        return
      }

      setContactData((prev) => ({ ...prev, message: value }))
      setContactState('confirm')
      setLogs((prev) => [
        ...prev,
        {
          id: `contact-prompt-confirm-${lineId}`,
          type: 'system',
          content: `Email: ${contactData.email}\nMessage: "${value}"\nSend this message? (y/n): `
        }
      ])
    } else if (contactState === 'confirm') {
      const confirm = value.toLowerCase()
      if (confirm === 'y' || confirm === 'yes') {
        setLogs((prev) => [...prev, { id: `contact-send-${lineId}`, type: 'system', content: '[Sending message...]' }])
        
        setTimeout(() => {
          setLogs((prev) => [
            ...prev,
            { id: `contact-success-${lineId}`, type: 'output', content: '[Success] Message sent successfully! Chatkawin will reach back to you shortly.' }
          ])
          setContactState(null)
          setContactData({ email: '', message: '' })
        }, 1200)
      } else {
        setLogs((prev) => [...prev, { id: `contact-cancel-${lineId}`, type: 'error', content: '[Aborted] Message cancelled.' }])
        setContactState(null)
        setContactData({ email: '', message: '' })
      }
    }
  }

  // Keyboard Shortcuts (Tab / History)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isBooting || activeGame) return

    // Tab Completion
    if (e.key === 'Tab') {
      e.preventDefault()
      if (contactState) return

      const trimmedInput = inputVal.trim()
      const tokens = trimmedInput.split(/\s+/)
      const commandPart = tokens[0].toLowerCase()

      // Autocomplete files/folders for cd, cat, ls
      if (tokens.length > 1 && ['cd', 'cat', 'ls'].includes(commandPart)) {
        const prefix = tokens.slice(1).join(' ').toLowerCase()
        const vfs = getVFS(data)
        const { node } = resolvePath(vfs, currentPath, '.')
        if (node && node.type === 'dir' && node.children) {
          const fileNames = Object.keys(node.children)
          const matches = fileNames.filter((name) => name.toLowerCase().startsWith(prefix))
          if (matches.length === 1) {
            setInputVal(`${commandPart} ${matches[0]}`)
          } else if (matches.length > 1) {
            setLogs((prev) => [
              ...prev,
              {
                id: `tab-files-${Date.now()}`,
                type: 'system',
                content: `File matches: ${matches.join(', ')}`
              }
            ])
          }
        }
        return
      }

      const prefix = inputVal.trim().toLowerCase()
      if (!prefix) return

      const matches = Object.keys(COMMANDS).filter((k) => k.startsWith(prefix))

      if (matches.length === 1) {
        setInputVal(matches[0])
      } else if (matches.length > 1) {
        setLogs((prev) => [
          ...prev,
          {
            id: `tab-${Date.now()}`,
            type: 'system',
            content: `Matches: ${matches.join(', ')}`
          }
        ])
      }
    }

    // Command History (Up/Down)
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (contactState || commandHistory.length === 0) return

      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIdx)
      setInputVal(commandHistory[nextIdx])
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (contactState || commandHistory.length === 0) return

      if (historyIndex === -1) return
      const nextIdx = historyIndex + 1
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(-1)
        setInputVal('')
      } else {
        setHistoryIndex(nextIdx)
        setInputVal(commandHistory[nextIdx])
      }
    }

    // Ctrl + C to cancel current line
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault()
      const lineId = Date.now().toString()
      const promptPath = currentPath === '/' ? '~' : `~${currentPath}`
      setLogs((prev) => [
        ...prev,
        {
          id: `cancel-${lineId}`,
          type: 'input',
          content: (
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-0 h-5 opacity-50">
                <span className="text-indigo-400/50 mr-1 select-none">╭─</span>
                <span className="bg-[#4f46e5]/50 text-white px-2 py-0.5 font-bold flex items-center gap-1 h-5 text-[10px] rounded-l">
                  <span>💻</span>
                  <span>guest@portfolio</span>
                </span>
                <Chevron fromColor="rgba(79, 70, 229, 0.5)" toColor="rgba(59, 130, 246, 0.5)" />
                
                <span className="bg-[#3b82f6]/50 text-white px-2 py-0.5 font-bold flex items-center gap-1 h-5 text-[10px]">
                  <span>📁</span>
                  <span>{promptPath}</span>
                </span>
                <Chevron fromColor="rgba(59, 130, 246, 0.5)" toColor="rgba(16, 185, 129, 0.5)" />

                <span className="bg-[#10b981]/50 text-black px-2 py-0.5 font-bold flex items-center gap-1 h-5 text-[10px] rounded-r">
                  <span>🌿</span>
                  <span>main</span>
                </span>
                <Chevron fromColor="rgba(16, 185, 129, 0.5)" toColor="transparent" />
              </div>
              <div className="flex items-center gap-1.5 pl-0.5">
                <span className="text-indigo-400 select-none opacity-50">╰─ ❯</span>
                <span className="text-[var(--text-primary)] opacity-50">{inputVal}^C</span>
              </div>
            </div>
          )
        }
      ])
      setInputVal('')
      setHistoryIndex(-1)
      if (contactState) {
        setLogs((prev) => [...prev, { id: `contact-cancel-${lineId}`, type: 'error', content: 'Contact flow terminated.' }])
        setContactState(null)
      }
    }
  }

  // Handle Sidebar File Clicks
  const handleSidebarFileClick = (filePath: string) => {
    if (isBooting || activeGame) return
    if (filePath.endsWith('send_message.sh')) {
      executeCommand('./contact/send_message.sh')
    } else {
      executeCommand(`cat ${filePath}`)
    }
  }

  const toggleDirectory = (dirName: string) => {
    setExpandedDirs((prev) => ({
      ...prev,
      [dirName]: !prev[dirName]
    }))
  }

  // Latency calculation
  const [latency, setLatency] = useState(15)
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 20) + 8)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Render Sidebar Tree view
  const renderSidebarTree = () => {
    const vfs = getVFS(data)
    
    return (
      <div className="space-y-1 px-3">
        {Object.keys(vfs).map((key) => {
          const item = vfs[key]
          if (item.type === 'file') {
            return (
              <div 
                key={key} 
                onClick={() => handleSidebarFileClick(key)}
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-indigo-500/10 hover:text-indigo-300 cursor-pointer transition-colors text-xs"
              >
                <span className="opacity-70">📄</span>
                <span className="truncate">{key}</span>
              </div>
            )
          } else {
            const subItems = item.children || {}
            const isOpen = expandedDirs[key]
            
            return (
              <div key={key} className="space-y-0.5">
                <div 
                  onClick={() => toggleDirectory(key)}
                  className="flex items-center justify-between px-2 py-1 rounded hover:bg-indigo-500/5 hover:text-indigo-300 cursor-pointer select-none font-bold text-indigo-400 text-xs"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span>{isOpen ? '📂' : '📁'}</span>
                    <span className="truncate">{key}</span>
                  </div>
                  <span className="text-xs opacity-50">{isOpen ? '▼' : '▶'}</span>
                </div>
                
                {isOpen && (
                  <div className="pl-3 border-l border-indigo-500/10 ml-3.5 space-y-0.5">
                    {Object.keys(subItems).map((subKey) => {
                      const isExecutable = subKey.endsWith('.sh')
                      return (
                        <div 
                          key={subKey} 
                          onClick={() => handleSidebarFileClick(`${key}/${subKey}`)}
                          className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-indigo-500/10 hover:text-indigo-300 cursor-pointer transition-colors text-xs"
                        >
                          <span className={isExecutable ? 'text-green-400' : 'opacity-70'}>
                            {isExecutable ? '⚡' : '📄'}
                          </span>
                          <span className="truncate">{subKey}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }
        })}
      </div>
    )
  }

  return (
    <div 
      ref={terminalRef}
      className="relative w-full h-full flex flex-col overflow-hidden terminal-window crt-container"
      onClick={focusInput}
      style={{ 
        '--terminal-font-scale': fontScale,
        '--text-xs': `${0.75 * fontScale}rem`,
        '--text-sm': `${0.875 * fontScale}rem`,
        '--text-base': `${1.0 * fontScale}rem`,
        '--text-lg': `${1.125 * fontScale}rem`,
        '--text-xl': `${1.25 * fontScale}rem`,
        '--text-2xl': `${1.5 * fontScale}rem`,
      } as React.CSSProperties}
    >
      {/* Terminal Window Header Bar */}
      <div 
        className="flex items-center justify-between px-4 py-3 border-b border-[var(--card-border)] bg-black/40 select-none z-30"
        style={{ 
          '--terminal-font-scale': 1,
          '--text-xs': '0.75rem',
          '--text-sm': '0.875rem',
          '--text-base': '1rem'
        } as React.CSSProperties}
      >
        <div className="flex items-center gap-2">
          {/* OS Window Dot Controls */}
          <button 
            id="btn-close"
            onClick={() => setMode('gui')} 
            className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer hover:opacity-85 transition-opacity" 
            title="Exit to GUI (gui)" 
          />
          <button
            id="btn-matrix"
            onClick={() => setMatrixActive(true)} 
            className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer hover:opacity-85 transition-opacity" 
            title="Run Code Rain (matrix)" 
          />
          
          {/* Explorer Toggle Button */}
          <button 
            id="sidebar-toggle-btn"
            onClick={(e) => {
              e.stopPropagation()
              setIsSidebarOpen(prev => !prev)
            }}
            className="ml-3 py-1 px-2.5 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-xs font-mono flex items-center gap-1 text-[var(--text-secondary)] hover:text-white cursor-pointer transition-colors"
            title="Toggle Explorer Sidebar"
          >
            <span>📂</span>
            <span className="hidden sm:inline">Explorer</span>
          </button>
        </div>
        
        {/* Right Header Status Info */}
        <div className="flex gap-2 items-center">
          {/* Zoom Adjuster Button Segment */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded overflow-hidden mr-1">
            <button
              id="zoom-out-btn"
              onClick={(e) => {
                e.stopPropagation()
                setFontScale(s => Math.max(0.7, s - 0.1))
              }}
              className="px-2.5 py-1 hover:bg-white/10 text-xs font-mono text-[var(--text-secondary)] hover:text-white border-r border-white/10 cursor-pointer transition-colors"
              title="Zoom Out (A-)"
            >
              A-
            </button>
            <button
              id="zoom-reset-btn"
              onClick={(e) => {
                e.stopPropagation()
                const width = window.innerWidth
                if (width > 2560) setFontScale(1.4)
                else if (width > 1920) setFontScale(1.2)
                else setFontScale(1.0)
              }}
              className="px-3 py-1 hover:bg-white/10 text-xs font-mono text-[var(--text-secondary)] hover:text-white border-r border-white/10 cursor-pointer transition-colors"
              title="Reset Zoom"
            >
              {Math.round(fontScale * 100)}%
            </button>
            <button
              id="zoom-in-btn"
              onClick={(e) => {
                e.stopPropagation()
                setFontScale(s => Math.min(2.0, s + 0.1))
              }}
              className="px-2.5 py-1 hover:bg-white/10 text-xs font-mono text-[var(--text-secondary)] hover:text-white cursor-pointer transition-colors"
              title="Zoom In (A+)"
            >
              A+
            </button>
          </div>

          <span className="text-xs font-mono text-indigo-400 bg-indigo-950/30 border border-indigo-500/20 px-2 py-0.5 rounded hidden sm:inline">
            SHELL: ZSH (oh-my-zsh)
          </span>
          <span className="text-xs font-mono text-purple-400 bg-purple-950/30 border border-purple-500/20 px-2 py-0.5 rounded">
            THEME: P10K
          </span>
          {/* Prominent switch to GUI Mode button */}
          <button 
            id="gui-mode-btn"
            onClick={() => setMode('gui')} 
            className="px-3 py-1 text-xs font-bold rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white cursor-pointer transition-all shadow-md flex items-center gap-1 ml-1"
          >
            <span>✨</span>
            <span>GUI Mode</span>
          </button>
        </div>
      </div>

      {/* Main Split Area (Sidebar + Terminal Buffer) */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* Left Side: VS Code style File Explorer Sidebar */}
        <div className={`w-52 border-r border-[var(--card-border)] bg-black/40 flex-col select-none transition-all duration-300 z-20 ${isSidebarOpen ? 'flex' : 'hidden'}`}>
          <div className="px-3 py-1.5 text-[9px] uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--card-border)] flex justify-between items-center bg-black/20 font-mono font-bold">
            <span>Explorer</span>
            <span>VFS</span>
          </div>
          <div className="flex-1 overflow-y-auto py-2 font-mono">
            {renderSidebarTree()}
          </div>
        </div>

        {/* Right Side: Shell Display screen */}
        <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
          <div className="flex-1 overflow-y-auto px-5 py-4 font-mono text-sm leading-relaxed space-y-2 z-20 select-text">
            {/* Render History Log */}
            {logs.map((log) => {
              if (log.type === 'input') {
                return (
                  <div key={log.id} className="text-[var(--text-primary)] font-semibold select-text">
                    {log.content}
                  </div>
                )
              }
              if (log.type === 'system') {
                return (
                  <div key={log.id} className="text-[var(--text-secondary)] opacity-80 whitespace-pre-wrap select-text">
                    {log.content}
                  </div>
                )
              }
              if (log.type === 'error') {
                return (
                  <div key={log.id} className="text-red-500 font-bold whitespace-pre-wrap select-text">
                    {log.content}
                  </div>
                )
              }
              return (
                <div key={log.id} className="text-[var(--text-primary)] whitespace-pre-wrap select-text">
                  {log.content}
                </div>
              )
            })}

            {/* System Boot loader / Normal command line input */}
            {!isBooting && !activeGame && (
              <form onSubmit={handleCommandSubmit} className="flex flex-col gap-1.5 pt-1">
                {contactState ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[var(--accent-primary)] font-bold">contact-flow ?</span>
                    <div className="flex-1 flex items-center relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent border-none outline-none caret-transparent text-[var(--text-primary)] font-mono text-sm"
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck="false"
                      />
                      <span 
                        className="absolute bg-[var(--accent-primary)] cursor-blink pointer-events-none"
                        style={{
                          width: `${10 * fontScale}px`,
                          height: `${16 * fontScale}px`,
                          left: `${inputVal.length * 8.4 * fontScale}px`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {/* Row 1: Segments */}
                    <div className="flex items-center gap-0 h-5">
                      <span className="text-indigo-400/50 mr-1 select-none">╭─</span>
                      <span className="bg-[#4f46e5] text-white px-2 py-0.5 font-bold flex items-center gap-1 h-5 text-xs rounded-l">
                        <span>💻</span>
                        <span>guest@portfolio</span>
                      </span>
                      <Chevron fromColor="#4f46e5" toColor="#3b82f6" />
                      
                      <span className="bg-[#3b82f6] text-white px-2 py-0.5 font-bold flex items-center gap-1 h-5 text-xs">
                        <span>📁</span>
                        <span>{currentPath === '/' ? '~' : `~${currentPath}`}</span>
                      </span>
                      <Chevron fromColor="#3b82f6" toColor="#10b981" />

                      <span className="bg-[#10b981] text-black px-2 py-0.5 font-bold flex items-center gap-1 h-5 text-xs rounded-r">
                        <span>🌿</span>
                        <span>main</span>
                      </span>
                      <Chevron fromColor="#10b981" toColor="transparent" />
                    </div>

                    {/* Row 2: Prompt symbol and input */}
                    <div className="flex items-center gap-1.5 pl-0.5">
                      <span className="text-indigo-400 select-none">╰─ ❯</span>
                      <div className="flex-1 flex items-center relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputVal}
                          onChange={(e) => setInputVal(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="w-full bg-transparent border-none outline-none caret-transparent text-[var(--text-primary)] font-mono text-sm"
                          autoComplete="off"
                          autoCapitalize="off"
                          autoCorrect="off"
                          spellCheck="false"
                        />
                        <span 
                          className="absolute bg-[var(--accent-primary)] cursor-blink pointer-events-none"
                          style={{
                            width: `${10 * fontScale}px`,
                            height: `${16 * fontScale}px`,
                            left: `${inputVal.length * 8.4 * fontScale}px`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </form>
            )}

            <div ref={logsEndRef} />
          </div>
        </div>
      </div>

      {/* Quick click command shortcut badges (Anchored above footer) */}
      {!isBooting && !activeGame && !contactState && (
        <div className="flex flex-wrap items-center gap-2 px-5 py-2.5 border-t border-[var(--card-border)] bg-black/35 text-xs font-mono select-none z-30">
          <span className="text-[var(--text-secondary)] font-bold">Quick Run:</span>
          {['help', 'about', 'projects', 'skills', 'certifications', 'contact', 'matrix', 'clear'].map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => executeCommand(cmd)}
              className="px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:text-white cursor-pointer transition-all"
            >
              {cmd}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Input Helper Keyboard Pad */}
      {!isBooting && !activeGame && (
        <div className="flex sm:hidden border-t border-[var(--card-border)] bg-black/40 px-3 py-2 justify-between items-center gap-2 z-30 select-none">
          <button 
            type="button" 
            onClick={() => {
              const fakeEvent = {
                key: 'Tab',
                preventDefault: () => {},
                ctrlKey: false
              } as any
              handleKeyDown(fakeEvent)
            }}
            className="flex-1 py-1.5 bg-white/5 border border-white/10 rounded font-mono text-xs text-[var(--text-primary)] hover:bg-white/10"
          >
            Tab
          </button>
          <button 
            type="button" 
            onClick={() => {
              const fakeEvent = {
                key: 'ArrowUp',
                preventDefault: () => {},
                ctrlKey: false
              } as any
              handleKeyDown(fakeEvent)
            }}
            className="flex-1 py-1.5 bg-white/5 border border-white/10 rounded font-mono text-xs text-[var(--text-primary)] hover:bg-white/10"
          >
            ▲
          </button>
          <button 
            type="button" 
            onClick={() => {
              const fakeEvent = {
                key: 'ArrowDown',
                preventDefault: () => {},
                ctrlKey: false
              } as any
              handleKeyDown(fakeEvent)
            }}
            className="flex-1 py-1.5 bg-white/5 border border-white/10 rounded font-mono text-xs text-[var(--text-primary)] hover:bg-white/10"
          >
            ▼
          </button>
          <button 
            type="button" 
            onClick={() => setLogs([])}
            className="flex-1 py-1.5 bg-white/5 border border-white/10 rounded font-mono text-xs text-[var(--text-primary)] hover:bg-white/10"
          >
            Clear
          </button>
          <button 
            type="button" 
            onClick={() => setMode('gui')}
            className="flex-1 py-1.5 bg-[var(--accent-primary)] text-black font-bold rounded font-mono text-xs hover:opacity-90"
          >
            GUI
          </button>
        </div>
      )}

      {/* Render Canvas Overlay Screens */}
      {matrixActive && (
        <MatrixRain onClose={() => setMatrixActive(false)} />
      )}

      {activeGame === 'snake' && (
        <SnakeGame onClose={() => setActiveGame(null)} />
      )}

      {activeGame === 'typing' && (
        <TypingGame onClose={() => setActiveGame(null)} />
      )}

      {activeGame === 'panic' && (
        <div className="absolute inset-0 bg-red-950/20 text-red-500 z-40 p-10 font-mono text-base space-y-4 animate-pulse overflow-hidden bg-black">
          <div className="font-bold text-2xl border-b-2 border-red-500 pb-2 text-center">!!! SYSTEM KERNEL PANIC !!!</div>
          <div className="text-sm">CRITICAL EXCEPTION: Segment Violation at address 0x00A381BC</div>
          <div className="text-sm">Stack Trace:</div>
          <pre className="text-xs text-red-400 max-h-40 overflow-hidden leading-tight">
{`at kernel.c:482 [pagefault_handler]
at shell.c:120 [execute_rm_rf]
at main.c:38 [boot_sequence]
dumping memory:
0x0010: FF AA BC E2 01 02 A0 0F
0x0020: 38 12 90 A2 CE F0 D1 00
0x0030: AB CD EF 01 23 45 67 89
0x0040: FA BF EE 11 00 23 FF 9A
[DANGER] FILESYSTEM DELETED...
SYS_REBOOT_TIMER = 3s`}
          </pre>
          <div className="text-center font-bold text-sm text-red-500 mt-4 animate-bounce">
            REBOOT SEQUENCE RETRY IN PROGRESS...
          </div>
        </div>
      )}
    </div>
  )
}
