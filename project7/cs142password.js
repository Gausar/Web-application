
const crypto = require('crypto');

function makePasswordEntry(TextPassword) {
  const salt = crypto.randomBytes(8).toString('hex');
  const hash = crypto.createHash('sha1').update(TextPassword + salt).digest('hex');
  return { salt, hash };
}


function doesPasswordMatch(hash, salt, TextPassword) {
  const computedHash = crypto.createHash('sha1').update(TextPassword + salt).digest('hex');
  return computedHash === hash;
}

module.exports = { makePasswordEntry, doesPasswordMatch };
