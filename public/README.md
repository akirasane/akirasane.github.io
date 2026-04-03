# Public Assets

This folder contains static files served directly by your website.

## Important Files

### config.json
**This is where you edit your portfolio content!**

Edit this file to update:
- Your name and bio
- Work experience
- Skills
- Projects
- Contact information

See `../EDITING_GUIDE.md` for quick instructions.

## Other Files

- `img/` - Images (avatar, project screenshots, etc.)
- `*.svg` - Icon files
- Other static assets

## Adding Images

1. Add your image to `public/img/`
2. Reference it in `config.json`:
   ```json
   "avatarUrl": "/img/your-photo.jpg"
   ```

Note: Paths start with `/` (e.g., `/img/photo.jpg` not `img/photo.jpg`)
