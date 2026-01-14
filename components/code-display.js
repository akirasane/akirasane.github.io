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
                }

                .code-container {
                    background-color: #0f172a;
                    border: 1px solid #334155;
                    border-radius: 0.5rem;
                    padding: 1.5rem;
                    overflow-x: auto;
                    font-family: 'Courier New', monospace;
                    font-size: 0.875rem;
                    line-height: 1.5;
                    color: #cbd5e1;
                }

                .line {
                    display: flex;
                    margin-bottom: 0.5rem;
                }

                .line-number {
                    color: #64748b;
                    margin-right: 1.5rem;
                    min-width: 2rem;
                    text-align: right;
                    user-select: none;
                }

                .keyword {
                    color: #c084fc;
                }

                .type {
                    color: #60a5fa;
                }

                .function {
                    color: #34d399;
                }

                .variable {
                    color: #f472b6;
                }

                .string {
                    color: #fbbf24;
                }

                .comment {
                    color: #6b7280;
                }

                .punctuation {
                    color: #cbd5e1;
                }
            </style>

            <pre class="code-container"><slot></slot></pre>
        `;
    }
}

customElements.define('code-display', CodeDisplay);
