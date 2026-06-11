// Calls LM Studio API with the PR diff and posts the review as a GitHub PR comment.
// Requires env: LOCAL_AI_API_KEY, GITHUB_TOKEN, PR_NUMBER, REPO
const https = require('https');
const fs = require('fs');

const MAX_DIFF_CHARS = 30000;

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

function post(hostname, path, headers, body, port = 443) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(
      { hostname, path, method: 'POST', port, headers: { ...headers, 'Content-Length': Buffer.byteLength(data) } },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => { raw += chunk; });
        res.on('end', () => {
          try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
          catch { resolve({ status: res.statusCode, body: raw }); }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(hostname, path, headers, port = 443) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname, path, method: 'GET', port, headers },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => { raw += chunk; });
        res.on('end', () => {
          try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
          catch { resolve({ status: res.statusCode, body: raw }); }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  const { LOCAL_AI_API_KEY, GITHUB_TOKEN, PR_NUMBER, REPO } = process.env;

  if (!LOCAL_AI_API_KEY) throw new Error('LOCAL_AI_API_KEY is not set');
  if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN is not set');
  if (!PR_NUMBER) throw new Error('PR_NUMBER is not set');
  if (!REPO) throw new Error('REPO is not set');

  // 1. Read diff
  let diff = '';
  try { diff = fs.readFileSync('pr_diff.txt', 'utf8').trim(); } catch { }
  if (!diff) {
    console.log('No diff found — skipping review.');
    return;
  }
  if (diff.length > MAX_DIFF_CHARS) {
    diff = diff.substring(0, MAX_DIFF_CHARS) + '\n\n...(diff truncated — too large)';
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

  // 2. Build prompt
  let prompt = `You are a senior software engineer doing a thorough code review. Analyze the following git diff and give structured feedback covering:

1. **🔒 Security** — XSS, injection, exposed secrets, unsafe deps
2. **🧹 Code Quality** — TypeScript types, dead code, naming, complexity
3. **⚡ Performance** — unnecessary re-renders, bundle size, lazy loading
4. **🧪 Tests** — missing tests, inadequate coverage, risky untested paths`;

  if (customRules) {
    prompt += `\n\nAdditionally, you MUST strictly enforce the following project-specific coding conventions and rules:\n${customRules}`;
  }

  prompt += `\n\nRules:
- Write in markdown. Be concise but specific — reference file names and line context when possible.
- For each category: if nothing notable, write a single line "✅ No issues found."
- End with a short **Summary** paragraph of the most important findings (or "✅ Looks good" if clean).

\`\`\`diff
${diff}
\`\`\``;

  // 3. Detect model loaded in LM Studio
  let modelName = 'google/gemma-4-12b-qat';
  try {
    console.log('Detecting loaded model from LM Studio...');
    const modelsRes = await get(
      'llmapi.omelettesalmon.com',
      '/api/v1/models',
      {
        'Authorization': `Bearer ${LOCAL_AI_API_KEY}`,
        'Accept': 'application/json'
      }
    );
    if (modelsRes.status === 200) {
      console.log('Available models from LM Studio:', JSON.stringify(modelsRes.body));
      const list = modelsRes.body?.models || modelsRes.body?.data || [];
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
      console.log(`Failed to query models endpoint: HTTP ${modelsRes.status}. Using default fallback: ${modelName}`);
    }
  } catch (err) {
    console.log(`Failed to query models endpoint (${err.message}). Using fallback model name: ${modelName}`);
  }

  // 4. Call LM Studio API
  console.log('Calling LM Studio API...');
  const lmRes = await post(
    'llmapi.omelettesalmon.com',
    '/api/v1/chat',
    {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LOCAL_AI_API_KEY}`
    },
    {
      model: modelName,
      input: prompt
    }
  );

  if (lmRes.status !== 200) {
    throw new Error(`LM Studio API error ${lmRes.status}: ${JSON.stringify(lmRes.body)}`);
  }

  let reviewText = '';
  if (lmRes.body?.choices?.[0]?.message?.content) {
    reviewText = lmRes.body.choices[0].message.content;
  } else if (lmRes.body?.output && Array.isArray(lmRes.body.output)) {
    const msgObj = lmRes.body.output.find(item => item.type === 'message');
    if (msgObj) {
      reviewText = msgObj.content;
    }
  }

  if (!reviewText) throw new Error('Unexpected LM Studio response shape: ' + JSON.stringify(lmRes.body));

  // Write to GITHUB_STEP_SUMMARY if available
  let summaryContent = `## 🤖 AI Code Review (Local PR Review)
  
### 📝 AI Feedback
${reviewText}

### 🔍 Code Changes Reviewed
\`\`\`diff
${diff}
\`\`\`
`;
  writeToSummary(summaryContent);

  // 5. Post PR comment
  const commentBody = `## 🤖 AI Code Review (Local LLM)\n\n${reviewText}\n\n---\n*Generated automatically — treat as a suggestion, not a verdict.*`;
  const [owner, repoName] = REPO.split('/');

  console.log(`Posting comment to PR #${PR_NUMBER}...`);
  const ghRes = await post(
    'api.github.com',
    `/repos/${owner}/${repoName}/issues/${PR_NUMBER}/comments`,
    {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'User-Agent': 'ai-review-bot',
      'Accept': 'application/vnd.github+json',
    },
    { body: commentBody }
  );

  if (ghRes.status !== 201) {
    throw new Error(`GitHub API error ${ghRes.status}: ${JSON.stringify(ghRes.body)}`);
  }

  console.log('Review posted successfully:', ghRes.body.html_url);
}

main().catch((err) => {
  console.error(err.message);
  let summaryContent = `## 🤖 AI Code Review (Local PR Review)
  
### Status: <span style="color: red; font-weight: bold;">⚠️ ERROR</span>

**The AI review failed with the following error:**
> ${err.message}
`;
  writeToSummary(summaryContent);
  process.exit(1);
});
