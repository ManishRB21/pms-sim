const path = require('path');

module.exports = {
  apps: [
    {
      name: 'pms-simulator',
      script: path.resolve(process.cwd(), './dist/pms.app.js'),
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
