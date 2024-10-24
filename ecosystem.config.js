module.exports = {
  apps: [
    {
      name: 'amfi-faceadmin',
      script: './index.js',
      instances: 4,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
      watch: true,
    },
  ],
};
