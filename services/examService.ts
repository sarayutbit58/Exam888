import { Domain, Question, ExamResult, UserAnswer, DomainScore, Flashcard } from '../types';

const DOMAIN_KEYWORDS: Record<Domain, string[]> = {
    [Domain.SecurityPrinciples]: ["security principle", "confidentiality", "integrity", "availability", "cia", "privacy", "risk management", "risk", "security control", "isc2", "ethic", "governance", "policy", "policies", "procedure", "standard", "guideline", "regulation", "bell-lapadula", "data classification"],
    [Domain.BC_DR_IncidentResponse]: ["business continuity", "bcp", "disaster recovery", "drp", "incident response", "bia", "business impact", "disaster", "incident", "rto", "rpo", "recovery site", "hot site", "warm site", "cold site"],
    [Domain.AccessControls]: ["access control", "physical control", "logical control", "least privilege", "separation of duties", "dac", "mac", "rbac", "abac", "discretionary", "mandatory", "role based", "attribute based", "authentication", "authorization", "mfa", "2fa", "biometric", "password", "token"],
    [Domain.NetworkSecurity]: ["network", "osi", "tcp/ip", "ipv4", "ipv6", "threat", "attack", "ddos", "virus", "mitm", "firewall", "vpn", "dmz", "router", "switch", "protocol", "ip address", "phishing", "whaling", "spoofing", "lan", "wan", "port", "https", "ssh", "smtp", "udp", "tcp"],
    [Domain.SecurityOperations]: ["data handling", "encryption", "hashing", "hardening", "configuration management", "password policy", "aup", "byod", "awareness", "logging", "monitoring", "siem", "patch management", "vulnerability", "social engineering", "data remnants", "data destruction", "degaussing", "sanitization"],
    [Domain.Unknown]: []
};

function mapKeywordsToDomain(keywords: string[]): Domain {
    const lowerKeywords = keywords.map(k => k.toLowerCase());
    let bestMatch: Domain = Domain.Unknown;
    let maxScore = 0;

    for (const [domain, domainKeywords] of Object.entries(DOMAIN_KEYWORDS)) {
        if (domain === Domain.Unknown) continue;
        const score = lowerKeywords.reduce((acc, keyword) => {
            return acc + (domainKeywords.some(dk => keyword.includes(dk)) ? 1 : 0);
        }, 0);

        if (score > maxScore) {
            maxScore = score;
            bestMatch = domain as Domain;
        }
    }
    return bestMatch;
}

// Storing raw text in a constant to be reused by getQuestions and getFlashcards
const rawText1 = `
นี่คือข้อสอบตัวอย่าง 20 ข้อ พร้อมคำตอบและแนวคิดที่ผมต้องจำให้แม่น!
1. Malware Identification
คำถาม (English): One of the ST members has a malware on their PC. They claim they downloaded only a spreadsheet tool, not malware. Which type of malware did they encounter if the malware was designed to look legitimate but was actually malicious?
คีย์เวิร์ดสำคัญ: "spreadsheet tool", "not malware", "designed to look legitimate but was actually malicious".
คำตอบ (English): Trojan
คำอธิบายแนวคิด: ข้อนี้สำคัญมากเพราะคีย์เวิร์ด "designed to look legitimate but was actually malicious" คือลักษณะเฉพาะของ Trojan.
Virus: ต้องการ "Human interaction to spread" (คนต้องไปคลิก/รันมัน).
Worm: มีความสามารถ "propagate" คือแพร่กระจายได้ด้วยตัวเอง (Self-propagating).
Rootkit: ไม่เกี่ยวกับการดูเหมือนปกติ แต่เป็นการเจาะเข้าไปควบคุมระบบส่วนกลาง.
ข้อนี้เป็นข้อสอบ Official ของ CC ระดับกลางถึงยาก
2. Man-in-the-Middle Attack
คำถาม (English): The attacker has spoofed ARP packets to ensure that responses to a legitimate server are instead sent to the system that the attacker controls. This means traffic is being modified. What type of attack is this?
คีย์เวิร์ดสำคัญ: "spoofed ARP packets", "traffic", "modify traffic", "modify connection".
คำตอบ (English): Man-in-the-middle attack
คำอธิบายแนวคิด: ข้อนี้รูปภาพในข้อสอบจริงจะช่วยได้มาก. เมื่อเห็นการ "Spoofed ARP packets" และมีการ "Modify Traffic" หรือ "Modify Connection" นี่คือลักษณะเฉพาะของ Man-in-the-middle attack.
ระวังกับดัก: "ARP jacking" และ "TCP-D attack" เป็นคำที่ "Made up term" หรือคำศัพท์ที่ไม่มีอยู่จริงในโลกนี้. อย่าไปเลือก!
ข้อนี้มาจากข้อสอบ Official.
3. Business Classification for Security Control
คำถาม (English): Which of the following best describes how businesses classify their data and applications for security controls?
คีย์เวิร์ดสำคัญ: "Business classify the data and application for Security Control", "specific appropriate Security Control based on sensitivity/impact".
คำตอบ (English): Allow organizations to specify appropriate Security Controls based on sensitivity and impact
คำอธิบายแนวคิด: คำตอบนี้ตรงไปตรงมาที่สุดในการอธิบายว่าธุรกิจจะวางแผน Security Control โดยพิจารณาจาก "sensitivity" (ความอ่อนไหวของข้อมูล) และ "impact" (ผลกระทบหากเกิดเหตุการณ์ไม่พึงประสงค์).
หลักการสำคัญของ ISC2: ในข้อสอบของค่ายนี้ ถ้ามีเรื่องของ "Human Life" (ชีวิตมนุษย์) เข้ามาเกี่ยวข้อง จะถือว่าสำคัญที่สุด เหนือกว่า Business เสมอ.
4. RAID for Performance and Fault Tolerance
คำถาม (English): Simon is an administrator of a tech firm. He uses traffic quite high and also needs RAID. He requires high speed, fault tolerance (at least one disk failure), and does not require double storage. What RAID level?
คีย์เวิร์ดสำคัญ: "high speed", "fault tolerance (at least one disk failure)", "high performance", "does not require double storage".
คำตอบ (English): RAID 5
คำอธิบายแนวคิด: ข้อนี้เน้นเรื่อง "Performance" (High Speed) และ "Fault Tolerance" (ทนทานต่อ Disk failure อย่างน้อย 1 ลูก).
RAID 0: มีแต่ Performance อย่างเดียว (ไม่มี Fault Tolerance).
RAID 1: Duplicate Data (มี Fault Tolerance) แต่ประสิทธิภาพไม่ดีเท่า.
RAID 6: มี Fault Tolerance ที่ดีกว่า RAID 5 (ทนต่อ 2 disk failures) แต่ "ช้ากว่า RAID 5" (slow Performance).
ดังนั้น RAID 5 จึงเป็นคำตอบที่ลงตัวที่สุด เพราะมีทั้ง Performance และ Parity (Fault Tolerance).
ข้อสอบเกี่ยวกับ RAID 0, 1, 5, 6 ออกบ่อยในค่ายนี้ ผมต้องจำโครงสร้างและจุดเด่นจุดด้อยให้ได้.
5. Power Protection for Short Outages
คำถาม (English): Tina is concerned about brownouts and short power outages for systems in the data center. What type of power protection should be put in place to help her system stay online?
คีย์เวิร์ดสำคัญ: "brownout", "short power outage".
คำตอบ (English): UPS (Uninterruptible Power Supply)
คำอธิบายแนวคิด:
Brownout: ไฟตก ไฟไม่เสถียร.
Short Power Outage: ไฟดับช่วงสั้นๆ.
สำหรับสถานการณ์เหล่านี้ UPS คืออุปกรณ์ที่เหมาะสมที่สุด.
Generator: ใช้สำหรับการดับไฟที่กินเวลานาน (long-term outages).
PDU (Power Distribution Unit): แค่กระจายพลังงาน ไม่ได้ป้องกันการดับไฟ.
ในข้อสอบจริง มักจะเจอคำตอบเป็น UPS หรือ Generator.
6. Informal Agreement (Internal)
คำถาม (English): Jessica is the procurement officer of a multi-division company. She is looking for an informal mechanism to document the relationship between her company and internal service providers offering a service to customers in different business units of the same company. Which type of agreement is most suitable?
คีย์เวิร์ดสำคัญ: "informal mechanism", "internal service provider", "same company".
คำตอบ (English): MOU (Memorandum of Understanding)
คำอธิบายแนวคิด: คีย์เวิร์ดที่สำคัญที่สุดคือ "informal".
MOU: เป็นการตกลงอย่างไม่เป็นทางการ "ไม่มีผลทางกฎหมาย". เหมาะสำหรับความสัมพันธ์ภายในองค์กร หรือความร่วมมือที่ไม่ต้องการข้อผูกมัดทางกฎหมายที่เข้มงวด.
SLA (Service Level Agreement): เป็นข้อตกลงที่ "เป็นทางการ" (Formal) มี Metric กำหนดชัดเจน (เช่น Uptime 99.9%) และมีผลทางกฎหมาย มักใช้กับ External Vendor.
MSA (Master Service Agreement) และ BPA (Business Partner Agreement): ไม่ค่อยออกใน CC และไม่เกี่ยวกับการตกลงแบบ Informal ภายใน.
7. Social Engineering Training for Customer Service
คำถาม (English): James, a customer service representative at an online retail company, is undergoing a security training program. As part of his role, he frequently communicates with customers. What training would best equip James to deal with social engineering and pretexting attacks?
คีย์เวิร์ดสำคัญ: "Security Training Program", "frequently communicate with customers", "social engineering", "pretexting attack", "in his work".
คำตอบ (English): Role-Based Training
คำอธิบายแนวคิด: ข้อนี้ค่อนข้างยากและหลอกง่าย.
Role-Based Training: เป็นการอบรมที่ "ปรับเนื้อหาให้เหมาะสมกับหน้าที่ความรับผิดชอบ" (tailored content of specific job responsibility). เนื่องจาก James เป็น Customer Service และต้องเจอ Social Engineering ในงานของเขาโดยตรง (in his work) การอบรมที่เจาะจงกับบทบาทจึงเหมาะสมที่สุด.
Security Policy Training: การอบรมเพื่อให้ปฏิบัติตามนโยบายความปลอดภัย.
Anomalous Behavior Recognition: การตรวจจับความผิดปกติ.
Hybrid Remote Work Enrollment: ไม่เกี่ยวเลย.
ถึงแม้ "Awareness Training" จะช่วยเรื่อง Social Engineering ได้ดี แต่ถ้ามี Role-Based Training ที่เจาะจงกับหน้าที่ ตัวนี้จะครอบคลุมและมีประสิทธิภาพที่สุด.
8. Social Engineering Principle (Urgency)
คำถาม (English): Henry is conducting a penetration test and wants to social engineer a staff member at his target organization into letting him gain access to a building. He explains that he is at the request of a senior manager and he is late for a meeting with that manager, who is relying on him to be there. Which social engineering principle is he using?
คีย์เวิร์ดสำคัญ: "social engineer", "gain access to a building", "request of senior manager", "late for a meeting".
คำตอบ (English): Urgency
คำอธิบายแนวคิด: ข้อนี้ก็หลอกเก่งมาก เพราะมีคำว่า Senior Manager ทำให้หลายคนอาจจะนึกถึง Authority.
Urgency (ความเร่งด่วน): คีย์เวิร์ดคือ "He is late for a meeting". นี่คือการสร้างความกดดันให้คนรีบทำโดยไม่คิดหน้าคิดหลัง.
Authority (อำนาจ): คือการอ้างผู้มีอำนาจ เช่น อ้างเป็นนายตำรวจยศสูง. แม้จะอ้าง Senior Manager แต่การเน้นเรื่อง "Late for a Meeting" ทำให้ Urgency ชัดเจนกว่า.
Intimidation (ข่มขู่): คือการขู่ว่าจะเกิดผลเสีย เช่น โดนไล่ออก โดนหักเงินเดือน ถ้าไม่ทำตาม. ข้อนี้ไม่มีการขู่.
Trust (ความเชื่อใจ): ไม่เกี่ยวในบริบทนี้.
ต้องแยกแยะให้ดีระหว่าง Authority กับ Urgency!
9. Multi-Factor Authentication Factors
คำถาม (English): Zia is implementing multifactor authentication and wants to ensure that using different factors. His authentication system he is setting up requires a PIN and biometric. Which factors are used?
คีย์เวิร์ดสำคัญ: "multifactor authentication", "different factors", "PIN and biometric".
คำตอบ (English): Something you know and Something you are
คำอธิบายแนวคิด: จำให้ขึ้นใจ!
Something you know: เช่น Password, PIN.
Something you have: เช่น Mobile phone, Token (อุปกรณ์ที่ถืออยู่).
Something you are: เช่น Biometric (ลายนิ้วมือ, สแกนใบหน้า).
ดังนั้น PIN + Biometric คือ Something you know และ Something you are.
10. CIA Triad - Availability
คำถาม (English): Fay is investigating a security incident where the attacker shut down his organization's database server. They do not appear to have actually gained access to the system, but they shut it down using some type of exploit. What security goal was affected?
คีย์เวิร์ดสำคัญ: "shutdown his organization's database server", "Server ล่ม", "do not appear to have actually gain access to the system".
คำตอบ (English): Availability
คำอธิบายแนวคิด: เมื่อใดก็ตามที่ระบบล่ม, Server ล่ม, หรือเว็บล่ม (System Down) ให้มองหา Availability ไว้ก่อนเลย.
Confidentiality (การรักษาความลับ): ข้อมูลไม่รั่วไหล.
Integrity (ความสมบูรณ์ของข้อมูล): ข้อมูลไม่ถูกแก้ไข/เปลี่ยนแปลง.
Non-repudiation (การห้ามปฏิเสธความรับผิดชอบ): พิสูจน์ได้ว่าใครทำอะไร.
ในข้อนี้ ไม่มีการเข้าถึงข้อมูล ไม่มีการเปลี่ยนแปลงข้อมูล ดังนั้น Integrity และ Confidentiality ไม่ถูกละเมิด.
11. Security Principle - Two Person Control
คำถาม (English): Sarah is designing an authorization scheme for his organization using a new accounting system. She is putting a control in place that would require two accountants to approve any request over $1000. Which security principle is she seeking to enforce?
คีย์เวิร์ดสำคัญ: "two accountants", "approve any request over $1000".
คำตอบ (English): Two Person Control
คำอธิบายแนวคิด: ข้อนี้ก็หลอกง่ายระหว่าง Two Person Control กับ Separation of Duty.
Two Person Control: คือการที่ "คนสองคนต้องทำงานร่วมกันในงานเดียว" หรือ "เหมือนมีกุญแจครึ่งดอกคนละดอก ต้องมาประกบกัน" เพื่อให้งานสำเร็จ. โจทย์ไม่ได้ระบุว่าสองคนนี้ทำหน้าที่ต่างกัน แค่ระบุว่า "two accountants approve".
Separation of Duty: คือการที่ "สองคนทำหน้าที่ต่างกัน" เพื่อลดความเสี่ยงจากการทุจริตหรือความผิดพลาด เช่น คนหนึ่งอนุมัติ (Approve) อีกคนหนึ่งจ่ายเงิน (Pay). ถ้าโจทย์ระบุว่า Accountant 1 Approve และ Accountant 2 Pay แบบนี้จะเป็น Separation of Duty.
Least Privilege: ให้สิทธิ์ขั้นต่ำที่จำเป็นเท่านั้น.
Security through obscurity: ความปลอดภัยโดยการซ่อนข้อมูล ไม่ใช่การควบคุม.
12. Control Type - Data Loss Prevention (DLP)
คำถาม (English): Bryan is developing an architecture for a new Data Loss Prevention (DLP) system. What type of security control is DLP?
คีย์เวิร์ดสำคัญ: "Data Loss Prevention System (DLP)".
คำตอบ (English): Technical
คำอธิบายแนวคิด: ต้องจำประเภทของ Control ให้แม่น!
Technical Control: คือการใช้ "ซอฟต์แวร์" หรือ "โซลูชัน" (เช่น Antivirus, Firewall, DLP).
Administrative Control: คือ "นโยบาย" หรือ "กฎหมาย" (เช่น Security Policy, กฎระเบียบ).
Physical Control: คือการควบคุมทางกายภาพ (เช่น ประตู, รั้ว, กล้องวงจรปิด).
13. Risk Management - Accepting the Risk (Next Step)
คำถาม (English): Tina recently completed a risk management review. After discussing the situation with her manager, she is accepting the risk. What is the appropriate strategy to do next?
คีย์เวิร์ดสำคัญ: "accepting the risk", "appropriate strategy", "what to do next".
คำตอบ (English): Document the decision
คำอธิบายแนวคิด: นี่คือ "แพทเทิร์น" ที่ออกบ่อยและคนมักจะลืม.
เมื่อเราตัดสินใจ "Accept the risk" (ยอมรับความเสี่ยง) แปลว่าเราจะ "ไม่ทำอะไรเลย" เพื่อควบคุมมัน.
แต่สิ่งที่ต้องทำต่อมาคือ "Document the decision" หรือ "บันทึกการตัดสินใจนั้นไว้เป็นหลักฐาน". เพื่อป้องกันความรับผิดชอบส่วนตัวในอนาคต หากเกิดผลกระทบจากความเสี่ยงนั้น.
14. Risk Management - Mitigation
คำถาม (English): Chris conducted a comprehensive security review of his organization. He identified 25 top risks and is pursuing different strategies for each risk. For a particular risk, his goal is to reduce the overall level of the risk. He designs a solution that integrates a threat intelligence feed with a firewall. What risk strategy is this?
คีย์เวิร์ดสำคัญ: "reduce the overall level of the risk", "multiple strategy", "integrate threat intelligence feed with Firewall".
คำตอบ (English): Mitigation
คำอธิบายแนวคิด:
Mitigation: คือการ "Reduce the overall level of risk" (ลดระดับความเสี่ยงโดยรวมลง). การใช้ Threat Intelligence Feed ร่วมกับ Firewall เป็นตัวอย่างของการ Mitigation.
Acceptance: คือ Take the risk and Do Nothing (แต่ต้องมี Documentation).
Avoidance: คือการ "ไม่ทำเลย" หรือ "ไม่ยุ่งเกี่ยวกับความเสี่ยงนั้นเลย".
Transference: คือการ "โอนความเสี่ยง" ไปให้บุคคลที่สาม (เช่น การซื้อประกันภัย - Insurance).
15. Documentation Type - Step-by-Step
คำถาม (English): Gina is drafting a document that provides a detail step-by-step process that users can follow to connect to VPN from a remote location. What type of document is this?
คีย์เวิร์ดสำคัญ: "detail step-by-step process".
คำตอบ (English): Procedure
คำอธิบายแนวคิด: จำคีย์เวิร์ดนี้ให้ขึ้นใจเลยครับ!
Procedure: คือเอกสารที่บอก "ขั้นตอนการทำงานแบบละเอียด เป็นขั้นเป็นตอน (1, 2, 3, 4)".
Policy: เป็น "นโยบาย" ระดับสูง (ผู้บริหารอ่าน).
Standard: เป็น "มาตรฐาน" หรือสิ่งที่ยอมรับได้.
Guideline: เป็น "แนวทางคร่าวๆ" ไม่ลงรายละเอียดมาก.
16. Agreement Type - SaaS Downtime
คำถาม (English): A company is entering into an agreement with a SaaS (Software as a Service) provider. The agreement specifies the amount of downtime that is acceptable. Which document is this?
คีย์เวิร์ดสำคัญ: "agreement with SaaS provider", "amount of Down Time that is acceptable".
คำตอบ (English): SLA (Service Level Agreement)
คำอธิบายแนวคิด: ข้อนี้เอามาเพื่อแสดงความแตกต่างกับ MOU.
SLA: เป็นข้อตกลง "ที่เป็นทางการ" (Formal) ที่มี "Metric" หรือตัวเลขกำหนดชัดเจน (เช่น เวลา Downtime ที่ยอมรับได้, Uptime 99.9%). มักใช้กับผู้ให้บริการภายนอก (External Service Provider).
17. Digital Signature - Security Goal
คำถาม (English): Tina is applying a digital signature to a contract and can prove that she agrees to its terms. What goal of cybersecurity does this directly achieve?
คีย์เวิร์ดสำคัญ: "Digital signature", "can prove that She agree to is term".
คำตอบ (English): Non-repudiation
คำอธิบายแนวคิด: คีย์เวิร์ดคือ "Digital Signature" ซึ่งมีวัตถุประสงค์หลักคือ "Non-repudiation" หรือ "การห้ามปฏิเสธความรับผิดชอบ". การใช้ Digital Signature ทำให้สามารถพิสูจน์ได้ว่าใครเป็นผู้ลงนามหรือไม่สามารถปฏิเสธได้ว่าไม่ได้ทำ.
Digital Signature ไม่ได้ปกป้อง Confidentiality โดยตรง และไม่ใช่ Authentication โดยตรง.
18. Man in the Browser Attack
คำถาม (English): Which of the following best describes a Man-in-the-Browser attack?
คีย์เวิร์ดสำคัญ: "Man in the Browser attack".
คำตอบ (English): Proxy Trojan
คำอธิบายแนวคิด: ข้อนี้อาจารย์ย้ำว่า "ยาก" และเป็น "เทอมที่ไม่ค่อยอยู่ใน Material ของ CC ทั่วไป" แต่ออกสอบ Official.
ดังนั้น ต้อง "จำไปเลย" ว่า Man-in-the-Browser attack คือ Proxy Trojan. มันจะมาในรูปแบบของ Plug-in ใน Browser เพื่อดักจับและแก้ไขข้อมูล.
ข้อนี้มาจากข้อสอบ Official. ผมต้องจำให้ได้เลยนะ!
19. Backup Type - Incremental
คำถาม (English): Paul runs a backup service for his organization. Everyday he backs up changes made everyday since the last backup operation. What type of backup does he perform?
คีย์เวิร์ดสำคัญ: "Backup change everyday", "since the last backup operation".
คำตอบ (English): Incremental
คำอธิบายแนวคิด: ข้อนี้เป็นอีกข้อที่มาจาก Official CC และค่อนข้างลึก.
Incremental Backup: คือการ Backup ข้อมูลที่เปลี่ยนแปลงไป "ตั้งแต่ Full Backup ครั้งล่าสุด หรือ Incremental Backup ครั้งล่าสุด". คีย์เวิร์ด "since the last backup operation" ชี้ไปที่ Incremental เพราะมันจะดูการเปลี่ยนแปลงจาก Backup ก่อนหน้าไม่ว่าจะเป็น Full หรือ Incremental.
Differential Backup: คือการ Backup ข้อมูลที่เปลี่ยนแปลงไป "ตั้งแต่ Full Backup ครั้งล่าสุด" เท่านั้น.
Full Backup: คือการ Backup ข้อมูลทั้งหมด.
ต้องจำภาพและข้อดีข้อเสียของแต่ละแบบให้ได้ เพราะบางครั้งโจทย์อาจถามถึงความเร็วในการ Restore ข้อมูล.
ข้อนี้มาจากข้อสอบ Official.
20. Physical Security - Multi-Factor Authentication
คำถาม (English): Chris wants to use a lock to secure a high-security area in his organization. He wants to ensure that losing the code to the lock will not result in easy defeat. What should he put in place?
คีย์เวิร์ดสำคัญ: "lock to secure High Security area", "losing the code to the lock will not result in easy defeat".
คำตอบ (English): Adding a second factor for authentication
คำอธิบายแนวคิด: โจทย์บอกชัดว่าถ้า "losing the code" จะต้องไม่ถูกเจาะได้ง่ายๆ. นั่นหมายความว่าการใช้แค่ Factor เดียว (Something you know - Code/PIN) ไม่พอ.
ดังนั้น วิธีแก้คือการ "เพิ่ม Factor ที่สอง" หรือที่เรียกว่า MFA (Multi-Factor Authentication). เช่น ใช้ Code (Something you know) ร่วมกับ Biometric (Something you are) หรือ Token (Something you have).
Electronic lock หรือ Physical lock ก็ยังคงใช้ Code อยู่ดี จึงไม่ช่วยแก้ปัญหาหาก Code รั่วไหล.
    `;

const rawText2 = `
** Question 1** Which concept describes an information security strategy that integrates people, technology, and operations in order to establish security controls across multiple layers of the organization? Options: A least privilege B defense in depth C separation of duties D privileged accounts Correct Option: B defense in depth Keywords for Exam: security strategy, integrates people technology operations, security controls across multiple layers Detailed Explanation:
Defense in Depth (การป้องกันแบบหลายชั้น) คือกลยุทธ์ด้านความมั่นคงปลอดภัยของข้อมูลที่สำคัญมากๆ ที่เน้นการนำมาตรการควบคุมความปลอดภัย (security controls) มาใช้ในทุกชั้นขององค์กรเลยนะ ไม่ใช่แค่ชั้นใดชั้นหนึ่ง ตัวอย่างชั้นต่างๆ ก็เช่น นโยบาย (policies), การรักษาความปลอดภัยทางกายภาพ (physical security) เช่น ดาต้าเซ็นเตอร์, การรักษาความปลอดภัยเครือข่าย (network security), อุปกรณ์/เซิร์ฟเวอร์/คอมพิวเตอร์ (devices/servers/computers), แอปพลิเคชัน (applications) และสุดท้ายคือข้อมูล (data) ซึ่งเป็นสิ่งที่มีค่าที่สุด.
แนวคิดหลักคือ ถ้าหากชั้นใดชั้นหนึ่งถูกโจมตีหรือถูกเจาะได้สำเร็จ ชั้นอื่นๆ ที่เหลือก็จะยังคงให้การป้องกันอยู่ ทำให้ความเสี่ยงโดยรวมลดลงอย่างมาก. มันคือการรวมมาตรการป้องกันหลากหลายรูปแบบ ทั้งแบบกายภาพ (physical), เทคนิค (technical) และการบริหารจัดการ (administrative controls) เข้าด้วยกันอย่างเป็นระบบ. จำไว้เลยว่าต้องครอบคลุมทุกด้านจริงๆ!
** Question 2** Which of the following is not an ethical canon of the ISC2? Options: A advance and protect the profession B protect the society the common good necessary public trust and confidence and the infrastructure C act honorably honestly justly responsibly and legally D provide active and qualified service to the principles Correct Option: D provide active and qualified service to the principles Keywords for Exam: not an ethical canon, ISC2, four canons Detailed Explanation:
ISC2 Code of Ethics Canons (หลักจรรยาบรรณของ ISC2): ข้อนี้ต้องจำให้ขึ้นใจเลยนะ เพราะเจอในข้อสอบบ่อยมาก ISC2 มีหลักจรรยาบรรณหลักอยู่ 4 ข้อ และลำดับก็สำคัญด้วย.
1. Protect society, the common good, necessary public trust and confidence, and the infrastructure. (ปกป้องสังคม, ส่วนรวม, ความไว้วางใจของสาธารณะ, และโครงสร้างพื้นฐาน)
2. Act honorably, honestly, justly, responsibly, and legally. (ประพฤติตนอย่างมีเกียรติ, ซื่อสัตย์, เป็นธรรม, มีความรับผิดชอบ, และถูกกฎหมาย)
3. Provide diligent and competent service to principles. (ให้บริการอย่างขยันขันแข็งและมีความสามารถแก่ผู้ว่าจ้าง/ลูกค้า)
4. Advance and protect the profession. (ส่งเสริมและปกป้องวิชาชีพ)
ตัวเลือก D (provide active and qualified service to the principles) มีคำที่ผิดไปจากข้อ 3 ที่ถูกต้องคือ "diligent and competent" ไม่ใช่ "active and qualified".
** Question 3** The cloud deployment model where a company has resources on premise and in the cloud is known as: Options: A hybrid cloud B multi-tenant C private cloud D community cloud Correct Option: A hybrid cloud Keywords for Exam: resources on premise and in the cloud, combination of cloud models Detailed Explanation:
Hybrid Cloud (คลาวด์แบบผสมผสาน): คือการรวมกันระหว่างโครงสร้างพื้นฐานแบบ On-Premise (ที่เราดูแลเองในองค์กร) กับ Public Cloud (บริการคลาวด์สาธารณะ).
** Question 4** Which of the following is a public IP address? Options: A 13.16.123.1 B 192.168.123.1 C 172.16.123.1 D 10.221.1.123 Correct Option: A 13.16.123.1 Keywords for Exam: public IP address, routable over the internet, private IP ranges Detailed Explanation:
Public IP Address (ที่อยู่ IP สาธารณะ) vs. Private IP Address (ที่อยู่ IP ส่วนตัว): Public IP: คือ IP ที่สามารถเข้าถึงได้และ "Routable" บนอินเทอร์เน็ต. Private IP: คือ IP ที่สงวนไว้สำหรับใช้ภายในเครือข่ายส่วนตัว. ช่วง IP ของ Private Address (ต้องจำให้แม่น!): Class A: 10.0.0.0 - 10.255.255.255, Class B: 172.16.0.0 - 172.31.255.255, Class C: 192.168.0.0 - 192.168.255.255. จากตัวเลือก, 13.16.123.1 ไม่อยู่ในช่วง Private IP.
** Question 5** Which device would be more effective in detecting an intrusion into a network? Options: A routers B HIDS (host based intrusion detection system) C firewalls D NIDS (network intrusion detection system) Correct Option: D NIDS (network intrusion detection system) Keywords for Exam: detecting an intrusion, into a network Detailed Explanation:
NIDS (Network Intrusion Detection System): ระบบตรวจจับการบุกรุกบนเครือข่าย ถูกออกแบบมาเพื่อ "ตรวจสอบทราฟฟิกเครือข่าย" หาสิ่งผิดปกติและสัญญาณการบุกรุก.
** Question 6** Which access control is more effective at protecting a door against unauthorized access? Options: A fences B turnstiles C barriers D locks Correct Option: D locks Keywords for Exam: effective at protecting a door, unauthorized access, physically securing Detailed Explanation:
Locks (กุญแจ/ระบบล็อค): เป็นกลไกควบคุมการเข้าถึงโดยตรงที่ต้องการกุญแจ, รหัส หรือการยืนยันตัวตนอื่นๆ เพื่อรักษาความปลอดภัยของประตูโดยเฉพาะ.
** Question 7** Which of the following is a detection control? Options: A turnstiles B smoke detectors C bollards D firewalls Correct Option: B smoke detectors Keywords for Exam: detection control, detect an intrusion Detailed Explanation:
Detection Control (มาตรการควบคุมแบบตรวจจับ): คือสิ่งที่ออกแบบมาเพื่อ "ระบุและแจ้งเตือน" เมื่อมีปัญหาหรือกิจกรรมที่ไม่ได้รับอนุญาตเกิดขึ้น. Smoke Detectors (เครื่องตรวจจับควัน) ตรงตามวัตถุประสงค์นี้.
** Question 8** Which type of attack has the primary objective of controlling the system from outside? Options: A backdoors B rootkits C cross-site scripting D Trojans Correct Option: A backdoors Keywords for Exam: primary objective, controlling the system from outside, remote control Detailed Explanation:
Backdoors (แบ็คดอร์): คือช่องทางที่อนุญาตให้ผู้โจมตีเข้าถึงระบบโดยไม่ได้รับอนุญาต โดยมีวัตถุประสงค์หลักคือ "การควบคุมระบบจากระยะไกล" (control the system remotely).
** Question 9** Which of the following is not a protocol of the OSI layer three? Options: A SNMP B ICMP C IGMP D IP Correct Option: A SNMP Keywords for Exam: not a protocol, OSI layer three, network layer Detailed Explanation:
OSI Layer 3 (Network Layer) protocols include IP, ICMP, and IGMP. SNMP (Simple Network Management Protocol) operates at the Application Layer (Layer 7).
** Question 10** When a company hires an insurance company to mitigate risk, which risk management technique is being applied? Options: A risk avoidance B risk transfer C risk mitigation D risk tolerance Correct Option: B risk transfer Keywords for Exam: hires an insurance company, mitigate risk, risk management technique Detailed Explanation:
Risk Transfer (การถ่ายโอนความเสี่ยง): คือการโอนความรับผิดชอบสำหรับความเสี่ยงไปยังบุคคลที่สาม, เช่น การซื้อประกันภัย.
** Question 11** The SMTP (Simple Mail Transfer Protocol) protocol operates at which OSI layer? Options: A Layer 7 B Port 25 C Layer 3 D Port 23 Correct Option: A Layer 7 Keywords for Exam: SMTP protocol, OSI layer, application layer Detailed Explanation:
SMTP (Simple Mail Transfer Protocol) operates at the Application Layer (Layer 7) of the OSI model. It uses TCP Port 25.
** Question 12** The process of verifying or proving the user's identification is known as: Options: A confidentiality B integrity C authentication D authorization Correct Option: C authentication Keywords for Exam: verifying or proving, user's identification, security distinguishing Detailed Explanation:
Authentication (การยืนยันตัวตน): เป็นกระบวนการในการ "ตรวจสอบหรือพิสูจน์ตัวตน" ของผู้ใช้หรือระบบ.
** Question 13** If an organization wants to protect itself against tailgating, which of the following types of access control would be most effective? Options: A locks B fences C barriers D turnstiles Correct Option: D turnstiles Keywords for Exam: protect against tailgating, access control, follows him or her Detailed Explanation:
Turnstiles (ประตูหมุน): เป็นกลไกควบคุมการเข้าออกทางกายภาพที่ออกแบบมาเพื่อ "อนุญาตให้คนผ่านได้ทีละคน" เท่านั้น, ซึ่งมีประสิทธิภาพในการป้องกัน Tailgating.
** Question 14** Logging and monitoring systems are essential to: Options: A identifying inefficient performing system preventing compromises and providing a record of how systems are used B identifying efficient performing system labeling compromises and providing a record of how systems are used C identifying inefficient performing system detecting compromises and providing a record of how systems are used D identifying efficient performing system detecting compromises and providing a record of how systems are used Correct Option: D identifying efficient performing system detecting compromises and providing a record of how systems are used Keywords for Exam: logging and monitoring systems, essential to, detecting compromises, record of how systems are used Detailed Explanation:
Logging and Monitoring Systems are essential for identifying system performance, detecting compromises, and providing a record of system usage for auditing and compliance.
** Question 15** In the event of a disaster, which of these should be the primary objective? Options: A guarantee the safety of the people B guarantee the continuity of critical systems C protection of the production database D replication of disaster communication Correct Option: A guarantee the safety of the people Keywords for Exam: disaster, primary objective, safety Detailed Explanation:
In any disaster scenario, the safety of people is always the top priority, overriding all other concerns, including system continuity or data protection.
** Question 16** The process that ensures that system changes do not adversely impact business operation is known as: Options: A change management B vulnerability management C configuration management D inventory management Correct Option: A change management Keywords for Exam: system changes, do not adversely impact business operation, process ensures Detailed Explanation:
Change Management is the process designed to ensure that any modifications to a system are controlled, assessed, and documented to minimize risks and prevent negative impacts on business operations.
** Question 17** The last phase in the data security life cycle is known as: Options: A encryption B backup C archival D destruction Correct Option: D destruction Keywords for Exam: last phase, data security life cycle, securely destroyed Detailed Explanation:
The data security life cycle, according to ISC2, consists of six phases: Create, Store, Use, Share, Archive, and finally, Destroy. Destruction is the final phase.
** Question 18** Which access control model specifies access to an object based on the subject's role in the organization? Options: A RBAC (Role-Based Access Control) B MAC (Mandatory Access Control) C DAC (Discretionary Access Control) D ABAC (Attribute-Based Access Control) Correct Option: A RBAC (Role-Based Access Control) Keywords for Exam: access control model, access to an object, based on the subject's role Detailed Explanation:
Role-Based Access Control (RBAC) grants access to resources based on the user's defined role within the organization, simplifying permission management.
** Question 19** Which of the following is not an example of a physical control? Options: A firewalls B biometric access control C remote control electronic locks D security cameras Correct Option: A firewalls Keywords for Exam: not an example of a physical control Detailed Explanation:
Firewalls are logical or technical security controls, not physical. Physical controls include tangible items like locks, cameras, and biometric readers.
** Question 20** Which type of attack will most effectively maintain remote access and control over the victim's computer? Options: A Trojans B phishing C cross-site scripting D rootkits Correct Option: D rootkits Keywords for Exam: most effectively maintain, remote access and control, victim's computer Detailed Explanation:
Rootkits are designed to provide persistent, concealed remote access and control over a victim's computer by hiding deep within the operating system.
** Question 21** In incident terminology, what does "zero day" mean? Options: A days to solve a previously unknown system vulnerability B a previously unknown system vulnerability C days without a cyber security incident D days with a cyber security incident Correct Option: B a previously unknown system vulnerability Keywords for Exam: incident terminology, zero day, previously unknown system vulnerability Detailed Explanation:
A "Zero-Day" vulnerability refers to a previously unknown system flaw that is exploited by attackers before the vendor has become aware of it or has been able to release a patch.
** Question 22** A device found not to comply with the security baseline should be: Options: A disabled or separated into a quarantine area until a virus scan can be run B disabled or isolated into a quarantine area until it can be checked and updated C placed in a demilitarized zone until it can be reviewed and updated D marked as potentially vulnerable and placed in a quarantine area Correct Option: B disabled or isolated into a quarantine area until it can be checked and updated Keywords for Exam: not to comply with the security baseline, disabled or isolated, quarantine area, checked and updated Detailed Explanation:
A device not complying with the security baseline should be isolated in a quarantine area until it can be assessed, updated, and brought into compliance to prevent it from introducing risks to the network.
** Question 23** Which type of attack primarily aims to make a resource inaccessible to its intended users? Options: A denial of service B phishing C trojans D cross-site scripting Correct Option: A denial of service Keywords for Exam: primarily aims, make a resource inaccessible, intended users Detailed Explanation:
A Denial of Service (DoS) attack's main goal is to disrupt service availability, making a resource inaccessible to legitimate users by overwhelming it.
** Question 24** Which type of attack embeds a malicious payload inside a reputable or trusted software? Options: A Trojan horse B phishing C rootkit D cross-site scripting Correct Option: A Trojan horse Keywords for Exam: embeds malicious payload, reputable or trusted software, disguise themselves as legitimate Detailed Explanation:
A Trojan horse is malware that disguises itself as legitimate software. It carries a hidden malicious payload that executes when the software is run.
** Question 25** Which tool is commonly used to sniff network traffic? Options: A Burp Suite B John the Ripper C Wireshark D NSLookup Correct Option: C Wireshark Keywords for Exam: sniff network traffic, network protocol analyzer, packet sniffer Detailed Explanation:
Wireshark is a widely used network protocol analyzer (or packet sniffer) that captures and inspects network traffic in real-time.
** Question 26** Which of these is not an attack against an IP network? Options: A side channel attack B man in the middle attack C fragmented packet attack D oversized packet attack Correct Option: A side channel attack Keywords for Exam: not an attack against an IP network Detailed Explanation:
A Side-Channel Attack exploits physical characteristics of a system (like power consumption or electromagnetic emissions) rather than attacking the IP network directly.
** Question 27** The detailed steps to complete a task supporting departmental or organizational policies are typically documented in: Options: A regulations B standards C policies D procedures Correct Option: D procedures Keywords for Exam: detailed steps to complete task, supporting policies, documented in Detailed Explanation:
Procedures provide detailed, step-by-step instructions on how to perform specific tasks, supporting the implementation of broader policies and standards.
** Question 28** Which device is used to connect a LAN to the internet? Options: A SIEM (Security Information and Event Management) B HIDS (Host-based Intrusion Detection System) C router D firewall Correct Option: C router Keywords for Exam: connect a LAN to the internet, device, routes data packets Detailed Explanation:
A router is the device that connects a Local Area Network (LAN) to an external network, like the internet, by forwarding data packets between them.
** Question 29** What does SIEM stand for? Options: A Security Information and Enterprise Management B Security Information and Event Management C Security Intelligence and Event Manager D Secure Information and Enterprise Manager Correct Option: B Security Information and Event Management Keywords for Exam: SIEM stands for, collects analyzes reports, security data, detect respond to security threats Detailed Explanation:
SIEM stands for Security Information and Event Management. It's a system that collects, analyzes, and reports on security data from various sources to detect and respond to threats.
** Question 30** A "security safeguard" is the same as a: Options: A safety control B privacy control C security control D security principle Correct Option: C security control Keywords for Exam: security safeguard, same as, mitigate security risk, protect Confidentiality Integrity and Availability (CIA) Detailed Explanation:
The term "security safeguard" is synonymous with "security control." Both refer to any measure or mechanism designed to mitigate security risks and protect the CIA of systems and data.
** Question 31** Which access control model can grant access to a given object based on complex rules? Options: A DAC (Discretionary Access Control) B ABAC (Attribute-Based Access Control) C RBAC (Role-Based Access Control) D MAC (Mandatory Access Control) Correct Option: B ABAC (Attribute-Based Access Control) Keywords for Exam: access control model, grant access, based on complex rules, attributes Detailed Explanation:
Attribute-Based Access Control (ABAC) provides access based on complex rules that evaluate attributes of the user, object, and environment, allowing for highly granular and flexible control.
** Question 32** Which port is used for secure communication over the web (HTTPS)? Options: A 69 B 80 C 25 D 443 Correct Option: D 443 Keywords for Exam: port is used, secure communication over the web, HTTPS Detailed Explanation:
HTTPS (Hypertext Transfer Protocol Secure) uses port 443 for secure web communication, encrypting data between the browser and server. Port 80 is for unencrypted HTTP.
** Question 33** Which of these has the primary objective of identifying and prioritizing critical business processes? Options: A business impact analysis B business impact plan C disaster recovery plan D business continuity plan Correct Option: A business impact analysis Keywords for Exam: primary objective, identifying and prioritizing critical business processes Detailed Explanation:
A Business Impact Analysis (BIA) is the process of identifying critical business processes and determining the potential effects of a disruption to those processes. It is a key first step in developing a BCP.
** Question 34** Which of the following are not types of security control? Options: A common control B hybrid control C system specific control D storage control Correct Option: D storage control Keywords for Exam: not types of security control Detailed Explanation:
Common, hybrid, and system-specific are recognized types of security controls. "Storage control" is not a standard classification, although security for storage is important and achieved through other control types (like encryption or access control).
** Question 35** Which of the following is not a type of learning activity used in security awareness? Options: A awareness B training C education D tutorial Correct Option: D tutorial Keywords for Exam: not a type of learning activity, security awareness Detailed Explanation:
Awareness, Training, and Education are the three main types of learning activities in security awareness programs. A "tutorial" is a specific format or method of delivering content, not a primary category of learning activity itself.
** Question 36** The magnitude of the harm expected as a result of the consequences of an unauthorized disclosure, modification, destruction, or loss of information is known as: Options: A vulnerability B threat C impact D likelihood Correct Option: C impact Keywords for Exam: magnitude of the harm, consequences of an unauthorized disclosure modification destruction or loss of information Detailed Explanation:
Impact refers to the magnitude of harm or damage that could result from a security incident. Risk is a function of Threat, Vulnerability, and Impact.
** Question 37** The implementation of security controls is a form of: Options: A risk reduction B risk acceptance C risk avoidance D risk transference Correct Option: A risk reduction Keywords for Exam: implementation of security controls, form of, mitigate or lessen the likelihood and impact Detailed Explanation:
Implementing security controls is a form of risk reduction (or mitigation), as it aims to lessen the likelihood and/or impact of a potential threat.
** Question 38** Which of the following attacks takes advantage of poor input validation in websites? Options: A Trojans B cross-site scripting C phishing D rootkits Correct Option: B cross-site scripting Keywords for Exam: attack, take advantage of, poor input validation, websites Detailed Explanation:
Cross-Site Scripting (XSS) attacks exploit poor input validation on websites to inject malicious scripts into web pages viewed by other users.
** Question 39** Which of the following is an example of an administrative security control? Options: A access control list B acceptable use policies C badge readers D no entry signs Correct Option: B acceptable use policies Keywords for Exam: example, administrative security control, written policies, non-technical Detailed Explanation:
Administrative controls are non-technical controls related to management processes and policies. An Acceptable Use Policy (AUP) is a prime example.
** Question 40** In change management, which component addresses the procedures needed to undo changes? Options: A request for approval B request for change C rollback D disaster and recovery Correct Option: C rollback Keywords for Exam: change management, component, procedures needed to undo changes, revert to previous state Detailed Explanation:
A rollback plan is a critical component of change management that outlines the procedures to revert a system to its previous stable state if a change causes issues.
** Question 41** Which of the following properties is not guaranteed by digital signatures? Options: A Authentication B confidentiality C non-repudiation D integrity Correct Option: B confidentiality Keywords for Exam: not guaranteed, digital signatures, properties Detailed Explanation:
Digital signatures provide authentication, integrity, and non-repudiation. They do not, however, provide confidentiality. Confidentiality is achieved through encryption.
** Question 42** Which devices have the primary objective of collecting and analyzing security events? Options: A hubs B firewalls C router D SIEM (Security Information and Event Management) Correct Option: D SIEM (Security Information and Event Management) Keywords for Exam: primary objective, collecting and analyzing security events, SIEM Detailed Explanation:
A SIEM (Security Information and Event Management) system's primary goal is to collect, correlate, and analyze security event data from across the network to provide comprehensive monitoring and threat detection.
** Question 43** What is an effective way of hardening a system? Options: A patch the system B have an IDS in place C run a vulnerability scan D create a DMZ for web application services Correct Option: A patch the system Keywords for Exam: effective way, hardening a system, applying patches, addresses known vulnerabilities Detailed Explanation:
System hardening involves reducing a system's attack surface. Applying patches is a fundamental and effective hardening technique as it closes known vulnerabilities.
** Question 44** Which type of key can be used to both encrypt and decrypt the same message? Options: A a public key B a private key C an asymmetric key D a symmetric key Correct Option: D a symmetric key Keywords for Exam: key, used to both encrypt and decrypt, same message Detailed Explanation:
Symmetric encryption uses a single, shared key to both encrypt and decrypt a message. Asymmetric encryption uses a pair of keys (public and private).
** Question 45** Which regulation addresses data protection and privacy in Europe? Options: A SOX B HIPAA C FISMA D GDPR Correct Option: D GDPR Keywords for Exam: regulations, data protection and privacy, Europe Detailed Explanation:
GDPR (General Data Protection Regulation) is a comprehensive data protection and privacy regulation in the European Union.
** Question 46** Which of the following types of devices inspect packet header information to either allow or deny network traffic? Options: A hubs B firewalls C router D switches Correct Option: B firewalls Keywords for Exam: inspect packet header information, allow or deny network traffic, security device Detailed Explanation:
Firewalls inspect packet headers to enforce security policies, allowing or denying traffic based on rules (e.g., source/destination IP, port).
** Question 47** A web server that accepts requests from external clients should be placed in which network? Options: A internet B DMZ C internal network D VPN Correct Option: B DMZ Keywords for Exam: web server, accepts request from external clients, placed in which network, extra layer of security Detailed Explanation:
A DMZ (Demilitarized Zone) is a separate network segment that provides an extra layer of security for externally accessible services like web servers, isolating them from the internal network.
** Question 48** How many data labels are considered good practice? Options: A 2 to 3 B 1 C 1 to 2 D greater than 4 Correct Option: A 2 to 3 Keywords for Exam: data labels, good practice, balance between simplicity and effective data classification Detailed Explanation:
Using 2 to 3 data labels (e.g., Public, Internal, Confidential) is a good practice as it balances simplicity with effective data classification, making it easy for users to understand and apply.
** Question 49** Security posters are an element primarily employed in: Options: A security awareness B incident response plans C business continuity plans D physical security controls Correct Option: A security awareness Keywords for Exam: security posters, primarily employed in, educate and remind employees, promote a security conscious culture Detailed Explanation:
Security posters are a tool used in security awareness programs to educate and remind employees about security best practices and policies.
** Question 50** Which of these types of user is less likely to have a privileged account? Options: A security admin B security analyst C help desk D external worker Correct Option: D external worker Keywords for Exam: less likely, privileged account, limited access Detailed Explanation:
External workers (e.g., contractors, temporary staff) are least likely to have privileged accounts and should be granted access based on the principle of least privilege.
** Question 51** The predetermined set of instructions or procedures to sustain business operations after a disaster is commonly known as: Options: A business impact analysis B disaster recovery plan C business impact plan D business continuity plan Correct Option: D business continuity plan Keywords for Exam: predetermined set of instructions, sustain business operations, after a disaster, comprehensive approach Detailed Explanation:
A Business Continuity Plan (BCP) is a comprehensive plan that outlines procedures to sustain essential business functions during and after a disaster. A DRP is a component of a BCP.
** Question 52** Which of the following is not an element of system security configuration management? Options: A inventory B baselines C updates D audit logs Correct Option: D audit logs Keywords for Exam: not an element, system security configuration management Detailed Explanation:
Key elements of configuration management include maintaining an inventory of systems, establishing security baselines, and managing updates. Audit logs are critical for security monitoring but are considered an output or a separate control, not a core component of configuration management itself.
** Question 53** Which are the components of an incident response plan, in the correct order? Options: A preparation, detection and analysis, recovery, containment, eradication, and post incident activity B preparation, detection and analysis, containment, eradication, post incident activity, and recovery C preparation, detection and analysis, eradication, recovery, containment, and post incident activity D preparation, detection and analysis, containment, eradication, recovery, and post incident activity Correct Option: D preparation, detection and analysis, containment, eradication, recovery, and post incident activity Keywords for Exam: components of an incident response plan, steps of an incident response plan, correct order Detailed Explanation:
The standard phases of an incident response plan (e.g., from NIST) are: Preparation; Detection and Analysis; Containment, Eradication, & Recovery; and Post-Incident Activity.
** Question 54** Which of the following is an example of 2FA (Two-Factor Authentication)? Options: A badges B passwords C keys D one-time passwords Correct Option: D one-time passwords Keywords for Exam: 2FA, two-factor authentication, two different forms of authentication Detailed Explanation:
Two-Factor Authentication (2FA) requires two different types of authentication factors. A one-time password (something you have) used with a regular password (something you know) is a classic example of 2FA.
** Question 55** Which of the following is not a feature of a cryptographic hash function? Options: A reversible B unique C deterministic D useful Correct Option: A reversible Keywords for Exam: not a feature, cryptographic hash function, irreversible, one-way function Detailed Explanation:
A key feature of a cryptographic hash function is that it is irreversible (a one-way function), meaning you cannot derive the original input from the hash output.
** Question 56** What are the three packets used in the TCP connection handshake? Options: A OFFER, REQUEST, ACK B SYN, SYN-ACK, ACK C SYN, FIN, ACK D DISCOVER, OFFER, REQUEST Correct Option: B SYN, SYN-ACK, ACK Keywords for Exam: three packets, TCP connection handshake, reliable connection Detailed Explanation:
The TCP three-way handshake establishes a reliable connection using three packets in order: SYN, SYN-ACK, and ACK.
** Question 57** After an earthquake disrupts business operations, which document contains the procedures required to return business to normal operation? Options: A the business impact plan B the business impact analysis C the business continuity plan D the disaster recovery plan Correct Option: D the disaster recovery plan Keywords for Exam: after an earthquake disrupting business operations, procedures to return business to normal operation Detailed Explanation:
A Disaster Recovery Plan (DRP) specifically contains the technical procedures to restore IT systems and infrastructure to normal operation after a disaster.
** Question 58** What is the consequence of a denial of service attack? Options: A exhaustion of device resources B malware infection C increase in the availability of resources D remote control of a device Correct Option: A exhaustion of device resources Keywords for Exam: consequence, denial of service attack, inaccessible, overwhelming with excessive traffic Detailed Explanation:
The primary consequence of a DoS attack is the exhaustion of device resources (like bandwidth, CPU, or memory), which renders the service unavailable.
** Question 59** According to ISC2, what are the six phases of data handling, in order? Options: A create, use, store, share, archive, and destroy B create, store, use, share, archive, and destroy C create, share, use, store, archive, and destroy D create, store, use, archive, share, and destroy Correct Option: B create, store, use, share, archive, and destroy Keywords for Exam: ISC2, six phases of data handling, correct order, data life cycle Detailed Explanation:
The six phases of the data lifecycle as defined by ISC2 are: Create, Store, Use, Share, Archive, and Destroy.
** Question 60** Which of the following is less likely to be part of an incident response team? Options: A legal representative B human resources C representatives of senior management D information security professional Correct Option: B human resources Keywords for Exam: less likely, part of an incident response team, core members Detailed Explanation:
Core members of an IR team typically include security professionals, legal counsel, and management representatives. Human Resources is generally involved only on a case-by-case basis (e.g., if an employee is involved).
** Question 61** Which of these tools is commonly used to crack passwords? Options: A Burp Suite B NSLookup C John the Ripper D Wireshark Correct Option: C John the Ripper Keywords for Exam: commonly used, crack passwords, brute force, dictionary attacks Detailed Explanation:
John the Ripper is a popular password cracking tool used to identify weak passwords through various attack methods.
** Question 62** In order to find out whether personal tablet devices are allowed in the office, which of the following policies would be helpful to read? Options: A BYOD (Bring Your Own Device) policy B privacy policy C change management policy D AUP (Acceptable Use Policy) Correct Option: A BYOD (Bring Your Own Device) policy Keywords for Exam: personal tablet devices, allowed in the office, policy, BYOD Detailed Explanation:
A BYOD (Bring Your Own Device) policy specifically outlines the rules and security requirements for employees using their personal devices for work purposes.
** Question 63** In which cloud deployment model do companies with similar interests share resources and infrastructure on the cloud? Options: A hybrid cloud B multi-tenant C private cloud D community cloud Correct Option: D community cloud Keywords for Exam: cloud deployment model, companies share resources and infrastructure, similar interests or requirements Detailed Explanation:
A community cloud is a model where organizations with similar interests (e.g., from the same industry or with the same regulatory requirements) share cloud resources.
** Question 64** Which of these is the primary objective of a disaster recovery plan? Options: A restore company IT operations to the last known reliable operation state B outline a safe escape procedure for the organization's personnel C maintain crucial company operations in the event of a disaster D communicate to the responsible entities the damage caused to the operations Correct Option: A restore company IT operations to the last known reliable operation state Keywords for Exam: primary objective, disaster recovery plan, restore company operation, functional state, IT systems and infrastructure Detailed Explanation:
The primary objective of a DRP is to restore a company's IT operations to a functional state, typically the last known reliable state, after a disaster.
** Question 65** An entity that acts to exploit a target organization's systems and abilities is a: Options: A threat actor B threat vector C threat D attacker Correct Option: A threat actor Keywords for Exam: entity that acts to exploit, individual or group, carries out attacks Detailed Explanation:
A threat actor is the individual or group that actively exploits vulnerabilities to carry out an attack. The threat vector is the path or means they use.
** Question 66** A best practice of patch management is to: Options: A apply all patches as quickly as possible B test patches before applying them C apply patches every Wednesday D apply patches according to vendor's reputation Correct Option: B test patches before applying them Keywords for Exam: best practice, patch management, test patches, controlled environment Detailed Explanation:
The single most important best practice for patch management is to test patches in a controlled, non-production environment before deploying them widely to avoid unintended consequences.
** Question 67** Which of these would be the best tool if a network administrator needs to control access to a network based on device compliance? Options: A HIDS (Host-based Intrusion Detection System) B IDS (Intrusion Detection System) C SIEM (Security Information and Event Management) D NAC (Network Access Control) Correct Option: D NAC (Network Access Control) Keywords for Exam: control access to a network, network administrator, NAC, device compliance Detailed Explanation:
Network Access Control (NAC) is a security solution designed to enforce policies and control access to a network based on device compliance and user identity.
** Question 68** Which of these is not a change management component? Options: A approval B RFC (Request for Change) C rollback D governance Correct Option: D governance Keywords for Exam: not a change management component, governance Detailed Explanation:
RFC, approval, and rollback are all core components of the change management process. Governance is the overarching framework of rules and practices that directs an organization, not a component of the change management process itself.
** Question 69** Which of the following is not a social engineering technique? Options: A pretexting B quid pro quo C double dealing D baiting Correct Option: C double dealing Keywords for Exam: not a social engineering technique, deception Detailed Explanation:
Pretexting, quid pro quo, and baiting are all established social engineering techniques. "Double dealing" is a general term for deceit and is not a recognized technique in cybersecurity.
** Question 70** If there is no time constraint, which protocol should be employed to establish a reliable connection between two devices? Options: A TCP (Transmission Control Protocol) B DHCP C SNMP D UDP (User Datagram Protocol) Correct Option: A TCP (Transmission Control Protocol) Keywords for Exam: no time constraint, reliable connection, between two devices, three-way handshake Detailed Explanation:
TCP (Transmission Control Protocol) is a connection-oriented protocol that establishes a reliable connection using a three-way handshake, ensuring data is delivered correctly and in order. UDP is faster but unreliable.
** Question 71** An exploitable weakness or flaw in a system or component is a: Options: A threat B bug C vulnerability D risk Correct Option: C vulnerability Keywords for Exam: exploitable weakness or flaw, in a system or component, targeted by attackers Detailed Explanation:
A vulnerability is an exploitable weakness or flaw in a system. A threat is an actor or event that might exploit that vulnerability.
** Question 72** In which cloud model does the cloud customer have the least responsibility over the infrastructure? Options: A IaaS (Infrastructure as a Service) B FaaS (Function as a Service) C PaaS (Platform as a Service) D SaaS (Software as a Service) Correct Option: D SaaS (Software as a Service) Keywords for Exam: cloud model, least responsibility over the infrastructure, cloud provider handles everything Detailed Explanation:
In the SaaS (Software as a Service) model, the cloud provider manages nearly all aspects of the service (application, data, runtime, OS, infrastructure), leaving the customer with the least responsibility.
** Question 73** Risk management is: Options: A the assessment of the potential impact of a threat B the creation of an incident response team C the impact and likelihood of a threat D the identification, evaluation, and prioritization of risk Correct Option: D the identification, evaluation, and prioritization of risk Keywords for Exam: risk management, identification evaluation and prioritization, mitigation strategy Detailed Explanation:
Risk management is the continuous process of identifying, evaluating (assessing likelihood and impact), and prioritizing risks to implement mitigation strategies effectively.
** Question 74** Which of the following documents contains elements that are not mandatory? Options: A policies B guidelines C regulation D procedures Correct Option: B guidelines Keywords for Exam: documents, not mandatory, recommendations or best practices Detailed Explanation:
Guidelines provide non-mandatory recommendations or best practices, offering flexibility in implementation. Policies, regulations, and procedures are generally mandatory.
** Question 75** In which of the following phases of an incident response plan is prioritization of the response performed? Options: A post incident activity B detection and analysis C preparation D containment, eradication, and recovery Correct Option: B detection and analysis Keywords for Exam: incident response plan, incident response is prioritized, severity and impact of the incident Detailed Explanation:
During the Detection and Analysis phase, the incident response team analyzes the event to understand its scope, urgency, and impact, which allows them to prioritize the response.
** Question 76** Which security principle states that a user should only have the necessary permission to execute a task? Options: A privileged accounts B separation of duties C least privilege D defense in depth Correct Option: C least privilege Keywords for Exam: security principle, only have the necessary permission, execute a task, minimum level of access Detailed Explanation:
The principle of least privilege dictates that users and systems should only be granted the minimum level of access and permissions necessary to perform their required tasks.
** Question 77** The Bell-LaPadula access control model is a form of: Options: A ABAC (Attribute-Based Access Control) B RBAC (Role-Based Access Control) C MAC (Mandatory Access Control) D DAC (Discretionary Access Control) Correct Option: C MAC (Mandatory Access Control) Keywords for Exam: Bell-LaPadula access control model, form of, security labels, confidentiality Detailed Explanation:
The Bell-LaPadula model is a type of Mandatory Access Control (MAC) model focused on enforcing confidentiality based on security classification labels.
** Question 78** In risk management, the highest priority is given to a risk where: Options: A the frequency of occurrence is low and the expected impact value is high B the expected probability of occurrence is low and potential impact is low C the expected probability of occurrence is high and the potential impact is low D the frequency of occurrence is high and the expected impact value is high Correct Option: D the frequency of occurrence is high and the expected impact value is high Keywords for Exam: risk management, highest priority, high frequency, high impact Detailed Explanation:
The highest priority is given to risks with both a high likelihood (frequency) of occurrence and a high potential impact, as these represent the greatest potential for damage. While low-frequency, high-impact events are also critical, high/high risks are typically prioritized first.
** Question 79** Which of the following areas is connected to PII (Personally Identifiable Information)? Options: A non-repudiation B authentication C integrity D confidentiality Correct Option: D confidentiality Keywords for Exam: connected to PII, personally identifiable information, secure them, unauthorized users Detailed Explanation:
PII (Personally Identifiable Information) is directly tied to the principle of confidentiality, which ensures that sensitive data is protected from unauthorized access.
** Question 80** Malicious emails that aim to attack company executives are an example of: Options: A Trojans B whaling C phishing D rootkits Correct Option: C whaling Keywords for Exam: malicious emails, attack company executives, high-profile individual, social engineering Detailed Explanation:
Whaling is a highly targeted form of phishing that specifically aims at senior executives and other high-profile individuals within an organization.
** Question 81** Governments can impose financial penalties as a consequence of breaking a: Options: A regulation B standard C policy D procedure Correct Option: A regulation Keywords for Exam: governments can impose, financial penalties, breaking a, legally binding rules Detailed Explanation:
Regulations are legally binding rules imposed by governments or regulatory bodies, and non-compliance can result in significant financial penalties.
** Question 82** Which type of attack attempts to trick the user into revealing personal information by sending a fraudulent message? Options: A phishing B cross-site scripting C denial of service D trojan Correct Option: A phishing Keywords for Exam: trick the user, revealing personal information, fraudulent message, emails Detailed Explanation:
Phishing is a social engineering attack that uses fraudulent messages (typically email) to trick users into revealing sensitive personal information.
** Question 83** In which of the following access control models can the creator of an object delegate permissions? Options: A ABAC (Attribute-Based Access Control) B MAC (Mandatory Access Control) C RBAC (Role-Based Access Control) D DAC (Discretionary Access Control) Correct Option: D DAC (Discretionary Access Control) Keywords for Exam: access control model, creator of an object, delegate permissions, owner's discretion Detailed Explanation:
In a Discretionary Access Control (DAC) model, the owner (creator) of an object has the discretion to grant or delegate permissions to other users.
** Question 84** Which type of attack has the primary objective of encrypting devices and their data and then demanding ransom payment for the decryption key? Options: A ransomware B Trojan C cross-site scripting D phishing Correct Option: A ransomware Keywords for Exam: primary objective, encrypting devices and their data, demanding ransom payment, decryption key Detailed Explanation:
Ransomware is malware that encrypts a victim's files and demands a ransom payment in exchange for the decryption key.
** Question 85** Which of the following cloud models allows access to fundamental computer resources like CPU, storage, memory, and operating system? Options: A SaaS (Software as a Service) B FaaS (Function as a Service) C PaaS (Platform as a Service) D IaaS (Infrastructure as a Service) Correct Option: D IaaS (Infrastructure as a Service) Keywords for Exam: cloud models, allow access to, fundamental computer resources, CPU storage memory operating system Detailed Explanation:
IaaS (Infrastructure as a Service) provides access to fundamental computing resources like virtual machines, storage, and networking, upon which customers can install their own operating systems and applications.
** Question 86** How many layers does the OSI model have? Options: A 7 B 4 C 6 D 5 Correct Option: A 7 Keywords for Exam: OSI model, how many layers, seven layers Detailed Explanation:
The OSI (Open Systems Interconnection) model has seven layers that standardize network functions. Mnemonic: All People Seem To Need Data Processing.
** Question 87** Which of these principles aims primarily at fraud detection? Options: A privileged accounts B defense in depth C least privilege D separation of duties Correct Option: D separation of duties Keywords for Exam: principle, aims primarily at fraud detection, no single individual has control Detailed Explanation:
Separation of duties is a key principle for fraud detection and prevention, ensuring that no single individual has control over all aspects of a critical transaction.
** Question 88** Which protocol uses a three-way handshake to establish a reliable connection? Options: A TCP B SMTP C UDP D SNMP Correct Option: A TCP Keywords for Exam: protocol, three-way handshake, reliable connection Detailed Explanation:
TCP (Transmission Control Protocol) uses a three-way handshake (SYN, SYN-ACK, ACK) to establish a reliable, connection-oriented session.
** Question 89** Which of the following is an example of a technical security control? Options: A access control list B turnstiles C fences D bollards Correct Option: A access control list Keywords for Exam: example, technical security control, software or hardware system Detailed Explanation:
An Access Control List (ACL) is a technical control implemented in software or hardware (like a firewall or router) to manage permissions. Turnstiles, fences, and bollards are physical controls.
** Question 90** Which type of attack attempts to gain information by observing the device's power consumption? Options: A side channel attack B trojans C cross-site scripting D denial of service Correct Option: A side channel attack Keywords for Exam: gain information, observing the devices power consumption, physical characteristics, electromagnetic emission or timing data Detailed Explanation:
A side-channel attack is a non-invasive attack that gathers information by observing physical characteristics of a device, such as its power consumption, timing, or electromagnetic emissions.
** Question 91** Which of these is the most distinctive property of PHI (Protected Health Information)? Options: A integrity B confidentiality C non-repudiation D authentication Correct Option: B confidentiality Keywords for Exam: most distinctive property, PHI, protected health information, unauthorized access, patient privacy Detailed Explanation:
The most critical property of PHI (Protected Health Information) is confidentiality. Regulations like HIPAA are primarily focused on protecting the privacy and confidentiality of patient health data.
** Question 92** Which of these is the most efficient and effective way to test a business continuity plan? Options: A simulations B walkthroughs C reviews D discussions Correct Option: A simulations Keywords for Exam: most efficient and effective way to test, business continuity plan, mimic real life scenarios, evaluate readiness Detailed Explanation:
Simulations are the most effective way to test a BCP because they mimic real-life disaster scenarios, allowing the team to practice their roles and identify weaknesses in the plan under pressure.
** Question 93** Which of the following cyber security concepts guarantees that information is accessible only to those authorized to access it? Options: A confidentiality B non-repudiation C authentication D accessibility Correct Option: A confidentiality Keywords for Exam: cyber security concepts, guarantees, accessible only to those authorized to access it, unauthorized disclosure Detailed Explanation:
Confidentiality is the core cybersecurity principle that guarantees information is not disclosed to unauthorized individuals, entities, or processes. It's the 'C' in the CIA triad.
** Question 94** In the event of a disaster, what should be the primary objective? Options: A apply disaster communication B protect the production database C guarantee the safety of people D guarantee the continuity of critical systems Correct Option: C guarantee the safety of people Keywords for Exam: disaster, primary objective, safety of people, human life and safety take precedence Detailed Explanation:
In any disaster, the primary, overriding objective is to ensure the safety of people. All other objectives, including system continuity, are secondary to human life.
** Question 95** A security professional should report violations of a company's security policy to: Options: A the ISC2 ethics committee B company management C national authorities D a court of law Correct Option: B company management Keywords for Exam: security professional, report violations, company's security policy, responsible for enforcing policies Detailed Explanation:
Violations of internal company policy should be reported through the appropriate internal channels, which is typically to company management, who are responsible for enforcement.
** Question 96** Which department in a company is not regularly involved in the hands-on processes of a DRP (Disaster Recovery Plan)? Options: A executives B IT C public relations D financial Correct Option: A executives Keywords for Exam: not regularly involved, DRP, hands-on processes Detailed Explanation:
Executives are responsible for approving and funding a DRP, but they are not typically involved in the hands-on, technical execution of the plan. That responsibility falls to IT, security, and operations teams.
** Question 97** Which of the following is likely included in an SLA (Service Level Agreement) document? Options: A instructions on data ownership and destruction B a list of all company employees C the company's marketing plan D the source code of the provided service Correct Option: A instructions on data ownership and destruction Keywords for Exam: included in SLA, service level agreement, contract, data ownership and destruction Detailed Explanation:
An SLA is a contract that defines the level of service, and it often includes important clauses regarding data handling, such as ownership, security responsibilities, and destruction procedures upon termination of the service.
** Question 98** What is the most important difference between MAC (Mandatory Access Control) and DAC (Discretionary Access Control)? Options: A MAC is more flexible than DAC B DAC is used by the military, while MAC is for commercial use C In MAC, the security administrator assigns access permissions, while in DAC, access permissions are set at the object owner's discretion D MAC uses roles, while DAC uses attributes Correct Option: C In MAC, the security administrator assigns access permissions, while in DAC, access permissions are set at the object owner's discretion Keywords for Exam: most important difference, MAC and DAC, who controls access permissions Detailed Explanation:
The key difference is control: In MAC, access is controlled centrally by a security administrator based on system-wide policies. In DAC, the owner of the resource controls who has access.
** Question 99** Requiring a specific user role to access resources is an example of: Options: A mandatory access control B attribute based access control C role based access control D discretionary access control Correct Option: C role based access control Keywords for Exam: requiring a specific user role, access resources, user's assigned role Detailed Explanation:
This is the definition of Role-Based Access Control (RBAC), where permissions are assigned to roles, and users are assigned to roles.
** Question 100** Which type of document outlines the procedures ensuring that vital company systems keep running during business disrupting events? Options: A business impact plan B business impact analysis C disaster recovery plan D business continuity plan Correct Option: D business continuity plan Keywords for Exam: outlines the procedures, vital company systems keep running, business disruption disrupting events, maintaining critical functions Detailed Explanation:
A Business Continuity Plan (BCP) focuses on maintaining essential business functions during a disruption. A DRP, a subset of the BCP, focuses specifically on restoring IT systems.
** Question 101** Which of the following is not a best practice in access management? Options: A give only the right amount of permission B periodically assess if user permissions still apply C request a justification when upgrading permission D trust but verify Correct Option: D trust but verify Keywords for Exam: not a best practice, access management, never trust and always verify Detailed Explanation:
The modern security principle, central to the Zero Trust model, is "Never trust, always verify." "Trust but verify" implies an initial level of trust that is not considered a best practice in secure access management.
** Question 102** If a company collects PII (Personally Identifiable Information), which policy is required? Options: A remote access policy B GDPR C privacy policy D acceptable use policy Correct Option: C privacy policy Keywords for Exam: company collects PII, personally identifiable information, policy is required Detailed Explanation:
Any organization that collects PII must have a privacy policy that clearly explains what data is collected and how it is used, stored, and protected.
** Question 103** Which of these is least likely to be installed by an infection? Options: A logic bomb B key logger C Trojan D back door Correct Option: A logic bomb Keywords for Exam: least likely to be installed by an infection, triggered by a specific condition or event Detailed Explanation:
A logic bomb is a malicious code that is triggered by a specific condition (e.g., a certain date or event). They are often placed intentionally by an insider and are less likely to be installed via a typical malware infection compared to keyloggers or Trojans.
** Question 104** The best defense method to stop a replay attack is to: Options: A use an IPSec VPN B use a firewall C use password authentication D use message digesting Correct Option: A use an IPSec VPN Keywords for Exam: best defense method, stop a replay attack, IPSec VPN, encryption and authentication, freshness of data Detailed Explanation:
IPSec has built-in anti-replay protection. It uses sequence numbers to track packets and ensure that an attacker cannot capture and resend a valid packet.
** Question 105** Which of these devices has the primary objective of determining the most efficient path for traffic to flow across the network? Options: A hubs B firewalls C routers D switches Correct Option: C routers Keywords for Exam: primary objective, determining the most efficient path, traffic to flow across the network, routing Detailed Explanation:
A router's primary function is routing: determining the most efficient path for data packets to travel between different networks.
** Question 106** Which of these types of malware self-replicates without the need for human intervention? Options: A worm B trojan C virus D rootkit Correct Option: A worm Keywords for Exam: types of malware, self-replicates, without the need for human intervention Detailed Explanation:
A worm is a type of malware that can self-replicate and spread across networks automatically, without any human interaction. Viruses require a host file and human action to spread.
** Question 107** As an ISC2 member, you are expected to perform with "due care". What does "due care" specifically mean? Options: A do what is right in each situation you encounter on the job B give continuity to the legacy of security practices of your company C apply patches annually D research and acquire the knowledge to do your job right Correct Option: A do what is right in each situation you encounter on the job Keywords for Exam: ISC2 member, due care, due diligence, reasonable caution, responsibility and diligence Detailed Explanation:
Due care is about taking reasonable precautions and doing what a prudent person would do in a given situation (Option A). Due diligence is the research and investigation required to make informed decisions (closer to Option D). You perform due diligence to be able to exercise due care.
** Question 108** During the investigation of an incident, which security policies are more likely to cause difficulties? Options: A configuration standards B incident response policies C communication policies D retention policies Correct Option: D retention policies Keywords for Exam: investigation of an incident, more likely to cause difficulties, data retention periods, critical evidence Detailed Explanation:
Data retention policies can cause major difficulties. If policies require data (like logs) to be deleted too quickly, critical evidence for an investigation may be lost.
** Question 109** In an Access Control List (ACL), the element that determines which permissions you have is: Options: A the subject B the object C the firmware D the rule Correct Option: D the rule Keywords for Exam: ACL, Access Control List, element that determines, which permissions, rule specifies the action Detailed Explanation:
An ACL is composed of rules (also called Access Control Entries or ACEs). Each rule specifies a subject (user/group), an object (file/resource), and the permissions (allow/deny) for a specific action. The rule is the element that determines the permission.
** Question 110** What does the term "data remnants" refer to? Options: A data in use that cannot be encrypted B files saved locally that cannot be accessed remotely C data left over after routine removal and deletion D all of the data in a system Correct Option: C data left over after routine removal and deletion Keywords for Exam: data remnants, residual data, remains on storage media, could potentially be recovered, security risk Detailed Explanation:
Data remnants (or residual data) is the data that remains on storage media even after standard file deletion or formatting procedures have been performed.
** Question 111** Which type of recovery site has some or more systems in place but does not have the data needed to take over operations? Options: A hot site B a cloud site C a warm site D a cold site Correct Option: C a warm site Keywords for Exam: recovery site, systems in place, does not have the data, takes some time to restore Detailed Explanation:
A warm site has network connectivity and the necessary hardware, but it lacks the up-to-date data. It takes some time to restore data and bring the site online. A hot site is ready to go almost instantly, and a cold site is just an empty facility.
** Question 112** Which of these is not a characteristic of an MSP (Managed Service Provider) implementation? Options: A manage all in-house company infrastructure B monitor and respond to security incidents C mediate, execute, and decide top-level decisions D utilize expertise for the implementation of a product or service Correct Option: A manage all in-house company infrastructure Keywords for Exam: not a characteristic, MSP, Managed Service Provider, focus on specific areas Detailed Explanation:
An MSP typically manages specific, outsourced functions (like security monitoring or helpdesk services). They do not usually manage all of a company's in-house infrastructure.
** Question 113** Which of these is not a typical component of a comprehensive Business Continuity Plan (BCP)? Options: A a cost prediction of the immediate response procedures B immediate response procedures and checklists C notification systems and call trees for alerting personnel D a list of the BCP team members Correct Option: A a cost prediction of the immediate response procedures Keywords for Exam: not a typical component, comprehensive business continuity plan, BCP, prioritizes actionable strategies, not financial forecasting Detailed Explanation:
A BCP focuses on actionable procedures, checklists, and communication plans to maintain business operations. Detailed cost prediction is part of the overall business case and risk analysis, not typically a component of the BCP document itself.
** Question 114** Acting ethically is mandatory for ISC2 members. Which of these is not considered unethical? Options: A disrupting the intended use of the internet B seeking to gain unauthorized access to resources on the internet C compromising the privacy of users D having fake social media profiles and accounts Correct Option: D having fake social media profiles and accounts Keywords for Exam: not considered unethical, ISC2 members, ethical canons violation Detailed Explanation:
While potentially deceptive, having fake social media profiles is not explicitly a violation of the ISC2 Code of Ethics canons, unlike disrupting networks, gaining unauthorized access, or compromising privacy.
** Question 115** In an incident response process, which phase uses Indicators of Compromise and log analysis as part of a review of events? Options: A preparation B eradication C identification D containment Correct Option: C identification Keywords for Exam: incident response process, phase uses, indicators of compromise, log analysis, review of events Detailed Explanation:
The Identification phase (part of the broader "Detection and Analysis" phase) is where the team analyzes events, logs, and Indicators of Compromise (IoCs) to confirm if a security incident has occurred and to determine its nature.
** Question 116** Which of these access control systems is commonly used in the military? Options: A ABAC (Attribute-Based Access Control) B DAC (Discretionary Access Control) C RBAC (Role-Based Access Control) D MAC (Mandatory Access Control) Correct Option: D MAC (Mandatory Access Control) Keywords for Exam: access control systems, commonly used in the military, security classifications, centralized control Detailed Explanation:
Mandatory Access Control (MAC) is commonly used in military and other high-security environments because it enforces system-wide security policies based on classification levels that users cannot change.
** Question 117** Which of these is not a security principle? Options: A security in depth B zero trust model C least privilege D separation of duties Correct Option: A security in depth Keywords for Exam: not a security principle, security in depth is not an established term, defense in depth Detailed Explanation:
"Defense in Depth" is the correct, established security principle. "Security in Depth" is not the standard term and is likely a distractor. Zero Trust, Least Privilege, and Separation of Duties are all valid security principles/models.
** Question 118** Which of these is not a common goal of a cyber security attacker? Options: A allocation B alteration C disclosure D denial Correct Option: A allocation Keywords for Exam: not a common goal, cyber security attacker, CIA triad Detailed Explanation:
Common goals of attackers map to compromising the CIA triad: Disclosure (Confidentiality), Alteration (Integrity), and Denial (Availability). Allocation is not a recognized goal of an attack.
** Question 119** Which of these layers is not part of the TCP/IP model? Options: A application B physical C internet D transport Correct Option: B physical Keywords for Exam: not part of TCP IP model, four layers, physical layer Detailed Explanation:
The TCP/IP model has four layers: Application, Transport, Internet, and Network Access. The Physical layer is part of the OSI model but is subsumed into the Network Access layer in the TCP/IP model.
** Question 120** On a BYOD (Bring Your Own Device) model, which of these technologies is best suited to keep corporate data and applications separate from personal data? Options: A biometrics B full device encryption C context aware authentication D containerization Correct Option: D containerization Keywords for Exam: BYOD model, best suited, keep corporate data and applications separate from personal Detailed Explanation:
Containerization creates a secure, isolated workspace on a personal device for corporate apps and data, effectively separating them from the user's personal data.
** Question 121** In the context of risk management, what information does ALE (Annualized Loss Expectancy) outline? Options: A the expected cost per year of not performing a given risk mitigation action B the total number of risks identified in a year C the cost of implementing a security control D the probability of a risk occurring in a given year Correct Option: A the expected cost per year of not performing a given risk mitigation action Keywords for Exam: ALE, Annualized Loss Expectancy, risk management metric, expected cost per year Detailed Explanation:
ALE (Annualized Loss Expectancy) is a risk management metric that estimates the expected financial loss from a specific risk over a one-year period. The formula is ALE = SLE * ARO.
** Question 122** Which of these techniques is primarily used to ensure data integrity? Options: A message digest B content encryption C backups D hashing Correct Option: D hashing Keywords for Exam: primarily used, data integrity, hash function, fixed size output, different hash value, not altered or corrupted Detailed Explanation:
Hashing is the primary technique for ensuring data integrity. It creates a unique digital fingerprint (hash value) of the data. If the data changes, the hash value changes, indicating a loss of integrity. A message digest is the output of a hash function.
** Question 123** Which of these is an example of a privacy breach? Options: A any observable occurrence in a network or system B being exposed to the possibility of attack C unavailability of critical systems D access of private information by an unauthorized person Correct Option: D access of private information by an unauthorized person Keywords for Exam: privacy breach, private or personal information, accessed disclosed or used by someone who is not authorized Detailed Explanation:
A privacy breach is the unauthorized access, disclosure, or use of private or personally identifiable information.
** Question 124** What is a collection of fixes that are bundled together called? Options: A hotfix B patch C service pack D downgrade Correct Option: C service pack Keywords for Exam: collection of fixes, bundled together, single package, multiple patches and hotfixes Detailed Explanation:
A service pack is a collection of updates, fixes (patches), and enhancements delivered as a single installable package.
** Question 125** While performing background checks on new employees, which of these can never be an attribute for discrimination? Options: A references B education C political affiliation D employment history Correct Option: C political affiliation Keywords for Exam: background checks, new employees, never be an attribute for discrimination, political affiliation Detailed Explanation:
In many jurisdictions, political affiliation is a protected characteristic, and using it as a basis for hiring decisions is illegal discrimination.
** Question 126** What is the most important objective of a cyber security insurance policy? Options: A risk avoidance B risk transference C risk spreading D risk acceptance Correct Option: B risk transference Keywords for Exam: cyber security insurance, most important objective, transferring the financial burden, insurance company Detailed Explanation:
The purpose of any insurance policy, including cyber security insurance, is risk transference: transferring the financial burden of a potential loss to the insurance company.
** Question 127** Which kind of document outlines the procedures ensuring that vital company systems keep running during business disrupting events? Options: A business impact analysis B business impact plan C business continuity plan D disaster recovery plan Correct Option: C business continuity plan Keywords for Exam: document outlines the procedures, vital company systems keep running, business disrupting events, maintaining essential business functions Detailed Explanation:
This is the definition of a Business Continuity Plan (BCP). It focuses on keeping essential business functions running during a disruption.
** Question 128** Which of these social engineering attacks sends emails that target specific individuals? Options: A pharming B whaling C vishing D spear phishing Correct Option: D spear phishing Keywords for Exam: social engineering attacks, sends emails, target specific individuals, personalized information Detailed Explanation:
Spear phishing is a targeted email attack against specific individuals or organizations, often using personalized information to appear more legitimate.
** Question 129** Which of these properties is not guaranteed by a Message Authentication Code (MAC)? Options: A authenticity B anonymity C integrity D non-repudiation Correct Option: D non-repudiation Keywords for Exam: not guaranteed, Message Authentication Code (MAC), authenticity, integrity, does not provide non-repudiation Detailed Explanation:
A MAC provides authenticity (proof of origin) and integrity. However, it does not provide non-repudiation, because the symmetric key is shared between the sender and receiver, either party could have created the MAC. Digital signatures provide non-repudiation.
** Question 130** What is the primary objective of degaussing? Options: A protecting against side-channel attacks B reducing noise in data C erasing the data on a disk D archiving data Correct Option: C erasing the data on a disk Keywords for Exam: primary objective, degaussing, erase data on a disk, disrupting magnetic fields, magnetic storage devices Detailed Explanation:
Degaussing is a data destruction method that uses a strong magnetic field to completely and permanently erase data from magnetic storage media like hard drives and tapes.
** Question 131** Which of these is part of the ISC2 Code of Ethics canons? Options: A always prioritize the company's interest over the public B advance and protect the profession C share confidential information if it helps the company D use any means necessary to secure systems Correct Option: B advance and protect the profession Keywords for Exam: part of the canons, ISC2 code of ethics, advance and protect the profession Detailed Explanation:
"Advance and protect the profession" is the fourth canon of the ISC2 Code of Ethics. The other options are unethical.
** Question 132** Which of these is not one of the ISC2 ethics canons? Options: A protect society and the common good B act honorably, honestly, and legally C consider the social consequences of the system you are designing D provide diligent and competent service to principles Correct Option: C consider the social consequences of the system you are designing Keywords for Exam: not one of the ISC2 ethics cannons, ethical consideration, not an official canon Detailed Explanation:
While considering the social consequences of one's work is an important ethical consideration, it is not one of the four official canons of the ISC2 Code of Ethics.
** Question 133** What is the primary objective of the PCI-DSS standard? Options: A securing Personally Identifiable Information (PII) B securing change management processes C securing credit card payments D securing Protected Health Information (PHI) Correct Option: C secure credit card payments Keywords for Exam: primary objective, PCI-DSS standard, Payment Card Industry Data Security Standard, securing the credit card payments Detailed Explanation:
PCI-DSS (Payment Card Industry Data Security Standard) is a set of security standards designed to ensure that all companies that accept, process, store or transmit credit card information maintain a secure environment.
** Question 134** Which of these is an attack that encrypts an organization's information and then demands payment for the decryption code? Options: A phishing B denial of service C trojan D ransomware Correct Option: D ransomware Keywords for Exam: attack, encrypts the organization information, demands payment for the decryption code Detailed Explanation:
This is the definition of a ransomware attack.
** Question 135** The primary objective of a business continuity plan is to: Options: A restore IT systems after a disaster B maintain business operations during a disaster C identify critical business assets D test the disaster recovery plan Correct Option: B maintain business operation during a disaster Keywords for Exam: primary objective, business continuity plan, maintain business operation, during a disaster, minimize disruptions, ensure essential functions continue Detailed Explanation:
The primary objective of a BCP is to maintain essential business operations during a disaster. Restoring IT systems (A) is the goal of a DRP, which is a part of the overall BCP.
** Question 136** Which of these is an attack whose primary goal is to gain access to a target system through a falsified identity? Options: A sniffing B man-in-the-middle C spoofing D denial of service Correct Option: C spoofing Keywords for Exam: attack, primary goal, gain access to a target system, falsified identity, impersonating another user or system Detailed Explanation:
Spoofing is an attack where an attacker impersonates another user, device, or system to gain unauthorized access or trick a target.
** Question 137** When an incident occurs, which of these is not a primary responsibility of an organization's response team? Options: A determining the scope of the damage B executing recovery procedures C determining what, if any, confidential information was compromised D communicating with top management regarding the circumstances of the cyber security event Correct Option: D communicating with top management regarding the circumstances of the cyber security event Keywords for Exam: not primary responsibility, organization's response team, communicating with top management, incident reporting or public relation teams Detailed Explanation:
The technical incident response team is responsible for the hands-on work of containment, eradication, and recovery (A, B, C). Communicating with top management is typically the responsibility of the incident response manager or a separate communications/PR team.
** Question 138** What is the primary objective of a rollback in the context of the change management process? Options: A to apply a new patch to the system B to document the changes made C restore the system to its last state before the change was made D to approve the change request Correct Option: C restore the system to its last state before the change was made Keywords for Exam: primary objective, roll back, change management process, restore the system to its previous stable state Detailed Explanation:
The purpose of a rollback plan is to restore a system to its last known good state if a change fails or causes unexpected problems.
** Question 139** Which of these entities is responsible for signing an organization's policies? Options: A HR department B legal department C IT department D senior management Correct Option: D senior management Keywords for Exam: responsible for signing, organization's policies, authority to approve and enforce Detailed Explanation:
Senior management holds the ultimate responsibility and authority for an organization's policies, so they are the ones who must formally approve and sign them.
** Question 140** Which of these terms refer to a threat with unusually high technical and operational sophistication spanning months or even years? Options: A rootkit B APT (Advanced Persistent Threat) C side channel attack D ping of death Correct Option: B APT (Advanced Persistent Threat) Keywords for Exam: threat, unusually high technical and operational sophistication, spanning months or even years, long-term access, stealthy Detailed Explanation:
This is the definition of an Advanced Persistent Threat (APT). These are sophisticated, long-term, targeted attacks, often state-sponsored.
** Question 141** The primary objective of a security baseline is to establish: Options: A the maximum possible security for a system B a minimum understood and acceptable level of security requirements C a list of all vulnerabilities in a system D a process for daily security audits Correct Option: B a minimum understood and acceptable level of security requirements Keywords for Exam: primary objective, security baseline, minimum understood and acceptable level of security requirements, consistency across the organization Detailed Explanation:
A security baseline establishes a standard, minimum level of security that must be applied consistently across all similar systems in an organization.
** Question 142** Which of these attacks take advantage of poor input validation in websites? Options: A trojans B denial of service C cross-site scripting D man-in-the-middle Correct Option: C cross-site scripting Keywords for Exam: attacks, take advantage of, poor input validation, websites, inject malicious scripts Detailed Explanation:
Cross-site scripting (XSS) is a type of injection attack where malicious scripts are injected into otherwise benign and trusted websites due to poor input validation.
** Question 143** An organization needs a network security tool that detects and acts in the event of malicious activity. Which of these tools will best meet their needs? Options: A router B IPS (Intrusion Prevention System) C IDS (Intrusion Detection System) D firewall Correct Option: B IPS (Intrusion Prevention System) Keywords for Exam: network security tool, detects and acts, malicious activity, actively takes action to block or mitigate Detailed Explanation:
An IDS only detects and alerts. An IPS (Intrusion Prevention System) both detects malicious activity and actively takes steps to block it.
** Question 144** According to the DAC (Discretionary Access Control) policy, which of these operations can only be performed by the information owner? Options: A reading information B executing information C modifying information D modifying security attributes Correct Option: D modifying security attributes Keywords for Exam: DAC, Discretionary Access Control, performed by the owner of the information Detailed Explanation:
Under DAC, the owner of an object has the discretion to control its permissions. This includes modifying the security attributes (like the ACL) for that object. Other users may be granted read/write/execute permissions, but only the owner can change those permissions.
** Question 145** In the event of non-compliance, which of these can have considerable financial consequences for an organization? Options: A policies B regulations C standards D procedures Correct Option: B regulations Keywords for Exam: non-compliance, considerable financial consequences, legally enforceable rules, fines and penalties Detailed Explanation:
Regulations are legally enforceable, and non-compliance can lead to significant fines and penalties imposed by regulatory bodies.
** Question 146** What does the term LAN (Local Area Network) refer to? Options: A a network that spans a large city B a network in a building or limited geographical area C the global network of computers D a private network that uses public infrastructure Correct Option: B a network in a building or limited geographical area Keywords for Exam: LAN, local area network, limited geographical area, building office or campus Detailed Explanation:
A LAN is a network confined to a small, limited geographical area like a single building, office, or campus.
** Question 147** Which of these is a type of corrective security control? Options: A patches B encryption C IDS D backups Correct Option: D backups Keywords for Exam: type of corrective security controls, fix vulnerabilities or mitigate the impact, after it has occurred Detailed Explanation:
Corrective controls are used to fix an issue after an incident has occurred. Restoring from backups is a prime example of a corrective control. Patches can also be seen as corrective, as they fix a vulnerability that has been detected. Between the two, backups are more purely corrective, while patches can also be preventive.
** Question 148** Which of these enables point-to-point online communication over an untrusted network? Options: A router B switch C LAN D VPN Correct Option: D VPN Keywords for Exam: enables point-to-point online communication, untrusted network, encryption and tunneling protocols, privacy and security Detailed Explanation:
A VPN (Virtual Private Network) creates a secure, encrypted tunnel for point-to-point communication across an untrusted public network like the internet.
** Question 149** At which of the OSI layers do TCP and UDP work? Options: A transport layer B network layer C data link layer D application layer Correct Option: A transport layer Keywords for Exam: OSI layer, TCP and UDP work, reliable and unreliable data transmission Detailed Explanation:
TCP and UDP are core protocols of the Transport Layer (Layer 4) of the OSI model, responsible for end-to-end data transmission.
** Question 150** What is the primary focus of the ISO/IEC 27002 standard? Options: A detailed technical specifications for encryption algorithms B code of practice for information security controls C legal requirements for data breach notifications D financial auditing procedures Correct Option: B code of practice for information security controls Keywords for Exam: primary focus, ISO 27002 standard, Information Security Management System (ISMS), guidelines and best practices, manage risk effectively Detailed Explanation:
ISO/IEC 27002 provides a code of practice with guidelines and best practices for implementing information security controls based on the framework established in ISO/IEC 27001.
** Question 151** Which of these subnet masks will allow for 30 hosts? Options: A /30 B /29 C /27 D /26 Correct Option: C /27 Keywords for Exam: subnet masks, allow 30 host, calculate number of hosts, 2^n - 2 Detailed Explanation:
To find the number of hosts, use the formula 2^n - 2, where n is the number of host bits. For a /27 subnet, there are 32 - 27 = 5 host bits. So, 2^5 - 2 = 32 - 2 = 30 hosts.
** Question 152** Which of these statements about the security implications of IP version 6 is not true? Options: A IPv6 traffic could bypass IPv4 security controls B IPv6 NAT implementation is insecure C IPv6 static address filtering rules may not apply D IPv6 reputation services are less common Correct Option: B IPv6 NAT implementation is insecure Keywords for Exam: not true, security implications of IPv6, IPv6 does not include NAT Detailed Explanation:
The statement "IPv6 NAT implementation is insecure" is not true because IPv6 was designed with a massive address space to make NAT (Network Address Translation) unnecessary. IPv6 does not include NAT.
** Question 153** Which of these is a detective security control? Options: A bollards B movement sensors C turnstiles D firewalls Correct Option: B movement sensors Keywords for Exam: detective security control, identifies and alerts, security breach has occurred, does not prevent it Detailed Explanation:
Detective controls are designed to detect and alert on security events. Movement sensors detect unauthorized physical presence and are therefore a detective control.
** Question 154** The name, age, location, and job title of a person are examples of: Options: A biometrics B attributes C PII D credentials Correct Option: B attributes Keywords for Exam: name age and location, job title, examples of, characteristics Detailed Explanation:
Name, age, location, and job title are all characteristics, or attributes, of a person. When combined, they can become PII (Personally Identifiable Information).
** Question 155** Which of these cloud service models is the most suitable environment for customers that want to install their custom operating systems? Options: A PaaS (Platform as a Service) B SaaS (Software as a Service) C IaaS (Infrastructure as a Service) D FaaS (Function as a Service) Correct Option: C IaaS (Infrastructure as a Service) Keywords for Exam: cloud service model, most suitable environment, install their custom operating systems, control over the VMs Detailed Explanation:
IaaS (Infrastructure as a Service) provides the most control, allowing customers to provision virtual machines and install their own custom operating systems.
** Question 156** Which of these is an illegal practice that involves registering a domain name with the intent of profiting from someone else's trademark? Options: A typosquatting B brandjacking C cybersquatting D domain flipping Correct Option: C cybersquatting Keywords for Exam: cyber squatting, illegal practice, trademark, profiting from someone else's trademark Detailed Explanation:
Cybersquatting is the bad-faith registration of a domain name containing someone else's trademark with the intent to profit from it.
** Question 157** Which of these addresses is commonly reserved specifically for broadcasting inside a /24 subnet? Options: A 192.168.1.0 B 192.168.1.1 C 192.168.1.128 D 192.168.1.255 Correct Option: D 192.168.1.255 Keywords for Exam: addresses, commonly reserved, specifically for broadcasting, last address inside a subnet Detailed Explanation:
In any given subnet, the last IP address is reserved as the broadcast address. For a /24 network (e.g., 192.168.1.0 to 192.168.1.255), the broadcast address is 192.168.1.255.
** Question 158** Which department in a company is not typically involved in the technical execution of a Disaster Recovery Plan (DRP)? Options: A IT B Public Relations C Security Operations D Financial Correct Option: D Financial Keywords for Exam: not typically involved, disaster recovery plan, DRP, technical execution Detailed Explanation:
The financial department is crucial for budgeting and assessing the financial impact of a disaster, but they are not involved in the hands-on technical execution of restoring systems. That is the role of IT and Security Operations.
** Question 159** Which of these pairs does not constitute multi-factor authentication? Options: A password and fingerprint B smart card and PIN C password and username D OTP token and password Correct Option: C password and username Keywords for Exam: not constitute multifactor authentication, multi-factor, more than one factor, same type of authentication factor Detailed Explanation:
Multi-factor authentication requires using factors from at least two different categories (know, have, are). A password and username are both from the "something you know" category, so this is single-factor authentication.
** Question 160** What is the main use of a ping sweep? Options: A to measure network bandwidth B to analyze packet contents C to discover live hosts D to crack passwords Correct Option: C to discover live hosts Keywords for Exam: main use, ping sweep, discover live hosts, network scanning technique, identify active devices Detailed Explanation:
A ping sweep is a network scanning technique used to discover which hosts are active (live) on a network by sending ICMP echo requests to a range of IP addresses.
** Question 161** A poster reminding employees about best password management practices is an example of which type of learning activity? Options: A awareness B training C education D tutorial Correct Option: A awareness Keywords for Exam: poster reminding, best password management practice, example of, learning activity, engaging a user's attention, security conscious culture Detailed Explanation:
Posters, newsletters, and short reminders are tools for security awareness, designed to keep security top-of-mind and reinforce a security-conscious culture.
** Question 162** In the context of the CIA Triad, which part is primarily jeopardized in a Distributed Denial of Service (DDoS) attack? Options: A confidentiality B availability C integrity D non-repudiation Correct Option: B availability Keywords for Exam: CIA triad, primarily jeopardized, distributed denial of service attack, inaccessible, compromise availability Detailed Explanation:
A DDoS attack's primary goal is to overwhelm a service with traffic, making it unavailable to legitimate users, thus jeopardizing its Availability.
** Question 163** What is the main purpose of motion detection in security cameras? Options: A to improve video resolution B to reduce video storage space C to enable night vision D to track moving objects with AI Correct Option: B to reduce video storage space Keywords for Exam: main purpose, motion detection, security cameras, reduce video storage space, records only when motion is detected Detailed Explanation:
The main purpose of motion detection is to save significant video storage space by only recording footage when motion is detected, rather than recording continuously.
** Question 164** An organization that uses a layered approach when designing its security architecture is using which of these security approaches? Options: A zero trust B defense in depth C security through obscurity D access control models Correct Option: B defense in depth Keywords for Exam: layered approach, security architecture, security approaches, different layers of security controls Detailed Explanation:
A layered approach to security, where multiple controls are placed throughout a system, is the definition of the Defense in Depth security principle.
** Question 165** Which of these techniques ensures the property of non-repudiation? Options: A hashing B encryption C digital signatures D symmetric keys Correct Option: C digital signatures Keywords for Exam: techniques, ensure the property of non-repudiation, cannot later deny, digital signatures Detailed Explanation:
Digital signatures, created with a user's private key, provide non-repudiation because only that user could have created the signature, preventing them from later denying it.
** Question 166** A USB pen with data passed around the office is an example of: Options: A data in use B data at rest C data in motion D data in transit Correct Option: B data at rest Keywords for Exam: USB pen with data, stored data, resides on storage media Detailed Explanation:
Data stored on any storage media, such as a USB drive, hard drive, or backup tape, is considered data at rest.
** Question 167** Suppose that an organization wants to implement measures to strengthen its detective access controls. Which one of these tools should they implement? Options: A patches B encryption C IDS (Intrusion Detection System) D backups Correct Option: C IDS (Intrusion Detection System) Keywords for Exam: detective access controls, tool, implement, monitors network traffic, alerts on suspicious activity Detailed Explanation:
An IDS (Intrusion Detection System) is a detective control. Its purpose is to monitor network or system activities for malicious activity or policy violations and produce reports to a management station.
** Question 168** Which of these is an example of a MAC (Media Access Control) address? Options: A 192.168.1.1 B 00:0a:95:9d:68:16 C 2001:0db8:85a3:0000:0000:8a2e:0370:7334 D www.example.com Correct Option: B 00:0a:95:9d:68:16 Keywords for Exam: example of a MAC address, six groups of two hexadecimal digits, separated by colons or hyphens Detailed Explanation:
A MAC address is a 48-bit hardware address represented as six groups of two hexadecimal digits, separated by colons or hyphens.
** Question 169** Which of these types of credentials is not used in multi-factor authentication? Options: A something you know B something you are C something you have D something you trust Correct Option: D something you trust Keywords for Exam: not used in multifactor authentication, authentication factors, something you know, something you are, something you have Detailed Explanation:
The three recognized categories of authentication factors are: something you know (e.g., password), something you have (e.g., token), and something you are (e.g., fingerprint). "Something you trust" is not a standard category.
** Question 170** In an incident response team, who is the main conduit to senior management? Options: A incident response manager B legal counsel C technical lead D human resources Correct Option: A incident response manager Keywords for Exam: incident response team, main conduit to senior management, communication, decisions Detailed Explanation:
The Incident Response Manager is responsible for leading the team, coordinating efforts, and serving as the primary point of contact for communication with senior management.
** Question 171** Which of these is not an effective way to protect an organization from cyber criminals? Options: A removing unnecessary services and protocols B using a firewall C using outdated antimalware software D using an intrusion detection system Correct Option: C using outdated antimalware software Keywords for Exam: not an effective way, protect, cyber criminals, outdated antimalware software, new threats emerge daily Detailed Explanation:
Using outdated antimalware software is ineffective because new threats emerge daily, and software that is not up-to-date will not have the signatures or heuristics to detect them.
** Question 172** Which of these cannot be a corrective security control? Options: A antivirus software B backup and restore systems C patches D CCTV cameras Correct Option: D CCTV cameras Keywords for Exam: cannot be a corrective security control, corrective controls fix or mitigate, after an incident Detailed Explanation:
Corrective controls fix or mitigate a problem after an incident. Antivirus can clean an infection, backups can restore data, and patches can fix a vulnerability. CCTV cameras are detective and deterrent controls; they cannot fix a problem.
** Question 173** Which of these is included in an SLA (Service Level Agreement) document? Options: A instructions on data ownership and destruction B the company's annual financial report C employee vacation schedules D marketing strategies Correct Option: A instructions on data ownership and destruction Keywords for Exam: included in SLA, service level agreement, contract, data ownership handling and destruction Detailed Explanation:
An SLA defines the terms of a service, which includes metrics like uptime and availability, as well as responsibilities for data handling, ownership, and destruction.
** Question 174** Which of these is the standard port for SSH (Secure Shell)? Options: A 80 B 443 C 25 D 22 Correct Option: D 22 Keywords for Exam: standard port, SSH, secure shell, encrypted network protocol Detailed Explanation:
Port 22 is the standard TCP port for the Secure Shell (SSH) protocol.
** Question 175** Which type of attack attempts to mislead a user into exposing personal information by sending a fraudulent email? Options: A denial of service B ransomware C trojan D phishing Correct Option: D phishing Keywords for Exam: attack, mislead user, exposing personal information, fraudulent email, deceptive emails Detailed Explanation:
This is the definition of a phishing attack.
** Question 176** Which of these is not a characteristic of the cloud? Options: A zero customer responsibility B on-demand self-service C resource pooling D rapid elasticity Correct Option: A zero customer responsibility Keywords for Exam: not a characteristic of the cloud, shared responsibility model, customers and cloud providers share security and operational responsibilities Detailed Explanation:
Cloud services operate under a shared responsibility model. The customer always has some responsibility, especially for their own data and user access. "Zero customer responsibility" is incorrect.
** Question 177** Which of these is a common mistake made when implementing record retention policies? Options: A destroying records too soon B keeping records for too long C applying the longest retention periods to all information D not having a retention policy at all Correct Option: C applying the longest retention periods to all information Keywords for Exam: common mistake, record retention policies, applying the longest retention periods indiscriminately, unnecessary storage cost, inefficiency, legal or compliance risk Detailed Explanation:
Applying a blanket, overly long retention period to all data is a common mistake. It leads to unnecessary storage costs and can increase legal risk and liability (eDiscovery costs). Data should be classified and have retention periods appropriate to its type.
** Question 178** Which type of security control does not include CCTV cameras? Options: A corrective B deterrent C preventive D detective Correct Option: A corrective Keywords for Exam: not include CCTV cameras, type of security control, corrective control, fix or mitigate the effect after it has occurred Detailed Explanation:
CCTV cameras act as deterrent, preventive (if monitored live), and detective controls. They are not corrective, as they cannot fix damage after an event has occurred.
** Question 179** Which of these privacy and data protection regulations focuses primarily on securing PHI (Protected Health Information)? Options: A GDPR B HIPAA C PCI-DSS D SOX Correct Option: B HIPAA Keywords for Exam: privacy and data protection regulation, focus primarily on securing PHI, protected health information, healthcare data Detailed Explanation:
HIPAA (Health Insurance Portability and Accountability Act) is a US federal law that focuses on protecting Protected Health Information (PHI).
** Question 180** Which of these cloud deployment models is a combination of public and private cloud storage? Options: A public B private C hybrid D community Correct Option: C hybrid Keywords for Exam: cloud deployment models, combination of public and private cloud storage, flexibility, scalability Detailed Explanation:
A hybrid cloud is an environment that combines a public cloud and a private cloud, allowing data and applications to be shared between them.
** Question 181** What is the primary goal of a change management policy? Options: A to ensure all changes are approved by the CEO B to prevent any changes from being made to the system C ensure that system changes are performed systematically without negatively affecting business operations D to document changes only after they have been implemented Correct Option: C ensure that system changes are performed systematically without negatively affecting business operations Keywords for Exam: primary goal, change management policy, system changes, without negatively affecting business operations, minimize disruptions and risks Detailed Explanation:
The goal of change management is to ensure that changes are made in a controlled, systematic way to minimize risk and negative impact on business operations.
** Question 182** Which of these is not a feature of a SIEM (Security Information and Event Management) tool? Options: A log collection B log analysis C log retention D log encryption Correct Option: D log encryption Keywords for Exam: not a feature of a SIEM, log encryption, managed by other security mechanisms Detailed Explanation:
While a SIEM handles log collection, analysis, and retention, log encryption is typically managed by the logging agent, the storage system, or a separate security tool, not the SIEM itself.
** Question 183** A number of people are using the same credentials on a shared account. What is the best strategy to secure the account? Options: A use a more complex password B force password changes weekly C use biometric authentication D use a one-time password based on an app or a token Correct Option: D use a one-time password based on an app or a token Keywords for Exam: shared account, best strategy to secure, one-time password, app or a token, ensures each access is unique Detailed Explanation:
Using a one-time password (OTP) is an excellent strategy for shared accounts. While individual accounts are preferred, if an account must be shared, an OTP ensures that each login session is unique and adds a second factor of authentication.
** Question 184** When analyzing risks, which of these activities is required? Options: A eliminating all possible risks B transferring all risks to a third party C determining the likelihood of occurrence and potential impact of a set of risks D ignoring risks with low impact Correct Option: C determining the likelihood of occurrence and potential impact of a set of risks Keywords for Exam: analyzing risks, activity required, determining the likelihood of occurrence, assessing the impact Detailed Explanation:
Risk analysis fundamentally involves determining the likelihood that a threat will materialize and the potential impact if it does.
** Question 185** Which of these exercises goes through a sample of an incident step by step, validating what each person will do? Options: A simulation exercise B a walkthrough exercise C a tabletop exercise D a full interruption test Correct Option: B a walkthrough exercise Keywords for Exam: exercises, goes through a sample of an incident step by step, validating that each person what each person will do, clarify roles and responsibility Detailed Explanation:
A walkthrough (also known as a tabletop exercise, though walkthrough can be more focused on individual steps) involves team members verbally going through the steps of a plan for a given scenario to validate roles and responsibilities.
** Question 186** Which of these documents is the least formal? Options: A standards B procedures C guidelines D policies Correct Option: C guidelines Keywords for Exam: documents, least formal, non-mandatory, recommendations or best practices Detailed Explanation:
Guidelines are the least formal as they are non-mandatory recommendations. In order of formality (most to least): Regulations, Policies, Standards, Procedures, Guidelines.
** Question 187** A backup that captures the changes made since the last full backup is an example of: Options: A incremental backup B differential backup C full backup D snapshot Correct Option: B differential backup Keywords for Exam: backup, captures the changes, since the last full backup, efficient, faster to restore than incremental Detailed Explanation:
A differential backup captures all changes made since the last full backup. To restore, you only need the last full backup and the last differential backup.
** Question 188** A backup that captures the changes made since the last backup (either full or incremental) is an example of: Options: A incremental backup B differential backup C full backup D snapshot Correct Option: A incremental backup Keywords for Exam: backup, captures the changes, since the last backup operation, resets archive bit Detailed Explanation:
An incremental backup captures only the changes made since the last backup of any type (full or incremental). To restore, you need the last full backup plus all subsequent incremental backups.
** Question 189** A high-level executive of an organization receives a spear phishing email. This is an example of: Options: A phishing B vishing C whaling D smishing Correct Option: C whaling Keywords for Exam: high-level executive, spear phishing email, example of, targeting senior executives Detailed Explanation:
Whaling is a type of spear phishing attack specifically targeting high-level executives.
** Question 190** What does redundancy mean in the context of cyber security? Options: A removing duplicate data B using complex passwords C having a single point of failure D conceiving systems with duplicate components so that if a failure occurs there will be a backup Correct Option: D conceiving systems with duplicate components so that if a failure occurs there will be a backup Keywords for Exam: redundancy, cyber security, duplicate components, backup component, maintaining system availability, preventing downtime Detailed Explanation:
Redundancy is the practice of having duplicate components to eliminate single points of failure and ensure system availability.
** Question 191** What is the main objective of a denial of service attack? Options: A to steal sensitive data B to gain unauthorized access C to install malware D to consume all available resources and make a service unavailable Correct Option: D to consume all available resources and make a service unavailable Keywords for Exam: main objective, denial of service attack, consume all available resources, make a service unavailable Detailed Explanation:
The main objective of a DoS attack is to make a service unavailable by consuming all its available resources.
`;

const rawText3 = `
QUESTION 1
An entity that acts to exploit a target organization's system vulnerabilities is a:
A. Threat
B. Threat Vector
C. Threat Actor
D. Attacker
Answer: C
Explanation:
A Threat Actor is defined as an individual or a group posing a threat (according to NIST SP 800-150 under Threat Actor). A Threat Vector is a means bywhich a Threat Actor gains access to systems (for example: phishing, trojans, baiting, etc.). An Attacker is always an individual, but a Threat Actor can be either a group or an entity. A Threat is a circumstance or event that can adversely impact organizational operations that a Threat Actor can potentially explore through a Threat Vector.

QUESTION 2
Security posters are an element PRIMARILY employed in:
A. Business Continuity Plans
B. Physical Security Controls
C. Incident Response Plans
D. Security Awareness
Answer: D
Explanation:
Security posters are used to raise the awareness of employees regarding security threats, and thus are primarily employed in Security Awareness (see ISC2 Study Guide, chapter 5, module 4).

QUESTION 3
A best practice of patch management is to:
A. Apply patches according to the vendor's reputation
B. Apply patches every Wednesday
C. Test patches before applying them
D. Apply all patches as quickly as possible
Answer: C
Explanation:
Patches sometimes disrupt a system's configurations and stability. One of the main challenges for security professionals is to ensure that patches are deployed as quickly as possible, while simultaneously ensuring the stability of running systems. To prevent flawed patches from negatively affecting running systems, it is good practice to test patches in a designated qualification environment before applying them to production systems (see ISC2 Study Guide, chapter 5, module 2 under Configuration Management Overview). Applying patches as quickly as possible is not a good practice. The vendor's reputation can be useful to know, but is not in itself sufficient to qualify the patch. Applying patches on fixed days also does not guarantee the stability of functioning systems after the patch is applied.

QUESTION 4
Which of the following is NOT a social engineering technique?
A. Pretexting
B. Quid pro quo
C. Segregation
D. Baiting
Answer: C
Explanation:
In cybersecurity, 'segregation', or 'segregation of duties' (SoD), is a security principle designed to prevent fraud or error by dividing tasks among multiple persons. It is an administrative control that reduces the risk of potential errors or fraud from a single person having control over all aspects of a critical process. The remaining options are valid social engineering techniques. Baiting is a social engineering attack in which a scammer uses a false promise to lure a victim. Pretexting is a social engineering technique that manipulates victims into revealing information. Quid pro quo is a social engineering attack (technically a combination of baiting and pretexting) that promises users a benefit in exchange for information (that can later be used to gain control of a user's account or sensitive information).

QUESTION 5
Governments can impose financial penalties as a consequence of breaking a:
A. Regulation
B. Policy
C. Procedure
D. Standard
Answer: A
Explanation:
Standards are created by governing or professional bodies (not by governments themselves). Policies and procedures are created by organizations, and are therefore not subject to financial penalties (see ISC2 Study Guide Chapter 1, Module 4).

QUESTION 6
Malicious emails that aim to attack company executives are an example of:
A. Whaling
B. Trojans
C. Phishing
D. Rootkits
Answer: A
Explanation:
Phishing is a digital social engineering attack that uses authentic-looking (but counterfeit) e-mail messages to request information from users, or to get them to unknowingly execute an action that will make way for the attacker. Whaling attacks are phishing attacks that target high-ranking members of organizations. After gaining root-level access to a host, rootkits are used by an attacker to conceal malicious activities while keeping root-level access. Trojans are a type of software that appears legitimate but has hidden malicious functions that evade security mechanisms.

QUESTION 7
Which of these is the PRIMARY objective of a Disaster Recovery Plan?
A. Outline a safe escape procedure for the organization's personnel
B. Maintain crucial company operations in the event of a disaster
C. Restore company operation to the last-known reliable operation state
D. Communicate to the responsible entities the damage caused to operations in the event of a disaster
Answer: C
Explanation:
A Disaster Recovery Plan (DRP) is a plan for processing and restoring operations in the event of a significant hardware or software failure, or of the destruction of the organization's facilities. The primary goal of a DRP is to restore the business to the last-known reliable state of operations (see Chapter 2 ISC2 Study Guide, module 4, under The Goal of Disaster Recovery). Maintaining crucial operations is the goal of the Business Continuity Plan (BCP). The remaining options may be included in a DRP, but are not its primary objective.

QUESTION 8
Which of the following is NOT a protocol of the OSI Level 3?
A. IGMP
B. IP
C. SNMP
D. ICMP
Answer: C
Explanation:
Internet Protocol (IP) is known to be a level 3 protocol. Internet Control Message Protocol (ICMP) and Internet Group Management Protocol (IGMP) are also level 3 protocols. Simple Network Management Protocol (SNMP) is a protocol used to configure and monitor devices attached to networks. It is an application-level protocol (level 7), and therefore the only option that is not from level 3.

QUESTION 9
Which type of attack attempts to trick the user into revealing personal information by sending a fraudulent message?
A. Phishing
B. Denials of Service
C. Cross-Site Scripting
D. Trojans
Answer: A
Explanation:
A phishing attack emails a fraudulent message to trick the recipient into disclosing sensitive information to the attacker. A Cross-Site Scripting attack tries to execute code on another website. Trojans are software that appear legitimate, but that have hidden malicious functions. Trojans may be sent in a message, but are not the message themselves. A denial of service attack (DoS) consists in compromising the availability of a system or service through a malicious overload of requests, which causes the activation of safety mechanisms that delay or limit the availability of that system or service.

QUESTION 10
Which of the following documents contains elements that are NOT mandatory?
A. Policies
B. Guidelines
C. Regulations
D. Procedures
Answer: B
Explanation:
Only guidelines contain elements that may not be mandatory. Compliance with policies, procedures and regulations is mandatory (see ISC2 Study Guide Chapter 1, Module 4).

QUESTION 11
The process of verifying or proving the user's identification is known as:
A. Integrity
B. Authorization
C. Authentication
D. Confidentiality
Answer: C
Explanation:
Authentication is the verification of the identity of a user, process or device, as a prerequisite to allowing access to the resources in a given system. In contrast, authorization refers to the permission granted to users, processes or devices to access specific assets. Confidentiality and integrity are properties of information and systems, not processes.

QUESTION 12
Which of these is NOT a change management component?
A. Approval
B. Rollback
C. Governance
D. RFC
Answer: C
Explanation:
All significant change management practices address typical core activities: Request For Change (RFC), Approval, and Rollback (see ISC2 Study Guide, chapter 5, module 3). Governance is not one of these practices.

QUESTION 13
Which type of key can be used to both encrypt and decrypt the same message?
A. A symmetric key
B. A private key
C. An asymmetric key
D. A public key
Answer: A
Explanation:
Symmetric-key algorithms are a class of cryptographic algorithms that use a single key for both encrypting and decrypting of data. Asymmetric cryptography uses pairs of related keys: the public and the corresponding private keys. A message encrypted with the public key can only be decrypted by its corresponding private key, and vice versa. The term 'asymmetric key' is not applicable here.

QUESTION 14
Which of these has the PRIMARY objective of identifying and prioritizing critical business processes?
A. Business Continuity Plan
B. Business Impact Plan
C. Business Impact Analysis
D. Disaster Recovery Plan
Answer: C
Explanation:
The term 'Business Impact Plan' does not exist. A Business Impact Analysis (BIA) is a technique for analyzing how disruptions can affect an organization, and determines the criticality of all business activities and associated resources. A Business Continuity Plan (BCP) is a pre-determined set of instructions describing how the mission/business processes of an organization will be sustained during and after a significant disruption. A Disaster Recovery Plan is a written plan for recovering information systems in response to a major failure or disaster.

QUESTION 15
How many layers does the OSI model have?
A. 7
B. 4
C. 5
D. 6
Answer: A
Explanation:
The OSI model organizes communicating systems according to 7 layers: Physical layer, Data Link layer, Network layer, Transport layer, Session layer, Presentation layer, and Application layer (see Chapter 4 - Module 1 under Open Systems Interconnection).

QUESTION 16
Which type of attack embeds malicious payload inside a reputable or trusted software?
A. Rootkits
B. Phishing
C. Trojans
D. Cross-Site Scripting
Answer: C
Explanation:
Trojans are a type of software that appears legitimate but has hidden malicious functions that evade security mechanisms, typically by exploiting legitimate authorizations of the user that invokes the program. Rootkits try to maintain privilege-level access while concealing malicious activity. They often replace system files, so they are activated when the system is restarted. Trojans often install Rootkits, but Rootkits are not the Trojans themselves. Phishing typically tries to redirect the user to another website. Cross-site scripting attempts to inject malicious executable code into a website.

QUESTION 17
A security safeguard is the same as a:
A. Security control
B. Safety control
C. Privacy control
D. Security principle
Answer: A
Explanation:
Security safeguards are approved security measures taken to protect computational resources by eliminating or reducing the risk to a system. These can be measures like hardware and software mechanisms, policies, procedures, and physical controls (see NIST SP 800-28 Version 2, under safeguard). This definition matches the definition of security control as the means of managing risk, including policies, procedures, guidelines, practices, or organizational structures, which can be of an administrative, technical, management, or legal nature (see NIST SP 800-160 Vol. 2 Rev. 1 under control).

QUESTION 18
Which of the following properties is NOT guaranteed by Digital Signatures?
A. Integrity
B. Confidentiality
C. Non-repudiation
D. Authentication
Answer: B
Explanation:
The correct answer is B. A digital signature is the result of a cryptographic transformation of data which is useful for providing: data origin authentication, data integrity, and non-repudiation of the signer (see NIST SP 800-12 Rev. 1 under Digital Signature). However, digital signatures cannot guarantee confidentiality (i.e. the property of data or information not being made available or disclosed).

QUESTION 19
According to the canon "Provide diligent and competent service to principals", (ISC)² professionals are to:
A. Avoid apparent or actual conflicts of interest
B. Promote the understanding and acceptance of prudent information security measures
C. Take care not to tarnish the reputation of other professionals through malice or indifference
D. Treat all members fairly and, when resolving conflicts, consider public safety and duties to principals, individuals and the profession, in that order
Answer: A
Explanation:
The direction for applying the ethical principles of ISC2 states that avoiding conflicts of interest or the appearance thereof is a consequence of providing diligent and competent service to principals (see https://resources.infosecinstitute.com/certification/the-isc2-code-of-ethics-a-binding-requirement-for-certification/). The other options are consequences of the remaining three ethical principles.

QUESTION 20
Which of the following is an example of 2FA?
A. Keys
B. Passwords
C. Badges
D. One-Time passwords (OTP)
Answer: D
Explanation:
One-time passwords are typically generated by a device (i.e. "something you have") and are required in addition to the actual main password (i.e. "something you know"). Badges, keys and passwords with no other overlapping authentication controls are considered single-factor (and thus are not 2FA).

QUESTION 21
Which of the following principles aims primarily at fraud detection?
A. Defense in Depth
B. Separation of Duties
C. Least Privilege
D. Privileged Accounts
Answer: B
Explanation:
According to the principle of Separation of Duties, operations on objects are to be segmented (often referred to as 'transactions'), requiring distinct users and authorizations. The involvement of multiple users guarantees that no single user can perpetrate and conceal errors or fraud in their duties. To the extent that users have to review the work of other users, Separation of Duties can also be considered a mechanism of fraud detection (see ISC2 Study Guide Chapter 1, Module 3). The principle of Least Privilege states that subjects should be given only those privileges required to complete their specific tasks. The principle of Privileged Accounts refers to the existence of accounts with permissions beyond those of regular users. Finally, the principle of Defense in Depth endorses the use of multiple layers of security for holistic protection.

QUESTION 22
Which cloud deployment model is suited to companies with similar needs and concerns?
A. Private cloud
B. Community cloud
C. Hybrid cloud
D. Multi-tenant
Answer: B
Explanation:
The correct answer is B. Community cloud deployment models are where several organizations with similar needs and concerns (technological or regulatory) share the infrastructure and resources of a cloud environment. This model is attractive because it is cost-effective while addressing the specific requirements of the participating organizations. A private cloud is a cloud computing model where the cloud infrastructure is dedicated to a single organization (and never shared with others). A hybrid cloud is a model that combines (i.e. orchestrates) on-premises infrastructure, private cloud services, and a public cloud to handle storage and service. Finally, multitenancy refers to a cloud architecture where multiple cloud tenants (organizations or users) share the same computing resources. Yet, while resources are shared, each tenant's data is isolated and remains invisible to other tenants.

QUESTION 23
Which of the following is NOT a possible model for an Incident Response Team (IRT)?
A. Hybrid
B. Pre-existing
C. Leveraged
D. Dedicated
Answer: B
Explanation:
The three possible models for incident response are Leveraged, Dedicated, and Hybrid (see the ISC2 Study Guide, Chapter 2, Module 1, under Chapter Takeaways). The term 'Pre-existing' is not a valid model for an IRT.

QUESTION 24
A web server that accepts requests from external clients should be placed in which network?
A. VPN
B. Internal Network
C. Intranet
D. DMZ
Answer: D
Explanation:
In Cybersecurity, a DMZ (demilitarized zone) is a physical or logical subnetwork that contains and exposes external-facing services (such as web services). An Internal Network is an organization-controlled network that is isolated from external access. An Intranet is itself an internal network that supports similar protocols and services to the Internet, but only for the organization's internal use. A Virtual Private Network (VPN) creates a secure tunnel between endpoints (whether between networks, or between networks and devices), allowing traffic to travel through a public network and creating the illusion that endpoints are connected through a dedicated private connection.

QUESTION 25
A device found not to comply with the security baseline should be:
A. Marked as potentially vulnerable and placed in a quarantine area
B. Disabled or separated into a quarantine area until a virus scan can be run
C. Placed in a demilitarized zone (DMZ) until it can be reviewed and updated
D. Disabled or isolated into a quarantine area until it can be checked and updated
Answer: D
Explanation:
Security baselines are used to guarantee that network devices, software, hardware and endpoints are configured consistently. Baselines ensure that all such devices comply with the security baseline set by the organization. Whenever a device is found not compliant with the security baseline, it may be disabled or isolated into a quarantine area until it can be checked and updated (see ISC2 Study Guide, chapter 5, module 2, under Configuration Management Overview). A DMZ is a protected boundary network between external and internal networks. Systems accessible directly from the Internet are permanently connected in this network, where they are protected by a firewall; however, a DMZ is not a quarantine area used to temporarily isolate devices.

QUESTION 26
What is the consequence of a Denial of Service attack?
A. Increase in the availability of resources
B. Malware Infection
C. Remote control of a device
D. Exhaustion of device resources
Answer: D
Explanation:
A denial of service attack (DoS) consists in a malicious overload of requests which will eventually lead to the exhaustion of resources, rendering the service unavailable, as well as causing the activation of safety mechanisms that delay or limit the availability of that system or service. This type of attack seeks to compromise service availability, but not to control a device nor to install malware.
`;


export function getQuestions(): Question[] {
    const allQuestions: Question[] = [];
    let idCounter = 1;

    // --- PARSER 1: 20 Flashcard-style questions ---
    const generatedOptionsMap: Record<number, string[]> = {
        1: ["Trojan", "Virus", "Worm", "Rootkit"],
        2: ["Man-in-the-middle attack", "ARP jacking", "TCP-D attack", "Denial of Service attack"],
        3: [
            "Allow organizations to specify appropriate Security Controls based on sensitivity and impact",
            "Mandate the use of the strongest encryption for all data.",
            "Focus solely on perimeter defense to protect all internal assets.",
            "Prioritize business profit over the protection of human life."
        ],
        4: ["RAID 5", "RAID 0", "RAID 1", "RAID 6"],
        5: ["UPS (Uninterruptible Power Supply)", "Generator", "PDU (Power Distribution Unit)", "Surge Protector"],
        6: ["MOU (Memorandum of Understanding)", "SLA (Service Level Agreement)", "MSA (Master Service Agreement)", "BPA (Business Partner Agreement)"],
        7: ["Role-Based Training", "Security Policy Training", "Anomalous Behavior Recognition", "Awareness Training"],
        8: ["Urgency", "Authority", "Intimidation", "Trust"],
        9: [
            "Something you know and Something you are",
            "Something you have and Something you do",
            "Something you know and Something you have",
            "Two 'Something you know' factors"
        ],
        10: ["Availability", "Confidentiality", "Integrity", "Non-repudiation"],
        11: ["Two Person Control", "Separation of Duty", "Least Privilege", "Security through obscurity"],
        12: ["Technical", "Administrative", "Physical", "Managerial"],
        13: ["Document the decision", "Implement a new control immediately.", "Transfer the risk to a third party.", "Ignore the risk completely."],
        14: ["Mitigation", "Acceptance", "Avoidance", "Transference"],
        15: ["Procedure", "Policy", "Standard", "Guideline"],
        16: ["SLA (Service Level Agreement)", "MOU (Memorandum of Understanding)", "NDA (Non-Disclosure Agreement)", "BPA (Business Partner Agreement)"],
        17: ["Non-repudiation", "Confidentiality", "Authentication", "Integrity"],
        18: ["Proxy Trojan", "Session Hijacking", "Cross-Site Scripting", "SQL Injection"],
        19: ["Incremental", "Differential", "Full Backup", "Snapshot"],
        20: ["Adding a second factor for authentication", "Using a stronger electronic lock.", "Implementing a physical lock.", "Changing the code frequently."]
    };

    const blocks1 = rawText1.trim().split(/\n\d+\. /).slice(1);
    blocks1.forEach((block, index) => {
        try {
            const questionMatch = block.match(/คำถาม \(English\): ([\s\S]+?)\nคีย์เวิร์ดสำคัญ:/);
            const keywordsMatch = block.match(/คีย์เวิร์ดสำคัญ: (.+)\n/);
            const answerMatch = block.match(/คำตอบ \(English\): ([\s\S]+?)\n/);
            const explanationMatch = block.match(/คำอธิบายแนวคิด: ([\s\S]+)/);

            if (questionMatch && keywordsMatch && answerMatch && explanationMatch) {
                const questionText = questionMatch[1].trim();
                const keywords = keywordsMatch[1].split(',').map(k => k.replace(/"/g, '').trim());
                const correctAnswer = answerMatch[1].trim();
                const explanation = explanationMatch[1].trim();
                const options = generatedOptionsMap[index + 1] || [];
                
                if (options.length > 0 && options.includes(correctAnswer)) {
                    allQuestions.push({
                        id: idCounter++,
                        question: questionText,
                        options: options,
                        correctAnswer: correctAnswer,
                        explanation,
                        keywords,
                        domain: mapKeywordsToDomain(keywords)
                    });
                }
            }
        } catch (e) {
            console.error("Error parsing block from rawText1:", block, e);
        }
    });

    // --- PARSER 2: 191 Multiple-choice questions ---
    const blocks2 = rawText2.trim().split(/\*\* Question \d+\*\*/).filter(Boolean);
    blocks2.forEach(block => {
        try {
            const questionMatch = block.match(/^(.*?)\s+Options:/s);
            const optionsMatch = block.match(/Options:\s+([\s\S]+?)\s+Correct Option:/s);
            const correctOptionMatch = block.match(/Correct Option:\s+([A-D])\s/s);
            const keywordsMatch = block.match(/Keywords for Exam:\s+(.*?)\s+Detailed Explanation:/s);
            const explanationMatch = block.match(/Detailed Explanation:\s+([\s\S]+)$/s);

            if (questionMatch && optionsMatch && correctOptionMatch && keywordsMatch && explanationMatch) {
                const questionText = questionMatch[1].trim();
                const optionsRaw = optionsMatch[1].trim();
                const correctLetter = correctOptionMatch[1];
                const keywords = keywordsMatch[1].trim().split(/,\s*/);
                const explanation = explanationMatch[1].trim();
                
                // More robust options parsing
                const optionRegex = /[A-D]\s(.*?)(?=\s[B-D]\s|$)/gs;
                const options = Array.from(optionsRaw.matchAll(optionRegex), m => m[1].trim());

                if (options.length < 2) return;

                const correctIndex = correctLetter.charCodeAt(0) - 'A'.charCodeAt(0);
                if (correctIndex >= 0 && correctIndex < options.length) {
                    const correctAnswer = options[correctIndex];
                     allQuestions.push({
                        id: idCounter++,
                        question: questionText,
                        options,
                        correctAnswer,
                        explanation,
                        keywords,
                        domain: mapKeywordsToDomain(keywords)
                    });
                }
            }
        } catch (e) {
            console.error("Error parsing block from rawText2:", block, e);
        }
    });


    // --- PARSER 3: PDF-based questions ---
    const questionBlocks3 = rawText3.split(/QUESTION \d+/).filter(s => s.trim().length > 10);
    questionBlocks3.forEach(block => {
        try {
            const questionMatch = block.match(/^\s*([\s\S]*?)\nA\./s);
            const optionsMatch = block.match(/^(A\.[\s\S]*?)\nAnswer:/s);
            const answerMatch = block.match(/\nAnswer: ([A-D])/);
            const explanationMatch = block.match(/Explanation:\n([\s\S]+)$/);

            if (questionMatch && optionsMatch && answerMatch && explanationMatch) {
                const questionText = questionMatch[1].trim().replace(/\(\)/g, '').trim();
                const optionsRaw = optionsMatch[1].trim();
                const correctLetter = answerMatch[1];
                const explanation = explanationMatch[1].trim();

                const options = optionsRaw.split('\n').map(opt => opt.replace(/^[A-D]\.\s?/, '').trim());

                const correctIndex = correctLetter.charCodeAt(0) - 'A'.charCodeAt(0);
                if (correctIndex >= 0 && correctIndex < options.length) {
                    const correctAnswer = options[correctIndex];
                    const keywords = (questionText + ' ' + explanation)
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .split(/\s+/)
                        .filter(word => word.length > 3);
                    
                    allQuestions.push({
                        id: idCounter++,
                        question: questionText,
                        options,
                        correctAnswer,
                        explanation,
                        keywords,
                        domain: mapKeywordsToDomain(keywords)
                    });
                }
            }
        } catch (e) {
            console.error("Error parsing block from rawText3:", block, e);
        }
    });

    return allQuestions;
}


export function getFlashcards(): Flashcard[] {
    const flashcards: Flashcard[] = [];
    let idCounter = 1;

    // --- PARSER 1: From rawText1 ---
    const blocks1 = rawText1.trim().split(/\n\d+\. /).slice(1);
    
    blocks1.forEach((block) => {
        try {
            const titleMatch = block.match(/^([^\n]+)/);
            const keywordsMatch = block.match(/คีย์เวิร์ดสำคัญ: (.+)\n/);
            const explanationMatch = block.match(/คำอธิบายแนวคิด: ([\s\S]+)/);

            if (titleMatch && explanationMatch && keywordsMatch) {
                const front = titleMatch[1].trim();
                const back = explanationMatch[1].trim();
                const keywords = keywordsMatch[1].split(',').map(k => k.replace(/"/g, '').trim());
                const domain = mapKeywordsToDomain(keywords);
                
                flashcards.push({
                    id: idCounter++,
                    front,
                    back,
                    domain
                });
            }
        } catch (e) {
             console.error("Error parsing flashcard from rawText1:", block, e);
        }
    });

    // --- PARSER 2: From rawText2 (Concept Flashcards) ---
    const blocks2 = rawText2.trim().split(/\*\* Question \d+\*\*/).filter(Boolean);
    blocks2.forEach(block => {
        try {
            const correctOptionMatch = block.match(/Correct Option:\s+([A-D]\s)([\s\S]+?)\s+Keywords for Exam:/s);
            const keywordsMatch = block.match(/Keywords for Exam:\s+(.*?)\s+Detailed Explanation:/s);
            const explanationMatch = block.match(/Detailed Explanation:\s+([\s\S]+)$/s);

            if (correctOptionMatch && keywordsMatch && explanationMatch) {
                let front = correctOptionMatch[2].trim();
                front = front.split(/(\s\(|\sso\s|Note:)/)[0].trim();
                front = front.replace(/^[a-z]/, char => char.toUpperCase());


                if (!front || front.length < 3) return;

                const back = explanationMatch[1].trim();
                const keywords = keywordsMatch[1].trim().split(/,\s*/);
                const domain = mapKeywordsToDomain(keywords);

                flashcards.push({
                    id: idCounter++,
                    front: front,
                    back,
                    domain
                });
            }
        } catch (e) {
            console.error("Error parsing concept flashcard from rawText2", e);
        }
    });

    return flashcards;
}


export const calculateResults = (
  questions: Question[],
  userAnswers: Map<number, string>,
  timeTaken: number
): ExamResult => {
  const resultId = new Date().toISOString();
  
  const resultUserAnswers: UserAnswer[] = questions.map(question => {
    const selectedAnswer = userAnswers.get(question.id);
    const isCorrect = selectedAnswer ? selectedAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase() : false;
    return {
      questionId: question.id,
      selectedAnswer: selectedAnswer || 'Not Answered',
      isCorrect,
    };
  });

  const correctAnswersCount = resultUserAnswers.filter(ua => ua.isCorrect).length;
  const score = questions.length > 0 ? Math.round((correctAnswersCount / questions.length) * 1000) : 0;

  const domainScoresMap: Record<string, { total: number; correct: number }> = {};

  for (const question of questions) {
      if (question.domain && question.domain !== Domain.Unknown) {
          if (!domainScoresMap[question.domain]) {
              domainScoresMap[question.domain] = { total: 0, correct: 0 };
          }
          domainScoresMap[question.domain].total++;

          const userAnswer = resultUserAnswers.find(ua => ua.questionId === question.id);
          if (userAnswer?.isCorrect) {
              domainScoresMap[question.domain].correct++;
          }
      }
  }
  
  const domainScores: DomainScore[] = Object.entries(domainScoresMap).map(([domain, data]) => ({
    domain: domain as Domain,
    total: data.total,
    correct: data.correct,
    score: data.total > 0 ? (data.correct / data.total) * 100 : 0,
  }));

  return {
    id: resultId,
    date: resultId,
    score,
    userAnswers: resultUserAnswers,
    questions,
    domainScores,
    timeTaken,
  };
};
