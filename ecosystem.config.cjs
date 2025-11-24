module.exports = {
  apps: [{
    name: 'landing',
    script: 'server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
