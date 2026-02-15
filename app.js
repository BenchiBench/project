const fs = require('fs');
const path = require('path');

const BUILD_DIR = 'dist';
const ENTRY_FILE = './node.txt';
const OUT_FILE = path.resolve(__dirname, BUILD_DIR, 'index.html');

// 自动加载协议
const protocolsDir = path.resolve(__dirname, 'protocols');
const protocolFiles = fs.readdirSync(protocolsDir);

const protocolMap = {};

for (const file of protocolFiles) {
  const mod = require(path.join(protocolsDir, file));
  mod.prefixes.forEach(prefix => {
    protocolMap[prefix] = mod.parse;
  });
}

function parseNode(line) {
  for (const prefix in protocolMap) {
    if (line.startsWith(prefix)) {
      return protocolMap[prefix](line);
    }
  }
  return null;
}

if (!fs.existsSync(BUILD_DIR))
  fs.mkdirSync(BUILD_DIR);

const raw = fs.readFileSync(ENTRY_FILE, 'utf8').trim();

const proxyLines = raw
  .split('\n')
  .map(l => l.trim())
  .filter(Boolean)
  .map(parseNode)
  .filter(Boolean)
  .map((l, i) => l.replace(/^([^=]+)=/, `$1_${i + 1} =`));

const proxyNames = proxyLines.map(l => l.split('=')[0].trim());

const {
  managedBlock,
  generalBlock,
  buildProxyGroup,
  ruleBlock
} = require('./config/template');

const proxyBlock = `[Proxy]\n${proxyLines.join('\n')}\n`;

const result =
  managedBlock +
  generalBlock +
  proxyBlock +
  buildProxyGroup(proxyNames) +
  ruleBlock;

fs.writeFileSync(OUT_FILE, result);

console.log(`✅ 构建完成：${proxyLines.length} 个节点`);
