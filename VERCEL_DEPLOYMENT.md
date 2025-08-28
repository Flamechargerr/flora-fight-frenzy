# Vercel Deployment Guide for Flora Fight Frenzy

## Deployment URL
The game is currently deployed at: https://flora-fight-frenzy-6rrabpf22-anamay2005-gmailcoms-projects.vercel.app

## Deployment Process

### Prerequisites
1. Node.js installed (version 14 or higher)
2. NPM or Yarn package manager
3. Vercel CLI installed globally (`npm install -g vercel`)

### Initial Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd flora-fight-frenzy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

### Deployment Commands
1. Development deployment:
   ```bash
   vercel
   ```

2. Production deployment:
   ```bash
   vercel --prod
   ```

3. View deployment status:
   ```bash
   vercel ls
   ```

## Configuration

### vercel.json
The project includes a `vercel.json` configuration file with the following settings:
```json
{
  "version": 2,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Package.json Scripts
The following scripts are available in `package.json`:
- `build`: Creates a production build
- `dev`: Runs the development server
- `preview`: Previews the production build locally

## Environment Variables
No environment variables are required for this project.

## Custom Domain Setup
To set up a custom domain:
1. Go to your Vercel dashboard
2. Select the project
3. Navigate to Settings > Domains
4. Add your custom domain
5. Follow the DNS configuration instructions

## Continuous Deployment
Vercel automatically deploys changes when you push to your connected Git repository:
- Pushes to the main branch trigger production deployments
- Pushes to other branches create preview deployments

## Troubleshooting

### Build Issues
If builds fail:
1. Check the build logs in the Vercel dashboard
2. Ensure all dependencies are correctly listed in package.json
3. Verify the build command in vercel.json

### Deployment Issues
If deployment fails:
1. Check that the output directory matches your build settings
2. Verify that all required files are included in the build
3. Ensure the routes configuration is correct

### Performance Optimization
To optimize performance:
1. Use the `dist` directory for optimized builds
2. Enable Vercel's automatic static optimization
3. Use Vercel's Edge Network for global distribution

## Monitoring and Analytics
Vercel provides built-in monitoring:
- Real-time performance metrics
- Error tracking
- Visitor analytics
- Uptime monitoring

Access these features through your Vercel dashboard.

## Support
For issues with deployment:
1. Check the Vercel documentation: https://vercel.com/docs
2. Visit the Vercel community: https://vercel.com/community
3. Contact Vercel support through the dashboard