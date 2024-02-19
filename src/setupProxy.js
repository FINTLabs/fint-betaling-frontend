const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    // Function to log the request details
    const logRequest = (pathname, req) => {
        // eslint-disable-next-line no-console
        console.log(new Date().toISOString(), `Proxied request: ${req.method} ${pathname} -> ${req.target}`);
    };

    // Specific proxy for the configuration endpoint
    app.use(
        '/api/application/configuration',
        createProxyMiddleware({
            target: 'http://localhost:8000',
            changeOrigin: true,
            pathRewrite: {'^/api/application/configuration': '/api/application/configuration' },
        })
    );

    app.use('/api/claim', createProxyMiddleware({
        target: 'http://localhost:8080/',
        pathRewrite: { '^/api1': '' },
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
            logRequest('/api/claim', { method: proxyReq.method, target: 'http://localhost:8080/' });
        },
    }));

    app.use('/api/me', createProxyMiddleware({
        target: 'http://localhost:8080/',
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
            logRequest('/api/me', { method: proxyReq.method, target: 'http://localhost:8080/' });
        },
    }));
};