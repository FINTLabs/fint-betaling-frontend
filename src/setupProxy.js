const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    // Specific proxy for the configuration endpoint
    app.use(
        '/api/application/configuration',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            pathRewrite: { '^/api/application/configuration': '/api/application/configuration' },
        }),
    );

    // General proxy for all other API calls to go to localhost:8080
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            // No pathRewrite needed unless you want to modify the paths
        }),
    );
};
