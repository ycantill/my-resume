# GitHub Pages Configuration

This directory contains configuration files for GitHub Pages deployment.

## Files:

- **deploy.yml**: GitHub Actions workflow for automated deployment

## Configuration:

To configure for GitHub Pages deployment:

1. Update `vite.config.js`:

   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/my-resume/' : '/';
   ```

2. Update `public/404.html`:
   - Change the base path in the JavaScript redirect
   - Update the link href to match your repository

3. Configure GitHub repository:
   - Go to Settings > Pages
   - Set Source to "GitHub Actions"
