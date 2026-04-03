# How to Edit Your Portfolio

## Simple Approach: Edit JSON File

All your portfolio content is in one file: `public/config.json`

## Quick Edit Workflow

1. **Open the file**
   ```bash
   # Edit in your favorite editor
   code public/config.json
   # or
   nano public/config.json
   ```

2. **Make your changes**
   - Update your name, title, bio
   - Add/remove projects
   - Update skills and experience
   - Change contact info

3. **Validate JSON** (optional but recommended)
   - Use [jsonlint.com](https://jsonlint.com)
   - Or VS Code will show errors automatically

4. **Save and deploy**
   ```bash
   git add public/config.json
   git commit -m "Update portfolio content"
   git push
   ```

5. **Done!**
   - GitHub Pages will rebuild automatically
   - Changes are live in a few minutes

## JSON Structure

### Profile Information
```json
{
  "profile": {
    "name": "Your Name",
    "title": "Your Job Title",
    "bio": "About you...",
    "avatarUrl": "/img/avatar.jpg",
    "resumeUrl": "/resume.pdf",
    "social": {
      "github": "https://github.com/username",
      "linkedin": "https://linkedin.com/in/username",
      "email": "your@email.com",
      "twitter": "https://twitter.com/username",
      "website": "https://yoursite.com"
    }
  }
}
```

### Landing Page
```json
{
  "landing": {
    "displayName": "Your Name",
    "tagline": "Your catchy tagline",
    "ctaLinks": [
      { "label": "View My Work", "target": "projects" },
      { "label": "Contact Me", "target": "contact" }
    ]
  }
}
```

### Experience
```json
{
  "experiences": [
    {
      "id": "exp-1",
      "title": "Job Title",
      "company": "Company Name",
      "startDate": "2023-01-01",
      "endDate": "",
      "color": "indigo",
      "description": "What you did..."
    }
  ]
}
```

### Skills
```json
{
  "skills": [
    {
      "id": "cat-1",
      "category": "Frontend",
      "color": "indigo",
      "items": [
        {
          "id": "skill-1",
          "name": "React",
          "proficiency": 90,
          "years": 3
        }
      ]
    }
  ]
}
```

### Projects
```json
{
  "projects": [
    {
      "id": "proj-1",
      "title": "Project Name",
      "description": "What it does...",
      "tags": ["React", "TypeScript"],
      "link": "https://project-url.com",
      "imageUrl": "/img/project.jpg"
    }
  ]
}
```

### Contact
```json
{
  "contact": {
    "email": "your@email.com",
    "phone": "+1234567890",
    "location": "City, Country",
    "social": {
      "github": "https://github.com/username",
      "linkedin": "https://linkedin.com/in/username",
      "twitter": "https://twitter.com/username",
      "website": "https://yoursite.com"
    },
    "formEndpoint": "https://formsubmit.co/your@email.com"
  }
}
```

## JSON Tips

### Important Rules:
- Use double quotes `"` not single quotes `'`
- Add commas between items (but not after the last item)
- No trailing commas
- Strings must be in quotes
- Numbers don't need quotes
- Booleans are `true` or `false` (no quotes)

### Common Mistakes:
```json
// ❌ Wrong
{
  "name": 'John',        // Single quotes
  "age": "25",           // Number as string
  "items": [1, 2, 3,]    // Trailing comma
}

// ✅ Correct
{
  "name": "John",
  "age": 25,
  "items": [1, 2, 3]
}
```

## Color Options

Available colors for experiences and skills:
- `indigo`
- `emerald`
- `violet`
- `rose`
- `amber`
- `gray`

## Testing Locally

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Validating JSON

Before pushing, validate your JSON:

1. **Online**: Copy/paste to [jsonlint.com](https://jsonlint.com)
2. **VS Code**: Install "JSON" extension (shows errors inline)
3. **Command line**: 
   ```bash
   cat public/config.json | python -m json.tool
   ```

## Deploying to GitHub Pages

Just push to your repository:
```bash
git add public/config.json
git commit -m "Update portfolio"
git push
```

GitHub Actions will automatically build and deploy.

## Backup

Keep a backup of your config:
```bash
cp public/config.json public/config.backup.json
```

Or use Git history:
```bash
git log public/config.json
git show <commit-hash>:public/config.json
```

## Need Help?

- Check `lib/types.ts` for data structure
- Look at the existing `public/config.json` for examples
- Validate JSON before committing
- Test changes locally before deploying
