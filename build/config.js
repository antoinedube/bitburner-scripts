const fileSyncJson = require('../filesync.json');
const dist = fileSyncJson['scriptsFolder'];
const scripts = 'scripts';
const allowedFiletypes = fileSyncJson['allowedFiletypes'];

module.exports = {
  dist,
  scripts,
  allowedFiletypes,
};
