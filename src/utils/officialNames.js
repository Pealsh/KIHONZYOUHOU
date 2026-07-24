// 基本情報技術者試験でよく出る略語 → 正式名称
const OFFICIAL_NAMES = {
  API: 'Application Programming Interface',
  CDN: 'Content Delivery Network',
  CI: 'Continuous Integration',
  CD: 'Continuous Delivery / Continuous Deployment',
  CPU: 'Central Processing Unit',
  CSRF: 'Cross-Site Request Forgery',
  CSS: 'Cascading Style Sheets',
  DNS: 'Domain Name System',
  DOM: 'Document Object Model',
  FIFO: 'First In First Out',
  LIFO: 'Last In First Out',
  GPL: 'GNU General Public License',
  AGPL: 'GNU Affero General Public License',
  BSD: 'Berkeley Software Distribution',
  MIT: 'Massachusetts Institute of Technology License',
  HTML: 'HyperText Markup Language',
  HTTP: 'HyperText Transfer Protocol',
  HTTPS: 'HyperText Transfer Protocol Secure',
  IP: 'Internet Protocol',
  ISP: 'Internet Service Provider',
  JWT: 'JSON Web Token',
  MVC: 'Model-View-Controller',
  MVVM: 'Model-View-ViewModel',
  OLAP: 'Online Analytical Processing',
  OLTP: 'Online Transaction Processing',
  OS: 'Operating System',
  PGP: 'Pretty Good Privacy',
  POP3: 'Post Office Protocol version 3',
  QR: 'Quick Response',
  RAID: 'Redundant Array of Independent Disks',
  SEO: 'Search Engine Optimization',
  SJF: 'Shortest Job First',
  SLA: 'Service Level Agreement',
  SMTP: 'Simple Mail Transfer Protocol',
  SQL: 'Structured Query Language',
  SRAM: 'Static Random Access Memory',
  SSH: 'Secure Shell',
  SSL: 'Secure Sockets Layer',
  TLS: 'Transport Layer Security',
  TCP: 'Transmission Control Protocol',
  UDP: 'User Datagram Protocol',
  URI: 'Uniform Resource Identifier',
  URL: 'Uniform Resource Locator',
  UTC: 'Coordinated Universal Time',
  VPN: 'Virtual Private Network',
  WBS: 'Work Breakdown Structure',
  DBMS: 'Database Management System',
  RDB: 'Relational Database',
  RDBMS: 'Relational Database Management System',
  ERP: 'Enterprise Resource Planning',
  CRM: 'Customer Relationship Management',
  SCM: 'Supply Chain Management',
  BCP: 'Business Continuity Plan',
  BCM: 'Business Continuity Management',
  BIA: 'Business Impact Analysis',
  PDCA: 'Plan-Do-Check-Act',
  KPI: 'Key Performance Indicator',
  ROI: 'Return On Investment',
  TCO: 'Total Cost of Ownership',
  EVM: 'Earned Value Management',
  PV: 'Planned Value（計画価値）',
  EV: 'Earned Value（出来高）',
  AC: 'Actual Cost（実コスト）',
  SV: 'Schedule Variance（スケジュール差異）',
  CV: 'Cost Variance（コスト差異）',
  SPI: 'Schedule Performance Index',
  CPI: 'Cost Performance Index',
  PMBOK: 'Project Management Body of Knowledge',
  UML: 'Unified Modeling Language',
  NAT: 'Network Address Translation',
  DHCP: 'Dynamic Host Configuration Protocol',
  ARP: 'Address Resolution Protocol',
  ICMP: 'Internet Control Message Protocol',
  MAC: 'Media Access Control',
  AES: 'Advanced Encryption Standard',
  DES: 'Data Encryption Standard',
  RSA: 'Rivest–Shamir–Adleman',
  PKI: 'Public Key Infrastructure',
  IDS: 'Intrusion Detection System',
  IPS: 'Intrusion Prevention System',
  WAF: 'Web Application Firewall',
  SSD: 'Solid State Drive',
  HDD: 'Hard Disk Drive',
  GPU: 'Graphics Processing Unit',
  RAM: 'Random Access Memory',
  BIOS: 'Basic Input/Output System',
  IoT: 'Internet of Things',
  AI: 'Artificial Intelligence',
  XML: 'eXtensible Markup Language',
  JSON: 'JavaScript Object Notation',
  FTP: 'File Transfer Protocol',
  IMAP: 'Internet Message Access Protocol',
  NTP: 'Network Time Protocol',
  CRUD: 'Create Read Update Delete',
  DevOps: 'Development and Operations',
  SaaS: 'Software as a Service',
  PaaS: 'Platform as a Service',
  IaaS: 'Infrastructure as a Service',
  OSI: 'Open Systems Interconnection',
  LAN: 'Local Area Network',
  WAN: 'Wide Area Network',
  MAN: 'Metropolitan Area Network',
  XSS: 'Cross-Site Scripting',
  DoS: 'Denial of Service',
  DDoS: 'Distributed Denial of Service',
  MFA: 'Multi-Factor Authentication',
  OTP: 'One-Time Password',
  SSO: 'Single Sign-On',
  LDAP: 'Lightweight Directory Access Protocol',
  NFS: 'Network File System',
  SAN: 'Storage Area Network',
  NAS: 'Network Attached Storage',
  VLAN: 'Virtual Local Area Network',
  QoS: 'Quality of Service',
  MTBF: 'Mean Time Between Failures',
  MTTR: 'Mean Time To Repair',
  MTTF: 'Mean Time To Failure',
  RTO: 'Recovery Time Objective',
  RPO: 'Recovery Point Objective',
  SWOT: 'Strengths Weaknesses Opportunities Threats',
  BSC: 'Balanced Scorecard',
  CSF: 'Critical Success Factor',
  KGI: 'Key Goal Indicator',
  BYOD: 'Bring Your Own Device',
  MDM: 'Master Data Management',
  ETL: 'Extract Transform Load',
  DWH: 'Data Warehouse',
  BI: 'Business Intelligence',
  CGI: 'Common Gateway Interface',
  REST: 'Representational State Transfer',
  SOAP: 'Simple Object Access Protocol',
  IDE: 'Integrated Development Environment',
  JVM: 'Java Virtual Machine',
  GC: 'Garbage Collection',
  OOP: 'Object-Oriented Programming',
  CASE: 'Computer Aided Software Engineering',
  RAD: 'Rapid Application Development',
  XP: 'Extreme Programming',
  CMMI: 'Capability Maturity Model Integration',
  ITIL: 'Information Technology Infrastructure Library',
  COBIT: 'Control Objectives for Information and Related Technology',
  ISMS: 'Information Security Management System',
  SOC: 'Security Operation Center',
  SIEM: 'Security Information and Event Management',
};

/**
 * 選択肢の正式名称を取得する
 * @param {object} question - 問題オブジェクト
 * @param {number} index - 選択肢インデックス
 * @returns {string|null} 正式名称（なければ null）
 */
export function getOfficialName(question, index) {
  // 問題データに明示的な正式名称がある場合
  if (question.choiceFullNames && question.choiceFullNames[index]) {
    return question.choiceFullNames[index];
  }

  const choice = (question.choices[index] || '').trim();

  // 選択肢全体が略語の場合
  if (OFFICIAL_NAMES[choice]) {
    return OFFICIAL_NAMES[choice];
  }

  // 大文字略語のみの場合（前後空白除去済み）
  const upper = choice.toUpperCase();
  if (OFFICIAL_NAMES[upper] && choice === upper) {
    return OFFICIAL_NAMES[upper];
  }

  // 「略語（説明）」形式ですでに正式名称がある場合はスキップ
  if (/[（(].+[）)]/.test(choice)) {
    return null;
  }

  // 選択肢内の単独略語を検出（単語境界）
  const match = choice.match(/\b([A-Z][A-Z0-9]{1,})\b/);
  if (match && OFFICIAL_NAMES[match[1]]) {
    // 選択肢が略語そのものに近い場合のみ返す
    if (choice === match[1] || choice.length <= match[1].length + 2) {
      return OFFICIAL_NAMES[match[1]];
    }
  }

  return null;
}
