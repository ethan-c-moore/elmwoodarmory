module.exports = {
    apps: [
        {
            name: 'server',
            script: 'dist/server.js',
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
};