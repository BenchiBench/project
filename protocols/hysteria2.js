const { cleanName, appendIf } = require('../utils');

function parse(line) {
  try {
    line = line.replace('hy2://', 'hysteria2://');
    const u = new URL(line);

    const name = cleanName(decodeURIComponent(u.hash.slice(1)));
    const out = [
      `${name} = hysteria2`,
      u.hostname,
      u.port,
      `password=${decodeURIComponent(u.username)}`
    ];

    const params = u.searchParams;

    appendIf(out, 'sni', params.get('sni'));
    appendIf(out, 'alpn', params.get('alpn'));
    appendIf(out, 'obfs', params.get('obfs'));
    appendIf(out, 'obfs-password', params.get('obfs-password'));
    appendIf(out, 'up', params.get('up'));
    appendIf(out, 'down', params.get('down'));
    appendIf(out, 'skip-cert-verify',
      params.get('insecure') === '1' ? 'true' : 'false'
    );

    return out.join(', ');
  } catch {
    return null;
  }
}

module.exports = {
  prefixes: ['hysteria2://', 'hy2://'],
  parse
};
