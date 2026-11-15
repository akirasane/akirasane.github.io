import BorderGlow from '@/components/reactbits/BorderGlow'

export default function TerminalPreview() {
  return (
    <BorderGlow
      className="w-[26.25rem] h-[13.75rem] rounded-xl overflow-hidden"
      edgeSensitivity={30}
      glowColor="40 80 80"
      backgroundColor="#060010"
      borderRadius={28}
      glowRadius={40}
      glowIntensity={1}
      coneSpread={25}
      animated={false}
      colors={['#c084fc', '#f472b6', '#38bdf8']}
    >
      <div
        className="flex items-center gap-1.5 px-4 py-3 border-b shrink-0"
        style={{ borderColor: 'var(--card-border)' }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
      </div>
      <div className="px-5 py-4 font-mono text-[0.8125rem] leading-loose text-left">
        <p className="term-type term-l1" style={{ '--term-w': '8ch' } as React.CSSProperties}>
          <span style={{ color: '#38bdf8' }}>$</span> whoami
        </p>
        <p
          className="term-type term-l2"
          style={{ '--term-w': '36ch', color: 'var(--text-secondary)' } as React.CSSProperties}
        >
          &gt; <span style={{ color: '#c084fc' }}>Chatkawin Taola</span> — Analyst &amp; Dev
        </p>
        <p className="term-type term-l3" style={{ '--term-w': '20ch' } as React.CSSProperties}>
          <span style={{ color: '#38bdf8' }}>$</span> status --available
        </p>
        <p
          className="term-type term-l4"
          style={{ '--term-w': '28ch', color: 'var(--text-secondary)' } as React.CSSProperties}
        >
          &gt; open to new opportunities_
        </p>
        <p className="text-[0.75rem] leading-loose whitespace-nowrap" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
          try: <span style={{ color: '#f472b6' }}>play snake</span>
        </p>
      </div>
    </BorderGlow>
  )
}
