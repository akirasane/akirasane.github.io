class CodeDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Define the code directly
        this.codeText = `
class Developer {
    private string $name;
    private string $title;
    private array $skills = [];
    private int $experience;

    public function __construct(string $name) {
        $this->name = $name;
    }

    public function setTitle(string $title): self {
        $this->title = $title;
        return $this;
    }

    public static function createMe(): self {
        return (new self("Chatkawin Taola"))
            ->setTitle("Software Developer & System Analyst")
            ->setExperience(5);
    }
}`;
    }

    connectedCallback() {
        this.render();
        setTimeout(() => this.typeCode(), 500);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { 
                    display: block;
                    width: 100%;
                }

                .hero-wrapper {
                    position: relative;
                    width: 100%;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    padding: 5rem 0 1rem 0;
                    box-sizing: border-box;
                }

                /* Animated background gradient */
                .hero-bg {
                    position: absolute;
                    inset: 0;
                    background: 
                        radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
                    animation: gradientShift 15s ease infinite;
                }

                @keyframes gradientShift {
                    0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
                    33% { opacity: 0.8; transform: scale(1.1) rotate(2deg); }
                    66% { opacity: 0.9; transform: scale(1.05) rotate(-2deg); }
                }

                /* Animated light beams */
                .light-beam {
                    position: absolute;
                    width: 2px;
                    height: 100%;
                    background: linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.3) 50%, transparent 100%);
                    animation: beamMove 8s ease-in-out infinite;
                    opacity: 0.5;
                }

                .light-beam:nth-child(1) { left: 20%; animation-delay: 0s; }
                .light-beam:nth-child(2) { left: 50%; animation-delay: 2s; }
                .light-beam:nth-child(3) { left: 80%; animation-delay: 4s; }

                @keyframes beamMove {
                    0%, 100% { transform: translateX(-20px) scaleY(0.8); opacity: 0.3; }
                    50% { transform: translateX(20px) scaleY(1.2); opacity: 0.6; }
                }

                /* Glowing orbs */
                .glow-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(60px);
                    opacity: 0.4;
                    animation: orbFloat 20s ease-in-out infinite;
                }

                .glow-orb.orb-1 {
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, transparent 70%);
                    top: 10%;
                    left: 10%;
                    animation-delay: 0s;
                }

                .glow-orb.orb-2 {
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, transparent 70%);
                    bottom: 10%;
                    right: 10%;
                    animation-delay: 5s;
                }

                .glow-orb.orb-3 {
                    width: 250px;
                    height: 250px;
                    background: radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%);
                    top: 50%;
                    left: 50%;
                    animation-delay: 10s;
                }

                @keyframes orbFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(30px, -30px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(20px, 30px) scale(1.05); }
                }

                /* Shimmer effect */
                .shimmer {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(255, 255, 255, 0.03) 50%,
                        transparent 100%
                    );
                    animation: shimmerMove 10s ease-in-out infinite;
                }

                @keyframes shimmerMove {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                /* Floating particles */
                .particle {
                    position: absolute;
                    background: rgba(99, 102, 241, 0.4);
                    border-radius: 50%;
                    pointer-events: none;
                }

                /* Small particles */
                .particle.small {
                    width: 3px;
                    height: 3px;
                    animation: float 25s infinite;
                }

                /* Medium particles */
                .particle.medium {
                    width: 5px;
                    height: 5px;
                    animation: float 20s infinite;
                }

                /* Large particles */
                .particle.large {
                    width: 8px;
                    height: 8px;
                    animation: float 30s infinite;
                }

                /* Different colors */
                .particle.purple { background: rgba(168, 85, 247, 0.4); }
                .particle.blue { background: rgba(59, 130, 246, 0.4); }
                .particle.pink { background: rgba(236, 72, 153, 0.4); }
                .particle.cyan { background: rgba(34, 211, 238, 0.4); }

                .particle:nth-child(1) { left: 10%; top: 20%; animation-delay: 0s; }
                .particle:nth-child(2) { left: 80%; top: 60%; animation-delay: 2s; }
                .particle:nth-child(3) { left: 50%; top: 80%; animation-delay: 4s; }
                .particle:nth-child(4) { left: 90%; top: 30%; animation-delay: 6s; }
                .particle:nth-child(5) { left: 30%; top: 70%; animation-delay: 8s; }
                .particle:nth-child(6) { left: 15%; top: 50%; animation-delay: 3s; }
                .particle:nth-child(7) { left: 70%; top: 15%; animation-delay: 5s; }
                .particle:nth-child(8) { left: 40%; top: 90%; animation-delay: 7s; }
                .particle:nth-child(9) { left: 85%; top: 45%; animation-delay: 1s; }
                .particle:nth-child(10) { left: 25%; top: 35%; animation-delay: 9s; }
                .particle:nth-child(11) { left: 60%; top: 25%; animation-delay: 4.5s; }
                .particle:nth-child(12) { left: 5%; top: 85%; animation-delay: 6.5s; }
                .particle:nth-child(13) { left: 95%; top: 10%; animation-delay: 2.5s; }
                .particle:nth-child(14) { left: 45%; top: 55%; animation-delay: 8.5s; }
                .particle:nth-child(15) { left: 75%; top: 75%; animation-delay: 3.5s; }

                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
                    10% { opacity: 1; }
                    50% { transform: translateY(-50vh) translateX(30px) scale(1.2); opacity: 0.8; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh) translateX(60px) scale(0.8); opacity: 0; }
                }

                .hero-content {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 100%;
                    padding: 0 1rem;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    box-sizing: border-box;
                }

                .hero-header {
                    text-align: center;
                    margin-bottom: 0.5rem;
                    animation: fadeInDown 1s ease-out;
                    flex-shrink: 0;
                }

                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .hero-title {
                    font-size: clamp(2rem, 4vw, 3.5rem);
                    font-weight: 800;
                    background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #ec4899 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin: 0 0 0.5rem 0;
                    line-height: 1.1;
                }

                .hero-subtitle {
                    font-size: clamp(1rem, 1.8vw, 1.3rem);
                    color: #94a3b8;
                    font-weight: 300;
                    max-width: 600px;
                    margin: 0 auto 0.5rem auto;
                }

                .code-window {
                    background: linear-gradient(145deg, #0f172a 0%, #1e293b 100%);
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow:
                        0 0 0 1px rgba(148, 163, 184, 0.1),
                        0 30px 60px rgba(0, 0, 0, 0.5),
                        0 0 100px rgba(99, 102, 241, 0.2);
                    animation: fadeInUp 1s ease-out 0.3s both;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    min-height: 0;
                    margin: 0;
                }

                .code-window:hover {
                    transform: translateY(-5px);
                    box-shadow:
                        0 0 0 1px rgba(148, 163, 184, 0.2),
                        0 40px 80px rgba(0, 0, 0, 0.6),
                        0 0 120px rgba(99, 102, 241, 0.3);
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .window-header {
                    background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
                    padding: 0.75rem 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
                    flex-shrink: 0;
                }

                .window-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    transition: transform 0.2s ease;
                }

                .window-dot:hover {
                    transform: scale(1.2);
                }

                .dot-red { background: #ef4444; }
                .dot-yellow { background: #f59e0b; }
                .dot-green { background: #10b981; }

                .window-title {
                    margin-left: auto;
                    color: #64748b;
                    font-size: 0.875rem;
                    font-family: 'JetBrains Mono', monospace;
                }

                .code-container {
                    background: #0f172a;
                    padding: 1.25rem;
                    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
                    font-size: clamp(0.65rem, 1.1vw, 0.8rem);
                    line-height: 1.5;
                    color: #e5e7eb;
                    overflow: auto;
                    flex: 1;
                    min-height: 0;
                }

                .line {
                    display: flex;
                    min-height: 1.5em;
                    opacity: 0;
                    animation: lineAppear 0.3s ease forwards;
                }

                @keyframes lineAppear {
                    to { opacity: 1; }
                }

                .line-number {
                    color: #475569;
                    text-align: right;
                    padding-right: 1.25rem;
                    min-width: 45px;
                    user-select: none;
                    font-weight: 500;
                }

                .code {
                    flex: 1;
                    white-space: pre;
                }

                .keyword { color: #c084fc; font-weight: 600; }
                .type { color: #60a5fa; font-weight: 600; }
                .function { color: #34d399; font-weight: 600; }
                .variable { color: #f472b6; }
                .string { color: #fbbf24; }
                .comment { color: #6b7280; font-style: italic; }

                .cursor {
                    display: inline-block;
                    width: 2px;
                    height: 1em;
                    background: linear-gradient(180deg, #60a5fa, #a78bfa);
                    animation: blink 1s infinite;
                    box-shadow: 0 0 8px rgba(96, 165, 250, 0.5);
                }

                /* Custom scrollbar for code container */
                .code-container::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }

                .code-container::-webkit-scrollbar-track {
                    background: rgba(15, 23, 42, 0.5);
                    border-radius: 4px;
                }

                .code-container::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.3);
                    border-radius: 4px;
                    transition: background 0.3s ease;
                }

                .code-container::-webkit-scrollbar-thumb:hover {
                    background: rgba(99, 102, 241, 0.5);
                }

                .code-container::-webkit-scrollbar-corner {
                    background: rgba(15, 23, 42, 0.5);
                }

                @keyframes blink {
                    0%, 49% { opacity: 1; }
                    50%, 100% { opacity: 0; }
                }

                .cta-section {
                    text-align: center;
                    margin-top: 1rem;
                    animation: fadeIn 1s ease-out 0.6s both;
                    flex-shrink: 0;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .cta-button {
                    display: inline-block;
                    padding: 0.75rem 2rem;
                    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
                    margin: 0 0.4rem;
                }

                .cta-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 35px rgba(99, 102, 241, 0.4);
                }

                .cta-button.secondary {
                    background: transparent;
                    border: 2px solid #6366f1;
                    color: #6366f1;
                    box-shadow: none;
                }

                .cta-button.secondary:hover {
                    background: rgba(99, 102, 241, 0.1);
                    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.2);
                }

                @media (max-width: 768px) {
                    .hero-header {
                        margin-bottom: 0.5rem;
                    }

                    .hero-wrapper {
                        height: 100vh;
                        padding: 4.5rem 0 0.5rem 0;
                    }

                    .hero-content {
                        padding: 0 0.5rem;
                    }

                    .code-container {
                        padding: 0.75rem;
                        font-size: 0.65rem;
                        line-height: 1.4;
                    }

                    .cta-section {
                        margin-top: 0.75rem;
                    }

                    .cta-button {
                        display: block;
                        margin: 0.4rem auto;
                        max-width: 220px;
                        padding: 0.7rem 1.8rem;
                        font-size: 0.95rem;
                    }

                    .hero-title {
                        font-size: 2rem;
                        margin-bottom: 0.25rem;
                    }

                    .hero-subtitle {
                        font-size: 0.95rem;
                        margin-bottom: 0.25rem;
                    }

                    .window-header {
                        padding: 0.6rem 1rem;
                    }
                }
            </style>

            <div class="hero-wrapper">
                <div class="hero-bg"></div>
                
                <!-- Glowing orbs -->
                <div class="glow-orb orb-1"></div>
                <div class="glow-orb orb-2"></div>
                <div class="glow-orb orb-3"></div>
                
                <!-- Light beams -->
                <div class="light-beam"></div>
                <div class="light-beam"></div>
                <div class="light-beam"></div>
                
                <!-- Shimmer effect -->
                <div class="shimmer"></div>
                
                <!-- Particles -->
                <div class="particle small blue"></div>
                <div class="particle medium purple"></div>
                <div class="particle large"></div>
                <div class="particle small pink"></div>
                <div class="particle medium cyan"></div>
                <div class="particle small purple"></div>
                <div class="particle large blue"></div>
                <div class="particle medium pink"></div>
                <div class="particle small"></div>
                <div class="particle large purple"></div>
                <div class="particle medium cyan"></div>
                <div class="particle small blue"></div>
                <div class="particle large pink"></div>
                <div class="particle medium"></div>
                <div class="particle small cyan"></div>

                <div class="hero-content">
                    <div class="hero-header">
                        <h1 class="hero-title">Hi, I'm Chatkawin 👋</h1>
                        <p class="hero-subtitle">Crafting elegant code and architecting scalable systems</p>
                    </div>

                    <div class="code-window">
                        <div class="window-header">
                            <div class="window-dot dot-red"></div>
                            <div class="window-dot dot-yellow"></div>
                            <div class="window-dot dot-green"></div>
                            <div class="window-title">Developer.php</div>
                        </div>
                        <div class="code-container" id="container"></div>
                    </div>

                    <div class="cta-section">
                        <a href="#projects" class="cta-button">View My Work</a>
                        <a href="#contact" class="cta-button secondary">Get In Touch</a>
                    </div>
                </div>
            </div>
        `;
    }

    typeCode() {
        const container = this.shadowRoot.getElementById('container');
        const lines = this.codeText.split('\n');
        
        if (!container) {
            console.error('Container not found');
            return;
        }

        const self = this;
        let lineIndex = 0;
        let charIndex = 0;
        const speed = 5;

        const type = () => {
            // If we've gone through all lines, stop
            if (lineIndex >= lines.length) {
                return;
            }

            const currentLine = lines[lineIndex];

            // Create line element if missing
            if (container.children.length <= lineIndex) {
                const lineEl = document.createElement('div');
                lineEl.className = 'line';
                lineEl.innerHTML = `
                    <div class="line-number">${lineIndex + 1}</div>
                    <div class="code"></div>
                `;
                container.appendChild(lineEl);
            }

            const codeEl = container.children[lineIndex].querySelector('.code');
            const textToShow = currentLine.slice(0, charIndex + 1);
            
            // Show text with highlighting and cursor
            codeEl.innerHTML = self.syntaxHighlight(textToShow) + '<span class="cursor"></span>';

            charIndex++;

            // If we've finished this line, move to next
            if (charIndex > currentLine.length) {
                // Show completed line without cursor
                codeEl.innerHTML = self.syntaxHighlight(currentLine);
                lineIndex++;
                charIndex = 0;
            }

            setTimeout(type, speed);
        };

        // Start the typing
        type();
    }

    syntaxHighlight(text) {
        // First escape the text
        let s = this.escapeHtml(text);

        // Then apply syntax highlighting (which adds HTML spans)
        // PHP tags
        s = s.replace(/(&lt;\?php|\?&gt;)/g, '<span class="keyword">$1</span>');
        
        // Keywords - must come before type matching
        s = s.replace(/\b(private|public|static|new|return|class|function|self|array)\b/g, '<span class="keyword">$1</span>');
        
        // Types
        s = s.replace(/\b(string|int|array|Developer)\b/g, '<span class="type">$1</span>');
        
        // Strings - handle both before and after escaping
        s = s.replace(/&quot;([^&]*)&quot;/g, '<span class="string">&quot;$1&quot;</span>');
        
        // Functions (word followed by parenthesis)
        s = s.replace(/(\w+)(?=\()/g, '<span class="function">$1</span>');
        
        // Variables with $ sign
        s = s.replace(/(\$\w+)/g, '<span class="variable">$1</span>');
        
        // Arrow operator
        s = s.replace(/(-&gt;)/g, '<span class="keyword">$1</span>');
        
        // Double colon
        s = s.replace(/(::)/g, '<span class="keyword">$1</span>');

        return s;
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

customElements.define('code-display', CodeDisplay);
