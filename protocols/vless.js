const { cleanName, appendIf } = require('../utils');

function parse(line) {
  try {
    const u = new URL(line);

    const name = cleanName(decodeURIComponent(u.hash.slice(1)) || 'vless');
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

    // ================= 基础参数 =================

    appendIf(out, 'encryption', params.get('encryption') || 'none');
    appendIf(out, 'flow', params.get('flow'));

    // ================= 传输协议 =================

    const type = params.get('type') || 'tcp';
    appendIf(out, 'network', type);

    if (type === 'ws') {
      out.push('ws=true');
      appendIf(out, 'ws-path', params.get('path'));
      const wsHost = params.get('host');
      if (wsHost) out.push(`ws-headers=Host:${wsHost}`);
    }

    if (type === 'grpc') {
      appendIf(out, 'grpc-service-name', params.get('serviceName'));
    }

    if (type === 'http' || type === 'h2') {
      appendIf(out, 'http-path', params.get('path'));
      appendIf(out, 'http-host', params.get('host'));
    }

    // ================= TLS / Reality =================

    const security = params.get('security');

    if (security === 'tls' || security === 'reality') {
      out.push('tls=true');
    }

    // SNI 自动补 hostname
    appendIf(out, 'sni', params.get('sni') || host);

    appendIf(out, 'alpn', params.get('alpn'));

    // Reality 特有字段
    if (security === 'reality') {
      appendIf(out, 'reality-public-key', params.get('pbk'));
      appendIf(out, 'reality-short-id', params.get('sid'));
      appendIf(out, 'client-fingerprint', params.get('fp'));
    }

    appendIf(
      out,
      'skip-cert-verify',
      params.get('allowInsecure') === '1' ? 'true' : 'false'
    );

    return out.join(', ');
  } catch {
    return null;
  }
}

module.exports = {
  prefixes: ['vless://'],
  parse
};
