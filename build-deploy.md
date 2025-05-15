# Deployment Instructions for syrez.co.in

## Building for Production

To build the Amazon Affiliate Link Converter app for production deployment to syrez.co.in:

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This will generate a `dist` folder containing the optimized production build of your application.

## Deploying to syrez.co.in

### Option 1: Manual Deployment

1. Upload the contents of the `dist` folder to your web hosting server's public directory (usually public_html or www).
2. Make sure your server is configured to serve the `index.html` file for all routes (SPA configuration).

### Option 2: FTP Deployment

1. Use an FTP client like FileZilla to connect to your hosting server.
2. Upload the contents of the `dist` folder to your website's root directory.

### Option 3: Using a Hosting Service like Netlify, Vercel, or GitHub Pages

#### Netlify

1. Create an account on [Netlify](https://www.netlify.com/)
2. Connect your GitHub repository (if you're using GitHub)
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Set any environment variables needed
4. Configure custom domain:
   - Go to Domain Settings
   - Add your custom domain: `syrez.co.in`
   - Follow the DNS instructions to point your domain to Netlify

#### Vercel

1. Create an account on [Vercel](https://vercel.com/)
2. Import your project
3. Configure the build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. Configure custom domain:
   - Go to Project Settings > Domains
   - Add your domain: `syrez.co.in`
   - Follow the DNS instructions

## DNS Configuration for syrez.co.in

To point your domain to your hosting provider:

1. Log in to your domain registrar (where you purchased syrez.co.in)
2. Navigate to the DNS settings
3. Add/update the following records:

### For most web hosting services:
- Type: A
- Name: @ (or leave blank)
- Value: [Your hosting IP address]
- TTL: 3600 (or as recommended)

### For Netlify:
- Type: A
- Name: @
- Value: 75.2.60.5 (Netlify's load balancer IP)
- TTL: 3600

- Type: CNAME
- Name: www
- Value: [your-netlify-site-name].netlify.app
- TTL: 3600

### For Vercel:
- Type: A
- Name: @
- Value: 76.76.21.21
- TTL: 3600

- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com
- TTL: 3600

## After Deployment

1. Verify your PWA is working correctly:
   - Visit your site from a mobile device
   - Check that it can be installed as a PWA
   - Test offline functionality

2. Verify your SSL certificate:
   - Make sure your site is accessible via HTTPS
   - Redirect HTTP to HTTPS

3. Submit your sitemap to search engines:
   - Google Search Console: https://search.google.com/search-console
   - Bing Webmaster Tools: https://www.bing.com/webmasters/about

4. Test your site's performance:
   - Use [Google PageSpeed Insights](https://pagespeed.web.dev/) to check performance
   - Make optimizations as needed

## Troubleshooting

### Problem: 404 errors when refreshing the page
Solution: Configure your server with proper redirects for a single-page application. Create a `_redirects` file in the public folder with:
```
/* /index.html 200
```

### Problem: PWA not working
Solution: Verify the service worker is registered correctly. Check browser developer tools for errors.

### Problem: CORS errors when resolving amzn.to links
Solution: Consider setting up a simple proxy server on your hosting if needed to resolve CORS issues with Amazon links. 