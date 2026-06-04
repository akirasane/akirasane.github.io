import React from 'react'
import type { PortfolioData } from '@/lib/types'

export interface Command {
  name: string
  description: string
  usage?: string
  execute: (
    args: string[],
    data: PortfolioData,
    actions: {
      setTheme: (theme: string) => void
      clearHistory: () => void
      setMode: (mode: 'terminal' | 'gui') => void
      startMatrix: () => void
      startGame: (game: 'snake' | 'typing') => void
      startContactFlow: () => void
      toggleCrt: () => void
      historyList: string[]
      currentPath: string
      setCurrentPath: (path: string) => void
    }
  ) => React.ReactNode
}

// ==========================================
// Virtual File System (VFS) Types & Helpers
// ==========================================

export interface VFSNode {
  type: 'file' | 'dir'
  content?: string | React.ReactNode
  children?: Record<string, VFSNode>
}

// ==========================================
// Rich VFS Renderers — beautiful cat output
// ==========================================

const renderWelcomeTxt = (name: string) => (
  <div className="py-3 px-4 font-mono max-w-2xl border border-indigo-500/30 rounded-lg bg-indigo-950/20 space-y-3">
    <div className="flex items-center gap-2 border-b border-indigo-500/20 pb-2">
      <span className="text-2xl">👾</span>
      <span className="text-base font-bold text-indigo-300 tracking-wide">WELCOME TO THE SHELL</span>
    </div>
    <p className="text-sm text-[var(--text-primary)] leading-relaxed">
      You have connected to <span className="text-indigo-300 font-bold">{name}</span>'s Interactive Portfolio Terminal.
    </p>
    <div className="text-xs text-[var(--text-secondary)] space-y-1 pt-1 border-t border-indigo-500/10">
      <div className="flex gap-2"><span className="text-indigo-400">$</span><span>Type <code className="text-indigo-300 bg-indigo-950/40 px-1 rounded">help</code> to see all commands</span></div>
      <div className="flex gap-2"><span className="text-indigo-400">$</span><span>Use <code className="text-indigo-300 bg-indigo-950/40 px-1 rounded">ls</code>, <code className="text-indigo-300 bg-indigo-950/40 px-1 rounded">cd</code>, <code className="text-indigo-300 bg-indigo-950/40 px-1 rounded">cat</code> to explore the filesystem</span></div>
      <div className="flex gap-2"><span className="text-indigo-400">$</span><span>Try <code className="text-indigo-300 bg-indigo-950/40 px-1 rounded">neofetch</code> or <code className="text-indigo-300 bg-indigo-950/40 px-1 rounded">play snake</code> for fun</span></div>
    </div>
  </div>
)

const renderBioTxt = (profile: PortfolioData['profile']) => (
  <div className="py-3 px-4 font-mono max-w-2xl border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] space-y-4">
    {/* Header */}
    <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg select-none">
        {profile.name.charAt(0).toUpperCase()}
      </div>
      <div>
        <div className="text-base font-bold text-[var(--accent-primary)]">{profile.name}</div>
        <div className="text-xs text-[var(--text-secondary)] font-medium">{profile.title}</div>
      </div>
      <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-bold">● ONLINE</span>
    </div>
    {/* Bio */}
    <div className="space-y-1">
      <div className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-bold">About</div>
      <p className="text-sm text-[var(--text-primary)] leading-relaxed">{profile.bio}</p>
    </div>
  </div>
)

const renderSocialTxt = (social: PortfolioData['profile']['social']) => {
  const links = [
    { label: 'GitHub', icon: '🐙', value: social.github, href: social.github },
    { label: 'LinkedIn', icon: '💼', value: social.linkedin, href: social.linkedin },
    { label: 'Website', icon: '🌐', value: social.website, href: social.website },
    { label: 'Email', icon: '✉️', value: social.email, href: social.email ? `mailto:${social.email}` : undefined },
    { label: 'Twitter', icon: '🐦', value: (social as any).twitter, href: (social as any).twitter },
  ].filter(l => l.value)

  return (
    <div className="py-3 px-4 font-mono max-w-2xl border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] space-y-3">
      <div className="flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
        <span>🔗</span>
        <span className="text-sm font-bold text-[var(--accent-primary)] tracking-wide uppercase">Social Links</span>
      </div>
      <div className="space-y-2">
        {links.map(({ label, icon, value, href }) => (
          <div key={label} className="flex items-center gap-3 group">
            <span className="text-base w-5 text-center">{icon}</span>
            <span className="text-xs text-[var(--text-secondary)] w-16 font-bold uppercase tracking-wider">{label}</span>
            <span className="text-indigo-500/40 select-none">│</span>
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer"
                className="text-sm text-indigo-300 hover:text-indigo-100 underline underline-offset-2 transition-colors truncate">
                {value}
              </a>
            ) : (
              <span className="text-sm text-[var(--text-secondary)]">{value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const renderProjectTxt = (p: PortfolioData['projects'][0]) => (
  <div className="py-3 px-4 font-mono max-w-2xl border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] space-y-3">
    {/* Title bar */}
    <div className="flex items-start justify-between gap-3 border-b border-[var(--card-border)] pb-2">
      <div>
        <div className="text-base font-bold text-[var(--accent-primary)]">{p.title}</div>
        <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mt-0.5">Project</div>
      </div>
      {p.link && (
        <a href={p.link} target="_blank" rel="noopener noreferrer"
          className="shrink-0 text-[10px] px-2.5 py-1 rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-colors font-bold">
          OPEN ↗
        </a>
      )}
    </div>
    {/* Description */}
    <p className="text-sm text-[var(--text-primary)] leading-relaxed">{p.description}</p>
    {/* Tags */}
    <div className="space-y-1.5">
      <div className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-bold">Tech Stack</div>
      <div className="flex flex-wrap gap-1.5">
        {p.tags.map(tag => (
          <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--accent-secondary)]/15 border border-[var(--card-border)] text-[var(--accent-primary)] font-mono">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
)

const renderSkillCategoryTxt = (c: PortfolioData['skills'][0]) => {
  const totalBlocks = 16
  return (
    <div className="py-3 px-4 font-mono max-w-2xl border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] space-y-3">
      <div className="flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
        <span className="text-sm font-bold text-[var(--accent-primary)] uppercase tracking-wider">{c.category}</span>
        <span className="text-[10px] text-[var(--text-secondary)] ml-auto">{c.items.length} skills</span>
      </div>
      <div className="space-y-2.5">
        {c.items.map(item => {
          const filled = Math.round((item.proficiency / 100) * totalBlocks)
          const empty = totalBlocks - filled
          return (
            <div key={item.id} className="space-y-0.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-primary)] font-medium">{item.name}</span>
                <span className="text-[var(--text-secondary)] opacity-60 text-[10px]">{item.years}y exp</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-secondary)] text-xs select-none">[</span>
                <span className="text-[var(--accent-primary)] text-xs tracking-tighter leading-none">{'█'.repeat(filled)}</span>
                <span className="text-[var(--text-secondary)] opacity-25 text-xs tracking-tighter leading-none">{'░'.repeat(empty)}</span>
                <span className="text-[var(--text-secondary)] text-xs select-none">]</span>
                <span className="text-[var(--accent-primary)] text-xs font-bold ml-1">{item.proficiency}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const renderContactLinksTxt = (social: PortfolioData['profile']['social']) => (
  <div className="py-3 px-4 font-mono max-w-xl border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] space-y-3">
    <div className="flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
      <span>📬</span>
      <span className="text-sm font-bold text-[var(--accent-primary)] uppercase tracking-wider">Contact</span>
    </div>
    {social.email && (
      <div className="flex items-center gap-3">
        <span>✉️</span>
        <a href={`mailto:${social.email}`} className="text-sm text-indigo-300 hover:text-indigo-100 underline underline-offset-2 transition-colors">
          {social.email}
        </a>
      </div>
    )}
    <div className="pt-1 border-t border-[var(--card-border)] text-xs text-[var(--text-secondary)] space-y-1">
      <div>Run <code className="text-indigo-300 bg-indigo-950/40 px-1 rounded">contact</code> to open the interactive message form</div>
      <div>Or execute <code className="text-indigo-300 bg-indigo-950/40 px-1 rounded">./contact/send_message.sh</code></div>
    </div>
  </div>
)

const renderReadmeTxt = (dirName: string, hint: string) => (
  <div className="py-3 px-4 font-mono max-w-xl border border-yellow-500/20 rounded-lg bg-yellow-950/10 space-y-2">
    <div className="flex items-center gap-2 border-b border-yellow-500/15 pb-2">
      <span>📋</span>
      <span className="text-sm font-bold text-yellow-400 uppercase tracking-wider">README</span>
      <span className="text-[10px] text-yellow-600 ml-1">/{dirName}</span>
    </div>
    <p className="text-sm text-[var(--text-primary)] leading-relaxed">{hint}</p>
  </div>
)

// Generate the virtual filesystem tree from portfolio data
export const getVFS = (data: PortfolioData): Record<string, VFSNode> => {
  const projFiles: Record<string, VFSNode> = {}
  data.projects.forEach((p) => {
    const filename = p.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.txt'
    projFiles[filename] = {
      type: 'file',
      content: renderProjectTxt(p)
    }
  })

  const skillFiles: Record<string, VFSNode> = {}
  data.skills.forEach((c) => {
    const filename = c.category.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.txt'
    skillFiles[filename] = {
      type: 'file',
      content: renderSkillCategoryTxt(c)
    }
  })

  return {
    'welcome.txt': {
      type: 'file',
      content: renderWelcomeTxt(data.profile.name)
    },
    'about': {
      type: 'dir',
      children: {
        'bio.txt': {
          type: 'file',
          content: renderBioTxt(data.profile)
        },
        'social.txt': {
          type: 'file',
          content: renderSocialTxt(data.profile.social)
        }
      }
    },
    'projects': {
      type: 'dir',
      children: {
        ...projFiles,
        'readme.txt': {
          type: 'file',
          content: renderReadmeTxt('projects', 'This directory lists personal projects. Use `cat <project_name>.txt` to read about a specific one.')
        }
      }
    },
    'skills': {
      type: 'dir',
      children: {
        ...skillFiles,
        'summary.txt': {
          type: 'file',
          content: renderReadmeTxt('skills', 'Proficiency ratings in different tech stacks. Open any .txt file to see skill bars.')
        }
      }
    },
    'contact': {
      type: 'dir',
      children: {
        'links.txt': {
          type: 'file',
          content: renderContactLinksTxt(data.profile.social)
        },
        'send_message.sh': {
          type: 'file',
          content: (
            <div className="py-2 px-3 font-mono max-w-sm border border-green-500/20 rounded bg-green-950/10 space-y-1 text-xs">
              <div className="text-green-400 font-bold border-b border-green-500/15 pb-1 mb-2">⚡ send_message.sh</div>
              <div className="text-[var(--text-secondary)]">{'#!/bin/bash'}</div>
              <div className="text-[var(--text-secondary)]">{'# Trigger interactive contact form'}</div>
              <div className="text-green-300">{'contact'}</div>
            </div>
          )
        }
      }
    },
    'secret': {
      type: 'dir',
      children: {
        'flag.txt': {
          type: 'file',
          content: `CONGRATS! You found the secret flag: FLAG{4NT1GR4V1TY_R3TR0_K3RN3L}\nTry running 'sudo rm -rf /' to test system resilience!`
        }
      }
    }
  }
}

// Path resolver to navigate VFS nodes
export const resolvePath = (
  vfs: Record<string, VFSNode>,
  currentPath: string,
  targetPath: string
): { node: VFSNode | null; path: string; error?: string } => {
  let pathParts = currentPath.split('/').filter(Boolean)
  
  if (targetPath.startsWith('/')) {
    pathParts = targetPath.split('/').filter(Boolean)
  } else {
    const targetParts = targetPath.split('/')
    for (const part of targetParts) {
      if (part === '.' || part === '') continue
      if (part === '..') {
        pathParts.pop()
      } else {
        pathParts.push(part)
      }
    }
  }

  let current: VFSNode = { type: 'dir', children: vfs }
  for (const part of pathParts) {
    if (current.type !== 'dir' || !current.children) {
      return { node: null, path: '', error: 'Not a directory' }
    }
    const nextNode = current.children[part]
    if (!nextNode) {
      return { node: null, path: '', error: `No such file or directory: ${part}` }
    }
    current = nextNode
  }

  const finalPath = '/' + pathParts.join('/')
  return { node: current, path: finalPath }
}

// Helper to render progress bars for skills
const renderProgressBar = (percentage: number, color: string) => {
  const totalBlocks = 20
  const filledBlocks = Math.round((percentage / 100) * totalBlocks)
  const emptyBlocks = totalBlocks - filledBlocks
  
  const filledChar = '█'
  const emptyChar = '░'
  
  return (
    <span className="font-mono text-sm tracking-widest">
      <span style={{ color: 'var(--text-primary)' }}>[</span>
      <span style={{ color: 'var(--accent-primary)' }}>{filledChar.repeat(filledBlocks)}</span>
      <span style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>{emptyChar.repeat(emptyBlocks)}</span>
      <span style={{ color: 'var(--text-primary)' }}>]</span>
      <span className="ml-2 font-bold" style={{ color: 'var(--accent-primary)' }}>{percentage}%</span>
    </span>
  )
}

const playBeep = (freq: number, duration: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle' = 'sine', volume = 0.05) => {
  if (typeof window === 'undefined') return
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioContextClass) return
  try {
    const ctx = new AudioContextClass()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = type
    osc.frequency.value = freq
    
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch (e) {
    // Ignore audio policies
  }
}

const HexStream = () => {
  const [lines, setLines] = React.useState<string[]>([])
  
  React.useEffect(() => {
    const generateLine = () => {
      const addr = (Math.floor(Math.random() * 0xFFFFFFFFFF) + 0x7FFF000000).toString(16).toUpperCase()
      const bytes = Array.from({ length: 8 }, () => 
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
      ).join(' ')
      return `0x${addr}  ${bytes}`
    }
    
    setLines(Array.from({ length: 7 }, generateLine))
    
    const interval = setInterval(() => {
      setLines(prev => {
        const next = [...prev.slice(1), generateLine()]
        return next
      })
    }, 120)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="font-mono text-[9px] text-green-500/40 overflow-hidden h-full flex flex-col justify-end select-none leading-normal border-l border-green-500/20 pl-3">
      {lines.map((line, idx) => (
        <div key={idx} className="whitespace-nowrap">{line}</div>
      ))}
    </div>
  )
}

interface SecretFlagOutputProps {
  actions?: {
    startGame?: (game: any) => void
    [key: string]: any
  }
}

const SecretFlagOutput = ({ actions }: SecretFlagOutputProps) => {
  const [stage, setStage] = React.useState<'hacking' | 'glitch' | 'success'>('hacking')
  const [hackingLines, setHackingLines] = React.useState<string[]>([])
  const [progress, setProgress] = React.useState(0)
  const [copied, setCopied] = React.useState(false)

  const steps = [
    { text: '>> [INIT] Initializing port scan on mainframe core...', pct: 15 },
    { text: '>> [SCAN] Port 443 open. Bypassing sentinel load balancers...', pct: 30 },
    { text: '>> [EXPLOIT] Tunneling remote stack buffer overflow...', pct: 45 },
    { text: '>> [OVERFLOW] Executing shellcode payload injection...', pct: 60 },
    { text: '>> [BYPASS] Encryption key ring located: [1024-bit RSA]...', pct: 75 },
    { text: '>> [DECRYPT] Decrypted flag.txt block with secret key...', pct: 90 },
    { text: '>> [SUCCESS] Database breached. Access tokens unlocked.', pct: 100 }
  ]

  React.useEffect(() => {
    let currentStep = 0
    let timeoutId: NodeJS.Timeout | undefined
    let isMounted = true

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep]
        if (isMounted) {
          setHackingLines(prev => [...prev, step.text])
          setProgress(step.pct)
        }
        playBeep(1200, 0.05, 'sine', 0.01)
        currentStep++
      } else {
        clearInterval(interval)
        if (isMounted) {
          setStage('glitch')
        }
        playBeep(180, 0.25, 'sawtooth', 0.03)

        timeoutId = setTimeout(() => {
          if (isMounted) {
            setStage('success')
            playBeep(650, 0.08, 'sine', 0.03)
            setTimeout(() => {
              if (isMounted) playBeep(1300, 0.12, 'sine', 0.03)
            }, 70)
          }
        }, 500)
      }
    }, 400)

    return () => {
      isMounted = false
      clearInterval(interval)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText('FLAG{4NT1GR4V1TY_R3TR0_K3RN3L}')
    setCopied(true)
    playBeep(1500, 0.05, 'sine', 0.02)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReboot = () => {
    if (actions && actions.startGame) {
      actions.startGame('panic')
    }
  }

  if (stage === 'hacking') {
    const totalBlocks = 15
    const filledBlocks = Math.round((progress / 100) * totalBlocks)
    const emptyBlocks = totalBlocks - filledBlocks
    
    return (
      <div className="py-3 px-4 my-2 border border-green-500/30 rounded bg-black/95 max-w-2xl font-mono text-xs text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)] relative overflow-hidden select-none">
        <div className="flex items-center justify-between border-b border-green-500/20 pb-1.5 mb-2.5">
          <div className="flex items-center gap-2 font-bold text-[11px]">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <span>INFILTRATING MAINFRAME OS CORE...</span>
          </div>
          <span className="text-[10px] opacity-75 font-semibold">{progress}%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 min-h-[140px]">
          {/* Logs */}
          <div className="md:col-span-3 space-y-1 font-mono text-[11px] flex flex-col justify-end">
            {hackingLines.map((line, idx) => (
              <div key={idx} className="flex gap-1.5 items-start">
                <span className="text-green-500/60">&gt;</span>
                <span className="whitespace-pre-wrap">{line}</span>
              </div>
            ))}
          </div>
          
          {/* Hex Stream */}
          <div className="md:col-span-2 hidden md:block">
            <HexStream />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 border-t border-green-500/10 pt-2 mt-2.5 font-bold">
          <span>PROGRESS:</span>
          <span>[</span>
          <span className="text-green-400">{'█'.repeat(filledBlocks)}</span>
          <span className="text-green-950">{'░'.repeat(emptyBlocks)}</span>
          <span>]</span>
        </div>
      </div>
    )
  }

  if (stage === 'glitch') {
    return (
      <div className="py-8 px-4 my-2 border border-red-500/40 rounded bg-red-950/20 max-w-xl font-mono text-center text-red-500 animate-pulse relative overflow-hidden select-none">
        <div className="text-xl font-extrabold tracking-widest uppercase mb-2">SYSTEM BREACH DETECTED</div>
        <div className="text-[10px] text-red-400/80 leading-relaxed font-mono">
          {Array.from({ length: 4 }, () => 
            Math.random().toString(36).substring(2, 15).toUpperCase()
          ).join(' :: ')}
        </div>
      </div>
    )
  }

  // stage === 'success'
  return (
    <div className="py-4 px-5 my-2 border border-amber-500/40 rounded bg-black/95 max-w-2xl font-mono relative overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.2)]">
      {/* Amber Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.02)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none" />
      
      <div className="flex items-center gap-3 border-b border-amber-500/30 pb-2.5 mb-3 select-none">
        <span className="text-2xl animate-bounce">🔓</span>
        <div>
          <div className="text-amber-400 font-bold text-xs tracking-wider uppercase flex items-center gap-1.5">
            <span>ROOT DECRYPTOR CORE ACTIVE</span>
            <span className="text-[9px] bg-green-500/20 text-green-400 px-1 py-0.5 rounded font-bold uppercase tracking-widest border border-green-500/30">
              HACK SUCCESS
            </span>
          </div>
          <div className="text-[10px] text-amber-500/70 font-semibold">
            STATUS: SANDBOX ESCAPE COMPLETE
          </div>
        </div>
      </div>

      <div className="space-y-3 relative z-10 text-xs">
        <p className="text-amber-100/90 leading-relaxed">
          Mainframe bypass succeeded. Sandbox restriction keys have been dumped, and memory sector flags decrypted.
        </p>

        {/* Glowing Flag Display Box */}
        <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded flex items-center justify-between my-3 relative overflow-hidden">
          <div className="flex-1">
            <div className="text-[9px] uppercase tracking-widest text-amber-500/60 mb-1 font-bold">
              Decrypted Flag Token
            </div>
            <code className="text-sm font-bold text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] select-all selection:bg-amber-500 selection:text-black">
              FLAG{"{"}4NT1GR4V1TY_R3TR0_K3RN3L{"}"}
            </code>
          </div>
          <button 
            onClick={handleCopy}
            className="px-3 py-1.5 rounded border border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-300 font-bold hover:bg-amber-500/20 cursor-pointer transition-colors active:scale-95"
          >
            {copied ? 'COPIED!' : 'COPY TOKEN'}
          </button>
        </div>

        <div className="flex flex-col gap-1 border-t border-amber-500/20 pt-3 text-[11px]">
          <div className="flex items-center gap-1.5 text-red-400 font-bold select-none">
            <span className="animate-ping w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
            <span>[CRITICAL ACCESS AUTHORIZED]</span>
          </div>
          <p className="text-amber-200/70">
            Administrative terminal control keys unlocked. Force system diagnostics reboot:
          </p>
          <code 
            onClick={handleReboot}
            className="bg-red-950/30 border border-red-500/30 text-red-400 px-2 py-1.5 rounded font-bold text-center mt-1 select-none cursor-pointer hover:bg-red-500/20 hover:border-red-500/50 transition-all"
            title="Execute System Wipe Reboot"
          >
            sudo rm -rf /
          </code>
        </div>
      </div>
    </div>
  )
}


// ==========================================
// Commands Registry Definition
// ==========================================

export const COMMANDS: Record<string, Command> = {
  help: {
    name: 'help',
    description: 'Displays a table of all available commands, descriptions, and syntax',
    execute: () => {
      return (
        <div className="py-2 font-mono">
          <div className="text-base font-bold mb-2 text-[var(--accent-primary)]">AVAILABLE COMMANDS</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border border-[var(--card-border)] p-3 rounded bg-[var(--card-bg)] max-w-3xl">
            {Object.keys(COMMANDS).sort().map((cmdKey) => {
              const cmd = COMMANDS[cmdKey]
              return (
                <div key={cmd.name} className="flex flex-col border-b border-[var(--card-border)] pb-2 md:border-none md:pb-0">
                  <span className="font-bold text-[var(--accent-primary)]">{cmd.name}</span>
                  <span className="text-xs text-[var(--text-secondary)]">{cmd.description}</span>
                  {cmd.usage && (
                    <span className="text-[10px] text-[var(--text-primary)] opacity-60 font-mono italic">
                      Usage: {cmd.usage}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-3 text-xs text-[var(--text-secondary)] italic">
            Tip: Use 'ls', 'cd', and 'cat' to navigate the file system just like a real Unix terminal!
          </div>
        </div>
      )
    }
  },

  about: {
    name: 'about',
    description: 'Prints an interactive developer bio, including a stylized ASCII portrait',
    execute: (args, data) => {
      const { profile } = data
      const asciiArt = `
      /\\_/\\
     ( o.o )
      > ^ <
     /     \\
    |       |
    `
      return (
        <div className="py-2 font-mono flex flex-col md:flex-row gap-6 items-start">
          <pre className="text-[var(--accent-primary)] text-sm leading-4 font-bold border border-[var(--card-border)] p-4 rounded bg-[var(--card-bg)]">
            {asciiArt}
          </pre>
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-xl font-bold text-[var(--accent-primary)]">{profile.name}</h2>
              <p className="text-sm font-semibold text-[var(--text-secondary)]">{profile.title}</p>
            </div>
            <p className="text-sm leading-relaxed max-w-xl text-[var(--text-primary)]">{profile.bio}</p>
            <div className="pt-2">
              <span className="font-bold text-[var(--accent-primary)]">Find me on:</span>
              <div className="flex flex-wrap gap-4 mt-1 text-sm">
                {profile.social.github && (
                  <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--accent-primary)]">
                    GitHub
                  </a>
                )}
                {profile.social.linkedin && (
                  <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--accent-primary)]">
                    LinkedIn
                  </a>
                )}
                {profile.social.website && (
                  <a href={profile.social.website} target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--accent-primary)]">
                    Website
                  </a>
                )}
                {profile.social.email && (
                  <span className="text-[var(--text-secondary)]">Email: {profile.social.email}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }
  },

  projects: {
    name: 'projects',
    description: 'Lists personal projects. Supports flags like --list, --tags <tech>, or project name',
    usage: 'projects [--list] [--tags <tech>] [<project_title>]',
    execute: (args, data) => {
      const { projects } = data

      if (args.includes('--list')) {
        return (
          <div className="py-2 font-mono max-w-3xl">
            <div className="text-base font-bold mb-2 text-[var(--accent-primary)]">PROJECTS COMPACT LIST</div>
            <table className="w-full text-left text-sm border-collapse border border-[var(--card-border)]">
              <thead>
                <tr className="border-b border-[var(--card-border)] bg-[var(--card-bg)]">
                  <th className="p-2 text-[var(--accent-primary)]">Project Title</th>
                  <th className="p-2 text-[var(--accent-primary)]">Technologies</th>
                  <th className="p-2 text-[var(--accent-primary)]">Link</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr key={proj.id} className="border-b border-[var(--card-border)] hover:bg-[var(--card-bg)]/50">
                    <td className="p-2 font-bold">{proj.title}</td>
                    <td className="p-2 text-xs text-[var(--text-secondary)]">{proj.tags.join(', ')}</td>
                    <td className="p-2">
                      {proj.link ? (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="underline text-[var(--accent-primary)]">
                          Visit
                        </a>
                      ) : (
                        <span className="opacity-50">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      // Filter by tag
      const tagIndex = args.indexOf('--tags')
      if (tagIndex !== -1 && args[tagIndex + 1]) {
        const targetTag = args[tagIndex + 1].toLowerCase()
        const filtered = projects.filter(proj => 
          proj.tags.some(tag => tag.toLowerCase().includes(targetTag))
        )

        if (filtered.length === 0) {
          return (
            <div className="py-2 font-mono text-[var(--text-secondary)]">
              No projects found matching tag: <span className="text-[var(--accent-primary)]">{args[tagIndex + 1]}</span>
            </div>
          )
        }

        return (
          <div className="py-2 font-mono space-y-4 max-w-3xl">
            <div className="text-base font-bold text-[var(--accent-primary)]">
              PROJECTS FILTERED BY TAG: {args[tagIndex + 1]}
            </div>
            {filtered.map(proj => (
              <div key={proj.id} className="border border-[var(--card-border)] p-4 rounded bg-[var(--card-bg)]">
                <h3 className="text-lg font-bold text-[var(--accent-primary)]">{proj.title}</h3>
                <p className="text-sm mt-1 leading-relaxed">{proj.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {proj.tags.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded bg-[var(--accent-secondary)]/20 border border-[var(--accent-secondary)]/40 text-[var(--accent-primary)]">
                      {t}
                    </span>
                  ))}
                </div>
                {proj.link && (
                  <div className="mt-3">
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="underline text-sm font-semibold hover:text-[var(--accent-primary)]">
                      View Project Code/Demo &rarr;
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }

      // Check if specific project requested
      const searchArgs = args.filter(a => !a.startsWith('-'))
      if (searchArgs.length > 0) {
        const query = searchArgs.join(' ').toLowerCase()
        const found = projects.find(p => p.title.toLowerCase().includes(query))

        if (found) {
          return (
            <div className="py-2 font-mono max-w-3xl border border-[var(--card-border)] p-4 rounded bg-[var(--card-bg)]">
              <h3 className="text-lg font-bold text-[var(--accent-primary)]">{found.title}</h3>
              <p className="text-sm mt-1 leading-relaxed">{found.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {found.tags.map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded bg-[var(--accent-secondary)]/20 border border-[var(--accent-secondary)]/40 text-[var(--accent-primary)]">
                    {t}
                  </span>
                ))}
              </div>
              {found.link && (
                <div className="mt-3">
                  <a href={found.link} target="_blank" rel="noopener noreferrer" className="underline text-sm font-semibold hover:text-[var(--accent-primary)]">
                    View Project Demo/Source &rarr;
                  </a>
                </div>
              )}
            </div>
          )
        }
      }

      // Default: List all projects detailed
      return (
        <div className="py-2 font-mono space-y-4 max-w-3xl">
          <div className="text-base font-bold text-[var(--accent-primary)]">MY PROJECTS</div>
          {projects.map((proj) => (
            <div key={proj.id} className="border border-[var(--card-border)] p-4 rounded bg-[var(--card-bg)]">
              <h3 className="text-lg font-bold text-[var(--accent-primary)]">{proj.title}</h3>
              <p className="text-sm mt-1 leading-relaxed text-[var(--text-primary)]">{proj.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {proj.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded bg-[var(--accent-secondary)]/10 border border-[var(--card-border)] text-[var(--accent-primary)]">
                    {t}
                  </span>
                ))}
              </div>
              {proj.link && (
                <div className="mt-3">
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="underline text-sm font-semibold hover:text-[var(--accent-primary)]">
                    Link &rarr;
                  </a>
                </div>
              )}
            </div>
          ))}
          <div className="text-xs text-[var(--text-secondary)] italic">
            Tip: Run `projects --list` for a compact view, or `projects --tags &lt;tech&gt;` to filter.
          </div>
        </div>
      )
    }
  },

  skills: {
    name: 'skills',
    description: 'Renders progress bars showcasing technology proficiencies',
    execute: (args, data) => {
      const { skills } = data
      return (
        <div className="py-2 font-mono max-w-3xl space-y-4">
          <div className="text-base font-bold text-[var(--accent-primary)]">PROFICIENCY SKILLS</div>
          {skills.map((category) => (
            <div key={category.id} className="space-y-2 border border-[var(--card-border)] p-3 rounded bg-[var(--card-bg)]">
              <h3 className="font-bold text-[var(--accent-primary)] text-sm uppercase">{category.category}</h3>
              <div className="space-y-2">
                {category.items.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                    <span className="text-sm font-medium min-w-[120px]">{item.name}</span>
                    <div className="flex items-center gap-2 flex-1 md:justify-end">
                      {renderProgressBar(item.proficiency, category.color)}
                      <span className="text-[10px] text-[var(--text-secondary)] opacity-60">({item.years}y experience)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }
  },

  neofetch: {
    name: 'neofetch',
    description: 'Displays system information with logo ASCII art',
    execute: (args, data) => {
      const { profile } = data
      const logo = `
   ________   _____ 
  /  ____/\\  /  ___\\
 /  / ___\\/ /  /__  
/  / /___  /  ___/  
\\  \\____/\\ \\  \\___  
 \\_______/  \\_____\\ 
      `
      return (
        <div className="py-2 font-mono flex flex-col md:flex-row gap-6 items-center md:items-start text-sm">
          <pre className="text-[var(--accent-primary)] leading-tight font-bold hidden md:block">
            {logo}
          </pre>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--accent-primary)]">{profile.name.replace(/\s+/g, '').toLowerCase()}</span>
              <span className="text-[var(--text-secondary)]">@</span>
              <span className="font-bold text-[var(--accent-primary)]">portfolio-shell</span>
            </div>
            <div className="h-0.5 bg-[var(--card-border)] my-1 max-w-[280px]" />
            <div>
              <span className="font-bold text-[var(--accent-primary)]">OS: </span>
              <span className="text-[var(--text-primary)]">Web Terminal OS v1.0.0</span>
            </div>
            <div>
              <span className="font-bold text-[var(--accent-primary)]">Host: </span>
              <span className="text-[var(--text-primary)]">Browser Sandbox</span>
            </div>
            <div>
              <span className="font-bold text-[var(--accent-primary)]">Kernel: </span>
              <span className="text-[var(--text-primary)]">Next.js 16.2.2 & React 19.2.4</span>
            </div>
            <div>
              <span className="font-bold text-[var(--accent-primary)]">Shell: </span>
              <span className="text-[var(--text-primary)]">AntigravityShell v1.0.2</span>
            </div>
            <div>
              <span className="font-bold text-[var(--accent-primary)]">Display: </span>
              <span className="text-[var(--text-primary)]">{typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '800x600'}</span>
            </div>
            <div>
              <span className="font-bold text-[var(--accent-primary)]">Active Project: </span>
              <span className="text-[var(--text-primary)]">akirasane.github.io</span>
            </div>
            <div>
              <span className="font-bold text-[var(--accent-primary)]">Developer: </span>
              <span className="text-[var(--text-primary)]">{profile.name}</span>
            </div>
            <div>
              <span className="font-bold text-[var(--accent-primary)]">Title: </span>
              <span className="text-[var(--text-primary)]">{profile.title}</span>
            </div>
            <div className="pt-2 flex gap-1">
              <span className="w-4 h-4 bg-black border border-white" />
              <span className="w-4 h-4 bg-red-600" />
              <span className="w-4 h-4 bg-green-600" />
              <span className="w-4 h-4 bg-yellow-600" />
              <span className="w-4 h-4 bg-blue-600" />
              <span className="w-4 h-4 bg-magenta-600" style={{ backgroundColor: 'magenta' }} />
              <span className="w-4 h-4 bg-cyan-600" />
              <span className="w-4 h-4 bg-white" />
            </div>
          </div>
        </div>
      )
    }
  },

  contact: {
    name: 'contact',
    description: 'Prints social links, email, and runs interactive message setup',
    execute: (args, data, actions) => {
      setTimeout(() => {
        actions.startContactFlow()
      }, 50)
      
      return (
        <div className="py-1 font-mono">
          <p className="text-[var(--accent-primary)] font-bold">Initiating interactive contact setup...</p>
          <p className="text-xs text-[var(--text-secondary)]">Please answer the prompts below to send a message directly to Chatkawin.</p>
        </div>
      )
    }
  },

  theme: {
    name: 'theme',
    description: 'Changes the active terminal color theme',
    usage: 'theme [matrix | cyberpunk | dracula | monokai | nord]',
    execute: (args, data, actions) => {
      const themes = ['matrix', 'cyberpunk', 'dracula', 'monokai', 'nord']
      if (args.length === 0 || !themes.includes(args[0].toLowerCase())) {
        return (
          <div className="py-1 font-mono">
            <p className="text-[var(--accent-primary)] font-bold">AVAILABLE THEMES</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {themes.map(t => (
                <li key={t}>
                  <span className="font-bold text-[var(--accent-primary)]">{t}</span> 
                  {t === 'matrix' ? ' (Default)' : ''}
                </li>
              ))}
            </ul>
            <p className="text-xs text-[var(--text-secondary)] mt-2">Usage: `theme &lt;theme_name&gt;` (e.g. `theme dracula`)</p>
          </div>
        )
      }

      const selected = args[0].toLowerCase()
      actions.setTheme(selected)
      return (
        <div className="py-1 font-mono text-[var(--text-secondary)]">
          Theme successfully updated to: <span className="font-bold text-[var(--accent-primary)] uppercase">{selected}</span>
        </div>
      )
    }
  },

  history: {
    name: 'history',
    description: 'Prints a numbered list of previously executed commands',
    execute: (args, data, actions) => {
      const list = actions.historyList
      if (list.length === 0) {
        return <div className="py-1 font-mono text-[var(--text-secondary)]">No command history found.</div>
      }
      return (
        <div className="py-1 font-mono text-sm max-h-48 overflow-y-auto">
          {list.map((cmd, idx) => (
            <div key={idx} className="flex gap-4">
              <span className="w-8 text-[var(--text-secondary)] text-right">{idx + 1}</span>
              <span>{cmd}</span>
            </div>
          ))}
        </div>
      )
    }
  },

  clear: {
    name: 'clear',
    description: 'Clears the terminal screen buffer',
    execute: (args, data, actions) => {
      setTimeout(() => {
        actions.clearHistory()
      }, 0)
      return null
    }
  },

  weather: {
    name: 'weather',
    description: 'Queries weather status for current developer timezone',
    execute: (args, data) => {
      const location = data.contact.location || 'Bangkok, Thailand'
      const temperatures = ['28°C', '30°C', '32°C', '33°C', '35°C']
      const conditions = ['Sunny', 'Scattered Clouds', 'Partly Cloudy', 'Rainy', 'Thunderstorm']
      
      const randTemp = temperatures[Math.floor(Math.random() * temperatures.length)]
      const randCond = conditions[Math.floor(Math.random() * conditions.length)]
      
      return (
        <div className="py-2 font-mono max-w-sm border border-[var(--card-border)] p-3 rounded bg-[var(--card-bg)]">
          <div className="text-[var(--accent-primary)] font-bold text-sm">WEATHER SERVICE [MOCK]</div>
          <div className="text-lg font-bold mt-1">{location}</div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xl font-bold text-[var(--accent-primary)]">{randTemp}</span>
            <span className="text-sm font-medium text-[var(--text-secondary)]">{randCond}</span>
          </div>
          <div className="text-[10px] text-[var(--text-secondary)] opacity-50 mt-3">
            Local Time: {new Date().toLocaleTimeString()} • Powered by Mock Weather API
          </div>
        </div>
      )
    }
  },

  matrix: {
    name: 'matrix',
    description: 'Fills the terminal screen with falling green binary rain (Matrix style)',
    execute: (args, data, actions) => {
      setTimeout(() => {
        actions.startMatrix()
      }, 50)
      return (
        <div className="py-1 font-mono text-[var(--accent-primary)]">
          Loading Matrix Code Rain... Press any key to exit.
        </div>
      )
    }
  },

  play: {
    name: 'play',
    description: 'Boots a mini-game inside the terminal container (snake | typing)',
    usage: 'play [snake | typing]',
    execute: (args, data, actions) => {
      if (args.length === 0 || !['snake', 'typing'].includes(args[0].toLowerCase())) {
        return (
          <div className="py-1 font-mono">
            <p className="text-[var(--accent-primary)] font-bold">AVALIABLE GAMES</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>
                <span className="font-bold text-[var(--accent-primary)]">snake</span> - Retro keyboard snake game
              </li>
              <li>
                <span className="font-bold text-[var(--accent-primary)]">typing</span> - Speed typing coding challenge
              </li>
            </ul>
            <p className="text-xs text-[var(--text-secondary)] mt-2">Usage: `play &lt;game_name&gt;` (e.g. `play snake`)</p>
          </div>
        )
      }

      const game = args[0].toLowerCase() as 'snake' | 'typing'
      setTimeout(() => {
        actions.startGame(game)
      }, 50)
      return (
        <div className="py-1 font-mono text-[var(--text-secondary)]">
          Booting <span className="font-bold text-[var(--accent-primary)] uppercase">{game}</span> inside terminal container...
        </div>
      )
    }
  },

  cowsay: {
    name: 'cowsay',
    description: 'Uses ASCII art of a cow to speak the provided text',
    usage: 'cowsay <text>',
    execute: (args) => {
      const message = args.length > 0 ? args.join(' ') : 'Moo! Welcome to my CLI portfolio!'
      const borderLength = message.length + 2
      const topBorder = '_'.repeat(borderLength)
      const bottomBorder = '-'.repeat(borderLength)
      
      const cow = `
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
      `
      return (
        <div className="py-1 font-mono text-sm leading-tight max-w-xl">
          <pre>
{`  ${topBorder}
< ${message} >
  ${bottomBorder}`}
{cow}
          </pre>
        </div>
      )
    }
  },

  starwars: {
    name: 'starwars',
    description: 'Streams a random classic quote from the Star Wars universe',
    execute: () => {
      const quotes = [
        "May the Force be with you. — Han Solo",
        "Do. Or do not. There is no try. — Yoda",
        "Never tell me the odds! — Han Solo",
        "Fear is the path to the dark side. Fear leads to anger. Anger leads to hate. Hate leads to suffering. — Yoda",
        "I find your lack of faith disturbing. — Darth Vader",
        "In my experience, there is no such thing as luck. — Obi-Wan Kenobi",
        "Your focus determines your reality. — Qui-Gon Jinn",
        "The Force will be with you. Always. — Obi-Wan Kenobi",
        "It's a trap! — Admiral Ackbar",
        "I am one with the Force and the Force is with me. — Chirrut Îmwe"
      ]
      const quote = quotes[Math.floor(Math.random() * quotes.length)]
      return (
        <div className="py-2 font-mono max-w-xl border border-[var(--card-border)] p-4 rounded bg-[var(--card-bg)]">
          <div className="text-[var(--accent-primary)] font-bold text-xs mb-1">FORCE RECEIVED:</div>
          <p className="italic text-base text-[var(--text-primary)]">"{quote.split(' — ')[0]}"</p>
          <p className="text-right text-sm text-[var(--accent-primary)] font-bold mt-1">— {quote.split(' — ')[1]}</p>
        </div>
      )
    }
  },

  gui: {
    name: 'gui',
    description: 'Gracefully transitions the portfolio to the modern GUI version',
    execute: (args, data, actions) => {
      setTimeout(() => {
        actions.setMode('gui')
      }, 500)
      return (
        <div className="py-1 font-mono text-[var(--accent-primary)] font-bold animate-pulse">
          Exiting CLI mode... Loading Graphical User Interface (GUI)...
        </div>
      )
    }
  },

  sudo: {
    name: 'sudo',
    description: 'Triggers administrative actions (or special easter eggs)',
    usage: 'sudo [cmd]',
    execute: (args, data, actions) => {
      if (args.length > 0 && args[0].toLowerCase() === 'rm' && args.includes('-rf')) {
        setTimeout(() => {
          actions.startGame('panic' as any)
        }, 50)
        return (
          <div className="py-1 font-mono text-red-500 font-bold animate-pulse">
            [WARNING] DANGER: EXECUTING RM -RF / SYSTEM PURGE IN PROGRESS...
          </div>
        )
      }

      return (
        <div className="py-1 font-mono text-red-500 font-semibold">
          [Permission Denied] This incident has been reported to the root administrator.
        </div>
      )
    }
  },

  // ==========================================
  // NEW VIRTUAL FILE SYSTEM (VFS) COMMANDS
  // ==========================================

  pwd: {
    name: 'pwd',
    description: 'Prints current working directory path',
    execute: (args, data, actions) => {
      return (
        <div className="py-1 font-mono text-[var(--text-primary)]">
          {actions.currentPath}
        </div>
      )
    }
  },

  ls: {
    name: 'ls',
    description: 'Lists files and folders in the current working directory',
    usage: 'ls [<path>]',
    execute: (args, data, actions) => {
      const vfs = getVFS(data)
      const target = args[0] || '.'
      
      const { node, error } = resolvePath(vfs, actions.currentPath, target)
      if (error || !node) {
        return <div className="py-1 font-mono text-red-500 font-bold">{error || 'Directory not found'}</div>
      }

      if (node.type === 'file') {
        return <div className="py-1 font-mono text-[var(--text-primary)]">{target}</div>
      }

      const items = node.children || {}
      return (
        <div className="py-1 font-mono flex flex-wrap gap-4 max-w-3xl">
          {Object.keys(items).sort().map((name) => {
            const item = items[name]
            const isDir = item.type === 'dir'
            return (
              <span 
                key={name} 
                className="font-bold select-all"
                style={{
                  color: isDir ? '#00e5ff' : 'var(--text-primary)',
                  textDecoration: isDir ? 'underline' : 'none'
                }}
              >
                {name}{isDir ? '/' : ''}
              </span>
            )
          })}
          {Object.keys(items).length === 0 && (
            <span className="text-[var(--text-secondary)] italic">Empty directory</span>
          )}
        </div>
      )
    }
  },

  cd: {
    name: 'cd',
    description: 'Changes the current working directory',
    usage: 'cd <path>',
    execute: (args, data, actions) => {
      const target = args[0]
      if (!target) {
        // cd with no args goes back to root
        actions.setCurrentPath('/')
        return null
      }

      const vfs = getVFS(data)
      const { node, path, error } = resolvePath(vfs, actions.currentPath, target)

      if (error || !node) {
        return <div className="py-1 font-mono text-red-500 font-bold">{error || 'Directory not found'}</div>
      }

      if (node.type !== 'dir') {
        return <div className="py-1 font-mono text-red-500 font-bold">cd: not a directory: {target}</div>
      }

      actions.setCurrentPath(path)
      return null
    }
  },

  cat: {
    name: 'cat',
    description: 'Prints content of a file',
    usage: 'cat <file_path>',
    execute: (args, data, actions) => {
      const target = args[0]
      if (!target) {
        return <div className="py-1 font-mono text-red-500 font-bold">cat: missing file argument</div>
      }

      const vfs = getVFS(data)
      const { node, path, error } = resolvePath(vfs, actions.currentPath, target)

      if (error || !node) {
        return <div className="py-1 font-mono text-red-500 font-bold">{error || 'File not found'}</div>
      }

      if (node.type !== 'file') {
        return <div className="py-1 font-mono text-red-500 font-bold">cat: {target}: Is a directory</div>
      }

      // Special handling for decrypted secret flag
      if (path === '/secret/flag.txt') {
        return <SecretFlagOutput actions={actions} />
      }

      // If send_message.sh is executed or catted, we can do something special
      if (target.endsWith('send_message.sh')) {
        setTimeout(() => {
          actions.startContactFlow()
        }, 100)
        return (
          <div className="py-1 font-mono">
            <pre className="text-[var(--text-secondary)] opacity-80">{node.content}</pre>
            <p className="text-[var(--accent-primary)] font-bold mt-2">[Executing send_message.sh...]</p>
          </div>
        )
      }

      // If content is already a React node (rich renderer), render directly
      if (typeof node.content !== 'string') {
        return <div className="py-1">{node.content}</div>
      }

      // Fallback: plain string content
      return (
        <div className="py-2 font-mono whitespace-pre-wrap text-[var(--text-primary)] border border-[var(--card-border)] p-3 rounded bg-[var(--card-bg)] max-w-3xl text-sm leading-relaxed">
          {node.content}
        </div>
      )
    }
  },

  whoami: {
    name: 'whoami',
    description: 'Prints current active user name',
    execute: () => {
      return (
        <div className="py-1 font-mono text-[var(--text-primary)]">
          guest_developer
        </div>
      )
    }
  },

  uname: {
    name: 'uname',
    description: 'Prints web operating system information',
    execute: () => {
      return (
        <div className="py-1 font-mono text-[var(--text-primary)]">
          WebTerminalOS browser-sandbox-x86_64 Darwin Kernel Version 23.4.0
        </div>
      )
    }
  },

  date: {
    name: 'date',
    description: 'Prints current date and timezone',
    execute: () => {
      return (
        <div className="py-1 font-mono text-[var(--text-primary)]">
          {new Date().toString()}
        </div>
      )
    }
  },

  echo: {
    name: 'echo',
    description: 'Prints back input arguments to stdout',
    usage: 'echo <text>',
    execute: (args) => {
      return (
        <div className="py-1 font-mono text-[var(--text-primary)]">
          {args.join(' ')}
        </div>
      )
    }
  }
}
