# Quick Editing Guide

## Where to Edit

All portfolio content is in: **`public/config.json`**

## Quick Steps

1. Edit `public/config.json`
2. Save changes
3. Commit and push
4. GitHub Pages auto-deploys

## Example: Update Your Name

```json
{
  "profile": {
    "name": "Your Name Here",
    "title": "Your Title",
    "bio": "About you..."
  }
}
```

## Example: Add a Project

```json
{
  "projects": [
    {
      "id": "proj-3",
      "title": "My New Project",
      "description": "What it does",
      "tags": ["React", "Node.js"],
      "link": "https://github.com/username/project",
      "imageUrl": ""
    }
  ]
}
```

## Deploy

```bash
git add public/config.json
git commit -m "Update portfolio"
git push
```

Done! Changes will be live in 2-3 minutes.

## Why JSON?

- ✅ Easy to edit (just text)
- ✅ No code knowledge needed
- ✅ Can use any text editor
- ✅ Changes are immediate after deploy
- ✅ Can validate with JSON validators

## Validate Your JSON

Before committing, make sure your JSON is valid:
- Use [jsonlint.com](https://jsonlint.com)
- Or use VS Code (shows errors automatically)

## Full Documentation

See `HOW_TO_EDIT.md` for detailed instructions on editing all sections.
