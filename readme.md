# Amazon Affiliate Link Converter

A Progressive Web App (PWA) for converting Amazon product links to affiliate links.

## Features

- Convert Amazon product links to affiliate links
- Supports different Amazon link formats
- PWA with offline support
- Responsive design using Material-UI
- Copy and open converted links

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to GitHub Pages

This app is configured to deploy to GitHub Pages. The deployment process ensures all asset paths use relative URLs (starting with `./`) rather than absolute paths, which is crucial for proper functioning.

### Automatic Deployment

Push to the `deploy-002` branch to trigger the GitHub Actions workflow that will:

1. Build the application
2. Process all paths to ensure they're relative
3. Add necessary files (.nojekyll)
4. Deploy to the gh-pages branch

### Manual Deployment

To deploy manually:

1. Build the application: `npm run build`
2. Ensure the post-build script has run to fix paths: `node scripts/post-build.js`
3. Deploy the `dist` directory to your hosting service

### Troubleshooting Blank Pages

If you encounter blank pages after deployment:

1. Check that all asset paths in the HTML files use relative paths (`./`) rather than absolute paths (`/`)
2. Ensure the `.nojekyll` file exists in the root of your deployed site
3. Clear browser cache and service workers: In Chrome DevTools → Application → Clear storage

## Using a Custom Domain (Optional)

To use a custom domain with this deployment:

1. Uncomment the CNAME-related code in `scripts/post-build.js`
2. Uncomment the CNAME verification in `.github/workflows/deploy.yml`
3. Create a `CNAME` file in the root with your domain name
4. Update your DNS settings to point to GitHub Pages

To revert git changes for these files:
```bash
git checkout HEAD -- scripts/post-build.js
git checkout HEAD -- .github/workflows/deploy.yml
```

## Notes on Path Management

This project includes a special `post-build.js` script that automatically converts:

- Absolute paths (`/assets/...`) to relative paths (`./assets/...`)
- GitHub Pages paths (`/[repo-name]/assets/...`) to relative paths (`./assets/...`)
- Base64-encoded manifest data that contains absolute path references

This ensures that the app works correctly when deployed to GitHub Pages.

## License

This project is licensed under the MIT License.

## Author

[Syrez](https://syrez.co.in) - Amazon Affiliate Marketing

## Acknowledgements

- [Material-UI](https://mui.com/) for the UI components
- [Vite](https://vitejs.dev/) for the build tools
- [PWA](https://web.dev/progressive-web-apps/) for making the app installable
