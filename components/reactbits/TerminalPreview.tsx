export default function TerminalPreview() {
  return (
    <div
      className="w-full max-w-sm rounded-xl overflow-hidden border"
      style={{
        background: 'rgba(12, 6, 32, 0.7)',
        borderColor: 'var(--card-border)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.08)',
      }}
    >
      <div
        className="flex items-center gap-1.5 px-4 py-3 border-b"
        style={{ borderColor: 'var(--card-border)' }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
      </div>
      <div className="px-5 py-4 font-mono text-[13px] leading-loose text-left">
        <p className="term-type term-l1">
          <span style={{ color: '#38bdf8' }}>$</span> whoami
        </p>
        <p className="term-type term-l2" style={{ color: 'var(--text-secondary)' }}>
          &gt; <span style={{ color: '#c084fc' }}>Chatkawin Taola</span> — full-stack dev
        </p>
        <p className="term-type term-l3">
          <span style={{ color: '#38bdf8' }}>$</span> status --available
        </p>
        <p className="term-type term-l4" style={{ color: 'var(--text-secondary)' }}>
          &gt; open to new opportunities_
        </p>
      </div>
    </div>
  )
}
