
import { Domain, Question, ExamResult, UserAnswer, DomainScore, Flashcard } from '../types';
import { rawText4 } from './syntheticData';

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
คำอธิบายโดยละเอียด: โปรโตคอลของ OSI Layer 3 (Network Layer) ประกอบด้วย IP, ICMP และ IGMP ส่วน SNMP (Simple Network Management Protocol) ทำงานที่ Application Layer (Layer 7)
** Question 10** When a company hires an insurance company to mitigate risk, which risk management technique is being applied? Options: A risk avoidance B risk transfer C risk mitigation D risk tolerance Correct Option: B risk transfer Keywords for Exam: hires an insurance company, mitigate risk, risk management technique Detailed Explanation:
Risk Transfer (การถ่ายโอนความเสี่ยง): คือการโอนความรับผิดชอบสำหรับความเสี่ยงไปยังบุคคลที่สาม, เช่น การซื้อประกันภัย.
** Question 11** The SMTP (Simple Mail Transfer Protocol) protocol operates at which OSI layer? Options: A Layer 7 B Port 25 C Layer 3 D Port 23 Correct Option: A Layer 7 Keywords for Exam: SMTP protocol, OSI layer, application layer Detailed Explanation:
SMTP (Simple Mail Transfer Protocol) ทำงานที่ Application Layer (Layer 7) ของโมเดล OSI และใช้ TCP Port 25.
** Question 12** The process of verifying or proving the user's identification is known as: Options: A confidentiality B integrity C authentication D authorization Correct Option: C authentication Keywords for Exam: verifying or proving, user's identification, security distinguishing Detailed Explanation:
Authentication (การยืนยันตัวตน): เป็นกระบวนการในการ "ตรวจสอบหรือพิสูจน์ตัวตน" ของผู้ใช้หรือระบบ.
** Question 13** If an organization wants to protect itself against tailgating, which of the following types of access control would be most effective? Options: A locks B fences C barriers D turnstiles Correct Option: D turnstiles Keywords for Exam: protect against tailgating, access control, follows him or her Detailed Explanation:
Turnstiles (ประตูหมุน): เป็นกลไกควบคุมการเข้าออกทางกายภาพที่ออกแบบมาเพื่อ "อนุญาตให้คนผ่านได้ทีละคน" เท่านั้น, ซึ่งมีประสิทธิภาพในการป้องกัน Tailgating.
** Question 14** Logging and monitoring systems are essential to: Options: A identifying inefficient performing system preventing compromises and providing a record of how systems are used B identifying efficient performing system labeling compromises and providing a record of how systems are used C identifying inefficient performing system detecting compromises and providing a record of how systems are used D identifying efficient performing system detecting compromises and providing a record of how systems are used Correct Option: D identifying efficient performing system detecting compromises and providing a record of how systems are used Keywords for Exam: logging and monitoring systems, essential to, detecting compromises, record of how systems are used Detailed Explanation:
คำอธิบายโดยละเอียด: ระบบการบันทึกและติดตาม (Logging and Monitoring Systems) มีความสำคัญอย่างยิ่งในการระบุประสิทธิภาพของระบบ, ตรวจจับการบุกรุก, และจัดทำบันทึกการใช้งานระบบเพื่อการตรวจสอบและการปฏิบัติตามข้อกำหนด
** Question 15** In the event of a disaster, which of these should be the primary objective? Options: A guarantee the safety of the people B guarantee the continuity of critical systems C protection of the production database D replication of disaster communication Correct Option: A guarantee the safety of the people Keywords for Exam: disaster, primary objective, safety Detailed Explanation:
คำอธิบายโดยละเอียด: ในทุกสถานการณ์ภัยพิบัติ ความปลอดภัยของบุคลากรเป็นสิ่งสำคัญอันดับแรกเสมอ ซึ่งมีความสำคัญเหนือกว่าข้อกังวลอื่นๆ ทั้งหมด รวมถึงความต่อเนื่องของระบบหรือการปกป้องข้อมูล
** Question 16** The process that ensures that system changes do not adversely impact business operation is known as: Options: A change management B vulnerability management C configuration management D inventory management Correct Option: A change management Keywords for Exam: system changes, do not adversely impact business operation, process ensures Detailed Explanation:
คำอธิบายโดยละเอียด: การจัดการการเปลี่ยนแปลง (Change Management) เป็นกระบวนการที่ออกแบบมาเพื่อให้แน่ใจว่าการปรับเปลี่ยนใดๆ ต่อระบบจะได้รับการควบคุม ประเมิน และจัดทำเป็นเอกสาร เพื่อลดความเสี่ยงและป้องกันผลกระทบเชิงลบต่อการดำเนินธุรกิจ
** Question 17** The last phase in the data security life cycle is known as: Options: A encryption B backup C archival D destruction Correct Option: D destruction Keywords for Exam: last phase, data security life cycle, securely destroyed Detailed Explanation:
คำอธิบายโดยละเอียด: วงจรชีวิตความปลอดภัยของข้อมูล (Data Security Life Cycle) ตามมาตรฐานของ ISC2 ประกอบด้วย 6 ขั้นตอน ได้แก่: สร้าง (Create), จัดเก็บ (Store), ใช้งาน (Use), แบ่งปัน (Share), จัดเก็บถาวร (Archive) และสุดท้ายคือ ทำลาย (Destroy) การทำลายจึงเป็นขั้นตอนสุดท้าย
** Question 18** Which access control model specifies access to an object based on the subject's role in the organization? Options: A RBAC (Role-Based Access Control) B MAC (Mandatory Access Control) C DAC (Discretionary Access Control) D ABAC (Attribute-Based Access Control) Correct Option: A RBAC (Role-Based Access Control) Keywords for Exam: access control model, access to an object, based on the subject's role Detailed Explanation:
คำอธิบายโดยละเอียด: Role-Based Access Control (RBAC) ให้สิทธิ์การเข้าถึงทรัพยากรตามบทบาทที่กำหนดของผู้ใช้ภายในองค์กร ซึ่งช่วยให้การจัดการสิทธิ์ง่ายขึ้น
** Question 19** Which of the following is not an example of a physical control? Options: A firewalls B biometric access control C remote control electronic locks D security cameras Correct Option: A firewalls Keywords for Exam: not an example of a physical control Detailed Explanation:
คำอธิบายโดยละเอียด: ไฟร์วอลล์ (Firewalls) เป็นการควบคุมความปลอดภัยเชิงตรรกะหรือทางเทคนิค ไม่ใช่ทางกายภาพ การควบคุมทางกายภาพรวมถึงสิ่งที่จับต้องได้ เช่น ล็อค, กล้อง และเครื่องอ่านไบโอเมตริกซ์
** Question 20** Which type of attack will most effectively maintain remote access and control over the victim's computer? Options: A Trojans B phishing C cross-site scripting D rootkits Correct Option: D rootkits Keywords for Exam: most effectively maintain, remote access and control, victim's computer Detailed Explanation:
คำอธิบายโดยละเอียด: รูทคิท (Rootkits) ถูกออกแบบมาเพื่อให้การเข้าถึงและควบคุมคอมพิวเตอร์ของเหยื่อจากระยะไกลเป็นไปอย่างต่อเนื่องและซ่อนเร้น โดยการซ่อนตัวอยู่ลึกภายในระบบปฏิบัติการ
** Question 21** In incident terminology, what does "zero day" mean? Options: A days to solve a previously unknown system vulnerability B a previously unknown system vulnerability C days without a cyber security incident D days with a cyber security incident Correct Option: B a previously unknown system vulnerability Keywords for Exam: incident terminology, zero day, previously unknown system vulnerability Detailed Explanation:
คำอธิบายโดยละเอียด: ช่องโหว่ "Zero-Day" หมายถึงข้อบกพร่องของระบบที่ไม่เคยมีใครรู้จักมาก่อน ซึ่งผู้โจมตีใช้ประโยชน์ก่อนที่ผู้ผลิตจะทราบหรือสามารถปล่อยแพตช์แก้ไขได้
** Question 22** A device found not to comply with the security baseline should be: Options: A disabled or separated into a quarantine area until a virus scan can be run B disabled or isolated into a quarantine area until it can be checked and updated C placed in a demilitarized zone until it can be reviewed and updated D marked as potentially vulnerable and placed in a quarantine area Correct Option: B disabled or isolated into a quarantine area until it can be checked and updated Keywords for Exam: not to comply with the security baseline, disabled or isolated, quarantine area, checked and updated Detailed Explanation:
คำอธิบายโดยละเอียด: อุปกรณ์ที่ไม่สอดคล้องกับมาตรฐานความปลอดภัย (security baseline) ควรกักบริเวณ (isolate) ในพื้นที่กักกัน (quarantine area) จนกว่าจะสามารถประเมิน, อัปเดต และทำให้สอดคล้องกับข้อกำหนด เพื่อป้องกันไม่ให้เกิดความเสี่ยงต่อเครือข่าย
** Question 23** Which type of attack primarily aims to make a resource inaccessible to its intended users? Options: A denial of service B phishing C trojans D cross-site scripting Correct Option: A denial of service Keywords for Exam: primarily aims, make a resource inaccessible, intended users Detailed Explanation:
คำอธิบายโดยละเอียด: เป้าหมายหลักของการโจมตีแบบปฏิเสธการให้บริการ (DoS) คือการขัดขวางความพร้อมใช้งานของบริการ ทำให้ทรัพยากรไม่สามารถเข้าถึงได้โดยผู้ใช้ที่ถูกต้องตามกฎหมาย
** Question 24** Which type of attack embeds a malicious payload inside a reputable or trusted software? Options: A Trojan horse B phishing C rootkit D cross-site scripting Correct Option: A Trojan horse Keywords for Exam: embeds malicious payload, reputable or trusted software, disguise themselves as legitimate Detailed Explanation:
คำอธิบายโดยละเอียด: โทรจันฮอร์ส (Trojan horse) เป็นมัลแวร์ที่ปลอมตัวเป็นซอฟต์แวร์ที่ถูกกฎหมาย มันบรรจุเพย์โหลดที่เป็นอันตรายซึ่งจะทำงานเมื่อซอฟต์แวร์ถูกรัน
** Question 25** Which tool is commonly used to sniff network traffic? Options: A Burp Suite B John the Ripper C Wireshark D NSLookup Correct Option: C Wireshark Keywords for Exam: sniff network traffic, network protocol analyzer, packet sniffer Detailed Explanation:
คำอธิบายโดยละเอียด: Wireshark เป็นเครื่องมือวิเคราะห์โปรโตคอลเครือข่าย (หรือ packet sniffer) ที่ใช้กันอย่างแพร่หลาย ซึ่งจับและตรวจสอบทราฟฟิกเครือข่ายแบบเรียลไทม์
** Question 26** Which of these is not an attack against an IP network? Options: A side channel attack B man in the middle attack C fragmented packet attack D oversized packet attack Correct Option: A side channel attack Keywords for Exam: not an attack against an IP network Detailed Explanation:
คำอธิบายโดยละเอียด: การโจมตีแบบ Side-Channel ใช้ประโยชน์จากลักษณะทางกายภาพของระบบ (เช่น การใช้พลังงานหรือการปล่อยคลื่นแม่เหล็กไฟฟ้า) แทนที่จะโจมตีเครือข่าย IP โดยตรง
** Question 27** The detailed steps to complete a task supporting departmental or organizational policies are typically documented in: Options: A regulations B standards C policies D procedures Correct Option: D procedures Keywords for Exam: detailed steps to complete task, supporting policies, documented in Detailed Explanation:
คำอธิบายโดยละเอียด: ระเบียบปฏิบัติ (Procedures) ให้คำแนะนำอย่างละเอียดทีละขั้นตอนเกี่ยวกับวิธีการดำเนินงานเฉพาะ เพื่อสนับสนุนการนำนโยบายและมาตรฐานที่กว้างขึ้นมาปฏิบัติ
** Question 28** Which device is used to connect a LAN to the internet? Options: A SIEM (Security Information and Event Management) B HIDS (Host-based Intrusion Detection System) C router D firewall Correct Option: C router Keywords for Exam: connect a LAN to the internet, device, routes data packets Detailed Explanation:
คำอธิบายโดยละเอียด: เราเตอร์ (Router) เป็นอุปกรณ์ที่เชื่อมต่อเครือข่ายท้องถิ่น (LAN) กับเครือข่ายภายนอก เช่น อินเทอร์เน็ต โดยการส่งต่อแพ็กเก็ตข้อมูลระหว่างกัน
** Question 29** What does SIEM stand for? Options: A Security Information and Enterprise Management B Security Information and Event Management C Security Intelligence and Event Manager D Secure Information and Enterprise Manager Correct Option: B Security Information and Event Management Keywords for Exam: SIEM stands for, collects analyzes reports, security data, detect respond to security threats Detailed Explanation:
คำอธิบายโดยละเอียด: SIEM ย่อมาจาก Security Information and Event Management เป็นระบบที่รวบรวม, วิเคราะห์ และรายงานข้อมูลความปลอดภัยจากแหล่งต่างๆ เพื่อตรวจจับและตอบสนองต่อภัยคุกคาม
** Question 30** A "security safeguard" is the same as a: Options: A safety control B privacy control C security control D security principle Correct Option: C security control Keywords for Exam: security safeguard, same as, mitigate security risk, protect Confidentiality Integrity and Availability (CIA) Detailed Explanation:
คำอธิบายโดยละเอียด: คำว่า "security safeguard" (มาตรการป้องกัน) มีความหมายเดียวกับ "security control" (การควบคุมความปลอดภัย) ทั้งสองคำหมายถึงมาตรการหรือกลไกใดๆ ที่ออกแบบมาเพื่อลดความเสี่ยงด้านความปลอดภัยและปกป้อง CIA ของระบบและข้อมูล
** Question 31** Which access control model can grant access to a given object based on complex rules? Options: A DAC (Discretionary Access Control) B ABAC (Attribute-Based Access Control) C RBAC (Role-Based Access Control) D MAC (Mandatory Access Control) Correct Option: B ABAC (Attribute-Based Access Control) Keywords for Exam: access control model, grant access, based on complex rules, attributes Detailed Explanation:
คำอธิบายโดยละเอียด: Attribute-Based Access Control (ABAC) ให้สิทธิ์การเข้าถึงตามกฎที่ซับซ้อนซึ่งประเมินคุณลักษณะของผู้ใช้, วัตถุ และสภาพแวดล้อม ทำให้สามารถควบคุมได้อย่างละเอียดและยืดหยุ่นสูง
** Question 32** Which port is used for secure communication over the web (HTTPS)? Options: A 69 B 80 C 25 D 443 Correct Option: D 443 Keywords for Exam: port is used, secure communication over the web, HTTPS Detailed Explanation:
คำอธิบายโดยละเอียด: HTTPS (Hypertext Transfer Protocol Secure) ใช้พอร์ต 443 สำหรับการสื่อสารบนเว็บที่ปลอดภัย โดยการเข้ารหัสข้อมูลระหว่างเบราว์เซอร์และเซิร์ฟเวอร์ ส่วนพอร์ต 80 ใช้สำหรับ HTTP ที่ไม่เข้ารหัส
** Question 33** Which of these has the primary objective of identifying and prioritizing critical business processes? Options: A business impact analysis B business impact plan C disaster recovery plan D business continuity plan Correct Option: A business impact analysis Keywords for Exam: primary objective, identifying and prioritizing critical business processes Detailed Explanation:
คำอธิบายโดยละเอียด: การวิเคราะห์ผลกระทบทางธุรกิจ (Business Impact Analysis - BIA) คือกระบวนการระบุขั้นตอนทางธุรกิจที่สำคัญและประเมินผลกระทบที่อาจเกิดขึ้นจากการหยุดชะงักของกระบวนการเหล่านั้น ซึ่งเป็นขั้นตอนแรกที่สำคัญในการพัฒนาแผนความต่อเนื่องทางธุรกิจ (BCP)
** Question 34** Which of the following are not types of security control? Options: A common control B hybrid control C system specific control D storage control Correct Option: D storage control Keywords for Exam: not types of security control Detailed Explanation:
คำอธิบายโดยละเอียด: Common, hybrid และ system-specific เป็นประเภทของการควบคุมความปลอดภัยที่เป็นที่ยอมรับ "Storage control" ไม่ใช่การจำแนกประเภทมาตรฐาน แม้ว่าการรักษาความปลอดภัยสำหรับพื้นที่จัดเก็บข้อมูลจะมีความสำคัญและทำได้ผ่านการควบคุมประเภทอื่น (เช่น การเข้ารหัสหรือการควบคุมการเข้าถึง)
** Question 35** Which of the following is not a type of learning activity used in security awareness? Options: A awareness B training C education D tutorial Correct Option: D tutorial Keywords for Exam: not a type of learning activity, security awareness Detailed Explanation:
คำอธิบายโดยละเอียด: Awareness, Training และ Education เป็นกิจกรรมการเรียนรู้หลักสามประเภทในโปรแกรมสร้างความตระหนักด้านความปลอดภัย "Tutorial" เป็นรูปแบบหรือวิธีการนำเสนอเนื้อหาที่เฉพาะเจาะจง ไม่ใช่หมวดหมู่หลักของกิจกรรมการเรียนรู้
** Question 36** The magnitude of the harm expected as a result of the consequences of an unauthorized disclosure, modification, destruction, or loss of information is known as: Options: A vulnerability B threat C impact D likelihood Correct Option: C impact Keywords for Exam: magnitude of the harm, consequences of an unauthorized disclosure modification destruction or loss of information Detailed Explanation:
คำอธิบายโดยละเอียด: ผลกระทบ (Impact) หมายถึงขนาดของความเสียหายที่อาจเกิดขึ้นจากเหตุการณ์ด้านความปลอดภัย ความเสี่ยง (Risk) เป็นฟังก์ชันของภัยคุกคาม (Threat), ช่องโหว่ (Vulnerability) และผลกระทบ (Impact)
** Question 37** The implementation of security controls is a form of: Options: A risk reduction B risk acceptance C risk avoidance D risk transference Correct Option: A risk reduction Keywords for Exam: implementation of security controls, form of, mitigate or lessen the likelihood and impact Detailed Explanation:
คำอธิบายโดยละเอียด: การใช้มาตรการควบคุมความปลอดภัยเป็นรูปแบบหนึ่งของการลดความเสี่ยง (risk reduction หรือ mitigation) เนื่องจากมีเป้าหมายเพื่อลดโอกาสและ/หรือผลกระทบของภัยคุกคามที่อาจเกิดขึ้น
** Question 38** Which of the following attacks takes advantage of poor input validation in websites? Options: A Trojans B cross-site scripting C phishing D rootkits Correct Option: B cross-site scripting Keywords for Exam: attack, take advantage of, poor input validation, websites Detailed Explanation:
คำอธิบายโดยละเอียด: การโจมตีแบบ Cross-Site Scripting (XSS) ใช้ประโยชน์จากช่องโหว่ในการตรวจสอบอินพุตบนเว็บไซต์เพื่อแทรกสคริปต์ที่เป็นอันตรายเข้าไปในหน้าเว็บที่ผู้ใช้รายอื่นดู
** Question 39** Which of the following is an example of an administrative security control? Options: A access control list B acceptable use policies C badge readers D no entry signs Correct Option: B acceptable use policies Keywords for Exam: example, administrative security control, written policies, non-technical Detailed Explanation:
คำอธิบายโดยละเอียด: การควบคุมเชิงบริหาร (Administrative controls) คือการควบคุมที่ไม่ใช่ด้านเทคนิคซึ่งเกี่ยวข้องกับกระบวนการและนโยบายการจัดการ นโยบายการใช้งานที่ยอมรับได้ (Acceptable Use Policy - AUP) เป็นตัวอย่างที่สำคัญ
** Question 40** In change management, which component addresses the procedures needed to undo changes? Options: A request for approval B request for change C rollback D disaster and recovery Correct Option: C rollback Keywords for Exam: change management, component, procedures needed to undo changes, revert to previous state Detailed Explanation:
คำอธิบายโดยละเอียด: แผนการย้อนกลับ (rollback plan) เป็นส่วนประกอบที่สำคัญของการจัดการการเปลี่ยนแปลง ซึ่งระบุขั้นตอนในการคืนค่าระบบกลับสู่สถานะที่เสถียรภาพก่อนหน้าหากการเปลี่ยนแปลงก่อให้เกิดปัญหา
** Question 41** Which of the following properties is not guaranteed by digital signatures? Options: A Authentication B confidentiality C non-repudiation D integrity Correct Option: B confidentiality Keywords for Exam: not guaranteed, digital signatures, properties Detailed Explanation:
คำอธิบายโดยละเอียด: ลายเซ็นดิจิทัล (Digital signatures) ให้การยืนยันตัวตน (authentication), ความสมบูรณ์ของข้อมูล (integrity) และการห้ามปฏิเสธความรับผิดชอบ (non-repudiation) อย่างไรก็ตาม มันไม่ได้ให้การรักษาความลับ (confidentiality) ซึ่งทำได้โดยการเข้ารหัส (encryption)
** Question 42** Which devices have the primary objective of collecting and analyzing security events? Options: A hubs B firewalls C router D SIEM (Security Information and Event Management) Correct Option: D SIEM (Security Information and Event Management) Keywords for Exam: primary objective, collecting and analyzing security events, SIEM Detailed Explanation:
คำอธิบายโดยละเอียด: เป้าหมายหลักของระบบ SIEM (Security Information and Event Management) คือการรวบรวม, สัมพันธ์ และวิเคราะห์ข้อมูลเหตุการณ์ความปลอดภัยจากทั่วทั้งเครือข่าย เพื่อให้การตรวจสอบและตรวจจับภัยคุกคามเป็นไปอย่างครอบคลุม
** Question 43** What is an effective way of hardening a system? Options: A patch the system B have an IDS in place C run a vulnerability scan D create a DMZ for web application services Correct Option: A patch the system Keywords for Exam: effective way, hardening a system, applying patches, addresses known vulnerabilities Detailed Explanation:
คำอธิบายโดยละเอียด: การเสริมความแข็งแกร่งของระบบ (System hardening) เกี่ยวข้องกับการลดพื้นที่การโจมตีของระบบ การติดตั้งแพตช์เป็นเทคนิคพื้นฐานและมีประสิทธิภาพในการเสริมความแข็งแกร่ง เนื่องจากเป็นการปิดช่องโหว่ที่รู้จัก
** Question 44** Which type of key can be used to both encrypt and decrypt the same message? Options: A a public key B a private key C an asymmetric key D a symmetric key Correct Option: D a symmetric key Keywords for Exam: key, used to both encrypt and decrypt, same message Detailed Explanation:
คำอธิบายโดยละเอียด: การเข้ารหัสแบบสมมาตร (Symmetric encryption) ใช้กุญแจเดียวในการเข้ารหัสและถอดรหัสข้อความ ส่วนการเข้ารหัสแบบอสมมาตร (Asymmetric encryption) ใช้คู่ของกุญแจ (สาธารณะและส่วนตัว)
** Question 45** Which regulation addresses data protection and privacy in Europe? Options: A SOX B HIPAA C FISMA D GDPR Correct Option: D GDPR Keywords for Exam: regulations, data protection and privacy, Europe Detailed Explanation:
คำอธิบายโดยละเอียด: GDPR (General Data Protection Regulation) เป็นกฎระเบียบด้านการคุ้มครองข้อมูลและความเป็นส่วนตัวที่ครอบคลุมในสหภาพยุโรป
** Question 46** Which of the following types of devices inspect packet header information to either allow or deny network traffic? Options: A hubs B firewalls C router D switches Correct Option: B firewalls Keywords for Exam: inspect packet header information, allow or deny network traffic, security device Detailed Explanation:
คำอธิบายโดยละเอียด: ไฟร์วอลล์ (Firewalls) ตรวจสอบส่วนหัวของแพ็กเก็ตเพื่อบังคับใช้นโยบายความปลอดภัย โดยอนุญาตหรือปฏิเสธทราฟฟิกตามกฎ (เช่น IP ต้นทาง/ปลายทาง, พอร์ต)
** Question 47** A web server that accepts requests from external clients should be placed in which network? Options: A internet B DMZ C internal network D VPN Correct Option: B DMZ Keywords for Exam: web server, accepts request from external clients, placed in which network, extra layer of security Detailed Explanation:
คำอธิบายโดยละเอียด: DMZ (Demilitarized Zone) คือส่วนของเครือข่ายที่แยกออกมาเพื่อเพิ่มชั้นความปลอดภัยสำหรับบริการที่เข้าถึงได้จากภายนอก เช่น เว็บเซิร์ฟเวอร์ โดยแยกออกจากเครือข่ายภายใน
** Question 48** How many data labels are considered good practice? Options: A 2 to 3 B 1 C 1 to 2 D greater than 4 Correct Option: A 2 to 3 Keywords for Exam: data labels, good practice, balance between simplicity and effective data classification Detailed Explanation:
คำอธิบายโดยละเอียด: การใช้ป้ายกำกับข้อมูล 2 ถึง 3 ป้าย (เช่น สาธารณะ, ภายใน, ลับ) เป็นแนวทางปฏิบัติที่ดี เนื่องจากสร้างความสมดุลระหว่างความเรียบง่ายและการจำแนกประเภทข้อมูลที่มีประสิทธิภาพ ทำให้ผู้ใช้เข้าใจและนำไปใช้ได้ง่าย
** Question 49** Security posters are an element primarily employed in: Options: A security awareness B incident response plans C business continuity plans D physical security controls Correct Option: A security awareness Keywords for Exam: security posters, primarily employed in, educate and remind employees, promote a security conscious culture Detailed Explanation:
คำอธิบายโดยละเอียด: โปสเตอร์ด้านความปลอดภัยเป็นเครื่องมือที่ใช้ในโปรแกรมสร้างความตระหนักด้านความปลอดภัยเพื่อให้ความรู้และเตือนพนักงานเกี่ยวกับแนวทางปฏิบัติและนโยบายความปลอดภัยที่ดีที่สุด
** Question 50** Which of these types of user is less likely to have a privileged account? Options: A security admin B security analyst C help desk D external worker Correct Option: D external worker Keywords for Exam: less likely, privileged account, limited access Detailed Explanation:
คำอธิบายโดยละเอียด: พนักงานภายนอก (เช่น ผู้รับเหมา, พนักงานชั่วคราว) มีโอกาสน้อยที่สุดที่จะมีบัญชีสิทธิ์พิเศษและควรได้รับสิทธิ์การเข้าถึงตามหลักการสิทธิ์น้อยที่สุด (least privilege)
** Question 51** The predetermined set of instructions or procedures to sustain business operations after a disaster is commonly known as: Options: A business impact analysis B disaster recovery plan C business impact plan D business continuity plan Correct Option: D business continuity plan Keywords for Exam: predetermined set of instructions, sustain business operations, after a disaster, comprehensive approach Detailed Explanation:
คำอธิบายโดยละเอียด: แผนความต่อเนื่องทางธุรกิจ (BCP) เป็นแผนที่ครอบคลุมซึ่งสรุปขั้นตอนในการรักษาฟังก์ชันทางธุรกิจที่จำเป็นระหว่างและหลังเกิดภัยพิบัติ ส่วนแผนการกู้คืนระบบ (DRP) เป็นส่วนหนึ่งของ BCP
** Question 52** Which of the following is not an element of system security configuration management? Options: A inventory B baselines C updates D audit logs Correct Option: D audit logs Keywords for Exam: not an element, system security configuration management Detailed Explanation:
คำอธิบายโดยละเอียด: องค์ประกอบสำคัญของการจัดการการกำหนดค่า ได้แก่ การรักษารายการระบบ, การสร้างมาตรฐานความปลอดภัย และการจัดการการอัปเดต บันทึกการตรวจสอบ (Audit logs) มีความสำคัญต่อการตรวจสอบความปลอดภัย แต่ถือเป็นผลลัพธ์หรือการควบคุมแยกต่างหาก ไม่ใช่ส่วนประกอบหลักของการจัดการการกำหนดค่า
** Question 53** Which are the components of an incident response plan, in the correct order? Options: A preparation, detection and analysis, recovery, containment, eradication, and post incident activity B preparation, detection and analysis, containment, eradication, post incident activity, and recovery C preparation, detection and analysis, eradication, recovery, containment, and post incident activity D preparation, detection and analysis, containment, eradication, recovery, and post incident activity Correct Option: D preparation, detection and analysis, containment, eradication, recovery, and post incident activity Keywords for Exam: components of an incident response plan, steps of an incident response plan, correct order Detailed Explanation:
คำอธิบายโดยละเอียด: ขั้นตอนมาตรฐานของแผนรับมือเหตุการณ์ (ตาม NIST) คือ: การเตรียมการ (Preparation); การตรวจจับและวิเคราะห์ (Detection and Analysis); การจำกัดขอบเขต, การกำจัด และการกู้คืน (Containment, Eradication, & Recovery); และกิจกรรมหลังเกิดเหตุ (Post-Incident Activity)
** Question 54** Which of the following is an example of 2FA (Two-Factor Authentication)? Options: A badges B passwords C keys D one-time passwords Correct Option: D one-time passwords Keywords for Exam: 2FA, two-factor authentication, two different forms of authentication Detailed Explanation:
คำอธิบายโดยละเอียด: การยืนยันตัวตนแบบสองปัจจัย (2FA) ต้องการปัจจัยการยืนยันตัวตนสองประเภทที่แตกต่างกัน รหัสผ่านแบบใช้ครั้งเดียว (สิ่งที่คุณมี) ที่ใช้กับรหัสผ่านปกติ (สิ่งที่คุณรู้) เป็นตัวอย่างคลาสสิกของ 2FA
** Question 55** Which of the following is not a feature of a cryptographic hash function? Options: A reversible B unique C deterministic D useful Correct Option: A reversible Keywords for Exam: not a feature, cryptographic hash function, irreversible, one-way function Detailed Explanation:
คำอธิบายโดยละเอียด: คุณสมบัติที่สำคัญของฟังก์ชันแฮชเชิงรหัสวิทยาคือมันไม่สามารถย้อนกลับได้ (เป็นฟังก์ชันทางเดียว) ซึ่งหมายความว่าคุณไม่สามารถหาข้อมูลต้นฉบับจากผลลัพธ์ของแฮชได้
** Question 56** What are the three packets used in the TCP connection handshake? Options: A OFFER, REQUEST, ACK B SYN, SYN-ACK, ACK C SYN, FIN, ACK D DISCOVER, OFFER, REQUEST Correct Option: B SYN, SYN-ACK, ACK Keywords for Exam: three packets, TCP connection handshake, reliable connection Detailed Explanation:
คำอธิบายโดยละเอียด: การจับมือสามทางของ TCP (three-way handshake) สร้างการเชื่อมต่อที่เชื่อถือได้โดยใช้แพ็กเก็ตสามชุดตามลำดับ: SYN, SYN-ACK และ ACK
** Question 57** After an earthquake disrupts business operations, which document contains the procedures required to return business to normal operation? Options: A the business impact plan B the business impact analysis C the business continuity plan D the disaster recovery plan Correct Option: D the disaster recovery plan Keywords for Exam: after an earthquake disrupting business operations, procedures to return business to normal operation Detailed Explanation:
คำอธิบายโดยละเอียด: แผนการกู้คืนระบบหลังภัยพิบัติ (DRP) มีขั้นตอนทางเทคนิคเฉพาะในการคืนค่าระบบไอทีและโครงสร้างพื้นฐานให้กลับมาทำงานปกติหลังเกิดภัยพิบัติ
** Question 58** What is the consequence of a denial of service attack? Options: A exhaustion of device resources B malware infection C increase in the availability of resources D remote control of a device Correct Option: A exhaustion of device resources Keywords for Exam: consequence, denial of service attack, inaccessible, overwhelming with excessive traffic Detailed Explanation:
คำอธิบายโดยละเอียด: ผลกระทบหลักของการโจมตี DoS คือการใช้ทรัพยากรของอุปกรณ์จนหมด (เช่น แบนด์วิดท์, CPU หรือหน่วยความจำ) ซึ่งทำให้บริการไม่พร้อมใช้งาน
** Question 59** According to ISC2, what are the six phases of data handling, in order? Options: A create, use, store, share, archive, and destroy B create, store, use, share, archive, and destroy C create, share, use, store, archive, and destroy D create, store, use, archive, share, and destroy Correct Option: B create, store, use, share, archive, and destroy Keywords for Exam: ISC2, six phases of data handling, correct order, data life cycle Detailed Explanation:
คำอธิบายโดยละเอียด: วงจรชีวิตข้อมูลหกขั้นตอนตามที่ ISC2 กำหนดคือ: สร้าง (Create), จัดเก็บ (Store), ใช้งาน (Use), แบ่งปัน (Share), จัดเก็บถาวร (Archive) และทำลาย (Destroy)
** Question 60** Which of the following is less likely to be part of an incident response team? Options: A legal representative B human resources C representatives of senior management D information security professional Correct Option: B human resources Keywords for Exam: less likely, part of an incident response team, core members Detailed Explanation:
คำอธิบายโดยละเอียด: สมาชิกหลักของทีม IR มักประกอบด้วยผู้เชี่ยวชาญด้านความปลอดภัย, ที่ปรึกษากฎหมาย และตัวแทนฝ่ายบริหาร ฝ่ายทรัพยากรบุคคลโดยทั่วไปจะเกี่ยวข้องเป็นรายกรณีเท่านั้น (เช่น หากมีพนักงานเกี่ยวข้อง)
** Question 61** Which of these tools is commonly used to crack passwords? Options: A Burp Suite B NSLookup C John the Ripper D Wireshark Correct Option: C John the Ripper Keywords for Exam: commonly used, crack passwords, brute force, dictionary attacks Detailed Explanation:
คำอธิบายโดยละเอียด: John the Ripper เป็นเครื่องมือแครกรหัสผ่านยอดนิยมที่ใช้ในการระบุรหัสผ่านที่อ่อนแอผ่านวิธีการโจมตีต่างๆ
** Question 62** In order to find out whether personal tablet devices are allowed in the office, which of the following policies would be helpful to read? Options: A BYOD (Bring Your Own Device) policy B privacy policy C change management policy D AUP (Acceptable Use Policy) Correct Option: A BYOD (Bring Your Own Device) policy Keywords for Exam: personal tablet devices, allowed in the office, policy, BYOD Detailed Explanation:
คำอธิบายโดยละเอียด: นโยบาย BYOD (Bring Your Own Device) ระบุกฎและข้อกำหนดด้านความปลอดภัยสำหรับพนักงานที่ใช้อุปกรณ์ส่วนตัวในการทำงานโดยเฉพาะ
** Question 63** In which cloud deployment model do companies with similar interests share resources and infrastructure on the cloud? Options: A hybrid cloud B multi-tenant C private cloud D community cloud Correct Option: D community cloud Keywords for Exam: cloud deployment model, companies share resources and infrastructure, similar interests or requirements Detailed Explanation:
คำอธิบายโดยละเอียด: Community Cloud เป็นโมเดลที่องค์กรที่มีความสนใจคล้ายกัน (เช่น จากอุตสาหกรรมเดียวกันหรือมีข้อกำหนดด้านกฎระเบียบเดียวกัน) ใช้ทรัพยากรคลาวด์ร่วมกัน
** Question 64** Which of these is the primary objective of a disaster recovery plan? Options: A restore company IT operations to the last known reliable operation state B outline a safe escape procedure for the organization's personnel C maintain crucial company operations in the event of a disaster D communicate to the responsible entities the damage caused to the operations Correct Option: A restore company IT operations to the last known reliable operation state Keywords for Exam: primary objective, disaster recovery plan, restore company operation, functional state, IT systems and infrastructure Detailed Explanation:
คำอธิบายโดยละเอียด: วัตถุประสงค์หลักของ DRP คือการคืนค่าการดำเนินงานด้านไอทีของบริษัทให้กลับสู่สถานะที่ใช้งานได้ ซึ่งโดยทั่วไปคือสถานะที่เชื่อถือได้ล่าสุดหลังจากเกิดภัยพิบัติ
** Question 65** An entity that acts to exploit a target organization's systems and abilities is a: Options: A threat actor B threat vector C threat D attacker Correct Option: A threat actor Keywords for Exam: entity that acts to exploit, individual or group, carries out attacks Detailed Explanation:
คำอธิบายโดยละเอียด: ผู้คุกคาม (Threat actor) คือบุคคลหรือกลุ่มที่ใช้ประโยชน์จากช่องโหว่เพื่อทำการโจมตี ส่วนเวกเตอร์ภัยคุกคาม (Threat vector) คือเส้นทางหรือวิธีการที่พวกเขาใช้
** Question 66** A best practice of patch management is to: Options: A apply all patches as quickly as possible B test patches before applying them C apply patches every Wednesday D apply patches according to vendor's reputation Correct Option: B test patches before applying them Keywords for Exam: best practice, patch management, test patches, controlled environment Detailed Explanation:
คำอธิบายโดยละเอียด: แนวปฏิบัติที่ดีที่สุดที่สำคัญที่สุดสำหรับการจัดการแพตช์คือการทดสอบแพตช์ในสภาพแวดล้อมที่มีการควบคุมและไม่ใช่สภาพแวดล้อมจริงก่อนที่จะนำไปใช้งานในวงกว้างเพื่อหลีกเลี่ยงผลกระทบที่ไม่คาดคิด
** Question 67** Which of these would be the best tool if a network administrator needs to control access to a network based on device compliance? Options: A HIDS (Host-based Intrusion Detection System) B IDS (Intrusion Detection System) C SIEM (Security Information and Event Management) D NAC (Network Access Control) Correct Option: D NAC (Network Access Control) Keywords for Exam: control access to a network, network administrator, NAC, device compliance Detailed Explanation:
คำอธิบายโดยละเอียด: Network Access Control (NAC) เป็นโซลูชันความปลอดภัยที่ออกแบบมาเพื่อบังคับใช้นโยบายและควบคุมการเข้าถึงเครือข่ายตามการปฏิบัติตามข้อกำหนดของอุปกรณ์และตัวตนของผู้ใช้
** Question 68** Which of these is not a change management component? Options: A approval B RFC (Request for Change) C rollback D governance Correct Option: D governance Keywords for Exam: not a change management component, governance Detailed Explanation:
คำอธิบายโดยละเอียด: RFC, การอนุมัติ และการย้อนกลับล้วนเป็นองค์ประกอบหลักของกระบวนการจัดการการเปลี่ยนแปลง ธรรมาภิบาล (Governance) เป็นกรอบการทำงานของกฎและแนวปฏิบัติที่ชี้นำองค์กร ไม่ใช่ส่วนประกอบของกระบวนการจัดการการเปลี่ยนแปลง
** Question 69** Which of the following is not a social engineering technique? Options: A pretexting B quid pro quo C double dealing D baiting Correct Option: C double dealing Keywords for Exam: not a social engineering technique, deception Detailed Explanation:
คำอธิบายโดยละเอียด: Pretexting, quid pro quo และ baiting เป็นเทคนิควิศวกรรมสังคมที่เป็นที่ยอมรับ "Double dealing" เป็นคำทั่วไปสำหรับการหลอกลวงและไม่ใช่เทคนิคที่เป็นที่รู้จักในด้านความปลอดภัยทางไซเบอร์
** Question 70** If there is no time constraint, which protocol should be employed to establish a reliable connection between two devices? Options: A TCP (Transmission Control Protocol) B DHCP C SNMP D UDP (User Datagram Protocol) Correct Option: A TCP (Transmission Control Protocol) Keywords for Exam: no time constraint, reliable connection, between two devices, three-way handshake Detailed Explanation:
คำอธิบายโดยละเอียด: TCP (Transmission Control Protocol) เป็นโปรโตคอลที่เน้นการเชื่อมต่อซึ่งสร้างการเชื่อมต่อที่เชื่อถือได้โดยใช้การจับมือสามทาง ทำให้มั่นใจได้ว่าข้อมูลจะถูกส่งอย่างถูกต้องและตามลำดับ UDP เร็วกว่าแต่ไม่น่าเชื่อถือ
** Question 71** An exploitable weakness or flaw in a system or component is a: Options: A threat B bug C vulnerability D risk Correct Option: C vulnerability Keywords for Exam: exploitable weakness or flaw, in a system or component, targeted by attackers Detailed Explanation:
คำอธิบายโดยละเอียด: ช่องโหว่ (Vulnerability) คือจุดอ่อนหรือข้อบกพร่องที่สามารถใช้ประโยชน์ได้ในระบบ ภัยคุกคาม (Threat) คือผู้กระทำหรือเหตุการณ์ที่อาจใช้ประโยชน์จากช่องโหว่นั้น
** Question 72** In which cloud model does the cloud customer have the least responsibility over the infrastructure? Options: A IaaS (Infrastructure as a Service) B FaaS (Function as a Service) C PaaS (Platform as a Service) D SaaS (Software as a Service) Correct Option: D SaaS (Software as a Service) Keywords for Exam: cloud model, least responsibility over the infrastructure, cloud provider handles everything Detailed Explanation:
คำอธิบายโดยละเอียด: ในโมเดล SaaS (Software as a Service) ผู้ให้บริการคลาวด์จัดการเกือบทุกด้านของบริการ (แอปพลิเคชัน, ข้อมูล, รันไทม์, OS, โครงสร้างพื้นฐาน) ทำให้ลูกค้ามีความรับผิดชอบน้อยที่สุด
** Question 73** Risk management is: Options: A the assessment of the potential impact of a threat B the creation of an incident response team C the impact and likelihood of a threat D the identification, evaluation, and prioritization of risk Correct Option: D the identification, evaluation, and prioritization of risk Keywords for Exam: risk management, identification evaluation and prioritization, mitigation strategy Detailed Explanation:
คำอธิบายโดยละเอียด: การจัดการความเสี่ยงเป็นกระบวนการต่อเนื่องของการระบุ, ประเมิน (ประเมินความน่าจะเป็นและผลกระทบ) และจัดลำดับความสำคัญของความเสี่ยงเพื่อนำกลยุทธ์การลดความเสี่ยงมาใช้อย่างมีประสิทธิภาพ
** Question 74** Which of the following documents contains elements that are not mandatory? Options: A policies B guidelines C regulation D procedures Correct Option: B guidelines Keywords for Exam: documents, not mandatory, recommendations or best practices Detailed Explanation:
คำอธิบายโดยละเอียด: แนวทางปฏิบัติ (Guidelines) ให้คำแนะนำที่ไม่บังคับหรือแนวปฏิบัติที่ดีที่สุด ทำให้มีความยืดหยุ่นในการนำไปใช้ นโยบาย, กฎระเบียบ และระเบียบปฏิบัติโดยทั่วไปเป็นข้อบังคับ
** Question 75** In which of the following phases of an incident response plan is prioritization of the response performed? Options: A post incident activity B detection and analysis C preparation D containment, eradication, and recovery Correct Option: B detection and analysis Keywords for Exam: incident response plan, incident response is prioritized, severity and impact of the incident Detailed Explanation:
คำอธิบายโดยละเอียด: ในระหว่างขั้นตอนการตรวจจับและวิเคราะห์ ทีมรับมือเหตุการณ์จะวิเคราะห์เหตุการณ์เพื่อทำความเข้าใจขอบเขต, ความเร่งด่วน และผลกระทบ ซึ่งช่วยให้พวกเขาสามารถจัดลำดับความสำคัญของการตอบสนองได้
** Question 76** Which security principle states that a user should only have the necessary permission to execute a task? Options: A privileged accounts B separation of duties C least privilege D defense in depth Correct Option: C least privilege Keywords for Exam: security principle, only have the necessary permission, execute a task, minimum level of access Detailed Explanation:
คำอธิบายโดยละเอียด: หลักการสิทธิ์น้อยที่สุด (least privilege) กำหนดว่าผู้ใช้และระบบควรได้รับสิทธิ์การเข้าถึงและสิทธิ์ขั้นต่ำที่จำเป็นในการปฏิบัติงานที่ต้องการเท่านั้น
** Question 77** The Bell-LaPadula access control model is a form of: Options: A ABAC (Attribute-Based Access Control) B RBAC (Role-Based Access Control) C MAC (Mandatory Access Control) D DAC (Discretionary Access Control) Correct Option: C MAC (Mandatory Access Control) Keywords for Exam: Bell-LaPadula access control model, form of, security labels, confidentiality Detailed Explanation:
คำอธิบายโดยละเอียด: โมเดล Bell-LaPadula เป็นประเภทหนึ่งของโมเดล Mandatory Access Control (MAC) ที่มุ่งเน้นการบังคับใช้การรักษาความลับตามป้ายกำกับการจำแนกประเภทความปลอดภัย
** Question 78** In risk management, the highest priority is given to a risk where: Options: A the frequency of occurrence is low and the expected impact value is high B the expected probability of occurrence is low and potential impact is low C the expected probability of occurrence is high and the potential impact is low D the frequency of occurrence is high and the expected impact value is high Correct Option: D the frequency of occurrence is high and the expected impact value is high Keywords for Exam: risk management, highest priority, high frequency, high impact Detailed Explanation:
คำอธิบายโดยละเอียด: ความสำคัญสูงสุดจะมอบให้กับความเสี่ยงที่มีทั้งความน่าจะเป็นสูง (ความถี่) และผลกระทบที่อาจเกิดขึ้นสูง เนื่องจากสิ่งเหล่านี้แสดงถึงความเสียหายที่อาจเกิดขึ้นได้มากที่สุด
** Question 79** Which of the following areas is connected to PII (Personally Identifiable Information)? Options: A non-repudiation B authentication C integrity D confidentiality Correct Option: D confidentiality Keywords for Exam: connected to PII, personally identifiable information, secure them, unauthorized users Detailed Explanation:
คำอธิบายโดยละเอียด: PII (Personally Identifiable Information) เชื่อมโยงโดยตรงกับหลักการรักษาความลับ (confidentiality) ซึ่งรับประกันว่าข้อมูลที่ละเอียดอ่อนจะได้รับการปกป้องจากการเข้าถึงโดยไม่ได้รับอนุญาต
** Question 80** Malicious emails that aim to attack company executives are an example of: Options: A Trojans B whaling C phishing D rootkits Correct Option: C whaling Keywords for Exam: malicious emails, attack company executives, high-profile individual, social engineering Detailed Explanation:
คำอธิบายโดยละเอียด: การโจมตีแบบ Whaling เป็นรูปแบบฟิชชิ่งที่กำหนดเป้าหมายอย่างสูงซึ่งมุ่งเป้าไปที่ผู้บริหารระดับสูงและบุคคลสำคัญอื่น ๆ ภายในองค์กรโดยเฉพาะ
** Question 81** Governments can impose financial penalties as a consequence of breaking a: Options: A regulation B standard C policy D procedure Correct Option: A regulation Keywords for Exam: governments can impose, financial penalties, breaking a, legally binding rules Detailed Explanation:
คำอธิบายโดยละเอียด: กฎระเบียบเป็นกฎที่มีผลผูกพันทางกฎหมายซึ่งกำหนดโดยรัฐบาลหรือหน่วยงานกำกับดูแล และการไม่ปฏิบัติตามอาจส่งผลให้มีบทลงโทษทางการเงินที่สำคัญ
** Question 82** Which type of attack attempts to trick the user into revealing personal information by sending a fraudulent message? Options: A phishing B cross-site scripting C denial of service D trojan Correct Option: A phishing Keywords for Exam: trick the user, revealing personal information, fraudulent message, emails Detailed Explanation:
คำอธิบายโดยละเอียด: ฟิชชิ่งเป็นการโจมตีทางวิศวกรรมสังคมที่ใช้ข้อความหลอกลวง (โดยทั่วไปคืออีเมล) เพื่อหลอกให้ผู้ใช้เปิดเผยข้อมูลส่วนบุคคลที่ละเอียดอ่อน
** Question 83** In which of the following access control models can the creator of an object delegate permissions? Options: A ABAC (Attribute-Based Access Control) B MAC (Mandatory Access Control) C RBAC (Role-Based Access Control) D DAC (Discretionary Access Control) Correct Option: D DAC (Discretionary Access Control) Keywords for Exam: access control model, creator of an object, delegate permissions, owner's discretion Detailed Explanation:
คำอธิบายโดยละเอียด: ในโมเดล Discretionary Access Control (DAC) เจ้าของ (ผู้สร้าง) ของวัตถุมีสิทธิ์ในการให้หรือมอบหมายสิทธิ์ให้กับผู้ใช้รายอื่น
** Question 84** Which type of attack has the primary objective of encrypting devices and their data and then demanding ransom payment for the decryption key? Options: A ransomware B Trojan C cross-site scripting D phishing Correct Option: A ransomware Keywords for Exam: primary objective, encrypting devices and their data, demanding ransom payment, decryption key Detailed Explanation:
คำอธิบายโดยละเอียด: แรนซัมแวร์เป็นมัลแวร์ที่เข้ารหัสไฟล์ของเหยื่อและเรียกร้องค่าไถ่เพื่อแลกกับคีย์ถอดรหัส
** Question 85** Which of the following cloud models allows access to fundamental computer resources like CPU, storage, memory, and operating system? Options: A SaaS (Software as a Service) B FaaS (Function as a Service) C PaaS (Platform as a Service) D IaaS (Infrastructure as a Service) Correct Option: D IaaS (Infrastructure as a Service) Keywords for Exam: cloud models, allow access to, fundamental computer resources, CPU storage memory operating system Detailed Explanation:
คำอธิบายโดยละเอียด: IaaS (Infrastructure as a Service) ให้การเข้าถึงทรัพยากรคอมพิวเตอร์พื้นฐานเช่นเครื่องเสมือน, ที่เก็บข้อมูล และเครือข่าย ซึ่งลูกค้าสามารถติดตั้งระบบปฏิบัติการและแอปพลิเคชันของตนเองได้
** Question 86** How many layers does the OSI model have? Options: A 7 B 4 C 6 D 5 Correct Option: A 7 Keywords for Exam: OSI model, how many layers, seven layers Detailed Explanation:
คำอธิบายโดยละเอียด: โมเดล OSI (Open Systems Interconnection) มีเจ็ดเลเยอร์ที่กำหนดมาตรฐานฟังก์ชันเครือข่าย ช่วยจำ: All People Seem To Need Data Processing.
** Question 87** Which of these principles aims primarily at fraud detection? Options: A privileged accounts B defense in depth C least privilege D separation of duties Correct Option: D separation of duties Keywords for Exam: principle, aims primarily at fraud detection, no single individual has control Detailed Explanation:
คำอธิบายโดยละเอียด: การแบ่งแยกหน้าที่เป็นหลักการสำคัญสำหรับการตรวจจับและป้องกันการฉ้อโกง ทำให้มั่นใจได้ว่าไม่มีบุคคลใดคนเดียวที่ควบคุมทุกด้านของธุรกรรมที่สำคัญ
** Question 88** Which protocol uses a three-way handshake to establish a reliable connection? Options: A TCP B SMTP C UDP D SNMP Correct Option: A TCP Keywords for Exam: protocol, three-way handshake, reliable connection Detailed Explanation:
คำอธิบายโดยละเอียด: TCP (Transmission Control Protocol) ใช้การจับมือสามทาง (SYN, SYN-ACK, ACK) เพื่อสร้างเซสชันที่เชื่อถือได้และเน้นการเชื่อมต่อ
** Question 89** Which of the following is an example of a technical security control? Options: A access control list B turnstiles C fences D bollards Correct Option: A access control list Keywords for Exam: example, technical security control, software or hardware system Detailed Explanation:
คำอธิบายโดยละเอียด: Access Control List (ACL) เป็นการควบคุมทางเทคนิคที่นำมาใช้ในซอฟต์แวร์หรือฮาร์ดแวร์ (เช่น ไฟร์วอลล์หรือเราเตอร์) เพื่อจัดการสิทธิ์ ประตูหมุน, รั้ว และเสากั้นเป็นมาตรการควบคุมทางกายภาพ
** Question 90** Which type of attack attempts to gain information by observing the device's power consumption? Options: A side channel attack B trojans C cross-site scripting D denial of service Correct Option: A side channel attack Keywords for Exam: gain information, observing the devices power consumption, physical characteristics, electromagnetic emission or timing data Detailed Explanation:
คำอธิบายโดยละเอียด: การโจมตีแบบ Side-channel เป็นการโจมตีแบบไม่รุกรานที่รวบรวมข้อมูลโดยการสังเกตลักษณะทางกายภาพของอุปกรณ์ เช่น การใช้พลังงาน, เวลา หรือการปล่อยคลื่นแม่เหล็กไฟฟ้า
** Question 91** Which of these is the most distinctive property of PHI (Protected Health Information)? Options: A integrity B confidentiality C non-repudiation D authentication Correct Option: B confidentiality Keywords for Exam: most distinctive property, PHI, protected health information, unauthorized access, patient privacy Detailed Explanation:
คำอธิบายโดยละเอียด: คุณสมบัติที่สำคัญที่สุดของ PHI (Protected Health Information) คือการรักษาความลับ กฎระเบียบเช่น HIPAA มุ่งเน้นไปที่การปกป้องความเป็นส่วนตัวและการรักษาความลับของข้อมูลสุขภาพของผู้ป่วยเป็นหลัก
** Question 92** Which of these is the most efficient and effective way to test a business continuity plan? Options: A simulations B walkthroughs C reviews D discussions Correct Option: A simulations Keywords for Exam: most efficient and effective way to test, business continuity plan, mimic real life scenarios, evaluate readiness Detailed Explanation:
คำอธิบายโดยละเอียด: การจำลองสถานการณ์เป็นวิธีที่มีประสิทธิภาพที่สุดในการทดสอบ BCP เนื่องจากเป็นการเลียนแบบสถานการณ์ภัยพิบัติในชีวิตจริง ทำให้ทีมสามารถฝึกฝนบทบาทและระบุจุดอ่อนในแผนภายใต้ความกดดันได้
** Question 93** Which of the following cyber security concepts guarantees that information is accessible only to those authorized to access it? Options: A confidentiality B non-repudiation C authentication D accessibility Correct Option: A confidentiality Keywords for Exam: cyber security concepts, guarantees, accessible only to those authorized to access it, unauthorized disclosure Detailed Explanation:
คำอธิบายโดยละเอียด: การรักษาความลับ (Confidentiality) เป็นหลักการพื้นฐานด้านความปลอดภัยทางไซเบอร์ที่รับประกันว่าข้อมูลจะไม่ถูกเปิดเผยต่อบุคคล, หน่วยงาน หรือกระบวนการที่ไม่ได้รับอนุญาต เป็นตัว 'C' ใน CIA triad
** Question 94** In the event of a disaster, what should be the primary objective? Options: A apply disaster communication B protect the production database C guarantee the safety of people D guarantee the continuity of critical systems Correct Option: C guarantee the safety of people Keywords for Exam: disaster, primary objective, safety of people, human life and safety take precedence Detailed Explanation:
คำอธิบายโดยละเอียด: ในภัยพิบัติใดๆ วัตถุประสงค์หลักที่สำคัญที่สุดคือการรับประกันความปลอดภัยของบุคลากร วัตถุประสงค์อื่น ๆ ทั้งหมดรวมถึงความต่อเนื่องของระบบเป็นเรื่องรองจากชีวิตมนุษย์
** Question 95** A security professional should report violations of a company's security policy to: Options: A the ISC2 ethics committee B company management C national authorities D a court of law Correct Option: B company management Keywords for Exam: security professional, report violations, company's security policy, responsible for enforcing policies Detailed Explanation:
คำอธิบายโดยละเอียด: การละเมิดนโยบายภายในของบริษัทควรรายงานผ่านช่องทางภายในที่เหมาะสม ซึ่งโดยทั่วไปคือฝ่ายบริหารของบริษัทซึ่งรับผิดชอบในการบังคับใช้
** Question 96** Which department in a company is not regularly involved in the hands-on processes of a DRP (Disaster Recovery Plan)? Options: A executives B IT C public relations D financial Correct Option: A executives Keywords for Exam: not regularly involved, DRP, hands-on processes Detailed Explanation:
คำอธิบายโดยละเอียด: ผู้บริหารมีหน้าที่อนุมัติและให้ทุนสนับสนุน DRP แต่โดยทั่วไปแล้วพวกเขาไม่ได้มีส่วนร่วมในการดำเนินการทางเทคนิคของแผน ความรับผิดชอบนั้นตกเป็นของทีมไอที, ความปลอดภัย และปฏิบัติการ
** Question 97** Which of the following is likely included in an SLA (Service Level Agreement) document? Options: A instructions on data ownership and destruction B a list of all company employees C the company's marketing plan D the source code of the provided service Correct Option: A instructions on data ownership and destruction Keywords for Exam: included in SLA, service level agreement, contract, data ownership and destruction Detailed Explanation:
คำอธิบายโดยละเอียด: SLA เป็นสัญญาที่กำหนดระดับการให้บริการ และมักจะรวมถึงข้อสำคัญเกี่ยวกับการจัดการข้อมูล เช่น ความเป็นเจ้าของ, ความรับผิดชอบด้านความปลอดภัย และขั้นตอนการทำลายเมื่อสิ้นสุดบริการ
** Question 98** What is the most important difference between MAC (Mandatory Access Control) and DAC (Discretionary Access Control)? Options: A MAC is more flexible than DAC B DAC is used by the military, while MAC is for commercial use C In MAC, the security administrator assigns access permissions, while in DAC, access permissions are set at the object owner's discretion D MAC uses roles, while DAC uses attributes Correct Option: C In MAC, the security administrator assigns access permissions, while in DAC, access permissions are set at the object owner's discretion Keywords for Exam: most important difference, MAC and DAC, who controls access permissions Detailed Explanation:
คำอธิบายโดยละเอียด: ความแตกต่างที่สำคัญคือการควบคุม: ใน MAC การเข้าถึงจะถูกควบคุมจากส่วนกลางโดยผู้ดูแลความปลอดภัยตามนโยบายทั่วทั้งระบบ ใน DAC เจ้าของทรัพยากรจะควบคุมว่าใครสามารถเข้าถึงได้
** Question 99** Requiring a specific user role to access resources is an example of: Options: A mandatory access control B attribute based access control C role based access control D discretionary access control Correct Option: C role based access control Keywords for Exam: requiring a specific user role, access resources, user's assigned role Detailed Explanation:
คำอธิบายโดยละเอียด: นี่คือนิยามของ Role-Based Access Control (RBAC) ซึ่งสิทธิ์จะถูกกำหนดให้กับบทบาท และผู้ใช้จะถูกกำหนดให้กับบทบาท
** Question 100** Which type of document outlines the procedures ensuring that vital company systems keep running during business disrupting events? Options: A business impact plan B business impact analysis C disaster recovery plan D business continuity plan Correct Option: D business continuity plan Keywords for Exam: outlines the procedures, vital company systems keep running, business disruption disrupting events, maintaining critical functions Detailed Explanation:
คำอธิบายโดยละเอียด: แผนความต่อเนื่องทางธุรกิจ (BCP) มุ่งเน้นไปที่การรักษาฟังก์ชันทางธุรกิจที่จำเป็นในระหว่างการหยุดชะงัก DRP ซึ่งเป็นส่วนย่อยของ BCP มุ่งเน้นไปที่การกู้คืนระบบไอทีโดยเฉพาะ
** Question 101** Which of the following is not a best practice in access management? Options: A give only the right amount of permission B periodically assess if user permissions still apply C request a justification when upgrading permission D trust but verify Correct Option: D trust but verify Keywords for Exam: not a best practice, access management, never trust and always verify Detailed Explanation:
คำอธิบายโดยละเอียด: หลักการความปลอดภัยสมัยใหม่ซึ่งเป็นหัวใจสำคัญของโมเดล Zero Trust คือ "ไม่ไว้วางใจ, ตรวจสอบเสมอ" (Never trust, always verify) ส่วน "ไว้วางใจแต่ตรวจสอบ" (Trust but verify) สื่อถึงระดับความไว้วางใจเบื้องต้นซึ่งไม่ถือเป็นแนวปฏิบัติที่ดีที่สุดในการจัดการการเข้าถึงที่ปลอดภัย
** Question 102** If a company collects PII (Personally Identifiable Information), which policy is required? Options: A remote access policy B GDPR C privacy policy D acceptable use policy Correct Option: C privacy policy Keywords for Exam: company collects PII, personally identifiable information, policy is required Detailed Explanation:
คำอธิบายโดยละเอียด: องค์กรใดก็ตามที่รวบรวม PII จะต้องมีนโยบายความเป็นส่วนตัวที่อธิบายอย่างชัดเจนว่าข้อมูลใดถูกรวบรวมและนำไปใช้, จัดเก็บ และปกป้องอย่างไร
** Question 103** Which of these is least likely to be installed by an infection? Options: A logic bomb B key logger C Trojan D back door Correct Option: A logic bomb Keywords for Exam: least likely to be installed by an infection, triggered by a specific condition or event Detailed Explanation:
คำอธิบายโดยละเอียด: Logic bomb คือโค้ดที่เป็นอันตรายซึ่งจะถูกกระตุ้นโดยเงื่อนไขเฉพาะ (เช่น วันที่หรือเหตุการณ์บางอย่าง) มักถูกวางโดยคนในและมีโอกาสน้อยที่จะถูกติดตั้งผ่านการติดเชื้อมัลแวร์ทั่วไปเมื่อเทียบกับคีย์ล็อกเกอร์หรือโทรจัน
** Question 104** The best defense method to stop a replay attack is to: Options: A use an IPSec VPN B use a firewall C use password authentication D use message digesting Correct Option: A use an IPSec VPN Keywords for Exam: best defense method, stop a replay attack, IPSec VPN, encryption and authentication, freshness of data Detailed Explanation:
คำอธิบายโดยละเอียด: IPSec มีการป้องกันการโจมตีแบบ Replay ในตัว โดยใช้หมายเลขลำดับเพื่อติดตามแพ็กเก็ตและรับรองว่าผู้โจมตีไม่สามารถจับและส่งแพ็กเก็ตที่ถูกต้องซ้ำได้
** Question 105** Which of these devices has the primary objective of determining the most efficient path for traffic to flow across the network? Options: A hubs B firewalls C routers D switches Correct Option: C routers Keywords for Exam: primary objective, determining the most efficient path, traffic to flow across the network, routing Detailed Explanation:
คำอธิบายโดยละเอียด: หน้าที่หลักของเราเตอร์คือการกำหนดเส้นทาง (routing): การกำหนดเส้นทางที่มีประสิทธิภาพที่สุดสำหรับแพ็กเก็ตข้อมูลที่จะเดินทางระหว่างเครือข่ายต่างๆ
** Question 106** Which of these types of malware self-replicates without the need for human intervention? Options: A worm B trojan C virus D rootkit Correct Option: A worm Keywords for Exam: types of malware, self-replicates, without the need for human intervention Detailed Explanation:
คำอธิบายโดยละเอียด: หนอน (Worm) เป็นมัลแวร์ชนิดหนึ่งที่สามารถจำลองตัวเองและแพร่กระจายผ่านเครือข่ายได้โดยอัตโนมัติโดยไม่ต้องมีการแทรกแซงจากมนุษย์ ไวรัสต้องการไฟล์โฮสต์และการกระทำของมนุษย์เพื่อแพร่กระจาย
** Question 107** As an ISC2 member, you are expected to perform with "due care". What does "due care" specifically mean? Options: A do what is right in each situation you encounter on the job B give continuity to the legacy of security practices of your company C apply patches annually D research and acquire the knowledge to do your job right Correct Option: A do what is right in each situation you encounter on the job Keywords for Exam: ISC2 member, due care, due diligence, reasonable caution, responsibility and diligence Detailed Explanation:
คำอธิบายโดยละเอียด: Due care คือการใช้ความระมัดระวังตามสมควรและทำในสิ่งที่บุคคลที่รอบคอบจะทำในสถานการณ์นั้นๆ (ตัวเลือก A) Due diligence คือการวิจัยและตรวจสอบที่จำเป็นในการตัดสินใจอย่างมีข้อมูล (ใกล้เคียงกับตัวเลือก D) คุณต้องทำ Due diligence เพื่อที่จะสามารถใช้ Due care ได้
** Question 108** During the investigation of an incident, which security policies are more likely to cause difficulties? Options: A configuration standards B incident response policies C communication policies D retention policies Correct Option: D retention policies Keywords for Exam: investigation of an incident, more likely to cause difficulties, data retention periods, critical evidence Detailed Explanation:
คำอธิบายโดยละเอียด: นโยบายการเก็บรักษาข้อมูลอาจทำให้เกิดปัญหาร้ายแรง หากนโยบายกำหนดให้ลบข้อมูล (เช่น ล็อก) เร็วเกินไป หลักฐานสำคัญสำหรับการสืบสวนอาจสูญหายได้
** Question 109** In an Access Control List (ACL), the element that determines which permissions you have is: Options: A the subject B the object C the firmware D the rule Correct Option: D the rule Keywords for Exam: ACL, Access Control List, element that determines, which permissions, rule specifies the action Detailed Explanation:
คำอธิบายโดยละเอียด: ACL ประกอบด้วยกฎ (หรือที่เรียกว่า Access Control Entries หรือ ACEs) แต่ละกฎจะระบุประธาน (ผู้ใช้/กลุ่ม), กรรม (ไฟล์/ทรัพยากร) และสิทธิ์ (อนุญาต/ปฏิเสธ) สำหรับการกระทำที่เฉพาะเจาะจง กฎคือองค์ประกอบที่กำหนดสิทธิ์
** Question 110** What does the term "data remnants" refer to? Options: A data in use that cannot be encrypted B files saved locally that cannot be accessed remotely C data left over after routine removal and deletion D all of the data in a system Correct Option: C data left over after routine removal and deletion Keywords for Exam: data remnants, residual data, remains on storage media, could potentially be recovered, security risk Detailed Explanation:
คำอธิบายโดยละเอียด: Data remnants (หรือข้อมูลตกค้าง) คือข้อมูลที่ยังคงอยู่บนสื่อบันทึกข้อมูลแม้หลังจากการลบไฟล์หรือการฟอร์แมตตามปกติแล้วก็ตาม
** Question 111** Which type of recovery site has some or more systems in place but does not have the data needed to take over operations? Options: A hot site B a cloud site C a warm site D a cold site Correct Option: C a warm site Keywords for Exam: recovery site, systems in place, does not have the data, takes some time to restore Detailed Explanation:
คำอธิบายโดยละเอียด: Warm site มีการเชื่อมต่อเครือข่ายและฮาร์ดแวร์ที่จำเป็น แต่ขาดข้อมูลล่าสุด ทำให้ต้องใช้เวลาในการกู้คืนข้อมูลและทำให้ไซต์ออนไลน์ Hot site พร้อมใช้งานเกือบจะในทันที และ Cold site เป็นเพียงสถานที่ว่างเปล่า
** Question 112** Which of these is not a characteristic of an MSP (Managed Service Provider) implementation? Options: A manage all in-house company infrastructure B monitor and respond to security incidents C mediate, execute, and decide top-level decisions D utilize expertise for the implementation of a product or service Correct Option: A manage all in-house company infrastructure Keywords for Exam: not a characteristic, MSP, Managed Service Provider, focus on specific areas Detailed Explanation:
คำอธิบายโดยละเอียด: โดยทั่วไป MSP จะจัดการฟังก์ชันที่เอาท์ซอร์สเฉพาะ (เช่น การตรวจสอบความปลอดภัยหรือบริการช่วยเหลือ) พวกเขามักจะไม่จัดการโครงสร้างพื้นฐานภายในบริษัททั้งหมด
** Question 113** Which of these is not a typical component of a comprehensive Business Continuity Plan (BCP)? Options: A a cost prediction of the immediate response procedures B immediate response procedures and checklists C notification systems and call trees for alerting personnel D a list of the BCP team members Correct Option: A a cost prediction of the immediate response procedures Keywords for Exam: not a typical component, comprehensive business continuity plan, BCP, prioritizes actionable strategies, not financial forecasting Detailed Explanation:
คำอธิบายโดยละเอียด: BCP มุ่งเน้นไปที่ขั้นตอน, รายการตรวจสอบ และแผนการสื่อสารที่สามารถดำเนินการได้เพื่อรักษาการดำเนินธุรกิจ การคาดการณ์ต้นทุนโดยละเอียดเป็นส่วนหนึ่งของการวิเคราะห์ทางธุรกิจโดยรวมและการวิเคราะห์ความเสี่ยง ไม่ใช่ส่วนประกอบทั่วไปของเอกสาร BCP
** Question 114** Acting ethically is mandatory for ISC2 members. Which of these is not considered unethical? Options: A disrupting the intended use of the internet B seeking to gain unauthorized access to resources on the internet C compromising the privacy of users D having fake social media profiles and accounts Correct Option: D having fake social media profiles and accounts Keywords for Exam: not considered unethical, ISC2 members, ethical canons violation Detailed Explanation:
คำอธิบายโดยละเอียด: แม้ว่าอาจเป็นการหลอกลวง การมีโปรไฟล์โซเชียลมีเดียปลอมไม่ได้เป็นการละเมิดหลักจรรยาบรรณของ ISC2 อย่างชัดเจน ซึ่งแตกต่างจากการรบกวนเครือข่าย, การเข้าถึงโดยไม่ได้รับอนุญาต หรือการละเมิดความเป็นส่วนตัว
** Question 115** In an incident response process, which phase uses Indicators of Compromise and log analysis as part of a review of events? Options: A preparation B eradication C identification D containment Correct Option: C identification Keywords for Exam: incident response process, phase uses, indicators of compromise, log analysis, review of events Detailed Explanation:
คำอธิบายโดยละเอียด: ขั้นตอนการระบุตัวตน (Identification) (ส่วนหนึ่งของขั้นตอนที่กว้างขึ้นคือ "การตรวจจับและวิเคราะห์") คือขั้นตอนที่ทีมวิเคราะห์เหตุการณ์, บันทึก และตัวชี้วัดการประนีประนอม (IoCs) เพื่อยืนยันว่ามีเหตุการณ์ด้านความปลอดภัยเกิดขึ้นหรือไม่และเพื่อระบุลักษณะของเหตุการณ์
** Question 116** Which of these access control systems is commonly used in the military? Options: A ABAC (Attribute-Based Access Control) B DAC (Discretionary Access Control) C RBAC (Role-Based Access Control) D MAC (Mandatory Access Control) Correct Option: D MAC (Mandatory Access Control) Keywords for Exam: access control systems, commonly used in the military, security classifications, centralized control Detailed Explanation:
คำอธิบายโดยละเอียด: Mandatory Access Control (MAC) มักใช้ในกองทัพและสภาพแวดล้อมที่มีความปลอดภัยสูงอื่นๆ เนื่องจากเป็นการบังคับใช้นโยบายความปลอดภัยทั่วทั้งระบบตามระดับการจำแนกประเภทที่ผู้ใช้ไม่สามารถเปลี่ยนแปลงได้
** Question 117** Which of these is not a security principle? Options: A security in depth B zero trust model C least privilege D separation of duties Correct Option: A security in depth Keywords for Exam: not a security principle, security in depth is not an established term, defense in depth Detailed Explanation:
คำอธิบายโดยละเอียด: "Defense in Depth" เป็นหลักการความปลอดภัยที่ถูกต้องและเป็นที่ยอมรับ "Security in Depth" ไม่ใช่คำศัพท์มาตรฐานและน่าจะเป็นตัวลวง Zero Trust, Least Privilege และ Separation of Duties ล้วนเป็นหลักการ/โมเดลความปลอดภัยที่ถูกต้อง
** Question 118** Which of these is not a common goal of a cyber security attacker? Options: A allocation B alteration C disclosure D denial Correct Option: A allocation Keywords for Exam: not a common goal, cyber security attacker, CIA triad Detailed Explanation:
คำอธิบายโดยละเอียด: เป้าหมายทั่วไปของผู้โจมตีสอดคล้องกับการประนีประนอม CIA triad: การเปิดเผย (Confidentiality), การเปลี่ยนแปลง (Integrity) และการปฏิเสธ (Availability) การจัดสรร (Allocation) ไม่ใช่เป้าหมายที่เป็นที่รู้จักของการโจมตี
** Question 119** Which of these layers is not part of the TCP/IP model? Options: A application B physical C internet D transport Correct Option: B physical Keywords for Exam: not part of TCP IP model, four layers, physical layer Detailed Explanation:
คำอธิบายโดยละเอียด: โมเดล TCP/IP มีสี่เลเยอร์: Application, Transport, Internet และ Network Access เลเยอร์ Physical เป็นส่วนหนึ่งของโมเดล OSI แต่ถูกรวมเข้ากับเลเยอร์ Network Access ในโมเดล TCP/IP
** Question 120** On a BYOD (Bring Your Own Device) model, which of these technologies is best suited to keep corporate data and applications separate from personal data? Options: A biometrics B full device encryption C context aware authentication D containerization Correct Option: D containerization Keywords for Exam: BYOD model, best suited, keep corporate data and applications separate from personal Detailed Explanation:
คำอธิบายโดยละเอียด: Containerization สร้างพื้นที่ทำงานที่ปลอดภัยและแยกออกจากกันบนอุปกรณ์ส่วนตัวสำหรับแอปและข้อมูลขององค์กร โดยแยกออกจากข้อมูลส่วนตัวของผู้ใช้อย่างมีประสิทธิภาพ
** Question 121** In the context of risk management, what information does ALE (Annualized Loss Expectancy) outline? Options: A the expected cost per year of not performing a given risk mitigation action B the total number of risks identified in a year C the cost of implementing a security control D the probability of a risk occurring in a given year Correct Option: A the expected cost per year of not performing a given risk mitigation action Keywords for Exam: ALE, Annualized Loss Expectancy, risk management metric, expected cost per year Detailed Explanation:
คำอธิบายโดยละเอียด: ALE (Annualized Loss Expectancy) เป็นตัวชี้วัดการจัดการความเสี่ยงที่ประมาณการความสูญเสียทางการเงินที่คาดว่าจะเกิดขึ้นจากความเสี่ยงเฉพาะในช่วงหนึ่งปี สูตรคือ ALE = SLE * ARO
** Question 122** Which of these techniques is primarily used to ensure data integrity? Options: A message digest B content encryption C backups D hashing Correct Option: D hashing Keywords for Exam: primarily used, data integrity, hash function, fixed size output, different hash value, not altered or corrupted Detailed Explanation:
คำอธิบายโดยละเอียด: การแฮชเป็นเทคนิคหลักในการรับรองความสมบูรณ์ของข้อมูล มันสร้างลายนิ้วมือดิจิทัลที่ไม่ซ้ำกัน (ค่าแฮช) ของข้อมูล หากข้อมูลเปลี่ยนแปลง ค่าแฮชจะเปลี่ยนแปลง ซึ่งบ่งชี้ถึงการสูญเสียความสมบูรณ์ Message digest คือผลลัพธ์ของฟังก์ชันแฮช
** Question 123** Which of these is an example of a privacy breach? Options: A any observable occurrence in a network or system B being exposed to the possibility of attack C unavailability of critical systems D access of private information by an unauthorized person Correct Option: D access of private information by an unauthorized person Keywords for Exam: privacy breach, private or personal information, accessed disclosed or used by someone who is not authorized Detailed Explanation:
คำอธิบายโดยละเอียด: การละเมิดความเป็นส่วนตัวคือการเข้าถึง, เปิดเผย หรือใช้ข้อมูลส่วนตัวหรือข้อมูลที่สามารถระบุตัวบุคคลได้โดยไม่ได้รับอนุญาต
** Question 124** What is a collection of fixes that are bundled together called? Options: A hotfix B patch C service pack D downgrade Correct Option: C service pack Keywords for Exam: collection of fixes, bundled together, single package, multiple patches and hotfixes Detailed Explanation:
คำอธิบายโดยละเอียด: Service pack คือชุดของการอัปเดต, การแก้ไข (แพตช์) และการปรับปรุงที่ส่งมอบเป็นแพ็คเกจที่สามารถติดตั้งได้เพียงครั้งเดียว
** Question 125** While performing background checks on new employees, which of these can never be an attribute for discrimination? Options: A references B education C political affiliation D employment history Correct Option: C political affiliation Keywords for Exam: background checks, new employees, never be an attribute for discrimination, political affiliation Detailed Explanation:
คำอธิบายโดยละเอียด: ในหลายเขตอำนาจศาล สังกัดทางการเมืองเป็นลักษณะที่ได้รับการคุ้มครอง และการใช้เป็นเกณฑ์ในการตัดสินใจจ้างงานถือเป็นการเลือกปฏิบัติที่ผิดกฎหมาย
** Question 126** What is the most important objective of a cyber security insurance policy? Options: A risk avoidance B risk transference C risk spreading D risk acceptance Correct Option: B risk transference Keywords for Exam: cyber security insurance, most important objective, transferring the financial burden, insurance company Detailed Explanation:
คำอธิบายโดยละเอียด: วัตถุประสงค์ของกรมธรรม์ประกันภัยใดๆ รวมถึงประกันความปลอดภัยทางไซเบอร์ คือการโอนความเสี่ยง: การโอนภาระทางการเงินของการสูญเสียที่อาจเกิดขึ้นไปยังบริษัทประกันภัย
** Question 127** Which kind of document outlines the procedures ensuring that vital company systems keep running during business disrupting events? Options: A business impact analysis B business impact plan C business continuity plan D disaster recovery plan Correct Option: C business continuity plan Keywords for Exam: document outlines the procedures, vital company systems keep running, business disrupting events, maintaining essential business functions Detailed Explanation:
คำอธิบายโดยละเอียด: นี่คือนิยามของแผนความต่อเนื่องทางธุรกิจ (BCP) ซึ่งมุ่งเน้นไปที่การรักษาฟังก์ชันทางธุรกิจที่จำเป็นให้ทำงานต่อไปในระหว่างที่เกิดการหยุดชะงัก
** Question 128** Which of these social engineering attacks sends emails that target specific individuals? Options: A pharming B whaling C vishing D spear phishing Correct Option: D spear phishing Keywords for Exam: social engineering attacks, sends emails, target specific individuals, personalized information Detailed Explanation:
คำอธิบายโดยละเอียด: Spear phishing คือการโจมตีทางอีเมลที่กำหนดเป้าหมายไปยังบุคคลหรือองค์กรที่เฉพาะเจาะจง โดยมักใช้ข้อมูลส่วนบุคคลเพื่อให้ดูน่าเชื่อถือมากขึ้น
** Question 129** Which of these properties is not guaranteed by a Message Authentication Code (MAC)? Options: A authenticity B anonymity C integrity D non-repudiation Correct Option: D non-repudiation Keywords for Exam: not guaranteed, Message Authentication Code (MAC), authenticity, integrity, does not provide non-repudiation Detailed Explanation:
คำอธิบายโดยละเอียด: MAC ให้การรับรองความถูกต้อง (หลักฐานของแหล่งกำเนิด) และความสมบูรณ์ของข้อมูล อย่างไรก็ตาม มันไม่ได้ให้การห้ามปฏิเสธความรับผิดชอบ (non-repudiation) เพราะคีย์สมมาตรถูกแชร์ระหว่างผู้ส่งและผู้รับ ทำให้ฝ่ายใดฝ่ายหนึ่งสามารถสร้าง MAC ได้ ลายเซ็นดิจิทัลให้การห้ามปฏิเสธความรับผิดชอบ
** Question 130** What is the primary objective of degaussing? Options: A protecting against side-channel attacks B reducing noise in data C erasing the data on a disk D archiving data Correct Option: C erasing the data on a disk Keywords for Exam: primary objective, degaussing, erase data on a disk, disrupting magnetic fields, magnetic storage devices Detailed Explanation:
คำอธิบายโดยละเอียด: Degaussing เป็นวิธีการทำลายข้อมูลที่ใช้สนามแม่เหล็กแรงสูงเพื่อลบข้อมูลออกจากสื่อบันทึกข้อมูลแบบแม่เหล็ก เช่น ฮาร์ดไดรฟ์และเทป อย่างสมบูรณ์และถาวร
** Question 131** Which of these is part of the ISC2 Code of Ethics canons? Options: A always prioritize the company's interest over the public B advance and protect the profession C share confidential information if it helps the company D use any means necessary to secure systems Correct Option: B advance and protect the profession Keywords for Exam: part of the canons, ISC2 code of ethics, advance and protect the profession Detailed Explanation:
คำอธิบายโดยละเอียด: "ส่งเสริมและปกป้องวิชาชีพ" เป็นหลักจรรยาบรรณข้อที่สี่ของ ISC2 Code of Ethics ตัวเลือกอื่น ๆ ผิดจรรยาบรรณ
** Question 132** Which of these is not one of the ISC2 ethics canons? Options: A protect society and the common good B act honorably, honestly, and legally C consider the social consequences of the system you are designing D provide diligent and competent service to principles Correct Option: C consider the social consequences of the system you are designing Keywords for Exam: not one of the ISC2 ethics cannons, ethical consideration, not an official canon Detailed Explanation:
คำอธิบายโดยละเอียด: ในขณะที่การพิจารณาผลกระทบทางสังคมของงานของตนเป็นข้อพิจารณาทางจริยธรรมที่สำคัญ แต่มันไม่ใช่หนึ่งในสี่หลักจรรยาบรรณอย่างเป็นทางการของ ISC2 Code of Ethics
** Question 133** What is the primary objective of the PCI-DSS standard? Options: A securing Personally Identifiable Information (PII) B securing change management processes C securing credit card payments D securing Protected Health Information (PHI) Correct Option: C secure credit card payments Keywords for Exam: primary objective, PCI-DSS standard, Payment Card Industry Data Security Standard, securing the credit card payments Detailed Explanation:
คำอธิบายโดยละเอียด: PCI-DSS (Payment Card Industry Data Security Standard) เป็นชุดมาตรฐานความปลอดภัยที่ออกแบบมาเพื่อให้แน่ใจว่าบริษัททั้งหมดที่รับ, ประมวลผล, จัดเก็บ หรือส่งข้อมูลบัตรเครดิตรักษาสภาพแวดล้อมที่ปลอดภัย
** Question 134** Which of these is an attack that encrypts an organization's information and then demands payment for the decryption code? Options: A phishing B denial of service C trojan D ransomware Correct Option: D ransomware Keywords for Exam: attack, encrypts the organization information, demands payment for the decryption code Detailed Explanation:
คำอธิบายโดยละเอียด: นี่คือนิยามของการโจมตีด้วยแรนซัมแวร์
** Question 135** The primary objective of a business continuity plan is to: Options: A restore IT systems after a disaster B maintain business operations during a disaster C identify critical business assets D test the disaster recovery plan Correct Option: B maintain business operation during a disaster Keywords for Exam: primary objective, business continuity plan, maintain business operation, during a disaster, minimize disruptions, ensure essential functions continue Detailed Explanation:
คำอธิบายโดยละเอียด: วัตถุประสงค์หลักของ BCP คือการรักษาการดำเนินธุรกิจที่จำเป็นในระหว่างเกิดภัยพิบัติ การกู้คืนระบบไอที (A) เป็นเป้าหมายของ DRP ซึ่งเป็นส่วนหนึ่งของ BCP โดยรวม
** Question 136** Which of these is an attack whose primary goal is to gain access to a target system through a falsified identity? Options: A sniffing B man-in-the-middle C spoofing D denial of service Correct Option: C spoofing Keywords for Exam: attack, primary goal, gain access to a target system, falsified identity, impersonating another user or system Detailed Explanation:
คำอธิบายโดยละเอียด: การปลอมแปลง (Spoofing) คือการโจมตีที่ผู้โจมตีแอบอ้างเป็นผู้ใช้, อุปกรณ์ หรือระบบอื่นเพื่อเข้าถึงโดยไม่ได้รับอนุญาตหรือหลอกลวงเป้าหมาย
** Question 137** When an incident occurs, which of these is not a primary responsibility of an organization's response team? Options: A determining the scope of the damage B executing recovery procedures C determining what, if any, confidential information was compromised D communicating with top management regarding the circumstances of the cyber security event Correct Option: D communicating with top management regarding the circumstances of the cyber security event Keywords for Exam: not primary responsibility, organization's response team, communicating with top management, incident reporting or public relation teams Detailed Explanation:
คำอธิบายโดยละเอียด: ทีมรับมือเหตุการณ์ทางเทคนิคมีหน้าที่รับผิดชอบงานภาคปฏิบัติในการจำกัดขอบเขต, กำจัด และกู้คืน (A, B, C) การสื่อสารกับผู้บริหารระดับสูงโดยทั่วไปเป็นความรับผิดชอบของผู้จัดการการรับมือเหตุการณ์หรือทีมสื่อสาร/ประชาสัมพันธ์ที่แยกต่างหาก
** Question 138** What is the primary objective of a rollback in the context of the change management process? Options: A to apply a new patch to the system B to document the changes made C restore the system to its last state before the change was made D to approve the change request Correct Option: C restore the system to its last state before the change was made Keywords for Exam: primary objective, roll back, change management process, restore the system to its previous stable state Detailed Explanation:
คำอธิบายโดยละเอียด: วัตถุประสงค์ของแผนการย้อนกลับคือการคืนค่าระบบกลับสู่สถานะที่ดีล่าสุดที่ทราบ หากการเปลี่ยนแปลงล้มเหลวหรือทำให้เกิดปัญหาที่ไม่คาดคิด
** Question 139** Which of these entities is responsible for signing an organization's policies? Options: A HR department B legal department C IT department D senior management Correct Option: D senior management Keywords for Exam: responsible for signing, organization's policies, authority to approve and enforce Detailed Explanation:
คำอธิบายโดยละเอียด: ผู้บริหารระดับสูงมีความรับผิดชอบและอำนาจสูงสุดต่อนโยบายขององค์กร ดังนั้นพวกเขาจึงเป็นผู้ที่ต้องอนุมัติและลงนามอย่างเป็นทางการ
** Question 140** Which of these terms refer to a threat with unusually high technical and operational sophistication spanning months or even years? Options: A rootkit B APT (Advanced Persistent Threat) C side channel attack D ping of death Correct Option: B APT (Advanced Persistent Threat) Keywords for Exam: threat, unusually high technical and operational sophistication, spanning months or even years, long-term access, stealthy Detailed Explanation:
คำอธิบายโดยละเอียด: นี่คือนิยามของ Advanced Persistent Threat (APT) ซึ่งเป็นการโจมตีที่ซับซ้อน, ยาวนาน และมีเป้าหมาย ซึ่งมักได้รับการสนับสนุนจากรัฐ
** Question 141** The primary objective of a security baseline is to establish: Options: A the maximum possible security for a system B a minimum understood and acceptable level of security requirements C a list of all vulnerabilities in a system D a process for daily security audits Correct Option: B a minimum understood and acceptable level of security requirements Keywords for Exam: primary objective, security baseline, minimum understood and acceptable level of security requirements, consistency across the organization Detailed Explanation:
คำอธิบายโดยละเอียด: เกณฑ์มาตรฐานความปลอดภัย (Security baseline) กำหนดระดับความปลอดภัยขั้นต่ำมาตรฐานที่ต้องนำไปใช้อย่างสม่ำเสมอในทุกระบบที่คล้ายคลึงกันในองค์กร
** Question 142** Which of these attacks take advantage of poor input validation in websites? Options: A trojans B denial of service C cross-site scripting D man-in-the-middle Correct Option: C cross-site scripting Keywords for Exam: attacks, take advantage of, poor input validation, websites, inject malicious scripts Detailed Explanation:
คำอธิบายโดยละเอียด: Cross-site scripting (XSS) เป็นการโจมตีแบบฉีดชนิดหนึ่งที่สคริปต์ที่เป็นอันตรายถูกฉีดเข้าไปในเว็บไซต์ที่ไม่เป็นอันตรายและน่าเชื่อถือเนื่องจากการตรวจสอบอินพุตที่ไม่ดี
** Question 143** An organization needs a network security tool that detects and acts in the event of malicious activity. Which of these tools will best meet their needs? Options: A router B IPS (Intrusion Prevention System) C IDS (Intrusion Detection System) D firewall Correct Option: B IPS (Intrusion Prevention System) Keywords for Exam: network security tool, detects and acts, malicious activity, actively takes action to block or mitigate Detailed Explanation:
คำอธิบายโดยละเอียด: IDS ตรวจจับและแจ้งเตือนเท่านั้น IPS (Intrusion Prevention System) ทั้งตรวจจับกิจกรรมที่เป็นอันตรายและดำเนินการอย่างแข็งขันเพื่อบล็อก
** Question 144** According to the DAC (Discretionary Access Control) policy, which of these operations can only be performed by the information owner? Options: A reading information B executing information C modifying information D modifying security attributes Correct Option: D modifying security attributes Keywords for Exam: DAC, Discretionary Access Control, performed by the owner of the information Detailed Explanation:
คำอธิบายโดยละเอียด: ภายใต้ DAC เจ้าของวัตถุมีสิทธิ์ในการควบคุมสิทธิ์ของตน ซึ่งรวมถึงการแก้ไขแอตทริบิวต์ความปลอดภัย (เช่น ACL) สำหรับวัตถุนั้น ผู้ใช้อื่นอาจได้รับสิทธิ์อ่าน/เขียน/ดำเนินการ แต่มีเพียงเจ้าของเท่านั้นที่สามารถเปลี่ยนแปลงสิทธิ์เหล่านั้นได้
** Question 145** In the event of non-compliance, which of these can have considerable financial consequences for an organization? Options: A policies B regulations C standards D procedures Correct Option: B regulations Keywords for Exam: non-compliance, considerable financial consequences, legally enforceable rules, fines and penalties Detailed Explanation:
คำอธิบายโดยละเอียด: กฎระเบียบมีผลบังคับใช้ตามกฎหมาย และการไม่ปฏิบัติตามอาจนำไปสู่ค่าปรับและบทลงโทษที่สำคัญจากหน่วยงานกำกับดูแล
** Question 146** What does the term LAN (Local Area Network) refer to? Options: A a network that spans a large city B a network in a building or limited geographical area C the global network of computers D a private network that uses public infrastructure Correct Option: B a network in a building or limited geographical area Keywords for Exam: LAN, local area network, limited geographical area, building office or campus Detailed Explanation:
คำอธิบายโดยละเอียด: LAN คือเครือข่ายที่จำกัดอยู่ในพื้นที่ทางภูมิศาสตร์ขนาดเล็ก เช่น อาคาร, สำนักงาน หรือวิทยาเขตเดียว
** Question 147** Which of these is a type of corrective security control? Options: A patches B encryption C IDS D backups Correct Option: D backups Keywords for Exam: type of corrective security controls, fix vulnerabilities or mitigate the impact, after it has occurred Detailed Explanation:
คำอธิบายโดยละเอียด: การควบคุมเชิงแก้ไข (Corrective controls) ใช้เพื่อแก้ไขปัญหาหลังจากเกิดเหตุการณ์ขึ้น การกู้คืนจากข้อมูลสำรองเป็นตัวอย่างที่สำคัญของการควบคุมเชิงแก้ไข แพตช์ก็สามารถมองได้ว่าเป็นการแก้ไขเช่นกัน เนื่องจากเป็นการแก้ไขช่องโหว่ที่ถูกตรวจพบ ระหว่างสองอย่างนี้ การสำรองข้อมูลเป็นการแก้ไขที่บริสุทธิ์กว่า ในขณะที่แพตช์สามารถเป็นการป้องกันได้ด้วย
** Question 148** Which of these enables point-to-point online communication over an untrusted network? Options: A router B switch C LAN D VPN Correct Option: D VPN Keywords for Exam: enables point-to-point online communication, untrusted network, encryption and tunneling protocols, privacy and security Detailed Explanation:
คำอธิบายโดยละเอียด: VPN (Virtual Private Network) สร้างอุโมงค์ที่ปลอดภัยและเข้ารหัสสำหรับการสื่อสารแบบจุดต่อจุดผ่านเครือข่ายสาธารณะที่ไม่น่าเชื่อถือเช่นอินเทอร์เน็ต
** Question 149** At which of the OSI layers do TCP and UDP work? Options: A transport layer B network layer C data link layer D application layer Correct Option: A transport layer Keywords for Exam: OSI layer, TCP and UDP work, reliable and unreliable data transmission Detailed Explanation:
คำอธิบายโดยละเอียด: TCP และ UDP เป็นโปรโตคอลหลักของ Transport Layer (Layer 4) ของโมเดล OSI ซึ่งรับผิดชอบการส่งข้อมูลแบบ end-to-end
** Question 150** What is the primary focus of the ISO/IEC 27002 standard? Options: A detailed technical specifications for encryption algorithms B code of practice for information security controls C legal requirements for data breach notifications D financial auditing procedures Correct Option: B code of practice for information security controls Keywords for Exam: primary focus, ISO 27002 standard, Information Security Management System (ISMS), guidelines and best practices, manage risk effectively Detailed Explanation:
คำอธิบายโดยละเอียด: ISO/IEC 27002 ให้แนวปฏิบัติพร้อมคำแนะนำและแนวปฏิบัติที่ดีที่สุดสำหรับการนำมาตรการควบคุมความปลอดภัยของข้อมูลไปใช้ตามกรอบที่กำหนดไว้ใน ISO/IEC 27001
** Question 151** Which of these subnet masks will allow for 30 hosts? Options: A /30 B /29 C /27 D /26 Correct Option: C /27 Keywords for Exam: subnet masks, allow 30 host, calculate number of hosts, 2^n - 2 Detailed Explanation:
คำอธิบายโดยละเอียด: ในการหาจำนวนโฮสต์ ให้ใช้สูตร 2^n - 2 โดยที่ n คือจำนวนบิตของโฮสต์ สำหรับซับเน็ต /27 จะมีบิตโฮสต์ 32 - 27 = 5 บิต ดังนั้น 2^5 - 2 = 32 - 2 = 30 โฮสต์
** Question 152** Which of these statements about the security implications of IP version 6 is not true? Options: A IPv6 traffic could bypass IPv4 security controls B IPv6 NAT implementation is insecure C IPv6 static address filtering rules may not apply D IPv6 reputation services are less common Correct Option: B IPv6 NAT implementation is insecure Keywords for Exam: not true, security implications of IPv6, IPv6 does not include NAT Detailed Explanation:
คำอธิบายโดยละเอียด: ข้อความ "การใช้งาน NAT ของ IPv6 ไม่ปลอดภัย" ไม่เป็นความจริง เพราะ IPv6 ถูกออกแบบมาให้มีพื้นที่ที่อยู่ขนาดใหญ่เพื่อทำให้ NAT (Network Address Translation) ไม่จำเป็น IPv6 ไม่มี NAT
** Question 153** Which of these is a detective security control? Options: A bollards B movement sensors C turnstiles D firewalls Correct Option: B movement sensors Keywords for Exam: detective security control, identifies and alerts, security breach has occurred, does not prevent it Detailed Explanation:
คำอธิบายโดยละเอียด: การควบคุมแบบตรวจจับ (Detective controls) ถูกออกแบบมาเพื่อตรวจจับและแจ้งเตือนเกี่ยวกับเหตุการณ์ความปลอดภัย เซ็นเซอร์ตรวจจับความเคลื่อนไหวจะตรวจจับการปรากฏตัวทางกายภาพที่ไม่ได้รับอนุญาต ดังนั้นจึงเป็นการควบคุมแบบตรวจจับ
** Question 154** The name, age, location, and job title of a person are examples of: Options: A biometrics B attributes C PII D credentials Correct Option: B attributes Keywords for Exam: name age and location, job title, examples of, characteristics Detailed Explanation:
คำอธิบายโดยละเอียด: ชื่อ, อายุ, สถานที่ และตำแหน่งงานล้วนเป็นลักษณะเฉพาะ หรือคุณลักษณะ (attributes) ของบุคคล เมื่อรวมกันอาจกลายเป็น PII (ข้อมูลที่สามารถระบุตัวบุคคลได้)
** Question 155** Which of these cloud service models is the most suitable environment for customers that want to install their custom operating systems? Options: A PaaS (Platform as a Service) B SaaS (Software as a Service) C IaaS (Infrastructure as a Service) D FaaS (Function as a Service) Correct Option: C IaaS (Infrastructure as a Service) Keywords for Exam: cloud service model, most suitable environment, install their custom operating systems, control over the VMs Detailed Explanation:
คำอธิบายโดยละเอียด: IaaS (Infrastructure as a Service) ให้การควบคุมมากที่สุด ทำให้ลูกค้าสามารถจัดเตรียมเครื่องเสมือนและติดตั้งระบบปฏิบัติการที่กำหนดเองได้
** Question 156** Which of these is an illegal practice that involves registering a domain name with the intent of profiting from someone else's trademark? Options: A typosquatting B brandjacking C cybersquatting D domain flipping Correct Option: C cybersquatting Keywords for Exam: cyber squatting, illegal practice, trademark, profiting from someone else's trademark Detailed Explanation:
คำอธิบายโดยละเอียด: Cybersquatting คือการจดทะเบียนชื่อโดเมนที่มีเครื่องหมายการค้าของผู้อื่นโดยไม่สุจริต โดยมีเจตนาที่จะหากำไรจากมัน
** Question 157** Which of these addresses is commonly reserved specifically for broadcasting inside a /24 subnet? Options: A 192.168.1.0 B 192.168.1.1 C 192.168.1.128 D 192.168.1.255 Correct Option: D 192.168.1.255 Keywords for Exam: addresses, commonly reserved, specifically for broadcasting, last address inside a subnet Detailed Explanation:
คำอธิบายโดยละเอียด: ในซับเน็ตใดๆ ที่อยู่ IP สุดท้ายจะถูกสงวนไว้เป็นที่อยู่สำหรับแพร่กระจาย (broadcast address) สำหรับเครือข่าย /24 (เช่น 192.168.1.0 ถึง 192.168.1.255) ที่อยู่สำหรับแพร่กระจายคือ 192.168.1.255
** Question 158** Which department in a company is not typically involved in the technical execution of a Disaster Recovery Plan (DRP)? Options: A IT B Public Relations C Security Operations D Financial Correct Option: D Financial Keywords for Exam: not typically involved, disaster recovery plan, DRP, technical execution Detailed Explanation:
คำอธิบายโดยละเอียด: ฝ่ายการเงินมีความสำคัญต่อการจัดทำงบประมาณและประเมินผลกระทบทางการเงินของภัยพิบัติ แต่พวกเขาไม่ได้มีส่วนร่วมในการดำเนินการทางเทคนิคในการกู้คืนระบบ นั่นคือบทบาทของฝ่ายไอทีและปฏิบัติการความปลอดภัย
** Question 159** Which of these pairs does not constitute multi-factor authentication? Options: A password and fingerprint B smart card and PIN C password and username D OTP token and password Correct Option: C password and username Keywords for Exam: not constitute multifactor authentication, multi-factor, more than one factor, same type of authentication factor Detailed Explanation:
คำอธิบายโดยละเอียด: การยืนยันตัวตนแบบหลายปัจจัยต้องการปัจจัยจากหมวดหมู่ที่แตกต่างกันอย่างน้อยสองหมวดหมู่ (รู้, มี, เป็น) รหัสผ่านและชื่อผู้ใช้มาจากหมวดหมู่ "สิ่งที่คุณรู้" ทั้งคู่ ดังนั้นจึงเป็นการยืนยันตัวตนแบบปัจจัยเดียว
** Question 160** What is the main use of a ping sweep? Options: A to measure network bandwidth B to analyze packet contents C to discover live hosts D to crack passwords Correct Option: C to discover live hosts Keywords for Exam: main use, ping sweep, discover live hosts, network scanning technique, identify active devices Detailed Explanation:
คำอธิบายโดยละเอียด: Ping sweep เป็นเทคนิคการสแกนเครือข่ายที่ใช้เพื่อค้นหาว่าโฮสต์ใดกำลังทำงานอยู่ (live) ในเครือข่ายโดยการส่งคำขอ ICMP echo ไปยังช่วงของที่อยู่ IP
** Question 161** A poster reminding employees about best password management practices is an example of which type of learning activity? Options: A awareness B training C education D tutorial Correct Option: A awareness Keywords for Exam: poster reminding, best password management practice, example of, learning activity, engaging a user's attention, security conscious culture Detailed Explanation:
คำอธิบายโดยละเอียด: โปสเตอร์, จดหมายข่าว และการแจ้งเตือนสั้นๆ เป็นเครื่องมือสำหรับการสร้างความตระหนักด้านความปลอดภัย ซึ่งออกแบบมาเพื่อให้ความปลอดภัยอยู่ในใจและเสริมสร้างวัฒนธรรมที่ใส่ใจในความปลอดภัย
** Question 162** In the context of the CIA Triad, which part is primarily jeopardized in a Distributed Denial of Service (DDoS) attack? Options: A confidentiality B availability C integrity D non-repudiation Correct Option: B availability Keywords for Exam: CIA triad, primarily jeopardized, distributed denial of service attack, inaccessible, compromise availability Detailed Explanation:
คำอธิบายโดยละเอียด: เป้าหมายหลักของการโจมตี DDoS คือการท่วมท้นบริการด้วยทราฟฟิก ทำให้ผู้ใช้ที่ถูกต้องไม่สามารถใช้งานได้ ซึ่งเป็นการทำลายความพร้อมใช้งาน (Availability)
** Question 163** What is the main purpose of motion detection in security cameras? Options: A to improve video resolution B to reduce video storage space C to enable night vision D to track moving objects with AI Correct Option: B to reduce video storage space Keywords for Exam: main purpose, motion detection, security cameras, reduce video storage space, records only when motion is detected Detailed Explanation:
คำอธิบายโดยละเอียด: วัตถุประสงค์หลักของการตรวจจับความเคลื่อนไหวคือการประหยัดพื้นที่จัดเก็บวิดีโออย่างมีนัยสำคัญโดยการบันทึกภาพเฉพาะเมื่อตรวจพบการเคลื่อนไหวเท่านั้น แทนที่จะบันทึกอย่างต่อเนื่อง
** Question 164** An organization that uses a layered approach when designing its security architecture is using which of these security approaches? Options: A zero trust B defense in depth C security through obscurity D access control models Correct Option: B defense in depth Keywords for Exam: layered approach, security architecture, security approaches, different layers of security controls Detailed Explanation:
คำอธิบายโดยละเอียด: แนวทางความปลอดภัยแบบชั้นๆ ที่มีการควบคุมหลายอย่างวางไว้ทั่วทั้งระบบ คือนิยามของหลักการความปลอดภัย Defense in Depth
** Question 165** Which of these techniques ensures the property of non-repudiation? Options: A hashing B encryption C digital signatures D symmetric keys Correct Option: C digital signatures Keywords for Exam: techniques, ensure the property of non-repudiation, cannot later deny, digital signatures Detailed Explanation:
คำอธิบายโดยละเอียด: ลายเซ็นดิจิทัลที่สร้างขึ้นด้วยคีย์ส่วนตัวของผู้ใช้ให้การห้ามปฏิเสธความรับผิดชอบ (non-repudiation) เพราะมีเพียงผู้ใช้คนนั้นเท่านั้นที่สามารถสร้างลายเซ็นได้ ซึ่งป้องกันไม่ให้พวกเขาปฏิเสธในภายหลัง
** Question 166** A USB pen with data passed around the office is an example of: Options: A data in use B data at rest C data in motion D data in transit Correct Option: B data at rest Keywords for Exam: USB pen with data, stored data, resides on storage media Detailed Explanation:
คำอธิบายโดยละเอียด: ข้อมูลที่จัดเก็บไว้ในสื่อบันทึกข้อมูลใดๆ เช่น ไดรฟ์ USB, ฮาร์ดไดรฟ์ หรือเทปสำรองข้อมูล ถือเป็นข้อมูลที่พัก (data at rest)
** Question 167** Suppose that an organization wants to implement measures to strengthen its detective access controls. Which one of these tools should they implement? Options: A patches B encryption C IDS (Intrusion Detection System) D backups Correct Option: C IDS (Intrusion Detection System) Keywords for Exam: detective access controls, tool, implement, monitors network traffic, alerts on suspicious activity Detailed Explanation:
คำอธิบายโดยละเอียด: IDS (Intrusion Detection System) เป็นการควบคุมแบบตรวจจับ วัตถุประสงค์ของมันคือการตรวจสอบกิจกรรมของเครือข่ายหรือระบบเพื่อหากิจกรรมที่เป็นอันตรายหรือการละเมิดนโยบายและสร้างรายงานไปยังสถานีจัดการ
** Question 168** Which of these is an example of a MAC (Media Access Control) address? Options: A 192.168.1.1 B 00:0a:95:9d:68:16 C 2001:0db8:85a3:0000:0000:8a2e:0370:7334 D www.example.com Correct Option: B 00:0a:95:9d:68:16 Keywords for Exam: example of a MAC address, six groups of two hexadecimal digits, separated by colons or hyphens Detailed Explanation:
คำอธิบายโดยละเอียด: ที่อยู่ MAC เป็นที่อยู่ฮาร์ดแวร์ 48 บิตที่แสดงเป็นหกกลุ่มของเลขฐานสิบหกสองหลัก คั่นด้วยเครื่องหมายโคลอนหรือขีดกลาง
** Question 169** Which of these types of credentials is not used in multi-factor authentication? Options: A something you know B something you are C something you have D something you trust Correct Option: D something you trust Keywords for Exam: not used in multifactor authentication, authentication factors, something you know, something you are, something you have Detailed Explanation:
คำอธิบายโดยละเอียด: หมวดหมู่ของปัจจัยการยืนยันตัวตนที่เป็นที่ยอมรับสามประเภทคือ: สิ่งที่คุณรู้ (เช่น รหัสผ่าน), สิ่งที่คุณมี (เช่น โทเค็น) และสิ่งที่คุณเป็น (เช่น ลายนิ้วมือ) "สิ่งที่คุณไว้วางใจ" ไม่ใช่หมวดหมู่มาตรฐาน
** Question 170** In an incident response team, who is the main conduit to senior management? Options: A incident response manager B legal counsel C technical lead D human resources Correct Option: A incident response manager Keywords for Exam: incident response team, main conduit to senior management, communication, decisions Detailed Explanation:
คำอธิบายโดยละเอียด: ผู้จัดการการรับมือเหตุการณ์มีหน้าที่รับผิดชอบในการนำทีม, ประสานงาน และทำหน้าที่เป็นจุดติดต่อหลักสำหรับการสื่อสารกับผู้บริหารระดับสูง
** Question 171** Which of these is not an effective way to protect an organization from cyber criminals? Options: A removing unnecessary services and protocols B using a firewall C using outdated antimalware software D using an intrusion detection system Correct Option: C using outdated antimalware software Keywords for Exam: not an effective way, protect, cyber criminals, outdated antimalware software, new threats emerge daily Detailed Explanation:
คำอธิบายโดยละเอียด: การใช้ซอฟต์แวร์ป้องกันมัลแวร์ที่ล้าสมัยไม่มีประสิทธิภาพเนื่องจากมีภัยคุกคามใหม่ๆ เกิดขึ้นทุกวัน และซอฟต์แวร์ที่ไม่ได้รับการอัปเดตจะไม่มีลายเซ็นหรือฮิวริสติกในการตรวจจับ
** Question 172** Which of these cannot be a corrective security control? Options: A antivirus software B backup and restore systems C patches D CCTV cameras Correct Option: D CCTV cameras Keywords for Exam: cannot be a corrective security control, corrective controls fix or mitigate, after an incident Detailed Explanation:
คำอธิบายโดยละเอียด: การควบคุมเชิงแก้ไขจะแก้ไขหรือบรรเทาปัญหาหลังจากเกิดเหตุการณ์ขึ้น โปรแกรมป้องกันไวรัสสามารถกำจัดการติดเชื้อ, ข้อมูลสำรองสามารถกู้คืนข้อมูล และแพตช์สามารถแก้ไขช่องโหว่ได้ กล้องวงจรปิดเป็นการควบคุมแบบตรวจจับและยับยั้ง ไม่สามารถแก้ไขปัญหาได้
** Question 173** Which of these is included in an SLA (Service Level Agreement) document? Options: A instructions on data ownership and destruction B the company's annual financial report C employee vacation schedules D marketing strategies Correct Option: A instructions on data ownership and destruction Keywords for Exam: included in SLA, service level agreement, contract, data ownership handling and destruction Detailed Explanation:
คำอธิบายโดยละเอียด: SLA กำหนดเงื่อนไขของบริการ ซึ่งรวมถึงตัวชี้วัดเช่น เวลาทำงานและความพร้อมใช้งาน ตลอดจนความรับผิดชอบในการจัดการ, ความเป็นเจ้าของ และการทำลายข้อมูล
** Question 174** Which of these is the standard port for SSH (Secure Shell)? Options: A 80 B 443 C 25 D 22 Correct Option: D 22 Keywords for Exam: standard port, SSH, secure shell, encrypted network protocol Detailed Explanation:
คำอธิบายโดยละเอียด: พอร์ต 22 เป็นพอร์ต TCP มาตรฐานสำหรับโปรโตคอล Secure Shell (SSH)
** Question 175** Which type of attack attempts to mislead a user into exposing personal information by sending a fraudulent email? Options: A denial of service B ransomware C trojan D phishing Correct Option: D phishing Keywords for Exam: attack, mislead user, exposing personal information, fraudulent email, deceptive emails Detailed Explanation:
คำอธิบายโดยละเอียด: นี่คือนิยามของการโจมตีแบบฟิชชิ่ง
** Question 176** Which of these is not a characteristic of the cloud? Options: A zero customer responsibility B on-demand self-service C resource pooling D rapid elasticity Correct Option: A zero customer responsibility Keywords for Exam: not a characteristic of the cloud, shared responsibility model, customers and cloud providers share security and operational responsibilities Detailed Explanation:
คำอธิบายโดยละเอียด: บริการคลาวด์ทำงานภายใต้โมเดลความรับผิดชอบร่วมกัน ลูกค้ามีความรับผิดชอบบางอย่างเสมอ โดยเฉพาะอย่างยิ่งสำหรับข้อมูลและการเข้าถึงของผู้ใช้ "ความรับผิดชอบของลูกค้าเป็นศูนย์" ไม่ถูกต้อง
** Question 177** Which of these is a common mistake made when implementing record retention policies? Options: A destroying records too soon B keeping records for too long C applying the longest retention periods to all information D not having a retention policy at all Correct Option: C applying the longest retention periods to all information Keywords for Exam: common mistake, record retention policies, applying the longest retention periods indiscriminately, unnecessary storage cost, inefficiency, legal or compliance risk Detailed Explanation:
คำอธิบายโดยละเอียด: การใช้ระยะเวลาการเก็บรักษาที่ยาวนานเกินไปกับข้อมูลทั้งหมดเป็นข้อผิดพลาดทั่วไป ซึ่งนำไปสู่ค่าใช้จ่ายในการจัดเก็บที่ไม่จำเป็นและอาจเพิ่มความเสี่ยงทางกฎหมายและความรับผิด (ค่าใช้จ่าย eDiscovery) ควรจำแนกประเภทข้อมูลและมีระยะเวลาการเก็บรักษาที่เหมาะสมกับประเภทของมัน
** Question 178** Which type of security control does not include CCTV cameras? Options: A corrective B deterrent C preventive D detective Correct Option: A corrective Keywords for Exam: not include CCTV cameras, type of security control, corrective control, fix or mitigate the effect after it has occurred Detailed Explanation:
คำอธิบายโดยละเอียด: กล้องวงจรปิดทำหน้าที่เป็นเครื่องยับยั้ง, ป้องกัน (หากมีการตรวจสอบสด) และควบคุมการตรวจจับ ไม่ใช่การแก้ไข เนื่องจากไม่สามารถแก้ไขความเสียหายหลังจากเกิดเหตุการณ์ขึ้นได้
** Question 179** Which of these privacy and data protection regulations focuses primarily on securing PHI (Protected Health Information)? Options: A GDPR B HIPAA C PCI-DSS D SOX Correct Option: B HIPAA Keywords for Exam: privacy and data protection regulation, focus primarily on securing PHI, protected health information, healthcare data Detailed Explanation:
คำอธิบายโดยละเอียด: HIPAA (Health Insurance Portability and Accountability Act) เป็นกฎหมายของรัฐบาลกลางสหรัฐฯ ที่มุ่งเน้นการปกป้องข้อมูลสุขภาพที่ได้รับการคุ้มครอง (PHI)
** Question 180** Which of these cloud deployment models is a combination of public and private cloud storage? Options: A public B private C hybrid D community Correct Option: C hybrid Keywords for Exam: cloud deployment models, combination of public and private cloud storage, flexibility, scalability Detailed Explanation:
คำอธิบายโดยละเอียด: คลาวด์แบบไฮบริดเป็นสภาพแวดล้อมที่รวมคลาวด์สาธารณะและคลาวด์ส่วนตัวเข้าด้วยกัน ทำให้สามารถแบ่งปันข้อมูลและแอปพลิเคชันระหว่างกันได้
** Question 181** What is the primary goal of a change management policy? Options: A to ensure all changes are approved by the CEO B to prevent any changes from being made to the system C ensure that system changes are performed systematically without negatively affecting business operations D to document changes only after they have been implemented Correct Option: C ensure that system changes are performed systematically without negatively affecting business operations Keywords for Exam: primary goal, change management policy, system changes, without negatively affecting business operations, minimize disruptions and risks Detailed Explanation:
คำอธิบายโดยละเอียด: เป้าหมายของการจัดการการเปลี่ยนแปลงคือเพื่อให้แน่ใจว่าการเปลี่ยนแปลงจะทำในลักษณะที่มีการควบคุมและเป็นระบบเพื่อลดความเสี่ยงและผลกระทบเชิงลบต่อการดำเนินธุรกิจ
** Question 182** Which of these is not a feature of a SIEM (Security Information and Event Management) tool? Options: A log collection B log analysis C log retention D log encryption Correct Option: D log encryption Keywords for Exam: not a feature of a SIEM, log encryption, managed by other security mechanisms Detailed Explanation:
คำอธิบายโดยละเอียด: ในขณะที่ SIEM จัดการการรวบรวม, วิเคราะห์ และเก็บรักษาบันทึก การเข้ารหัสบันทึกโดยทั่วไปจะจัดการโดยตัวแทนการบันทึก, ระบบจัดเก็บข้อมูล หรือเครื่องมือความปลอดภัยแยกต่างหาก ไม่ใช่ SIEM เอง
** Question 183** A number of people are using the same credentials on a shared account. What is the best strategy to secure the account? Options: A use a more complex password B force password changes weekly C use biometric authentication D use a one-time password based on an app or a token Correct Option: D use a one-time password based on an app or a token Keywords for Exam: shared account, best strategy to secure, one-time password, app or a token, ensures each access is unique Detailed Explanation:
คำอธิบายโดยละเอียด: การใช้รหัสผ่านแบบใช้ครั้งเดียว (OTP) เป็นกลยุทธ์ที่ยอดเยี่ยมสำหรับบัญชีที่ใช้ร่วมกัน แม้ว่าบัญชีส่วนบุคคลจะดีกว่า แต่ถ้าต้องใช้บัญชีร่วมกัน OTP จะช่วยให้มั่นใจได้ว่าการเข้าสู่ระบบแต่ละครั้งจะไม่ซ้ำกันและเพิ่มปัจจัยที่สองของการยืนยันตัวตน
** Question 184** When analyzing risks, which of these activities is required? Options: A eliminating all possible risks B transferring all risks to a third party C determining the likelihood of occurrence and potential impact of a set of risks D ignoring risks with low impact Correct Option: C determining the likelihood of occurrence and potential impact of a set of risks Keywords for Exam: analyzing risks, activity required, determining the likelihood of occurrence, assessing the impact Detailed Explanation:
คำอธิบายโดยละเอียด: การวิเคราะห์ความเสี่ยงโดยพื้นฐานแล้วเกี่ยวข้องกับการพิจารณาความน่าจะเป็นที่ภัยคุกคามจะเกิดขึ้นและผลกระทบที่อาจเกิดขึ้นหากเกิดขึ้น
** Question 185** Which of these exercises goes through a sample of an incident step by step, validating what each person will do? Options: A simulation exercise B a walkthrough exercise C a tabletop exercise D a full interruption test Correct Option: B a walkthrough exercise Keywords for Exam: exercises, goes through a sample of an incident step by step, validating that each person what each person will do, clarify roles and responsibility Detailed Explanation:
คำอธิบายโดยละเอียด: การฝึกซ้อมแบบ Walkthrough (หรือที่เรียกว่า Tabletop exercise แม้ว่า Walkthrough อาจเน้นไปที่ขั้นตอนส่วนบุคคลมากกว่า) เกี่ยวข้องกับสมาชิกในทีมที่ทบทวนขั้นตอนของแผนสำหรับสถานการณ์ที่กำหนดเพื่อตรวจสอบบทบาทและความรับผิดชอบ
** Question 186** Which of these documents is the least formal? Options: A standards B procedures C guidelines D policies Correct Option: C guidelines Keywords for Exam: documents, least formal, non-mandatory, recommendations or best practices Detailed Explanation:
คำอธิบายโดยละเอียด: แนวทางปฏิบัติ (Guidelines) เป็นทางการน้อยที่สุดเนื่องจากเป็นคำแนะนำที่ไม่บังคับ ตามลำดับความเป็นทางการ (มากไปน้อย): กฎระเบียบ, นโยบาย, มาตรฐาน, ระเบียบปฏิบัติ, แนวทางปฏิบัติ
** Question 187** A backup that captures the changes made since the last full backup is an example of: Options: A incremental backup B differential backup C full backup D snapshot Correct Option: B differential backup Keywords for Exam: backup, captures the changes, since the last full backup, efficient, faster to restore than incremental Detailed Explanation:
คำอธิบายโดยละเอียด: การสำรองข้อมูลแบบ Differential จะบันทึกการเปลี่ยนแปลงทั้งหมดที่เกิดขึ้นตั้งแต่การสำรองข้อมูลแบบเต็มครั้งล่าสุด ในการกู้คืน คุณต้องใช้ข้อมูลสำรองแบบเต็มล่าสุดและข้อมูลสำรองแบบ Differential ล่าสุดเท่านั้น
** Question 188** A backup that captures the changes made since the last backup (either full or incremental) is an example of: Options: A incremental backup B differential backup C full backup D snapshot Correct Option: A incremental backup Keywords for Exam: backup, captures the changes, since the last backup operation, resets archive bit Detailed Explanation:
คำอธิบายโดยละเอียด: การสำรองข้อมูลแบบ Incremental จะบันทึกเฉพาะการเปลี่ยนแปลงที่เกิดขึ้นตั้งแต่การสำรองข้อมูลครั้งล่าสุด (ไม่ว่าจะเป็นแบบเต็มหรือแบบเพิ่ม) ในการกู้คืน คุณต้องใช้ข้อมูลสำรองแบบเต็มล่าสุดบวกกับข้อมูลสำรองแบบเพิ่มทั้งหมดที่ตามมา
** Question 189** A high-level executive of an organization receives a spear phishing email. This is an example of: Options: A phishing B vishing C whaling D smishing Correct Option: C whaling Keywords for Exam: high-level executive, spear phishing email, example of, targeting senior executives Detailed Explanation:
คำอธิบายโดยละเอียด: Whaling คือการโจมตีแบบ Spear phishing ที่กำหนดเป้าหมายไปยังผู้บริหารระดับสูงโดยเฉพาะ
** Question 190** What does redundancy mean in the context of cyber security? Options: A removing duplicate data B using complex passwords C having a single point of failure D conceiving systems with duplicate components so that if a failure occurs there will be a backup Correct Option: D conceiving systems with duplicate components so that if a failure occurs there will be a backup Keywords for Exam: redundancy, cyber security, duplicate components, backup component, maintaining system availability, preventing downtime Detailed Explanation:
คำอธิบายโดยละเอียด: Redundancy คือการมีส่วนประกอบที่ซ้ำกันเพื่อขจัดจุด отказаเดียวและรับประกันความพร้อมใช้งานของระบบ
** Question 191** What is the main objective of a denial of service attack? Options: A to steal sensitive data B to gain unauthorized access C to install malware D to consume all available resources and make a service unavailable Correct Option: D to consume all available resources and make a service unavailable Keywords for Exam: main objective, denial of service attack, consume all available resources, make a service unavailable Detailed Explanation:
คำอธิบายโดยละเอียด: วัตถุประสงค์หลักของการโจมตี DoS คือการทำให้บริการไม่พร้อมใช้งานโดยการใช้ทรัพยากรที่มีอยู่ทั้งหมด
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
Threat Actor หมายถึงบุคคลหรือกลุ่มที่ก่อให้เกิดภัยคุกคาม (ตาม NIST SP 800-150) ส่วน Threat Vector คือช่องทางที่ Threat Actor ใช้เพื่อเข้าถึงระบบ (เช่น ฟิชชิ่ง, โทรจัน, การล่อลวง เป็นต้น) Attacker คือบุคคลเสมอ แต่ Threat Actor อาจเป็นกลุ่มหรือองค์กรก็ได้ Threat คือสถานการณ์หรือเหตุการณ์ที่อาจส่งผลกระทบทางลบต่อการดำเนินงานขององค์กร ซึ่ง Threat Actor สามารถใช้ประโยชน์ผ่าน Threat Vector ได้

QUESTION 2
Security posters are an element PRIMARILY employed in:
A. Business Continuity Plans
B. Physical Security Controls
C. Incident Response Plans
D. Security Awareness
Answer: D
Explanation:
โปสเตอร์ด้านความปลอดภัยใช้เพื่อสร้างความตระหนักรู้แก่พนักงานเกี่ยวกับภัยคุกคามทางไซเบอร์ ดังนั้นจึงเป็นเครื่องมือหลักในการสร้างความตระหนักรู้ด้านความปลอดภัย (Security Awareness) (อ้างอิงจาก ISC2 Study Guide, บทที่ 5, โมดูล 4)

QUESTION 3
A best practice of patch management is to:
A. Apply patches according to the vendor's reputation
B. Apply patches every Wednesday
C. Test patches before applying them
D. Apply all patches as quickly as possible
Answer: C
Explanation:
บางครั้งแพตช์อาจส่งผลกระทบต่อการกำหนดค่าและความเสถียรของระบบ หนึ่งในความท้าทายหลักสำหรับผู้เชี่ยวชาญด้านความปลอดภัยคือการปรับใช้แพตช์ให้เร็วที่สุดเท่าที่จะเป็นไปได้ พร้อมกับรับประกันความเสถียรของระบบที่ทำงานอยู่ เพื่อป้องกันไม่ให้แพตช์ที่มีข้อบกพร่องส่งผลกระทบทางลบต่อระบบ จึงเป็นแนวปฏิบัติที่ดีในการทดสอบแพตช์ในสภาพแวดล้อมที่จัดเตรียมไว้ก่อนนำไปใช้จริง (อ้างอิงจาก ISC2 Study Guide, บทที่ 5, โมดูล 2) การปรับใช้แพตช์โดยเร็วที่สุดไม่ใช่แนวทางปฏิบัติที่ดีเสมอไป ชื่อเสียงของผู้จำหน่ายอาจมีประโยชน์ แต่ก็ไม่เพียงพอที่จะรับรองคุณภาพของแพตช์ การปรับใช้แพตช์ในวันที่กำหนดไว้ก็ไม่ได้รับประกันความเสถียรของระบบเช่นกัน

QUESTION 4
Which of the following is NOT a social engineering technique?
A. Pretexting
B. Quid pro quo
C. Segregation
D. Baiting
Answer: C
Explanation:
ในด้านความปลอดภัยทางไซเบอร์ 'segregation of duties' (SoD) หรือการแบ่งแยกหน้าที่ เป็นหลักการด้านความปลอดภัยที่ออกแบบมาเพื่อป้องกันการทุจริตหรือข้อผิดพลาดโดยการแบ่งงานให้หลายคนรับผิดชอบ เป็นการควบคุมเชิงบริหารที่ช่วยลดความเสี่ยงจากการที่บุคคลเพียงคนเดียวควบคุมกระบวนการที่สำคัญทั้งหมด ตัวเลือกที่เหลือเป็นเทคนิควิศวกรรมสังคมที่ถูกต้อง Baiting คือการใช้เหยื่อล่อเพื่อหลอกลวง Pretexting คือการสร้างเรื่องราวเพื่อหลอกเอาข้อมูล และ Quid pro quo คือการเสนอผลประโยชน์เพื่อแลกกับข้อมูล

QUESTION 5
Governments can impose financial penalties as a consequence of breaking a:
A. Regulation
B. Policy
C. Procedure
D. Standard
Answer: A
Explanation:
มาตรฐาน (Standards) ถูกสร้างขึ้นโดยองค์กรกำกับดูแลหรือหน่วยงานวิชาชีพ (ไม่ใช่โดยรัฐบาล) ส่วนนโยบาย (Policies) และขั้นตอนปฏิบัติ (Procedures) ถูกสร้างขึ้นโดยองค์กร จึงไม่อยู่ภายใต้บทลงโทษทางการเงินจากรัฐบาล (อ้างอิงจาก ISC2 Study Guide บทที่ 1, โมดูล 4) มีเพียงกฎระเบียบ (Regulation) เท่านั้นที่รัฐบาลสามารถบังคับใช้และกำหนดบทลงโทษทางการเงินได้

QUESTION 6
Malicious emails that aim to attack company executives are an example of:
A. Whaling
B. Trojans
C. Phishing
D. Rootkits
Answer: A
Explanation:
Phishing คือการโจมตีแบบวิศวกรรมสังคมที่ใช้อีเมลปลอมที่ดูเหมือนจริงเพื่อหลอกขอข้อมูลหรือให้ผู้ใช้กระทำการบางอย่าง Whaling คือ Phishing ที่มุ่งเป้าไปที่ผู้บริหารระดับสูงขององค์กร Rootkits ใช้เพื่อซ่อนการกระทำที่เป็นอันตรายหลังจากที่ผู้โจมตีได้สิทธิ์ระดับ root แล้ว Trojans คือซอฟต์แวร์ที่ดูเหมือนถูกกฎหมายแต่มีฟังก์ชันประสงค์ร้ายซ่อนอยู่

QUESTION 7
Which of these is the PRIMARY objective of a Disaster Recovery Plan?
A. Outline a safe escape procedure for the organization's personnel
B. Maintain crucial company operations in the event of a disaster
C. Restore company operation to the last-known reliable operation state
D. Communicate to the responsible entities the damage caused to operations in the event of a disaster
Answer: C
Explanation:
แผนกู้คืนระบบหลังภัยพิบัติ (DRP) คือแผนสำหรับกู้คืนการดำเนินงานในกรณีที่เกิดความล้มเหลวของฮาร์ดแวร์หรือซอฟต์แวร์ที่สำคัญ หรือการทำลายสถานที่ขององค์กร เป้าหมายหลักของ DRP คือการกู้คืนธุรกิจให้อยู่ในสถานะการทำงานที่เชื่อถือได้ล่าสุด (อ้างอิงจาก ISC2 Study Guide บทที่ 2, โมดูล 4) การรักษาการดำเนินงานที่สำคัญคือเป้าหมายของแผนความต่อเนื่องทางธุรกิจ (BCP) ตัวเลือกอื่น ๆ อาจรวมอยู่ใน DRP แต่ไม่ใช่เป้าหมายหลัก

QUESTION 8
Which of the following is NOT a protocol of the OSI Level 3?
A. IGMP
B. IP
C. SNMP
D. ICMP
Answer: C
Explanation:
Internet Protocol (IP) เป็นโปรโตคอลในระดับที่ 3 (Network Layer) Internet Control Message Protocol (ICMP) และ Internet Group Management Protocol (IGMP) ก็เป็นโปรโตคอลระดับ 3 เช่นกัน ส่วน Simple Network Management Protocol (SNMP) เป็นโปรโตคอลที่ใช้ในการกำหนดค่าและตรวจสอบอุปกรณ์บนเครือข่าย ซึ่งทำงานในระดับแอปพลิเคชัน (ระดับที่ 7) ดังนั้นจึงเป็นตัวเลือกเดียวที่ไม่ได้อยู่ในระดับ 3

QUESTION 9
Which type of attack attempts to trick the user into revealing personal information by sending a fraudulent message?
A. Phishing
B. Denials of Service
C. Cross-Site Scripting
D. Trojans
Answer: A
Explanation:
การโจมตีแบบฟิชชิ่ง (Phishing) จะส่งข้อความหลอกลวงเพื่อหลอกให้ผู้รับเปิดเผยข้อมูลที่ละเอียดอ่อนแก่ผู้โจมตี การโจมตีแบบ Cross-Site Scripting (XSS) พยายามเรียกใช้โค้ดบนเว็บไซต์อื่น โทรจัน (Trojans) เป็นซอฟต์แวร์ที่ดูเหมือนถูกกฎหมายแต่มีฟังก์ชันที่เป็นอันตรายซ่อนอยู่ ส่วนการโจมตีแบบปฏิเสธการให้บริการ (DoS) คือการทำให้ระบบไม่สามารถใช้งานได้โดยการส่งคำขอจำนวนมากเกินไป

QUESTION 10
Which of the following documents contains elements that are NOT mandatory?
A. Policies
B. Guidelines
C. Regulations
D. Procedures
Answer: B
Explanation:
มีเพียงแนวทางปฏิบัติ (Guidelines) เท่านั้นที่มีองค์ประกอบที่ไม่บังคับ การปฏิบัติตามนโยบาย (Policies), ระเบียบปฏิบัติ (Procedures) และกฎระเบียบ (Regulations) ถือเป็นข้อบังคับ (อ้างอิงจาก ISC2 Study Guide บทที่ 1, โมดูล 4)

QUESTION 11
The process of verifying or proving the user's identification is known as:
A. Integrity
B. Authorization
C. Authentication
D. Confidentiality
Answer: C
Explanation:
การยืนยันตัวตน (Authentication) คือการตรวจสอบตัวตนของผู้ใช้ กระบวนการ หรืออุปกรณ์ เพื่อเป็นเงื่อนไขเบื้องต้นในการอนุญาตให้เข้าถึงทรัพยากรในระบบ ในทางตรงกันข้าม การอนุญาต (Authorization) หมายถึงการให้สิทธิ์แก่ผู้ใช้ กระบวนการ หรืออุปกรณ์ในการเข้าถึงทรัพย์สินที่เฉพาะเจาะจง ส่วนความลับ (Confidentiality) และความสมบูรณ์ (Integrity) เป็นคุณสมบัติของข้อมูลและระบบ ไม่ใช่กระบวนการ

QUESTION 12
Which of these is NOT a change management component?
A. Approval
B. Rollback
C. Governance
D. RFC
Answer: C
Explanation:
กระบวนการจัดการการเปลี่ยนแปลงที่สำคัญทั้งหมดประกอบด้วยกิจกรรมหลักทั่วไป ได้แก่ การร้องขอการเปลี่ยนแปลง (Request For Change - RFC), การอนุมัติ (Approval) และการย้อนกลับ (Rollback) (อ้างอิงจาก ISC2 Study Guide, บทที่ 5, โมดูล 3) ส่วนธรรมาภิบาล (Governance) ไม่ใช่หนึ่งในกิจกรรมเหล่านี้ แต่เป็นกรอบการทำงานที่ครอบคลุมกว่า

QUESTION 13
Which type of key can be used to both encrypt and decrypt the same message?
A. A symmetric key
B. A private key
C. An asymmetric key
D. A public key
Answer: A
Explanation:
อัลกอริทึมแบบสมมาตร (Symmetric-key) ใช้คีย์เดียวในการเข้ารหัสและถอดรหัสข้อมูล ส่วนการเข้ารหัสแบบอสมมาตร (Asymmetric cryptography) ใช้คีย์คู่ที่เกี่ยวข้องกันคือคีย์สาธารณะและคีย์ส่วนตัว ข้อความที่เข้ารหัสด้วยคีย์สาธารณะจะสามารถถอดรหัสได้ด้วยคีย์ส่วนตัวที่คู่กันเท่านั้น และในทางกลับกัน

QUESTION 14
Which of these has the PRIMARY objective of identifying and prioritizing critical business processes?
A. Business Continuity Plan
B. Business Impact Plan
C. Business Impact Analysis
D. Disaster Recovery Plan
Answer: C
Explanation:
คำว่า 'Business Impact Plan' ไม่มีอยู่จริง การวิเคราะห์ผลกระทบทางธุรกิจ (BIA) เป็นเทคนิคในการวิเคราะห์ว่าการหยุดชะงักส่งผลกระทบต่อองค์กรอย่างไร และใช้กำหนดความสำคัญของกิจกรรมทางธุรกิจทั้งหมด แผนความต่อเนื่องทางธุรกิจ (BCP) คือชุดคำสั่งที่กำหนดไว้ล่วงหน้าเพื่อรักษาการดำเนินธุรกิจระหว่างและหลังการหยุดชะงัก ส่วนแผนการกู้คืนจากภัยพิบัติ (DRP) คือแผนสำหรับการกู้คืนระบบสารสนเทศ

QUESTION 15
How many layers does the OSI model have?
A. 7
B. 4
C. 5
D. 6
Answer: A
Explanation:
โมเดล OSI แบ่งระบบการสื่อสารออกเป็น 7 ชั้น (Layer) ได้แก่ Physical, Data Link, Network, Transport, Session, Presentation และ Application (อ้างอิงจากบทที่ 4 - โมดูล 1)

QUESTION 16
Which type of attack embeds malicious payload inside a reputable or trusted software?
A. Rootkits
B. Phishing
C. Trojans
D. Cross-Site Scripting
Answer: C
Explanation:
โทรจัน (Trojans) เป็นซอฟต์แวร์ที่ดูเหมือนถูกกฎหมายแต่มีฟังก์ชันที่เป็นอันตรายซ่อนอยู่ ซึ่งมักจะใช้ประโยชน์จากการอนุญาตที่ถูกต้องของผู้ใช้ รูทคิท (Rootkits) พยายามรักษาสิทธิ์การเข้าถึงระดับสูงในขณะที่ซ่อนกิจกรรมที่เป็นอันตราย โทรจันมักจะติดตั้งรูทคิท แต่รูทคิทไม่ใช่โทรจัน ฟิชชิ่งมักจะพยายามเปลี่ยนเส้นทางผู้ใช้ไปยังเว็บไซต์อื่น และ Cross-site scripting พยายามแทรกโค้ดที่เป็นอันตรายเข้าไปในเว็บไซต์

QUESTION 17
A security safeguard is the same as a:
A. Security control
B. Safety control
C. Privacy control
D. Security principle
Answer: A
Explanation:
"Security safeguard" (มาตรการป้องกันความปลอดภัย) คือมาตรการที่ได้รับอนุมัติเพื่อปกป้องทรัพยากรโดยการกำจัดหรือลดความเสี่ยงต่อระบบ ซึ่งอาจเป็นกลไกฮาร์ดแวร์และซอฟต์แวร์ นโยบาย หรือการควบคุมทางกายภาพ (ตาม NIST SP 800-28) คำนิยามนี้ตรงกับคำว่า "security control" (การควบคุมความปลอดภัย) ซึ่งเป็นวิธีการจัดการความเสี่ยง (ตาม NIST SP 800-160) ดังนั้นทั้งสองคำจึงมีความหมายเหมือนกัน

QUESTION 18
Which of the following properties is NOT guaranteed by Digital Signatures?
A. Integrity
B. Confidentiality
C. Non-repudiation
D. Authentication
Answer: B
Explanation:
ลายเซ็นดิจิทัล (Digital Signature) มีประโยชน์ในการยืนยันตัวตนของแหล่งกำเนิดข้อมูล (Authentication), ความสมบูรณ์ของข้อมูล (Integrity) และการห้ามปฏิเสธความรับผิดชอบ (Non-repudiation) (ตาม NIST SP 800-12) อย่างไรก็ตาม ลายเซ็นดิจิทัลไม่ได้รับประกันการรักษาความลับของข้อมูล (Confidentiality) ซึ่งคือการป้องกันข้อมูลจากการถูกเปิดเผยโดยไม่ได้รับอนุญาต

QUESTION 19
According to the canon "Provide diligent and competent service to principals", (ISC)² professionals are to:
A. Avoid apparent or actual conflicts of interest
B. Promote the understanding and acceptance of prudent information security measures
C. Take care not to tarnish the reputation of other professionals through malice or indifference
D. Treat all members fairly and, when resolving conflicts, consider public safety and duties to principals, individuals and the profession, in that order
Answer: A
Explanation:
แนวทางการใช้หลักจรรยาบรรณของ ISC2 ระบุว่าการหลีกเลี่ยงผลประโยชน์ทับซ้อนเป็นผลมาจากการให้บริการแก่ผู้ว่าจ้าง (principals) อย่างขยันขันแข็งและมีความสามารถ ซึ่งเป็นไปตามหลักจรรยาบรรณข้อ "Provide diligent and competent service to principals" ตัวเลือกอื่น ๆ เป็นผลมาจากหลักจรรยาบรรณข้ออื่น ๆ

QUESTION 20
Which of the following is an example of 2FA?
A. Keys
B. Passwords
C. Badges
D. One-Time passwords (OTP)
Answer: D
Explanation:
รหัสผ่านแบบใช้ครั้งเดียว (OTP) โดยทั่วไปจะถูกสร้างโดยอุปกรณ์ (จัดเป็น "สิ่งที่คุณมี" - something you have) และต้องใช้ร่วมกับรหัสผ่านหลัก (จัดเป็น "สิ่งที่คุณรู้" - something you know) การใช้สองปัจจัยจากคนละประเภทกันนี้เรียกว่า 2FA ส่วนบัตร, กุญแจ หรือรหัสผ่านที่ใช้เพียงอย่างเดียวถือเป็นการยืนยันตัวตนแบบปัจจัยเดียว (single-factor)

QUESTION 21
Which of the following principles aims primarily at fraud detection?
A. Defense in Depth
B. Separation of Duties
C. Least Privilege
D. Privileged Accounts
Answer: B
Explanation:
หลักการแบ่งแยกหน้าที่ (Separation of Duties) กำหนดให้การดำเนินการที่สำคัญต้องถูกแบ่งส่วนและต้องใช้ผู้ใช้ที่แตกต่างกันในการอนุมัติ การมีส่วนร่วมของผู้ใช้หลายคนทำให้แน่ใจได้ว่าไม่มีผู้ใช้คนใดสามารถกระทำการทุจริตและปกปิดได้ด้วยตนเอง ทำให้หลักการนี้เป็นกลไกในการตรวจจับการทุจริต (อ้างอิง ISC2 Study Guide บทที่ 1, โมดูล 3) ส่วนหลักการอื่น ๆ มีวัตถุประสงค์ที่แตกต่างกัน

QUESTION 22
Which cloud deployment model is suited to companies with similar needs and concerns?
A. Private cloud
B. Community cloud
C. Hybrid cloud
D. Multi-tenant
Answer: B
Explanation:
Community Cloud เป็นโมเดลที่หลายองค์กรที่มีความต้องการหรือข้อกังวลคล้ายกัน (เช่น ด้านเทคโนโลยีหรือกฎระเบียบ) มาใช้โครงสร้างพื้นฐานและทรัพยากรคลาวด์ร่วมกัน ทำให้คุ้มค่าและตอบโจทย์เฉพาะกลุ่ม ส่วน Private Cloud สำหรับองค์กรเดียว, Hybrid Cloud คือการผสมผสานระหว่าง on-premise และ public cloud และ Multi-tenant คือการที่ผู้ใช้หลายรายแชร์ทรัพยากรเดียวกันแต่ข้อมูลถูกแยกจากกัน

QUESTION 23
Which of the following is NOT a possible model for an Incident Response Team (IRT)?
A. Hybrid
B. Pre-existing
C. Leveraged
D. Dedicated
Answer: B
Explanation:
โมเดลที่เป็นไปได้สำหรับทีมรับมือเหตุการณ์ (Incident Response Team - IRT) มี 3 รูปแบบคือ: Leveraged (ใช้บุคลากรจากแผนกอื่นเมื่อเกิดเหตุ), Dedicated (มีทีมงานประจำ) และ Hybrid (แบบผสม) (อ้างอิง ISC2 Study Guide, บทที่ 2, โมดูล 1) คำว่า 'Pre-existing' ไม่ใช่รูปแบบโมเดล IRT ที่ยอมรับกันทั่วไป

QUESTION 24
A web server that accepts requests from external clients should be placed in which network?
A. VPN
B. Internal Network
C. Intranet
D. DMZ
Answer: D
Explanation:
DMZ (Demilitarized Zone) เป็นเครือข่ายย่อยทางกายภาพหรือตรรกะที่แยกออกมาเพื่อให้บริการที่ต้องเชื่อมต่อกับภายนอก (เช่น เว็บเซิร์ฟเวอร์) โดยแยกออกจากเครือข่ายภายใน (Internal Network) เพื่อเพิ่มความปลอดภัย Internal Network คือเครือข่ายภายในองค์กรที่ไม่สามารถเข้าถึงได้จากภายนอก VPN ใช้สร้างอุโมงค์ที่ปลอดภัยผ่านเครือข่ายสาธารณะ

QUESTION 25
A device found not to comply with the security baseline should be:
A. Marked as potentially vulnerable and placed in a quarantine area
B. Disabled or separated into a quarantine area until a virus scan can be run
C. Placed in a demilitarized zone (DMZ) until it can be reviewed and updated
D. Disabled or isolated into a quarantine area until it can be checked and updated
Answer: D
Explanation:
Security baseline ใช้เพื่อให้แน่ใจว่าอุปกรณ์ต่าง ๆ ได้รับการกำหนดค่าอย่างสม่ำเสมอและสอดคล้องกับมาตรฐานความปลอดภัยขององค์กร เมื่อพบอุปกรณ์ที่ไม่เป็นไปตาม baseline ควรถูกปิดใช้งานหรือแยกไปยังพื้นที่กักกัน (quarantine area) จนกว่าจะได้รับการตรวจสอบและอัปเดต (อ้างอิง ISC2 Study Guide, บทที่ 5, โมดูล 2) ส่วน DMZ เป็นโซนเครือข่ายสำหรับเซิร์ฟเวอร์ที่ให้บริการสาธารณะ ไม่ใช่พื้นที่กักกันชั่วคราว

QUESTION 26
What is the consequence of a Denial of Service attack?
A. Increase in the availability of resources
B. Malware Infection
C. Remote control of a device
D. Exhaustion of device resources
Answer: D
Explanation:
การโจมตีแบบปฏิเสธการให้บริการ (DoS) คือการส่งคำขอจำนวนมากอย่างมุ่งร้าย ซึ่งจะนำไปสู่การใช้ทรัพยากรจนหมด ทำให้บริการไม่พร้อมใช้งาน การโจมตีประเภทนี้มีเป้าหมายเพื่อทำลายความพร้อมใช้งานของบริการ (Availability) แต่ไม่ได้มุ่งควบคุมอุปกรณ์หรือติดตั้งมัลแวร์
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
                
                // Corrected, more robust options parsing
                const parts = optionsRaw.split(/(?=\s[B-D]\s)/);
                const options = parts.map(p => p.trim().replace(/^[A-D]\s/, ''));


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

    // --- PARSER 4: Synthetic Data ---
    const blocks4 = rawText4.trim().split(/\*\* Question \d+\*\*/).filter(Boolean);
    blocks4.forEach(block => {
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
                
                // Corrected, more robust options parsing
                const parts = optionsRaw.split(/(?=\s[B-D]\s)/);
                const options = parts.map(p => p.trim().replace(/^[A-D]\s/, ''));

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
            console.error("Error parsing block from rawText4:", block, e);
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

    // --- PARSER 4: From rawText4 (Synthetic Concept Flashcards) ---
    const blocks4 = rawText4.trim().split(/\*\* Question \d+\*\*/).filter(Boolean);
    blocks4.forEach(block => {
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
            console.error("Error parsing concept flashcard from rawText4", e);
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
