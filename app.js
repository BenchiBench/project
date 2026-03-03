const path = require('path');
const fs = require('fs');
const { decodeBase64, appendIf } = require('./utils');
const { managedBlock, generalBlock, buildProxyGroup, ruleBlock } = require('./config/template');

// 导入所有协议解析器
const parsers = [
  require('./protocols/vmess'),
  require('./protocols/hysteria2'),
  require('./protocols/trojan'),
  require('./protocols/anytls'),
  require('./protocols/ss')
];

const BUILD_DIR = 'dist';
const ENTRY_FILE = './node.txt';
const OUT_FILE = path.resolve(__dirname, BUILD_DIR, 'index.html');

if (!fs.existsSync(BUILD_DIR)) fs.mkdirSync(BUILD_DIR);

const raw = fs.existsSync(ENTRY_FILE) ? fs.readFileSync(ENTRY_FILE, 'utf8').trim() : '';

function parseNode(line) {
  for (const parser of parsers) {
    if (parser.prefixes.some(p => line.startsWith(p))) return parser.parse(line);
  }
  return null;
}

// 去重逻辑
const seen = new Set();
function strictFingerprint(line) {
  const parts = line.split(',').map(p => p.trim());
  const body = parts.slice(1);
  return body.map(p => p.toLowerCase()).sort().join('|');
}

const proxyLines = raw
  .split('\n')
  .map(l => l.trim())
  .filter(Boolean)
  .map(parseNode)
  .filter(Boolean)
  .filter(line => {
    const fp = strictFingerprint(line);
    if (seen.has(fp)) return false;
    seen.add(fp);
    return true;
  });

const proxyNames = proxyLines.map(l => l.split('=')[0].trim());
const proxyBlock = `[Proxy]\n${proxyLines.join('\n')}\n`;
const groupBlock = buildProxyGroup(proxyNames);

const result = `${managedBlock}${generalBlock}\n${proxyBlock}\n${groupBlock}\n${ruleBlock}`;
fs.writeFileSync(OUT_FILE, result, 'utf8');

console.log(`✅ 已输出 Surfboard 配置 → ${OUT_FILE}，节点数：${proxyLines.length}`);