const { decodeBase64, cleanName, appendIf } = require('../utils');

function parse(line) {
  try {
    const jsonStr = decodeBase64(line.replace('vmess://', '').trim());
    const j = JSON.parse(jsonStr);

    const name = cleanName(j.ps || j.add || 'vmess');
    const out = [
      `${name} = vmess`,
      j.add,
      j.port,
      `username=${j.id}`
    ];

    appendIf(out, 'alterId', j.aid || 0);
    appendIf(out, 'cipher', j.scy);
    appendIf(out, 'network', j.net);
    appendIf(out, 'header-type', j.type);

    if (j.net === 'ws') {
      out.push('ws=true');
      appendIf(out, 'ws-path', j.path);
      if (j.host) out.push(`ws-headers=Host:${j.host}`);
    }

    if (j.tls && j.tls !== 'none') out.push('tls=true');
    appendIf(out, 'sni', j.sni || j.host);
    appendIf(out, 'alpn', j.alpn);
    appendIf(out, 'skip-cert-verify', j.allowInsecure ? 'true' : 'false');

    return out.join(', ');
  } catch {
    return null;
  }
}

module.exports = {
  prefixes: ['vmess://'],
  parse
};
