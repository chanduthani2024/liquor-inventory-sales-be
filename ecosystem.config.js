module.exports = {
  apps: [
    {
      name: 'nest-api',
      script: './dist/main.js',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--dns-result-order=ipv4first',
        DB_HOST: 'db.wbmhdagvgnedroltowfw.supabase.co',
        DB_PORT: '5432',
        DB_USER: 'postgres',
        DB_PASSWORD: 'Chandu@saicharan@1',
        DB_NAME: 'postgres',
      },
      env_production: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--dns-result-order=ipv4first',
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
    },
  ],
};
