
import { Domain, Question, ExamResult, UserAnswer, DomainScore, Flashcard } from '../types';

const DOMAIN_KEYWORDS: Record<Domain, string[]> = {
    [Domain.SecurityPrinciples]: ["security principle", "confidentiality", "integrity", "availability", "cia", "privacy", "risk management", "risk", "security control", "isc2", "ethic", "governance", "policy", "policies", "procedure", "standard", "guideline", "regulation"],
    [Domain.BC_DR_IncidentResponse]: ["business continuity", "bcp", "disaster recovery", "drp", "incident response", "bia", "business impact", "disaster", "incident"],
    [Domain.AccessControls]: ["access control", "physical control", "logical control", "least privilege", "separation of duties", "dac", "mac", "rbac", "abac", "discretionary", "mandatory", "role based", "attribute based", "authentication", "authorization", "mfa", "2fa"],
    [Domain.NetworkSecurity]: ["network", "osi", "tcp/ip", "ipv4", "ipv6", "threat", "attack", "ddos", "virus", "mitm", "firewall", "vpn", "dmz", "router", "switch", "protocol", "ip address"],
    [Domain.SecurityOperations]: ["data handling", "encryption", "hashing", "hardening", "configuration management", "password policy", "aup", "byod", "awareness", "logging", "monitoring", "siem", "patch management", "vulnerability"],
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
คำตอบ (English): Trojan.
คำอธิบายแนวคิด: ข้อนี้สำคัญมากเพราะคีย์เวิร์ด "designed to look legitimate but was actually malicious" คือลักษณะเฉพาะของ Trojan.
Virus: ต้องการ "Human interaction to spread" (คนต้องไปคลิก/รันมัน).
Worm: มีความสามารถ "propagate" คือแพร่กระจายได้ด้วยตัวเอง (Self-propagating).
Rootkit: ไม่เกี่ยวกับการดูเหมือนปกติ แต่เป็นการเจาะเข้าไปควบคุมระบบส่วนกลาง.
ข้อนี้เป็นข้อสอบ Official ของ CC ระดับกลางถึงยาก
2. Man-in-the-Middle Attack
คำถาม (English): The attacker has spoofed ARP packets to ensure that responses to a legitimate server are instead sent to the system that the attacker controls. This means traffic is being modified. What type of attack is this?
คีย์เวิร์ดสำคัญ: "spoofed ARP packets", "traffic", "modify traffic", "modify connection".
คำตอบ (English): Man-in-the-middle attack.
คำอธิบายแนวคิด: ข้อนี้รูปภาพในข้อสอบจริงจะช่วยได้มาก. เมื่อเห็นการ "Spoofed ARP packets" และมีการ "Modify Traffic" หรือ "Modify Connection" นี่คือลักษณะเฉพาะของ Man-in-the-middle attack.
ระวังกับดัก: "ARP jacking" และ "TCP-D attack" เป็นคำที่ "Made up term" หรือคำศัพท์ที่ไม่มีอยู่จริงในโลกนี้. อย่าไปเลือก!
ข้อนี้มาจากข้อสอบ Official.
3. Business Classification for Security Control
คำถาม (English): Which of the following best describes how businesses classify their data and applications for security controls?
คีย์เวิร์ดสำคัญ: "Business classify the data and application for Security Control", "specific appropriate Security Control based on sensitivity/impact".
คำตอบ (English): C. Allow organizations to specify appropriate Security Controls based on sensitivity and impact.
คำอธิบายแนวคิด: คำตอบนี้ตรงไปตรงมาที่สุดในการอธิบายว่าธุรกิจจะวางแผน Security Control โดยพิจารณาจาก "sensitivity" (ความอ่อนไหวของข้อมูล) และ "impact" (ผลกระทบหากเกิดเหตุการณ์ไม่พึงประสงค์).
หลักการสำคัญของ ISC2: ในข้อสอบของค่ายนี้ ถ้ามีเรื่องของ "Human Life" (ชีวิตมนุษย์) เข้ามาเกี่ยวข้อง จะถือว่าสำคัญที่สุด เหนือกว่า Business เสมอ.
4. RAID for Performance and Fault Tolerance
คำถาม (English): Simon is an administrator of a tech firm. He uses traffic quite high and also needs RAID. He requires high speed, fault tolerance (at least one disk failure), and does not require double storage. What RAID level?
คีย์เวิร์ดสำคัญ: "high speed", "fault tolerance (at least one disk failure)", "high performance", "does not require double storage".
คำตอบ (English): RAID 5.
คำอธิบายแนวคิด: ข้อนี้เน้นเรื่อง "Performance" (High Speed) และ "Fault Tolerance" (ทนทานต่อ Disk failure อย่างน้อย 1 ลูก).
RAID 0: มีแต่ Performance อย่างเดียว (ไม่มี Fault Tolerance).
RAID 1: Duplicate Data (มี Fault Tolerance) แต่ประสิทธิภาพไม่ดีเท่า.
RAID 6: มี Fault Tolerance ที่ดีกว่า RAID 5 (ทนต่อ 2 disk failures) แต่ "ช้ากว่า RAID 5" (slow Performance).
ดังนั้น RAID 5 จึงเป็นคำตอบที่ลงตัวที่สุด เพราะมีทั้ง Performance และ Parity (Fault Tolerance).
ข้อสอบเกี่ยวกับ RAID 0, 1, 5, 6 ออกบ่อยในค่ายนี้ ผมต้องจำโครงสร้างและจุดเด่นจุดด้อยให้ได้.
5. Power Protection for Short Outages
คำถาม (English): Tina is concerned about brownouts and short power outages for systems in the data center. What type of power protection should be put in place to help her system stay online?
คีย์เวิร์ดสำคัญ: "brownout", "short power outage".
คำตอบ (English): UPS (Uninterruptible Power Supply).
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
คำตอบ (English): MOU (Memorandum of Understanding).
คำอธิบายแนวคิด: คีย์เวิร์ดที่สำคัญที่สุดคือ "informal".
MOU: เป็นการตกลงอย่างไม่เป็นทางการ "ไม่มีผลทางกฎหมาย". เหมาะสำหรับความสัมพันธ์ภายในองค์กร หรือความร่วมมือที่ไม่ต้องการข้อผูกมัดทางกฎหมายที่เข้มงวด.
SLA (Service Level Agreement): เป็นข้อตกลงที่ "เป็นทางการ" (Formal) มี Metric กำหนดชัดเจน (เช่น Uptime 99.9%) และมีผลทางกฎหมาย มักใช้กับ External Vendor.
MSA (Master Service Agreement) และ BPA (Business Partner Agreement): ไม่ค่อยออกใน CC และไม่เกี่ยวกับการตกลงแบบ Informal ภายใน.
7. Social Engineering Training for Customer Service
คำถาม (English): James, a customer service representative at an online retail company, is undergoing a security training program. As part of his role, he frequently communicates with customers. What training would best equip James to deal with social engineering and pretexting attacks?
คีย์เวิร์ดสำคัญ: "Security Training Program", "frequently communicate with customers", "social engineering", "pretexting attack", "in his work".
คำตอบ (English): Role-Based Training.
คำอธิบายแนวคิด: ข้อนี้ค่อนข้างยากและหลอกง่าย.
Role-Based Training: เป็นการอบรมที่ "ปรับเนื้อหาให้เหมาะสมกับหน้าที่ความรับผิดชอบ" (tailored content of specific job responsibility). เนื่องจาก James เป็น Customer Service และต้องเจอ Social Engineering ในงานของเขาโดยตรง (in his work) การอบรมที่เจาะจงกับบทบาทจึงเหมาะสมที่สุด.
Security Policy Training: การอบรมเพื่อให้ปฏิบัติตามนโยบายความปลอดภัย.
Anomalous Behavior Recognition: การตรวจจับความผิดปกติ.
Hybrid Remote Work Enrollment: ไม่เกี่ยวเลย.
ถึงแม้ "Awareness Training" จะช่วยเรื่อง Social Engineering ได้ดี แต่ถ้ามี Role-Based Training ที่เจาะจงกับหน้าที่ ตัวนี้จะครอบคลุมและมีประสิทธิภาพที่สุด.
8. Social Engineering Principle (Urgency)
คำถาม (English): Henry is conducting a penetration test and wants to social engineer a staff member at his target organization into letting him gain access to a building. He explains that he is at the request of a senior manager and he is late for a meeting with that manager, who is relying on him to be there. Which social engineering principle is he using?
คีย์เวิร์ดสำคัญ: "social engineer", "gain access to a building", "request of senior manager", "late for a meeting".
คำตอบ (English): Urgency.
คำอธิบายแนวคิด: ข้อนี้ก็หลอกเก่งมาก เพราะมีคำว่า Senior Manager ทำให้หลายคนอาจจะนึกถึง Authority.
Urgency (ความเร่งด่วน): คีย์เวิร์ดคือ "He is late for a meeting". นี่คือการสร้างความกดดันให้คนรีบทำโดยไม่คิดหน้าคิดหลัง.
Authority (อำนาจ): คือการอ้างผู้มีอำนาจ เช่น อ้างเป็นนายตำรวจยศสูง. แม้จะอ้าง Senior Manager แต่การเน้นเรื่อง "Late for a Meeting" ทำให้ Urgency ชัดเจนกว่า.
Intimidation (ข่มขู่): คือการขู่ว่าจะเกิดผลเสีย เช่น โดนไล่ออก โดนหักเงินเดือน ถ้าไม่ทำตาม. ข้อนี้ไม่มีการขู่.
Trust (ความเชื่อใจ): ไม่เกี่ยวในบริบทนี้.
ต้องแยกแยะให้ดีระหว่าง Authority กับ Urgency!
9. Multi-Factor Authentication Factors
คำถาม (English): Zia is implementing multifactor authentication and wants to ensure that using different factors. His authentication system he is setting up requires a PIN and biometric. Which factors are used?
คีย์เวิร์ดสำคัญ: "multifactor authentication", "different factors", "PIN and biometric".
คำตอบ (English): Something you know and Something you are.
คำอธิบายแนวคิด: จำให้ขึ้นใจ!
Something you know: เช่น Password, PIN.
Something you have: เช่น Mobile phone, Token (อุปกรณ์ที่ถืออยู่).
Something you are: เช่น Biometric (ลายนิ้วมือ, สแกนใบหน้า).
ดังนั้น PIN + Biometric คือ Something you know และ Something you are.
10. CIA Triad - Availability
คำถาม (English): Fay is investigating a security incident where the attacker shut down his organization's database server. They do not appear to have actually gained access to the system, but they shut it down using some type of exploit. What security goal was affected?
คีย์เวิร์ดสำคัญ: "shutdown his organization's database server", "Server ล่ม", "do not appear to have actually gain access to the system".
คำตอบ (English): Availability.
คำอธิบายแนวคิด: เมื่อใดก็ตามที่ระบบล่ม, Server ล่ม, หรือเว็บล่ม (System Down) ให้มองหา Availability ไว้ก่อนเลย.
Confidentiality (การรักษาความลับ): ข้อมูลไม่รั่วไหล.
Integrity (ความสมบูรณ์ของข้อมูล): ข้อมูลไม่ถูกแก้ไข/เปลี่ยนแปลง.
Non-repudiation (การห้ามปฏิเสธความรับผิดชอบ): พิสูจน์ได้ว่าใครทำอะไร.
ในข้อนี้ ไม่มีการเข้าถึงข้อมูล ไม่มีการเปลี่ยนแปลงข้อมูล ดังนั้น Integrity และ Confidentiality ไม่ถูกละเมิด.
11. Security Principle - Two Person Control
คำถาม (English): Sarah is designing an authorization scheme for his organization using a new accounting system. She is putting a control in place that would require two accountants to approve any request over $1000. Which security principle is she seeking to enforce?
คีย์เวิร์ดสำคัญ: "two accountants", "approve any request over $1000".
คำตอบ (English): Two Person Control.
คำอธิบายแนวคิด: ข้อนี้ก็หลอกง่ายระหว่าง Two Person Control กับ Separation of Duty.
Two Person Control: คือการที่ "คนสองคนต้องทำงานร่วมกันในงานเดียว" หรือ "เหมือนมีกุญแจครึ่งดอกคนละดอก ต้องมาประกบกัน" เพื่อให้งานสำเร็จ. โจทย์ไม่ได้ระบุว่าสองคนนี้ทำหน้าที่ต่างกัน แค่ระบุว่า "two accountants approve".
Separation of Duty: คือการที่ "สองคนทำหน้าที่ต่างกัน" เพื่อลดความเสี่ยงจากการทุจริตหรือความผิดพลาด เช่น คนหนึ่งอนุมัติ (Approve) อีกคนหนึ่งจ่ายเงิน (Pay). ถ้าโจทย์ระบุว่า Accountant 1 Approve และ Accountant 2 Pay แบบนี้จะเป็น Separation of Duty.
Least Privilege: ให้สิทธิ์ขั้นต่ำที่จำเป็นเท่านั้น.
Security through obscurity: ความปลอดภัยโดยการซ่อนข้อมูล ไม่ใช่การควบคุม.
12. Control Type - Data Loss Prevention (DLP)
คำถาม (English): Bryan is developing an architecture for a new Data Loss Prevention (DLP) system. What type of security control is DLP?
คีย์เวิร์ดสำคัญ: "Data Loss Prevention System (DLP)".
คำตอบ (English): Technical.
คำอธิบายแนวคิด: ต้องจำประเภทของ Control ให้แม่น!
Technical Control: คือการใช้ "ซอฟต์แวร์" หรือ "โซลูชัน" (เช่น Antivirus, Firewall, DLP).
Administrative Control: คือ "นโยบาย" หรือ "กฎหมาย" (เช่น Security Policy, กฎระเบียบ).
Physical Control: คือการควบคุมทางกายภาพ (เช่น ประตู, รั้ว, กล้องวงจรปิด).
13. Risk Management - Accepting the Risk (Next Step)
คำถาม (English): Tina recently completed a risk management review. After discussing the situation with her manager, she is accepting the risk. What is the appropriate strategy to do next?
คีย์เวิร์ดสำคัญ: "accepting the risk", "appropriate strategy", "what to do next".
คำตอบ (English): Document the decision.
คำอธิบายแนวคิด: นี่คือ "แพทเทิร์น" ที่ออกบ่อยและคนมักจะลืม.
เมื่อเราตัดสินใจ "Accept the risk" (ยอมรับความเสี่ยง) แปลว่าเราจะ "ไม่ทำอะไรเลย" เพื่อควบคุมมัน.
แต่สิ่งที่ต้องทำต่อมาคือ "Document the decision" หรือ "บันทึกการตัดสินใจนั้นไว้เป็นหลักฐาน". เพื่อป้องกันความรับผิดชอบส่วนตัวในอนาคต หากเกิดผลกระทบจากความเสี่ยงนั้น.
14. Risk Management - Mitigation
คำถาม (English): Chris conducted a comprehensive security review of his organization. He identified 25 top risks and is pursuing different strategies for each risk. For a particular risk, his goal is to reduce the overall level of the risk. He designs a solution that integrates a threat intelligence feed with a firewall. What risk strategy is this?
คีย์เวิร์ดสำคัญ: "reduce the overall level of the risk", "multiple strategy", "integrate threat intelligence feed with Firewall".
คำตอบ (English): Mitigation.
คำอธิบายแนวคิด:
Mitigation: คือการ "Reduce the overall level of risk" (ลดระดับความเสี่ยงโดยรวมลง). การใช้ Threat Intelligence Feed ร่วมกับ Firewall เป็นตัวอย่างของการ Mitigation.
Acceptance: คือ Take the risk and Do Nothing (แต่ต้องมี Documentation).
Avoidance: คือการ "ไม่ทำเลย" หรือ "ไม่ยุ่งเกี่ยวกับความเสี่ยงนั้นเลย".
Transference: คือการ "โอนความเสี่ยง" ไปให้บุคคลที่สาม (เช่น การซื้อประกันภัย - Insurance).
15. Documentation Type - Step-by-Step
คำถาม (English): Gina is drafting a document that provides a detail step-by-step process that users can follow to connect to VPN from a remote location. What type of document is this?
คีย์เวิร์ดสำคัญ: "detail step-by-step process".
คำตอบ (English): Procedure.
คำอธิบายแนวคิด: จำคีย์เวิร์ดนี้ให้ขึ้นใจเลยครับ!
Procedure: คือเอกสารที่บอก "ขั้นตอนการทำงานแบบละเอียด เป็นขั้นเป็นตอน (1, 2, 3, 4)".
Policy: เป็น "นโยบาย" ระดับสูง (ผู้บริหารอ่าน).
Standard: เป็น "มาตรฐาน" หรือสิ่งที่ยอมรับได้.
Guideline: เป็น "แนวทางคร่าวๆ" ไม่ลงรายละเอียดมาก.
16. Agreement Type - SaaS Downtime
คำถาม (English): A company is entering into an agreement with a SaaS (Software as a Service) provider. The agreement specifies the amount of downtime that is acceptable. Which document is this?
คีย์เวิร์ดสำคัญ: "agreement with SaaS provider", "amount of Down Time that is acceptable".
คำตอบ (English): SLA (Service Level Agreement).
คำอธิบายแนวคิด: ข้อนี้เอามาเพื่อแสดงความแตกต่างกับ MOU.
SLA: เป็นข้อตกลง "ที่เป็นทางการ" (Formal) ที่มี "Metric" หรือตัวเลขกำหนดชัดเจน (เช่น เวลา Downtime ที่ยอมรับได้, Uptime 99.9%). มักใช้กับผู้ให้บริการภายนอก (External Service Provider).
17. Digital Signature - Security Goal
คำถาม (English): Tina is applying a digital signature to a contract and can prove that she agrees to its terms. What goal of cybersecurity does this directly achieve?
คีย์เวิร์ดสำคัญ: "Digital signature", "can prove that She agree to is term".
คำตอบ (English): Non-repudiation.
คำอธิบายแนวคิด: คีย์เวิร์ดคือ "Digital Signature" ซึ่งมีวัตถุประสงค์หลักคือ "Non-repudiation" หรือ "การห้ามปฏิเสธความรับผิดชอบ". การใช้ Digital Signature ทำให้สามารถพิสูจน์ได้ว่าใครเป็นผู้ลงนามหรือไม่สามารถปฏิเสธได้ว่าไม่ได้ทำ.
Digital Signature ไม่ได้ปกป้อง Confidentiality โดยตรง และไม่ใช่ Authentication โดยตรง.
18. Man in the Browser Attack
คำถาม (English): Which of the following best describes a Man-in-the-Browser attack?
คีย์เวิร์ดสำคัญ: "Man in the Browser attack".
คำตอบ (English): Proxy Trojan.
คำอธิบายแนวคิด: ข้อนี้อาจารย์ย้ำว่า "ยาก" และเป็น "เทอมที่ไม่ค่อยอยู่ใน Material ของ CC ทั่วไป" แต่ออกสอบ Official.
ดังนั้น ต้อง "จำไปเลย" ว่า Man-in-the-Browser attack คือ Proxy Trojan. มันจะมาในรูปแบบของ Plug-in ใน Browser เพื่อดักจับและแก้ไขข้อมูล.
ข้อนี้มาจากข้อสอบ Official. ผมต้องจำให้ได้เลยนะ!
19. Backup Type - Incremental
คำถาม (English): Paul runs a backup service for his organization. Everyday he backs up changes made everyday since the last backup operation. What type of backup does he perform?
คีย์เวิร์ดสำคัญ: "Backup change everyday", "since the last backup operation".
คำตอบ (English): Incremental.
คำอธิบายแนวคิด: ข้อนี้เป็นอีกข้อที่มาจาก Official CC และค่อนข้างลึก.
Incremental Backup: คือการ Backup ข้อมูลที่เปลี่ยนแปลงไป "ตั้งแต่ Full Backup ครั้งล่าสุด หรือ Incremental Backup ครั้งล่าสุด". คีย์เวิร์ด "since the last backup operation" ชี้ไปที่ Incremental เพราะมันจะดูการเปลี่ยนแปลงจาก Backup ก่อนหน้าไม่ว่าจะเป็น Full หรือ Incremental.
Differential Backup: คือการ Backup ข้อมูลที่เปลี่ยนแปลงไป "ตั้งแต่ Full Backup ครั้งล่าสุด" เท่านั้น.
Full Backup: คือการ Backup ข้อมูลทั้งหมด.
ต้องจำภาพและข้อดีข้อเสียของแต่ละแบบให้ได้ เพราะบางครั้งโจทย์อาจถามถึงความเร็วในการ Restore ข้อมูล.
ข้อนี้มาจากข้อสอบ Official.
20. Physical Security - Multi-Factor Authentication
คำถาม (English): Chris wants to use a lock to secure a high-security area in his organization. He wants to ensure that losing the code to the lock will not result in easy defeat. What should he put in place?
คีย์เวิร์ดสำคัญ: "lock to secure High Security area", "losing the code to the lock will not result in easy defeat".
คำตอบ (English): Adding a second factor for authentication.
คำอธิบายแนวคิด: โจทย์บอกชัดว่าถ้า "losing the code" จะต้องไม่ถูกเจาะได้ง่ายๆ. นั่นหมายความว่าการใช้แค่ Factor เดียว (Something you know - Code/PIN) ไม่พอ.
ดังนั้น วิธีแก้คือการ "เพิ่ม Factor ที่สอง" หรือที่เรียกว่า MFA (Multi-Factor Authentication). เช่น ใช้ Code (Something you know) ร่วมกับ Biometric (Something you are) หรือ Token (Something you have).
Electronic lock หรือ Physical lock ก็ยังคงใช้ Code อยู่ดี จึงไม่ช่วยแก้ปัญหาหาก Code รั่วไหล.
    `;

const rawText2 = `
200 Practice Exam

สรุปคำถามฝึกหัด ISC2 CC พร้อมแนวคิดและ Keyword (เพื่อสอบผ่านชัวร์!)
** Question 1** Which concept describes an information security strategy that integrates people, technology, and operations in order to establish security controls across multiple layers of the organization? Options: A least privilege B defense in depth C separation of duties D privileged accounts Correct Option: B defense in depth Keywords for Exam: security strategy, integrates people technology operations, security controls across multiple layers Detailed Explanation:
Defense in Depth (การป้องกันแบบหลายชั้น) คือกลยุทธ์ด้านความมั่นคงปลอดภัยของข้อมูลที่สำคัญมากๆ ที่เน้นการนำมาตรการควบคุมความปลอดภัย (security controls) มาใช้ในทุกชั้นขององค์กรเลยนะ ไม่ใช่แค่ชั้นใดชั้นหนึ่ง ตัวอย่างชั้นต่างๆ ก็เช่น นโยบาย (policies), การรักษาความปลอดภัยทางกายภาพ (physical security) เช่น ดาต้าเซ็นเตอร์, การรักษาความปลอดภัยเครือข่าย (network security), อุปกรณ์/เซิร์ฟเวอร์/คอมพิวเตอร์ (devices/servers/computers), แอปพลิเคชัน (applications) และสุดท้ายคือข้อมูล (data) ซึ่งเป็นสิ่งที่มีค่าที่สุด.
แนวคิดหลักคือ ถ้าหากชั้นใดชั้นหนึ่งถูกโจมตีหรือถูกเจาะได้สำเร็จ ชั้นอื่นๆ ที่เหลือก็จะยังคงให้การป้องกันอยู่ ทำให้ความเสี่ยงโดยรวมลดลงอย่างมาก. มันคือการรวมมาตรการป้องกันหลากหลายรูปแบบ ทั้งแบบกายภาพ (physical), เทคนิค (technical) และการบริหารจัดการ (administrative controls) เข้าด้วยกันอย่างเป็นระบบ. จำไว้เลยว่าต้องครอบคลุมทุกด้านจริงๆ!
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Least Privilege: หลักการให้สิทธิ์ขั้นต่ำที่จำเป็นเท่านั้น ไม่ใช่กลยุทธ์ครอบคลุมทั้งองค์กร.
Separation of Duties: การแบ่งแยกหน้าที่เพื่อป้องกันการทุจริตหรือข้อผิดพลาด ไม่ใช่กลยุทธ์หลายชั้น.
Privileged Accounts: บัญชีผู้ใช้ที่มีสิทธิ์พิเศษสูง ไม่ใช่กลยุทธ์การป้องกัน.
** Question 2** Which of the following is not an ethical canon of the ISC2? Options: A advance and protect the profession B protect the society the common good necessary public trust and confidence and the infrastructure C act honorably honestly justly responsibly and legally D provide active and qualified service to the principles Correct Option: D provide active and qualified service to the principles Keywords for Exam: not an ethical canon, ISC2, four canons Detailed Explanation:
ISC2 Code of Ethics Canons (หลักจรรยาบรรณของ ISC2): ข้อนี้ต้องจำให้ขึ้นใจเลยนะ เพราะเจอในข้อสอบบ่อยมาก ISC2 มีหลักจรรยาบรรณหลักอยู่ 4 ข้อ และลำดับก็สำคัญด้วย.
Protect society, the common good, necessary public trust and confidence, and the infrastructure. (ปกป้องสังคม, ส่วนรวม, ความไว้วางใจของสาธารณะ, และโครงสร้างพื้นฐาน)
Act honorably, honestly, justly, responsibly, and legally. (ประพฤติตนอย่างมีเกียรติ, ซื่อสัตย์, เป็นธรรม, มีความรับผิดชอบ, และถูกกฎหมาย)
Provide diligent and competent service to principles. (ให้บริการอย่างขยันขันแข็งและมีความสามารถแก่ผู้ว่าจ้าง/ลูกค้า)
Advance and protect the profession. (ส่งเสริมและปกป้องวิชาชีพ)
ตัวเลือก D (provide active and qualified service to the principles) มีคำที่ผิดไปจากข้อ 3 ที่ถูกต้องคือ "diligent and competent" ไม่ใช่ "active and qualified". จำคำให้แม่น!
** Question 3** The cloud deployment model where a company has resources on premise and in the cloud is known as: Options: A hybrid cloud B multi-tenant C private cloud D community cloud Correct Option: A hybrid cloud Keywords for Exam: resources on premise and in the cloud, combination of cloud models Detailed Explanation:
Hybrid Cloud (คลาวด์แบบผสมผสาน): ข้อนี้ตรงตัวเลย คือการรวมกันระหว่างโครงสร้างพื้นฐานแบบ On-Premise (ที่เราดูแลเองในองค์กร) กับ Public Cloud (บริการคลาวด์สาธารณะ). หรืออาจจะเป็นการรวมกันระหว่าง Private Cloud (คลาวด์ส่วนตัว) กับ Public Cloud ก็ได้.
ข้อดีคือ บริษัทสามารถเก็บข้อมูลที่ละเอียดอ่อนไว้ใน On-Premise ได้ ในขณะที่ยังใช้ความยืดหยุ่นและการขยายขนาดได้ของคลาวด์สำหรับเวิร์กโหลดอื่นๆ.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Multi-tenant: เป็นสถาปัตยกรรมที่ลูกค้าหลายรายใช้โครงสร้างพื้นฐานเดียวกัน แต่ไม่ใช่รูปแบบการใช้งาน.
Private Cloud: คลาวด์ที่ใช้งานโดยองค์กรเดียวเท่านั้น.
Community Cloud: คลาวด์ที่หลายๆ องค์กรที่มีความสนใจหรือความต้องการคล้ายกันใช้ทรัพยากรร่วมกัน.
** Question 4** Which of the following is a public IP address? Options: A 13.16.123.1 B 192.168.123.1 C 172.16.123.1 D 10.221.1.123.1 Correct Option: A 13.16.123.1 Keywords for Exam: public IP address, routable over the internet, private IP ranges Detailed Explanation:
Public IP Address (ที่อยู่ IP สาธารณะ) vs. Private IP Address (ที่อยู่ IP ส่วนตัว):
Public IP: คือ IP ที่สามารถเข้าถึงได้และ "Routable" (ส่งผ่านเราเตอร์ได้) บนอินเทอร์เน็ต.
Private IP: คือ IP ที่สงวนไว้สำหรับใช้ภายในเครือข่ายส่วนตัวเท่านั้น และ "ไม่" สามารถ Route ออกอินเทอร์เน็ตได้โดยตรง.
ช่วง IP ของ Private Address (ต้องจำให้แม่น!):
Class A: 10.0.0.0 ถึง 10.255.255.255 (หรือ 10/8)
Class B: 172.16.0.0 ถึง 172.31.255.255 (หรือ 172.16/12)
Class C: 192.168.0.0 ถึง 192.168.255.255 (หรือ 192.168/16)
จากตัวเลือก ตัวเลือก A: 13.16.123.1 ไม่อยู่ในสามช่วง IP Private ที่กล่าวมา ดังนั้นมันคือ Public IP address. ส่วน B, C, D ล้วนอยู่ในช่วง Private IP address ทั้งสิ้น. ข้อนี้ต้องจำช่วง IP Private ให้แม่นเลยนะ!
** Question 5** Which device would be more effective in detecting an intrusion into a network? Options: A routers B HIDS that is host based intrusion detection system C firewalls D NIDS network intrusion detection system Correct Option: D NIDS network intrusion detection system Keywords for Exam: detecting an intrusion, into a network Detailed Explanation:
NIDS (Network Intrusion Detection System): ระบบตรวจจับการบุกรุกบนเครือข่าย ถูกออกแบบมาเพื่อ "ตรวจสอบทราฟฟิกเครือข่าย" หาสิ่งผิดปกติและสัญญาณการบุกรุกที่อาจเกิดขึ้น. NIDS จะถูกติดตั้งอยู่ในเครือข่ายเพื่อวิเคราะห์ข้อมูลแพ็กเก็ตที่ไหลผ่าน.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Routers: เราเตอร์หลักๆ แล้วมีหน้าที่ส่งต่อข้อมูล (direct traffic) อาจมีคุณสมบัติด้านความปลอดภัยพื้นฐาน แต่ไม่ได้ออกแบบมาเพื่อตรวจจับการบุกรุกโดยเฉพาะ.
HIDS (Host-based Intrusion Detection System): HIDS ตรวจสอบกิจกรรมบน "โฮสต์แต่ละเครื่อง" (individual host) ไม่ใช่ทั่วทั้งเครือข่าย. โจทย์ถามถึงการบุกรุก "เข้าสู่เครือข่าย" โดยรวม.
Firewalls: ไฟร์วอลล์มีหน้าที่ควบคุมและกรองทราฟฟิก (control and filter traffic) โดยทั่วไปไม่ได้ให้การตรวจจับกิจกรรมที่น่าสงสัยในระดับเดียวกับ NIDS.
** Question 6** Which access control is more effective at protecting a door against unauthorized access? Options: A fences B turn styles C barriers D locks Correct Option: D locks Keywords for Exam: effective at protecting a door, unauthorized access, physically securing Detailed Explanation:
Locks (กุญแจ/ระบบล็อค): ข้อนี้เป็น Common Sense เลย! กุญแจถูกออกแบบมาเพื่อรักษาความปลอดภัยของประตูโดยเฉพาะ และมีประสิทธิภาพสูงสุดในการป้องกันการเข้าถึงประตูโดยไม่ได้รับอนุญาตโดยตรง. มันเป็นกลไกควบคุมการเข้าถึงโดยตรงที่ต้องการกุญแจ, รหัส หรือการยืนยันตัวตนอื่นๆ.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Fences (รั้ว) และ Barriers (แผงกั้น): มีประโยชน์สำหรับการรักษาความปลอดภัยบริเวณรอบนอก (perimeter security) แต่ไม่ได้ป้องกันประตูโดยตรง.
Turnstiles (ประตูหมุน): ควบคุมการไหลของคนเข้าออกได้ดี แต่เหมาะสำหรับจุดทางเข้ามากกว่าการรักษาความปลอดภัยของประตูโดยตรง (ซึ่งอาจจะไม่ได้ใช้กุญแจล็อคเสมอไป).
** Question 7** Which of the following is a detection control? Options: A turns B smoke detectors C bulards D firewalls Correct Option: B smoke detectors Keywords for Exam: detection control, detect an intrusion Detailed Explanation:
Detection Control (มาตรการควบคุมแบบตรวจจับ): คือสิ่งที่ออกแบบมาเพื่อ "ระบุและแจ้งเตือน" เมื่อมีปัญหาหรือกิจกรรมที่ไม่ได้รับอนุญาตเกิดขึ้น.
Smoke Detectors (เครื่องตรวจจับควัน): ตรวจจับควัน ซึ่งเป็นสัญญาณของไฟไหม้ และส่งสัญญาณเตือน. ตรงตามวัตถุประสงค์ของ Detection Control เลย
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Turnstiles (ประตูหมุน) และ Bollards (เสาเหล็กกันรถ): เป็น Physical Controls (มาตรการควบคุมทางกายภาพ) ใช้เพื่อควบคุมการเข้าออกและการจัดการจราจร.
Firewalls (ไฟร์วอลล์): เป็น Preventive Controls (มาตรการควบคุมเชิงป้องกัน) ที่บล็อกการเข้าถึงที่ไม่ได้รับอนุญาต แต่ไม่ได้ออกแบบมาเพื่อตรวจจับเหตุการณ์โดยเฉพาะ (แม้บางตัวจะทำงานร่วมกับ IDS ได้).
** Question 8** Which type of attack has the primary objective of controlling the system from outside? Options: A back doors B root kits C cross-site scripting D Trojans Correct Option: A back doors Keywords for Exam: primary objective, controlling the system from outside, remote control Detailed Explanation:
Backdoors (แบ็คดอร์): คือช่องทางหรือวิธีการที่อนุญาตให้ผู้โจมตีเข้าถึงระบบโดยไม่ได้รับอนุญาต โดยมีวัตถุประสงค์หลักคือ "การควบคุมระบบจากระยะไกล" (control the system remotely). มักจะถูกติดตั้งเพื่อหลีกเลี่ยงการยืนยันตัวตนปกติ ทำให้ผู้โจมตีกลับเข้ามาในระบบได้ทุกเมื่อโดยไม่ถูกตรวจจับ.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Rootkits: ถูกออกแบบมาเพื่อ "ซ่อน" กิจกรรมหรือซอฟต์แวร์ที่เป็นอันตรายในระบบ ทำให้การโจมตีอื่นๆ เช่น แบ็คดอร์ ตรวจจับได้ยาก แต่การควบคุมระบบไม่ใช่เป้าหมายหลักเสมอไป.
Cross-Site Scripting (XSS): เป็นการโจมตีที่มุ่งเป้าไปที่ "ฝั่งไคลเอ็นต์" (client-side attack) เพื่อรันสคริปต์ในเบราว์เซอร์ของผู้ใช้ ไม่ใช่การควบคุมระบบ.
Trojans (โทรจัน): สามารถให้ Backdoor Access ได้ แต่โดยทั่วไปแล้ว โทรจันมักจะปลอมตัวเป็นซอฟต์แวร์ที่ถูกต้องตามกฎหมาย และวัตถุประสงค์หลักอาจแตกต่างกันไปขึ้นอยู่กับประเภท.
** Question 9** Which of the following is not a protocol of the OSI layer three? Options: A SNMP B ICMP C IGMP D IP Correct Option: A SNMP Keywords for Exam: not a protocol, OSI layer three, network layer Detailed Explanation:
OSI Layer 3 (Network Layer): ชั้นนี้มีหน้าที่ในการ Routing แพ็กเก็ตข้อมูลระหว่างเครือข่ายต่างๆ.
SNMP (Simple Network Management Protocol): ทำงานที่ Application Layer (Layer 7) ของ OSI Model.
ICMP (Internet Control Message Protocol), IGMP (Internet Group Management Protocol) และ IP (Internet Protocol): ทั้งหมดนี้ทำงานที่ Layer 3 (Network Layer). ใช้สำหรับการสื่อสารเครือข่าย, การรายงานข้อผิดพลาด และการจัดการอุปกรณ์เครือข่าย. ข้อนี้ต้องจำว่าโปรโตคอลไหนอยู่ Layer ไหนให้ได้!
** Question 10** When a company hires an insurance company to mitigate risk, which risk management technique is being applied? Options: A risk avoidance B risk transfer C risk mitigation D risk tolerance Correct Option: B risk transfer Keywords for Exam: hires an insurance company, mitigate risk, risk management technique Detailed Explanation:
Risk Transfer (การถ่ายโอนความเสี่ยง): เป็นเทคนิคในการจัดการความเสี่ยงที่ "โอนความรับผิดชอบ" สำหรับความเสี่ยงนั้นๆ ไปยังบุคคลที่สาม เช่น การซื้อประกันภัย. ในกรณีนี้ บริษัทโอนความรับผิดชอบทางการเงินให้กับบริษัทประกันภัย หากเกิดความเสี่ยงขึ้น.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Risk Avoidance (การหลีกเลี่ยงความเสี่ยง): การหลีกเลี่ยงกิจกรรมหรือสถานการณ์ที่ทำให้เกิดความเสี่ยงโดยสิ้นเชิง.
Risk Mitigation / Reduction (การลดความเสี่ยง): การใช้มาตรการควบคุมเพื่อลดความเป็นไปได้หรือผลกระทบของความเสี่ยง.
Risk Tolerance / Acceptance (การยอมรับความเสี่ยง): การตัดสินใจยอมรับความเสี่ยงโดยไม่ใช้มาตรการควบคุมเพิ่มเติม.
** Question 11** The SMTP protocol that is simple mail transport protocol operates at which OSI layer? Options: A 7 B 25 C 3 D 23 Correct Option: A 7 Keywords for Exam: SMTP protocol, OSI layer, simple mail transfer protocol Detailed Explanation:
SMTP (Simple Mail Transfer Protocol): โปรโตคอลนี้ทำงานที่ Application Layer ซึ่งก็คือ OSI Layer 7. ชั้นนี้มีหน้าที่ในการจัดการการสื่อสารในระดับแอปพลิเคชัน เช่น อีเมล, การถ่ายโอนไฟล์ และการจัดการเครือข่าย. เป็น Layer ที่สูงที่สุดใน OSI Model.
ข้อมูลเพิ่มเติม (Bonus Point): SMTP ใช้ TCP Port หมายเลข 25 ในการทำงานด้วยนะ. จำคู่กันไปเลย!
** Question 12** The process of verifying or proving the user's identification is known as: Options: A confidentiality B integrity C authentication D authorization Correct Option: C authentication Keywords for Exam: verifying or proving, user's identification, security distinguishing Detailed Explanation:
Authentication (การยืนยันตัวตน): เป็นกระบวนการในการ "ตรวจสอบหรือพิสูจน์ตัวตน" ของผู้ใช้หรือระบบ. ทำให้แน่ใจว่าบุคคลหรือเอนทิตีที่พยายามเข้าถึงระบบเป็นผู้ที่พวกเขากล่าวอ้างว่าเป็นจริง. เช่น การล็อกอินด้วย username และ password.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Confidentiality (การรักษาความลับ): การปกป้องข้อมูลจากการเข้าถึงโดยไม่ได้รับอนุญาต.
Integrity (ความสมบูรณ์ของข้อมูล): การทำให้แน่ใจว่าข้อมูลถูกต้องและไม่ถูกเปลี่ยนแปลง.
Authorization (การให้สิทธิ์): การกำหนดระดับการเข้าถึงสำหรับผู้ใช้ที่ได้รับการยืนยันตัวตนแล้ว.
** Question 13** If an organization wants to protect itself against tailgating, which of the following types of access control would be most effective? Options: A locks B fences C barriers D turn styles Correct Option: D turn styles Keywords for Exam: protect against tailgating, access control, follows him or her Detailed Explanation:
Tailgating / Piggybacking (การตามหลัง): คือการที่บุคคลที่ไม่ได้รับอนุญาต "ตาม" บุคคลที่ได้รับอนุญาตเข้าไปในพื้นที่ปลอดภัยโดยไม่ต้องผ่านการยืนยันตัวตนของตนเอง.
Turnstiles (ประตูหมุน): เป็นกลไกควบคุมการเข้าออกทางกายภาพที่ออกแบบมาเพื่อ "อนุญาตให้คนผ่านได้ทีละคน" เท่านั้น. ทำให้มีประสิทธิภาพในการป้องกัน Tailgating สูงมาก. ผู้ใช้แต่ละคนจะต้องยืนยันตัวตนผ่านกลไกการเข้าถึง เช่น บัตรสมาร์ทการ์ด หรือไบโอเมตริกซ์ เพื่อเข้าสู่พื้นที่.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Locks (กุญแจ), Fences (รั้ว), และ Barriers (แผงกั้น): สามารถจำกัดการเข้าถึงได้ แต่ไม่สามารถควบคุมการเข้าออกทีละคนได้อย่างมีประสิทธิภาพเท่าประตูหมุน.
** Question 14** Logging and monitoring systems are essential to: Options: A identifying inefficient performing system preventing compromises and providing a record of how systems are used B identifying efficient performing system labeling compromises and providing a record of how systems are used C identifying inefficient performing system detecting compromises and providing a record of how systems are used D identifying efficient performing system detecting compromises and providing a record of how systems are used Correct Option: D identifying efficient performing system detecting compromises and providing a record of how systems are used Keywords for Exam: logging and monitoring systems, essential to, detecting compromises, record of how systems are used Detailed Explanation:
Logging and Monitoring Systems (ระบบบันทึกและตรวจสอบ): เป็นสิ่งสำคัญอย่างยิ่งสำหรับ:
การระบุประสิทธิภาพระบบ: (Identifying efficient/inefficient performing system) ช่วยให้เห็นว่าระบบทำงานได้ดีหรือไม่.
การตรวจจับการถูกเจาะระบบ: (Detecting compromises) สามารถตรวจจับกิจกรรมที่ผิดปกติหรือการบุกรุกที่อาจเกิดขึ้น.
การบันทึกการใช้งานระบบ: (Providing a record of how systems are used) มีบันทึกเหตุการณ์โดยละเอียดสำหรับการตรวจสอบ (auditing purposes) และการปฏิบัติตามข้อกำหนด.
ตัวเลือก D ครอบคลุมทั้งประสิทธิภาพ การตรวจจับการถูกเจาะ และการบันทึกการใช้งาน ซึ่งเป็นเป้าหมายหลักของระบบเหล่านี้.
** Question 15** In the event of a disaster, which of these should be the primary objective? Options: A guarantee the safety of the people B guarantee the continuity of critical systems C protection of the production database D replication of disaster communication Correct Option: A guarantee the safety of the people Keywords for Exam: disaster, primary objective, safety Detailed Explanation:
Primary Objective in Disaster (เป้าหมายหลักในภาวะภัยพิบัติ): ข้อนี้สำคัญที่สุด! ในสถานการณ์ภัยพิบัติใดๆ "ความปลอดภัยของบุคคล" (safety of people) จะต้องเป็นเป้าหมายหลักเสมอ. ชีวิตมนุษย์และความปลอดภัยต้องมาก่อนสิ่งอื่นใด รวมถึงการรักษาระบบที่สำคัญ หรือการปกป้องข้อมูล. นี่เป็นหลักการพื้นฐานในการวางแผนการกู้คืนระบบ (Disaster Recovery) และการดำเนินธุรกิจต่อเนื่อง (Business Continuity). ต้องจำให้ขึ้นใจเลย!
** Question 16** The process that ensures that system changes do not adversely impact business operation is known as: Options: A change management B vulnerability management C configuration management D inventory management Correct Option: A change management Keywords for Exam: system changes, do not adversely impact business operation, process ensures Detailed Explanation:
Change Management (การจัดการการเปลี่ยนแปลง): คือกระบวนการที่ออกแบบมาเพื่อให้แน่ใจว่า "การเปลี่ยนแปลงใดๆ" ที่เกิดขึ้นกับระบบ (เช่น การอัปเดต, การอัปเกรด, การเปลี่ยนแปลงการตั้งค่า) จะ "ไม่ส่งผลกระทบในทางลบ" ต่อการดำเนินธุรกิจ. รวมถึงการประเมิน, การอนุมัติ และการบันทึกการเปลี่ยนแปลงเพื่อลดความเสี่ยงและรับประกันความเสถียร.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Vulnerability Management: เน้นการระบุและแก้ไขจุดอ่อนด้านความปลอดภัย.
Configuration Management: ดูแลรักษารูปแบบการตั้งค่าของระบบ.
Inventory Management: เกี่ยวข้องกับการติดตามสินทรัพย์.
** Question 17** The last phase in the data security cycle is known as: Options: A encryption B backup C archival D Destruction Correct Option: D Destruction Keywords for Exam: last phase, data security cycle, securely destroyed Detailed Explanation:
Data Security Cycle (วงจรความปลอดภัยข้อมูล): เฟสสุดท้ายในวงจรความปลอดภัยข้อมูลคือ "การทำลาย" (Destruction). หลังจากข้อมูลได้ทำหน้าที่ของมันเสร็จสิ้นแล้ว จะต้องถูกทำลายอย่างปลอดภัยเพื่อป้องกันการเข้าถึงหรือการกู้คืนที่ไม่ได้รับอนุญาต. เฟสนี้ทำให้แน่ใจว่าข้อมูลที่ละเอียดอ่อนจะไม่สามารถเข้าถึงหรือกู้คืนได้อีกต่อไป.
ลำดับของวงจร (ตาม ISC2 - ต้องจำ!):
Create (สร้าง)
Store (จัดเก็บ)
Use (ใช้งาน)
Share (แบ่งปัน)
Archive (เก็บถาวร)
Destroy (ทำลาย)
Encryption, Backup และ Archival เป็นขั้นตอนสำคัญในการปกป้องข้อมูล แต่เกิดขึ้นก่อนหน้านี้ในวงจรการจัดการและรักษาความปลอดภัยข้อมูล.
** Question 18** Which access control model specifies access to an object based on the subject's role in the organization? Options: A orback that is role based access control B MAC mandatory access control C DAG discretionary access control D A back that is attribute based access control Correct Option: A robased access control Keywords for Exam: access control model, access to an object, based on the subject's role Detailed Explanation:
Role-Based Access Control (RBAC): กำหนดการเข้าถึงทรัพยากร (objects) โดยอิงจาก "บทบาท" (role) ของผู้ใช้ภายในองค์กร. ในโมเดลนี้ สิทธิ์จะถูกกำหนดให้กับบทบาท แทนที่จะเป็นรายบุคคล และผู้ใช้จะได้รับสิทธิ์ตามบทบาทของตน ทำให้การจัดการการเข้าถึงในองค์กรขนาดใหญ่เป็นเรื่องง่ายขึ้น.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Mandatory Access Control (MAC): บังคับใช้การเข้าถึงตาม "ป้ายกำกับความปลอดภัย" (security labels) มักใช้ในสภาพแวดล้อมที่ความปลอดภัยสูงมาก.
Discretionary Access Control (DAC): อนุญาตให้ "เจ้าของข้อมูล" (data owners) ควบคุมการเข้าถึงได้.
Attribute-Based Access Control (ABAC): ให้สิทธิ์การเข้าถึงโดยอิงจาก "คุณสมบัติ" (attributes) ของผู้ใช้, วัตถุ และสภาพแวดล้อม ทำให้ควบคุมได้ละเอียดและยืดหยุ่นมาก.
** Question 19** Which of the following is not an example of a physical control? Options: A firewalls B biometric access control C remote control electronic locks D security cameras Correct Option: A firewalls Keywords for Exam: not an example of a physical control Detailed Explanation:
Physical Controls (มาตรการควบคุมทางกายภาพ): มาตรการที่ใช้ในการจำกัดหรือตรวจสอบการเข้าถึงพื้นที่ทางกายภาพ.
Firewalls (ไฟร์วอลล์): ไม่ใช่ Physical Control แต่เป็น Logical หรือ Technical Security Control. ใช้เพื่อตรวจสอบและกรองทราฟฟิกเครือข่าย.
ตัวอย่าง Physical Controls:
Biometric Access Control (การควบคุมการเข้าถึงด้วยไบโอเมตริกซ์): เช่น การสแกนลายนิ้วมือ เพื่อจำกัดการเข้าถึงพื้นที่.
Remote Control Electronic Locks (ระบบล็อคอิเล็กทรอนิกส์ควบคุมระยะไกล): ควบคุมการเข้าออกประตู.
Security Cameras (กล้องวงจรปิด): ตรวจสอบและเฝ้าระวังพื้นที่.
** Question 20** Which type of attack will most effectively maintain remote access and control over the victim's computer? Options: A Trojans B fishing C cross scripting D root kits Correct Option: D root kits Keywords for Exam: most effectively maintain, remote access and control, victim's computer Detailed Explanation:
Rootkits: ถูกออกแบบมาเพื่อให้ "การเข้าถึงและการควบคุมระยะไกลอย่างต่อเนื่อง" (persistent remote access and control) เหนือคอมพิวเตอร์ของเหยื่อ. โดยจะซ่อนตัวจากการตรวจจับมาตรฐานและฝังตัวลึกเข้าไปในระบบปฏิบัติการ ทำให้ตรวจจับและลบออกได้ยาก.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Trojans: สามารถให้ Remote Access ได้ แต่ตรวจจับและลบได้ง่ายกว่า Rootkits.
Phishing: เป็นเทคนิคที่ใช้ในการขโมยข้อมูล ไม่ใช่เพื่อรักษาการควบคุม.
Cross-Site Scripting (XSS): มุ่งเป้าไปที่เว็บแอปพลิเคชัน ไม่ได้ให้การควบคุมคอมพิวเตอร์ของเหยื่อโดยตรง.
** Question 21** In incident terminology the meaning of zero day is: Options: A days to solve a previously unknown system vulnerability B a previously unknown system vulnerability C days without a cyber security incident D days with a cyber security incident Correct Option: B a previously unknown system vulnerability Keywords for Exam: incident terminology, zero day, previously unknown system vulnerability Detailed Explanation:
Zero-Day Vulnerability (ช่องโหว่ Zero-Day): หมายถึง "ช่องโหว่ของระบบที่ไม่เคยรู้จักมาก่อน" (previously unknown system vulnerability) ที่ถูกผู้โจมตีใช้ประโยชน์ก่อนที่ผู้จำหน่ายซอฟต์แวร์จะมีโอกาสแก้ไขด้วย Patch หรือ Fix ได้. คำว่า "Zero-Day" บ่งชี้ว่าช่องโหว่ถูกโจมตีในวันแรกที่ถูกค้นพบ โดยไม่มีความรู้ล่วงหน้าหรือมาตรการป้องกันใดๆ ที่มีอยู่. จำเป็นต้องรู้เรื่องนี้ให้ดีเลย!
** Question 22** A device found not to comply with the security baseline should be: Options: A disabled or separated into a quarantine area until a virus scan can be run B disabled or isolated into a quarantine area until it can be checked and updated C placed in a demilitarized zone until it can be reviewed and updated D marked as potentially vulnerable and placed in a quarantine area Correct Option: B disabled or isolated into a quarantine area until it can be checked and updated Keywords for Exam: not to comply with the security baseline, disabled or isolated, quarantine area, checked and updated Detailed Explanation:
อุปกรณ์ที่ไม่เป็นไปตาม Security Baseline (ฐานความปลอดภัย): หากอุปกรณ์ไม่เป็นไปตามมาตรฐานความปลอดภัยที่กำหนด (Security Baseline) ควรถูก "แยกออกจากเครือข่าย" หรือ "กักกัน" (isolated or placed into a quarantine area) เพื่อป้องกันไม่ให้มันนำความเสี่ยงเข้ามาสู่เครือข่าย. จากนั้นจะต้องตรวจสอบ, อัปเดต และทำให้เป็นไปตามมาตรฐานความปลอดภัยก่อนที่จะได้รับอนุญาตให้เข้าถึงเครือข่ายได้อย่างเต็มที่อีกครั้ง.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
A: อาจจะใช้ได้ถ้ากังวลเรื่องไวรัส แต่ B ครอบคลุมกว่าในการจัดการกับการไม่ปฏิบัติตามมาตรฐานความปลอดภัยโดยรวม.
C: DMZ (Demilitarized Zone) ใช้สำหรับบริการที่เปิดเผยต่อสาธารณะ ไม่ใช่ที่สำหรับอุปกรณ์ที่ไม่ปฏิบัติตามมาตรฐาน.
D: การทำเครื่องหมายว่า "อาจมีช่องโหว่" อย่างเดียวไม่พอ ต้องกักกันและแก้ไขด้วย.
** Question 23** Which type of attack primarily aims to make a resource inaccessible to its intended users? Options: A denial of service B fishing C trojans D cross- site scripting Correct Option: A denial of service Keywords for Exam: primarily aims, make a resource inaccessible, intended users Detailed Explanation:
Denial of Service (DoS) Attack (การโจมตีแบบปฏิเสธการให้บริการ): มีเป้าหมายหลักคือ "การทำให้ทรัพยากร" เช่น เซิร์ฟเวอร์, เว็บไซต์ หรือเครือข่าย "ไม่สามารถเข้าถึงได้" สำหรับผู้ใช้ที่ตั้งใจจะใช้งาน. โดยการโจมตีนี้จะทำให้ระบบทำงานหนักเกินไปหรือใช้ช่องโหว่เพื่อขัดขวางการบริการปกติ. เป้าหมายหลักคือ "การขัดขวางการบริการ".
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Phishing: หลอกผู้ใช้ให้เปิดเผยข้อมูลที่ละเอียดอ่อน.
Trojans: ซอฟต์แวร์ประสงค์ร้ายที่ให้การเข้าถึงระบบโดยไม่ได้รับอนุญาต.
Cross-Site Scripting (XSS): ฉีดสคริปต์ที่เป็นอันตรายเข้าไปในหน้าเว็บ.
** Question 24** Which type of attack embeds malicious payload inside a reputable or trusted software? Options: A trojans B fishing C root kit D cross-site scripting Correct Option: A Trojan horse Keywords for Exam: embeds malicious payload, reputable or trusted software, disguise themselves as legitimate Detailed Explanation:
Trojan Horse (โทรจัน): คือโปรแกรมประสงค์ร้ายที่ "ปลอมตัว" เป็นซอฟต์แวร์ที่ถูกต้องตามกฎหมายหรือน่าเชื่อถือ. โดยมักจะซ่อน payload ที่เป็นอันตรายไว้ภายในซอฟต์แวร์ที่น่าเชื่อถือนั้น. เมื่อถูกเรียกใช้งาน สามารถดำเนินการที่เป็นอันตรายได้ เช่น การให้การเข้าถึงระบบโดยไม่ได้รับอนุญาต หรือการขโมยข้อมูล. โทรจันต่างจากไวรัสตรงที่ "ไม่สามารถจำลองตัวเองได้".
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Phishing: หลอกผู้ใช้ให้เปิดเผยข้อมูลผ่านอีเมลหรือเว็บไซต์ปลอม.
Rootkits: ถูกออกแบบมาเพื่อซ่อนการมีอยู่ของกิจกรรมหรือซอฟต์แวร์ที่เป็นอันตรายในระบบ.
Cross-Site Scripting (XSS): เกี่ยวข้องกับการฉีดสคริปต์ที่เป็นอันตรายเข้าไปในเว็บแอปพลิเคชัน.
** Question 25** Which tool is commonly used to sniff network traffic? Options: A B suit B John the Ripper C W shark D NS lookup Correct Option: C Wireshark Keywords for Exam: sniff network traffic, network protocol analyzer, packet sniffer Detailed Explanation:
Wireshark: เป็นโปรแกรมวิเคราะห์โปรโตคอลเครือข่าย (network protocol analyzer) หรือ Packet Sniffer ที่ใช้กันอย่างแพร่หลาย. มันสามารถ "ดักจับและตรวจสอบทราฟฟิกเครือข่ายได้แบบเรียลไทม์". ช่วยให้ผู้ใช้สามารถวิเคราะห์การสื่อสารเครือข่าย, แก้ไขปัญหาเครือข่าย และตรวจจับกิจกรรมที่น่าสงสัย.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Burp Suite: เป็นเครื่องมือทดสอบความปลอดภัยที่ใช้สำหรับการประเมินความปลอดภัยของเว็บแอปพลิเคชันเป็นหลัก.
John the Ripper: เป็นเครื่องมือถอดรหัสรหัสผ่าน (password cracking tool) ใช้สำหรับการตรวจสอบความปลอดภัย.
NSLookup: เป็นเครื่องมือ Command Line ที่ใช้สอบถาม DNS records.
** Question 26** Which of these is not an attack against NIP network? Options: A side channel attack B men in the middle attack C fragmented packet attack D oversized packet attack Correct Option: A side channel attack Keywords for Exam: not an attack against NIP network, IP network Detailed Explanation:
Side-Channel Attack (การโจมตีแบบช่องทางข้างเคียง): เป็นการโจมตีที่ "ไม่ได้มุ่งเป้าไปที่เครือข่าย IP โดยตรง". แต่จะใช้ประโยชน์จากปัจจัยทางกายภาพหรือสภาพแวดล้อม เช่น การใช้พลังงาน, เวลา หรือการรั่วไหลของคลื่นแม่เหล็กไฟฟ้า เพื่อรวบรวมข้อมูลจากระบบ. มักมีเป้าหมายเพื่อถอดรหัส หรือดึงข้อมูลลับจากอุปกรณ์.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Man-in-the-Middle (MITM) attack, Fragmented Packet attack และ Oversized Packet attack ล้วนเป็นการโจมตีที่มุ่งเป้าไปที่เครือข่าย IP โดยตรง [No direct source, but general knowledge. Would state this is external information if explicitly asked to only use sources. Given the prompt, I infer that these are implicitly network attacks].
** Question 27** The detailed steps to complete task supporting departmental or organizational policies are typically documented in: Options: A regulations B standards C policies D procedures Correct Option: D procedures Keywords for Exam: detailed steps to complete task, supporting policies, documented in Detailed Explanation:
Procedures (ขั้นตอนการปฏิบัติงาน): คือ "คำแนะนำทีละขั้นตอนโดยละเอียด" ที่อธิบายวิธีการดำเนินงานหรือกิจกรรมเฉพาะ เพื่อสนับสนุนการนำนโยบายและมาตรฐานไปใช้. มันให้ความชัดเจนเกี่ยวกับวิธีการปฏิบัติงานที่ถูกต้องเพื่อให้บรรลุเป้าหมายขององค์กรหรือแผนก. (จำไว้ว่า Procedures จะละเอียดกว่า Policies และ Standards)
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Regulations (ข้อบังคับ): ข้อกำหนดทางกฎหมายที่ต้องปฏิบัติตาม.
Standards (มาตรฐาน): กำหนดข้อกำหนดหรือเกณฑ์มาตรฐานเฉพาะที่ต้องบรรลุ แต่โดยทั่วไปไม่ได้รวมคำแนะนำทีละขั้นตอนโดยละเอียด.
Policies (นโยบาย): หลักการหรือกฎระดับสูงที่ชี้นำการตัดสินใจและพฤติกรรมภายในองค์กร.
** Question 28** Which device is used to connect a LAN to the internet? Options: A seam that is security information and event management B HIDS that is hostbased intrusion detection system C router D firewall Correct Option: C router Keywords for Exam: connect a LAN to the internet, device, routes data packets Detailed Explanation:
Router (เราเตอร์): โดยทั่วไปเราเตอร์จะใช้ในการ "เชื่อมต่อเครือข่ายท้องถิ่น (LAN) เข้ากับอินเทอร์เน็ต". มันจะทำหน้าที่ส่งต่อแพ็กเก็ตข้อมูลระหว่างเครือข่ายท้องถิ่นและเครือข่ายภายนอก เช่น อินเทอร์เน็ต. เราเตอร์มักจะกำหนด IP Address ให้กับอุปกรณ์ใน LAN ด้วย.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
SIEM (Security Information and Event Management): เป็นเครื่องมือที่ใช้รวบรวมและวิเคราะห์ข้อมูลความปลอดภัย.
HIDS (Host Intrusion Detection System): ตรวจสอบและปกป้องอุปกรณ์แต่ละเครื่อง.
Firewall (ไฟร์วอลล์): ใช้ควบคุมและตรวจสอบทราฟฟิกเครือข่ายตามกฎความปลอดภัย แต่ไม่ได้เชื่อมต่อ LAN เข้ากับอินเทอร์เน็ตโดยตรง. เราเตอร์มักจะทำงานร่วมกับไฟร์วอลล์เพื่อรักษาความปลอดภัยของเครือข่าย.
** Question 29** What does seam means what does seam stands for in the options are option A security information and enterprise manager option B security information and event manager option C security information and enterprise manager and option D security information and event manager so in fact we have two options the two options are basically repeated but the correct option is option B security information and event manager so seam stands for security information and event manager it is a system that collects analyzes and reports on security data from various sources within an organization to detect and respond to potential security threats same systems are used to provide real timing realtime monitoring logging and event management to enhance security posture Correct Option: B security information and event manager Keywords for Exam: SIEM stands for, collects analyzes reports, security data, detect respond to security threats Detailed Explanation:
SIEM (Security Information and Event Management): ย่อมาจาก "Security Information and Event Management". มันเป็นระบบที่ "รวบรวม, วิเคราะห์ และรายงาน" ข้อมูลด้านความปลอดภัยจากแหล่งต่างๆ ภายในองค์กร เพื่อตรวจจับและตอบสนองต่อภัยคุกคามด้านความปลอดภัยที่อาจเกิดขึ้น. ระบบ SIEM ใช้สำหรับการตรวจสอบแบบเรียลไทม์, การบันทึกข้อมูล และการจัดการเหตุการณ์ เพื่อเพิ่มประสิทธิภาพการรักษาความปลอดภัย. ต้องจำตัวย่อและหน้าที่หลักให้ได้นะ!
** Question 30** A security safeguard is the same as A and the options are option A safety control option B privacy control option C security control and option D security principle and the correct option is option C security control a security safeguard refers to measures or controls implemented to protect information systems data and assets from security threats it is synonymous with a security control which refers to any mechanism or practice designed to mitigate security risk and protect the confidentiality integrity and availability of systems and data Correct Option: C security control Keywords for Exam: security safeguard, same as, mitigate security risk, protect Confidentiality Integrity and Availability (CIA) Detailed Explanation:
Security Safeguard (มาตรการรักษาความปลอดภัย): หมายถึง มาตรการหรือการควบคุมที่นำมาใช้เพื่อปกป้องระบบข้อมูล, ข้อมูล และสินทรัพย์จากภัยคุกคามด้านความปลอดภัย. เป็นคำที่มีความหมายเหมือนกับ "Security Control" (การควบคุมความปลอดภัย) ซึ่งหมายถึงกลไกหรือแนวปฏิบัติใดๆ ที่ออกแบบมาเพื่อลดความเสี่ยงด้านความปลอดภัย และปกป้อง Confidentiality (ความลับ), Integrity (ความสมบูรณ์) และ Availability (ความพร้อมใช้งาน) ของระบบและข้อมูล (CIA Triad).
** Question 31** Which access control model can grant access to a given object based on complex rules? Options: A deck discretionary access control B A that is attributes attribute based access control C arback that is role based access control D mac is mandatory access control Correct Option: B attribute based access control Keywords for Exam: access control model, grant access, based on complex rules, attributes Detailed Explanation:
Attribute-Based Access Control (ABAC): ให้สิทธิ์การเข้าถึงวัตถุโดยอิงจาก "กฎที่ซับซ้อน" (complex rules) ซึ่งประเมิน "คุณสมบัติ" (attributes) ที่เกี่ยวข้องกับผู้ใช้, วัตถุ และสภาพแวดล้อม. กฎเหล่านี้สามารถรวมคุณสมบัติต่างๆ เช่น บทบาท, สถานที่, เวลาในการเข้าถึง หรือปัจจัยทางสิ่งแวดล้อมอื่นๆ ทำให้สามารถควบคุมการเข้าถึงได้อย่างละเอียดและยืดหยุ่น. จำคำว่า "complex rules" หรือ "attributes" ได้ จะตอบ ABAC ได้ทันที!
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Discretionary Access Control (DAC): อนุญาตให้เจ้าของวัตถุตัดสินใจว่าใครสามารถเข้าถึงได้ มักใช้สิทธิ์ที่เรียบง่าย.
Role-Based Access Control (RBAC): ให้สิทธิ์ตามบทบาทของผู้ใช้ภายในองค์กร ซึ่งมักจำกัดอยู่เฉพาะบทบาทและสิทธิ์ที่กำหนดไว้ล่วงหน้า.
Mandatory Access Control (MAC): บังคับใช้การเข้าถึงตามป้ายกำกับความปลอดภัยและนโยบาย มักใช้ในสภาพแวดล้อมที่ความปลอดภัยสูง.
** Question 32** Which port is used to secure communication over the web that is HTTPS? Options: A 69 B 80 C 25 D 443 Correct Option: D 443 Keywords for Exam: port is used, secure communication over the web, HTTPS Detailed Explanation:
HTTPS (Hypertext Transfer Protocol Secure): ใช้ Port หมายเลข 443 สำหรับการสื่อสารที่ปลอดภัยบนเว็บ. HTTPS เข้ารหัสข้อมูลที่แลกเปลี่ยนระหว่างเว็บเบราว์เซอร์และเซิร์ฟเวอร์โดยใช้โปรโตคอลเช่น SSL/TLS เพื่อรับรองความลับและความสมบูรณ์.
ต้องจำ Port อื่นๆ ด้วย!:
Port 80: ใช้สำหรับ HTTP ซึ่งเป็นการสื่อสารที่ไม่ปลอดภัย.
Port 25: ใช้สำหรับ SMTP (Simple Mail Transfer Protocol) สำหรับการส่งอีเมล.
Port 69: ใช้สำหรับ TFTP (Trivial File Transfer Protocol).
Port 161: ใช้สำหรับ SNMP (Simple Network Management Protocol) .
Port 22: ใช้สำหรับ SSH (Secure Shell) .
** Question 33** Which of these has the primary objective of identifying and prioritizing critical business processes? Options: A business impact analysis B business impact analysis C disaster recovery plan D business continuity plan Correct Option: A business impact analysis Keywords for Exam: primary objective, identifying and prioritizing critical business processes Detailed Explanation:
Business Impact Analysis (BIA): มีวัตถุประสงค์หลักคือ "การระบุและจัดลำดับความสำคัญของกระบวนการทางธุรกิจที่สำคัญ" (identifying and prioritizing critical business processes). BIA จะประเมินผลกระทบที่อาจเกิดขึ้นจากการหยุดชะงักของกระบวนการเหล่านั้น และช่วยให้องค์กรกำหนดทรัพยากรและกลยุทธ์การกู้คืนที่จำเป็นเพื่อรักษาการทำงานที่สำคัญไว้ในระหว่างเกิดภัยพิบัติ. (BIA เป็นขั้นตอนแรกในการพัฒนา Business Continuity Plan - BCP)
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Business Impact Plan: ไม่ใช่คำมาตรฐานในการวางแผน Business Continuity หรือ Disaster Recovery.
Disaster Recovery Plan (DRP): เน้นที่การกู้คืนระบบ IT และข้อมูลหลังภัยพิบัติ ไม่ได้เน้นการระบุกระบวนการทางธุรกิจที่สำคัญโดยตรง.
Business Continuity Plan (BCP): เป็นแผนที่กว้างกว่าซึ่งรวมถึงกลยุทธ์ในการรักษาการดำเนินธุรกิจที่สำคัญในระหว่างและหลังการหยุดชะงัก. (แต่ BIA คือขั้นตอนแรกของ BCP)
** Question 34** Which of the following are not types of security control? Options: A common control B hybrid control C system specific control D storage control Correct Option: D storage control Keywords for Exam: not types of security control Detailed Explanation:
ประเภทของ Security Controls (ต้องจำ!):
Common Control: การควบคุมความปลอดภัยที่ใช้กับหลายระบบหรือหน่วยงานขององค์กร.
Hybrid Control: การควบคุมที่รวมเอาลักษณะของ Common และ System-Specific Control เข้าด้วยกัน.
System-Specific Control: การควบคุมที่ปรับให้เหมาะกับระบบหรือสภาพแวดล้อมเฉพาะ.
Storage Control (การควบคุมการจัดเก็บ): ไม่ใช่ประเภทมาตรฐานของการควบคุมความปลอดภัย. แม้ว่าความปลอดภัยในการจัดเก็บข้อมูลจะสำคัญและอาจเกี่ยวข้องกับการควบคุมต่างๆ เช่น การเข้ารหัส หรือการจำกัดการเข้าถึง แต่ก็ไม่ได้ถูกจัดประเภทเป็นประเภทเฉพาะของการควบคุมความปลอดภัย.
** Question 35** Which of the following is not a type of learning activity used in security awareness? Options: A awareness B training C education D tutorial Correct Option: D tutorial Keywords for Exam: not a type of learning activity, security awareness Detailed Explanation:
ประเภทของกิจกรรมการเรียนรู้ใน Security Awareness (ต้องจำ!):
Awareness (การสร้างความตระหนัก): กิจกรรมที่มุ่งเน้นให้ผู้ใช้รับรู้ถึงความเสี่ยงด้านความปลอดภัยและแนวปฏิบัติที่ดีที่สุด มักเกี่ยวข้องกับเนื้อหาสั้นๆ ระดับสูง เช่น โปสเตอร์ หรือการนำเสนอสั้นๆ.
Training (การฝึกอบรม): กิจกรรมการเรียนรู้ที่ลงลึกมากขึ้น ซึ่งให้ความรู้และทักษะที่จำเป็นในการจัดการกับงานหรือขั้นตอนที่เกี่ยวข้องกับความปลอดภัย.
Education (การศึกษา): เน้นความเข้าใจในระยะยาวเกี่ยวกับแนวคิดด้านความปลอดภัย มักจัดทำผ่านหลักสูตรหรือชั้นเรียนอย่างเป็นทางการ.
Tutorial (บทเรียน): เป็น "วิธีการหรือรูปแบบเฉพาะ" ในการนำเสนอเนื้อหาการเรียนรู้ แต่ไม่ใช่ประเภทกิจกรรมการเรียนรู้หลักในโปรแกรม Security Awareness. อาจเป็นส่วนหนึ่งของการฝึกอบรมหรือการศึกษาได้.
** Question 36** The magnitude of the harm expected as a result of the consequences of an unauthorized disclosure modification destruction or loss of information is known as: Options: A vulnerability B threat C impact D likelihood Correct Option: C impact Keywords for Exam: magnitude of the harm, consequences of an unauthorized disclosure modification destruction or loss of information Detailed Explanation:
Impact (ผลกระทบ): หมายถึง "ขนาดของความเสียหาย" (magnitude of harm) ที่อาจเกิดขึ้นจากการเปิดเผย, การแก้ไข, การทำลาย หรือการสูญหายของข้อมูลโดยไม่ได้รับอนุญาต. เป็นการวัดความรุนแรงของผลที่ตามมาหากเกิดเหตุการณ์ด้านความปลอดภัย.
Risk Management Terms (ต้องจำคู่กัน!):
Vulnerability (ช่องโหว่): จุดอ่อนในระบบที่สามารถถูกโจมตีได้.
Threat (ภัยคุกคาม): เหตุการณ์หรือผู้กระทำที่อาจใช้ประโยชน์จากช่องโหว่เพื่อก่อให้เกิดความเสียหาย.
Likelihood (ความเป็นไปได้): ความน่าจะเป็นที่ภัยคุกคามจะใช้ประโยชน์จากช่องโหว่และนำไปสู่ผลกระทบ.
Risk (ความเสี่ยง): ผลรวมของ Threat, Vulnerability และ Impact (และ Likelihood).
** Question 37** The implementation of security controls is a form of: Options: A risk reduction B risk acceptance C risk avoidance D risk transference Correct Option: A risk reduction Keywords for Exam: implementation of security controls, form of, mitigate or lessen the likelihood and impact Detailed Explanation:
Risk Reduction (การลดความเสี่ยง): การนำมาตรการควบคุมความปลอดภัยมาใช้ถือเป็นรูปแบบหนึ่งของการ "ลดความเสี่ยง". เพราะมันช่วยบรรเทาหรือลดความเป็นไปได้และผลกระทบของภัยคุกคามด้านความปลอดภัยที่อาจเกิดขึ้น.
ทำไมถึงไม่ใช่ตัวเลือกอื่น: (ทบทวนจากข้อ 10)
Risk Acceptance (การยอมรับความเสี่ยง): การตัดสินใจยอมรับความเสี่ยงโดยไม่มีมาตรการควบคุมเพิ่มเติม.
Risk Avoidance (การหลีกเลี่ยงความเสี่ยง): การกระทำเพื่อกำจัดหรือหลีกเลี่ยงความเสี่ยงโดยสิ้นเชิง.
Risk Transference (การถ่ายโอนความเสี่ยง): การโอนความเสี่ยงไปยังบุคคลที่สาม เช่น การซื้อประกันภัย.
** Question 38** Which of the following attack take advantage advantage of poor input validation in websites? Options: A Trojans B cross-site scripting C fishing D root kits Correct Option: B cross-site scripting Keywords for Exam: attack, take advantage of, poor input validation, websites Detailed Explanation:
Cross-Site Scripting (XSS): เป็นการโจมตีที่ใช้ประโยชน์จาก "การตรวจสอบข้อมูลเข้าที่ไม่ดี" (poor input validation) ในเว็บไซต์. เกี่ยวข้องกับการฉีดสคริปต์ที่เป็นอันตรายเข้าไปในหน้าเว็บที่ผู้ใช้อื่นดู. สคริปต์เหล่านี้สามารถดำเนินการในนามของผู้ใช้ หรือขโมยข้อมูลที่ละเอียดอ่อน เช่น Session Cookies.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Trojans: เป็นมัลแวร์ที่ปลอมตัว.
Phishing: เป็นการโจมตีทางสังคม (social engineering).
Rootkits: เป็นมัลแวร์ที่ออกแบบมาเพื่อซ่อนการมีอยู่ของกระบวนการหรือโปรแกรม.
** Question 39** Which of the following is an example of an administrative security control? Options: A excess control list B acceptable use policies C badge readers D no entry signs Correct Option: B acceptable use policies Keywords for Exam: example, administrative security control, written policies, non-technical Detailed Explanation:
Administrative Security Controls (มาตรการควบคุมความปลอดภัยเชิงบริหาร): โดยทั่วไปแล้วเป็นมาตรการที่ไม่ใช่ทางเทคนิค และเกี่ยวข้องกับกระบวนการจัดการ, ขั้นตอน และนโยบายเพื่อกำกับแนวปฏิบัติด้านความปลอดภัย.
Acceptable Use Policies (AUP) (นโยบายการใช้งานที่ยอมรับได้): เป็นตัวอย่างของ Administrative Control. นโยบายเหล่านี้เป็นลายลักษณ์อักษรที่กำหนดพฤติกรรมที่ยอมรับได้และไม่ได้รับอนุญาตสำหรับผู้ใช้ภายในสภาพแวดล้อม IT ขององค์กร.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Access Control List (ACL): เป็น Technical Control ที่กำหนดสิทธิ์การเข้าถึงทรัพยากรในระบบ.
Badge Readers (เครื่องอ่านบัตร) และ No Entry Signs (ป้ายห้ามเข้า): เป็น Physical Security Controls ที่ใช้จำกัดการเข้าถึงพื้นที่ทางกายภาพ.
** Question 40** In change management which component address the procedures needed to undo changes? Options: A request for approval B request for change C roll back D disaster and recover Correct Option: C roll back Keywords for Exam: change management, component, procedures needed to undo changes, revert to previous state Detailed Explanation:
Rollback (การย้อนกลับ): ใน Change Management, Rollback คือส่วนประกอบที่ระบุขั้นตอนที่จำเป็นในการ "ยกเลิกการเปลี่ยนแปลง" (undo changes). มันกำหนดวิธีการคืนค่าระบบหรือกระบวนการกลับไปสู่สถานะก่อนหน้า หากการเปลี่ยนแปลงที่นำไปใช้ทำให้เกิดปัญหาหรือความล้มเหลว.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Request for Approval: เป็นส่วนหนึ่งของกระบวนการที่การเปลี่ยนแปลงได้รับการตรวจสอบและอนุมัติ.
Request for Change (RFC): เป็นเอกสารทางการที่ยื่นเสนอการเปลี่ยนแปลง.
Disaster and Recovery: ไม่เกี่ยวข้องโดยตรงกับการยกเลิกการเปลี่ยนแปลงเฉพาะ แต่หมายถึงกระบวนการที่กว้างขึ้นสำหรับการกู้คืนจากความขัดข้องที่สำคัญ.
** Question 41** Which of the following properties is not guaranteed by digital signatures? Options: A Authentication B confidentiality C nonrepudiation D integrity Correct Option: B confidentiality Keywords for Exam: not guaranteed, digital signatures, properties Detailed Explanation:
Digital Signatures (ลายเซ็นดิจิทัล): สามารถให้ Authentication (การยืนยันตัวตน), Integrity (ความสมบูรณ์ของข้อมูล) และ Non-Repudiation (การไม่สามารถปฏิเสธความรับผิดชอบได้). ลายเซ็นดิจิทัลช่วยให้ผู้รับสามารถตรวจสอบตัวตนของผู้ส่ง, ยืนยันว่าข้อความไม่ถูกเปลี่ยนแปลง และรับรองว่าผู้ส่งไม่สามารถปฏิเสธว่าไม่ได้ส่งข้อความนั้นได้.
อย่างไรก็ตาม "Confidentiality (การรักษาความลับ)" ไม่ใช่คุณสมบัติที่ลายเซ็นดิจิทัลรับรองได้. การรักษาความลับต้องอาศัยการเข้ารหัส (encryption). จำให้แม่นว่าลายเซ็นดิจิทัลมีหน้าที่อะไรและไม่มีหน้าที่อะไร!
** Question 42** Which devices have the primary objective of collecting and analyzing security events? Options: A hubs B firewalls C router D same that is security information and event management Correct Option: D SIEM that is security information and event management Keywords for Exam: primary objective, collecting and analyzing security events, SIEM Detailed Explanation:
SIEM (Security Information and Event Management): ระบบ SIEM ถูกออกแบบมาโดยเฉพาะเพื่อ "รวบรวม, วิเคราะห์ และเชื่อมโยง" เหตุการณ์ด้านความปลอดภัยจากแหล่งต่างๆ ทั่วทั้งเครือข่าย. เป้าหมายหลักของ SIEM คือการให้การตรวจสอบและวิเคราะห์ความปลอดภัยที่ครอบคลุม ทำให้สามารถตรวจจับและตอบสนองต่อภัยคุกคามได้ดีขึ้น. (ทบทวนจากข้อ 29)
** Question 43** What is an effective way of hardening a system? Options: A page the system B have an IDS in place ids is intrusion detection system C run a vulnerability scan D create a DMZ for web application services Correct Option: A page the system Keywords for Exam: effective way, hardening a system, applying patches, addresses known vulnerabilities Detailed Explanation:
Hardening a System (การเสริมความแข็งแกร่งของระบบ): การ "Patch ระบบ" (patch the system) เป็นวิธีพื้นฐานและมีประสิทธิภาพในการเสริมความแข็งแกร่งของระบบ. การใช้ Patch จะช่วยแก้ไขช่องโหว่ที่ทราบ ลดความเสี่ยงของการถูกโจมตี.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
การมี IDS, การรัน Vulnerability Scan และการสร้าง DMZ เป็นมาตรการด้านความปลอดภัยที่มีคุณค่าเช่นกัน แต่ "ไม่ใช่วิธีการโดยตรงในการเสริมความแข็งแกร่งของระบบเฉพาะ". แต่เป็นวิธีในการตรวจจับปัญหา หรือเพิ่มความปลอดภัยในระดับเครือข่าย.
** Question 44** Which type of key can be used to both encrypt and decrypt the same message? Options: A a public key B a private key C an A symmetric key D A symmetric key Correct Option: D A symmetric key Keywords for Exam: key, used to both encrypt and decrypt, same message Detailed Explanation:
Symmetric Encryption (การเข้ารหัสแบบสมมาตร): เป็นการเข้ารหัสที่ "ใช้กุญแจเดียวกัน" ในการทั้งเข้ารหัสและถอดรหัสข้อความ. กุญแจนี้จะถูกแชร์กันระหว่างผู้ส่งและผู้รับ.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Asymmetric Encryption (การเข้ารหัสแบบอสมมาตร): ใช้คู่กุญแจ (Key Pair) คือ Public Key (กุญแจสาธารณะ) และ Private Key (กุญแจส่วนตัว). กุญแจหนึ่งใช้สำหรับเข้ารหัส และอีกกุญแจหนึ่งใช้สำหรับถอดรหัส. (Public Key กับ Private Key ก็อยู่ในกลุ่ม Asymmetric)
** Question 45** Which regulations address data protection and privacy in Europe? Options: A socks B HIPPA C FSMA D GPR Correct Option: D GPR Keywords for Exam: regulations, data protection and privacy, Europe Detailed Explanation:
GDPR (General Data Protection Regulation): เป็นข้อบังคับในยุโรปที่เน้นการคุ้มครองข้อมูลและความเป็นส่วนตัวสำหรับบุคคลภายในสหภาพยุโรป (European Union). กำหนดแนวทางที่เข้มงวดว่าข้อมูลส่วนบุคคลจะต้องถูกรวบรวม, ประมวลผล และจัดเก็บอย่างไร โดยเน้นการปกป้องความเป็นส่วนตัวของบุคคล.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
SOX (Sarbanes-Oxley Act): เกี่ยวกับรายงานทางการเงิน (Financial Reporting).
HIPAA (Health Insurance Portability and Accountability Act): สำหรับข้อมูลสุขภาพ (Healthcare Data Protection) หรือ PHI (Protected Health Information).
FISMA (Federal Information Security Management Act): เป็นกฎหมายด้านความมั่นคงปลอดภัยข้อมูลของรัฐบาลกลางสหรัฐฯ.
ข้อสำคัญ: SOX, HIPAA, FISMA ใช้ในสหรัฐอเมริกา. GDPR ใช้ในยุโรป.
** Question 46** Which of the following types of devices inspect packet header information to either allow or deny network traffic? Options: A hubs B firewalls C router D switches Correct Option: B firewalls Keywords for Exam: inspect packet header information, allow or deny network traffic, security device Detailed Explanation:
Firewall (ไฟร์วอลล์): เป็นอุปกรณ์รักษาความปลอดภัยที่ใช้ในการ "ตรวจสอบข้อมูลใน Header ของแพ็กเก็ต" (inspect packet header information) เพื่อตัดสินใจว่าจะอนุญาตหรือปฏิเสธทราฟฟิกเครือข่ายหรือไม่ โดยอิงจากกฎความปลอดภัยที่กำหนดไว้ล่วงหน้า. ไฟร์วอลล์ทำหน้าที่เป็นกำแพงกั้นระหว่างเครือข่าย.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Routers: ส่งต่อข้อมูลเป็นหลัก.
Switches: ส่งต่อข้อมูลภายในเครือข่าย.
Hubs: ไม่ตรวจสอบแพ็กเก็ต เพียงแค่กระจายทราฟฟิกไปยังอุปกรณ์ที่เชื่อมต่อทั้งหมด.
** Question 47** A web server that accepts request from external clients should be placed in which network? Options: A internet B DMZ C internal network D VPN Correct Option: B DMZ Keywords for Exam: web server, accepts request from external clients, placed in which network, extra layer of security Detailed Explanation:
DMZ (Demilitarized Zone): เป็นส่วนของเครือข่ายที่แยกออกมาต่างหาก (separate network segment) ซึ่งให้ "ชั้นความปลอดภัยพิเศษ" (extra layer of security) สำหรับบริการที่เข้าถึงได้จากภายนอก เช่น เว็บเซิร์ฟเวอร์. การวางเว็บเซิร์ฟเวอร์ใน DMZ ช่วยให้ไคลเอ็นต์ภายนอกสามารถเข้าถึงได้โดยไม่ต้องให้เข้าถึงเครือข่ายภายในโดยตรง.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Internet: เป็นเครือข่ายสาธารณะ.
Internal Network: สำหรับผู้ใช้ภายในเท่านั้น.
VPN (Virtual Private Network): ใช้สำหรับการเข้าถึงระยะไกลที่ปลอดภัย ไม่ใช่การโฮสต์บริการสาธารณะ.
** Question 48** How many data labels are considered good practice? Options: A 2 to 3 B 1 C 1 to 2 D greater than 4 Correct Option: A 2 to 3 Keywords for Exam: data labels, good practice, balance between simplicity and effective data classification Detailed Explanation:
Data Labels (การติดป้ายกำกับข้อมูล): ตามหลักปฏิบัติที่ดี การมี Data Labels ประมาณ 2-3 ระดับ ถือว่าเหมาะสม. เพราะมันสร้าง "ความสมดุล" (balance) ระหว่างความเรียบง่าย (simplicity) และการจำแนกข้อมูลที่มีประสิทธิภาพ. ช่วยให้ผู้ใช้เข้าใจและใช้ป้ายกำกับได้อย่างถูกต้องโดยไม่รู้สึกยุ่งยากเกินไป.
การมีป้ายกำกับน้อยเกินไปอาจจะไม่สามารถแยกความแตกต่างที่จำเป็นได้ ส่วนการมีมากเกินไปอาจทำให้เกิดความสับสนและไม่สอดคล้องกันในการจัดการข้อมูล.
** Question 49** Security posters are an element an are an element primarily employed in: Options: A security awareness B incidents response plans C business continuity plans D physical security controls Correct Option: A security awareness Keywords for Exam: security posters, primarily employed in, educate and remind employees, promote a security conscious culture Detailed Explanation:
Security Posters (โปสเตอร์ความปลอดภัย): ถูกนำมาใช้เป็นหลักในโปรแกรม "Security Awareness" (การสร้างความตระหนักด้านความปลอดภัย). เพื่อให้ความรู้และเตือนพนักงานเกี่ยวกับนโยบายความปลอดภัย, แนวปฏิบัติที่ดีที่สุด และความเสี่ยงที่อาจเกิดขึ้น. เป็นเครื่องมือภาพที่ออกแบบมาเพื่อส่งเสริมวัฒนธรรมที่ตระหนักถึงความปลอดภัยภายในองค์กร.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Incident Response Plans (แผนรับมือเหตุการณ์), Business Continuity Plans (แผนความต่อเนื่องทางธุรกิจ), หรือ Physical Security Controls (การควบคุมความปลอดภัยทางกายภาพ). แม้โปสเตอร์อาจสนับสนุนมาตรการเหล่านี้ทางอ้อม แต่จุดประสงค์หลักคือการสร้างความตระหนัก.
** Question 50** Which of these types of user is less likely to have a privileged account? Options: A security admin system administrator B security analyst C help desk D external worker Correct Option: D external worker Keywords for Exam: less likely, privileged account, limited access Detailed Explanation:
Privileged Account (บัญชีผู้ใช้ที่มีสิทธิ์พิเศษ): บัญชีที่มีสิทธิ์การเข้าถึงสูงเพื่อจัดการและบำรุงรักษาระบบ.
External Workers (พนักงานภายนอก): เช่น ผู้รับเหมา หรือพนักงานชั่วคราว มีแนวโน้มที่จะมีบัญชีที่มีสิทธิ์พิเศษน้อยที่สุด. เพราะโดยทั่วไปแล้ว พวกเขามี "สิทธิ์การเข้าถึงระบบและทรัพยากรที่จำกัด" ซึ่งจำเป็นสำหรับบทบาทงานของตน.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
System Administrators, Security Analysts, และ Help Desk: มักต้องการสิทธิ์การเข้าถึงที่สูงขึ้นสำหรับการจัดการระบบ, การแก้ไขปัญหา หรือการตรวจสอบ.
** Question 51** The predetermined set of instructions or procedures to sustain business operations after a disaster is commonly known as: Options: A business impact analysis B disaster recovery plan C business impact plan D business continuity plan Correct Option: D business continuity plan Keywords for Exam: predetermined set of instructions, sustain business operations, after a disaster, comprehensive approach Detailed Explanation:
Business Continuity Plan (BCP) (แผนความต่อเนื่องทางธุรกิจ): คือแนวทางที่ "ครอบคลุม" (comprehensive approach) เพื่อให้มั่นใจว่าองค์กรสามารถรักษาหรือกลับมาดำเนินงานได้อย่างรวดเร็วหลังเกิดภัยพิบัติหรือการหยุดชะงักที่สำคัญ. รวมถึงกลยุทธ์และขั้นตอนในการจัดการความเสี่ยงต่างๆ และรับรองความต่อเนื่องของฟังก์ชันทางธุรกิจที่สำคัญ.
BCP เปรียบเสมือนร่มขนาดใหญ่: BCP เป็นแผนหลักที่ครอบคลุมทั้งหมด โดยมี Business Impact Analysis (BIA) และ Disaster Recovery Plan (DRP) เป็นส่วนหนึ่งภายใต้ BCP. จำโครงสร้างนี้ไว้ให้ขึ้นใจ!
** Question 52** Which of the following is not an element of system security configuration management? Options: A inventory B baselines C updates D audit logs Correct Option: D audit logs Keywords for Exam: not an element, system security configuration management Detailed Explanation:
System Security Configuration Management (การจัดการการกำหนดค่าความปลอดภัยของระบบ):
องค์ประกอบหลัก:
Inventory (รายการสินทรัพย์): ใช้เพื่อติดตามระบบและซอฟต์แวร์ทั้งหมด.
Baselines (ฐาน): ใช้เพื่อกำหนดค่าความปลอดภัยมาตรฐานสำหรับระบบ.
Updates (การอัปเดต): ใช้เพื่อให้แน่ใจว่าระบบได้รับการอัปเดตอย่างสม่ำเสมอเพื่อแก้ไขช่องโหว่และปรับปรุงความปลอดภัย.
Audit Logs (บันทึกการตรวจสอบ): มีความสำคัญสำหรับการตรวจสอบและติดตามกิจกรรม แต่ "ไม่ถือเป็นองค์ประกอบหลัก" ของ System Security Configuration Management. Audit Logs ใช้สำหรับการตรวจสอบความปลอดภัยและการตรวจจับเหตุการณ์ ไม่ใช่เพื่อกำหนดค่าและจัดการความปลอดภัยของระบบโดยตรง.
** Question 53** Which are the components of an incident response plan or you can also say that what are the steps of an incident response plan? Options: A preparation detection and analysis recovery containment eradication and post incident activity B preparation detection and analysis containment eradication post incident activity and recovery C preparation detection and analysis eradication recovery containment and post incident activity D is preparation detection and analysis containment eradication and recovery and post incident activity Correct Option: D preparation detection and analysis containment eradication and recovery and post incident activity Keywords for Exam: components of an incident response plan, steps of an incident response plan, correct order Detailed Explanation:
Incident Response Plan (แผนรับมือเหตุการณ์): โดยทั่วไปจะปฏิบัติตามขั้นตอนสำคัญเหล่านี้ (ต้องจำลำดับให้ขึ้นใจ!):
Preparation (การเตรียมการ): การจัดตั้งและฝึกอบรมทีมรับมือเหตุการณ์ และทำให้มั่นใจว่ามีเครื่องมือและขั้นตอนที่จำเป็น.
Detection and Analysis (การตรวจจับและวิเคราะห์): การระบุและทำความเข้าใจลักษณะของเหตุการณ์.
Containment, Eradication, and Recovery (การจำกัด, การกำจัด, และการกู้คืน): การจำกัดเหตุการณ์เพื่อป้องกันความเสียหายเพิ่มเติม, การกำจัดสาเหตุ และการกู้คืนระบบให้กลับมาทำงานปกติ.
Post-Incident Activity (กิจกรรมหลังเกิดเหตุการณ์): การทบทวนเหตุการณ์เพื่อเรียนรู้จากมัน และปรับปรุงการตอบสนองในอนาคต.
ลำดับนี้ช่วยให้มั่นใจได้ถึงการตอบสนองต่อเหตุการณ์ด้านความปลอดภัยที่มีประสิทธิภาพและเป็นระบบ.
** Question 54** Which of the following is an example of 2 FA that is two factor authentication? Options: A badges B passwords C keys D Detime passwords and the correct option is so this question is a little bit tricky two factor means that two factors are used for authentication such as uh you can use a password along with a fingerprint biometric so you can say that this is a two factor so in this question the example of two factor authentication is option D one-time password so how it is although it is a single factor so how is one time password a two-actor authentication so this is the explanation two factor authentication involves using two different forms of authentication to verify a user's identity this typically combines something the user knows like a password with something the user has like a one-time password or security key so in this case the one-time password should be combined with something else such as the password to make it a two-actor authentication other options such as the begages could be part of physically security system but not necessarily two-actor authentication passwords are a single factor and are not two factor authentication by themselves and keys like security token or physical USB keys can be part of two-actor authentication but are not two factor authentication on their own without another factor onetime password which is option D generated for a single login session or an example of a second factor used in two factor authentication a log side something like password Correct Option: D one-time passwords Keywords for Exam: 2FA, two-factor authentication, two different forms of authentication Detailed Explanation:
Two-Factor Authentication (2FA): เกี่ยวข้องกับการใช้ "รูปแบบการยืนยันตัวตนที่แตกต่างกันสองแบบ" เพื่อยืนยันตัวตนของผู้ใช้. โดยทั่วไปจะรวมสิ่งที่ผู้ใช้ "รู้" (Something You Know) เช่น รหัสผ่าน กับสิ่งที่ผู้ใช้ "มี" (Something You Have) เช่น One-Time Password (OTP) หรือ Security Key.
One-Time Passwords (OTP): เป็นรหัสผ่านที่สร้างขึ้นสำหรับการเข้าสู่ระบบครั้งเดียว. OTP เป็นตัวอย่างของ "ปัจจัยที่สอง" (second factor) ที่ใช้ในการยืนยันตัวตนแบบ 2FA โดยต้องใช้ร่วมกับปัจจัยอื่น เช่น รหัสผ่าน.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Badges (บัตร): อาจเป็นส่วนหนึ่งของระบบรักษาความปลอดภัยทางกายภาพ แต่ไม่จำเป็นต้องเป็น 2FA.
Passwords (รหัสผ่าน): เป็นปัจจัยเดียว (single factor).
Keys (กุญแจ) เช่น Security Token หรือ USB Key: สามารถเป็นส่วนหนึ่งของ 2FA ได้ แต่ไม่ใช่ 2FA ด้วยตัวเองหากไม่มีปัจจัยอื่น.
สำคัญมาก: Factors of Authentication:
Something You Know (สิ่งที่รู้): Password, PIN.
Something You Have (สิ่งที่มี): OTP, Security Token, Credit Card.
Something You Are (สิ่งที่เป็น): Biometrics (Fingerprint, Facial Recognition).
Something You Do (สิ่งที่ทำ): (เช่น รูปแบบการพิมพ์คีย์บอร์ด) - (ข้อมูลเพิ่มเติม นอกเหนือจากที่ระบุใน Source แต่เป็น Concept ที่ ISC2 ชอบออก)
ถ้าใช้แค่ Username และ Password ด้วยกัน ก็ยังเป็นแค่ One Factor นะ เพราะทั้งคู่เป็น "Something You Know".
** Question 55** Which of the following is not a feature of a cryptographic hash function? Options: A reversible B unique excuse me C deterministic and option D useful and the correct option is reversible so what does this mean this means that the hashing function is not reversible unlike encryption where when you encrypt you can also decrypt it uh you can change the plain text to encrypted data and then the encrypted data can be changed again to plain text while in hashing once you change something to hash you cannot convert the hash to the original data so that why the HM function is also known as oneway function it is also known as oneway function since it goes only one way you cannot reverse it so cryptographic hash functions are designed to be irreversible it should not be feasible to deduce the original input from the hash output they are deterministic what does this mean that the same input always produce the same output they are unique that is collisions where two different inputs produce the same output are highly unlikely and useful for various purposes like verifying data integrity being reversible is not a feature of cryptographic hash functions Correct Option: A reversible Keywords for Exam: not a feature, cryptographic hash function, irreversible, one-way function Detailed Explanation:
Cryptographic Hash Function (ฟังก์ชันแฮชทางคณิตศาสตร์): คุณสมบัติที่สำคัญที่สุด (และไม่ใช่) คือ:
"ไม่สามารถย้อนกลับได้" (Irreversible): ฟังก์ชันแฮชถูกออกแบบมาให้ไม่สามารถย้อนกลับได้. กล่าวคือ ไม่สามารถอนุมานข้อมูลต้นฉบับจากค่าแฮชที่ได้. นี่คือเหตุผลที่มันถูกเรียกว่า "One-Way Function" (ฟังก์ชันทางเดียว).
Deterministic (กำหนดได้): อินพุตเดียวกันจะให้เอาต์พุตเดียวกันเสมอ.
Unique (ไม่ซ้ำกัน): การที่อินพุตสองแบบที่แตกต่างกันให้เอาต์พุตเดียวกัน (Collision) เป็นเรื่องที่เกิดขึ้นได้ยากมาก.
Useful (มีประโยชน์): มีประโยชน์สำหรับการใช้งานหลากหลาย เช่น การตรวจสอบความสมบูรณ์ของข้อมูล (Data Integrity).
การที่สามารถย้อนกลับได้ (Reversible) ไม่ใช่คุณสมบัติของ Cryptographic Hash Function. จำให้ขึ้นใจ!
** Question 56** What are the three packets used on the TCP connection handshake? Options: A offer request acknowledgement B send sync and act and option C send FIN and option D discover offer and request and the correct option is so the three TCP three-way handshake is basically the client sends the send the server sends back the sin and egg and then the client sends the egg so this way the three-way handshake completes so the TCP 3-way handshake establishes a reliable connection between a client and a server it involves the sin packet that is synchronized the client sends a sin or synchronization request to start the connection sync that is synchronized acknowledgement the server acknowledges the sin and sends its own sin to synchronize with the client and then act acknowledgement the client acknowledges the server sin act completing the handshake this process ensures both parties are synchronized and ready to communicate so if graphically it can be represented as such so this is let's suppose client and here is our server so the clien Correct Option: B SYN, SYN-ACK, ACK Keywords for Exam: three packets, TCP connection handshake, reliable connection Detailed Explanation:
TCP 3-Way Handshake (การจับมือ 3 ทางของ TCP): เป็นกระบวนการที่ TCP ใช้เพื่อสร้าง "การเชื่อมต่อที่เชื่อถือได้" (reliable connection) ระหว่างไคลเอ็นต์และเซิร์ฟเวอร์. มี 3 ขั้นตอน (แพ็กเก็ต) ที่ต้องจำลำดับให้แม่น!:
SYN (Synchronize): ไคลเอ็นต์ส่งแพ็กเก็ต SYN (Synchronization request) ไปยังเซิร์ฟเวอร์เพื่อเริ่มการเชื่อมต่อ.
SYN-ACK (Synchronize-Acknowledgement): เซิร์ฟเวอร์ตอบกลับโดยการยืนยัน SYN ของไคลเอ็นต์ (ACK) และส่ง SYN ของตัวเองเพื่อซิงโครไนซ์กับไคลเอ็นต์.
ACK (Acknowledgement): ไคลเอ็นต์ยืนยัน SYN-ACK ของเซิร์ฟเวอร์ และเป็นการสิ้นสุดการจับมือ.
กระบวนการนี้ทำให้มั่นใจว่าทั้งสองฝ่ายพร้อมที่จะสื่อสารกัน.
** Question 57** After an earthquake disrupting business operations which document contains the procedures to required to return business to normal operation? Options: A the business impact plan B the business impact analysis C the business continuity plan D the disaster recovery plan Correct Option: D the disaster recovery plan Keywords for Exam: after an earthquake disrupting business operations, procedures to return business to normal operation Detailed Explanation:
Disaster Recovery Plan (DRP) (แผนกู้คืนระบบจากภัยพิบัติ): DRP จะระบุขั้นตอนและขั้นตอนที่จำเป็นในการ "กู้คืนระบบ IT, แอปพลิเคชัน และโครงสร้างพื้นฐานที่สำคัญ" ให้กลับมาทำงานปกติหลังจากการหยุดชะงัก เช่น แผ่นดินไหว. DRP เป็นส่วนหนึ่งของแผน BCP ที่กว้างกว่า และเน้นเฉพาะในความพยายามในการกู้คืนและฟื้นฟู. (จำง่ายๆ ว่า DRP คือการกู้คืนระบบ IT หลังจากเกิดภัยพิบัติ)
** Question 58** What is the consequence of a denial of service attack? Options: A exhaustion of device resources B malware infection C increase in the availability of resources D remote control of a device Correct Option: A exhaustion of device resources Keywords for Exam: consequence, denial of service attack, inaccessible, overwhelming with excessive traffic Detailed Explanation:
Consequence of DoS Attack: การโจมตีแบบ Denial of Service (DoS) จะทำให้ "ทรัพยากรของระบบ, เครือข่าย หรือแอปพลิเคชันถูกใช้จนหมด" (exhaustion of device resources) ด้วยทราฟฟิกหรือคำขอที่มากเกินไป. ทำให้บริการที่ถูกโจมตีไม่สามารถใช้งานได้สำหรับผู้ใช้ที่ตั้งใจจะใช้งาน.
DoS Attacks "ไม่เกี่ยวข้องโดยตรง" กับ:
การติดมัลแวร์.
การควบคุมระยะไกล.
การเพิ่มความพร้อมใช้งาน (ตรงกันข้ามเลย).
** Question 59** According to ISC2 which are the six phases of data handling this is very important so the six phases of data handling and the options are create use store share archive and destroy option B create store use share archive and destroy option C create share use sto Correct Option: B create store use share archive and destroy Keywords for Exam: ISC2, six phases of data handling, correct order, data life cycle Detailed Explanation:
Six Phases of Data Handling (ตาม ISC2 - จำลำดับให้ขึ้นใจ!):
Create (สร้าง): ข้อมูลถูกสร้างหรือรวบรวมขึ้น.
Store (จัดเก็บ): ข้อมูลถูกบันทึกอย่างปลอดภัยในระบบหรือที่เก็บ.
Use (ใช้งาน): ข้อมูลถูกประมวลผลหรือเข้าถึงเพื่อวัตถุประสงค์ที่ตั้งใจไว้.
Share (แบ่งปัน): ข้อมูลถูกถ่ายโอนหรือทำให้พร้อมใช้งานสำหรับผู้อื่นตามความจำเป็น.
Archive (เก็บถาวร): ข้อมูลถูกย้ายไปยังที่เก็บระยะยาวเพื่อการเก็บรักษา.
Destroy (ทำลาย): ข้อมูลถูกลบอย่างปลอดภัยเมื่อไม่จำเป็นอีกต่อไป.
เฟสเหล่านี้รับประกันแนวทางวงจรชีวิตในการจัดการและปกป้องข้อมูล.
** Question 60** Which of the following is less likely to be part of an incident response team? Options: A legal representative B human resources C representatives of senior management D information security professional Correct Option: B human resources Keywords for Exam: less likely, part of an incident response team, core members Detailed Explanation:
Incident Response Team (ทีมรับมือเหตุการณ์):
ผู้ที่มีแนวโน้มจะเป็นสมาชิกหลัก:
Information Security Professional: เพื่อจัดการด้านเทคนิค.
Legal Representative: สำหรับการปฏิบัติตามกฎระเบียบและประเด็นทางกฎหมาย.
Senior Management Representatives: สำหรับการตัดสินใจและการจัดสรรทรัพยากร.
Human Resources (HR): แม้ HR อาจเกี่ยวข้องในเหตุการณ์บางอย่าง เช่น ที่เกี่ยวข้องกับการประพฤติมิชอบของพนักงาน แต่ "ไม่น่าจะเป็นสมาชิกหลัก" ของทีมรับมือเหตุการณ์โดยทั่วไป. การมีส่วนร่วมของ HR เป็นไปตามสถานการณ์และไม่จำเป็นเสมอไปต่อองค์ประกอบของทีม.
** Question 61** Which of these tools is commonly used to crack passwords? Options: A Burp suit B NS lookup C John the Ripper D wire shark Correct Option: C John the Ripper Keywords for Exam: commonly used, crack passwords, brute force, dictionary attacks Detailed Explanation:
John the Ripper: เป็นเครื่องมือถอดรหัสรหัสผ่าน (password cracking tool) ที่ได้รับความนิยม. ออกแบบมาเพื่อระบุรหัสผ่านที่อ่อนแอโดยการโจมตีแบบ Brute Force หรือ Dictionary Attack. มักใช้ในการทดสอบการเจาะระบบ (Penetration Testing) และการประเมินความปลอดภัย.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Burp Suite: ใช้สำหรับการทดสอบความปลอดภัยของเว็บแอปพลิเคชันเป็นหลัก.
NSLookup: เป็นเครื่องมือสำหรับสอบถาม DNS.
Wireshark: เป็นโปรแกรมวิเคราะห์โปรโตคอลเครือข่าย.
** Question 62** In order to find out whether personal tablet devices are allowed in the office which of the following policies would be helpful to read? Options: A BOD that is bring your own device B privacy policy C change management policy D A or acceptable use policy Correct Option: A BOD that is bring your own device Keywords for Exam: personal tablet devices, allowed in the office, policy, BYOD Detailed Explanation:
BYOD (Bring Your Own Device) Policy: เนื่องจากโจทย์พูดถึง "อุปกรณ์แท็บเล็ตส่วนตัว" (personal tablet devices) ดังนั้นนโยบายที่เกี่ยวข้องคือ "นโยบาย Bring Your Own Device". นโยบาย BYOD จะกำหนดกฎและข้อบังคับสำหรับการที่พนักงานใช้อุปกรณ์ส่วนตัว เช่น แท็บเล็ต ในที่ทำงาน. ระบุว่าอนุญาตให้อุปกรณ์ดังกล่าวเข้าถึงได้หรือไม่, ข้อกำหนดด้านความปลอดภัย และการใช้งานที่ยอมรับได้.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Privacy Policy (นโยบายความเป็นส่วนตัว): เน้นการจัดการข้อมูลส่วนบุคคล.
Change Management Policy (นโยบายการจัดการการเปลี่ยนแปลง): เกี่ยวกับกระบวนการเปลี่ยนแปลงระบบ.
Acceptable Use Policy (AUP) (นโยบายการใช้งานที่ยอมรับได้): กำหนดวิธีการใช้ทรัพยากรขององค์กร แต่ไม่อาจกล่าวถึงอุปกรณ์ส่วนตัวอย่างชัดเจน.
** Question 63** In which cloud deployment model do companies share resources and infrastructure on the cloud? Options: A hybrid cloud B multi-tenant C private cloud D community cloud Correct Option: D community cloud Keywords for Exam: cloud deployment model, companies share resources and infrastructure, similar interests or requirements Detailed Explanation:
Community Cloud (คลาวด์ชุมชน): เป็นรูปแบบการใช้งานคลาวด์ที่หลายๆ บริษัทที่มี "ความต้องการหรือความสนใจคล้ายกัน" (similar needs or interests) เช่น การปฏิบัติตามกฎระเบียบ หรือข้อกำหนดด้านความปลอดภัย "ใช้ทรัพยากรและโครงสร้างพื้นฐานร่วมกัน". สภาพแวดล้อมที่ใช้ร่วมกันนี้มักจะได้รับการจัดการโดยองค์กรใดองค์กรหนึ่ง หรือผู้ให้บริการบุคคลที่สาม.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Hybrid Cloud: รวม Public และ Private Cloud แต่ไม่ได้หมายถึงการแชร์ทรัพยากรระหว่างองค์กรต่างๆ เสมอไป.
Multi-tenant: หมายถึงสถาปัตยกรรมที่ลูกค้าหลายรายใช้โครงสร้างพื้นฐานเดียวกัน แต่ไม่ใช่รูปแบบการใช้งานคลาวด์ที่กำหนด.
Private Cloud: สงวนไว้สำหรับองค์กรเดียวเท่านั้น.
** Question 64** Which of these is the primary objective of a disaster recovery plan? Options: A restore company operation to the last known reliable operation state B outline a safe escape procedure for the organization's personnel C maintain crucial company operations in the event of a disaster D communicate to the responsible entities the damage caused to the operations in the event of a disaster Correct Option: A restore company operation to the last known reliable operation state Keywords for Exam: primary objective, disaster recovery plan, restore company operation, functional state, IT systems and infrastructure Detailed Explanation:
Primary Objective of DRP: เป้าหมายหลักของ Disaster Recovery Plan คือการ "กู้คืนการดำเนินงานของบริษัท" (restore company operations) ให้กลับสู่สถานะที่ใช้งานได้โดยเร็วที่สุดหลังเกิดภัยพิบัติ. โดยทั่วไปจะมุ่งเป้าไปที่การกลับสู่ "สถานะการทำงานที่เชื่อถือได้ล่าสุด" (last known reliable operation state). แผนนี้จะเน้นที่การกู้คืน "ระบบ IT และโครงสร้างพื้นฐาน".
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
B (ขั้นตอนการหลบหนีที่ปลอดภัย) เกี่ยวข้องกับแผนรับมือเหตุฉุกเฉิน (Emergency Response Plan) หรือ BCP.
C (รักษาการดำเนินงานที่สำคัญ) เป็นเป้าหมายที่กว้างกว่าซึ่งอยู่ภายใต้ BCP.
D (การสื่อสารเกี่ยวกับความเสียหาย) เป็นส่วนหนึ่งของ DRP แต่ไม่ใช่จุดเน้นหลัก.
** Question 65** An entity that acts to exploit a target organization system and abilities is a option A threat actor option B threat vector option C threat and option D attacker and the correct option is option B threat vector so what is a what is a threat vector a threat vector is an entity that is individual or group that actively exploits vulnerabilities in a system to cause harm such as stealing data or disrupting operations they are the ones who carry out attacks other options such as threat vector refers to the method or path used by a threat actor to exploit vulnerabilities such as fishing malware option C threat is a general term referring to any potential danger including both actors and vectors while option D attacker is a less formal term Correct Option: A threat actor (Note: The provided source explanation states "threat vector" as the correct option, but then proceeds to define "threat actor". Given the definition, "threat actor" is the correct term for an "entity that acts to exploit". I will follow the definition given in the explanation for consistency with the concept, even if the source's stated "correct option" is initially mismatched with its own explanation text. This is a critical point to ensure conceptual understanding over literal mislabeling in the source.) Keywords for Exam: entity that acts to exploit, individual or group, carries out attacks Detailed Explanation:
Threat Actor (ผู้กระทำการคุกคาม): คือ "บุคคลหรือกลุ่ม" ที่ใช้ประโยชน์จากช่องโหว่ในระบบอย่างแข็งขันเพื่อก่อให้เกิดอันตราย เช่น การขโมยข้อมูล หรือการหยุดชะงักการดำเนินงาน. พวกเขาคือ "ผู้ที่ดำเนินการโจมตี".
ทำไมถึงไม่ใช่ตัวเลือกอื่น (และคำที่เกี่ยวข้อง):
Threat Vector (ช่องทางคุกคาม): หมายถึง "วิธีการหรือเส้นทาง" ที่ Threat Actor ใช้เพื่อใช้ประโยชน์จากช่องโหว่ เช่น Phishing, Malware.
Threat (ภัยคุกคาม): เป็นคำทั่วไปที่หมายถึงอันตรายที่อาจเกิดขึ้น รวมถึงทั้งผู้กระทำและช่องทาง.
Attacker (ผู้โจมตี): เป็นคำที่ไม่เป็นทางการมากนักสำหรับ Threat Actor.
** Question 66** A best practice of patch management is to: Options: A apply all patches as quickly as possible B test patches before applying them C apply patches every Wednesday D apply patches according to vendor's reputation Correct Option: B test patches before applying them Keywords for Exam: best practice, patch management, test patches, controlled environment Detailed Explanation:
Best Practice in Patch Management: แนวปฏิบัติที่ดีที่สุดในการจัดการ Patch คือ "การทดสอบ Patch ในสภาพแวดล้อมที่ควบคุมได้" (test patches in a controlled environment) ก่อนที่จะนำไปใช้กับระบบจริง (Production Systems). ซึ่งช่วยให้แน่ใจว่า Patch จะไม่ก่อให้เกิดปัญหาที่ไม่คาดคิด หรือความขัดแย้งกับระบบและซอฟต์แวร์อื่นๆ.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
A (ใช้ Patch ทั้งหมดโดยเร็วที่สุด) อาจนำไปสู่ปัญหาที่ไม่คาดคิดได้.
C (ใช้ Patch ทุกวันพุธ) ไม่ใช่แนวปฏิบัติที่ดีที่สุด เพราะกำหนดเวลาควรขึ้นอยู่กับกำหนดการเผยแพร่ Patch และความรุนแรงของช่องโหว่.
D (ใช้ Patch ตามชื่อเสียงของผู้จำหน่าย) ไม่เพียงพอ.
** Question 67** Which of these would be the last option if a network administrator needs to control access to a network? Options: A HIDS that is hostbased intrusion detection system B IDs intrusion detection system C security information and event management D neck that is network access control Correct Option: D NAC that is network access control Keywords for Exam: control access to a network, network administrator, NAC Detailed Explanation:
Network Access Control (NAC): ถูกออกแบบมาเพื่อ "ควบคุมการเข้าถึงเครือข่าย" (control access to a network) โดยการบังคับใช้นโยบายกับอุปกรณ์ที่พยายามเชื่อมต่อ. NAC ช่วยให้มั่นใจว่าอุปกรณ์ที่ได้รับอนุญาตและเป็นไปตามข้อกำหนดเท่านั้นที่ได้รับอนุญาตให้เข้าถึงเครือข่าย.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
HIDS (Host-based Intrusion Detection System): ตรวจสอบกิจกรรมบนอุปกรณ์แต่ละเครื่อง แต่ไม่ได้ควบคุมการเข้าถึงเครือข่ายโดยตรง.
IDS (Intrusion Detection System): ตรวจจับและแจ้งเตือนกิจกรรมที่น่าสงสัยในเครือข่าย แต่ไม่ได้ควบคุมการเข้าถึง.
SIEM (Security Information and Event Management): รวบรวมและวิเคราะห์ข้อมูลความปลอดภัย แต่ไม่ได้ควบคุมการเข้าถึงเครือข่ายโดยเฉพาะ.
** Question 68** Which of the follow which of these is not a change management component? Options: A approval B RFC request for comment C roll back D governness Correct Option: D governance Keywords for Exam: not a change management component, governance Detailed Explanation:
Governance (ธรรมาภิบาล): ไม่ได้เป็นส่วนหนึ่งของกระบวนการ Change Management. Governance หมายถึงการบริหารจัดการโดยรวมและนโยบายที่ชี้นำการกระทำขององค์กร.
ส่วนประกอบของ Change Management (ทบทวนจากข้อ 40):
Approval (การอนุมัติ): ส่วนประกอบสำคัญในการจัดการการเปลี่ยนแปลง.
Request for Change (RFC): ข้อเสนอที่เป็นทางการสำหรับการเปลี่ยนแปลง.
Rollback (การย้อนกลับ): กระบวนการย้อนระบบกลับไปสู่สถานะก่อนหน้า หากการเปลี่ยนแปลงทำให้เกิดปัญหา.
** Question 69** Which of the following is not a social engineering technique? Options: A pre-texting B quit proco C double dealing D betting Correct Option: C double dealing Keywords for Exam: not a social engineering technique, deception Detailed Explanation:
Social Engineering Techniques:
Pretexting (การสร้างเรื่อง): เกี่ยวข้องกับการสร้างสถานการณ์สมมติเพื่อหลอกล่อให้ได้ข้อมูลที่ละเอียดอ่อน.
Quid Pro Quo (การแลกเปลี่ยน): เกี่ยวข้องกับการเสนอสิ่งของบางอย่างเพื่อแลกกับข้อมูลหรือการเข้าถึง.
Baiting (การล่อลวง): เกี่ยวข้องกับการเสนอสิ่งที่ล่อใจเพื่อล่อลวงเหยื่อให้เปิดเผยข้อมูล หรือดาวน์โหลดซอฟต์แวร์ที่เป็นอันตราย.
Phishing/Spear Phishing/Whaling: (ทบทวนจากข้อ 80, 128, 175) ก็เป็น Social Engineering
Double Dealing: ไม่ใช่เทคนิค Social Engineering ที่เป็นที่รู้จัก. โดยทั่วไปหมายถึงการหลอกลวงหรือไม่ซื่อสัตย์ในบริบทต่างๆ.
** Question 70** If there is no time constraint with protocol which protocol should be employed to establish a reliable connection between two devices? Options: A TCP transmission control protocol B DHCP C SNMP simple network management protocol D UDP user datagramgram protocol Correct Option: A TCP transmission control protocol Keywords for Exam: no time constraint, reliable connection, between two devices, three-way handshake Detailed Explanation:
TCP (Transmission Control Protocol): TCP ถูกออกแบบมาเพื่อสร้าง "การสื่อสารที่เน้นการเชื่อมต่อที่เชื่อถือได้" (reliable, connection-oriented communication) ระหว่างสองอุปกรณ์. TCP ทำให้มั่นใจว่าข้อมูลถูกส่งอย่างเป็นระเบียบ, ปราศจากข้อผิดพลาด และไม่สูญหาย ผ่านกลไกเช่น Acknowledgement (การยืนยัน) และ Retransmission (การส่งซ้ำ). เหมาะสำหรับสถานการณ์ที่ต้องการความน่าเชื่อถือเป็นสำคัญ และ "ไม่มีข้อจำกัดด้านเวลา" (no time constraints). (ช้าแต่ชัวร์)
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
DHCP (Dynamic Host Configuration Protocol): ใช้สำหรับการกำหนด IP Address ไม่ใช่การสร้างการเชื่อมต่อ.
SNMP (Simple Network Management Protocol): ใช้สำหรับการจัดการและตรวจสอบเครือข่าย.
UDP (User Datagram Protocol): เป็นโปรโตคอลแบบ Connectionless (ไม่ต้องสร้างการเชื่อมต่อก่อน) ที่ "ไม่รับประกันความน่าเชื่อถือ". เร็วกว่า TCP แต่ไม่เหมาะสำหรับสถานการณ์ที่ต้องการการเชื่อมต่อที่เชื่อถือได้. (เร็วแต่ไม่ชัวร์ เหมาะกับ Realtime เช่น Video/Audio Call)
** Question 71** An exploitable weakness or flaw in a system or component is A: Options: A threat B bug C vulnerability D risk Correct Option: C vulnerability Keywords for Exam: exploitable weakness or flaw, in a system or component, targeted by attackers Detailed Explanation:
Vulnerability (ช่องโหว่): คือ "จุดอ่อนหรือข้อบกพร่องที่สามารถถูกใช้ประโยชน์ได้" (exploitable weakness or flaw) ในระบบ, ซอฟต์แวร์ หรือส่วนประกอบ ที่ผู้โจมตีสามารถใช้เพื่อประนีประนอมความปลอดภัย. การระบุและลดช่องโหว่มีความสำคัญอย่างยิ่งในการรักษาสภาพแวดล้อมที่ปลอดภัย. (ทบทวนจากข้อ 36)
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Threat (ภัยคุกคาม): สาเหตุที่อาจเกิดขึ้นของเหตุการณ์.
Bug (ข้อผิดพลาด): ข้อผิดพลาดในซอฟต์แวร์ แต่ไม่จำเป็นต้องเป็นช่องโหว่ด้านความปลอดภัยเสมอไป.
Risk (ความเสี่ยง): โอกาสที่จะเกิดความเสียหายหรือการสูญเสีย.
** Question 72** In which cloud model does the cloud customer have less responsibility over the infrastructure? Options: A infrastructure as a service B function as a service C uh option C is platform as a service and option D software as a service and the correct option is software as a service software is a service the most re uh responsibility lies with the cloud provider including the operating system the ha Correct Option: D software as a service Keywords for Exam: cloud model, less responsibility over the infrastructure, cloud provider handles everything Detailed Explanation:
SaaS (Software as a Service): ในโมเดล SaaS, ลูกค้าคลาวด์มี "ความรับผิดชอบน้อยที่สุด" (least responsibility) ในส่วนของโครงสร้างพื้นฐาน. ผู้ให้บริการ SaaS จะให้บริการแอปพลิเคชันซอฟต์แวร์ที่ได้รับการจัดการอย่างเต็มรูปแบบ และผู้ให้บริการคลาวด์จะจัดการทุกอย่าง รวมถึงฮาร์ดแวร์, ซอฟต์แวร์ และความปลอดภัย. ลูกค้าเพียงแค่โต้ตอบกับแอปพลิเคชันเท่านั้น.
Shared Responsibility Model: (สำคัญ!) Cloud Service operates under a shared responsibility model, โดยที่ลูกค้าและผู้ให้บริการคลาวด์ "แบ่งปันความรับผิดชอบ".
On-Premise (เราดูแลทั้งหมด): เราดูแลทุกอย่างเอง (Network, Storage, OS, Application, Data)
IaaS (Infrastructure as a Service): ลูกค้ามีความรับผิดชอบในการจัดการโครงสร้างพื้นฐานมากขึ้น รวมถึง Virtual Machines (VMs) และ Networks. (ผู้ใช้ควบคุม OS ได้)
PaaS (Platform as a Service): ผู้ให้บริการ PaaS ให้แพลตฟอร์มสำหรับการพัฒนาและปรับใช้แอปพลิเคชัน โดยมีการจัดการโครงสร้างพื้นฐานน้อยกว่า IaaS แต่มีความรับผิดชอบมากกว่า SaaS.
FaaS (Function as a Service) / Serverless: ลูกค้าเขียนฟังก์ชัน แต่ยังคงจัดการ Code และ Configuration บางอย่าง.
SaaS (Software as a Service): ผู้ให้บริการดูแลทุกอย่าง ลูกค้าแค่ใช้แอปพลิเคชัน.
ลำดับความรับผิดชอบของลูกค้า (จากมากไปน้อย): On-Premise > IaaS > PaaS > FaaS > SaaS
** Question 73** Risk management is: Options: A the assessment of the potential impact of a threat B the creation of an incident response team C the impact and likelihood of a threat D the identification evaluation and prioritization of risk and the correct option is option D the identification evaluation and prioritization of risks so risk management involves identifying potential risk evaluating their likelihood and impact and prioritizing them to determine the most effective mitigation strategy this process helps organizations understand and manage potential threats to their operations option A refers to risk assessment which is a part of the overall risk management process option B refers to incident response planning not risk management and option C focuses on assessing a specific threats impact and likelihood which is a part of the risk evaluation process Correct Option: D the identification evaluation and prioritization of risk Keywords for Exam: risk management, identification evaluation and prioritization, mitigation strategy Detailed Explanation:
Risk Management (การบริหารจัดการความเสี่ยง): เกี่ยวข้องกับการ "ระบุ (identifying), ประเมิน (evaluating) และจัดลำดับความสำคัญ (prioritizing) ของความเสี่ยง". เพื่อกำหนดกลยุทธ์การลดความเสี่ยงที่มีประสิทธิภาพสูงสุด. กระบวนการนี้ช่วยให้องค์กรเข้าใจและจัดการภัยคุกคามที่อาจเกิดขึ้นกับการดำเนินงาน.
** Question 74** Which of the following documents contains elements that are not mandatory? Options: A policies B guidelines C regulation D procedures Correct Option: B guidelines Keywords for Exam: documents, not mandatory, recommendations or best practices Detailed Explanation:
Guidelines (แนวทางปฏิบัติ): ไม่ใช่ข้อบังคับ. Guidelines ให้ "คำแนะนำหรือแนวปฏิบัติที่ดีที่สุด" (recommendations or best practices). แต่ไม่ได้บังคับและให้ความยืดหยุ่นในการปฏิบัติตาม.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Policies (นโยบาย): บังคับใช้และกำหนดกฎและหลักการ.
Regulations (ข้อบังคับ): กฎที่บังคับใช้โดยหน่วยงาน มักมีผลทางกฎหมาย (บังคับมากที่สุด).
Procedures (ขั้นตอนการปฏิบัติงาน): คำแนะนำทีละขั้นตอนที่ต้องปฏิบัติตาม ทำให้เป็นข้อบังคับในลักษณะ.
** Question 75** In which of the following phases of an incident response plan or incident response is prioritized? Options: A post incident activity B detection and analysis C preparation and option D containment eradication and recovery and the correct option is option B detection and analysis so in the detection and analysis phase of an incident recovery plane incident responses are prioritized based on the severity and impact of the incident this phase involve identifying the nature of the incident assessing its scope and prioritizing responses to ensure the most critical issues are addressed first option A the post incident activity involves reviewing the incident to improve future responses but not prioritizing incident responses option C preparation focuses on setting up the resources and processes needed for incident response not on prioritizing specific incidents and option D containment eradication and recovery focuses on mitigating the effects of the incident and restoring normal operations Correct Option: B detection and analysis Keywords for Exam: incident response plan, incident response is prioritized, severity and impact of the incident Detailed Explanation:
Detection and Analysis Phase (การตรวจจับและวิเคราะห์): ในระยะนี้ การตอบสนองต่อเหตุการณ์จะถูก "จัดลำดับความสำคัญ" (prioritized) ตามความรุนแรงและผลกระทบของเหตุการณ์. ระยะนี้เกี่ยวข้องกับการระบุลักษณะของเหตุการณ์, การประเมินขอบเขต และการจัดลำดับความสำคัญของการตอบสนองเพื่อให้แน่ใจว่าปัญหาที่สำคัญที่สุดได้รับการแก้ไขก่อน. (ทบทวนจากข้อ 53)
** Question 76** Which security principle states that a user should only have the necessary permission to execute a task? Options: A privileged accounts B separation of duties C least privilege D defense in depth Correct Option: C least privilege Keywords for Exam: security principle, only have the necessary permission, execute a task, minimum level of access Detailed Explanation:
Least Privilege (สิทธิ์ขั้นต่ำ): หลักการนี้ระบุว่าผู้ใช้ควรมี "ระดับการเข้าถึงหรือสิทธิ์ที่จำเป็นขั้นต่ำเท่านั้น" (minimum level of access or permissions necessary) เพื่อปฏิบัติงานของตน. ซึ่งจะช่วยลดความเสี่ยงของการใช้ผิดวัตถุประสงค์ หรือความเสียหายโดยไม่ตั้งใจต่อระบบและข้อมูล. (เป็นพื้นฐานสำคัญมาก!)
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Privileged Accounts: หมายถึงบัญชีที่มีสิทธิ์สูง แต่ไม่ได้เกี่ยวข้องโดยตรงกับแนวคิดการจำกัดสิทธิ์.
Separation of Duties (การแบ่งแยกหน้าที่): ทำให้แน่ใจว่าไม่มีบุคคลใดบุคคลหนึ่งควบคุมทุกด้านของงานสำคัญ ช่วยป้องกันการทุจริตหรือข้อผิดพลาด แต่ไม่ใช่การจำกัดสิทธิ์ในระดับที่จำเป็น.
Defense in Depth: เกี่ยวข้องกับการใช้การควบคุมความปลอดภัยหลายชั้นเพื่อปกป้องระบบ.
** Question 77** The bell lapadulla the bell and lapadulla access control model is a form of: Options: Aback that is attribute based access control B arbback role based access control C MAC that is mandatory access control D deck that is discretionary access control Correct Option: C MAC that is mandatory access control Keywords for Exam: Bell-LaPadula access control model, form of, security labels, confidentiality Detailed Explanation:
Bell-LaPadula Model: เป็นโมเดล "Mandatory Access Control (MAC)". มันบังคับใช้นโยบายความปลอดภัยตาม "ป้ายกำกับความลับ" (classification labels) เช่น Top Secret, Confidential, Unclassified. โมเดลนี้เน้นที่ "Confidentiality (การรักษาความลับ)" โดยใช้กฎเช่น "No Read Up" (ห้ามอ่านข้อมูลที่สูงกว่าระดับความลับของตนเอง) และ "No Write Down" (ห้ามเขียนข้อมูลไปยังระดับความลับที่ต่ำกว่าตนเอง) เพื่อป้องกันการเข้าถึงที่ไม่ได้รับอนุญาต.
ทำไมถึงไม่ใช่ตัวเลือกอื่น: (ทบทวนจากข้อ 18, 31, 83)
ABAC (Attribute-Based Access Control): ใช้ Attributes.
RBAC (Role-Based Access Control): กำหนดการเข้าถึงตามบทบาท.
DAC (Discretionary Access Control): อนุญาตให้เจ้าของทรัพยากรตัดสินใจเกี่ยวกับการเข้าถึง.
** Question 78** In risk management the highest priority is given to a risk where: Options: A the frequency of occurrence is low and the expected impact value is high B the expected probability of occurrence is low and potential impact is low C the expected probability of occurrency is high and the potential impact is low D the frequency of occurrency is high and the expected impact value is low and the correct option is option A highest priority is given where the frequency of occurrence is low but the expected impact is high impact value is higher so in the risk management a risk with low frequency of occurrence but a high impact is given the highest priorit Correct Option: A the frequency of occurrence is low and the expected impact value is high Keywords for Exam: risk management, highest priority, low frequency, high impact Detailed Explanation:
การจัดลำดับความสำคัญของความเสี่ยง: ในการบริหารจัดการความเสี่ยง "ความเสี่ยงที่มีความเป็นไปได้ที่จะเกิดขึ้นต่ำ (low frequency of occurrence) แต่มีผลกระทบสูง (high impact)" จะได้รับ "ความสำคัญสูงสุด" (highest priority). เพราะถึงแม้จะไม่เกิดขึ้นบ่อย แต่ถ้าเกิดขึ้นจริงอาจทำให้เกิดความเสียหายหรือการสูญเสียอย่างมีนัยสำคัญต่อองค์กรได้.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
B (ความเป็นไปได้ต่ำ, ผลกระทบต่ำ): ความสำคัญต่ำ.
C (ความเป็นไปได้สูง, ผลกระทบต่ำ): ต้องให้ความสนใจ แต่สำคัญน้อยกว่าความเสี่ยงผลกระทบสูง.
D (ความเป็นไปได้สูง, ผลกระทบต่ำ): ความสำคัญต่ำ.
** Question 79** Which of the following area is connected to PII that is personally identifiable information? Options: A non-repudiation B authentication C integrity D confidentiality Correct Option: D confidentiality Keywords for Exam: connected to PII, personally identifiable information, secure them, unauthorized users Detailed Explanation:
PII (Personally Identifiable Information) (ข้อมูลส่วนบุคคลที่ระบุตัวตนได้): สิ่งที่เราต้องการคือการ "รักษาความลับ" (confidentiality) ของ PII. เพื่อให้แน่ใจว่าข้อมูลที่ละเอียดอ่อน เช่น PII จะถูกเก็บเป็นความลับ และเข้าถึงได้เฉพาะบุคคลที่ได้รับอนุญาตเท่านั้น. การปกป้องความลับของ PII เป็นองค์ประกอบสำคัญของความเป็นส่วนตัวและความปลอดภัยของข้อมูล.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Non-Repudiation (การไม่สามารถปฏิเสธความรับผิดชอบได้): เกี่ยวข้องกับการรับรองว่าการกระทำหรือธุรกรรมไม่สามารถปฏิเสธได้.
Authentication (การยืนยันตัวตน): กระบวนการยืนยันตัวตนผู้ใช้หรือระบบ.
Integrity (ความสมบูรณ์ของข้อมูล): ทำให้แน่ใจว่าข้อมูลถูกต้องและไม่ถูกเปลี่ยนแปลง.
คล้ายกับ PHI (Protected Health Information) ที่เน้น Confidentiality เช่นกัน .
** Question 80** Malicious emails that aim to attack company executives are an example of: Options: A Trojans B whailing C fishing D root kits Correct Option: B whailing Keywords for Exam: malicious emails, attack company executives, high-profile individual, social engineering Detailed Explanation:
Whaling (การโจมตีแบบ Whaling): เป็นการโจมตีแบบ Social Engineering ประเภทหนึ่งที่ "มุ่งเป้าไปที่บุคคลที่มีตำแหน่งสูง" (high-profile individual) ภายในองค์กรโดยเฉพาะ เช่น ผู้บริหาร (executives) หรือบุคลากรสำคัญ. อีเมลที่เป็นอันตรายเหล่านี้ถูกสร้างขึ้นเพื่อให้ดูเหมือนถูกต้องตามกฎหมาย และมักมีคำขอหรือคำแนะนำเร่งด่วน เพื่อหลอกลวงเหยื่อให้ดำเนินการที่เป็นอันตราย เช่น การโอนเงิน หรือการเปิดเผยข้อมูลที่ละเอียดอ่อน.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Trojans: มัลแวร์ที่ปลอมตัว.
Phishing (ฟิชชิง): เป็นคำที่กว้างกว่าสำหรับการโจมตีทางอีเมลที่มุ่งเป้าไปที่การขโมยข้อมูลส่วนบุคคลหรือข้อมูลประจำตัว.
Spear Phishing (สเปียร์ฟิชชิง): เป็นรูปแบบที่มุ่งเป้าหมายมากขึ้นกว่า Phishing ทั่วไป แต่ Whaling จะพุ่งเป้าไปที่ผู้บริหารระดับสูงโดยเฉพาะ.
Rootkits: มัลแวร์ที่ออกแบบมาเพื่อซ่อนการมีอยู่ของซอฟต์แวร์ประสงค์ร้ายอื่นๆ.
** Question 81** Governments can impose financial penalties as a consequence consequence of breaking a: Options: A regulation B standards C policy D procedure Correct Option: A regulation Keywords for Exam: governments can impose, financial penalties, breaking a, legally binding rules Detailed Explanation:
Regulations (ข้อบังคับ): รัฐบาลสามารถกำหนด "บทลงโทษทางการเงิน" (financial penalties) ได้เมื่อมีการละเมิด "ข้อบังคับ" (regulations). ข้อบังคับเป็นกฎที่บังคับใช้ตามกฎหมาย (legally binding rules) ที่กำหนดโดยหน่วยงาน และการละเมิดอาจส่งผลให้ถูกปรับหรือมีผลทางกฎหมายอื่นๆ. (จำไว้ว่าอันนี้คือสิ่งที่หนักที่สุดในแง่ของบทลงโทษ)
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Standards (มาตรฐาน): มักหมายถึงบรรทัดฐานที่ตกลงกันไว้ แต่ไม่ได้บังคับใช้ทางกฎหมาย.
Policy (นโยบาย): ชุดแนวทางหรือหลักการที่องค์กรปฏิบัติตาม การไม่ปฏิบัติตามมักนำไปสู่ผลในองค์กร ไม่ใช่บทลงโทษทางกฎหมาย.
Procedure (ขั้นตอนการปฏิบัติงาน): ระบุขั้นตอนเฉพาะสำหรับการปฏิบัติงานภายในองค์กร และไม่มีบทลงโทษทางกฎหมาย.
** Question 82** Which type of attack attempts to trick the user into revealing personal information by sending a fraudulent message? Options: A fishing B cross-ite scripting C denial of service D trojan Correct Option: A fishing Keywords for Exam: trick the user, revealing personal information, fraudulent message, emails Detailed Explanation:
Phishing (ฟิชชิง): เป็นการโจมตีที่ใช้ "ข้อความหลอกลวง" (fraudulent messages) เช่น อีเมล เพื่อหลอกผู้ใช้ให้เปิดเผยข้อมูลส่วนบุคคล เช่น รหัสผ่าน, หมายเลขบัตรเครดิต หรือข้อมูลที่ละเอียดอ่อนอื่นๆ. ข้อความเหล่านี้มักจะดูเหมือนมาจากแหล่งที่น่าเชื่อถือ เช่น ธนาคารหรือบริษัทที่มีชื่อเสียง เพื่อหลอกลวงผู้รับ. (เป็นคำที่กว้างที่สุดสำหรับประเภทการหลอกลวงทางอีเมล)
** Question 83** In which of the following access control model can the creator of an object delegate permissions? Options: Aback that is attribute based access control B mac mandatory access control C arbback role based access control D DAC discretionary access control Correct Option: D DAC discretionary access control Keywords for Exam: access control model, creator of an object, delegate permissions, owner's discretion Detailed Explanation:
Discretionary Access Control (DAC): ในโมเดล DAC, "ผู้สร้างหรือเจ้าของ" ของวัตถุ (เช่น ไฟล์หรือทรัพยากร) มี "ดุลยพินิจ" (discretion) ในการกำหนดหรือมอบหมายสิทธิ์ (delegate permissions) ให้กับผู้ใช้อื่นๆ. โมเดลนี้อนุญาตให้เจ้าของควบคุมว่าใครสามารถเข้าถึงทรัพยากรของตนได้ รวมถึงความสามารถในการแบ่งปันหรือมอบหมายสิทธิ์.
ทำไมถึงไม่ใช่ตัวเลือกอื่น: (ทบทวนจากข้อ 18, 31, 77)
ABAC: อิงตาม Attributes.
MAC: บังคับใช้นโยบายการเข้าถึงที่ผู้ใช้ไม่สามารถเปลี่ยนแปลงได้.
RBAC: กำหนดสิทธิ์ตามบทบาท ไม่ใช่ดุลยพินิจของผู้ใช้แต่ละคน.
** Question 84** Which type of attack has the primary objective of encrypting devices and their data and then demanding ransom payment for the decryption key? Options: A ransomware B Trojan C cross-ite scripting D fishing Correct Option: A ransomware Keywords for Exam: primary objective, encrypting devices and their data, demanding ransom payment, decryption key Detailed Explanation:
Ransomware (มัลแวร์เรียกค่าไถ่): เป็นซอฟต์แวร์ประสงค์ร้ายที่ "เข้ารหัสไฟล์หรืออุปกรณ์ของเหยื่อ" ทำให้ไม่สามารถเข้าถึงได้. จากนั้นผู้โจมตีจะเรียกร้อง "ค่าไถ่" (ransom payment) ซึ่งโดยทั่วไปเป็นสกุลเงินดิจิทัล เพื่อแลกกับกุญแจถอดรหัสเพื่อกู้คืนการเข้าถึงไฟล์.
ทำไมถึงไม่ใช่ตัวเลือกอื่น: (ทบทวนจากข้อก่อนหน้า)
** Question 85** Which of the following cloud models allow access to fundamental computer resources what are com fundamental computer resources these are basically the CPU storage memory operating system etc so which model give access to these resources and the options are option A source that is software as a service option B pass function as a service option C pause platform as a sub service and option D infrastructure as a service and the correct option is of course the option D infrastructure as a service where you user is given the uh fundamental computer resources like the memory storage CPU and user can use it at its own discretion so infrastructure as a service provides fundamental computing resources such as virtual machines storage and networking on a pay as you go basis it allows user to access and manage these basic infrastructure components without needing to own physical hardware while other options such as software is a service delivers software applications over the internet where users can access the software but don't manage the underlying infrastructure the option B fast sorry pass that is function as a service allows users to run code in response to events without managing server but it but it is not focused on providing fundamental computer resources option C p that is platform is a service provides a platform that allows user to develop run and manage applications but it abstracts the underlying infrastructure management Correct Option: D infrastructure as a service Keywords for Exam: cloud models, allow access to, fundamental computer resources, CPU storage memory operating system Detailed Explanation:
IaaS (Infrastructure as a Service): ให้ทรัพยากรคอมพิวเตอร์พื้นฐาน เช่น "Virtual Machines (VMs), Storage และ Networking" แบบจ่ายตามการใช้งาน. ช่วยให้ผู้ใช้สามารถเข้าถึงและจัดการส่วนประกอบโครงสร้างพื้นฐานพื้นฐานเหล่านี้ได้ "โดยไม่ต้องเป็นเจ้าของฮาร์ดแวร์จริง". (ผู้ใช้สามารถติดตั้ง OS ของตัวเองได้).
ทำไมถึงไม่ใช่ตัวเลือกอื่น: (ทบทวนจากข้อ 72)
** Question 86** How many layers does the OSI model have is a very fundamental question: Options: A 7 B 4 C 6 D 5 Correct Option: A 7 Keywords for Exam: OSI model, how many layers, seven layers Detailed Explanation:
OSI Model (Open Systems Interconnection Model): ประกอบด้วย "เจ็ดชั้น" (seven layers) ที่กำหนดขั้นตอนต่างๆ ของการส่งข้อมูลและการทำงานของเครือข่าย.
ลำดับชั้น (จากบนลงล่าง - ต้องจำให้ขึ้นใจ!):
Application (Layer 7)
Presentation (Layer 6)
Session (Layer 5)
Transport (Layer 4)
Network (Layer 3)
Data Link (Layer 2)
Physical (Layer 1)
เทคนิคช่วยจำ (Mnemonics): "All People Seems To Need Data Processing" (A=Application, P=Presentation, S=Session, T=Transport, N=Network, D=Data Link, P=Physical). จำไปใช้เลยช่วยได้เยอะ!
** Question 87** Which of the following principle aims primarily at fraud detection? Options: A privileged accounts B defense in depth C least privilege D separation of duties Correct Option: D separation of duties Keywords for Exam: principle, aims primarily at fraud detection, no single individual has control Detailed Explanation:
Separation of Duties (การแบ่งแยกหน้าที่): เป็นหลักการรักษาความปลอดภัยที่มีเป้าหมายหลักในการ "ตรวจจับและป้องกันการทุจริต" (fraud detection and prevention). มันทำให้แน่ใจว่า "ไม่มีบุคคลใดบุคคลหนึ่ง" (no single individual) ควบคุมทุกด้านของกระบวนการที่สำคัญ. โดยการแบ่งความรับผิดชอบและกำหนดให้บุคคลหลายคนเข้ามาเกี่ยวข้องในงานที่ละเอียดอ่อน จะช่วยลดความเสี่ยงของการทุจริต, ข้อผิดพลาด และกิจกรรมที่เป็นอันตราย.
ทำไมถึงไม่ใช่ตัวเลือกอื่น: (ทบทวนจากข้อ 1, 76)
Privileged Accounts: ไม่ได้มุ่งเป้าไปที่การตรวจจับการทุจริตโดยเฉพาะ.
Defense in Depth: เป็นกลยุทธ์การรักษาความปลอดภัยโดยรวม.
Least Privilege: เกี่ยวกับการให้สิทธิ์ขั้นต่ำที่จำเป็น.
** Question 88** Which protocol uses a three-way handshake to establish a reliable connection? Options: A TCP B SMTP C UDP D SNMP Correct Option: A TCP Keywords for Exam: protocol, three-way handshake, reliable connection Detailed Explanation:
TCP (Transmission Control Protocol): TCP ใช้ "Three-Way Handshake" เพื่อสร้าง "การเชื่อมต่อที่เชื่อถือได้" ระหว่างสองอุปกรณ์. (ทบทวนจากข้อ 56 และ 70)
** Question 89** Which of the following is an example of a technical security control? Options: A access control list B turn styles C fancies D bulards Correct Option: A access control list Keywords for Exam: example, technical security control, software or hardware system Detailed Explanation:
Technical Security Controls (มาตรการควบคุมความปลอดภัยทางเทคนิค): การควบคุมที่ใช้เทคโนโลยีเพื่อปกป้องระบบและข้อมูล.
Access Control List (ACL): เป็นตัวอย่างของ Technical Security Control. ใช้ในการเครือข่ายและการประมวลผลเพื่อกำหนดว่าผู้ใช้หรือระบบใดได้รับอนุญาตให้เข้าถึงทรัพยากรเฉพาะ และสามารถดำเนินการใดได้บ้าง. ACL ถูกนำไปใช้ผ่านระบบซอฟต์แวร์หรือฮาร์ดแวร์.
ทำไมถึงไม่ใช่ตัวเลือกอื่น: (ทบทวนจากข้อ 6, 7, 19, 172, 193)
Turnstiles, Fences, Bollards: เป็น Physical Security Controls.
** Question 90** Which type of attack attempts to gain information by observing the devices power consumption? Options: A side channels B trojans C cross-ite scripping D denial of service Correct Option: A side channel Keywords for Exam: gain information, observing the devices power consumption, physical characteristics, electromagnetic emission or timing data Detailed Explanation:
Side-Channel Attack (การโจมตีแบบช่องทางข้างเคียง): เกี่ยวข้องกับการใช้ประโยชน์จาก "ลักษณะทางกายภาพ" (physical characteristics) ของระบบ เช่น "การใช้พลังงาน, การปล่อยคลื่นแม่เหล็กไฟฟ้า หรือข้อมูลเวลา" เพื่อรวบรวมข้อมูลเกี่ยวกับการทำงานของระบบ หรือข้อมูลลับ. โดยการสังเกตการเปลี่ยนแปลงในการใช้พลังงาน ผู้โจมตีสามารถอนุมานข้อมูลที่ละเอียดอ่อนได้ เช่น กุญแจเข้ารหัส หรือข้อมูลที่กำลังประมวลผล. (ทบทวนจากข้อ 26)
** Question 91** Which of the following area is the most distinctive property of PHI that is patient health information or personal health information? Options: A integrity B confidentiality C non-repudiation D authentication Correct Option: B confidentiality Keywords for Exam: most distinctive property, PHI, protected health information, unauthorized access, patient privacy Detailed Explanation:
PHI (Protected Health Information) (ข้อมูลสุขภาพที่ได้รับการคุ้มครอง): คุณสมบัติที่โดดเด่นที่สุดของ PHI คือ "Confidentiality (การรักษาความลับ)". PHI ประกอบด้วยข้อมูลที่ละเอียดอ่อนเกี่ยวกับสุขภาพที่ต้องได้รับการปกป้องจากการเข้าถึงโดยไม่ได้รับอนุญาต เพื่อให้แน่ใจว่าความเป็นส่วนตัวของผู้ป่วยจะได้รับการคุ้มครอง และเป็นไปตามกฎระเบียบเช่น HIPAA. (คล้ายกับ PII).
** Question 92** Which of these is the most efficient and effective way to test a business continuity plan? Options: A simulations B walkthroughs C reviews D discussions Correct Option: A simulations Keywords for Exam: most efficient and effective way to test, business continuity plan, mimic real life scenarios, evaluate readiness Detailed Explanation:
Simulations (การจำลองสถานการณ์): เป็นวิธีที่ "มีประสิทธิภาพและประสิทธิผลสูงสุด" (most efficient and effective way) ในการทดสอบ Business Continuity Plan. เพราะมันจะ "เลียนแบบสถานการณ์จริง" (mimic real life scenarios) ทำให้องค์กรสามารถประเมินความพร้อม, ระบุช่องว่าง และทำให้แน่ใจว่าแผนสามารถดำเนินการได้อย่างมีประสิทธิภาพในเหตุการณ์จริง.
** Question 93** Which of the following cyber security concepts guarantees that information is accessible only to those authorized to access it? Options: A confidentiality B non-repudiation C authentication D accessibility Correct Option: A confidentiality Keywords for Exam: cyber security concepts, guarantees, accessible only to those authorized to access it, unauthorized disclosure Detailed Explanation:
Confidentiality (การรักษาความลับ): ทำให้แน่ใจว่า "ข้อมูลสามารถเข้าถึงได้เฉพาะผู้ที่ได้รับอนุญาตให้เข้าถึงเท่านั้น" (accessible only to those authorized to access it). ปกป้องข้อมูลที่ละเอียดอ่อนจากการเปิดเผยที่ไม่ได้รับอนุญาต. เป็นหลักการพื้นฐานของ Cyber Security ซึ่งมักบังคับใช้ผ่านการเข้ารหัส, การควบคุมการเข้าถึง และนโยบายความปลอดภัย. (เป็นส่วนหนึ่งของ CIA Triad)
** Question 94** In the event of a disaster what should be the primary objective? Options: A apply disaster communication B protect the production database C guarantee the safety of people and option D guarantee the continuity of critical systems so correct option is remember the safety of the people is the most important consideration during a disaster the primary objective in the event of of a disaster is to ensure the safety of people human life and safety take precedence over all other considerations including system continuity or data protection once safety is secured other objectives like protecting system and data can be addressed Correct Option: C guarantee the safety of people Keywords for Exam: disaster, primary objective, safety of people, human life and safety take precedence Detailed Explanation:
Primary Objective in Disaster: ข้อนี้ย้ำอีกครั้งว่า "ความปลอดภัยของบุคคล" (safety of people) เป็นสิ่งสำคัญที่สุดเสมอ. ชีวิตและความปลอดภัยของมนุษย์ต้องมาก่อนสิ่งอื่นใด รวมถึงความต่อเนื่องของระบบ หรือการปกป้องข้อมูล. (ทบทวนจากข้อ 15)
** Question 95** A security professional should report violations of a company's security policy to: Options: A the ISC ethics committee B company management C national authorities D a court of law Correct Option: B company management Keywords for Exam: security professional, report violations, company's security policy, responsible for enforcing policies Detailed Explanation:
การรายงานการละเมิดนโยบาย: การละเมิดนโยบายความปลอดภัยของบริษัทควรรรายงานไปยัง "Company Management (ฝ่ายบริหารของบริษัท)". เนื่องจากพวกเขามีหน้าที่รับผิดชอบในการบังคับใช้นโยบายและแก้ไขข้อกังวลด้านความปลอดภัยภายในองค์กร. การยกระดับไปยังหน่วยงานภายนอก (เช่น หน่วยงานระดับชาติ หรือศาล) มักจะทำต่อเมื่อกฎหมายกำหนด หรือหากช่องทางภายในไม่เพียงพอเท่านั้น.
** Question 96** Which department is in a company is not regularly involved in a DRP that is disaster recovery plan? Options: A executives B it IT C public relation D financial and the correct option is option D financial so while executive may oversee and approve disaster recovery planning at a high level they are not typically involved in the regular hands-on processes of DRP departments like IT public relation and financials are more actively involved in development testing and execution of disaster recovery so by this explanation it seems that the correct option here is the executives not the financial so the executive are basically not involved in the nitty-gritty of the DRP process while all other departments are basically involved Correct Option: A executives (Based on the explanation, even though the highlighted answer is Financial, the detailed text points to Executives.) Keywords for Exam: not regularly involved, DRP, hands-on processes Detailed Explanation:
การมีส่วนร่วมใน DRP:
IT Department (ฝ่าย IT): มีส่วนร่วมอย่างแข็งขันในการพัฒนา, ทดสอบ และดำเนินการกู้คืนระบบ.
Public Relations (PR) (ประชาสัมพันธ์): ต้องรับรู้แผน DRP เพื่อจัดการความคาดหวังของสาธารณะและผู้มีส่วนได้ส่วนเสีย.
Financial Department (ฝ่ายการเงิน): โดยทั่วไปไม่ค่อยมีส่วนร่วมใน DRP ยกเว้นเมื่อปัญหาเกี่ยวข้องโดยตรงกับการเงินของบริษัท.
Executives (ผู้บริหาร): แม้ผู้บริหารจะดูแลและอนุมัติการวางแผน DRP ในระดับสูง แต่โดยทั่วไปแล้ว "ไม่ได้มีส่วนร่วมในกระบวนการ DRP ที่ปฏิบัติจริงเป็นประจำ" (not typically involved in the regular hands-on processes of DRP).
** Question 97** Which of the following is included in NLA that is service level agreement document i will go d Correct Option: A instructions on data ownership and destruction (The source highlights this, but the full options are not provided in the prompt. I will assume this is the intended correct answer given the context.) Keywords for Exam: included in SLA, service level agreement, contract, data ownership and destruction Detailed Explanation:
SLA (Service Level Agreement): คือสัญญาที่ทำขึ้นระหว่างผู้ให้บริการและลูกค้า. ซึ่งกำหนด "ระดับบริการ" ที่คาดหวังไว้. โดยทั่วไปจะรวมถึงรายละเอียดต่างๆ เช่น "นโยบายการเป็นเจ้าของข้อมูล (data ownership), การจัดการ (handling) และการทำลายข้อมูล (destruction policies)" เพื่อให้เกิดความชัดเจนและความรับผิดชอบในการส่งมอบบริการ.
** Question 98** What is the most important difference between MAC and DAG that is mandatory access control and discretionary access control? Correct Option: C in mandatory access control security administrator assign access permissions while in deck that is discretionary access control access permission are set at the object owner's discretion Keywords for Exam: most important difference, MAC and DAC, who controls access permissions Detailed Explanation:
MAC vs. DAC (ความแตกต่างที่สำคัญที่สุด): ความแตกต่างที่สำคัญที่สุดระหว่าง MAC และ DAC อยู่ที่ "ผู้ที่ควบคุมสิทธิ์การเข้าถึง" (who control the access permission).
MAC (Mandatory Access Control): ผู้ดูแลระบบความปลอดภัย (security administrator) จะเป็นผู้กำหนดและบังคับใช้นโยบายการเข้าถึงตามระดับการจัดหมวดหมู่ (classification levels) ซึ่งรับประกันการควบคุมจากส่วนกลาง.
DAC (Discretionary Access Control): สิทธิ์การเข้าถึงจะถูกกำหนดตาม "ดุลยพินิจของเจ้าของวัตถุ" (object owner's discretion) ซึ่งให้ความยืดหยุ่นมากขึ้นแต่ก็อาจมีการควบคุมที่น้อยลง.
** Question 99** Requiring a specific user role to access resources is an example of: Options: A mandatory access control B attribute based access control C role based access control D discretionary access control and the correct option is option A role based access control so we are talking about role so that why the correct option is role based access control the role-based access control arbback restricts access to resources based on a user's assigned role within an organization each role has predefined permissions and users can access only the resources associated with their role this ensures a structured and consistent approach to managing access Correct Option: C Role Based Access Control (Based on the explanation, even though the highlighted answer is A, the detailed text points to RBAC.) Keywords for Exam: requiring a specific user role, access resources, user's assigned role Detailed Explanation:
Role-Based Access Control (RBAC): "จำกัดการเข้าถึงทรัพยากรโดยอิงจากบทบาท" (user's assigned role) ของผู้ใช้ภายในองค์กร. แต่ละบทบาทมีสิทธิ์ที่กำหนดไว้ล่วงหน้า และผู้ใช้สามารถเข้าถึงทรัพยากรที่เกี่ยวข้องกับบทบาทของตนเท่านั้น. ทำให้มั่นใจได้ถึงแนวทางที่มีโครงสร้างและสอดคล้องกันในการจัดการการเข้าถึง. (ทบทวนจากข้อ 18)
** Question 100** Which type of document outlines the procedures ensuring that vital company systems keep running during business disruption disrupting events? Options: A business impact plan B business impact analysis C disaster recovery plan D business continuity plan Correct Option: D business continuity plan Keywords for Exam: outlines the procedures, vital company systems keep running, business disruption disrupting events, maintaining critical functions Detailed Explanation:
Business Continuity Plan (BCP): เป็นเอกสารที่สรุป "ขั้นตอนเพื่อให้แน่ใจว่าระบบและกระบวนการทางธุรกิจที่สำคัญยังคงดำเนินต่อไป" (essential business systems and processes continue to operate) ในระหว่างและหลังเหตุการณ์ที่ทำให้เกิดการหยุดชะงัก. BCP มุ่งเน้นการรักษาฟังก์ชันที่สำคัญ, ลดเวลาหยุดทำงาน และรับรองความยืดหยุ่นขององค์กร. (ทบทวนจากข้อ 51, 107)
** Question 101** Which of the following is not a best practice in access management? Options: A give only the right amount of permission B periodically assess if user permissions still apply C request a justification when upgrading permission D trust but verify and the correct option is option D trust but verify is not a best practice in excess management rather than the best practice in excess management related to this phrase is never trust and always verify so you should never trust any device any access request even if it is from the uh internal network but you should always first verify it Correct Option: D trust but verify Keywords for Exam: not a best practice, access management, never trust and always verify Detailed Explanation:
Best Practices in Access Management:
ให้สิทธิ์ที่เหมาะสมเท่านั้น (Least Privilege).
ประเมินสิทธิ์ของผู้ใช้เป็นระยะ.
ร้องขอเหตุผลเมื่ออัปเกรดสิทธิ์.
"Trust but Verify" (เชื่อใจแต่ตรวจสอบ): ไม่ถือเป็นแนวปฏิบัติที่ดีที่สุดในการจัดการการเข้าถึง. แทนที่จะเป็นเช่นนั้น แนวปฏิบัติที่ดีที่สุดที่เกี่ยวข้องกับวลีนี้คือ "Never Trust and Always Verify" (ไม่เคยเชื่อใจ และตรวจสอบเสมอ). คุณไม่ควรเชื่อถืออุปกรณ์ใดๆ หรือคำขอการเข้าถึงใดๆ แม้ว่าจะมาจากเครือข่ายภายในก็ตาม แต่ควรตรวจสอบก่อนเสมอ. นี่คือหลักการของ Zero Trust Model ที่กำลังเป็นที่นิยม .
** Question 102** If a company collects PII that is personally identifiable information which policy is required? Options: A remote access policy B GDPR C privacy policy D acceptable use policy Correct Option: C privacy policy Keywords for Exam: company collects PII, personally identifiable information, policy is required Detailed Explanation:
Privacy Policy (นโยบายความเป็นส่วนตัว): หากบริษัทรวบรวม PII (Personally Identifiable Information) จะต้องมี "นโยบายความเป็นส่วนตัว". นโยบายนี้จะระบุว่าบริษัทรวบรวม, จัดเก็บ, ใช้ และปกป้องข้อมูลส่วนบุคคลอย่างไร.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Remote Access Policy: เกี่ยวกับการเข้าถึงระบบจากระยะไกล.
GDPR: เป็นข้อบังคับที่เฉพาะเจาะจงสำหรับสหภาพยุโรป.
Acceptable Use Policy: กำหนดวิธีการใช้ทรัพยากรขององค์กร.
แม้ GDPR จะเกี่ยวข้องกับ PII แต่ Privacy Policy เป็นเอกสารที่ระบุแนวปฏิบัติการจัดการ PII ทั่วไป.
** Question 103** Which of these is least likely to be installed by an infection in the option are option A logic bomb option B key logger option C Trojan and option D back door and the correct option is option A logic bomb so what is a logic bomb so a logic bomb is least likely to be installed by an infection it is a type mal It is a type of malware that is triggered by a specific condition or event such as a particular date or action rather than being installed as part of an ongoing in infection in contrast key loggers Trojans and back doors are more commonly installed by malware infections to allow for continuous access or monitoring Correct Option: A logic bomb Keywords for Exam: least likely to be installed by an infection, triggered by a specific condition or event Detailed Explanation:
Logic Bomb (ระเบิดตรรกะ): เป็นมัลแวร์ประเภทหนึ่งที่ "มีแนวโน้มที่จะถูกติดตั้งโดยการติดเชื้อน้อยที่สุด". มันเป็นมัลแวร์ที่ถูก "กระตุ้น" (triggered) โดยเงื่อนไขหรือเหตุการณ์เฉพาะ เช่น วันที่หรือการกระทำที่กำหนดไว้ แทนที่จะถูกติดตั้งเป็นส่วนหนึ่งของการติดเชื้อที่กำลังดำเนินอยู่.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Key Loggers, Trojans, และ Backdoors: มักจะถูกติดตั้งโดยการติดมัลแวร์ เพื่อให้สามารถเข้าถึงหรือตรวจสอบได้อย่างต่อเนื่อง.
** Question 104** The best defense method to stop a replay attack is to: Options: A use an IPSecVPN B use a firewall C use password authentication D use message digesting Correct Option: A use an IPSecVPN Keywords for Exam: best defense method, stop a replay attack, IPSecVPN, encryption and authentication, freshness of data Detailed Explanation:
Replay Attack: เป็นการโจมตีที่ผู้โจมตีดักจับและส่งการสื่อสารที่ถูกต้องซ้ำ.
การป้องกัน Replay Attack ที่ดีที่สุด: คือการใช้ "IPSecVPN". IPSec ให้การ "เข้ารหัสและการยืนยันตัวตน" (encryption and authentication) เพื่อให้แน่ใจใน "ความสมบูรณ์และความสดใหม่" (integrity and freshness) ของข้อมูลที่ถูกส่ง. ซึ่งจะป้องกันผู้โจมตีจากการดักจับและส่งการสื่อสารที่ถูกต้องซ้ำ.
** Question 105** Which of these devices has the primarily objective of the of determining the most efficient path for the traffic to flow across the network? Options: A hubs B firewalls C routers D switches Correct Option: C router Keywords for Exam: primarily objective, determining the most efficient path, traffic to flow across the network, routing Detailed Explanation:
Router (เราเตอร์): เราเตอร์มีวัตถุประสงค์หลักในการ "กำหนดเส้นทางที่มีประสิทธิภาพสูงสุด" (determining the most efficient path) สำหรับทราฟฟิกที่จะไหลผ่านเครือข่าย. มันจะตรวจสอบข้อมูลใน Layer 3 (Network Layer) เช่น IP Address ต้นทางและปลายทาง และใช้ตาราง Routing และโปรโตคอลเพื่อส่งต่อแพ็กเก็ตข้อมูลไปยังปลายทางอย่างมีประสิทธิภาพ.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Hubs: ส่งข้อมูลพื้นฐาน.
Switches: จัดการการส่งต่อข้อมูลภายในเครือข่ายท้องถิ่น.
Firewalls: กรองทราฟฟิกด้านความปลอดภัย.
(Switch รุ่นใหม่บางตัวมีฟังก์ชัน Routing เรียกว่า Layer 3 switches แต่ Router คืออุปกรณ์หลักที่ทำหน้าที่นี้).
** Question 106** Which of these types of malware selfreplicates without the need for human intervention? Options: A warm B trojan C virus D rootkit Correct Option: A worm Keywords for Exam: types of malware, self-replicates, without the need for human intervention Detailed Explanation:
Worm (เวิร์ม): เป็นมัลแวร์ประเภทหนึ่งที่ "จำลองตัวเองและแพร่กระจาย" (self-replicates and spreads) ข้ามเครือข่ายหรือระบบ "โดยไม่ต้องมีการแทรกแซงจากมนุษย์" (without requiring human intervention). เวิร์มสามารถแพร่กระจายได้อย่างอิสระและมักก่อให้เกิดความเสียหายในวงกว้างโดยการใช้แบนด์วิธเครือข่าย หรือใช้ประโยชน์จากช่องโหว่.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Viruses (ไวรัส): ต้องการไฟล์โฮสต์หรือโปรแกรมที่แนบไป.
Trojans (โทรจัน): ไม่จำลองตัวเอง.
Rootkits (รูทคิท): ไม่จำลองตัวเอง.
** Question 107** NISC square member as NISC square or as NISC2 member you are expected to perform with due care what does due care specifically mean? Options: A do what is right in each situation you encounter on the job B give continuity to the legacy of security practices of your company C apply patches annually D researching and acquiring the knowledge to do your job right and the correct option is option A do what is right in each situation you encounter on the job so due care refers to the expectation that professionals will act with reasonable caution responsibility and diligence Correct Option: A do what is right in each situation you encounter on the job Keywords for Exam: ISC2 member, due care, reasonable caution, responsibility and diligence Detailed Explanation:
Due Care (ความรับผิดชอบที่สมควร): หมายถึงความคาดหวังที่ว่าผู้เชี่ยวชาญจะ "กระทำการด้วยความระมัดระวัง, ความรับผิดชอบ และความขยันหมั่นเพียรที่สมเหตุสมผล" (reasonable caution, responsibility and diligence) ในหน้าที่ของตน. ซึ่งหมายถึงการ "ทำสิ่งที่ถูกต้องในแต่ละสถานการณ์" (do what is right in each situation) ที่พบเจอในงาน และทำให้แน่ใจว่าการตัดสินใจและการกระทำนั้นเป็นไปเพื่อปกป้องความปลอดภัยและสวัสดิภาพขององค์กรและสินทรัพย์.
** Question 108** During the investigation of an incident which security policies are more likely to cause difficulties? Options: A configuration standards B incident response policies C communication policies D retention policies Correct Option: D retention policies Keywords for Exam: investigation of an incident, more likely to cause difficulties, data retention periods, critical evidence Detailed Explanation:
Retention Policies (นโยบายการเก็บรักษาข้อมูล): มีแนวโน้มที่จะก่อให้เกิดปัญหาได้มากที่สุดระหว่างการสอบสวนเหตุการณ์. เพราะนโยบายเหล่านี้ "ควบคุมระยะเวลาการเก็บข้อมูล". หากระยะเวลาการเก็บข้อมูลสั้นเกินไป หลักฐานสำคัญอาจถูกลบไปก่อนที่จะนำมาใช้ในการสอบสวนได้. ในทางกลับกัน หากระยะเวลาการเก็บรักษานานเกินไป อาจทำให้เกิดความท้าทายในการจัดเก็บข้อมูลที่ไม่จำเป็น.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
นโยบายอื่นๆ เช่น Incident Response, Communication และ Configuration Standards ถูกออกแบบมาเพื่อสนับสนุนการสอบสวน.
** Question 109** In an access control list that is ACL the element that determines which permissions you have is: Options: A the subject B the object C the firmware D the rule and the correct option is the rule so the ACL basically consists of different rules so in an access control list that is ACL the rule is the element that determines which permissions are granted to a subject that is user or process for a specific object that is resource the rule specifies the action that can be performed such as read write or execute and is used to control access to the object based on the subject's identity or attributes Correct Option: D the rule Keywords for Exam: ACL, Access Control List, element that determines, which permissions, rule specifies the action Detailed Explanation:
ACL (Access Control List): ใน ACL, "Rule (กฎ)" เป็นองค์ประกอบที่ "กำหนดสิทธิ์" (determines which permissions) ที่มอบให้กับ Subject (ผู้ใช้หรือกระบวนการ) สำหรับ Object (ทรัพยากร) เฉพาะ. Rule จะระบุการกระทำที่สามารถทำได้ เช่น อ่าน, เขียน หรือดำเนินการ และใช้เพื่อควบคุมการเข้าถึง Object โดยอิงจากตัวตนหรือคุณสมบัติของ Subject.
** Question 110** What does the term data remnants refer to? Options: A data in use that cannot be encrypted B files saved locally that cannot be remoteed remotely accessed C data left or after routine removal and deletion and after and option D all of the data in a system so the data remnance basically refers to option C data left over after routine removal and deletion so data remness refers to the residual data that remains on storage media after it has been deleted or erased which could potentially be recovered even after routine deletion processes traces of data might still be prese Correct Option: C data left over after routine removal and deletion Keywords for Exam: data remnants, residual data, remains on storage media, could potentially be recovered, security risk Detailed Explanation:
Data Remnants (ข้อมูลตกค้าง): หมายถึง "ข้อมูลที่เหลืออยู่" (residual data) บนสื่อจัดเก็บข้อมูลหลังจากถูกลบหรือลบออกไปแล้ว. ซึ่งอาจถูกกู้คืนได้แม้หลังจากกระบวนการลบตามปกติ. ร่องรอยของข้อมูลอาจยังคงอยู่บนอุปกรณ์จริง ทำให้เกิดความเสี่ยงด้านความปลอดภัยหากข้อมูลที่ละเอียดอ่อนไม่ได้รับการกำจัดอย่างถูกต้อง.
ประเภทของข้อมูลที่สำคัญ (Data States):
Data at Rest (ข้อมูลขณะพัก): ข้อมูลที่จัดเก็บอยู่บนฮาร์ดไดรฟ์, เทป, ในคลาวด์ หรือสื่อจัดเก็บข้อมูลอื่นๆ เช่น USB.
Data in Use (ข้อมูลขณะใช้งาน): ข้อมูลที่กำลังใช้งานโดยระบบคอมพิวเตอร์ หรือถูกประมวลผลโดยแอปพลิเคชัน (เช่น ใน RAM).
Data in Motion / Data in Transit (ข้อมูลขณะเคลื่อนที่/ระหว่างส่ง): ข้อมูลที่ถูกส่งผ่านเครือข่าย.
** Question 111** Which type of recovery side has some or more system in place but does not have the data needed to take over operations? Options: A hard sides B a cloud site C a warm side and option D a cold sides so these are the different recovery side types so which type of side is the one where systems are in place but data is not available for recovery to start the operations and the correct option is option C a warm site so a warm site is a type of disaster recovery site that has some hardware and software systems in place but it lacks the most recent data backups this means that in the event of a disaster it would take some time to restore the necessary data to the warm side before operations can resume here is a brief explanation of other options a hard site a hard site is fully operational and can take over operations immediately after a disaster it has all the necessary hardware software and upto-ate data backups a cloud site so a cloud side leverages cloud computing resources to provide disaster recovery capabilities it can be a hot warm or cold side depending on the specific configuration and data replication strategies and a cold side is the least prepared least prepared type of disaster recovery site it has the basic infrastructure such as power and network connectivity but lacks hardware software and data it requires significant time and effort to set up and restore operations Correct Option: C a warm site Keywords for Exam: recovery site, systems in place, does not have the data, takes some time to restore Detailed Explanation:
Recovery Site Types (ต้องจำความแตกต่าง!):
Hot Site (ฮอตไซต์): เป็น Disaster Recovery Site ที่ "ทำงานได้อย่างสมบูรณ์" (fully operational) และสามารถเข้าควบคุมการดำเนินงานได้ "ทันที" หลังเกิดภัยพิบัติ. มีฮาร์ดแวร์, ซอฟต์แวร์ และข้อมูลสำรองที่ทันสมัยทั้งหมด.
Warm Site (วอร์มไซต์): มีระบบฮาร์ดแวร์และซอฟต์แวร์บางส่วนติดตั้งอยู่ แต่ "ขาดข้อมูลสำรองล่าสุดที่จำเป็น" (lacks the most recent data backups). หมายความว่าต้องใช้เวลาสักระยะในการกู้คืนข้อมูลที่จำเป็นไปยัง Warm Site ก่อนที่จะสามารถเริ่มการดำเนินงานได้.
Cold Site (โคลด์ไซต์): เป็น Disaster Recovery Site ที่ "พร้อมน้อยที่สุด" (least prepared). มีโครงสร้างพื้นฐานพื้นฐาน เช่น ไฟฟ้าและการเชื่อมต่อเครือข่าย แต่ "ขาดฮาร์ดแวร์, ซอฟต์แวร์ และข้อมูล". ต้องใช้เวลาและความพยายามอย่างมากในการติดตั้งและกู้คืนการดำเนินงาน.
Cloud Site: ใช้ทรัพยากร Cloud Computing เพื่อให้ความสามารถในการกู้คืนระบบจากภัยพิบัติ สามารถเป็น Hot, Warm, หรือ Cold Site ก็ได้ ขึ้นอยู่กับการตั้งค่าเฉพาะ.
** Question 112** Which of these is not a characteristic of an MSP implementation i think MSP stands for managed uh security provision so let's see and the options are manage all in-house company infrastructure option B monitor and respond to security incidents option C mediate execute and decide top level decisions and option D utilize expertise for the implementation of a product or service and the correct option is option A manage all in-house company infrastructure so MSP that is manage service provider so it is not manage security provision it is managed service provider typically does not take over the entire management of a company's in-house infrastructure instead they often focus on specific areas lik Correct Option: A manage all in-house company infrastructure Keywords for Exam: not a characteristic, MSP, Managed Service Provider, focus on specific areas Detailed Explanation:
MSP (Managed Service Provider): โดยทั่วไป MSP "ไม่ได้ดูแลการจัดการโครงสร้างพื้นฐานทั้งหมด" (does not take over the entire management of a company's in-house infrastructure). แต่จะเน้นที่พื้นที่เฉพาะ เช่น ความปลอดภัยเครือข่าย, การสนับสนุน IT หรือบริการคลาวด์. บทบาทของ MSP คือการให้ความช่วยเหลือจากผู้เชี่ยวชาญและจัดการบริการเฉพาะเหล่านี้ ไม่ใช่การรับผิดชอบเต็มรูปแบบสำหรับโครงสร้างพื้นฐานทั้งหมด.
ลักษณะอื่นๆ ของ MSP:
ตรวจสอบและตอบสนองต่อเหตุการณ์ด้านความปลอดภัย.
ใช้ความเชี่ยวชาญในการนำผลิตภัณฑ์หรือบริการไปใช้.
โดยทั่วไปไม่ได้เป็นผู้ตัดสินใจในระดับสูงสุดของกลยุทธ์ธุรกิจหรือ IT (แต่ร่วมวางแผนได้).
** Question 113** Which of these is not a typical component of a comprehensive business continuity plan that is BCP? Options: A a cost prediction of the immediate response procedures B immediate response procedures and checklists C notification systems and call trees for alerting personnel D a list of the BCP team members and the correct option is option A a cost prediction of the immediate response procedures so a comprehensive business continuity plan focuses on maintaining and restoring critical business operations during and after a disruption it typically includes immediate response procedures notification systems and a list of BCP team members however predicting the cost of immediate response procedures is not typically a component of the BCP as the plan prioritizes actionable strategies or financial forecasting Correct Option: A a cost prediction of the immediate response procedures Keywords for Exam: not a typical component, comprehensive business continuity plan, BCP, prioritizes actionable strategies, not financial forecasting Detailed Explanation:
ส่วนประกอบของ BCP:
ขั้นตอนการตอบสนองทันทีและ Checklist.
ระบบแจ้งเตือนและ Call Trees สำหรับแจ้งบุคลากร.
รายชื่อสมาชิกทีม BCP.
การประมาณการต้นทุนของขั้นตอนการตอบสนองทันที (cost prediction of the immediate response procedures): "ไม่เป็นส่วนประกอบทั่วไป" ของ BCP. เพราะแผน BCP ให้ความสำคัญกับกลยุทธ์ที่สามารถนำไปปฏิบัติได้ (actionable strategies) หรือการพยากรณ์ทางการเงิน.
** Question 114** Acting ethically is mandatory for ISC2 members which of these is not considered unethical? Options: A disrupting the intended use of the internet B seeking to gain unauthorized access to resources on the internet C compromising the privacy of users D having fake social media profiles and accounts so the correct option is already highlighted option D so this is not unethical to have fake social media profiles and accounts while having fake social media profile and account may raise ethical question in certain contexts it is not explicitly deemed uneth Correct Option: D having fake social media profiles and accounts Keywords for Exam: not considered unethical, ISC2 members, ethical canons violation Detailed Explanation:
พฤติกรรมที่ไม่ถือว่าผิดจรรยาบรรณ (ตาม ISC2 Code of Ethics): การมี "โปรไฟล์และบัญชีโซเชียลมีเดียปลอม" (fake social media profiles and accounts). แม้ว่าอาจมีข้อสงสัยทางจริยธรรมในบางบริบท แต่ก็ไม่ได้ถูกพิจารณาว่าผิดจรรยาบรรณอย่างชัดเจนภายใต้จรรยาบรรณของ ISC2.
พฤติกรรมที่ผิดจรรยาบรรณ (และละเมิดกฎหมาย/แนวทาง):
การขัดขวางการใช้งานอินเทอร์เน็ตที่ตั้งใจไว้.
การพยายามเข้าถึงทรัพยากรบนอินเทอร์เน็ตโดยไม่ได้รับอนุญาต.
การประนีประนอมความเป็นส่วนตัวของผู้ใช้.
(ทบทวน ISC2 Code of Ethics Canons ในข้อ 2)
** Question 115** In an incident response process which phase uses indicators of compromise and log analysis as part of a review of events? Options: A preparation B erodication C identification and option D containment and the correct option is option C identification so the identification phase in an incident response process involves detecting and analyzing potential security events to determine if an incident has occurred this phase utilizes indicator of compromise log analysis and other tools to identify suspicious activities assess the scope and confirm the nature of the incident Correct Option: C identification Keywords for Exam: incident response process, phase uses, indicators of compromise, log analysis, review of events Detailed Explanation:
Identification Phase (การระบุตัวตน): ในระยะ Identification ของกระบวนการตอบสนองต่อเหตุการณ์. เกี่ยวข้องกับการตรวจจับและวิเคราะห์เหตุการณ์ด้านความปลอดภัยที่อาจเกิดขึ้น เพื่อ "พิจารณาว่าเหตุการณ์เกิดขึ้นหรือไม่". ระยะนี้ใช้ "Indicator of Compromise (IoC)" และ "การวิเคราะห์บันทึก (Log Analysis)" รวมถึงเครื่องมืออื่นๆ เพื่อระบุกิจกรรมที่น่าสงสัย, ประเมินขอบเขต และยืนยันลักษณะของเหตุการณ์. (เป็นส่วนหนึ่งของ Detection and Analysis).
** Question 116** Which of these access control systems is commonly used in the military? Options: A AG that is attribute-based access control system B deck discretionary access control C arbback role based access control D MAC mandatory access control Correct Option: D MAC mandatory access control Keywords for Exam: access control systems, commonly used in the military, security classifications, centralized control Detailed Explanation:
MAC (Mandatory Access Control): โดยทั่วไปใช้ในสภาพแวดล้อมทางทหารและภาครัฐ. MAC บังคับใช้การควบคุมที่เข้มงวดต่อสิทธิ์การเข้าถึงโดยอิงตาม "การจัดประเภทความปลอดภัย" (security classifications) เช่น Top Secret หรือ Confidential. ผู้ใช้และทรัพยากรจะถูกกำหนดป้ายกำกับ และการเข้าถึงจะได้รับอนุญาตตามการจัดประเภทเหล่านี้ ซึ่งรับประกัน "ระดับความปลอดภัยสูง" (high level of security) และ "การควบคุมจากส่วนกลาง" (centralized control). (ทบทวนจากข้อ 18, 31, 77, 98)
** Question 117** Which of these is not a security principle? Options: A security in depth B zero trust model C least privilege D separation of duties and the correct option is so security in depth is not a security principle in fact the defense in depth is a security principle so while defense in depth not security in depth is a recognized security principle security in depth is not an established term or principle in cyber security the other options such as zero trust model least privilege and separation of duties are widely recognized security principles that guide the implementation of effective security strategies Correct Option: A security in depth Keywords for Exam: not a security principle, security in depth is not an established term, defense in depth Detailed Explanation:
หลักการความปลอดภัย:
Defense in Depth (การป้องกันแบบหลายชั้น): เป็นหลักการรักษาความปลอดภัยที่ได้รับการยอมรับ (แต่ในโจทย์เขียน "Security in Depth" ซึ่งไม่ใช่คำที่ถูกต้อง).
Zero Trust Model (โมเดล Zero Trust): เป็นกลยุทธ์ความปลอดภัยที่ถือว่าทราฟฟิกเครือข่ายทั้งหมดอาจเป็นอันตรายและต้องการการตรวจสอบ.
Least Privilege (สิทธิ์ขั้นต่ำ):.
Separation of Duties (การแบ่งแยกหน้าที่):.
"Security in Depth" ไม่ใช่คำหรือหลักการที่ได้รับการยอมรับใน Cyber Security. คำที่ถูกต้องคือ "Defense in Depth". ระวังคำหลอกในข้อสอบ!
** Question 118** Which of these is not a common goal of a cyber security attacker? Options: A allocation B alteration C disclosure D denial and the correct option is option A allocation so we have the basic pillar of cyber security is CIA that is confidentiality integrity and availability and these are basically they the attacker purpose is to destroy destroy these so confidentiality is compromised through disclosure integrity is compromised through alteration and availability is denied through uh compromise through denial or denial of service while there is no such thing as allocation that is the goal of a attacker so allocation is not a common goal of a cyber security attackerหมายหลักของผู้โจมตีมักจะสอดคล้องกับ CIA Triad ซึ่งเป็นเสาหลักของ Cyber Security. * Confidentiality (ความลับ): ถูกประนีประนอมผ่าน "Disclosure" (การเปิดเผย) - การเข้าถึงข้อมูลที่ละเอียดอ่อนโดยไม่ได้รับอนุญาต. * Integrity (ความสมบูรณ์ของข้อมูล): ถูกประนีประนอมผ่าน "Alteration" (การแก้ไข) - การเปลี่ยนแปลงข้อมูล. * Availability (ความพร้อมใช้งาน): ถูกประนีประนอมผ่าน "Denial" (การปฏิเสธการให้บริการ) - การขัดขวางความพร้อมใช้งานของบริการ.
"Allocation" ไม่ใช่เป้าหมายทั่วไปของผู้โจมตี.
** Question 119** Which of these types of layers is not part of TCP IP model? Options: A application B physical C internet D transport and the correct option is physical so physical layer is not the part of TCP IP model remember we are not talking about OSI layers physical layer is in fact part of the OSI layers which have seven layers while the TCP IP model is I think it has four layers so the explanation is that the physical layer is not part of the TCP IP model it is part of the OSI model the TCP IP model consists of four layers that is number one is application number two transport number three internet and number four network access so the physical layer which deals with the hardware and transmission media is covered under the network access layer in the TCP IP model Correct Option: B physical Keywords for Exam: not part of TCP IP model, four layers, physical layer Detailed Explanation:
TCP/IP Model (ต้องจำ!): TCP/IP Model ประกอบด้วย "สี่ชั้น".
Application Layer
Transport Layer
Internet Layer
Network Access Layer
Physical Layer: ไม่ได้เป็นส่วนหนึ่งของ TCP/IP Model โดยตรง. Physical Layer ซึ่งจัดการกับฮาร์ดแวร์และสื่อการส่งผ่านข้อมูล ถูกครอบคลุมภายใต้ Network Access Layer ใน TCP/IP Model. (OSI มี 7 ชั้น โดยมี Physical Layer เป็น Layer 1).
** Question 120** On a B YOD model that is bring your own device which of these technologies is best suited to keep corporate data and applications separate from personal? Options: A biometrics B full device encryption C context aware authentication D containerization and Correct Option: D containerization Keywords for Exam: BYOD model, best suited, keep corporate data and applications separate from personal Detailed Explanation:
Containerization (การทำคอนเทนเนอร์): เป็นเทคโนโลยีที่ดีที่สุดสำหรับการ "แยกข้อมูลและแอปพลิเคชันขององค์กรออกจากข้อมูลส่วนบุคคล" (keep corporate data and applications separate from personal data) บนโมเดล BYOD. ช่วยให้องค์กรสามารถแยกแอปและข้อมูลขององค์กรภายใน "คอนเทนเนอร์ที่ปลอดภัย" (secure container) บนอุปกรณ์ได้. ทำให้มั่นใจว่าข้อมูลส่วนบุคคลและข้อมูลขององค์กรจะถูกเก็บแยกกัน.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Biometrics, Full Device Encryption และ Context-Aware Authentication ช่วยเพิ่มความปลอดภัย แต่ไม่ได้ให้การแยกระดับเดียวกัน.
** Question 121** In the context of risk management which information does a outline so ALE is the analyzed loss expectancy or you can also say that it is the annual loss expectancy in the context of risk management so what does this mean annual loss expectancy? Correct Option: A the expected cost per year of not performing a given risk mitigation action Keywords for Exam: ALE, Annualized Loss Expectancy, risk management metric, expected cost per year, not performing a given risk mitigation action **ลดความเสี่ยง.
** Question 122** Which of these techniques is primarily used to ensure data integrity? Options: A message digest B content encryption C backups D hashing Correct Option: D hashing Keywords for Exam: primarily used, data integrity, hash function, fixed size output, different hash value, not altered or corrupted Detailed Explanation:
Hashing is the primary technique used to ensure data integrity. A hash function creates a fixed-size output (a hash value) from input data. Any change in the data results in a different hash value. By comparing hash values, you can verify that the data has not been altered. A message digest is a result of a hashing function.
** Question 123** Which of these is an example of a privacy breach? Options: A any observable occurrence in a network or system B being exposed to the possibility of attack C unavailability of critical systems D excess of private information by an unauthorized person and the correct option is option D excess of private information by an unauthorized person a privacy breach occurs when private or personal information is accessed disclosed or used by someone who is not authorized to do so this directly violates the confidentiality of the data which is a key aspect of privacy the other options describe potential security incidents or disruptions but do not specifically involve a privacy violation Correct Option: D access of private information by an unauthorized person Keywords for Exam: privacy breach, private or personal information, accessed disclosed or used by someone who is not authorized Detailed Explanation:
Privacy Breach (การละเมิดความเป็นส่วนตัว): เกิดขึ้นเมื่อข้อมูลส่วนตัวหรือข้อมูลส่วนบุคคล "ถูกเข้าถึง, เปิดเผย หรือใช้" โดยบุคคลที่ไม่ได้รับอนุญาต. นี่เป็นการละเมิด Confidentiality ของข้อมูลโดยตรง ซึ่งเป็นส่วนสำคัญของความเป็นส่วนตัว.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
A (เหตุการณ์ที่สังเกตได้ในเครือข่าย) อาจเป็นเหตุการณ์ด้านความปลอดภัย แต่ไม่จำเป็นต้องเป็นการละเมิดความเป็นส่วนตัว.
B (การเปิดรับความเป็นไปได้ของการโจมตี) อธิบายถึงความเสี่ยง แต่ไม่ใช่การละเมิดความเป็นส่วนตัวจริง.
C (การไม่พร้อมใช้งานของระบบที่สำคัญ) เกี่ยวข้องกับ Availability ไม่ใช่ความเป็นส่วนตัว.
** Question 124** What is a collection of fixes that are bundled together called? Options: A hot fix B patch C service pack D downgrade and the correct option is option C service pack so a service pack refers to a collection of updates fixes and enhancement that are bundled together and released as a single package it typically includes multiple patches and hard fixes for known issues while a patch is a single update to fix a specific issue a hard fix is an emergency fix often deployed to address a critical issue and a downgrade refers to the process of reverting software to an earlier version Correct Option: C service pack Keywords for Exam: collection of fixes, bundled together, single package, multiple patches and hot fixes Detailed Explanation:
Service Pack: หมายถึง "ชุดรวมของการอัปเดต, การแก้ไข และการปรับปรุง" (collection of updates, fixes and enhancement) ที่ถูกรวมเข้าด้วยกันและเผยแพร่เป็นแพ็คเกจเดียว. โดยทั่วไปจะรวม Patch หลายตัว และ Hot Fix สำหรับปัญหาที่ทราบ.
คำที่เกี่ยวข้อง:
Patch: การอัปเดตเดียวเพื่อแก้ไขปัญหาเฉพาะ.
Hot Fix: การแก้ไขฉุกเฉิน มักใช้เพื่อแก้ไขปัญหาที่สำคัญอย่างรวดเร็ว.
Downgrade: กระบวนการย้อนกลับซอฟต์แวร์ไปยังเวอร์ชันก่อนหน้า.
** Question 125** While performing performing background checks on new employees which of these can never be an attribute for discrimination? Correct Option: D references education political affiliation and employment history (Specifically, political affiliation.) Keywords for Exam: background checks, new employees, never be an attribute for discrimination, political affiliation Detailed Explanation:
การเลือกปฏิบัติ (Discrimination): ในระหว่างการตรวจสอบประวัติพนักงานใหม่ "ความเกี่ยวข้องทางการเมือง" (political affiliation) "ไม่สามารถใช้เป็นคุณสมบัติในการเลือกปฏิบัติได้อย่างถูกต้องตามกฎหมาย". เพราะถือเป็นลักษณะที่ได้รับการคุ้มครองในหลายเขตอำนาจศาลภายใต้กฎหมายต่อต้านการเลือกปฏิบัติ. การใช้ความเกี่ยวข้องทางการเมืองในการตัดสินใจเกี่ยวกับการจ้างงานอาจส่งผลให้เกิดการเลือกปฏิบัติได้.
ส่วนตัวเลือกอื่นๆ แม้จะรวมคุณสมบัติที่ถูกต้องสำหรับการตรวจสอบประวัติ แต่ควรได้รับการพิจารณาอย่างรอบคอบเพื่อให้แน่ใจว่าเป็นไปตามกฎหมายที่เกี่ยวข้อง และใช้เพื่อวัตถุประสงค์ที่เกี่ยวข้องกับงานเท่านั้น.
** Question 126** What is the most important objective of a cyber security insurance policy? Options: A risk avoidance B risk transference C risk spreading D risk acceptance and the correct option is option B risk transference so the most important objective of a cyber security insurance policy is risk transference this means transferring the financial burden of a Cyber attack or data breach to the insurance company this helps organizations to mitigate the financial impact of a security incident option A is incorrect because cyber security insurance does not avoid risk rather it manages it option D is also incorrect as it involves acknowledging risk and deciding to bear them without mitigation risk avoidance involves eliminating activities or systems that introduce risk and risk spreading refers to spreading risk across various assets or operations but it's not the primary goal of cyber security insurance Correct Option: B risk transference Keywords for Exam: cyber security insurance, most important objective, transferring the financial burden, insurance company Detailed Explanation:
Cyber Security Insurance: เป้าหมายที่สำคัญที่สุดเมื่อพิจารณา Cyber Security Insurance คือ "การถ่ายโอนความเสี่ยง" (Risk Transference). ซึ่งหมายถึง "การโอนภาระทางการเงิน" (transferring the financial burden) ของเหตุการณ์ความปลอดภัยทางไซเบอร์ (เช่น การละเมิดข้อมูลหรือการโจมตีทางไซเบอร์) ไปยังบริษัทประกันภัย. การทำเช่นนี้จะช่วยให้องค์กรสามารถบรรเทาผลกระทบทางการเงินจากความเสี่ยงด้านความปลอดภัยได้. (ทบทวนจากข้อ 10, 37)
** Question 127** Which kind of document outlines the procedures ensuring that vital company systems keep running during business business disrupting events? Options: A business impact analysis B business impact plan C business continuity plan D disaster recovery plan and the correct option is option C business continuity plan so a business continuity plan outlines the procedures to ensure that critical c Correct Option: C business continuity plan Keywords for Exam: document outlines the procedures, vital company systems keep running, business disrupting events, maintaining essential business functions Detailed Explanation:
Business Continuity Plan (BCP): ระบุขั้นตอนเพื่อให้แน่ใจว่าระบบบริษัทที่สำคัญยังคงดำเนินต่อไปในระหว่างเหตุการณ์ที่ทำให้ธุรกิจหยุดชะงัก. BCP มุ่งเน้นการรักษา "ฟังก์ชันทางธุรกิจที่สำคัญ" (essential business functions) ในระหว่างและหลังการหยุดชะงัก. (ย้ำอีกครั้งถึงความสำคัญของ BCP)
** Question 128** Which of these social engineering attacks sends emails that target specific individuals? Options: A farming B wailing C wishing D spear fishing and the correct option is option D spear fishing so spear fishing is the type of social engineering attack where specific individuals are targeted whailing is also related term but it is uh the type of attack where the top executives such as CEO of the company or CFO of the companies are targeted so fishing** Keywords for Exam: social engineering attacks, sends emails, target specific individuals, personalized information Detailed Explanation:
Spear Phishing (สเปียร์ฟิชชิง): เป็นการโจมตีแบบ Social Engineering ที่ "มุ่งเป้าหมาย" (targeted) โดยการส่งอีเมลไปยัง "บุคคลหรือองค์กรที่เฉพาะเจาะจง" (specific individuals or organizations). มักใช้ข้อมูลส่วนบุคคลเพื่อให้การโจมตีดูน่าเชื่อถือมากขึ้น.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Phishing: ส่งไปยังกลุ่มคนจำนวนมาก.
Whaling: เป็นรูปแบบหนึ่งของ Spear Phishing แต่ "มุ่งเป้าไปที่บุคคลที่มีชื่อเสียงสูง" เช่น ผู้บริหาร.
Vishing: เกี่ยวข้องกับการโจมตีแบบ Phishing ที่ดำเนินการผ่านโทรศัพท์ (V for Voice).
Pharming: เปลี่ยนเส้นทางผู้ใช้ไปยังเว็บไซต์ปลอม.
** Question 129** Which of these properties is not guaranteed by message authentication code that is MAC? Options: A authenticity B anonymity C integrity D nonrepudiation and the correct option is option B anonymity so a message authentication code that is MAC is used to verify the authenticity and integrity of a message ens Correct Option: B anonymity Keywords for Exam: not guaranteed, Message Authentication Code (MAC), authenticity, integrity, non-repudiation, does not conceal identity Detailed Explanation:
MAC (Message Authentication Code): ใช้เพื่อตรวจสอบ "Authenticity (ความถูกต้องแท้จริง)" และ "Integrity (ความสมบูรณ์)" ของข้อความ. รับรองว่าข้อความไม่ถูกเปลี่ยนแปลง และมาจากผู้ส่งที่เชื่อถือได้.
อย่างไรก็ตาม "Anonymity (การไม่เปิดเผยตัวตน)" ไม่ใช่ คุณสมบัติที่ MAC รับรองได้. MAC ไม่ได้ซ่อนตัวตนของผู้ส่งหรือผู้รับ.
Non-repudiation: แม้ MAC จะช่วยสนับสนุน Non-repudiation ได้โดยการยืนยันตัวตนผู้ส่งและความสมบูรณ์ของข้อความ แต่ก็ "ไม่รับประกัน Non-repudiation อย่างเต็มที่". เพราะผู้ส่งยังสามารถปฏิเสธว่าไม่ได้ส่งข้อความได้หากไม่มีมาตรการเพิ่มเติม เช่น Digital Signatures.
** Question 130** What is the primary objective of degassing? Correct Option: C erasing the data on a disk (The source explanation states "degossing" and then "degaussing.") Keywords for Exam: primary objective, degaussing, erase data on a disk, disrupting magnetic fields, magnetic storage devices Detailed Explanation:
Degaussing (การล้างสนามแม่เหล็ก): เป็นกระบวนการที่ใช้ในการ "ลบข้อมูลอย่างถาวร" จากอุปกรณ์จัดเก็บข้อมูลแม่เหล็ก เช่น ฮาร์ดไดรฟ์. โดยการใช้สนามแม่เหล็กที่แรงเพื่อทำลายการจัดเรียงแม่เหล็กบนดิสก์ ทำให้ข้อมูลไม่สามารถกู้คืนได้. นี่เป็นวิธีการทำลายข้อมูลที่ปลอดภัย.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
ไม่ใช่เพื่อป้องกัน Side-Channel Attack (แต่เกี่ยวกับการลบข้อมูล).
ไม่ใช่เพื่อลดข้อมูลรบกวน.
ตรงกันข้ามกับการเก็บรักษาข้อมูล.
** Question 131** Which of these is part of the canons that is ISC square code of ethics? Correct Option: B advance and protect the profession Keywords for Exam: part of the canons, ISC2 code of ethics, advance and protect the profession Detailed Explanation:
ISC2 Code of Ethics Canons: (ทบทวนจากข้อ 2)
Protect society, the common good, necessary public trust and confidence, and the infrastructure.
Act honorably, honestly, justly, responsibly, and legally.
Provide diligent and competent service to principles.
Advance and protect the profession.
"Advance and protect the profession" เป็นหนึ่งใน 4 หลักจรรยาบรรณของ ISC2. จำลำดับด้วยนะ!
** Question 132** Which of these is not one of the ISC square ethics cannons? Correct Option: Consider the social consequences of the system you are designing and other as we already read in the previous questions are all the cannons of the ISC square so while considering the social consequence of the system you are designing is an important ethical consideration it is not one of the official canon of the IC square code of ethics the actual cannons of the ISC square code of ethics are as I already went through in the previous question i won't repeat it but again you should learn these canons and in this specific order Keywords for Exam: not one of the ISC2 ethics cannons, ethical consideration, not an official canon Detailed Explanation:
หลักจรรยาบรรณของ ISC2: "การพิจารณาผลกระทบทางสังคมของระบบที่คุณกำลังออกแบบ" (Considering the social consequences of the system you are designing) เป็น "ข้อควรพิจารณาทางจริยธรรมที่สำคัญ" แต่ "ไม่ใช่" หนึ่งในหลักจรรยาบรรณอย่างเป็นทางการของ ISC2.
หลักจรรยาบรรณที่เป็นทางการทั้ง 4 ข้อคือ: Protect Society, Act Honorably, Provide Diligent Service, และ Advance the Profession. (ทบทวนจากข้อ 2, 131).
** Question 133** What is the primary objective of the PCI-DSS standard? Correct Option: C secure credit card payments Keywords for Exam: primary objective, PCI-DSS standard, Payment Card Industry Data Security Standard, securing the credit card payments Detailed Explanation:
PCI-DSS (Payment Card Industry Data Security Standard): มีวัตถุประสงค์หลักในการ "รักษาความปลอดภัยการชำระเงินด้วยบัตรเครดิต" (securing the credit card payments). เพื่อให้แน่ใจว่าบริษัททุกแห่งที่จัดการข้อมูลบัตรเครดิตรักษาสภาพแวดล้อมที่ปลอดภัย เพื่อปกป้องข้อมูลผู้ถือบัตรจากการละเมิดและการทุจริต.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
PII: PCI-DSS เน้นข้อมูลบัตรเครดิต ไม่ใช่ PII โดยทั่วไป.
Change Management: เป็นแนวปฏิบัติความปลอดภัย IT ที่กว้างขึ้น.
PHI: ถูกควบคุมโดย HIPAA ไม่ใช่ PCI-DSS.
** Question 134** Which of these is an attack that encrypts the organization information and then demands payment for the decryption code? Correct Option: D ransomware Keywords for Exam: attack, encrypts the organization information, demands payment for the decryption code Detailed Explanation:
Ransomware: เป็นมัลแวร์ที่ "เข้ารหัสข้อมูลขององค์กร" ทำให้ไม่สามารถเข้าถึงได้ และ "เรียกร้องค่าไถ่" จากเหยื่อเพื่อกู้คืนการเข้าถึงข้อมูลโดยให้กุญแจถอดรหัส. (ทบทวนจากข้อ 84)
** Question 135** The primary objective of a business continuity plan is: Correct Option: B maintain business operation during a disaster Keywords for Exam: primary objective, business continuity plan, maintain business operation, during a disaster, minimize disruptions, ensure essential functions continue Detailed Explanation:
Primary Objective of BCP: เป้าหมายหลักของ Business Continuity Plan (BCP) คือการ "รักษาการดำเนินธุรกิจ" (maintain business operations) ในระหว่างและหลังภัยพิบัติหรือการหยุดชะงัก. BCP มุ่งเน้น "การลดการหยุดชะงัก" (minimizing disruptions) และ "รับประกันว่าฟังก์ชันที่สำคัญยังคงดำเนินต่อไป". (ทบทวนจากข้อ 51, 100, 107, 127)
** Question 136** Which of these is an attack whose primary goal is to gain access to a target system through falsified identity? Correct Option: C spoofing Keywords for Exam: attack, primary goal, gain access to a target system, falsified identity, impersonating another user or system Detailed Explanation:
Spoofing (การปลอมแปลง): เป็นการโจมตีที่ผู้โจมตี "ปลอมแปลงตัวตน" (falsifies their identity) เพื่อเข้าถึงระบบเป้าหมายโดยไม่ได้รับอนุญาต. ซึ่งอาจเกี่ยวข้องกับการปลอมตัวเป็นผู้ใช้, อุปกรณ์ หรือระบบอื่น เพื่อหลอกลวงเป้าหมายให้เข้าถึงได้. ตัวอย่างเช่น IP Spoofing, Email Spoofing, DNS Spoofing.
** Question 137** When an incident occurs which of these is not primary responsibility of an organization's response team? Correct Option: D communicating with top management regarding the circumstances of the cyber security event Keywords for Exam: not primary responsibility, organization's response team, communicating with top management, incident reporting or public relation teams Detailed Explanation:
ความรับผิดชอบหลักของทีมตอบสนองเหตุการณ์:
การกำหนดขอบเขตความเสียหาย.
การดำเนินการตามขั้นตอนการกู้คืน.
การพิจารณาว่าข้อมูลลับใดๆ ถูกประนีประนอมไปหรือไม่.
**การสื่อสารกับผู้บริหารระดับสูง (communicating with top management):** "ไม่ใช่ความรับผิดชอบหลัก" ของทีมตอบสนองเหตุการณ์ทางเทคนิค. การสื่อสารกับผู้บริหารระดับสูงมักจะจัดการโดย "ผู้จัดการทีมตอบสนองเหตุการณ์, ทีมรายงานเหตุการณ์ หรือทีมประชาสัมพันธ์".
** Question 138** What is the primary objective of a roll back in the context of the change management process? Correct Option: C restore the system to its lost state before the change was made Keywords for Exam: primary objective, roll back, change management process, restore the system to its previous stable state Detailed Explanation:
Primary Objective of Rollback: เป้าหมายหลักของการ Rollback ใน Change Management คือการ "กู้คืนระบบกลับสู่สถานะเดิมที่เสถียร" (restore the system to its previous stable state) หากการเปลี่ยนแปลงที่นำไปใช้ทำให้เกิดปัญหาหรือความล้มเหลวในการตรวจสอบ. เพื่อให้แน่ใจว่าธุรกิจยังคงดำเนินต่อไปและลดการหยุดชะงัก. (ทบทวนจากข้อ 40)
** Question 139** Which of these entities is responsible for signing an organization's policies? Correct Option: D senior management Keywords for Exam: responsible for signing, organization's policies, authority to approve and enforce Detailed Explanation:
ผู้รับผิดชอบในการลงนามในนโยบาย: "ผู้บริหารระดับสูง" (Senior Management) มีหน้าที่รับผิดชอบในการลงนามในนโยบายขององค์กร. เพราะพวกเขามี "อำนาจในการอนุมัติและบังคับใช้" (authority to approve and enforce) นโยบายทั่วทั้งองค์กร. การรับรองของพวกเขาแสดงถึงความมุ่งมั่นและรับประกันความรับผิดชอบ.
** Question 140** Which of these term refer to threat with unusually high technical and operational sophistication spanning months or even years? Correct Option: B APT that is advanced persistent threat Keywords for Exam: threat, unusually high technical and operational sophistication, spanning months or even years, long-term access, stealthy Detailed Explanation:
APT (Advanced Persistent Threat): คือภัยคุกคามที่มี "ความซับซ้อนทางเทคนิคและการปฏิบัติการที่สูงผิดปกติ" (unusually high technical and operational sophistication) ที่อาจกินเวลานานหลายเดือนหรือหลายปี. APT มีเป้าหมายเพื่อ "เข้าถึงระบบในระยะยาว" (long-term access) และมักใช้กลยุทธ์ที่ "ล่องหน" (stealthy) เพื่อหลีกเลี่ยงการตรวจจับ.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Rootkits: เครื่องมือที่ใช้รักษาการเข้าถึง.
Side Channel: ใช้ประโยชน์จากช่องโหว่ของระบบทางอ้อม.
Ping of Death: การโจมตีแบบ DoS.
** Question 141** The primary objective of a security baseline is to establish: Correct Option: B a minimum understood and acceptable level of security requirements Keywords for Exam: primary objective, security baseline, minimum understood and acceptable level of security requirements, consistency across the organization Detailed Explanation:
Security Baseline (ฐานความปลอดภัย): มีวัตถุประสงค์หลักในการ "กำหนดชุดข้อกำหนดด้านความปลอดภัยขั้นต่ำ" (minimum set of security requirements) ที่ทั้งเข้าใจและยอมรับได้. ทำให้แน่ใจว่าระบบทั้งหมดมีระดับการป้องกันที่เป็นที่ยอมรับ. ลดช่องโหว่และรักษาความสอดคล้องทั่วทั้งองค์กร.
** Question 142** Which of these attacks take advantage of poor input validation in websites? Correct Option: C cross-site scripting Keywords for Exam: attacks, take advantage of, poor input validation, websites, inject malicious scripts Detailed Explanation:
Cross-Site Scripting (XSS): เป็นการโจมตีที่ใช้ประโยชน์จาก "การตรวจสอบอินพุตที่ไม่ดี" (poor input validation) ในเว็บไซต์. เพื่อ "ฉีดสคริปต์ที่เป็นอันตราย" (inject malicious scripts) เข้าไปในหน้าเว็บที่ผู้ใช้อื่นดู. สคริปต์เหล่านี้สามารถขโมยข้อมูลที่ละเอียดอ่อนหรือดำเนินการในนามของผู้ใช้ได้. (ทบทวนจากข้อ 38)
** Question 143** An organization needs a network security tool that detects and acts in the event of malicious activity which of these tools will best meet their needs? Options: A router B IPS that is intrusion prevention system C IDS intrusion detection system D firewall and the correct option is option B IPS intrusion prevention system so an intrusion prevention system not only detects malicious activity but also actively takes action to block or mitigate threats in real time in contrast an intrusion detection system only monitors and alerts without intervention while firewalls and routers focus on controlling traffic and enforcing policies but are not specifically designed to detect and act against intrusions Correct Option: B IPS that is intrusion prevention system Keywords for Exam: network security tool, detects and acts, malicious activity, actively takes action to block or mitigate Detailed Explanation:
IPS (Intrusion Prevention System): IPS ไม่เพียงแต่ "ตรวจจับกิจกรรมที่เป็นอันตราย" เท่านั้น แต่ยัง "ดำเนินการอย่างแข็งขันเพื่อบล็อกหรือบรรเทาภัยคุกคาม" ในเวลาจริงด้วย.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
IDS (Intrusion Detection System): เพียงแค่ "ตรวจสอบและแจ้งเตือน" (monitors and alerts) โดยไม่มีการแทรกแซง.
Firewalls และ Routers: เน้นการควบคุมทราฟฟิกและบังคับใช้นโยบาย แต่ไม่ได้ออกแบบมาเพื่อตรวจจับและดำเนินการกับภัยคุกคามโดยเฉพาะ.
** Question 144** According to the DAC that is discretionary access control policy which of these operations can only be performed by a subject granted access to information? Correct Option: D modify security attributes Keywords for Exam: DAC, Discretionary Access Control, only be performed by a subject granted access to information, owner of the information Detailed Explanation:
DAC (Discretionary Access Control): ในนโยบาย DAC เฉพาะ Subject (เช่น เจ้าของข้อมูล) ที่มีสิทธิ์ที่เหมาะสมเท่านั้นที่สามารถ "แก้ไขคุณสมบัติความปลอดภัย" (modify security attributes) เช่น สิทธิ์การเข้าถึงหรือสิทธิ์สำหรับผู้อื่นได้.
การอ่าน, การดำเนินการ หรือการแก้ไขข้อมูล สามารถทำได้โดย Subject ที่ได้รับอนุญาต แต่การเปลี่ยนคุณสมบัติความปลอดภัยสงวนไว้เฉพาะสำหรับเจ้าของ หรือผู้ดูแลระบบที่ได้รับอนุญาตเท่านั้น.
** Question 145** In the event of non-compliance which of these can have considerable financial consequences for an organization? Correct Option: B regulation Keywords for Exam: non-compliance, considerable financial consequences, legally enforceable rules, fines and penalties Detailed Explanation:
Regulations (ข้อบังคับ): การไม่ปฏิบัติตามข้อบังคับ ซึ่งเป็นกฎที่บังคับใช้ตามกฎหมายที่กำหนดโดยหน่วยงานกำกับดูแล อาจส่งผลให้องค์กรได้รับ "ผลกระทบทางการเงินที่สำคัญ" (significant financial consequences) รวมถึงค่าปรับ, บทลงโทษ หรือการฟ้องร้อง. (ย้ำอีกครั้งถึงความสำคัญของ Regulation).
** Question 146** What does the term LAN that is local area network refer to? Correct Option: B a network on a building or limited geographical area Keywords for Exam: LAN, local area network, limited geographical area, building office or campus Detailed Explanation:
LAN (Local Area Network): คือเครือข่ายที่ครอบคลุมพื้นที่ทางภูมิศาสตร์ขนาดเล็กและจำกัด เช่น "อาคาร, สำนักงาน หรือวิทยาเขต". ใช้เพื่อเชื่อมต่ออุปกรณ์ในระยะใกล้สำหรับการแบ่งปันทรัพยากร.
LAN จะมีระยะทางจำกัด (เช่น สาย CAT 6 ไม่เกิน 100 เมตร).
** Question 147** Which of these is a type of corrective security controls? Correct Option: A patches Keywords for Exam: type of corrective security controls, fix vulnerabilities or mitigate the impact, after it has occurred Detailed Explanation:
Corrective Security Controls (มาตรการควบคุมเชิงแก้ไข): ถูกนำมาใช้ "หลังจาก" เกิดเหตุการณ์ด้านความปลอดภัย เพื่อ "แก้ไขช่องโหว่หรือบรรเทาผลกระทบ".
Patches (แพตช์): เป็น Corrective Control เพราะมัน "แก้ไข" (fix) ช่องโหว่ที่ทราบแล้วหลังจากถูกระบุ.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Encryption: Preventive (ป้องกัน). * IDS: Detective (ตรวจจับ). * Backups: Compensating (ชดเชย) เพราะให้ความซ้ำซ้อน.
** Question 148** Which of these enables point-to-point online communication or an untrusted network? Correct Option: D VPN Keywords for Exam: enables point-to-point online communication, untrusted network, encryption and tunneling protocols, privacy and security Detailed Explanation:
VPN (Virtual Private Network): ช่วยให้การสื่อสารแบบ "Point-to-Point ที่ปลอดภัย" (secure point-to-point communication) บน "เครือข่ายที่ไม่น่าเชื่อถือ" (untrusted network) เช่น อินเทอร์เน็ต. VPN ใช้การเข้ารหัสและโปรโตคอล tunneling เพื่อปกป้องข้อมูลในระหว่างการส่ง. (หลักการคือสร้างอุโมงค์ที่เข้ารหัสข้อมูล).
** Question 149** At which of the OSI layer do TCP and UDP work? Correct Option: A transport layer Keywords for Exam: OSI layer, TCP and UDP work, reliable and unreliable data transmission Detailed Explanation:
Transport Layer (Layer 4): ทั้ง TCP (Transmission Control Protocol) และ UDP (User Datagram Protocol) ทำงานที่ Transport Layer ของ OSI Model. Layer นี้รับผิดชอบการรับส่งข้อมูลระหว่างสองอุปกรณ์อย่างน่าเชื่อถือ (TCP) และไม่น่าเชื่อถือ (UDP). (TCP ใช้ 3-way handshake เพื่อความน่าเชื่อถือ, UDP เร็วกว่าแต่ไม่รับประกัน).
** Question 150** What is the primary focus of the ISO 27002 standard? Correct Option: B information security management system that is ISMS Keywords for Exam: primary focus, ISO 27002 standard, Information Security Management System (ISMS), guidelines and best practices, manage risk effectively Detailed Explanation:
ISO 27002: มาตรฐาน ISO 27002 ให้ "แนวทางและแนวปฏิบัติที่ดีที่สุด" (guidelines and best practices) สำหรับการนำไปใช้และการบำรุงรักษา "ระบบบริหารจัดการความปลอดภัยของข้อมูล (ISMS)". โดยจะเน้นการควบคุมความปลอดภัยของข้อมูลเพื่อจัดการความเสี่ยงอย่างมีประสิทธิภาพ และรับประกัน Confidentiality, Integrity และ Availability ของข้อมูล. (มันเสริม ISO 27001).
** Question 151** Which of these different submasks will allow 30 host? Correct Option: C /27 Keywords for Exam: subnet masks, allow 30 host, calculate number of hosts, 2^n - 2 Detailed Explanation:
การคำนวณจำนวนโฮสต์: สูตรคือ **2^n - 2**, โดยที่ n คือจำนวนบิตของโฮสต์.
ใน IPv4 Address มี 32 บิต. Subnet mask /27 หมายความว่ามี 27 บิตสำหรับเครือข่าย และเหลือ 5 บิตสำหรับโฮสต์ (32 - 27 = 5). * จำนวนโฮสต์ที่ใช้ได้ = 2^5 - 2 = 32 - 2 = 30 โฮสต์.
ตัวเลือกอื่น:
/26: 32 - 26 = 6 บิต -> 2^6 - 2 = 64 - 2 = 62 โฮสต์.
/30: 32 - 30 = 2 บิต -> 2^2 - 2 = 4 - 2 = 2 โฮสต์.
/29: 32 - 29 = 3 บิต -> 2^3 - 2 = 8 - 2 = 6 โฮสต์.
ข้อนี้ต้องแม่นเรื่อง Subnetting และสูตรคำนวณโฮสต์มากๆ!
** Question 152** Which of these statement about the security implications of IP version 6 is not true? Correct Option: B IPv6 net implementation is insecure Keywords for Exam: not true, security implications of IPv6, IPv6 does not include NAT Detailed Explanation:
ความจริงเกี่ยวกับ IPv6:
ไม่มี NAT: IPv6 ไม่ได้รวม Network Address Translation (NAT). เนื่องจากมี IP Address จำนวนมากใน IPv6 ทำให้ไม่จำเป็นต้องมี NAT.
กฎ Static IPV6 อาจใช้ไม่ได้: เนื่องจาก IPv6 Address มักจะถูกกำหนดแบบไดนามิก การควบคุมความปลอดภัยบางอย่างที่อาศัยกฎ Static Address (เช่น ไฟร์วอลล์ หรือ Access Control) อาจใช้ไม่ได้ในทุกกรณี.
บริการชื่อเสียงอาจยังไม่สมบูรณ์: บริการชื่อเสียง (Reputation services) ยังค่อนข้างหายากและมีประโยชน์น้อยสำหรับทราฟฟิก IPv6.
อาจ Bypass Security Control: องค์กรจำเป็นต้องกำหนดค่า Security Control เพื่อจัดการทราฟฟิก IPv6 อย่างเพียงพอ มิฉะนั้นทราฟฟิก IPv6 อาจเลี่ยงเครื่องมือความปลอดภัย IPv4 ที่มีอยู่.
ดังนั้น ข้อที่ว่า "IPv6 NAT implementation is insecure" จึง "ไม่เป็นความจริง" เพราะ IPv6 "ไม่มี NAT" เลย.
** Question 153** Which of these is a detective security control? Correct Option: B movement sensors Keywords for Exam: detective security control, identifies and alerts, security breach has occurred, does not prevent it Detailed Explanation:
Detective Security Controls (มาตรการควบคุมเชิงตรวจจับ): ถูกออกแบบมาเพื่อ "ระบุและแจ้งเตือน" (identify and alert) เมื่อมีการละเมิดความปลอดภัยเกิดขึ้น. มัน "ไม่สามารถป้องกัน" ได้ แต่จะตรวจจับเมื่อมาตรการควบคุมความปลอดภัยล้มเหลว.
Movement Sensors (เซ็นเซอร์ตรวจจับความเคลื่อนไหว): ตรวจจับความเคลื่อนไหวภายในพื้นที่ที่กำหนด. ดังนั้นจึงถือเป็น Detective Control.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Bollards (เสาเหล็กกันรถ): Preventive Control.
Turnstiles (ประตูหมุน): Preventive Control.
Firewalls (ไฟร์วอลล์): Technical Control (เน้นป้องกัน).
** Question 154** The name age and location location and job title of a person are examples of: Correct Option: B attributes Keywords for Exam: name age and location, job title, examples of, characteristics Detailed Explanation:
Attributes (คุณสมบัติ): ชื่อ, อายุ, สถานที่, ตำแหน่งงาน และลักษณะอื่นๆ เช่น ส่วนสูงหรือสีผม ล้วนเป็น "คุณสมบัติ" ที่สามารถเชื่อมโยงกับตัวตนของบุคคลได้.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Biometric: ลักษณะทางกายภาพหรือพฤติกรรม เช่น ลายนิ้วมือหรือการจดจำใบหน้า.
PII (Personally Identifiable Information): เป็นประเภทของข้อมูล ไม่ใช่ตัวอย่างเฉพาะ.
Credentials: ข้อมูลประจำตัวที่ใช้ในการยืนยันตัวตน เช่น ชื่อผู้ใช้และรหัสผ่าน.
** Question 155** Which of these cloud service models is the most suitable environment for customers that want to install their custom operating systems? Correct Option: C infrastructure as a service Keywords for Exam: cloud service model, most suitable environment, install their custom operating systems, control over the VMs Detailed Explanation:
IaaS (Infrastructure as a Service): เป็น Cloud Service Model ที่อนุญาตให้ลูกค้า "จัดการทรัพยากรคอมพิวเตอร์ รวมถึงระบบปฏิบัติการ" (manage the computing resources, including the operating system). ลูกค้าจึงมีอำนาจควบคุม VMs (Virtual Machines) และสามารถติดตั้ง OS ที่กำหนดเองได้. (ทบทวนจากข้อ 72, 85)
** Question 156** Which of these statement is true about cyber betting? Correct Option: C it is an illegal practice (The source explanation states "cyber squatting" not "cyber betting", but proceeds to define "cyber squatting" as illegal. I will assume "cyber squatting" was the intended term.) Keywords for Exam: cyber squatting, illegal practice, trademark, profiting from someone else's trademark Detailed Explanation:
Cyber Squatting (การจดทะเบียนชื่อโดเมนโดยไม่สุจริต): เป็นการปฏิบัติที่ "ผิดกฎหมาย" (illegal practice). โดยเป็นการจดทะเบียนและขายชื่อโดเมนโดยมีเจตนาที่จะทำกำไรจากเครื่องหมายการค้าของผู้อื่น. (เช่น จด mycompany.com แล้วนำไปเสนอขายให้เจ้าของเครื่องหมายการค้านั้นในราคาที่สูงกว่า). การกระทำนี้ถือเป็นการฉ้อฉลและหลอกลวง.
** Question 157** Which of these addresses is commonly reserved specifically for broadcasting? Correct Option: D 192.29.191.255 Keywords for Exam: addresses, commonly reserved, specifically for broadcasting, last address inside a subnet Detailed Explanation:
Broadcast Address: ใน IPv4 Address, Address ที่ลงท้ายด้วย "255" โดยทั่วไปจะ "สงวนไว้สำหรับการ Broadcast" (reserved for broadcasting) ไปยังอุปกรณ์ทั้งหมดบนเครือข่ายนั้น.
Network Address: Address ที่ลงท้ายด้วย "0" สงวนไว้เพื่อระบุเครือข่ายนั้นเอง.
ดังนั้น 192.29.191.255 เป็น Broadcast Address.
** Question 158** Which department is in a company is not typically involved in a disaster recovery plan that is DRP? Correct Option: B financial (The highlighted correct option here is financial, but in question 96, the explanation pointed to executives. I will prioritize the direct highlighted answer here unless the explanation contradicts strongly. In this case, the explanation given in source for Q96 aligns with "financial" not being regularly involved, while Q96's highlighted answer was "executives." This seems to be an inconsistency in the source material. I will follow the explicit answer provided for this question.) Keywords for Exam: not typically involved, disaster recovery plan, DRP Detailed Explanation:
Financial Department (ฝ่ายการเงิน): "ไม่ค่อยมีส่วนเกี่ยวข้อง" ในแผน DRP. ยกเว้นเมื่อปัญหาเกี่ยวข้องโดยตรงกับการเงินของบริษัท.
** Question 159** Which of these pairs does not constitute multifactor authentication? Correct Option: C password and username Keywords for Exam: not constitute multifactor authentication, multi-factor, more than one factor, same type of authentication factor Detailed Explanation:
Multi-Factor Authentication (MFA): ใช้ "ปัจจัยการยืนยันตัวตนมากกว่าหนึ่งปัจจัย" (more than one factor). (ทบทวนจากข้อ 54)
Something You Know (สิ่งที่รู้): รหัสผ่าน, ชื่อผู้ใช้, PIN.
Something You Are (สิ่งที่เป็น): ลายนิ้วมือ, Biometrics.
Something You Have (สิ่งที่มี): OTP, บัตรเครดิต.
Password และ Username: ไม่ใช่ MFA เพราะทั้งสองอย่างจัดอยู่ในประเภทเดียวกันคือ "Something You Know".
** Question 160** What is the main use of a ping sweep? Correct Option: C to discover live hosts Keywords for Exam: main use, ping sweep, discover live hosts, network scanning technique, identify active devices Detailed Explanation:
Ping Sweep: เป็นเทคนิคการสแกนเครือข่ายที่ใช้ในการ "ค้นหาโฮสต์ที่กำลังทำงานอยู่" (discover live hosts) หรือ "ระบุอุปกรณ์ที่ใช้งานอยู่" โดยการส่งคำขอ ICMP (Ping) ไปยัง IP Address ในเครือข่าย. เพื่อตรวจสอบว่า Host ใดกำลังออนไลน์อยู่. Host ที่ออนไลน์จะตอบกลับด้วยข้อความตอบกลับ.
** Question 161** A poster reminding the best password management practice is an example of which type of learning activity? Correct Option: A awareness Keywords for Exam: poster reminding, best password management practice, example of, learning activity, engaging a user's attention, security conscious culture Detailed Explanation:
Awareness (การสร้างความตระหนัก): โปสเตอร์ที่เตือนความจำเกี่ยวกับแนวปฏิบัติที่ดีที่สุดในการจัดการรหัสผ่าน เป็นตัวอย่างของกิจกรรม "Awareness". ซึ่งเป็นส่วนหนึ่งของโปรแกรม Security Awareness ที่มีเป้าหมายเพื่อ "ดึงดูดความสนใจของผู้ใช้" (engaging a user's attention) และส่งเสริม "วัฒนธรรมที่ตระหนักถึงความปลอดภัย" (security conscious culture).
** Question 162** In the context of the CIA Triad which part is primarily jeopardized in a distributed denial of service DDoS attack? Correct Option: B availability Keywords for Exam: CIA triad, primarily jeopardized, distributed denial of service attack, inaccessible, compromise availability Detailed Explanation:
DDoS Attack: การโจมตีแบบ Distributed Denial of Service (DDoS) มีเป้าหมายหลักคือการ "ประนีประนอม Availability (ความพร้อมใช้งาน)". ทำให้บริการไม่สามารถใช้งานได้สำหรับผู้ใช้ที่ตั้งใจจะใช้งาน. (ทบทวนจากข้อ 23, 58)
** Question 163** What is the main purpose of motion detection in security cameras? Correct Option: B to reduce video storage space Keywords for Exam: main purpose, motion detection, security cameras, reduce video storage space, records only when motion is detected Detailed Explanation:
Motion Detection (การตรวจจับความเคลื่อนไหว): กล้องตรวจจับความเคลื่อนไหวจะ "บันทึกเฉพาะเมื่อตรวจพบการเคลื่อนไหว" (records only when motion is detected). ซึ่งช่วยลดความต้องการพื้นที่จัดเก็บวิดีโอ. หากบันทึกตลอดเวลาจะใช้พื้นที่จัดเก็บจำนวนมาก.
** Question 164** An organization that uses a layered approach when designing its security architecture is using which of these security approaches? Correct Option: B defense in depth Keywords for Exam: layered approach, security architecture, security approaches, different layers of security controls Detailed Explanation:
Defense in Depth (การป้องกันแบบหลายชั้น): องค์กรที่ใช้ "แนวทางแบบ Layered Approach" ในการออกแบบสถาปัตยกรรมความปลอดภัย กำลังใช้แนวทาง "Defense in Depth". (ทบทวนจากข้อ 1, 117)
** Question 165** Which of these techniques will ensure the property of nonrepudiation what does non-repudiation mean non-repudiation means that when a sender sends a message the sender cannot later deny that he or she has sent the message? Correct Option: C digital signatures Keywords for Exam: techniques, ensure the property of non-repudiation, cannot later deny, digital signatures Detailed Explanation:
**Non-repudiation (การไม่สามารถปฏิเสธความรับผิดชอบได้):** หมายถึงการรับรองว่าผู้ส่ง "ไม่สามารถปฏิเสธ" (cannot later deny) การส่งข้อความนั้นได้ในภายหลัง. "Digital Signatures (ลายเซ็นดิจิทัล)" ให้การจับคู่ที่ไม่สามารถปฏิเสธได้ระหว่างผู้ส่งและลายเซ็นดิจิทัล. (ทบทวนจากข้อ 41 และ 129)
** Question 166** A USB pen with data passed around the office is an example of: Correct Option: B data at rest Keywords for Exam: USB pen with data, passed around the office, example of, stored data, resides on storage media Detailed Explanation:
Data at Rest (ข้อมูลขณะพัก): เมื่อข้อมูลถูกจัดเก็บอยู่บน USB หรืออุปกรณ์จัดเก็บข้อมูลอื่นๆ ถือเป็น "Data at Rest". (ทบทวนจากข้อ 110)
** Question 167** Suppose that an organization wants to implement measures to strengthen its detective access controls which of which one of these tools should they implement? Correct Option: C IDS **Keywords for Exam:** detective access controls, tool, implement, monitors network traffic, alerts on suspicious activity Detailed Explanation:
IDS (Intrusion Detection System): เป็นเครื่องมือ "Detective Access Control". ทำหน้าที่ "ตรวจสอบทราฟฟิกเครือข่าย" (monitors network traffic) และ "แจ้งเตือนเมื่อมีกิจกรรมที่น่าสงสัย" (alerts on suspicious activity) สำหรับกิจกรรมที่เป็นอันตรายหรือการละเมิดนโยบาย. ดังนั้นจึงเป็น Detective Control. (ทบทวนจากข้อ 5, 143)
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Patches: Corrective Control.
Encryption: Preventive Control.
Backups: Compensating Control.
** Question 168** Which of these is an example of a MAC address media access control address? **Correct Option: B 00:0a:95:9d:68:16** Keywords for Exam: example of a MAC address, six groups of two hexadecimal digits, separated by colons or hyphens Detailed Explanation:
MAC Address (Media Access Control Address): เป็นที่อยู่ฮาร์ดแวร์ที่ไม่ซ้ำกัน ซึ่งระบุอุปกรณ์บนเครือข่าย. โดยทั่วไปจะแสดงเป็น "เลขฐานสิบหก 6 กลุ่ม กลุ่มละ 2 หลัก" (six groups of two hexadecimal digits) คั่นด้วยโคลอน (:) หรือขีดกลาง (-). ตัวเลขฐานสิบหกจะใช้ตัวเลข 0-9 และตัวอักษร A-F. ดังนั้น 00:0a:95:9d:68:16 เป็น MAC Address.
** Question 169** Which of these types of credential is not used in multiffactor authentication? Correct Option: D something you trust Keywords for Exam: not used in multifactor authentication, authentication factors, something you know, something you are, something you have Detailed Explanation:
Authentication Factors (ปัจจัยการยืนยันตัวตน): (ทบทวนจากข้อ 54, 159)
Something You Know (สิ่งที่รู้)
Something You Are (สิ่งที่เป็น)
Something You Have (สิ่งที่มี)
**"Something You Trust"** ไม่ใช่ปัจจัยการยืนยันตัวตนที่ได้รับการยอมรับใน Multi-Factor Authentication.
** Question 170** In an incident response team who is the main conduit to senior management? Correct Option: A management Keywords for Exam: incident response team, main conduit to senior management, communication, decisions Detailed Explanation:
**Management (ผู้บริหาร/ผู้จัดการ):** สมาชิกฝ่ายบริหาร หรือ "ผู้นำองค์กร" (organization leadership) ทำหน้าที่เป็น "ช่องทางหลัก" (primary conduit) ในการเชื่อมโยงกับผู้บริหารระดับสูง. พวกเขายังรับประกันว่าการตัดสินใจที่ยากหรือเร่งด่วนสามารถทำได้โดยไม่ต้องยกระดับอำนาจ. (ทบทวนจากข้อ 60, 137)
** Question 171** Which of these is not an effective way to protect an organization from cyber criminals? **Correct Option: C using outdated antimalware software** Keywords for Exam: not an effective way, protect, cyber criminals, outdated antimalware software, new threats emerge daily Detailed Explanation:
**วิธีป้องกันที่ไม่มีประสิทธิภาพ:** การใช้ "ซอฟต์แวร์ป้องกันมัลแวร์ที่ล้าสมัย" (outdated antimalware software) เป็นวิธีที่ "ไม่มีประสิทธิภาพ" ในการป้องกันองค์กรจากอาชญากรไซเบอร์. เพราะภัยคุกคามใหม่ๆ เกิดขึ้นทุกวัน และซอฟต์แวร์ที่ล้าสมัยไม่สามารถตรวจจับหรือป้องกันมัลแวร์ล่าสุดได้. จำเป็นต้องมีการอัปเดตอย่างต่อเนื่อง. การป้องกันที่มีประสิทธิภาพต้องอาศัยการอัปเดตเครื่องมือความปลอดภัยอย่างสม่ำเสมอ.
วิธีป้องกันที่ดี:
การลบหรือปิดบริการและโปรโตคอลที่ไม่จำเป็น.
การใช้ไฟร์วอลล์.
การใช้ระบบตรวจจับและป้องกันการบุกรุก (IDS/IPS).
** Question 172** Which of these cannot be a corrective security control? **Correct Option: D CCTV cameras** Keywords for Exam: cannot be a corrective security control, corrective controls fix or mitigate, after an incident Detailed Explanation:
**Corrective Security Controls:** ใช้เพื่อ "แก้ไขหรือบรรเทาผลกระทบ" หลังจากเกิดเหตุการณ์.
CCTV Cameras: "ไม่สามารถเป็น Corrective Control ได้". เพราะกล้อง CCTV เป็น Detective Control (ตรวจจับ) และ Deterrent Control (ยับยั้ง). มันไม่สามารถแก้ไขความเสียหายหลังจากเกิดเหตุการณ์ได้.
ตัวอย่าง Corrective Controls: Patches, Backups, Antivirus (เมื่อใช้เพื่อลบมัลแวร์).
** Question 173** Which of these is included in NSLA that is service level agreement document? Correct Option: A instructions on data ownership and destruction Keywords for Exam: included in SLA, service level agreement, contract, data ownership handling and destruction Detailed Explanation:
SLA (Service Level Agreement): เป็นสัญญาที่กำหนดระดับบริการที่คาดหวัง. มักรวมถึง "คำแนะนำเกี่ยวกับการเป็นเจ้าของข้อมูล, การจัดการ และนโยบายการทำลายข้อมูล". (ทบทวนจากข้อ 97).
** Question 174** Which of these is the standard port for SSH that is secure shell? Correct Option: D 22 Keywords for Exam: standard port, SSH, secure shell, encrypted network protocol Detailed Explanation:
**SSH (Secure Shell):** ใช้ **Port 22** เป็นพอร์ตมาตรฐาน. เป็นโปรโตคอลเครือข่ายที่เข้ารหัสสำหรับการสื่อสารที่ปลอดภัย. (ทบทวนจากข้อ 32).
พอร์ตอื่นๆ:
80: HTTP.
443: HTTPS.
25: SMTP.
** Question 175** Which type of attack attempts to mislead user into exposing personal information by sending fraudulent email? Correct Option: D fishing Keywords for Exam: attack, mislead user, exposing personal information, fraudulent email, deceptive emails Detailed Explanation:
Phishing (ฟิชชิง): เป็นการโจมตีแบบ Social Engineering ที่ผู้ไม่หวังดีส่ง "อีเมลหลอกลวง" (fraudulent emails) ที่ออกแบบมาให้ดูเหมือนถูกต้องตามกฎหมาย. อีเมลเหล่านี้มีเป้าหมายเพื่อหลอกลวงผู้ใช้ให้เปิดเผยข้อมูลส่วนบุคคลที่ละเอียดอ่อน. (ทบทวนจากข้อ 82)
** Question 176** Which of these is not a characteristics of the cloud? Correct Option: A zero customer responsibility Keywords for Exam: not a characteristic of the cloud, shared responsibility model, customers and cloud providers share security and operational responsibilities Detailed Explanation:
ลักษณะของ Cloud (ตาม NIST Cloud Computing Model): **Zero Customer Responsibility** ไม่ใช่ลักษณะของคลาวด์. การใช้บริการคลาวด์จะอยู่ภายใต้ **Shared Responsibility Model** (โมเดลความรับผิดชอบร่วมกัน) ซึ่งลูกค้าและผู้ให้บริการคลาวด์ "แบ่งปันความรับผิดชอบ" ด้านความปลอดภัยและการดำเนินงาน. (ทบทวนจากข้อ 72)
** Question 177** Which of these is a common mistake made when implementing record retention policies? Correct Option: C applying the longest retention periods to the information Keywords for Exam: common mistake, record retention policies, applying the longest retention periods indiscriminately, unnecessary storage cost, inefficiency, legal or compliance risk Detailed Explanation:
**ข้อผิดพลาดทั่วไปในนโยบายการเก็บรักษาบันทึก:** คือการ "ใช้ระยะเวลาการเก็บรักษาที่ยาวนานที่สุดกับข้อมูลทั้งหมดโดยไม่เลือกปฏิบัติ" (applying the longest retention periods to all information indiscriminately). การทำเช่นนี้อาจนำไปสู่ "ต้นทุนการจัดเก็บที่ไม่จำเป็น, ความไม่มีประสิทธิภาพ และความเสี่ยงทางกฎหมายหรือการปฏิบัติตามข้อกำหนด" (unnecessary storage costs, inefficiencies, and legal or compliance risks). ควรมีการจำแนกข้อมูลและใช้ระยะเวลาการเก็บรักษาที่เหมาะสมกับแต่ละประเภท. (ทบทวนจากข้อ 108)
** Question 178** Which type of security control does not include CCTV cameras? Correct Option: A corrective Keywords for Exam: not include CCTV cameras, type of security control, corrective control, fix or mitigate the effect after it has occurred Detailed Explanation:
CCTV Cameras: โดยทั่วไปเกี่ยวข้องกับ:
Deterrent (ยับยั้ง): ป้องปรามกิจกรรมที่เป็นอันตราย.
Preventive (ป้องกัน): ช่วยป้องกันเหตุการณ์โดยการตรวจสอบพื้นที่แบบเรียลไทม์.
Detective (ตรวจจับ): บันทึกเหตุการณ์เพื่อการวิเคราะห์ในภายหลังเพื่อระบุเหตุการณ์.
อย่างไรก็ตาม กล้อง CCTV "ไม่เป็น Corrective Control". เพราะไม่สามารถแก้ไขหรือบรรเทาผลกระทบของการละเมิดความปลอดภัยหลังจากที่เกิดขึ้นแล้วได้. (ทบทวนจากข้อ 147, 172)
** Question 179** Which of these privacy and data protection regulation focus primarily on securing PHI that is protected health information? Correct Option: B HIPPA Keywords for Exam: privacy and data protection regulation, focus primarily on securing PHI, protected health information, healthcare data Detailed Explanation:
HIPAA (Health Insurance Portability and Accountability Act): เป็นข้อบังคับของสหรัฐอเมริกาที่เน้น "การรักษาความปลอดภัย PHI (Protected Health Information)". ซึ่งกำหนดให้องค์กรต้องกำหนดและรับรองนโยบายความปลอดภัยเพื่อปกป้อง PHI จากการเข้าถึง, การใช้ หรือการเปิดเผยที่ไม่ได้รับอนุญาต. (ทบทวนจากข้อ 91)
** Question 180** Which of these cloud deployment models is a combination of public and private cloud storage? Correct Option: C hybrid Keywords for Exam: cloud deployment models, combination of public and private cloud storage, flexibility, scalability Detailed Explanation:
**Hybrid Cloud (คลาวด์แบบผสมผสาน):** เป็นการรวมกันระหว่าง "Public Cloud" และ "Private Cloud". ซึ่งให้ความยืดหยุ่นและการขยายขนาดได้. (ทบทวนจากข้อ 3).
** Question 181** What is the primary goal of a change management policy? Correct Option: C ensure that system changes are performed systematically without negatively affecting business operations Keywords for Exam: primary goal, change management policy, system changes, without negatively affecting business operations, minimize disruptions and risks Detailed Explanation:
Primary Goal of Change Management Policy: เป้าหมายหลักของนโยบายการจัดการการเปลี่ยนแปลงคือการ "รับประกันว่าการเปลี่ยนแปลงระบบ, กระบวนการ หรือโครงสร้างพื้นฐานจะดำเนินการอย่างควบคุมและเป็นระบบ". นโยบายนี้มีเป้าหมายเพื่อ "ลดการหยุดชะงักและความเสี่ยง" (minimize disruptions and risks) ทำให้มั่นใจว่าการเปลี่ยนแปลงจะไม่ส่งผลกระทบในทางลบต่อการดำเนินธุรกิจ, ความปลอดภัย หรือการส่งมอบบริการ. (ทบทวนจากข้อ 16).
** Question 182** Which of these is not a feature of a seam that is security information and event management tool? Correct Option: D log encryption Keywords for Exam: not a feature of a SIEM, log encryption, managed by other security mechanisms Detailed Explanation:
SIEM (Security Information and Event Management):
คุณสมบัติหลัก:
Log Collection (การรวบรวมบันทึก): รับข้อมูลจากอุปกรณ์และแอปพลิเคชันต่างๆ.
Log Analysis (การวิเคราะห์บันทึก): ใช้กฎและอัลกอริธึมเพื่อตรวจจับภัยคุกคามด้านความปลอดภัย.
Log Consolidation (การรวมบันทึก): รวบรวมบันทึกจากแหล่งต่างๆ ไปยังตำแหน่งส่วนกลาง.
Log Retention (การเก็บรักษาบันึก): ทำให้มั่นใจว่าบันทึกถูกจัดเก็บไว้เป็นระยะเวลาที่กำหนด.
"Log Encryption (การเข้ารหัสบันทึก)": โดยทั่วไปจะจัดการโดยกลไกหรือเครื่องมือรักษาความปลอดภัยอื่นๆ ไม่ใช่คุณสมบัติหลักของ SIEM.
** Question 183** A number of people are using the same credentials on a shared account what is the best strategy to secure the account? Correct Option: D a one-time password based on an app or a token Keywords for Exam: shared account, best strategy to secure, one-time password, app or a token, ensures each access is unique Detailed Explanation:
**การรักษาความปลอดภัยบัญชีที่ใช้ร่วมกัน:**
วิธีที่ดีที่สุด: **One-Time Password (OTP) ผ่านแอปพลิเคชันหรือ Token**. เพราะ OTP จะสร้างรหัสผ่านที่ไม่ซ้ำกันสำหรับแต่ละเซสชันการเข้าสู่ระบบ. ซึ่งจะทำให้แน่ใจว่าการเข้าถึงแต่ละครั้งจะ "ไม่ซ้ำกัน" (unique). ทำให้การใช้ Credential ร่วมกันปลอดภัยยิ่งขึ้น.
การใช้รหัสผ่านที่ซับซ้อนอย่างเดียวไม่ช่วยแก้ปัญหา เพราะหลายคนยังคงใช้รหัสผ่านเดียวกัน.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
การเพิ่มรหัสผ่านที่ซับซ้อน: ไม่ช่วยแก้ปัญหาที่หลายคนใช้รหัสผ่านเดียวกัน.
การเปลี่ยนรหัสผ่านบ่อยๆ: ช่วยได้บ้าง แต่ยังไม่ปลอดภัยเท่า OTP.
การใช้ OTP จะทำให้ไม่สามารถมีรหัสผ่านที่ซับซ้อน เนื่องจากปัญหานี้เกี่ยวข้องกับจำนวนคนใช้ Credential เดียวกันมากกว่าความแข็งแกร่งของ Credential.
วิธีที่มีประสิทธิภาพกว่า:
One-Time Password (OTP) ผ่านแอปพลิเคชันหรือ Token.
Biometric Authentication.
** Question 184** When analyzing risks which of these activities is required? Correct Option: C determining the likelihood of occurrence of a set of risk Keywords for Exam: analyzing risks, activity required, determining the likelihood of occurrence, assessing the impact Detailed Explanation:
**การวิเคราะห์ความเสี่ยง:** กิจกรรมที่จำเป็นในการวิเคราะห์ความเสี่ยงคือ **การกำหนดความเป็นไปได้ที่จะเกิดชุดของความเสี่ยง** (determining the likelihood of occurrence of a set of risks) และ **การประเมินผลกระทบที่อาจเกิดขึ้น** (assessing their potential impact). (ทบทวนจากข้อ 36, 73).
** Question 185** Which of these exercises goes through a sample of an incident step by step validating that each person what each person will do? Correct Option: B a walk through exercise Keywords for Exam: exercises, goes through a sample of an incident step by step, validating that each person what each person will do, clarify roles and responsibility Detailed Explanation:
Walkthrough Exercise (การฝึกซ้อมแบบ Walkthrough): เกี่ยวข้องกับการทบทวนตัวอย่างเหตุการณ์ "ทีละขั้นตอน" (step by step). ทำให้ผู้เข้าร่วมแต่ละคนสามารถ "ตรวจสอบสิ่งที่พวกเขาจะทำในแต่ละขั้นตอน" (validate what they will do at each stage). การฝึกซ้อมนี้ช่วย "ชี้แจงบทบาทและความรับผิดชอบ" (clarify roles and responsibility) ในกรณีที่เกิดเหตุการณ์.
ทำไมถึงไม่ใช่ตัวเลือกอื่น:
Simulation Exercise (การจำลองสถานการณ์): เกี่ยวข้องกับสถานการณ์ที่ "สมจริงและเป็นพลวัตมากขึ้น" (more dynamic realistic scenario).
**Tabletop Exercise (การฝึกซ้อมแบบ Tabletop):** เป็นการอภิปรายที่ไม่เป็นทางการเกี่ยวกับสถานการณ์จำลอง.
** Question 186** Which of these documents is the least formal? Correct Option: C guidelines Keywords for Exam: documents, least formal, non-mandatory, recommendations or best practices Detailed Explanation:
**Guidelines (แนวทางปฏิบัติ):** ถือเป็นเอกสารที่ "ไม่เป็นทางการน้อยที่สุด" (least formal). ให้คำแนะนำหรือแนวปฏิบัติที่ดีที่สุด แต่ "ไม่บังคับ" และให้ความยืดหยุ่นในการปฏิบัติตาม. (ทบทวนจากข้อ 74)
** Question 187 & Question 188** A backup that captures the changes made since the last full backup is an example of: Correct Option: Differential backup Keywords for Exam: backup, captures the changes, since the last full backup, efficient, faster to restore than incremental Detailed Explanation:
**Differential Backup (การสำรองข้อมูลแบบ Differential):** เก็บการเปลี่ยนแปลงทั้งหมดที่เกิดขึ้น **"นับตั้งแต่การสำรองข้อมูลแบบ Full ครั้งล่าสุด" (since the last full backup)** เท่านั้น. (และไม่รีเซ็ต archive bit) **Incremental Backup (การสำรองข้อมูลแบบ Incremental):** เก็บเฉพาะการเปลี่ยนแปลงที่เกิดขึ้น **"นับตั้งแต่การสำรองข้อมูลครั้งล่าสุด" (ไม่ว่าจะเป็น Full หรือ Incremental)**. (และรีเซ็ต archive bit)
การกู้คืน:
Differential: ต้องการ Full Backup ล่าสุด 1 ชุด + Differential Backup ล่าสุด 1 ชุด.
Incremental: ต้องการ Full Backup ล่าสุด 1 ชุด + Incremental Backup ทั้งหมดตั้งแต่ Full Backup ครั้งล่าสุด.
** Question 189** A high-level executive of an organization receives a spear fishing email this is an example of: Correct Option: C wailing Keywords for Exam: high-level executive, spear phishing email, example of, targeting senior executives Detailed Explanation:
**Whaling:** เป็นรูปแบบหนึ่งของ Spear Phishing ที่ "มุ่งเป้าไปที่ผู้บริหารระดับสูง" (high-level executive) หรือบุคคลสำคัญในองค์กร. (ทบทวนจากข้อ 80, 128).
** Question 190** What does redundancy mean in the context of cyber security? Correct Option: D conceiving systems with duplicate components so that if a failure occurs there will be a backup Keywords for Exam: redundancy, cyber security, duplicate components, backup component, maintaining system availability, preventing downtime Detailed Explanation:
Redundancy (ความซ้ำซ้อน): ในบริบทของ Cyber Security, Redundancy หมายถึงการ "ออกแบบระบบที่มีส่วนประกอบสำรอง" (duplicate components) เช่น เซิร์ฟเวอร์, แหล่งจ่ายไฟ หรือพอร์ตเครือข่าย. เพื่อให้แน่ใจว่าหากส่วนใดส่วนหนึ่งล้มเหลว จะมี "ส่วนประกอบสำรอง" (backup component) เข้ามาทำงานแทน. เป็นสิ่งสำคัญในการ "รักษาความพร้อมใช้งานของระบบ" (maintaining system availability) และ "ป้องกันการหยุดทำงาน" (preventing downtime).
** Question 191** What is the main objective of a denial of service attack? Correct Option: D to consume all available resources Keywords for Exam: main objective, denial of service attack, consume all available resources, make a service unavailable Detailed Explanation:
Denial of Service (DoS) Attack: มีเป้าหมายหลักคือการ "ใช้ทรัพยากรที่มีอยู่ทั้งหมด" (consume all available resources) เช่น แบนด์วิธ, หน่วยความจำ หรือพลังงานประมวลผล. ทำให้บริการของระบบหรือเครือข่ายไม่สามารถใช้งานได้สำหรับผู้ใช้ที่ตั้งใจจะใช้งาน. (ทบทวนจากข้อ 23, 58, 162)`;

export function getQuestions(): Question[] {
    const allQuestions: Question[] = [];
    let idCounter = 1;

    // --- PARSER 1: 20 Flashcard-style questions ---
    const generatedOptionsMap: Record<number, string[]> = {
        1: ["Trojan", "Virus", "Worm", "Rootkit"],
        2: ["Man-in-the-middle attack", "ARP jacking", "TCP-D attack", "Denial of Service attack"],
        3: [
            "Allow organizations to specify appropriate Security Controls based on sensitivity and impact.",
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
            "Something you know and Something you are.",
            "Something you have and Something you do.",
            "Something you know and Something you have.",
            "Two 'Something you know' factors."
        ],
        10: ["Availability", "Confidentiality", "Integrity", "Non-repudiation"],
        11: ["Two Person Control", "Separation of Duty", "Least Privilege", "Security through obscurity"],
        12: ["Technical", "Administrative", "Physical", "Managerial"],
        13: ["Document the decision.", "Implement a new control immediately.", "Transfer the risk to a third party.", "Ignore the risk completely."],
        14: ["Mitigation", "Acceptance", "Avoidance", "Transference"],
        15: ["Procedure", "Policy", "Standard", "Guideline"],
        16: ["SLA (Service Level Agreement)", "MOU (Memorandum of Understanding)", "NDA (Non-Disclosure Agreement)", "BPA (Business Partner Agreement)"],
        17: ["Non-repudiation", "Confidentiality", "Authentication", "Integrity"],
        18: ["Proxy Trojan", "Session Hijacking", "Cross-Site Scripting", "SQL Injection"],
        19: ["Incremental", "Differential", "Full Backup", "Snapshot"],
        20: ["Adding a second factor for authentication.", "Using a stronger electronic lock.", "Implementing a physical lock.", "Changing the code frequently."]
    };

    const blocks1 = rawText1.trim().split(/\n\d+\. /).slice(1);
    blocks1.forEach((block, index) => {
        const questionMatch = block.match(/คำถาม \(English\): ([\s\S]+?)\nคีย์เวิร์ดสำคัญ:/);
        const keywordsMatch = block.match(/คีย์เวิร์ดสำคัญ: (.+)\n/);
        const answerMatch = block.match(/คำตอบ \(English\): (.+)\.?\n/);
        const explanationMatch = block.match(/คำอธิบายแนวคิด: ([\s\S]+)/);

        if (questionMatch && keywordsMatch && answerMatch && explanationMatch) {
            const questionText = questionMatch[1].trim();
            const keywords = keywordsMatch[1].split(',').map(k => k.replace(/"/g, '').trim());
            const correctAnswer = answerMatch[1].trim().replace(/^C\. /, '');
            const explanation = explanationMatch[1].trim();
            const options = generatedOptionsMap[index + 1] || [];
             if (!options.includes(correctAnswer) && !correctAnswer.startsWith("Allow")) {
                const randomIndex = Math.floor(Math.random() * (options.length + 1));
                options.splice(randomIndex, 0, correctAnswer);
            }

            const domain = mapKeywordsToDomain(keywords);

            allQuestions.push({
                id: idCounter++,
                question: questionText,
                options: options.map(o => o.replace(/^\w\. /, '')),
                correctAnswer: correctAnswer.replace(/^\w\. /, ''),
                explanation,
                keywords,
                domain
            });
        }
    });

    // --- PARSER 2: 200 Multiple-choice questions ---
    const blocks2 = rawText2.trim().split(/\*\* Question \d+\*\*/).filter(Boolean);
    blocks2.forEach(block => {
        try {
            const questionMatch = block.match(/^(.*?)\s+Options:/s);
            const optionsMatch = block.match(/Options:\s+([\s\S]+?)\s+Correct Option:/s);
            const correctOptionMatch = block.match(/Correct Option:\s+([\s\S]+?)\s+Keywords for Exam:/s);
            const keywordsMatch = block.match(/Keywords for Exam:\s+(.*?)\s+Detailed Explanation:/s);
            const explanationMatch = block.match(/Detailed Explanation:\s+([\s\S]+)$/s);

            if (questionMatch && optionsMatch && correctOptionMatch && keywordsMatch && explanationMatch) {
                const questionText = questionMatch[1].trim();
                const options = optionsMatch[1].trim().split(/(?=\s[B-D]\s)/).map(o => o.trim().replace(/^[A-D]\s/, ''));
                let correctAnswer = correctOptionMatch[1].trim();
                correctAnswer = correctAnswer.split(/\s+so\s+/i)[0].trim();
                correctAnswer = correctAnswer.replace(/^[A-D]\s/, '').trim();
                
                const keywords = keywordsMatch[1].trim().split(/,\s*/);
                const explanation = explanationMatch[1].trim();
                const domain = mapKeywordsToDomain(keywords);

                if (!options.map(o => o.toLowerCase()).includes(correctAnswer.toLowerCase())) {
                    if (options.length === 4) {
                       const correctOptionLetterMatch = correctOptionMatch[1].trim().match(/^[A-D]/);
                       if(correctOptionLetterMatch) {
                           const letter = correctOptionLetterMatch[0];
                           const idx = letter.charCodeAt(0) - 'A'.charCodeAt(0);
                           if(options[idx] && correctAnswer.length > options[idx].length) {
                               correctAnswer = options[idx];
                           }
                       }
                    }
                }

                allQuestions.push({
                    id: idCounter++,
                    question: questionText,
                    options,
                    correctAnswer,
                    explanation,
                    keywords,
                    domain
                });
            }
        } catch(e) {
            console.error("Error parsing question block", e);
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
    });

    // --- PARSER 2: From rawText2 (Concept Flashcards) ---
    const blocks2 = rawText2.trim().split(/\*\* Question \d+\*\*/).filter(Boolean);
    blocks2.forEach(block => {
        try {
            const correctOptionMatch = block.match(/Correct Option:\s+([\s\S]+?)\s+Keywords for Exam:/s);
            const keywordsMatch = block.match(/Keywords for Exam:\s+(.*?)\s+Detailed Explanation:/s);
            const explanationMatch = block.match(/Detailed Explanation:\s+([\s\S]+)$/s);

            if (correctOptionMatch && keywordsMatch && explanationMatch) {
                // Clean up the "front" to be a concise concept
                let front = correctOptionMatch[1].trim();
                front = front.split(/\s+so\s+/i)[0].trim(); // Remove "so..." explanations
                front = front.split(/(\(|Note:)/)[0].trim(); // Remove parenthetical explanations
                front = front.replace(/^[A-D]\s/, '').trim(); // Remove leading "A "
                
                // Check for empty front after cleaning
                if (!front) return;

                const back = explanationMatch[1].trim();
                const keywords = keywordsMatch[1].trim().split(/,\s*/);
                const domain = mapKeywordsToDomain(keywords);

                flashcards.push({
                    id: idCounter++,
                    front: front.charAt(0).toUpperCase() + front.slice(1),
                    back,
                    domain
                });
            }
        } catch (e) {
            console.error("Error parsing concept flashcard block from rawText2", e);
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
    const isCorrect = selectedAnswer ? selectedAnswer === question.correctAnswer : false;
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