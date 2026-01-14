class CodeDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // ✅ Capture content ONCE before shadow renders
        this.rawCode = this.innerHTML;
    }

    connectedCallback() {
        this.render();
    }

    highlight(line) {
        return line
            .replace(/\b(private|static|new|return)\b/g, `<span class="keyword">$1</span>`)
            .replace(/\b(Developer|int|string|void)\b/g, `<span class="type">$1</span>`)
            .replace(/(\w+)\(/g, `<span class="function">$1</span>(`)
            .replace(/\b(me)\b/g, `<span class="variable">$1</span>`)
            .replace(/"([^"]*)"/g, `<span class="string">"$1"</span>`);
    }

    render() {
        const lines = this.rawCode
            .trim()
            .split('\n')
            .map(line => line.replace(/&nbsp;/g, ' ').trimEnd());

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 900px;
                    margin: auto;
                }

                .code-container {
                    background: radial-gradient(circle at top, #1e293b, #020617);
                    border-radius: 16px;
                    padding: 24px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 14px;
                    color: #e5e7eb;
                    box-shadow:
                        0 0 0 1px rgba(148,163,184,0.1),
                        0 20px 50px rgba(0,0,0,0.6),
                        inset 0 0 40px rgba(99,102,241,0.15);
                }

                .line {
                    display: grid;
                    grid-template-columns: 40px 1fr;
                    gap: 16px;
                    padding: 2px 0;
                }

                .line-number {
                    text-align: right;
                    color: #475569;
                    user-select: none;
                }

                .keyword { color: #c084fc; }
                .type { color: #60a5fa; }
                .function { color: #34d399; }
                .variable { color: #f472b6; }
                .string { color: #fbbf24; }
            </style>

            <div class="code-container">
                ${lines.map((line, i) => `
                    <div class="line">
                        <div class="line-number">${i + 1}</div>
                        <div class="code">${this.highlight(line)}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

customElements.define('code-display', CodeDisplay);
