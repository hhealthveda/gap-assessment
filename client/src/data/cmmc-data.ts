// CMMC Level 1 Controls (17 controls)
export const cmmcLevel1Controls = [
  // Access Control (AC) Domain
  {
    id: "AC.1.001",
    name: "Access Control",
    description: "Limit information system access to authorized users, processes acting on behalf of authorized users, or devices (including other information systems).",
    domain: "AC"
  },
  {
    id: "AC.1.002",
    name: "Limit Access to Transactions",
    description: "Limit information system access to the types of transactions and functions that authorized users are permitted to execute.",
    domain: "AC"
  },
  {
    id: "AC.1.003",
    name: "Verify and Control Connections",
    description: "Verify and control/limit connections to and use of external information systems.",
    domain: "AC"
  },
  {
    id: "AC.1.004",
    name: "Control Flow of CUI",
    description: "Control information flows between security domains on connected systems.",
    domain: "AC"
  },
  
  // Identification and Authentication (IA) Domain
  {
    id: "IA.1.076",
    name: "Identify Information System Users",
    description: "Identify information system users, processes acting on behalf of users, or devices.",
    domain: "IA"
  },
  {
    id: "IA.1.077",
    name: "Authenticate Users",
    description: "Authenticate (or verify) the identities of those users, processes, or devices, as a prerequisite to allowing access to organizational information systems.",
    domain: "IA"
  },
  
  // Media Protection (MP) Domain
  {
    id: "MP.1.118",
    name: "Media Sanitization",
    description: "Sanitize or destroy information system media containing Federal Contract Information before disposal or release for reuse.",
    domain: "MP"
  },
  
  // Physical Protection (PE) Domain
  {
    id: "PE.1.131",
    name: "Limit Physical Access",
    description: "Limit physical access to organizational information systems, equipment, and the respective operating environments to authorized individuals.",
    domain: "PE"
  },
  {
    id: "PE.1.132",
    name: "Escort Visitors",
    description: "Escort visitors and monitor visitor activity.",
    domain: "PE"
  },
  {
    id: "PE.1.133",
    name: "Maintain Visitor Logs",
    description: "Maintain audit logs of physical access.",
    domain: "PE"
  },
  {
    id: "PE.1.134",
    name: "Control Physical Devices",
    description: "Control and manage physical access devices.",
    domain: "PE"
  },
  
  // System and Communications Protection (SC) Domain
  {
    id: "SC.1.175",
    name: "Monitor and Control Communications",
    description: "Monitor, control, and protect organizational communications (i.e., information transmitted or received by organizational information systems) at the external boundaries and key internal boundaries of the information systems.",
    domain: "SC"
  },
  {
    id: "SC.1.176",
    name: "Implement Subnetworks",
    description: "Implement subnetworks for publicly accessible system components that are physically or logically separated from internal networks.",
    domain: "SC"
  },
  
  // System and Information Integrity (SI) Domain
  {
    id: "SI.1.210",
    name: "Identify and Fix Vulnerabilities",
    description: "Identify, report, and correct information and information system flaws in a timely manner.",
    domain: "SI"
  },
  {
    id: "SI.1.211",
    name: "Protection From Malicious Code",
    description: "Provide protection from malicious code at appropriate locations within organizational information systems.",
    domain: "SI"
  },
  {
    id: "SI.1.212",
    name: "Security Updates",
    description: "Update malicious code protection mechanisms when new releases are available.",
    domain: "SI"
  },
  {
    id: "SI.1.213",
    name: "System Monitoring",
    description: "Perform periodic scans of the information system and real-time scans of files from external sources as files are downloaded, opened, or executed.",
    domain: "SI"
  }
];

// CMMC Level 2 Controls (110 controls, includes all Level 1 controls plus additional ones)
export const cmmcLevel2Controls = [
  // Include all Level 1 controls
  ...cmmcLevel1Controls,
  
  // Access Control (AC) - Additional Controls for Level 2
  {
    id: "AC.2.005",
    name: "Provide Privacy and Security Notices",
    description: "Provide privacy and security notices consistent with applicable CUI rules.",
    domain: "AC"
  },
  {
    id: "AC.2.006",
    name: "Limit Use of Portable Storage",
    description: "Limit use of portable storage devices on external systems.",
    domain: "AC"
  },
  {
    id: "AC.2.007",
    name: "Least Privilege",
    description: "Employ the principle of least privilege, including for specific security functions and privileged accounts.",
    domain: "AC"
  },
  {
    id: "AC.2.008",
    name: "Unsuccessful Login Attempts",
    description: "Use session lock with pattern-hiding displays to prevent access and viewing of data after a period of inactivity.",
    domain: "AC"
  },
  {
    id: "AC.2.009",
    name: "Privacy and Security Notices",
    description: "Limit unsuccessful logon attempts.",
    domain: "AC"
  },
  {
    id: "AC.2.010",
    name: "Session Termination",
    description: "Use session termination to terminate user sessions after a defined condition.",
    domain: "AC"
  },
  {
    id: "AC.2.011",
    name: "Authorized Remote Execution",
    description: "Authorize remote execution of privileged commands and remote access to security-relevant information.",
    domain: "AC"
  },
  {
    id: "AC.2.013",
    name: "Remote Access",
    description: "Monitor and control remote access sessions.",
    domain: "AC"
  },
  {
    id: "AC.2.015",
    name: "Route Remote Access",
    description: "Route remote access via managed access control points.",
    domain: "AC"
  },
  {
    id: "AC.2.016",
    name: "Control Information Flows",
    description: "Control the flow of CUI in accordance with approved authorizations.",
    domain: "AC"
  },
  
  // Audit and Accountability (AU) Domain
  {
    id: "AU.2.041",
    name: "Audit Events",
    description: "Ensure that the actions of individual system users can be uniquely traced to those users so they can be held accountable for their actions.",
    domain: "AU"
  },
  {
    id: "AU.2.042",
    name: "Determine Event Information",
    description: "Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.",
    domain: "AU"
  },
  {
    id: "AU.2.043",
    name: "Content of Audit Records",
    description: "Provide a system capability that compares and synchronizes internal system clocks with an authoritative source to generate time stamps for audit records.",
    domain: "AU"
  },
  {
    id: "AU.2.044",
    name: "Time Stamps",
    description: "Review audit logs.",
    domain: "AU"
  },
  
  // Awareness and Training (AT) Domain
  {
    id: "AT.2.056",
    name: "Security Training",
    description: "Ensure that managers, system administrators, and users of organizational systems are made aware of the security risks associated with their activities and of the applicable policies, standards, and procedures related to the security of those systems.",
    domain: "AT"
  },
  {
    id: "AT.2.057",
    name: "Threat Awareness",
    description: "Ensure that personnel are trained to carry out their assigned information security-related duties and responsibilities.",
    domain: "AT"
  },
  
  // Configuration Management (CM) Domain
  {
    id: "CM.2.061",
    name: "Baseline Configuration",
    description: "Establish and maintain baseline configurations and inventories of organizational systems (including hardware, software, firmware, and documentation) throughout the respective system development life cycles.",
    domain: "CM"
  },
  {
    id: "CM.2.062",
    name: "Security Configuration",
    description: "Establish and enforce security configuration settings for information technology products employed in organizational systems.",
    domain: "CM"
  },
  {
    id: "CM.2.063",
    name: "Configuration Change Control",
    description: "Track, review, approve or disapprove, and log changes to organizational systems.",
    domain: "CM"
  },
  {
    id: "CM.2.064",
    name: "Security Impact Analysis",
    description: "Analyze the security impact of changes prior to implementation.",
    domain: "CM"
  },
  {
    id: "CM.2.065",
    name: "Least Functionality",
    description: "Define, document, approve, and enforce physical and logical access restrictions associated with changes to organizational systems.",
    domain: "CM"
  },
  {
    id: "CM.2.066",
    name: "Least Functionality",
    description: "Employ the principle of least functionality by configuring organizational systems to provide only essential capabilities.",
    domain: "CM"
  },
  
  // Adding more controls for various domains to reach a total of 110 controls
  // This is a subset of the 110 controls for CMMC Level 2
  // In a real implementation, all 110 controls would be listed
  
  // Incident Response (IR) Domain
  {
    id: "IR.2.092",
    name: "Incident Response Training",
    description: "Establish an operational incident-handling capability for organizational systems that includes preparation, detection, analysis, containment, recovery, and user response activities.",
    domain: "IR"
  },
  {
    id: "IR.2.093",
    name: "Test Incident Response",
    description: "Detect and report events.",
    domain: "IR"
  },
  {
    id: "IR.2.094",
    name: "Incident Handling",
    description: "Analyze and triage events to determine if they are security incidents.",
    domain: "IR"
  },
  {
    id: "IR.2.096",
    name: "Incident Reporting",
    description: "Report events and security incidents to the appropriate stakeholders.",
    domain: "IR"
  },
  {
    id: "IR.2.097",
    name: "Incident Response Assistance",
    description: "Develop and implement responses to declared incidents according to pre-defined procedures.",
    domain: "IR"
  },
  
  // Maintenance (MA) Domain
  {
    id: "MA.2.111",
    name: "Maintenance Procedures",
    description: "Perform maintenance on organizational systems.",
    domain: "MA"
  },
  {
    id: "MA.2.112",
    name: "Controlled Maintenance",
    description: "Provide controls on the tools, techniques, mechanisms, and personnel used to conduct system maintenance.",
    domain: "MA"
  },
  {
    id: "MA.2.113",
    name: "Maintenance Tools",
    description: "Require multifactor authentication to establish nonlocal maintenance sessions via external network connections and terminate such connections when nonlocal maintenance is complete.",
    domain: "MA"
  },
  {
    id: "MA.2.114",
    name: "Nonlocal Maintenance",
    description: "Supervise the maintenance activities of personnel without required access authorization.",
    domain: "MA"
  },
  
  // Media Protection (MP) Domain - Additional Controls for Level 2
  {
    id: "MP.2.119",
    name: "Media Access",
    description: "Protect (i.e., physically control and securely store) system media containing CUI, both paper and digital.",
    domain: "MP"
  },
  {
    id: "MP.2.120",
    name: "Media Marking",
    description: "Mark media with necessary CUI markings and distribution limitations.",
    domain: "MP"
  },
  {
    id: "MP.2.121",
    name: "Media Storage",
    description: "Control access to media containing CUI and maintain accountability for media during transport outside of controlled areas.",
    domain: "MP"
  },
  
  // Personnel Security (PS) Domain
  {
    id: "PS.2.127",
    name: "Screen Personnel",
    description: "Screen individuals prior to authorizing access to organizational systems containing CUI.",
    domain: "PS"
  },
  {
    id: "PS.2.128",
    name: "Termination",
    description: "Ensure that CUI and organizational systems containing CUI are protected during and after personnel actions such as terminations and transfers.",
    domain: "PS"
  },
  
  // Physical Protection (PE) Domain - Additional Controls for Level 2
  {
    id: "PE.2.135",
    name: "Alternate Work Site",
    description: "Protect and monitor the physical facility and support infrastructure for organizational systems.",
    domain: "PE"
  },
  {
    id: "PE.2.136",
    name: "Controlling Visitor Access",
    description: "Implement safeguards to protect against physical access to systems at alternate work sites.",
    domain: "PE"
  },
  
  // Risk Assessment (RA) Domain
  {
    id: "RA.2.141",
    name: "Risk Assessment",
    description: "Periodically assess the risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals, resulting from the operation of organizational systems and the associated processing, storage, or transmission of CUI.",
    domain: "RA"
  },
  {
    id: "RA.2.142",
    name: "Vulnerability Scanning",
    description: "Scan for vulnerabilities in organizational systems and applications periodically and when new vulnerabilities affecting those systems and applications are identified.",
    domain: "RA"
  },
  {
    id: "RA.2.143",
    name: "Remediate Vulnerabilities",
    description: "Remediate vulnerabilities in accordance with risk assessments.",
    domain: "RA"
  },
  
  // Security Assessment (CA) Domain
  {
    id: "CA.2.158",
    name: "Security Controls",
    description: "Develop, document, and periodically update system security plans that describe system boundaries, system environments of operation, how security requirements are implemented, and the relationships with or connections to other systems.",
    domain: "CA"
  },
  {
    id: "CA.2.159",
    name: "Plan of Action",
    description: "Develop and implement plans of action designed to correct deficiencies and reduce or eliminate vulnerabilities in organizational systems.",
    domain: "CA"
  },
  
  // System and Communications Protection (SC) Domain - Additional Controls for Level 2
  {
    id: "SC.2.178",
    name: "Prevent Unauthorized Connections",
    description: "Deny network communications traffic by default and allow network communications traffic by exception (i.e., deny all, permit by exception).",
    domain: "SC"
  },
  {
    id: "SC.2.179",
    name: "Architecture and Provisioning for Mobile Devices",
    description: "Implement architectural designs, software development techniques, and systems engineering principles that promote effective information security within organizational systems.",
    domain: "SC"
  },
  {
    id: "SC.2.181",
    name: "Session Authenticity",
    description: "Separate user functionality from system management functionality.",
    domain: "SC"
  },
  {
    id: "SC.2.183",
    name: "Mobile Code",
    description: "Prevent unauthorized and unintended information transfer via shared system resources.",
    domain: "SC"
  },
  {
    id: "SC.2.184",
    name: "Voice over Internet Protocol",
    description: "Implement cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission unless otherwise protected by alternative physical safeguards.",
    domain: "SC"
  },
  
  // System and Information Integrity (SI) Domain - Additional Controls for Level 2
  {
    id: "SI.2.214",
    name: "Security Alerts and Security Advisories",
    description: "Monitor system security alerts and advisories and take action in response.",
    domain: "SI"
  },
  {
    id: "SI.2.216",
    name: "Monitor Information System Connections",
    description: "Monitor organizational systems, including inbound and outbound communications traffic, to detect attacks and indicators of potential attacks.",
    domain: "SI"
  },
  {
    id: "SI.2.217",
    name: "Identify Unauthorized Use",
    description: "Identify unauthorized use of organizational systems.",
    domain: "SI"
  },
  
  // The remaining controls to reach a total of 110 controls for CMMC Level 2 would be added here
  // This is a representative subset to show the structure
];

// Domain Definitions
export const cmmcDomains = [
  { id: "AC", name: "Access Control" },
  { id: "AU", name: "Audit and Accountability" },
  { id: "AT", name: "Awareness and Training" },
  { id: "CM", name: "Configuration Management" },
  { id: "IA", name: "Identification and Authentication" },
  { id: "IR", name: "Incident Response" },
  { id: "MA", name: "Maintenance" },
  { id: "MP", name: "Media Protection" },
  { id: "PS", name: "Personnel Security" },
  { id: "PE", name: "Physical Protection" },
  { id: "RA", name: "Risk Assessment" },
  { id: "CA", name: "Security Assessment" },
  { id: "SC", name: "System and Communications Protection" },
  { id: "SI", name: "System and Information Integrity" }
];
