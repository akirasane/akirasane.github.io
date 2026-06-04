# รายการงานและสถานะการตรวจสอบ (Development Checklist & Verification)
## ระบบ Two-Layer Security Review (SAST & LLM Orchestration)

ใช้สำหรับติดตามสถานะการพัฒนาและการตรวจสอบระบบความปลอดภัยแบบสองชั้นทีละขั้นตอน

---

### 1. 🏗️ ขั้นตอนที่ 1: การจัดตั้งระบบโครงสร้างพื้นฐานและโมเดล (Infrastructure & Model Setup)
- [ ] **1.1 ติดตั้ง vLLM / Ollama**
  - [ ] จัดเตรียมเซิร์ฟเวอร์พร้อม GPU (NVIDIA A10G / A100 หรือใกล้เคียง) ในเครือข่าย VPC
  - [ ] ติดตั้ง vLLM หรือ Ollama Container
  - [ ] เปิดใช้งาน Endpoint API สำหรับส่งคำร้องขอภายใน
- [ ] **1.2 ดาวน์โหลดและโหลดโมเดลเข้าหน่วยความจำ (Model Loading)**
  - [ ] โหลดโมเดล Qwen2.5-Coder (แนะนำขนาด 14B หรือ 32B)
  - [ ] โหลดโมเดล Kimi-Coder (สำหรับสแกน Context ความยาวสูง)
- [ ] **1.3 ทดสอบการให้บริการระดับพื้นฐาน (Smoke Test)**
  - [ ] รันการส่งข้อสอบสั้นๆ เพื่อวัดเวลาตอบสนอง (Response Latency)
  - [ ] ตรวจสอบว่าโมเดลประมวลผลโค้ดเบื้องต้นได้ถูกต้อง

---

### 2. 🔌 ขั้นตอนที่ 2: พัฒนาและเชื่อมต่อระบบ MCP Server (MCP Server Development)
- [ ] **2.1 เริ่มต้นโครงการ MCP Server**
  - [ ] จัดตั้งโครงการ Node.js / TypeScript หรือ Python
  - [ ] ติดตั้งชุดคำสั่ง `@modelcontextprotocol/sdk`
- [ ] **2.2 พัฒนาเครื่องมือในการอ่านข้อมูล (Read Tools)**
  - [ ] ฟังก์ชันอ่านผลสแกน `read_sarif_findings` (รองรับการแกะไฟล์มาตรฐาน SARIF)
  - [ ] ฟังก์ชันดึงโค้ดส่วนต่าง `read_diff` (เชื่อมต่อกับ GitLab API)
- [ ] **2.3 พัฒนาเครื่องมือในการเขียนรายงาน (Write Tools)**
  - [ ] ฟังก์ชันโพสต์คอมเมนต์ `post_mr_comment` (ยิงคอมเมนต์แบบ inline)
  - [ ] ฟังก์ชันสร้างบัตรงาน `create_vulnerability_ticket` (ยิงสร้าง GitLab Issue หรือ Jira Ticket)
- [ ] **2.4 ทดสอบความปลอดภัยของเครื่องมือ (Tool Sandboxing)**
  - [ ] ตรวจสอบสิทธิ์การเข้าถึง (Least Privilege) ของ Token
  - [ ] ล็อกกระบวนการเขียนคำสั่ง (Audit Log) ทุกกรณี

---

### 3. 🔄 ขั้นตอนที่ 3: รวมระบบเข้ากับ GitLab CI/CD (Pipeline Integration)
- [ ] **3.1 ตั้งค่าการสแกนระดับสถิต (SAST Stages)**
  - [ ] ปรับแก้ `.gitlab-ci.yml` เพื่อตั้งด่าน SonarQube และ Export เป็น SARIF
  - [ ] ปรับแก้ `.gitlab-ci.yml` เพื่อตั้งด่าน Snyk และ Export เป็น SARIF
- [ ] **3.2 ติดตั้งตัวกระตุ้น AI (AI Trigger Agent)**
  - [ ] จัดทำสคริปต์ `trigger-mcp-review.js` สำหรับทำงานใน Runner
  - [ ] ตั้งค่าการส่ง DIFF และ SARIF Payload ไปหา MCP Server เมื่อเกิด Merge Request
- [ ] **3.3 ทดสอบการเชื่อมต่อปลายทางแบบครบวงจร (Integration Test)**
  - [ ] ทดลองเปิด Merge Request จำลองที่มีช่องโหว่ความเสี่ยงต่ำ
  - [ ] ตรวจสอบความถูกต้องว่าการส่งไฟล์ SARIF และได้รับผลลัพธ์ผ่านไปได้ด้วยดี

---

### 4. 🛡️ ขั้นตอนที่ 4: การตั้งค่าระบบป้องกันและปรับจูนความแม่นยำ (AI Guardrails & Prompt Tuning)
- [ ] **4.1 ทดสอบและปรับแต่ง System Prompt**
  - [ ] นำส่งคำสั่งบังคับแยกแยะโค้ดดิบและคำสั่งวิเคราะห์ (Prompt Injection Defense)
  - [ ] ปรับแต่งเพื่อให้ได้การวิเคราะห์ที่มีแหล่งอ้างอิงชัดเจน (Anti-Hallucination)
- [ ] **4.2 ตรวจสอบความแม่นยำและทดสอบ Pilot Run**
  - [ ] รันการจัดกลุ่มความถูกต้อง (FP Triage Precision Benchmark) ให้มีความถูกต้องสูงกว่า 85%
  - [ ] ทดลองเปิดใช้จริงกับทีมพัฒนากลุ่มเล็ก เพื่อประเมินผลความเห็น (Dev Feedback Loop)
  - [ ] วัดระยะเวลาตอบสนองรวมของระบบทั้งหมด (ต้องต่ำกว่า 5 นาทีต่อ Merge Request)
