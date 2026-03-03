const fs = require('fs');
const path = require('path');

const { managedBlock, generalBlock, buildProxyGroup, ruleBlock } = require('./config/template');

// 导入解析器
const parsers = [
  require('./protocols/vmess'),
  require('./protocols/vless'),
  require('./protocols/trojan'),
  require('./protocols/ss'),
  require('./protocols/hysteria2'),
  require('./protocols/anytls')
];

const BUILD_DIR = 'dist';
const ENTRY_FILE = './node.txt';
const OUT_FILE = path.resolve(__dirname, BUILD_DIR, 'index.html');

function parseNode(line) {
  for (const parser of parsers) {
    if (parser.prefixes.some(p => line.startsWith(p))) {
      return parser.parse(line);
    }
  }
  return null;
}

if (!fs.existsSync(BUILD_DIR)) fs.mkdirSync(BUILD_DIR);

const raw = fs.existsSync(ENTRY_FILE) ? fs.readFileSync(ENTRY_FILE, 'utf8').trim() : '';

const proxyLines = raw
  .split('\n')
  .map(l => l.trim())
  .filter(Boolean)
  .map(parseNode)
  .filter(Boolean)
  .map((l, i) => l.replace(/^([^=]+)=/, `$1_${i + 1} =`));

const proxyNames = proxyLines.map(l => l.split('=')[0].trim());

const proxyBlock = `[Proxy]\n${proxyLines.join('\n')}\n`;

const groupBlock = buildProxyGroup(proxyNames);

const result = `${managedBlock}${generalBlock}\n${proxyBlock}\n${groupBlock}\n${ruleBlock}`;

fs.writeFileSync(OUT_FILE, result, 'utf8');

console.log(`✅ 已输出 Surfboard 配置：
→ ${OUT_FILE}
节点数：${proxyLines.length}`);