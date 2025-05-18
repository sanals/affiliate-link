# Amazon Affiliate Link Converter - Cursor Instructions

## Project Setup Guide

Follow these instructions to set up and run your Amazon Affiliate Link Converter app using Cursor.

### 1. Project Initialization

First, create a new Vite React TypeScript project:

```bash
npm create vite@latest amazon-affiliate-converter -- --template react-ts
cd amazon-affiliate-converter
```

### 2. Install Dependencies

Install the required dependencies:

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install -D vite-plugin-pwa workbox-window
```

### 3. File Structure Setup

Use the provided code files to create your project structure:

- `src/utils/linkUtils.ts` - Core link conversion functionality
- `src/hooks/useCopyToClipboard.ts` - Clipboard utility hook
- `src/components/LinkConverter.tsx` - Main converter component
- `src/components/Header.tsx` - App header component
- `src/components/Footer.tsx` - App footer component
- `src/App.tsx` - Main application component
- `src/main.tsx` - Entry point
- `src/index.css` - Global styles
- `index.html` - HTML template
- `public/manifest.json` - PWA manifest
- `public/sw.js` - Service worker
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tsconfig.node.json` - Node TypeScript configuration
- `package.json` - Project metadata and dependencies
- `.eslintrc.json` - ESLint configuration
- `README.md` - Project documentation

### 4. PWA Icons

Create the following icon sizes in the `public/icons` directory:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

You can generate these icons using online tools like [RealFaviconGenerator](https://realfavicongenerator.net/).

### 5. Running the App

Start the development server:

```bash
npm run dev
```

### 6. Building for Production

Build the app for production:

```bash
npm run build
```

The output will be in the `dist` directory, ready for deployment to any static hosting service.

## Key Implementation Details

1. **Link Conversion Logic**: The core functionality lives in `linkUtils.ts` with the main function `convertToAffiliateLink` handling URL validation and transformation.

2. **User Interface**: The `LinkConverter.tsx` component provides a form for input, conversion button, and display area for the result.

3. **PWA Setup**: The app is configured as a Progressive Web App with offline capabilities, allowing installation on mobile and desktop devices.

4. **Clipboard Integration**: Custom clipboard functionality is implemented in the `useCopyToClipboard.ts` hook with fallbacks for older browsers.

5. **Error Handling**: The app validates Amazon URLs and provides appropriate error messages for invalid inputs.

6. **Responsive Design**: Material UI components ensure the app works well on both mobile and desktop devices.

## Testing Your Implementation

1. Test with various Amazon link formats:
   - Short: https://amzn.in/d/dKF9QTC
   - Full: https://www.amazon.in/WOL3D-A1-Mini-3D-Printer/dp/B0CTH7BLB9?...
   - Shortest: https://amzn.to/3F3Mh94

2. Verify that your affiliate tag "syrez-21" is correctly added to each link type.

3. Test the copy and open functionality.

4. Verify the PWA installation works on various devices.
