# Product Requirements Document (PRD)
## ระบบ Two-Layer Security Review (SAST & LLM Orchestration)

---

## 1. ภาพรวมของระบบ (System Overview)

### 1.1 ที่มาและความสำคัญ (Background)
การตรวจสอบความปลอดภัยของซอร์สโค้ด (Secure Code Review) ในปัจจุบันมักเผชิญปัญหาคอขวด 2 ประการหลัก:
1. **ปริมาณแจ้งเตือนที่ผิดพลาด (High False Positive Rate) จากเครื่องมือ SAST:** แม้ว่า SAST (เช่น SonarQube, Snyk) จะทำงานได้รวดเร็วและครอบคลุมโค้ดเบสทั้งหมด แต่เนื่องจากเป็นการวิเคราะห์แบบสถิตตามเงื่อนไข (Static Rules) จึงขาดการเข้าใจบริบทของโค้ด ส่งผลให้สร้างความน่ารำคาญ (Alert Fatigue) ให้กับทีมพัฒนา
2. **ข้อจำกัดในการตรวจจับ Logic Flaws:** ช่องโหว่เชิงตรรกะทางธุรกิจ (Business Logic Vulnerabilities) เช่น การสิทธิ์ผิดพลาด (Broken Access Control), การข้ามด่านยืนยันตัวตน (IDOR) หรือการรั่วไหลข้อมูลทางอ้อม มักหลุดรอดการตรวจสอบจาก SAST ไปได้ ทำให้ต้องใช้ทีม Security Analyst/Tech Lead ในการรีวิวด้วยตนเอง ซึ่งต้องใช้เวลาเฉลี่ยสูงถึง 2 ชั่วโมงต่อหนึ่ง Merge Request (MR)

### 1.2 แนวทางการแก้ไข (Proposed Solution)
ระบบ **Two-Layer Security Review** ได้รับการออกแบบขึ้นเพื่อผสานจุดเด่นของเครื่องมือวิเคราะห์ระดับอุตสาหกรรมเข้ากับพลังการวิเคราะห์บริบทของ Large Language Model (LLM) ภายใต้โครงสร้างการทำงานแบบ **Human-in-the-loop** เพื่อให้มั่นใจได้ว่ามีความถูกต้องสูงสุด ปลอดภัย และไม่หน่วงกระบวนการ Deploy โดยแบ่งเป็น 3 ด่านหลัก:
- **ด่าน 1 — SAST (SonarQube + Snyk):** คัดกรองรวดเร็วเชิงปริมาณ ค้นหารูปแบบช่องโหว่พื้นฐาน (Known Vulnerability Patterns) และ Dependency CVEs
- **ด่าน 2 — Self-hosted LLM (ผ่าน MCP Server):** รับซอร์สโค้ด Diff และผลจาก SARIF มาวิเคราะห์บริบท เพื่อคัดแยก False Positive ค้นหาช่องโหว่เชิง Logic และเสนอแนวทางการแก้ไขพร้อมข้อมูลอ้างอิง
- **ด่าน 3 — Human Approve:** นักพัฒนาหรือผู้ตรวจสอบ (Tech Lead/SA) รีวิวรายงานและอนุมัติขั้นสุดท้ายก่อนเข้าสู่กระบวนการ Merge

> [!NOTE]
> **ปรัชญาการทำงานหลัก:** SAST รับภาระ "ปริมาณ" ➡️ LLM รับภาระ "บริบท" ➡️ คนรับภาระ "ความรับผิดชอบ"

---

## 2. วัตถุประสงค์และตัวชี้วัด (Objectives & Key Results)

### 2.1 วัตถุประสงค์หลัก (Core Objectives)
- เพื่อลดระยะเวลาการทำ Code Security Review ของทีมพัฒนาลงอย่างมีนัยสำคัญ
- เพื่อยระดับความแม่นยำในการระบุช่องโหว่เชิงตรรกะ (Logic Vulnerabilities) ที่ระบบสแกนอัตโนมัติมักตรวจไม่พบ
- เพื่อให้มั่นใจในเรื่องความปลอดภัยของข้อมูลซอร์สโค้ดและทรัพย์สินทางปัญญา โดยการทำงานทั้งหมดอยู่ภายใต้ Infra ขององค์กร (VPC) เท่านั้น

### 2.2 ตัวชี้วัดประสิทธิภาพ (KPIs)
- **Review Time:** ลดระยะเวลาเฉลี่ยในการตรวจสอบความปลอดภัย MR จาก 2 ชั่วโมง เหลือต่ำกว่า **20 นาที**
- **False Positive (FP) Rate:** ลดอัตราผลลัพธ์ที่แจ้งเตือนผิดพลาดที่ส่งถึงสายตานักพัฒนาลงอย่างน้อย **70%**
- **Logic Vulnerability Detection:** ค้นพบช่องโหว่ประเภท Authorization Flaw / IDOR / Broken Access Control ได้ตั้งแต่ระยะ Development ก่อนปล่อยสู่ Production

---

## 3. หลักการออกแบบระบบ (Design Principles)

1. **Advisory, not Authoritative (เป็นผู้แนะนำ ไม่ใช่ผู้ตัดสินใจ):** LLM ทำหน้าที่สรุปและวิเคราะห์เพื่อช่วยตัดสินใจ การอนุมัติและการปฏิเสธการ Merge (Gate Control) จะขึ้นตรงกับการตัดสินใจของมนุษย์ (Human Approval) เท่านั้น
2. **Self-hosted / Internal Infra Only:** โค้ดและความลับของบริษัทห้ามถูกส่งไปยัง API ภายนอกเด็ดขาด ระบบจะทำงานบนเครื่องโมเดลที่โฮสต์เอง (เช่น Qwen2.5-Coder / Kimi-Coder ผ่าน vLLM/Ollama) ภายใน VPC ของบริษัท
3. **Reference-backed (ตรวจสอบย้อนกลับได้):** การวิเคราะห์และข้อเสนอแนะทุกชิ้นต้องมีแหล่งอ้างอิงมาตรฐานอุตสาหกรรมกำกับเสมอ (เช่น CWE, CVE, OWASP Top 10) เพื่อลดปัญหาโมเดลคิดไปเอง (Hallucination)
4. **Code = Data (โค้ดคือข้อมูลดิบ):** ป้องกันภัยคุกคามประเภท Prompt Injection โดยมองซอร์สโค้ดที่รับเข้ามาวิเคราะห์เป็นเพียง Data ไม่ใช่คำสั่งที่สั่งรันบนระบบ
5. **Incremental Scope (วิเคราะห์เฉพาะส่วนต่าง):** เพื่อความรวดเร็วและประหยัดทรัพยากร ระบบจะสแกนและรีวิวเฉพาะโค้ด Diff ของ MR นั้นๆ เท่านั้น ไม่ทำการวิเคราะห์ Repository ทั้งหมดใหม่ทุกครั้ง

---

## 4. องค์ประกอบที่สำคัญ (Key Components)

ระบบจะแบ่งออกเป็น 5 ส่วนประกอบหลัก ดังนี้:

```mermaid
flowchart TB
    Dev["Developer"] -->|"git push / Open MR"| Git["GitLab Repository"]
    Git -->|"Trigger Pipeline"| CI["GitLab CI/CD Pipeline"]

    subgraph L1["Layer 1: SAST Engine (ปริมาณ / ความเร็ว)"]
        Sonar["SonarQube (Code Smells & Vuln Patterns)"]
        Snyk["Snyk (SCA & Dependency CVEs)"]
    end

    CI --> L1
    L1 -->|"Scan Results (SARIF)"| MCP["MCP Server (Orchestrator)"]
    CI -->|"Code Diff & Context"| MCP

    subgraph L2["Layer 2: AI Review Engine (วิเคราะห์บริบท)"]
        LLM["Self-hosted LLM (Qwen2.5-Coder / Kimi-Coder)"]
        KB["Security Knowledge Base (OWASP / CWE / CVE)"]
        LLM <--> KB
    end

    MCP --> L2
    L2 -->|"Triage FP + Explanation + Fixes"| MCP

    MCP -->|"Post Inline Comments"| MR["MR Comments"]
    MCP -->|"Auto-open Issue"| Issue["GitLab Issues / Jira"]

    MR --> Human{"Human Reviewer (Dev / Tech Lead)"}
    Issue --> Human
    Human -->|"Approve Fix"| Merge["Merge to Main"]
    Human -->|"Request Changes"| Dev
```

1. **GitLab & CI/CD Pipeline:** ทำหน้าที่เป็นผู้กระตุ้นระบบ (Trigger Stage) เมื่อมีการผลักดันโค้ดใหม่ (git push) หรือสร้าง Merge Request
2. **SAST Stage (SonarQube & Snyk):** รันการวิเคราะห์โค้ดเบื้องต้น และแปลงรายงานความผิดปกติให้ออกมาเป็นโครงสร้างข้อมูลมาตรฐานในรูปแบบ **SARIF** (Static Analysis Results Interchange Format)
3. **MCP Server (Model Context Protocol):** ทำหน้าที่เป็นตัวประสานงาน (Orchestrator) แลกเปลี่ยนข้อมูลระหว่าง GitLab, ไฟล์ SARIF และโมเดลภาษาขนาดใหญ่ (LLM) โดยเตรียมฟังก์ชันเครื่องมือ (Tools) เช่น `read_diff`, `read_sarif`, `post_mr_comment`, `create_issue` ภายใต้สิทธิ์ขั้นต่ำที่จำเป็น (Least Privilege)
4. **Self-hosted LLM (vLLM / Ollama):** ส่วนประมวลผลการวิเคราะห์ระดับสูงและให้เหตุผล (Reasoning) โดยประเมินว่าปัญหาที่ SAST ค้นพบน่าจะเป็น False Positive หรือไม่ และทำการสแกนหาช่องโหว่เพิ่มเติม
5. **Knowledge Base RAG (Optional):** ชุดข้อมูลมาตรฐานความปลอดภัย (CWE, CVE, OWASP) เพื่อเป็นแหล่งอ้างอิงให้โมเดลค้นหาเพื่อยืนยันข้อผิดพลาด

---

## 5. กระบวนการทำงานแบบละเอียด (Step-by-step Workflow)

### 5.1 ขั้นตอนลำดับการทำงาน (Sequence Flow)
ความสัมพันธ์และการโต้ตอบกันระหว่างส่วนต่างๆ แสดงตามแผนภาพลำดับขั้นตอนนี้:

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant Git as GitLab
    participant CI as CI/CD Pipeline
    participant SAST as SAST Tools (Sonar/Snyk)
    participant MCP as MCP Server
    participant LLM as Self-hosted LLM
    actor Rev as Human Reviewer (Tech Lead)

    Dev->>Git: git push หรือ เปิด MR
    Git->>CI: Trigger Pipeline
    CI->>SAST: เริ่มสแกนโค้ด (SAST Stage)
    SAST-->>CI: ส่งกลับผลการสแกน (SARIF Format)
    CI->>MCP: ส่งข้อมูล Diff และ SARIF Payload
    MCP->>LLM: ขอผลรีวิว (ส่งคำสั่งพร้อม Diff + SARIF)
    LLM-->>MCP: รายงานการวิเคราะห์ (FP Triage + Logic Vuln + แนวทางแก้)
    MCP->>Git: โพสต์ความคิดเห็นแบบตรงบรรทัด (Inline MR Comments)
    MCP->>Git: เปิดการแจ้งเตือน Issue (เฉพาะช่องโหว่ความรุนแรงสูง)
    Git-->>Rev: แจ้งเตือนกระบวนการ Review
    Rev->>Git: ตรวจสอบความถูกต้องและตัดสินใจ (Approve / Reject)
    Note over Rev,Git: Merge ได้ก็ต่อเมื่อได้รับการอนุมัติจากมนุษย์เท่านั้น
```

### 5.2 ลำดับการประมวลผลและการตัดสินใจ (Decision Logic)
กระบวนการคัดแยกผลและด่านตรวจสอบได้รับการจัดการตามโฟลว์ต่อไปนี้:

```mermaid
flowchart TD
    Start["SAST Finding รายงานเข้ามา"] --> Q1{"LLM: ตรงกับบริบทโค้ดและเป็นจริงหรือไม่?"}
    
    Q1 -->|"ไม่ใช่ (คาดว่าเป็น False Positive)"| LabelFP["ใส่ฉลาก: Likely False Positive<br/>พร้อมบันทึกเหตุผลสนับสนุน"]
    Q1 -->|"ใช่ (ของจริง / Confirmed Vuln)"| LabelTP["ยืนยันความเสี่ยง (Confirmed)<br/>ค้นหาข้อมูลอ้างอิง CWE/CVE และสร้าง Code Fix"]
    
    LabelFP --> H_FP{"คนประเมินระดับ FP"}
    LabelTP --> OpenTicket["เปิด Ticket/Issue อัตโนมัติ"] --> H_TP{"คนประเมินแผนแก้ไข"}
    
    H_FP -->|"เห็นชอบว่าเป็น FP"| Dismiss["ยกเลิกสแกน (Dismiss)"]
    H_FP -->|"ไม่ใช่ FP (เป็นปัญหาจริง)"| LabelTP
    
    H_TP -->|"เห็นชอบแผนแก้โค้ด"| Done["อนุมัติและรวมโค้ด (Merge)"]
    H_TP -->|"ต้องแก้ไขเพิ่มเติม"| BackToDev["ส่งข้อมูลกลับหาผู้พัฒนา"]
```

---

## 6. ข้อกำหนดการป้องกันระบบของ AI (AI Guardrails)

เพื่อลดความเสี่ยงจากการใช้งานปัญญาประดิษฐ์ ระบบจะต้องติดตั้งมาตรการป้องกันความปลอดภัย 4 ด้านหลัก:

- **ป้องกัน Prompt Injection:** ซอร์สโค้ดของผู้อื่นที่ส่งเข้ามาวิเคราะห์อาจมีคำสั่งสอดแทรก (Injection Attacks) เช่น การเขียนคอมเมนต์สั่งให้ AI ละเว้นการตรวจสอบ ระบบจะต้องมีฟิลเตอร์คัดกรอง หรือการใช้ System Prompt ที่แยกชุดคำสั่งและข้อมูลออกจากกันอย่างสิ้นเชิง
- **ป้องกันความลื่นไหลข้อมูลลวง (Anti-Hallucination):** บังคับให้การแจ้งเตือนช่องโหว่ทุกประการที่โมเดลระบุ จะต้องมีการชี้วัดแหล่งอ้างอิงที่สามารถทวนสอบได้ (เช่น ลิงก์ CWE, รหัส CVE) หากไม่มีข้อมูลสนับสนุนเพียงพอ ให้ทำเครื่องหมายเป็น `needs human verification` แทนการกล่าวอ้างลอยๆ
- **รักษาความเป็นส่วนตัวของข้อมูล (Data Privacy):** ระบบการประมวลผลต้องปิดสิทธิ์ในการเชื่อมต่อออกสู่โครงข่ายภายนอก (Internet Egress Limit) เพื่อป้องกันไม่ให้โมเดลหรือสคริปต์สุ่มส่งข้อมูลโค้ดดิบออกไปนอกบริษัท
- **จำกัดสิทธิ์การเข้าถึงข้อมูลระบบ (MCP Sandbox & Isolation):** MCP Server จะต้องจำกัดวงการรันคำสั่ง (Least Privilege Access) ไม่มีสิทธิ์ในการเข้าถึงระบบจัดเก็บไฟล์ในเครื่องอื่น และการรันเครื่องมือหรือทูลส์ต้องถูกสร้างบนสภาพแวดล้อมที่จำกัดวง (Container Isolation)

---

## 7. แผนการใช้งานจริงและเป้าหมายในอนาคต (Deployment & Beyond)

- **ระยะนำร่อง (Pilot Run):** เริ่มการเชื่อมต่อกับทีมพัฒนาขนาดเล็ก (1-2 โครงการ) เพื่อทำการปรับจูน (Finetuning/Prompt Engineering) โมเดล LLM ให้รับรู้บริบทของไลบรารีภายในของบริษัท
- **การขยายผล (Scaling):** เมื่ออัตรา FP ลดลงเหลือต่ำกว่าที่เกณฑ์กำหนด และตัวชี้วัดความพึงพอใจของนักพัฒนาเพิ่มขึ้น จะปรับใช้ระบบแบบบังคับใช้กับทุกโครงการบน GitLab ขององค์กร
- **ระบบจัดเก็บประวัติ (Triage Memory/Feedback Loop):** ในอนาคตจะเชื่อมโยงปุ่มอนุมัติของคนเก็บลงในฐานข้อมูล เพื่อใช้เป็นตัวอย่างสอนเสริม (Few-shot learning examples) ให้กับ AI ในรอบการวิเคราะห์ถัดไป ปรับลดความผิดพลาดซ้ำเดิม
