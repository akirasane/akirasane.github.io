const fs = require('fs');
const { execSync } = require('child_process');

function writeToSummary(content) {
    const summaryFile = process.env.GITHUB_STEP_SUMMARY;
    if (summaryFile) {
        try {
            fs.appendFileSync(summaryFile, content);
        } catch (err) {
            console.error('Failed to write to GITHUB_STEP_SUMMARY:', err.message);
        }
    }
}

async function runReview() {
    const apiKey = process.env.LOCAL_AI_API_KEY;
    if (!apiKey) {
        console.error('Error: LOCAL_AI_API_KEY environment variable is not set.');
        process.exit(1);
    }

    console.log('Retrieving code changes...');
    let diff = '';
    try {
        // Try getting diff of the last commit for relevant source files
        diff = execSync("git diff HEAD~1 HEAD -- '*.js' '*.jsx' '*.ts' '*.tsx' '*.css' '*.html'").toString();
    } catch (e) {
        console.log('Could not get commit diff (possibly first commit or shallow clone). Fallback to diff against unstaged/staged files...');
        try {
            diff = execSync("git diff HEAD -- '*.js' '*.jsx' '*.ts' '*.tsx' '*.css' '*.html'").toString();
        } catch (err) {
            console.error('Error reading git diff:', err.message);
            process.exit(1);
        }
    }

    if (!diff.trim()) {
        console.log('No code changes detected in source files to review.');
        process.exit(0);
    }

    // Limit diff characters to prevent hitting model context limits on massive commits
    const MAX_DIFF_CHARS = 30000;
    if (diff.length > MAX_DIFF_CHARS) {
        diff = diff.substring(0, MAX_DIFF_CHARS) + '\n\n...(diff truncated — too large)';
    }

    // 1. Detect model loaded in LM Studio
    let modelName = 'google/gemma-4-12b-qat';
    try {
        console.log('Detecting loaded model from LM Studio...');
        const modelsResponse = await fetch('https://llmapi.omelettesalmon.com/api/v1/models', {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json'
            }
        });
        if (modelsResponse.ok) {
            const modelsData = await modelsResponse.json();
            console.log('Available models from LM Studio:', JSON.stringify(modelsData));
            const list = modelsData.models || modelsData.data || [];
            let foundModel = null;
            for (const m of list) {
                if (m.loaded_instances && m.loaded_instances.length > 0) {
                    foundModel = m.loaded_instances[0].id;
                    break;
                }
                if (m.id && !m.loaded_instances) {
                    foundModel = m.id;
                    break;
                }
            }
            if (foundModel) {
                modelName = foundModel;
                console.log(`Detected loaded model: ${modelName}`);
            } else {
                console.log('No loaded models found in LM Studio. Using default fallback:', modelName);
            }
        } else {
            console.log(`Failed to query models endpoint: HTTP ${modelsResponse.status}. Using default fallback: ${modelName}`);
        }
    } catch (err) {
        console.log(`Failed to query models endpoint (${err.message}). Using fallback model name: ${modelName}`);
    }

    // Read optional custom rules from ai-review-rules.md
    let customRules = '';
    try {
        if (fs.existsSync('ai-review-rules.md')) {
            customRules = fs.readFileSync('ai-review-rules.md', 'utf8').trim();
            console.log('Loaded custom review rules from ai-review-rules.md');
        }
    } catch (err) {
        console.log(`Failed to read optional ai-review-rules.md file: ${err.message}`);
    }

    console.log('Sending changes to LM Studio API for code review...');
    let prompt = `You are a professional AI Code Reviewer. Review the following code changes for a Next.js web application.
Analyze it for:
1. Critical bugs or syntax errors (e.g. unclosed tags, broken JS scripts, React hydration errors, incorrect hook dependencies).
2. Security issues (e.g. XSS risks, insecure dependencies, exposed secrets).
3. SEO improvements (missing meta tags, alt tags, heading hierarchy, semantic HTML).
4. Styling defects or non-responsive layout issues (Tailwind CSS classes, layout shifts).`;

    if (customRules) {
        prompt += `\n\nAdditionally, you MUST strictly enforce the following project-specific coding conventions and rules:\n${customRules}`;
    }

    prompt += `\n\nIf you find any CRITICAL blockers that should STOP the deployment, you must explicitly start the feedback line with '[BLOCKER]'.
Otherwise, write constructive recommendations.

Code Changes to Review:
\`\`\`diff
${diff}
\`\`\`

Review Report (Keep it concise, in Markdown format):`;

    let commitMessage = 'N/A';
    let commitAuthor = 'N/A';
    try {
        commitMessage = execSync("git log -1 --pretty=%B").toString().trim();
        commitAuthor = execSync("git log -1 --pretty=%an <%ae>").toString().trim();
    } catch (e) {
        console.log('Could not retrieve commit log details:', e.message);
    }

    const url = 'https://llmapi.omelettesalmon.com/api/v1/chat';
    const payload = {
        model: modelName,
        input: prompt
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`LM Studio API returned status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        let feedback = '';
        if (data.choices?.[0]?.message?.content) {
            feedback = data.choices[0].message.content;
        } else if (data.output && Array.isArray(data.output)) {
            const msgObj = data.output.find(item => item.type === 'message');
            if (msgObj) {
                feedback = msgObj.content;
            }
        }

        if (!feedback) {
            throw new Error('Empty response from LM Studio API. Received body: ' + JSON.stringify(data));
        }

        console.log('\n--- AI CODE REVIEW REPORT (LM Studio) ---');
        console.log(feedback);
        console.log('-----------------------------------------\n');

        const isBlocker = /^\[BLOCKER\]/m.test(feedback);
        
        let statusEmoji = isBlocker ? '❌ BLOCKED' : '✅ PASSED';
        let statusColor = isBlocker ? 'red' : 'green';
        let summaryContent = `## 🤖 AI Code Review (Local LLM)
        
### Status: <span style="color: ${statusColor}; font-weight: bold;">${statusEmoji}</span>

### 👤 Deployment Details
* **Author**: ${commitAuthor}
* **Commit Message**:
\`\`\`
${commitMessage}
\`\`\`

### 📝 AI Feedback
${feedback}

### 🔍 Code Changes Reviewed
\`\`\`diff
${diff}
\`\`\`
`;
        writeToSummary(summaryContent);

        if (isBlocker) {
            console.error('❌ Deployment stopped: AI detected CRITICAL blockers.');
            process.exit(1);
        } else {
            console.log('✅ AI review passed. Proceeding with deployment...');
            process.exit(0);
        }

    } catch (error) {
        console.error('AI Review failed with error:', error.message);
        
        let summaryContent = `## 🤖 AI Code Review (Local LLM)
        
### Status: <span style="color: red; font-weight: bold;">⚠️ ERROR</span>

**The AI review failed with the following error:**
> ${error.message}

---
### 👤 Deployment Details
* **Author**: ${commitAuthor}
* **Commit Message**:
\`\`\`
${commitMessage}
\`\`\`

*Please check the workflow logs or refer to the failover runbook to bypass if needed.*
`;
        writeToSummary(summaryContent);
        
        // Fail the workflow if the review or API call fails
        process.exit(1);
    }
}

runReview();
