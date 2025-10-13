const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enable static file serving for HTML files
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, server) => {
    return (req, res, next) => {
      // Handle auth-callback.html requests by serving the static file
      if (req.url?.includes('/assets/web/auth-callback.html')) {
        const filePath = path.join(__dirname, 'public', 'assets', 'web', 'auth-callback.html');
        const fs = require('fs');
        
        try {
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            res.setHeader('Content-Type', 'text/html');
            res.end(content);
            return;
          }
        } catch (error) {
          console.log('Error serving auth-callback.html:', error);
        }
      }
      
      return middleware(req, res, next);
    };
  }
};

module.exports = config;