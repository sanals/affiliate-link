# Deployment Guide for Amazon Affiliate Link Converter

This guide will walk you through the process of deploying the Amazon Affiliate Link Converter app to GitHub Pages with both the default GitHub Pages URL and a custom domain.

## Prerequisites

- A GitHub account
- Git installed on your local machine
- Node.js and npm installed
- A custom domain (optional)

## Deploying to GitHub Pages (Default URL)

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in to your account
2. Click on the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., "affiliate-link")
4. Choose whether it should be public or private
5. Click "Create repository"

### 2. Configure Your Project for GitHub Pages

1. Install the gh-pages package:
   ```
   npm install gh-pages --save-dev
   ```

2. Update your `vite.config.ts` file to set the correct base path:
   ```typescript
   base: '/affiliate-link/', // Replace with your repository name
   ```

3. Update your `package.json` file to add:
   ```json
   "homepage": "https://yourusername.github.io/affiliate-link",
   "scripts": {
     // ...existing scripts
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
   (Replace `yourusername` with your actual GitHub username)

### 3. Push Your Code to GitHub

1. Initialize git in your project (if not already done):
   ```
   git init
   ```

2. Add your repository as a remote:
   ```
   git remote add origin https://github.com/yourusername/affiliate-link.git
   ```

3. Add and commit your files:
   ```
   git add .
   git commit -m "Initial commit"
   ```

4. Push to GitHub:
   ```
   git push -u origin main
   ```

### 4. Deploy to GitHub Pages

Run the deploy command:
```
npm run deploy
```

This will: 
1. Build your app (via the predeploy script)
2. Create a gh-pages branch in your repo (if it doesn't exist)
3. Push your built files to the gh-pages branch

### 5. Enable GitHub Pages in Repository Settings

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select "gh-pages" branch
5. Click "Save"

Your site will be available at `https://yourusername.github.io/affiliate-link`

## Setting Up a Custom Domain

### 1. Purchase a Domain

Purchase a domain from any domain registrar (GoDaddy, Namecheap, Google Domains, etc.)

### 2. Configure Your Project for the Custom Domain

1. Update your `package.json` file:
   ```json
   "homepage": "https://yourdomain.com",
   ```

2. Update your `vite.config.ts` file:
   ```typescript
   base: '/', // Base path for custom domain
   ```

3. Create a `CNAME` file in the `public` directory of your project:
   ```
   yourdomain.com
   ```

4. Commit and push these changes:
   ```
   git add .
   git commit -m "Configure for custom domain"
   git push
   ```

5. Deploy to GitHub Pages again:
   ```
   npm run deploy
   ```

### 3. Configure DNS Settings

At your domain registrar, add the following DNS records:

#### For an apex domain (yourdomain.com):

Add these A records to point to GitHub's servers:
- Type: A, Host: @ (or leave blank), Value: 185.199.108.153
- Type: A, Host: @ (or leave blank), Value: 185.199.109.153
- Type: A, Host: @ (or leave blank), Value: 185.199.110.153
- Type: A, Host: @ (or leave blank), Value: 185.199.111.153

#### For www subdomain:

Add a CNAME record:
- Type: CNAME, Host: www, Value: yourusername.github.io (your GitHub Pages domain)

### 4. Configure Custom Domain in GitHub

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Custom domain", enter your domain name
5. Click "Save"
6. Check "Enforce HTTPS" (once DNS propagation is complete)

DNS changes may take 24-48 hours to fully propagate.

## Updating Your Site

To update your site after making changes:

1. Make your changes to the codebase
2. Commit them:
   ```
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. Deploy again:
   ```
   npm run deploy
   ```

## Troubleshooting

### Blank Page After Deployment

If you see a blank page:
- Make sure the base path in `vite.config.ts` matches your repository name
- Check the browser console for errors
- Verify that assets are loading correctly (check network tab)

### Custom Domain Not Working

- Verify DNS settings are correct
- Check if the CNAME file is in your gh-pages branch
- Wait for DNS propagation (can take up to 48 hours)
- Verify the custom domain is set in GitHub repository settings

### Deployment Fails

- Check if you have the correct permissions for the repository
- Verify your git remote is set correctly
- Make sure the gh-pages package is installed
- Check for any error messages in the terminal

## Remember

- The gh-pages package deploys to a separate branch in your repository
- Changes to your main branch won't automatically update your live site; you need to run `npm run deploy`
- Always test your site locally with `npm run preview` before deploying 