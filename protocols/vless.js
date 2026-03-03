const { appendIf } = require('../utils');

function parse(line) {
  try {
    const u = new URL(line);
    const name = decodeURIComponent(u.hash.slice(1) || 'vless').trim();
    const uuid = decodeURIComponent(u.username);
    const host = u.hostname;
    const port = u.port;
    const params = u.searchParams;

    const out = [
      `${name} = vless`,
      host,
      port,
      `username=${uuid}`
    ];

    appendIf(out, 'encryption', params.get('encryption') || 'none');
    appendIf(out, 'flow', params.get('flow'));

    const type = params.get('type') || 'tcp';
    appendIf(out, 'network', type);

    if (type === 'ws') {
      out.push('ws=true');
      appendIf(out, 'ws-path', params.get('path'));
      if (params.get('host')) out.push(`ws-headers=Host:${params.get('host')}`);
    }

    if (type === 'grpc') appendIf(out, 'grpc-service-name', params.get('serviceName'));
    if (type === 'http' || type === 'h2') {
      appendIf(out, 'http-path', params.get('path'));
      appendIf(out, 'http-host', params.get('host'));
    }

    const security = params.get('security');
    if (security === 'tls' || security === 'reality') out.push('tls=true');
    appendIf(out, 'sni', params.get('sni') || host);
    appendIf(out, 'alpn', params.get('alpn'));

    if (security === 'reality') {
      appendIf(out, 'reality-public-key', params.get('pbk'));
      appendIf(out, 'reality-short-id', params.get('sid'));
      appendIf(out, 'client-fingerprint', params.get('fp'));
    }

    appendIf(out, 'skip-cert-verify', params.get('allowInsecure') === '1' ? 'true' : 'false');

    return out.join(', ');
  } catch {
    return null;
  }
}

module.exports = {
  prefixes: ['vless://'],
  parse
};