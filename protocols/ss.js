const { decodeBase64 } = require('../utils');

function parse(line) {
  try {
    const raw = line.replace('ss://', '').trim();
    const [main, hash] = raw.split('#');
    const name = decodeURIComponent(hash || 'ss');
    const decoded = main.includes('@') ? main : decodeBase64(main);

    const m = decoded.match(/^(.*?):(.*?)@(.*?):(\d+)/);
    if (!m) return null;
    const [, method, password, server, port] = m;

    return [`${name} = ss`, server, port, `password=${password}`, `encrypt-method=${method}`].join(', ');
  } catch {
    return null;
  }
}

module.exports = { prefixes: ['ss://'], parse };