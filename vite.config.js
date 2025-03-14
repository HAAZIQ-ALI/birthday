// vite.config.js
export default {
  server: {
    host: '0.0.0.0',
    port: 5000,
    fs: {
      strict: false
    },
    hmr: false
  ,
    cors: true,
    allowedHosts: [
      '925d52c6-51dc-4b1d-846c-c17a7c095737-00-1s0hcvixyaip9.janeway.replit.dev',
      'janeway.replit.dev',
      'replit.dev',
      'localhost',
      '172.31.128.55'
    ]
  }
}