module.exports = {
  apps: [{
    name: 'poster-designer',
    script: 'npm',
    args: 'run dev',
    watch: false,
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
    instances: 1,
    autorestart: true,
    max_memory_restart: '1G'
  }]
} 