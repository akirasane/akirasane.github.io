const { execSync } = require('child_process');

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
    let modelName = 'local-model';
    try {
        console.log('Detecting loaded model from LM Studio...');
        const modelsResponse = await fetch('https://llmapi.omelettesalmon.com/api/v1/models', {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json'
            }
        });
        if (modelsResponse.ok) {
            const modelsData = await modelsResponse.ok ? await modelsResponse.json() : null;
            if (modelsData && modelsData.data && modelsData.data.length > 0) {
                modelName = modelsData.data[0].id;
                console.log(`Detected loaded model: ${modelName}`);
            }
        }
    } catch (err) {
        console.log(`Failed to query models endpoint (${err.message}). Using fallback model name.`);
    }

    console.log('Sending changes to LM Studio API for code review...');
    const prompt = `You are a professional AI Code Reviewer. Review the following code changes for a Next.js web application.
Analyze it for:
1. Critical bugs or syntax errors (e.g. unclosed tags, broken JS scripts, React hydration errors, incorrect hook dependencies).
2. Security issues (e.g. XSS risks, insecure dependencies, exposed secrets).
3. SEO improvements (missing meta tags, alt tags, heading hierarchy, semantic HTML).
4. Styling defects or non-responsive layout issues (Tailwind CSS classes, layout shifts).

If you find any CRITICAL blockers that should STOP the deployment, you must explicitly start the feedback line with '[BLOCKER]'.
Otherwise, write constructive recommendations.

Code Changes to Review:
\`\`\`diff
${diff}
\`\`\`

Review Report (Keep it concise, in Markdown format):`;

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
        const feedback = data.choices?.[0]?.message?.content;

        if (!feedback) {
            throw new Error('Empty response from LM Studio API.');
        }

        console.log('\n--- AI CODE REVIEW REPORT (LM Studio) ---');
        console.log(feedback);
        console.log('-----------------------------------------\n');

        if (feedback.includes('[BLOCKER]')) {
            console.error('❌ Deployment stopped: AI detected CRITICAL blockers.');
            process.exit(1);
        } else {
            console.log('✅ AI review passed. Proceeding with deployment...');
            process.exit(0);
        }

    } catch (error) {
        console.error('AI Review failed with error:', error.message);
        // Fail the workflow if the review or API call fails
        process.exit(1);
    }
}

runReview();
