const { cleanName, appendIf } = require('../utils');

function parse(line) {
  try {
    const u = new URL(line);

    const name = cleanName(decodeURIComponent(u.hash.slice(1)));
    const out = [
      `${name} = anytls`,
      u.hostname,
      u.port,
      `password=${decodeURIComponent(u.username)}`
    ];

    appendIf(out, 'sni', u.searchParams.get('sni'));
    appendIf(out, 'alpn', u.searchParams.get('alpn'));
    appendIf(out, 'skip-cert-verify',
      u.searchParams.get('insecure') === '1' ? 'true' : 'false'
    );

    return out.join(', ');
  } catch {
    return null;
  }
}

module.exports = {
  prefixes: ['anytls://'],
  parse
};
