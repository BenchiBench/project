const managedBlock =
`#!MANAGED-CONFIG https://project-nine-henna-78.vercel.app/index.html interval=86400 strict=true
`;

const generalBlock =
`[General]
loglevel = notify
interface = 127.0.0.1
skip-proxy = 127.0.0.1, 192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12, localhost
ipv6 = true
dns-server = 223.5.5.5
enhanced-mode-by-rule = true
udp-relay = true
`;

function buildProxyGroup(proxyNames) {
  return `[Proxy Group]
🚀 节点选择 = select, ${proxyNames.join(', ')}, 🌏 自动选择, 🔄 故障切换, DIRECT
🌏 自动选择 = url-test, ${proxyNames.join(', ')}, url=http://www.gstatic.com/generate_204, interval=300
🔄 故障切换 = fallback, ${proxyNames.join(', ')}, url=http://www.gstatic.com/generate_204, interval=180
`;
}

const ruleBlock =
`[Rule]
DOMAIN-SUFFIX,local,DIRECT
IP-CIDR,127.0.0.0/8,DIRECT
GEOIP,CN,DIRECT
FINAL,🚀 节点选择
`;

module.exports = {
  managedBlock,
  generalBlock,
  buildProxyGroup,
  ruleBlock
};
