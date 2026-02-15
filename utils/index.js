const decodeBase64 = s => {
  try {
    if (!s) return '';
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    const pad = s.length % 4;
    if (pad) s += '='.repeat(4 - pad);
    return Buffer.from(s, 'base64').toString();
  } catch {
    return '';
  }
};

const cleanName = name => {
  let raw = decodeURIComponent((name || 'node'))
    .replace(/[\r\n\t]/g, '')
    .trim();
  raw = raw
    .replace(/[^\w\-\u4e00-\u9fa5]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  return raw || 'node';
};

const appendIf = (arr, key, val) => {
  if (val !== undefined && val !== null && val !== '')
    arr.push(`${key}=${val}`);
};

module.exports = {
  decodeBase64,
  cleanName,
  appendIf
};
