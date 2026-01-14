class CodeDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const code = this.textContent.trim();
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 900px;
                    margin: 0 auto;
                }

                .code-container {
                    background: radial-gradient(circle at top, #1e293b, #020617);
                    border-radius: 16px;
                    padding: 24px;
                    font-family: 'JetBrains Mono', 'Courier New', monospace;
                    font-size: 14px;
                    color: #e5e7eb;
                    box-shadow:
                        0 0 0 1px rgba(148,163,184,0.1),
                        0 20px 50px rgba(0,0,0,0.6),
                        inset 0 0 40px rgba(99,102,241,0.15);
                    overflow-x: auto;
                }

                .line {
                    display: flex;
                    padding: 4px 0;
                }

                .line-number {
                    color: #475569;
                    margin-right: 24px;
                    min-width: 30px;
                    text-align: right;
                    user-select: none;
                }

                .code {
                    flex: 1;
                    white-space: pre;
                }

                .keyword { color: #c084fc; font-weight: 500; }
                .type { color: #60a5fa; font-weight: 500; }
                .function { color: #34d399; font-weight: 500; }
                .variable { color: #f472b6; font-weight: 500; }
                .string { color: #fbbf24; }
            </style>

            <div class="code-container">
                ${code.split('\n').map((line, i) => `
                    <div class="line">
                        <span class="line-number">${i + 1}</span>
                        <span class="code">${this.escapeHtml(line)}</span>
                    </div>
                `).join('')}
            </div>
        `;
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
