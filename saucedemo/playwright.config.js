const CONFIG = require("./config");

module.exports = {
  globalSetup: './global-setup.js',
  use: {
    baseURL: CONFIG.SAUCE_DEMO_URL,
    storageState: '.auth/session.json',
  },
};