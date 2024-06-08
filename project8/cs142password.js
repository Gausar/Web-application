
const crypto = require('crypto');

function makePasswordEntry(clearTextPassword) {
  const salt = crypto.randomBytes(8).toString('hex');
  const hash = crypto.createHash('sha1').update(clearTextPassword + salt).digest('hex');
  return { salt, hash };
}

function doesPasswordMatch(hash, salt, clearTextPassword) {
  const computedHash = crypto.createHash('sha1').update(clearTextPassword + salt).digest('hex');
  return computedHash === hash;
}

module.exports = { makePasswordEntry, doesPasswordMatch };
