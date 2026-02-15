const { decodeBase64, cleanName } = require('../utils');

function parse(line) {
  try {
    const raw = line.replace('ss://', '').trim();
    const [mainPart, hashPart] = raw.split('#');
    const name = cleanName(decodeURIComponent(hashPart || 'ss'));

    let decoded = mainPart;
    if (!mainPart.includes('@')) {
      decoded = decodeBase64(mainPart);
    }

    const match = decoded.match(/^(.*?):(.*?)@(.*?):(\d+)/);
    if (!match) return null;

    const [, method, password, server, port] = match;

    return [
      `${name} = ss`,
      server,
      port,
      `password=${password}`,
      `encrypt-method=${method}`
    ].join(', ');
  } catch {
    return null;
  }
}

module.exports = {
  prefixes: ['ss://'],
  parse
};
