// Calls Gemini API with the PR diff and posts the review as a GitHub PR comment.
// Requires env: GEMINI_API_KEY, GITHUB_TOKEN, PR_NUMBER, REPO
const https = require('https');
const fs = require('fs');

const MAX_DIFF_CHARS = 30000;

function post(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(
      { hostname, path, method: 'POST', headers: { ...headers, 'Content-Length': Buffer.byteLength(data) } },
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

async function main() {
  const { GEMINI_API_KEY, GITHUB_TOKEN, PR_NUMBER, REPO } = process.env;

  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set');
  if (!GITHUB_TOKEN)   throw new Error('GITHUB_TOKEN is not set');
  if (!PR_NUMBER)      throw new Error('PR_NUMBER is not set');
  if (!REPO)           throw new Error('REPO is not set');

  // 1. Read diff
  let diff = '';
  try { diff = fs.readFileSync('pr_diff.txt', 'utf8').trim(); } catch {}
  if (!diff) {
    console.log('No diff found — skipping review.');
    return;
  }
  if (diff.length > MAX_DIFF_CHARS) {
    diff = diff.substring(0, MAX_DIFF_CHARS) + '\n\n...(diff truncated — too large)';
  }

  // 2. Build prompt
  const prompt = `You are a senior software engineer doing a thorough code review. Analyze the following git diff and give structured feedback covering:

1. **🔒 Security** — XSS, injection, exposed secrets, unsafe deps
2. **🧹 Code Quality** — TypeScript types, dead code, naming, complexity
3. **⚡ Performance** — unnecessary re-renders, bundle size, lazy loading
4. **🧪 Tests** — missing tests, inadequate coverage, risky untested paths

Rules:
- Write in markdown. Be concise but specific — reference file names and line context when possible.
- For each category: if nothing notable, write a single line "✅ No issues found."
- End with a short **Summary** paragraph of the most important findings (or "✅ Looks good" if clean).

\`\`\`diff
${diff}
\`\`\``;

  // 3. Call Gemini API
  console.log('Calling Gemini API...');
  const geminiRes = await post(
    'generativelanguage.googleapis.com',
    `/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    { 'Content-Type': 'application/json' },
    { contents: [{ parts: [{ text: prompt }] }] }
  );

  if (geminiRes.status !== 200) {
    throw new Error(`Gemini API error ${geminiRes.status}: ${JSON.stringify(geminiRes.body)}`);
  }

  const reviewText = geminiRes.body?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reviewText) throw new Error('Unexpected Gemini response shape: ' + JSON.stringify(geminiRes.body));

  // 4. Post PR comment
  const commentBody = `## 🤖 AI Code Review (Gemini)\n\n${reviewText}\n\n---\n*Generated automatically — treat as a suggestion, not a verdict.*`;
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

main().catch((err) => { console.error(err.message); process.exit(1); });
