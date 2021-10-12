module.exports = {
  DATABASE: {
    MONGO_HOSTNAME: process.env.MONGO_HOSTNAME,
    MONGO_PORT: process.env.MONGO_PORT,
    MONGO_DB: process.env.MONGO_DB,
  },
  EMAIL_CONF: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_HOST,
      pass: process.env.EMAIL_PASS,
    },
  },
  PAGE_SIZE: 10,
  LOGIN_EXPIRES_IN: '48h',
  EMAIL_VERIFICATION_EXPIRES_IN: '1h',
};
