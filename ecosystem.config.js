module.exports = {
  apps: [
    {
      name: 'esim-backend',
      script: './backend/dist/index.js',
      cwd: '/var/www/esimviet.com',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      error_file: '/var/log/pm2/esim-backend-error.log',
      out_file: '/var/log/pm2/esim-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      name: 'esim-frontend',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/esimviet.com/frontend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/pm2/esim-frontend-error.log',
      out_file: '/var/log/pm2/esim-frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
