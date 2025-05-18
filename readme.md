# Syrez Amazon Affiliate Link Converter

A Progressive Web App (PWA) that allows users to easily convert Amazon product links into affiliate links with your unique affiliate tag.

Live demo: [https://syrez.co.in](https://syrez.co.in)

## Features

- **Convert Amazon Links** to affiliate links with the tag "syrez-21"
- **Supports Multiple Link Types**:
  - Short links (amzn.in/d/...)
  - Full links (amazon.in/...)
  - Shortest links (amzn.to/...)
- **Progressive Web App** - installable on mobile and desktop devices
- **Responsive Design** - works on all screen sizes
- **Dark/Light Mode** - automatic or manual theme selection
- **Offline Support** - works without an internet connection
- **Share Feature** - easily share affiliate links
- **Copy to Clipboard** - one-click copy functionality
- **Open in Amazon** - directly open the affiliate link in Amazon

## Tech Stack

- **React** - UI library
- **TypeScript** - type-safe JavaScript
- **Vite** - build tool and dev server
- **Material UI** - UI component library
- **PWA** - progressive web app support
- **Service Worker** - for offline capability

## Development

### Prerequisites

- Node.js (v16+)
- npm (v7+)

### Installation

```bash
# Clone the repository
git clone https://github.com/syrez/affiliate-link.git
cd affiliate-link

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Build for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## Deployment

See [build-deploy.md](build-deploy.md) for detailed deployment instructions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

[Syrez](https://syrez.co.in) - Amazon Affiliate Marketing

## Acknowledgements

- [Material-UI](https://mui.com/) for the UI components
- [Vite](https://vitejs.dev/) for the build tools
- [PWA](https://web.dev/progressive-web-apps/) for making the app installable
