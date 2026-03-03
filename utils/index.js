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

const appendIf = (arr, key, val) => {
  if (val !== undefined && val !== null && val !== '')
    arr.push(`${key}=${val}`);
};

module.exports = {
  decodeBase64,
  appendIf
};