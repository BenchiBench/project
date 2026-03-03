const { appendIf } = require('../utils');

function parse(line) {
  try {
    line = line.replace('hy2://', 'hysteria2://');
    const u = new URL(line);
    const name = decodeURIComponent(u.hash.slice(1)) || 'node';
    const out = [`${name} = hysteria2`, u.hostname, u.port, `password=${decodeURIComponent(u.username)}`];

    const p = u.searchParams;
    appendIf(out, 'sni', p.get('sni'));
    appendIf(out, 'alpn', p.get('alpn'));
    appendIf(out, 'obfs', p.get('obfs'));
    appendIf(out, 'obfs-password', p.get('obfs-password'));
    appendIf(out, 'up', p.get('up'));
    appendIf(out, 'down', p.get('down'));
    appendIf(out, 'skip-cert-verify', p.get('insecure') === '1' ? 'true' : 'false');

    return out.join(', ');
  } catch {
    return null;
  }
}

module.exports = { prefixes: ['hysteria2://', 'hy2://'], parse };