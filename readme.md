# Amazon Affiliate Link Converter PWA

![Deploy Status](https://github.com/user/repo/actions/workflows/deploy.yml/badge.svg)

A Progressive Web App (PWA) built with React, TypeScript, and Material-UI that converts Amazon product links into affiliate links.

## Features

- Convert Amazon product links to affiliate links
- Support for various Amazon link formats (full URLs, short URLs)
- Copy affiliate links to clipboard
- Open the affiliate link directly in Amazon
- Installable as a PWA for offline access
- Dark mode support

## Development

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `deploy-002` branch.

## Troubleshooting

If you encounter a blank page after deployment, check for the following common issues:

1. **Path references**: Ensure all paths in HTML files use relative paths (`./`) instead of absolute paths (`/`).

2. **Resource loading**: Open the browser console (F12) and check for 404 errors. Look for missing files like scripts, CSS, or images.

3. **MIME type errors**: If you see errors like "Refused to execute script because MIME type is not executable", ensure the server is serving JavaScript files with the correct Content-Type header.

4. **GitHub Pages configuration**: Make sure your GitHub Pages settings are correctly configured to use the `gh-pages` branch.

5. **Use the diagnostic tool**: Click the "Check Domain" button in the bottom right corner to run diagnostics. This will log detailed information to the browser console that can help identify issues.

## License

This project is licensed under the MIT License.

## Author

[Syrez](https://syrez.co.in) - Amazon Affiliate Marketing

## Acknowledgements

- [Material-UI](https://mui.com/) for the UI components
- [Vite](https://vitejs.dev/) for the build tools
- [PWA](https://web.dev/progressive-web-apps/) for making the app installable
