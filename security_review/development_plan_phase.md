# แผนการพัฒนาตามระยะเฟส (Development Phase Plan)
## ระบบ Two-Layer Security Review (SAST & LLM Orchestration)

เอกสารนี้ระบุรายละเอียดทางวิศวกรรมอินพุต เอาต์พุต และความเสี่ยงในแต่ละเฟสการพัฒนาของระบบ Two-Layer Security Review

---

## 📅 ตารางสรุปเวลาของเฟสการพัฒนา (Roadmap Schedule)

| ลำดับเฟส | รายละเอียดเฟส | ระยะเวลา |
| :---: | :--- | :---: |
| **เฟส 1** | การเตรียมสภาพแวดล้อมและโมเดล (Infrastructure & Model Hosting) | สัปดาห์ที่ 1 - 2 |
| **เฟส 2** | การสร้าง MCP Server และชุดเครื่องมือ (MCP Development & Tooling) | สัปดาห์ที่ 3 - 4 |
| **เฟส 3** | การเชื่อมโยง GitLab Pipeline (CI/CD Pipeline Integration) | สัปดาห์ที่ 5 - 6 |
| **เฟส 4** | ระบบป้องกันความปลอดภัย AI และทดสอบนำร่อง (Guardrails & Pilot Run) | สัปดาห์ที่ 7 - 8 |

---

## 1. 🖥️ เฟส 1: การเตรียมสภาพแวดล้อมและโมเดล (Infrastructure & Model Hosting)

### 📌 เป้าหมาย (Goal)
จัดตั้งเซิร์ฟเวอร์ประมวลผลโมเดลภาษาขนาดใหญ่ (LLM) ภายในระบบเครือข่ายองค์กร (VPC) เพื่อรองรับการเรียกใช้งานอย่างมั่นคง ปลอดภัย และมีความหน่วงเวลาต่ำ

### 📋 ขั้นตอนการตรวจสอบและผลงานที่ต้องส่งมอบ (Checks & Deliverables)
- [ ] **1. Setup GPU Instance:** สร้างและจูนเครื่อง Server ที่ติดตั้งการ์ดจอ GPU (NVIDIA A10G/A100) ภายในเครือข่ายภายใน
- [ ] **2. Install Engine:** ติดตั้ง vLLM engine สำหรับให้บริการ Inference API
- [ ] **3. Model Deployment:** ติดตั้งและดึงโมเดล Qwen2.5-Coder และ Kimi-Coder เข้าสู่หน่วยความจำเครื่อง
- [ ] **4. API Performance Audit:** รันสคริปต์ Benchmark เพื่อยืนยันว่ามีความเร็วในการประมวลผล Token ต่ำกว่า 30ms ต่อ Token และพร้อมรันงานแบบขนาน (Concurrent Requests)

---

## 2. 🔌 เฟส 2: การสร้าง MCP Server และชุดเครื่องมือ (MCP Development & Tooling)

### 📌 เป้าหมาย (Goal)
พัฒนาตัวกลางประสานงาน (MCP Server Orchestrator) ที่จะคอยรับคำสั่งและจัดเตรียมฟังก์ชัน/เครื่องมือความปลอดภัยที่ LLM สามารถเรียกใช้เพื่อเข้าถึงซอร์สโค้ดและส่งรายงานได้

### 📋 ขั้นตอนการตรวจสอบและผลงานที่ต้องส่งมอบ (Checks & Deliverables)
- [ ] **1. Initialize MCP Boilerplate:** ตั้งต้นโฟลเดอร์โปรเจกต์ด้วย TypeScript/Node.js และเชื่อมต่อสิทธิ์ความปลอดภัย
- [ ] **2. Develop File Readers:** พัฒนาตัวถอดรหัส `read_sarif_findings` สำหรับอ่านไฟล์ SARIF และ `read_diff` สำหรับอ่าน Git Diff
- [ ] **3. Develop Writers:** พัฒนาตัวส่งข้อมูล `post_mr_comment` สำหรับโพสต์ความคิดเห็นบน MR และ `create_vulnerability_ticket` สำหรับเปิด Issue บัตรงาน
- [ ] **4. Security Sandbox Audit:** ตรวจสอบและจำกัดสิทธิ์ของชุดระบบไม่ให้ข้ามโฟลเดอร์หรือสิทธิ์นอกพื้นที่กำหนด (Sandboxing check)

---

## 3. 🔄 เฟส 3: การเชื่อมโยง GitLab Pipeline (CI/CD Pipeline Integration)

### 📌 เป้าหมาย (Goal)
บูรณาการระบบทั้งหมดเข้ากับ GitLab CI/CD โดยอัตโนมัติ เพื่อให้ทุกครั้งที่มีการเปิด MR จะทำงานผ่านด่าน SAST และตามด้วยด่าน AI ทันที

### 📋 ขั้นตอนการตรวจสอบและผลงานที่ต้องส่งมอบ (Checks & Deliverables)
- [ ] **1. CI Pipeline Config:** สร้างและตั้งค่าส่วนต่อขยายงานของ `.gitlab-ci.yml` สำหรับด่าน SonarQube และ Snyk
- [ ] **2. Artifact Configuration:** กำหนดค่าการส่งออกไฟล์ข้อมูลให้อยู่ในรูปของ `.sarif` ผ่านระบบ Artifacts ของ GitLab
- [ ] **3. Orchestrator Script:** พัฒนาสคริปต์ `trigger-mcp-review.js` เพื่อรันบน GitLab CI Runner สำหรับติดต่อกับ MCP Server
- [ ] **4. End-to-End Test Run:** รันการทดสอบส่ง Pipeline บน MR จำลอง และตรวจสอบว่าผล SARIF ถูกส่งออกไปได้อย่างครบถ้วน

---

## 🛡️ เฟส 4: ระบบป้องกันความปลอดภัย AI และทดสอบนำร่อง (Guardrails & Pilot Run)

### 📌 เป้าหมาย (Goal)
ปรับจูนความแม่นยำของคำตอบ ตรวจสอบภัยคุกคามด้านความปลอดภัยต่อ AI (Prompt Injection) และเริ่มรันระบบใช้งานจริงกับทีมพัฒนาตัวอย่างเพื่อวัดประสิทธิภาพก่อนสเกลจริง

### 📋 ขั้นตอนการตรวจสอบและผลงานที่ต้องส่งมอบ (Checks & Deliverables)
- [ ] **1. System Prompt Optimization:** ปรับจูน System Prompt ของ LLM และแนบข้อมูลความรู้ (RAG) ให้ตอบคำแนะนำที่มีความเที่ยงตรงและปลอดภัยสูงสุด
- [ ] **2. Prompt Injection Defense Check:** ตรวจสอบกระบวนการนำส่งข้อมูลโค้ดดิ้งที่ตั้งใจเขียนเพื่อบ่อนทำลายตัวแปรคำสั่งของ AI (Injection Simulation)
- [ ] **3. Pilot Implementation:** นำระบบเชื่อมโยงกับโปรเจกต์ของทีมพัฒนาตัวอย่าง (1-2 ทีม) เพื่อเก็บข้อมูลการตอบรับใช้งานจริง
- [ ] **4. Metrics Audit:** ตรวจสอบเวลาในการรีวิว (เป้าหมายต่ำกว่า 20 นาที) และอัตราคัดแยก False Positive (เป้าหมายความแม่นยำสูงกว่า 85%) ก่อนทำการเปิดให้ทุกโครงการในองค์กรใช้ต่อไป
