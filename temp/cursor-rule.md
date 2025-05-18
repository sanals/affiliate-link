# React Amazon Affiliate Link Converter PWA - Cursor Rules

## 1. Project Goal
Develop a Progressive Web App (PWA) using React, TypeScript, Vite, and Material-UI that converts Amazon product links into affiliate links by appending the affiliate tag "syrez-21".

## 2. Core Features
1. **Link Input:** A text field where users can paste an Amazon product link.
2. **Link Conversion:**
   * A "Convert" button to process the input link.
   * The affiliate tag to be used is: `syrez-21`.
   * The app should handle different types of Amazon links:
       * **Short links (e.g., `https://amzn.in/d/dKF9QTC`):** Add `?tag=syrez-21`.
       * **Full links (e.g., Amazon product pages):** Add `&tag=syrez-21` or `?tag=syrez-21` as appropriate.
       * **`amzn.to` links:** Resolve to full URL first, then add the affiliate tag.
   * Validate input URLs and handle errors appropriately.
3. **Display Affiliate Link:** Show the generated affiliate link in a read-only text field.
4. **Copy Link:** Button to copy the generated affiliate link to clipboard.
5. **Open Link:** Button to open the generated affiliate link in a new browser tab.
6. **Clear Input/Output:** Reset form fields and error states.

## 3. Technical Stack & Requirements
* **Framework:** React with TypeScript
* **Build Tool:** Vite
* **UI Library:** Material-UI (MUI) v5
* **Linting:** ESLint
* **PWA:** Installable with service worker (using `vite-plugin-pwa`)
* **State Management:** React Hooks

## 4. Project Structure (Required Files)

amazon-affiliate-linker/
├── public/
│   ├── manifest.json
│   ├── icons/
│   │   ├── icon-192x192.png
│   │   └── icon-512x512.png
├── src/
│   ├── App.tsx                     # Main component with ThemeProvider and layout
│   ├── main.tsx                    # Entry point
│   ├── vite-env.d.ts               # Vite TypeScript environment types
│   ├── theme.ts                    # MUI theme configuration
│   ├── components/
│   │   └── LinkConverterCard.tsx   # Card component containing the form & buttons
│   ├── utils/
│   │   ├── linkConverter.ts        # Core link conversion logic
│   │   └── urlResolver.ts          # Logic to resolve amzn.to links
├── .eslintrc.cjs                   # ESLint configuration
├── package.json
├── tsconfig.json
└── vite.config.ts                  # Vite configuration with PWA plugin

## 5. Key Component: `LinkConverterCard.tsx`
* **State:**
    * `inputUrl: string`
    * `affiliateUrl: string`
    * `error: string | null`
    * `isLoading: boolean`
    * `notification: { open: boolean, message: string, severity: 'success' | 'error' | 'info' }`
* **UI Elements (Material-UI):**
    * `TextField` for Amazon link input
    * `Button` for "Convert Link"
    * `TextField` (read-only) for affiliate link output
    * Action buttons:
        * `Button` with icon for "Copy Link"
        * `Button` with icon for "Open in Amazon"
        * `Button` for "Clear"
    * `Snackbar` with `Alert` for notifications

## 6. Utility Functions

### `linkConverter.ts`
Must include:
* `AFFILIATE_TAG` constant set to "syrez-21"
* `generateAffiliateLink(originalUrl: string)` function that:
    * Validates input URL
    * Prepends "https://" if needed
    * Removes any existing "tag" parameter
    * Adds the affiliate tag

### `urlResolver.ts`
Must include:
* `resolveShortUrl(shortUrl: string)` async function that:
    * Resolves "amzn.to" links to their full version using fetch with redirect:follow
    * Handles errors with appropriate error messages
    * Returns the resolved URL or throws an error

## 7. PWA Configuration
* Use `vite-plugin-pwa` with `generateSW` strategy
* Configure `manifest.json` with:
    * App name: "Amazon Affiliate Linker"
    * Appropriate icons
    * Display mode: "standalone"
    * Start URL, theme color, background color

## 8. Required TypeScript Interfaces
```typescript
interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info';
}

9. Must Contain Files
enforce_file_existence:

"src/App.tsx"
"src/main.tsx"
"src/theme.ts"
"src/components/LinkConverterCard.tsx"
"src/utils/linkConverter.ts"
"src/utils/urlResolver.ts"
"public/manifest.json"
"vite.config.ts"
"package.json"
"tsconfig.json"
".eslintrc.cjs"

10. Must Contain Folders
enforce_folder_existence:

"src/components/"
"src/utils/"
"public/"
"public/icons/"