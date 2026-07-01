import type { PortfolioData } from './types'

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = url
  })
}

const getCircularAvatarData = (img: HTMLImageElement): string => {
  const canvas = document.createElement('canvas')
  const size = Math.min(img.width, img.height)
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return img.src

  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()

  ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size)
  return canvas.toDataURL('image/png')
}

const fetchFontAsBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()

  let binary = ''
  const bytes = new Uint8Array(arrayBuffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

/**
 * Generates a PDF resume from the given portfolio data and triggers a browser download.
 * Incorporates a premium two-column split layout with skill badges, work timelines, and liquid glass card styling.
 */
export async function generateResumePDF(data: PortfolioData): Promise<void> {
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  let yLeft = 20
  let yRight = 20

  const { profile, experiences, skills, projects } = data

  // Load avatar and custom Kanit font asynchronously before PDF generation starts
  let circularAvatarBase64: string | null = null
  let fontFamily = 'helvetica'

  try {
    const [avatarImg, regBase64, boldBase64] = await Promise.all([
      loadImage('/img/avatar.jpg').catch(() => null),
      fetchFontAsBase64('https://raw.githubusercontent.com/google/fonts/main/ofl/kanit/Kanit-Regular.ttf').catch(() => null),
      fetchFontAsBase64('https://raw.githubusercontent.com/google/fonts/main/ofl/kanit/Kanit-Bold.ttf').catch(() => null)
    ])

    if (avatarImg) {
      circularAvatarBase64 = getCircularAvatarData(avatarImg)
    }

    if (regBase64 && boldBase64) {
      doc.addFileToVFS('Kanit-Regular.ttf', regBase64)
      doc.addFont('Kanit-Regular.ttf', 'Kanit', 'normal')

      doc.addFileToVFS('Kanit-Bold.ttf', boldBase64)
      doc.addFont('Kanit-Bold.ttf', 'Kanit', 'bold')

      fontFamily = 'Kanit'
    }
  } catch (err) {
    console.warn('Failed to load dynamic assets, falling back to system defaults', err)
  }

  // ── Helper Drawings ───────────────────────────────────────────────────────

  const GState = (doc as any).GState || (jsPDF as any).GState
  const setAlpha = (alpha: number) => {
    if (GState) {
      doc.setGState(new GState({ opacity: alpha }))
    }
  }

  const drawAmbientBackground = () => {
    // Ambient off-white base
    doc.setFillColor('#FAFBFD')
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    // Liquid Glass glowing gradient orbs
    // Orb 1: Top-Right (Soft Indigo)
    doc.setFillColor('#EEF2FF')
    doc.circle(200, 30, 60, 'F')

    // Orb 2: Middle-Left (Soft Emerald)
    doc.setFillColor('#ECFDF5')
    doc.circle(10, 160, 70, 'F')

    // Orb 3: Bottom-Right (Soft Pink)
    doc.setFillColor('#FDF2F8')
    doc.circle(190, 260, 65, 'F')
  }

  const drawPageSkeleton = () => {
    drawAmbientBackground()

    // Left column glass card (Dark Slate translucent)
    setAlpha(0.95)
    doc.setFillColor('#0B0F19')
    doc.roundedRect(10, 15, 55, 267, 3, 3, 'F')

    // Left card subtle border
    doc.setDrawColor('#1E293B')
    doc.setLineWidth(0.3)
    doc.roundedRect(10, 15, 55, 267, 3, 3, 'D')

    // Right column glass card (Pure White translucent)
    setAlpha(0.92)
    doc.setFillColor('#FFFFFF')
    doc.roundedRect(70, 15, 130, 267, 3, 3, 'F')

    // Right card thin clean border
    doc.setDrawColor('#E2E8F0')
    doc.setLineWidth(0.35)
    doc.roundedRect(70, 15, 130, 267, 3, 3, 'D')

    // Restore full opacity for rendering text
    setAlpha(1.0)
  }

  const drawInitialsBadge = (x: number, yVal: number, name: string) => {
    const initials = name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()

    doc.setFillColor('#1A202C')
    doc.circle(x, yVal, 10, 'F')

    doc.setDrawColor('#6366F1')
    doc.setLineWidth(0.4)
    doc.circle(x, yVal, 10, 'D')

    doc.setFont(fontFamily, 'bold')
    doc.setFontSize(10)
    doc.setTextColor('#FFFFFF')
    doc.text(initials, x - 2.8, yVal + 1.2)
  }

  const addLeftHeader = (title: string, yVal: number) => {
    doc.setFont(fontFamily, 'bold')
    doc.setFontSize(9)
    doc.setTextColor('#6366F1')
    doc.text(title.toUpperCase(), 15, yVal)

    doc.setDrawColor('#1E293B')
    doc.setLineWidth(0.3)
    doc.line(15, yVal + 1.8, 50, yVal + 1.8)
    return yVal + 5
  }

  const addContactItem = (label: string, value: string, yVal: number) => {
    doc.setFont(fontFamily, 'bold')
    doc.setFontSize(6.5)
    doc.setTextColor('#94A3B8')
    doc.text(label.toUpperCase(), 15, yVal)

    doc.setFont(fontFamily, 'normal')
    doc.setFontSize(8)
    doc.setTextColor('#FFFFFF')

    const lines = doc.splitTextToSize(value, 38) as string[]
    doc.text(lines, 15, yVal + 3.5)

    return yVal + 3.5 + lines.length * 3 + 3.2
  }

  const drawSkillPill = (text: string, x: number, yVal: number) => {
    doc.setFont(fontFamily, 'normal')
    doc.setFontSize(7.5)
    const textWidth = doc.getTextWidth(text)
    const pillWidth = textWidth + 4.5
    const pillHeight = 4.8

    // Pill background
    doc.setFillColor('#1E1B4B')
    doc.roundedRect(x, yVal - 3.4, pillWidth, pillHeight, 1.2, 1.2, 'F')

    // Pill border
    doc.setDrawColor('#4F46E5')
    doc.setLineWidth(0.2)
    doc.roundedRect(x, yVal - 3.4, pillWidth, pillHeight, 1.2, 1.2, 'D')

    // Pill text
    doc.setTextColor('#FFFFFF')
    doc.text(text, x + 2.2, yVal)

    return pillWidth
  }

  const addLeftSkills = (categoryName: string, items: typeof skills[0]['items'], yVal: number) => {
    doc.setFont(fontFamily, 'bold')
    doc.setFontSize(8)
    doc.setTextColor('#E2E8F0')
    doc.text(categoryName, 15, yVal)

    let currentY = yVal + 4.5
    let currentX = 15
    const rowHeight = 7.5

    items.forEach((item) => {
      const text = `${item.name} (${item.years}y)`
      const textWidth = doc.getTextWidth(text)
      const pillWidth = textWidth + 4.5

      if (currentX + pillWidth > 50) {
        currentX = 15
        currentY += rowHeight
      }

      drawSkillPill(text, currentX, currentY)
      currentX += pillWidth + 1.8
    })

    return currentY + 8.5
  }

  const drawLeftSidebar = () => {
    const avatarWidth = 49.5
    const avatarX = 37.5 - avatarWidth / 2
    const avatarY = 19
    const centerAvatarX = 37.5
    const centerAvatarY = avatarY + avatarWidth / 2
    const avatarRadius = avatarWidth / 2

    // Circle Photo Avatar or Initials Badge
    if (circularAvatarBase64) {
      doc.addImage(circularAvatarBase64, 'PNG', avatarX, avatarY, avatarWidth, avatarWidth)

      // double glowing borders
      doc.setDrawColor('#6366F1')
      doc.setLineWidth(0.4)
      doc.circle(centerAvatarX, centerAvatarY, avatarRadius + 0.4, 'D')
      doc.setDrawColor('#4F46E5')
      doc.setLineWidth(0.2)
      doc.circle(centerAvatarX, centerAvatarY, avatarRadius + 1.0, 'D')
    } else {
      // Initials badge scaled up
      doc.setFillColor('#1A202C')
      doc.circle(centerAvatarX, centerAvatarY, avatarRadius, 'F')
      doc.setDrawColor('#6366F1')
      doc.setLineWidth(0.4)
      doc.circle(centerAvatarX, centerAvatarY, avatarRadius, 'D')

      const initials = (profile.name || 'Resume')
        .split(' ')
        .map((n) => n.charAt(0))
        .join('')
        .toUpperCase()

      doc.setFont(fontFamily, 'bold')
      doc.setFontSize(22)
      doc.setTextColor('#FFFFFF')
      doc.text(initials, centerAvatarX - 6.5, centerAvatarY + 2.8)
    }

    let yL = 76

    // Contact Section
    yL = addLeftHeader('Contact', yL)
    yL += 1.5
    if (profile.social.email) {
      yL = addContactItem('Email', profile.social.email, yL)
    }
    if (profile.social.github) {
      yL = addContactItem('GitHub', profile.social.github.replace('https://', ''), yL)
    }
    if (profile.social.linkedin) {
      yL = addContactItem('LinkedIn', profile.social.linkedin.replace('https://www.', ''), yL)
    }
    if (profile.social.website) {
      yL = addContactItem('Website', profile.social.website.replace('https://', ''), yL)
    }

    // Skills Section
    yL += 3.5
    yL = addLeftHeader('Core Skills', yL)
    yL += 1.5

    for (const category of skills) {
      yL = addLeftSkills(category.category, category.items, yL)
    }
  }

  const checkPageBreakRight = (neededHeight: number) => {
    if (yRight + neededHeight > pageHeight - 20) {
      doc.addPage()
      drawPageSkeleton()
      drawLeftSidebar()
      yRight = 25
      yLeft = 25
    }
  }

  const addRightHeader = (title: string) => {
    doc.setFont(fontFamily, 'bold')
    doc.setFontSize(11.5)
    doc.setTextColor('#0F172A')
    doc.text(title.toUpperCase(), 75, yRight)

    doc.setFillColor('#4F46E5')
    doc.rect(75, yRight + 1.8, 12, 1, 'F')

    yRight += 6.5
  }

  // ── Build Document ────────────────────────────────────────────────────────

  drawPageSkeleton()
  drawLeftSidebar()

  // Header Details (Name & Title)
  yRight = 25
  doc.setFont(fontFamily, 'bold')
  doc.setFontSize(22)
  doc.setTextColor('#0F172A')
  doc.text((profile.name || 'Chatkawin Taola').toUpperCase(), 75, yRight)

  yRight += 5.5
  doc.setFont(fontFamily, 'bold')
  doc.setFontSize(10)
  doc.setTextColor('#4F46E5')
  doc.text((profile.title || 'Full Stack Developer').toUpperCase(), 75, yRight)

  yRight += 6.5
  doc.setDrawColor('#F1F5F9')
  doc.setLineWidth(0.5)
  doc.line(75, yRight, 195, yRight)

  // Professional Summary
  yRight += 6.5
  if (profile.bio) {
    doc.setFont(fontFamily, 'normal')
    doc.setFontSize(9)
    doc.setTextColor('#475569')
    const bioLines = doc.splitTextToSize(profile.bio, 118) as string[]
    doc.text(bioLines, 75, yRight)
    yRight += bioLines.length * 4.2 + 6
  }

  // Experience Section
  if (experiences.length > 0) {
    addRightHeader('Work Experience')
    yRight += 1.5

    for (const exp of experiences) {
      doc.setFont(fontFamily, 'bold')
      doc.setFontSize(9.5)
      const companyTitle = `${exp.company} — ${exp.title}`
      const companyLines = doc.splitTextToSize(companyTitle, 113) as string[]

      doc.setFont(fontFamily, 'normal')
      doc.setFontSize(8.5)
      const descLines = exp.description ? (doc.splitTextToSize(exp.description, 113) as string[]) : []

      const blockHeight = companyLines.length * 4.2 + descLines.length * 3.8 + 8

      checkPageBreakRight(blockHeight)

      const startY = yRight

      // Timeline axis node
      doc.setFillColor('#6366F1')
      doc.circle(77, startY + 1.2, 1.4, 'F')
      doc.setFillColor('#FFFFFF')
      doc.circle(77, startY + 1.2, 0.6, 'F')

      // Company and Title Info
      doc.setFont(fontFamily, 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor('#0F172A')
      doc.text(companyLines, 82, yRight + 2)
      yRight += companyLines.length * 4.2 + 0.5

      // Date stamp
      const endLabel = exp.endDate ? exp.endDate : 'Present'
      doc.setFont(fontFamily, 'bold')
      doc.setFontSize(8)
      doc.setTextColor('#6366F1')
      doc.text(`${exp.startDate} – ${endLabel}`, 82, yRight + 1.5)
      yRight += 4.5

      // Description list
      if (exp.description) {
        doc.setFont(fontFamily, 'normal')
        doc.setFontSize(8.5)
        doc.setTextColor('#334155')
        doc.text(descLines, 82, yRight + 1)
        yRight += descLines.length * 3.8 + 2
      }

      yRight += 2.5
      const endY = yRight - 2

      // Draw connector vertical line for timeline
      doc.setDrawColor('#E2E8F0')
      doc.setLineWidth(0.4)
      doc.line(77, startY + 2.5, 77, endY)
    }
  }

  // Key Projects Section
  if (projects && projects.length > 0) {
    yRight += 2.5
    addRightHeader('Key Projects')
    yRight += 1.5

    const topProjects = projects.slice(0, 3)

    for (const proj of topProjects) {
      doc.setFont(fontFamily, 'bold')
      doc.setFontSize(9.5)
      const projTitle = proj.title
      const titleLines = doc.splitTextToSize(projTitle, 113) as string[]

      doc.setFont(fontFamily, 'normal')
      doc.setFontSize(8.5)
      const descLines = proj.description ? (doc.splitTextToSize(proj.description, 113) as string[]) : []

      const tagsText = `Tech Stack: ${proj.tags.join(', ')}`
      doc.setFont(fontFamily, 'normal')
      doc.setFontSize(7.5)
      const tagLines = doc.splitTextToSize(tagsText, 113) as string[] // wait! tagsText is a string, tagLines is computed below

      const neededHeight = titleLines.length * 4 + tagLines.length * 3.5 + descLines.length * 3.8 + 6
      checkPageBreakRight(neededHeight)

      // Project Title
      doc.setFont(fontFamily, 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor('#0F172A')
      doc.text(titleLines, 82, yRight + 2)
      yRight += titleLines.length * 4 + 0.5

      // Tech Stack Tags
      doc.setFont(fontFamily, 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor('#6366F1')
      doc.text(tagLines, 82, yRight + 1.5)
      yRight += tagLines.length * 3.5 + 0.5

      // Description
      if (proj.description) {
        doc.setFont(fontFamily, 'normal')
        doc.setFontSize(8)
        doc.setTextColor('#475569')
        doc.text(descLines, 82, yRight + 1)
        yRight += descLines.length * 3.8 + 2
      }

      yRight += 2.5
    }
  }

  doc.save('resume.pdf')
}

/**
 * Generates an interactive, premium HTML layout of the resume in a new tab.
 * Recruiter can preview the true glassmorphism theme and click to open the live site or print to vector PDF.
 */
// export async function generateResumeHTML(data: PortfolioData): Promise<void> {
//   const { profile, experiences, skills, projects } = data
//   const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://akirasane.github.io'

//   const emailHtml = profile.social.email ? `
//     <div class="contact-item">
//       <span class="contact-label">Email</span>
//       <span class="contact-val"><a href="mailto:${profile.social.email}">${profile.social.email}</a></span>
//     </div>
//   ` : ''

//   const github = profile.social.github || ''
//   const linkedin = profile.social.linkedin || ''
//   const website = profile.social.website || ''

//   const formatUrlLabel = (url: string) => {
//     return url.replace('https://', '').replace('www.', '')
//   }

//   // Create Skill Categories HTML
//   const skillsHtml = skills.map(cat => {
//     const itemsHtml = cat.items.map(item => `
//       <span class="skill-badge">${item.name} (${item.years}y)</span>
//     `).join('')
//     return `
//       <div class="skill-category">
//         <div class="skill-category-title">${cat.category}</div>
//         <div class="skill-items">${itemsHtml}</div>
//       </div>
//     `
//   }).join('')

//   // Create Experience HTML
//   const expHtml = experiences.map(exp => {
//     const endLabel = exp.endDate ? exp.endDate : 'Present'
//     const descHtml = exp.description ? `<p class="exp-desc">${exp.description}</p>` : ''
//     return `
//       <div class="timeline-item">
//         <div class="timeline-node"></div>
//         <div class="timeline-content">
//           <div class="exp-header">
//             <span class="exp-company">${exp.company}</span>
//             <span class="exp-title">${exp.title}</span>
//           </div>
//           <div class="exp-date">${exp.startDate} – ${endLabel}</div>
//           ${descHtml}
//         </div>
//       </div>
//     `
//   }).join('')

//   // Create Projects HTML
//   const projHtml = (projects || []).slice(0, 3).map(proj => {
//     const tagsHtml = proj.tags.map(t => `<span class="proj-tag">${t}</span>`).join('')
//     return `
//       <div class="proj-item">
//         <div class="proj-title">${proj.title}</div>
//         <div class="proj-tags">${tagsHtml}</div>
//         <p class="proj-desc">${proj.description}</p>
//       </div>
//     `
//   }).join('')

//   // Full HTML Document String
//   const htmlContent = `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <title>Resume - ${profile.name || 'Chatkawin Taola'}</title>
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <link rel="preconnect" href="https://fonts.googleapis.com">
//   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//   <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
//   <style>
//     * {
//       box-sizing: border-box;
//       margin: 0;
//       padding: 0;
//     }
//     body {
//       background-color: #0b0f19;
//       font-family: 'Kanit', 'IBM Plex Sans', sans-serif;
//       color: #0f172a;
//       min-height: 100vh;
//       position: relative;
//       overflow-x: hidden;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//     }

//     /* Glowing Orbs */
//     .orb {
//       position: fixed;
//       border-radius: 50%;
//       filter: blur(100px);
//       z-index: -1;
//       opacity: 0.6;
//       pointer-events: none;
//     }
//     .orb-1 {
//       top: -50px;
//       right: -50px;
//       width: 400px;
//       height: 400px;
//       background: #e0e7ff;
//     }
//     .orb-2 {
//       top: 40%;
//       left: -100px;
//       width: 450px;
//       height: 450px;
//       background: #d1fae5;
//     }
//     .orb-3 {
//       bottom: -50px;
//       right: -50px;
//       width: 400px;
//       height: 400px;
//       background: #fae8ff;
//     }

//     /* Top Control Bar */
//     .control-bar {
//       width: 100%;
//       max-width: 210mm;
//       margin: 20px auto 0;
//       padding: 12px 24px;
//       background: rgba(255, 255, 255, 0.08);
//       border: 1px solid rgba(255, 255, 255, 0.15);
//       border-radius: 12px;
//       backdrop-filter: blur(12px);
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       color: #ffffff;
//       z-index: 10;
//       box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
//     }
//     .control-title {
//       font-size: 14px;
//       font-weight: 500;
//       letter-spacing: 0.5px;
//     }
//     .control-btns {
//       display: flex;
//       gap: 12px;
//     }
//     .btn {
//       padding: 8px 16px;
//       font-size: 13px;
//       font-weight: 600;
//       border-radius: 8px;
//       border: none;
//       cursor: pointer;
//       transition: opacity 0.2s;
//     }
//     .btn:hover {
//       opacity: 0.9;
//     }
//     .btn-primary {
//       background: #6366f1;
//       color: #ffffff;
//     }
//     .btn-secondary {
//       background: rgba(255, 255, 255, 0.1);
//       color: #ffffff;
//       border: 1px solid rgba(255, 255, 255, 0.2);
//     }

//     /* A4 Container */
//     .page-container {
//       width: 210mm;
//       min-height: 297mm;
//       margin: 25px auto 40px;
//       background: transparent;
//       display: grid;
//       grid-template-columns: 68mm 1fr;
//       gap: 10px;
//       z-index: 1;
//     }

//     /* Glass Cards */
//     .glass-card-left {
//       background: rgba(11, 15, 25, 0.95);
//       border: 1px solid rgba(255, 255, 255, 0.08);
//       box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.35);
//       backdrop-filter: blur(16px);
//       -webkit-backdrop-filter: blur(16px);
//       border-radius: 12px;
//       padding: 30px 20px;
//       color: #ffffff;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//     }

//     .glass-card-right {
//       background: rgba(255, 255, 255, 0.88);
//       border: 1px solid rgba(255, 255, 255, 0.3);
//       box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.06);
//       backdrop-filter: blur(16px);
//       -webkit-backdrop-filter: blur(16px);
//       border-radius: 12px;
//       padding: 35px 35px;
//       color: #0f172a;
//     }

//     /* Sidebar Content */
//     .avatar-wrapper {
//       position: relative;
//       margin-bottom: 25px;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//     }
//     .avatar {
//       width: 140px;
//       height: 140px;
//       border-radius: 50%;
//       object-fit: cover;
//       border: 2px solid #6366f1;
//       box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
//     }
//     .avatar-ring-outer {
//       position: absolute;
//       width: 152px;
//       height: 152px;
//       border-radius: 50%;
//       border: 1px dashed rgba(99, 102, 241, 0.4);
//     }

//     .side-section {
//       width: 100%;
//       margin-bottom: 24px;
//     }
//     .side-title {
//       font-size: 10px;
//       font-weight: 700;
//       letter-spacing: 1.5px;
//       color: #6366f1;
//       text-transform: uppercase;
//       margin-bottom: 12px;
//       border-bottom: 1px solid #1e293b;
//       padding-bottom: 5px;
//     }

//     .contact-item {
//       margin-bottom: 12px;
//     }
//     .contact-label {
//       display: block;
//       font-size: 8px;
//       font-weight: 600;
//       color: #94a3b8;
//       text-transform: uppercase;
//       margin-bottom: 2px;
//     }
//     .contact-val {
//       font-size: 11px;
//       color: #ffffff;
//       word-break: break-all;
//     }
//     .contact-val a {
//       color: #ffffff;
//       text-decoration: none;
//     }
//     .contact-val a:hover {
//       text-decoration: underline;
//     }

//     .skill-category {
//       margin-bottom: 14px;
//     }
//     .skill-category-title {
//       font-size: 11px;
//       font-weight: 600;
//       color: #e2e8f0;
//       margin-bottom: 6px;
//     }
//     .skill-items {
//       display: flex;
//       flex-wrap: wrap;
//       gap: 5px;
//     }
//     .skill-badge {
//       display: inline-block;
//       font-size: 10px;
//       background: #1e1b4b;
//       border: 1px solid #4f46e5;
//       color: #ffffff;
//       padding: 3px 8px;
//       border-radius: 4px;
//     }

//     /* Right Main Content */
//     .header-name {
//       font-size: 26px;
//       font-weight: 700;
//       color: #0f172a;
//       letter-spacing: -0.5px;
//       text-transform: uppercase;
//     }
//     .header-title {
//       font-size: 12px;
//       font-weight: 700;
//       color: #6366f1;
//       margin-top: 2px;
//       text-transform: uppercase;
//       letter-spacing: 0.5px;
//     }
//     .divider {
//       height: 1px;
//       background: #e2e8f0;
//       margin: 15px 0;
//     }
//     .bio-text {
//       font-size: 12px;
//       line-height: 1.6;
//       color: #475569;
//       margin-bottom: 25px;
//     }

//     .section-title {
//       font-size: 14px;
//       font-weight: 700;
//       text-transform: uppercase;
//       letter-spacing: 1px;
//       color: #0f172a;
//       margin-bottom: 18px;
//       position: relative;
//     }
//     .section-title::after {
//       content: '';
//       position: absolute;
//       left: 0;
//       bottom: -4px;
//       width: 20px;
//       height: 2px;
//       background: #4f46e5;
//     }

//     .main-section {
//       margin-bottom: 30px;
//     }

//     /* Timeline Experience */
//     .timeline-container {
//       position: relative;
//       padding-left: 20px;
//     }
//     .timeline-container::before {
//       content: '';
//       position: absolute;
//       left: 3px;
//       top: 6px;
//       bottom: 6px;
//       width: 1px;
//       background: #e2e8f0;
//     }
//     .timeline-item {
//       position: relative;
//       margin-bottom: 22px;
//     }
//     .timeline-node {
//       position: absolute;
//       left: -20px;
//       top: 4px;
//       width: 8px;
//       height: 8px;
//       border-radius: 50%;
//       background: #ffffff;
//       border: 2px solid #6366f1;
//     }
//     .exp-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: baseline;
//     }
//     .exp-company {
//       font-size: 12px;
//       font-weight: 700;
//       color: #0f172a;
//     }
//     .exp-title {
//       font-size: 11px;
//       font-weight: 500;
//       color: #475569;
//     }
//     .exp-date {
//       font-size: 10px;
//       font-weight: 600;
//       color: #6366f1;
//       margin-top: 1px;
//     }
//     .exp-desc {
//       font-size: 11px;
//       line-height: 1.5;
//       color: #334155;
//       margin-top: 4px;
//     }

//     /* Projects styling */
//     .proj-item {
//       margin-bottom: 18px;
//     }
//     .proj-title {
//       font-size: 12px;
//       font-weight: 700;
//       color: #0f172a;
//     }
//     .proj-tags {
//       display: flex;
//       flex-wrap: wrap;
//       gap: 4px;
//       margin-top: 3px;
//     }
//     .proj-tag {
//       font-size: 9px;
//       background: rgba(99, 102, 241, 0.1);
//       border: 1px solid rgba(99, 102, 241, 0.2);
//       color: #6366f1;
//       padding: 1px 6px;
//       border-radius: 3px;
//     }
//     .proj-desc {
//       font-size: 11px;
//       line-height: 1.5;
//       color: #475569;
//       margin-top: 4px;
//     }

//     /* Floating Pill Badge */
//     .floating-badge {
//       position: fixed;
//       bottom: 25px;
//       right: 25px;
//       background: rgba(255, 255, 255, 0.15);
//       border: 1px solid rgba(255, 255, 255, 0.25);
//       box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
//       backdrop-filter: blur(12px);
//       -webkit-backdrop-filter: blur(12px);
//       padding: 10px 20px;
//       border-radius: 50px;
//       font-size: 12px;
//       font-weight: 600;
//       z-index: 100;
//       cursor: pointer;
//       text-decoration: none;
//       color: #ffffff;
//       display: flex;
//       align-items: center;
//       gap: 6px;
//       transition: background 0.3s;
//     }
//     .floating-badge:hover {
//       background: rgba(99, 102, 241, 0.3);
//     }

//     /* Print Mode Styling */
//     @media print {
//       body {
//         background: #FAFBFD !important;
//         -webkit-print-color-adjust: exact !important;
//         print-color-adjust: exact !important;
//       }
//       .no-print {
//         display: none !important;
//       }
//       .orb {
//         display: none !important;
//       }
//       .page-container {
//         margin: 0 !important;
//         width: 100% !important;
//         grid-template-columns: 62mm 1fr !important;
//         gap: 6mm !important;
//         box-shadow: none !important;
//       }
//       .glass-card-left {
//         background: #0B0F19 !important;
//         color: #ffffff !important;
//         border: none !important;
//         box-shadow: none !important;
//         backdrop-filter: none !important;
//         -webkit-print-color-adjust: exact !important;
//         print-color-adjust: exact !important;
//       }
//       .glass-card-right {
//         background: #FFFFFF !important;
//         color: #0f172a !important;
//         border: none !important;
//         box-shadow: none !important;
//         backdrop-filter: none !important;
//         -webkit-print-color-adjust: exact !important;
//         print-color-adjust: exact !important;
//       }
//       .skill-badge {
//         background: #1e1b4b !important;
//         border: 1px solid #4f46e5 !important;
//         color: #ffffff !important;
//         -webkit-print-color-adjust: exact !important;
//         print-color-adjust: exact !important;
//       }
//       .proj-tag {
//         background: rgba(99, 102, 241, 0.1) !important;
//         border: 1px solid rgba(99, 102, 241, 0.2) !important;
//         color: #6366f1 !important;
//         -webkit-print-color-adjust: exact !important;
//         print-color-adjust: exact !important;
//       }
//     }
//   </style>
// </head>
// <body>

//   <!-- Background Glowing Orbs -->
//   <div class="orb orb-1"></div>
//   <div class="orb orb-2"></div>
//   <div class="orb orb-3"></div>

//   <!-- Top Action Banner -->
//   <div class="control-bar no-print">
//     <div class="control-title">📄 Liquid Glass Resume (Print Layout)</div>
//     <div class="control-btns">
//       <button class="btn btn-primary" onclick="window.print()">Print / Save PDF</button>
//       <button class="btn btn-secondary" onclick="window.close()">Close Preview</button>
//     </div>
//   </div>

//   <!-- Floating side Portfolio Link -->
//   <a class="floating-badge no-print" href="${currentOrigin}" target="_blank">
//     Open Portfolio ↗
//   </a>

//   <!-- Document Container -->
//   <div class="page-container">

//     <!-- Left Glass Panel -->
//     <div class="glass-card-left">
//       <div class="avatar-wrapper">
//         <div class="avatar-ring-outer"></div>
//         <img class="avatar" src="/img/avatar.jpg" alt="Avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
//         <div style="display:none; width:140px; height:140px; border-radius:50%; background:#1a202c; color:#fff; align-items:center; justify-content:center; font-size:26px; font-weight:bold; border:2px solid #6366f1;">
//           ${(profile.name || 'Resume').split(' ').map(n=>n[0]).join('').toUpperCase()}
//         </div>
//       </div>

//       <!-- Contact details -->
//       <div class="side-section">
//         <div class="side-title">Contact</div>
//         ${emailHtml}
//         <div class="contact-item">
//           <span class="contact-label">GitHub</span>
//           <span class="contact-val"><a href="${github}" target="_blank">${formatUrlLabel(github)}</a></span>
//         </div>
//         <div class="contact-item">
//           <span class="contact-label">LinkedIn</span>
//           <span class="contact-val"><a href="${linkedin}" target="_blank">${formatUrlLabel(linkedin)}</a></span>
//         </div>
//         <div class="contact-item">
//           <span class="contact-label">Website</span>
//           <span class="contact-val"><a href="${website}" target="_blank">${formatUrlLabel(website)}</a></span>
//         </div>
//       </div>

//       <!-- Skills categories -->
//       <div class="side-section">
//         <div class="side-title">Core Skills</div>
//         ${skillsHtml}
//       </div>
//     </div>

//     <!-- Right Glass Panel -->
//     <div class="glass-card-right">
//       <!-- Header -->
//       <h1 class="header-name">${profile.name || 'Chatkawin Taola'}</h1>
//       <div class="header-title">${profile.title || 'System Analyst & Full Stack Developer'}</div>
//       <div class="divider"></div>

//       <!-- Bio -->
//       <p class="bio-text">${profile.bio || ''}</p>

//       <!-- Work Experience -->
//       <div class="main-section">
//         <div class="section-title">Work Experience</div>
//         <div class="timeline-container">
//           ${expHtml}
//         </div>
//       </div>

//       <!-- Key Projects -->
//       <div class="main-section">
//         <div class="section-title">Key Projects</div>
//         <div>
//           ${projHtml}
//         </div>
//       </div>
//     </div>

//   </div>

// </body>
// </html>`;

//   const printWindow = window.open('', '_blank')
//   if (printWindow) {
//     printWindow.document.write(htmlContent)
//     printWindow.document.close()
//   }
// }
/**
 * Generates an interactive, premium HTML layout of the resume in a new tab.
 * iOS 26 "Liquid Glass" restyle: specular edge lensing, backdrop saturation
 * boost, and an optional SVG refraction filter. Screen preview only — the
 * @media print block flattens everything to solid colors for the PDF export.
 *
 * DROP-IN: replaces the existing generateResumeHTML in pdf.ts.
 * All data-binding (${...}) is identical to your original, so nothing else changes.
 */
// export async function generateResumeHTML(data: PortfolioData): Promise<void> {
//   const { profile, experiences, skills, projects } = data
//   const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://akirasane.github.io'

//   const emailHtml = profile.social.email ? `
//     <div class="contact-item">
//       <span class="contact-label">Email</span>
//       <span class="contact-val"><a href="mailto:${profile.social.email}">${profile.social.email}</a></span>
//     </div>
//   ` : ''

//   const github = profile.social.github || ''
//   const linkedin = profile.social.linkedin || ''
//   const website = profile.social.website || ''

//   const formatUrlLabel = (url: string) => {
//     return url.replace('https://', '').replace('www.', '')
//   }

//   const skillsHtml = skills.map(cat => {
//     const itemsHtml = cat.items.map(item => `
//       <span class="skill-badge">${item.name} (${item.years}y)</span>
//     `).join('')
//     return `
//       <div class="skill-category">
//         <div class="skill-category-title">${cat.category}</div>
//         <div class="skill-items">${itemsHtml}</div>
//       </div>
//     `
//   }).join('')

//   const expHtml = experiences.map(exp => {
//     const endLabel = exp.endDate ? exp.endDate : 'Present'
//     const descHtml = exp.description ? `<p class="exp-desc">${exp.description}</p>` : ''
//     return `
//       <div class="timeline-item">
//         <div class="timeline-node"></div>
//         <div class="timeline-content">
//           <div class="exp-header">
//             <span class="exp-company">${exp.company}</span>
//             <span class="exp-title">${exp.title}</span>
//           </div>
//           <div class="exp-date">${exp.startDate} – ${endLabel}</div>
//           ${descHtml}
//         </div>
//       </div>
//     `
//   }).join('')

//   const projHtml = (projects || []).slice(0, 3).map(proj => {
//     const tagsHtml = proj.tags.map(t => `<span class="proj-tag">${t}</span>`).join('')
//     return `
//       <div class="proj-item">
//         <div class="proj-title">${proj.title}</div>
//         <div class="proj-tags">${tagsHtml}</div>
//         <p class="proj-desc">${proj.description}</p>
//       </div>
//     `
//   }).join('')

//   const htmlContent = `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <title>Resume - ${profile.name || 'Chatkawin Taola'}</title>
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <link rel="preconnect" href="https://fonts.googleapis.com">
//   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//   <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
//   <style>
//     /* ── Liquid Glass tokens ─────────────────────────────────────────────── */
//     :root {
//       --lg-radius: 28px;
//       --lg-radius-sm: 16px;
//       --lg-blur: 24px;
//       --lg-sat: 180%;
//       /* specular rim gradient — bright top-left, fading to nothing */
//       --lg-rim-light: linear-gradient(135deg,
//         rgba(255,255,255,0.95) 0%,
//         rgba(255,255,255,0.35) 18%,
//         rgba(255,255,255,0) 45%,
//         rgba(255,255,255,0.12) 78%,
//         rgba(255,255,255,0.5) 100%);
//       --lg-rim-dark: linear-gradient(135deg,
//         rgba(255,255,255,0.7) 0%,
//         rgba(255,255,255,0.15) 20%,
//         rgba(255,255,255,0) 48%,
//         rgba(120,130,255,0.1) 80%,
//         rgba(255,255,255,0.25) 100%);
//     }

//     * { box-sizing: border-box; margin: 0; padding: 0; }

//     body {
//       /* Apple-neutral base so the vivid orbs read through the glass */
//       background-color: #eef0f4;
//       font-family: 'Kanit', 'IBM Plex Sans', sans-serif;
//       color: #0f172a;
//       min-height: 100vh;
//       position: relative;
//       overflow-x: hidden;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//     }

//     /* Vivid orbs behind the glass — richer than before so saturation boost has something to grab */
//     .orb {
//       position: fixed;
//       border-radius: 50%;
//       filter: blur(90px);
//       z-index: -1;
//       opacity: 0.75;
//       pointer-events: none;
//     }
//     .orb-1 { top: -60px;  right: -40px;  width: 420px; height: 420px; background: #7c86ff; }
//     .orb-2 { top: 38%;    left: -120px;  width: 480px; height: 480px; background: #4ade80; }
//     .orb-3 { bottom: -80px; right: -20px; width: 440px; height: 440px; background: #f0a6ff; }
//     .orb-4 { top: 55%; right: 20%; width: 320px; height: 320px; background: #ffd27c; opacity: 0.55; }

//     /* Reusable specular + rim system.
//        ::before = diagonal light sweep (screen blend)
//        ::after  = 1px lensing rim via masked gradient border */
//     .lg { position: relative; overflow: hidden; }
//     .lg::before {
//       content: '';
//       position: absolute;
//       inset: 0;
//       border-radius: inherit;
//       background: linear-gradient(140deg,
//         rgba(255,255,255,0.45) 0%,
//         rgba(255,255,255,0) 38%);
//       mix-blend-mode: screen;
//       pointer-events: none;
//       z-index: 2;
//     }
//     .lg::after {
//       content: '';
//       position: absolute;
//       inset: 0;
//       border-radius: inherit;
//       padding: 1px;
//       background: var(--lg-rim-light);
//       -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
//       -webkit-mask-composite: xor;
//       mask-composite: exclude;
//       pointer-events: none;
//       z-index: 3;
//     }
//     .lg.lg-dark::after { background: var(--lg-rim-dark); }
//     /* keep real content above the light sweep */
//     .lg > * { position: relative; z-index: 4; }

//     /* Top Control Bar — a liquid pill */
//     .control-bar {
//       width: 100%;
//       max-width: 210mm;
//       margin: 22px auto 0;
//       padding: 14px 24px;
//       background: rgba(255,255,255,0.18);
//       border-radius: 22px;
//       backdrop-filter: blur(20px) saturate(var(--lg-sat));
//       -webkit-backdrop-filter: blur(20px) saturate(var(--lg-sat));
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       color: #1f2937;
//       z-index: 10;
//       box-shadow: 0 8px 32px rgba(0,0,0,0.12);
//     }
//     .control-title { font-size: 14px; font-weight: 600; letter-spacing: 0.4px; }
//     .control-btns { display: flex; gap: 12px; }
//     .btn {
//       padding: 9px 18px;
//       font-size: 13px;
//       font-weight: 600;
//       border-radius: 999px;
//       border: none;
//       cursor: pointer;
//       transition: transform 0.15s ease, box-shadow 0.2s ease;
//       backdrop-filter: blur(8px);
//       -webkit-backdrop-filter: blur(8px);
//     }
//     .btn:hover { transform: translateY(-1px); }
//     .btn-primary {
//       background: linear-gradient(135deg, #6366f1, #7c3aed);
//       color: #fff;
//       box-shadow: 0 6px 18px rgba(99,102,241,0.45);
//     }
//     .btn-secondary {
//       background: rgba(255,255,255,0.35);
//       color: #1f2937;
//       box-shadow: inset 0 1px 1px rgba(255,255,255,0.8);
//     }

//     /* A4 Container */
//     .page-container {
//       width: 210mm;
//       min-height: 297mm;
//       margin: 26px auto 44px;
//       background: transparent;
//       display: grid;
//       grid-template-columns: 68mm 1fr;
//       gap: 12px;
//       z-index: 1;
//     }

//     /* ── Glass Cards ─────────────────────────────────────────────────────── */
//     .glass-card-left {
//       border-radius: var(--lg-radius);
//       background: rgba(14, 18, 30, 0.55);
//       backdrop-filter: blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(1.05);
//       -webkit-backdrop-filter: blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(1.05);
//       box-shadow:
//         0 10px 40px rgba(0,0,0,0.35),
//         inset 0 1px 1px rgba(255,255,255,0.18),
//         inset 0 -1px 1px rgba(255,255,255,0.05);
//       padding: 32px 22px;
//       color: #ffffff;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//     }

//     .glass-card-right {
//       border-radius: var(--lg-radius);
//       background: rgba(255,255,255,0.55);
//       backdrop-filter: blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(1.06);
//       -webkit-backdrop-filter: blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(1.06);
//       box-shadow:
//         0 10px 40px rgba(31,38,135,0.12),
//         inset 0 1px 1px rgba(255,255,255,0.85),
//         inset 0 -1px 1px rgba(255,255,255,0.25);
//       padding: 38px 36px;
//       color: #0f172a;
//     }

//     /* Sidebar */
//     .avatar-wrapper { position: relative; margin-bottom: 26px; display: flex; justify-content: center; align-items: center; }
//     .avatar {
//       width: 140px; height: 140px; border-radius: 50%;
//       object-fit: cover;
//       border: 2px solid rgba(255,255,255,0.6);
//       box-shadow: 0 0 0 4px rgba(99,102,241,0.25), 0 8px 24px rgba(99,102,241,0.4);
//     }
//     .avatar-ring-outer {
//       position: absolute; width: 156px; height: 156px; border-radius: 50%;
//       border: 1px solid rgba(255,255,255,0.25);
//     }

//     .side-section { width: 100%; margin-bottom: 24px; }
//     .side-title {
//       font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
//       color: #c7d2fe; text-transform: uppercase; margin-bottom: 12px;
//       border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 5px;
//     }

//     .contact-item { margin-bottom: 12px; }
//     .contact-label { display: block; font-size: 8px; font-weight: 600; color: #94a3b8; text-transform: uppercase; margin-bottom: 2px; }
//     .contact-val { font-size: 11px; color: #fff; word-break: break-all; }
//     .contact-val a { color: #fff; text-decoration: none; }
//     .contact-val a:hover { text-decoration: underline; }

//     .skill-category { margin-bottom: 14px; }
//     .skill-category-title { font-size: 11px; font-weight: 600; color: #e2e8f0; margin-bottom: 6px; }
//     .skill-items { display: flex; flex-wrap: wrap; gap: 5px; }
//     .skill-badge {
//       display: inline-block;
//       font-size: 10px;
//       background: rgba(99,102,241,0.22);
//       border: 1px solid rgba(255,255,255,0.18);
//       color: #eef2ff;
//       padding: 3px 9px;
//       border-radius: 999px;
//       backdrop-filter: blur(6px);
//       -webkit-backdrop-filter: blur(6px);
//       box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
//     }

//     /* Right main content */
//     .header-name { font-size: 26px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px; text-transform: uppercase; }
//     .header-title { font-size: 12px; font-weight: 700; color: #6366f1; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
//     .divider { height: 1px; background: linear-gradient(90deg, rgba(226,232,240,0.9), rgba(226,232,240,0)); margin: 15px 0; }
//     .bio-text { font-size: 12px; line-height: 1.6; color: #475569; margin-bottom: 25px; }

//     .section-title {
//       font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
//       color: #0f172a; margin-bottom: 18px; position: relative;
//     }
//     .section-title::after {
//       content: ''; position: absolute; left: 0; bottom: -4px;
//       width: 22px; height: 2px; border-radius: 2px;
//       background: linear-gradient(90deg, #6366f1, #a855f7);
//     }

//     .main-section { margin-bottom: 30px; }

//     /* Timeline */
//     .timeline-container { position: relative; padding-left: 20px; }
//     .timeline-container::before {
//       content: ''; position: absolute; left: 3px; top: 6px; bottom: 6px;
//       width: 1px; background: #e2e8f0;
//     }
//     .timeline-item { position: relative; margin-bottom: 22px; }
//     .timeline-node {
//       position: absolute; left: -20px; top: 4px; width: 9px; height: 9px;
//       border-radius: 50%; background: #fff; border: 2px solid #6366f1;
//       box-shadow: 0 0 0 3px rgba(99,102,241,0.18);
//     }
//     .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
//     .exp-company { font-size: 12px; font-weight: 700; color: #0f172a; }
//     .exp-title { font-size: 11px; font-weight: 500; color: #475569; }
//     .exp-date { font-size: 10px; font-weight: 600; color: #6366f1; margin-top: 1px; }
//     .exp-desc { font-size: 11px; line-height: 1.5; color: #334155; margin-top: 4px; }

//     /* Projects */
//     .proj-item { margin-bottom: 18px; }
//     .proj-title { font-size: 12px; font-weight: 700; color: #0f172a; }
//     .proj-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 3px; }
//     .proj-tag {
//       font-size: 9px;
//       background: rgba(99,102,241,0.1);
//       border: 1px solid rgba(99,102,241,0.2);
//       color: #6366f1; padding: 2px 8px; border-radius: 999px;
//     }
//     .proj-desc { font-size: 11px; line-height: 1.5; color: #475569; margin-top: 4px; }

//     /* Floating pill — liquid glass */
//     .floating-badge {
//       position: fixed; bottom: 26px; right: 26px;
//       background: rgba(255,255,255,0.25);
//       box-shadow: 0 8px 32px rgba(0,0,0,0.18), inset 0 1px 1px rgba(255,255,255,0.7);
//       backdrop-filter: blur(14px) saturate(var(--lg-sat));
//       -webkit-backdrop-filter: blur(14px) saturate(var(--lg-sat));
//       padding: 11px 22px; border-radius: 999px;
//       font-size: 12px; font-weight: 600; z-index: 100;
//       cursor: pointer; text-decoration: none; color: #1f2937;
//       display: flex; align-items: center; gap: 6px;
//       transition: transform 0.2s ease, background 0.3s;
//     }
//     .floating-badge:hover { transform: translateY(-2px); background: rgba(99,102,241,0.35); color: #fff; }

//     /* ── Print / PDF: flatten all glass to solid colors ─────────────────── */
//     @media print {
//       body { background: #FAFBFD !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
//       .no-print { display: none !important; }
//       .orb { display: none !important; }
//       .page-container { margin: 0 !important; width: 100% !important; grid-template-columns: 62mm 1fr !important; gap: 6mm !important; box-shadow: none !important; }

//       /* neutralize the liquid-glass pseudo-elements + filters */
//       .lg::before, .lg::after { display: none !important; }
//       .glass-card-left, .glass-card-right { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; box-shadow: none !important; border-radius: 6px !important; }

//       .glass-card-left {
//         background: #0B0F19 !important; color: #fff !important;
//         -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
//       }
//       .glass-card-right {
//         background: #FFFFFF !important; color: #0f172a !important;
//         -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
//       }
//       .skill-badge {
//         background: #1e1b4b !important; border: 1px solid #4f46e5 !important; color: #fff !important;
//         backdrop-filter: none !important; box-shadow: none !important;
//         -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
//       }
//       .proj-tag {
//         background: rgba(99,102,241,0.1) !important; border: 1px solid rgba(99,102,241,0.2) !important; color: #6366f1 !important;
//         -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
//       }
//     }
//   </style>
// </head>
// <body>

//   <!-- Optional refraction filter. Attach with e.g. class="lg" + backdrop-filter: ... url(#liquid-glass)
//        on a card if you want the background to physically warp at the edges.
//        Chromium-solid; Safari support is limited, so it's off by default. -->
//   <svg width="0" height="0" style="position:absolute" aria-hidden="true">
//     <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
//       <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="42" result="noise"/>
//       <feGaussianBlur in="noise" stdDeviation="2" result="soft"/>
//       <feDisplacementMap in="SourceGraphic" in2="soft" scale="16" xChannelSelector="R" yChannelSelector="G"/>
//     </filter>
//   </svg>

//   <!-- Background Orbs -->
//   <div class="orb orb-1"></div>
//   <div class="orb orb-2"></div>
//   <div class="orb orb-3"></div>
//   <div class="orb orb-4"></div>

//   <!-- Top Action Banner -->
//   <div class="control-bar lg no-print">
//     <div class="control-title">🫧 Liquid Glass Resume (Print Layout)</div>
//     <div class="control-btns">
//       <button class="btn btn-primary" onclick="window.print()">Print / Save PDF</button>
//       <button class="btn btn-secondary" onclick="window.close()">Close Preview</button>
//     </div>
//   </div>

//   <!-- Floating side Portfolio Link -->
//   <a class="floating-badge lg no-print" href="${currentOrigin}" target="_blank">
//     Open Portfolio ↗
//   </a>

//   <!-- Document Container -->
//   <div class="page-container">

//     <!-- Left Glass Panel -->
//     <div class="glass-card-left lg lg-dark">
//       <div class="avatar-wrapper">
//         <div class="avatar-ring-outer"></div>
//         <img class="avatar" src="/img/avatar.jpg" alt="Avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
//         <div style="display:none; width:140px; height:140px; border-radius:50%; background:#1a202c; color:#fff; align-items:center; justify-content:center; font-size:26px; font-weight:bold; border:2px solid #6366f1;">
//           ${(profile.name || 'Resume').split(' ').map(n => n[0]).join('').toUpperCase()}
//         </div>
//       </div>

//       <!-- Contact details -->
//       <div class="side-section">
//         <div class="side-title">Contact</div>
//         ${emailHtml}
//         <div class="contact-item">
//           <span class="contact-label">GitHub</span>
//           <span class="contact-val"><a href="${github}" target="_blank">${formatUrlLabel(github)}</a></span>
//         </div>
//         <div class="contact-item">
//           <span class="contact-label">LinkedIn</span>
//           <span class="contact-val"><a href="${linkedin}" target="_blank">${formatUrlLabel(linkedin)}</a></span>
//         </div>
//         <div class="contact-item">
//           <span class="contact-label">Website</span>
//           <span class="contact-val"><a href="${website}" target="_blank">${formatUrlLabel(website)}</a></span>
//         </div>
//       </div>

//       <!-- Skills categories -->
//       <div class="side-section">
//         <div class="side-title">Core Skills</div>
//         ${skillsHtml}
//       </div>
//     </div>

//     <!-- Right Glass Panel -->
//     <div class="glass-card-right lg">
//       <h1 class="header-name">${profile.name || 'Chatkawin Taola'}</h1>
//       <div class="header-title">${profile.title || 'System Analyst & Full Stack Developer'}</div>
//       <div class="divider"></div>

//       <p class="bio-text">${profile.bio || ''}</p>

//       <div class="main-section">
//         <div class="section-title">Work Experience</div>
//         <div class="timeline-container">
//           ${expHtml}
//         </div>
//       </div>

//       <div class="main-section">
//         <div class="section-title">Key Projects</div>
//         <div>
//           ${projHtml}
//         </div>
//       </div>
//     </div>

//   </div>

// </body>
// </html>`;

//   const printWindow = window.open('', '_blank')
//   if (printWindow) {
//     printWindow.document.write(htmlContent)
//     printWindow.document.close()
//   }
// }

/**
 * generateResumeHTML — iOS 26 "Liquid Glass", DARK MODE.
 *
 * Screen: real frosted glass (backdrop-filter blur + saturate) over vivid orbs,
 *         specular light sweep, and a lensing rim.
 * Print:  backdrop-filter can't render on a flat page, so the glass is BAKED —
 *         soft radial-gradient orbs painted as real ink + semi-transparent card
 *         fills + printable specular/rim. Enable "Background graphics" in the
 *         Chrome print dialog (More settings) or the tint/shadows won't print.
 *
 * DROP-IN replacement — signature and all ${...} bindings unchanged.
 */
// export async function generateResumeHTML(data: PortfolioData): Promise<void> {
//   const { profile, experiences, skills, projects } = data
//   const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://akirasane.github.io'

//   const emailHtml = profile.social.email ? `
//     <div class="contact-item">
//       <span class="contact-label">Email</span>
//       <span class="contact-val"><a href="mailto:${profile.social.email}">${profile.social.email}</a></span>
//     </div>
//   ` : ''

//   const github = profile.social.github || ''
//   const linkedin = profile.social.linkedin || ''
//   const website = profile.social.website || ''

//   const formatUrlLabel = (url: string) => {
//     return url.replace('https://', '').replace('www.', '')
//   }

//   const skillsHtml = skills.map(cat => {
//     const itemsHtml = cat.items.map(item => `
//       <span class="skill-badge">${item.name} (${item.years}y)</span>
//     `).join('')
//     return `
//       <div class="skill-category">
//         <div class="skill-category-title">${cat.category}</div>
//         <div class="skill-items">${itemsHtml}</div>
//       </div>
//     `
//   }).join('')

//   const expHtml = experiences.map(exp => {
//     const endLabel = exp.endDate ? exp.endDate : 'Present'
//     const descHtml = exp.description ? `<p class="exp-desc">${exp.description}</p>` : ''
//     return `
//       <div class="timeline-item">
//         <div class="timeline-node"></div>
//         <div class="timeline-content">
//           <div class="exp-header">
//             <span class="exp-company">${exp.company}</span>
//             <span class="exp-title">${exp.title}</span>
//           </div>
//           <div class="exp-date">${exp.startDate} – ${endLabel}</div>
//           ${descHtml}
//         </div>
//       </div>
//     `
//   }).join('')

//   const projHtml = (projects || []).slice(0, 3).map(proj => {
//     const tagsHtml = proj.tags.map(t => `<span class="proj-tag">${t}</span>`).join('')
//     return `
//       <div class="proj-item">
//         <div class="proj-title">${proj.title}</div>
//         <div class="proj-tags">${tagsHtml}</div>
//         <p class="proj-desc">${proj.description}</p>
//       </div>
//     `
//   }).join('')

//   const htmlContent = `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <title>Resume - ${profile.name || 'Chatkawin Taola'}</title>
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <link rel="preconnect" href="https://fonts.googleapis.com">
//   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//   <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
//   <style>
//     :root {
//       --lg-radius: 28px;
//       --lg-blur: 26px;
//       --lg-sat: 190%;
//       --ink: #e8ecf5;          /* primary light text on dark glass */
//       --ink-soft: #aeb7c9;     /* secondary */
//       --ink-mute: #6b7488;     /* labels */
//       --accent: #8b93ff;       /* brighter indigo for dark bg */
//       --accent-2: #c084fc;

//       --lg-rim: linear-gradient(135deg,
//         rgba(255,255,255,0.85) 0%,
//         rgba(255,255,255,0.22) 18%,
//         rgba(255,255,255,0) 46%,
//         rgba(150,160,255,0.12) 80%,
//         rgba(255,255,255,0.35) 100%);
//     }

//     * { box-sizing: border-box; margin: 0; padding: 0; }

//     body {
//       /* deep space base */
//       background:
//         radial-gradient(1200px 800px at 80% -10%, #12162a 0%, transparent 60%),
//         radial-gradient(1000px 900px at -10% 40%, #0b1c17 0%, transparent 55%),
//         radial-gradient(900px 700px at 100% 100%, #1c1024 0%, transparent 55%),
//         #05070d;
//       font-family: 'Kanit', 'IBM Plex Sans', sans-serif;
//       color: var(--ink);
//       min-height: 100vh;
//       position: relative;
//       overflow-x: hidden;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//     }

//     /* Screen-only glowing orbs (blurred). Print uses baked gradients instead. */
//     .orb {
//       position: fixed;
//       border-radius: 50%;
//       filter: blur(100px);
//       z-index: -1;
//       opacity: 0.55;
//       pointer-events: none;
//     }
//     .orb-1 { top: -80px;  right: -40px;  width: 460px; height: 460px; background: #4f46e5; }
//     .orb-2 { top: 36%;    left: -140px;  width: 520px; height: 520px; background: #10b981; }
//     .orb-3 { bottom: -90px; right: 4%;   width: 480px; height: 480px; background: #c026d3; }
//     .orb-4 { top: 58%; right: 22%; width: 340px; height: 340px; background: #f59e0b; opacity: 0.4; }

//     /* Specular + rim system */
//     .lg { position: relative; overflow: hidden; }
//     .lg::before {
//       content: '';
//       position: absolute; inset: 0; border-radius: inherit;
//       background: linear-gradient(140deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 40%);
//       mix-blend-mode: screen;
//       pointer-events: none;
//       z-index: 2;
//     }
//     .lg::after {
//       content: '';
//       position: absolute; inset: 0; border-radius: inherit;
//       padding: 1px;
//       background: var(--lg-rim);
//       -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
//       -webkit-mask-composite: xor;
//       mask-composite: exclude;
//       pointer-events: none;
//       z-index: 3;
//     }
//     .lg > * { position: relative; z-index: 4; }

//     /* Control bar — dark liquid pill */
//     .control-bar {
//       width: 100%; max-width: 210mm; margin: 22px auto 0;
//       padding: 14px 24px;
//       background: rgba(255,255,255,0.06);
//       border-radius: 22px;
//       backdrop-filter: blur(22px) saturate(var(--lg-sat));
//       -webkit-backdrop-filter: blur(22px) saturate(var(--lg-sat));
//       display: flex; justify-content: space-between; align-items: center;
//       color: var(--ink); z-index: 10;
//       box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.14);
//     }
//     .control-title { font-size: 14px; font-weight: 600; letter-spacing: 0.4px; }
//     .control-btns { display: flex; gap: 12px; }
//     .btn {
//       padding: 9px 18px; font-size: 13px; font-weight: 600;
//       border-radius: 999px; border: none; cursor: pointer;
//       transition: transform 0.15s ease;
//       backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
//     }
//     .btn:hover { transform: translateY(-1px); }
//     .btn-primary { background: linear-gradient(135deg, #6366f1, #a855f7); color: #fff; box-shadow: 0 6px 20px rgba(124,58,237,0.5); }
//     .btn-secondary { background: rgba(255,255,255,0.09); color: var(--ink); box-shadow: inset 0 1px 1px rgba(255,255,255,0.18); }

//     /* A4 container. Baked orb gradients live here so they print as real ink. */
//     .page-container {
//       width: 210mm; min-height: 297mm; margin: 26px auto 44px;
//       display: grid; grid-template-columns: 68mm 1fr; gap: 12px;
//       z-index: 1;
//       background:
//         radial-gradient(360px 300px at 82% 4%,  rgba(79,70,229,0.30), transparent 70%),
//         radial-gradient(420px 360px at -6% 42%, rgba(16,185,129,0.22), transparent 70%),
//         radial-gradient(380px 320px at 96% 98%, rgba(192,38,211,0.24), transparent 70%);
//       background-repeat: no-repeat;
//       border-radius: 32px;
//     }

//     /* ── Dark glass cards ────────────────────────────────────────────────── */
//     .glass-card-left {
//       border-radius: var(--lg-radius);
//       background: rgba(8, 10, 18, 0.5);
//       backdrop-filter: blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(1.08);
//       -webkit-backdrop-filter: blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(1.08);
//       box-shadow: 0 12px 44px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.16), inset 0 -1px 1px rgba(255,255,255,0.04);
//       padding: 32px 22px; color: var(--ink);
//       display: flex; flex-direction: column; align-items: center;
//     }
//     .glass-card-right {
//       border-radius: var(--lg-radius);
//       background: rgba(20, 24, 38, 0.42);
//       backdrop-filter: blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(1.08);
//       -webkit-backdrop-filter: blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(1.08);
//       box-shadow: 0 12px 44px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.14), inset 0 -1px 1px rgba(255,255,255,0.04);
//       padding: 38px 36px; color: var(--ink);
//     }

//     /* Sidebar */
//     .avatar-wrapper { position: relative; margin-bottom: 26px; display: flex; justify-content: center; align-items: center; }
//     .avatar {
//       width: 140px; height: 140px; border-radius: 50%; object-fit: cover;
//       border: 2px solid rgba(255,255,255,0.55);
//       box-shadow: 0 0 0 4px rgba(139,147,255,0.22), 0 8px 26px rgba(99,102,241,0.5);
//     }
//     .avatar-ring-outer { position: absolute; width: 156px; height: 156px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); }

//     .side-section { width: 100%; margin-bottom: 24px; }
//     .side-title {
//       font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
//       color: var(--accent); text-transform: uppercase; margin-bottom: 12px;
//       border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;
//     }
//     .contact-item { margin-bottom: 12px; }
//     .contact-label { display: block; font-size: 8px; font-weight: 600; color: var(--ink-mute); text-transform: uppercase; margin-bottom: 2px; }
//     .contact-val { font-size: 11px; color: var(--ink); word-break: break-all; }
//     .contact-val a { color: var(--ink); text-decoration: none; }
//     .contact-val a:hover { text-decoration: underline; }

//     .skill-category { margin-bottom: 14px; }
//     .skill-category-title { font-size: 11px; font-weight: 600; color: var(--ink-soft); margin-bottom: 6px; }
//     .skill-items { display: flex; flex-wrap: wrap; gap: 5px; }
//     .skill-badge {
//       display: inline-block; font-size: 10px;
//       background: rgba(139,147,255,0.2);
//       border: 1px solid rgba(255,255,255,0.16);
//       color: #e5e9ff; padding: 3px 9px; border-radius: 999px;
//       backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
//       box-shadow: inset 0 1px 0 rgba(255,255,255,0.18);
//     }

//     /* Right content */
//     .header-name { font-size: 26px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; text-transform: uppercase; }
//     .header-title { font-size: 12px; font-weight: 700; color: var(--accent); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
//     .divider { height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.25), rgba(255,255,255,0)); margin: 15px 0; }
//     .bio-text { font-size: 12px; line-height: 1.6; color: var(--ink-soft); margin-bottom: 25px; }

//     .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #ffffff; margin-bottom: 18px; position: relative; }
//     .section-title::after { content: ''; position: absolute; left: 0; bottom: -4px; width: 22px; height: 2px; border-radius: 2px; background: linear-gradient(90deg, var(--accent), var(--accent-2)); }

//     .main-section { margin-bottom: 30px; }

//     .timeline-container { position: relative; padding-left: 20px; }
//     .timeline-container::before { content: ''; position: absolute; left: 3px; top: 6px; bottom: 6px; width: 1px; background: rgba(255,255,255,0.14); }
//     .timeline-item { position: relative; margin-bottom: 22px; }
//     .timeline-node { position: absolute; left: -20px; top: 4px; width: 9px; height: 9px; border-radius: 50%; background: #0b0f19; border: 2px solid var(--accent); box-shadow: 0 0 0 3px rgba(139,147,255,0.22); }
//     .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
//     .exp-company { font-size: 12px; font-weight: 700; color: #ffffff; }
//     .exp-title { font-size: 11px; font-weight: 500; color: var(--ink-soft); }
//     .exp-date { font-size: 10px; font-weight: 600; color: var(--accent); margin-top: 1px; }
//     .exp-desc { font-size: 11px; line-height: 1.5; color: var(--ink-soft); margin-top: 4px; }

//     .proj-item { margin-bottom: 18px; }
//     .proj-title { font-size: 12px; font-weight: 700; color: #ffffff; }
//     .proj-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 3px; }
//     .proj-tag { font-size: 9px; background: rgba(139,147,255,0.14); border: 1px solid rgba(139,147,255,0.28); color: #c7ccff; padding: 2px 8px; border-radius: 999px; }
//     .proj-desc { font-size: 11px; line-height: 1.5; color: var(--ink-soft); margin-top: 4px; }

//     .floating-badge {
//       position: fixed; bottom: 26px; right: 26px;
//       background: rgba(255,255,255,0.1);
//       box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.2);
//       backdrop-filter: blur(14px) saturate(var(--lg-sat)); -webkit-backdrop-filter: blur(14px) saturate(var(--lg-sat));
//       padding: 11px 22px; border-radius: 999px; font-size: 12px; font-weight: 600; z-index: 100;
//       cursor: pointer; text-decoration: none; color: var(--ink);
//       display: flex; align-items: center; gap: 6px; transition: transform 0.2s ease, background 0.3s;
//     }
//     .floating-badge:hover { transform: translateY(-2px); background: rgba(139,147,255,0.3); color: #fff; }

//     /* ── Print: bake the glass (backdrop-filter cannot render on a flat page) ─ */
//     @media print {
//       * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
//       .no-print { display: none !important; }
//       .orb { display: none !important; }                 /* blurred divs don't print; baked gradients replace them */

//       body {
//         background: #05070d !important;
//       }
//       .page-container {
//         margin: 0 !important; width: 100% !important;
//         grid-template-columns: 62mm 1fr !important; gap: 6mm !important;
//         border-radius: 0 !important;
//         /* baked orbs — soft by nature, no blur needed */
//         background:
//           radial-gradient(70mm 55mm at 82% 3%,  rgba(79,70,229,0.45), transparent 70%),
//           radial-gradient(80mm 65mm at -6% 40%, rgba(16,185,129,0.30), transparent 70%),
//           radial-gradient(72mm 60mm at 98% 99%, rgba(192,38,211,0.36), transparent 70%),
//           #05070d !important;
//         background-repeat: no-repeat !important;
//       }

//       /* drop the live blur + the mask rim (masks are unreliable in print);
//          keep a semi-transparent fill so the baked orbs show through = frosted look */
//       .lg::after { display: none !important; }
//       .glass-card-left, .glass-card-right {
//         backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
//         border-radius: 14px !important;
//         border: 1px solid rgba(255,255,255,0.18) !important;
//         box-shadow: inset 0 1px 1px rgba(255,255,255,0.25), inset 0 0 40px rgba(255,255,255,0.03) !important;
//       }
//       .glass-card-left  { background: rgba(8,10,18,0.55) !important; color: var(--ink) !important; }
//       .glass-card-right { background: rgba(20,24,38,0.5) !important; color: var(--ink) !important; }
//       /* keep the specular sweep — it's a plain gradient and prints fine */
//       .lg::before { background: linear-gradient(140deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 42%) !important; }

//       .skill-badge { background: rgba(139,147,255,0.24) !important; border: 1px solid rgba(255,255,255,0.2) !important; color: #e5e9ff !important; backdrop-filter: none !important; }
//       .proj-tag { background: rgba(139,147,255,0.16) !important; border: 1px solid rgba(139,147,255,0.3) !important; color: #c7ccff !important; }
//     }
//   </style>
// </head>
// <body>

//   <!-- Optional refraction filter (Chromium-solid, Safari flaky). Attach url(#liquid-glass)
//        to a card's backdrop-filter for real edge warp. Off by default. -->
//   <svg width="0" height="0" style="position:absolute" aria-hidden="true">
//     <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
//       <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="42" result="noise"/>
//       <feGaussianBlur in="noise" stdDeviation="2" result="soft"/>
//       <feDisplacementMap in="SourceGraphic" in2="soft" scale="16" xChannelSelector="R" yChannelSelector="G"/>
//     </filter>
//   </svg>

//   <div class="orb orb-1"></div>
//   <div class="orb orb-2"></div>
//   <div class="orb orb-3"></div>
//   <div class="orb orb-4"></div>

//   <div class="control-bar lg no-print">
//     <div class="control-title">🫧 Liquid Glass Resume · Dark (Print Layout)</div>
//     <div class="control-btns">
//       <button class="btn btn-primary" onclick="window.print()">Print / Save PDF</button>
//       <button class="btn btn-secondary" onclick="window.close()">Close Preview</button>
//     </div>
//   </div>

//   <a class="floating-badge lg no-print" href="${currentOrigin}" target="_blank">
//     Open Portfolio ↗
//   </a>

//   <div class="page-container">

//     <div class="glass-card-left lg">
//       <div class="avatar-wrapper">
//         <div class="avatar-ring-outer"></div>
//         <img class="avatar" src="/img/avatar.jpg" alt="Avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
//         <div style="display:none; width:140px; height:140px; border-radius:50%; background:#1a202c; color:#fff; align-items:center; justify-content:center; font-size:26px; font-weight:bold; border:2px solid #8b93ff;">
//           ${(profile.name || 'Resume').split(' ').map(n => n[0]).join('').toUpperCase()}
//         </div>
//       </div>

//       <div class="side-section">
//         <div class="side-title">Contact</div>
//         ${emailHtml}
//         <div class="contact-item">
//           <span class="contact-label">GitHub</span>
//           <span class="contact-val"><a href="${github}" target="_blank">${formatUrlLabel(github)}</a></span>
//         </div>
//         <div class="contact-item">
//           <span class="contact-label">LinkedIn</span>
//           <span class="contact-val"><a href="${linkedin}" target="_blank">${formatUrlLabel(linkedin)}</a></span>
//         </div>
//         <div class="contact-item">
//           <span class="contact-label">Website</span>
//           <span class="contact-val"><a href="${website}" target="_blank">${formatUrlLabel(website)}</a></span>
//         </div>
//       </div>

//       <div class="side-section">
//         <div class="side-title">Core Skills</div>
//         ${skillsHtml}
//       </div>
//     </div>

//     <div class="glass-card-right lg">
//       <h1 class="header-name">${profile.name || 'Chatkawin Taola'}</h1>
//       <div class="header-title">${profile.title || 'System Analyst & Full Stack Developer'}</div>
//       <div class="divider"></div>

//       <p class="bio-text">${profile.bio || ''}</p>

//       <div class="main-section">
//         <div class="section-title">Work Experience</div>
//         <div class="timeline-container">
//           ${expHtml}
//         </div>
//       </div>

//       <div class="main-section">
//         <div class="section-title">Key Projects</div>
//         <div>
//           ${projHtml}
//         </div>
//       </div>
//     </div>

//   </div>

// </body>
// </html>`;

//   const printWindow = window.open('', '_blank')
//   if (printWindow) {
//     printWindow.document.write(htmlContent)
//     printWindow.document.close()
//   }
// }

/**
 * generateResumeHTML — iOS 26 "Liquid Glass".
 *
 *  • SCREEN : dark liquid glass (frosted blur + saturate over glowing orbs).
 *  • PRINT  : AUTO-switches to LIGHT liquid glass — white-dominant, so it's
 *             ink-friendly, while keeping the frosted-panel / specular / rim
 *             look (baked, since backdrop-filter can't render on a flat page).
 *  • A4     : locked to A4, panels fill full page height, and a fit-to-page
 *             script scales content down if it ever exceeds one page.
 *
 * Ink note: on paper the background is white (no ink); only text, hairline
 * borders, tiny pills and a faint pastel edge-tint consume ink.
 *
 * DROP-IN replacement — signature and all ${...} bindings unchanged.
 */
export async function generateResumeHTML(data: PortfolioData): Promise<void> {
  const { profile, experiences, skills, projects } = data
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://akirasane.github.io'

  const emailHtml = profile.social.email ? `
    <div class="contact-item">
      <span class="contact-label">Email</span>
      <span class="contact-val"><a href="mailto:${profile.social.email}">${profile.social.email}</a></span>
    </div>
  ` : ''

  const github = profile.social.github || ''
  const linkedin = profile.social.linkedin || ''
  const website = profile.social.website || ''

  const formatUrlLabel = (url: string) => {
    return url.replace('https://', '').replace('www.', '')
  }

  const skillsHtml = skills.map(cat => {
    const itemsHtml = cat.items.map(item => `
      <span class="skill-badge">${item.name} (${item.years}y)</span>
    `).join('')
    return `
      <div class="skill-category">
        <div class="skill-category-title">${cat.category}</div>
        <div class="skill-items">${itemsHtml}</div>
      </div>
    `
  }).join('')

  const expHtml = experiences.map(exp => {
    const endLabel = exp.endDate ? exp.endDate : 'Present'
    const descHtml = exp.description ? `<p class="exp-desc">${exp.description}</p>` : ''
    return `
      <div class="timeline-item">
        <div class="timeline-node"></div>
        <div class="timeline-content">
          <div class="exp-header">
            <span class="exp-company">${exp.company}</span>
            <span class="exp-title">${exp.title}</span>
          </div>
          <div class="exp-date">${exp.startDate} – ${endLabel}</div>
          ${descHtml}
        </div>
      </div>
    `
  }).join('')

  const projHtml = (projects || []).slice(0, 3).map(proj => {
    const tagsHtml = proj.tags.map(t => `<span class="proj-tag">${t}</span>`).join('')
    return `
      <div class="proj-item">
        <div class="proj-title">${proj.title}</div>
        <div class="proj-tags">${tagsHtml}</div>
        <p class="proj-desc">${proj.description}</p>
      </div>
    `
  }).join('')

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Resume - ${profile.name || 'Chatkawin Taola'}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --lg-radius: 28px;
      --lg-blur: 26px;
      --lg-sat: 190%;
      --ink: #e8ecf5;
      --ink-soft: #aeb7c9;
      --ink-mute: #6b7488;
      --accent: #8b93ff;
      --accent-2: #c084fc;
      --lg-rim: linear-gradient(135deg,
        rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.22) 18%,
        rgba(255,255,255,0) 46%, rgba(150,160,255,0.12) 80%, rgba(255,255,255,0.35) 100%);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Exact A4 page ─────────────────────────────────────────────────── */
    @page { size: A4 portrait; margin: 0; }

    body {
      background:
        radial-gradient(1200px 800px at 80% -10%, #12162a 0%, transparent 60%),
        radial-gradient(1000px 900px at -10% 40%, #0b1c17 0%, transparent 55%),
        radial-gradient(900px 700px at 100% 100%, #1c1024 0%, transparent 55%),
        #05070d;
      font-family: 'Kanit', 'IBM Plex Sans', sans-serif;
      color: var(--ink);
      min-height: 100vh;
      position: relative;
      overflow-x: hidden;
      display: flex; flex-direction: column; align-items: center;
    }

    .orb { position: fixed; border-radius: 50%; filter: blur(100px); z-index: -1; opacity: 0.55; pointer-events: none; }
    .orb-1 { top: -80px; right: -40px; width: 460px; height: 460px; background: #4f46e5; }
    .orb-2 { top: 36%; left: -140px; width: 520px; height: 520px; background: #10b981; }
    .orb-3 { bottom: -90px; right: 4%; width: 480px; height: 480px; background: #c026d3; }
    .orb-4 { top: 58%; right: 22%; width: 340px; height: 340px; background: #f59e0b; opacity: 0.4; }

    .lg { position: relative; overflow: hidden; }
    .lg::before { content: ''; position: absolute; inset: 0; border-radius: inherit;
      background: linear-gradient(140deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 40%);
      mix-blend-mode: screen; pointer-events: none; z-index: 2; }
    .lg::after { content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
      background: var(--lg-rim);
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; z-index: 3; }
    .lg > * { position: relative; z-index: 4; }

    /* Control bar */
    .control-bar { width: 100%; max-width: 210mm; margin: 22px auto 0; padding: 14px 24px;
      background: rgba(255,255,255,0.06); border-radius: 22px;
      backdrop-filter: blur(22px) saturate(var(--lg-sat)); -webkit-backdrop-filter: blur(22px) saturate(var(--lg-sat));
      display: flex; justify-content: space-between; align-items: center; color: var(--ink); z-index: 10;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.14); }
    .control-title { font-size: 14px; font-weight: 600; letter-spacing: 0.4px; }
    .control-btns { display: flex; gap: 12px; }
    .btn { padding: 9px 18px; font-size: 13px; font-weight: 600; border-radius: 999px; border: none; cursor: pointer;
      transition: transform 0.15s ease; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
    .btn:hover { transform: translateY(-1px); }
    .btn-primary { background: linear-gradient(135deg, #6366f1, #a855f7); color: #fff; box-shadow: 0 6px 20px rgba(124,58,237,0.5); }
    .btn-secondary { background: rgba(255,255,255,0.09); color: var(--ink); box-shadow: inset 0 1px 1px rgba(255,255,255,0.18); }

    /* A4 container — panels fill full page height (no dead void) */
    .page-container {
      width: 210mm; min-height: 297mm; margin: 26px auto 44px;
      display: grid; grid-template-columns: 68mm 1fr; gap: 12px; z-index: 1;
      background:
        radial-gradient(360px 300px at 82% 4%, rgba(79,70,229,0.30), transparent 70%),
        radial-gradient(420px 360px at -6% 42%, rgba(16,185,129,0.22), transparent 70%),
        radial-gradient(380px 320px at 96% 98%, rgba(192,38,211,0.24), transparent 70%);
      background-repeat: no-repeat; border-radius: 32px;
    }

    .glass-card-left, .glass-card-right { min-height: 100%; }

    .glass-card-left {
      border-radius: var(--lg-radius); background: rgba(8,10,18,0.5);
      backdrop-filter: blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(1.08);
      -webkit-backdrop-filter: blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(1.08);
      box-shadow: 0 12px 44px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.16), inset 0 -1px 1px rgba(255,255,255,0.04);
      padding: 32px 22px; color: var(--ink); display: flex; flex-direction: column; align-items: center;
    }
    .glass-card-right {
      border-radius: var(--lg-radius); background: rgba(20,24,38,0.42);
      backdrop-filter: blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(1.08);
      -webkit-backdrop-filter: blur(var(--lg-blur)) saturate(var(--lg-sat)) brightness(1.08);
      box-shadow: 0 12px 44px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.14), inset 0 -1px 1px rgba(255,255,255,0.04);
      padding: 38px 36px; color: var(--ink);
    }

    .avatar-wrapper { position: relative; margin-bottom: 26px; display: flex; justify-content: center; align-items: center; }
    .avatar { width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.55);
      box-shadow: 0 0 0 4px rgba(139,147,255,0.22), 0 8px 26px rgba(99,102,241,0.5); }
    .avatar-ring-outer { position: absolute; width: 156px; height: 156px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); }

    .side-section { width: 100%; margin-bottom: 24px; }
    .side-title { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: var(--accent); text-transform: uppercase;
      margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; }
    .contact-item { margin-bottom: 12px; }
    .contact-label { display: block; font-size: 8px; font-weight: 600; color: var(--ink-mute); text-transform: uppercase; margin-bottom: 2px; }
    .contact-val { font-size: 11px; color: var(--ink); word-break: break-all; }
    .contact-val a { color: var(--ink); text-decoration: none; }
    .contact-val a:hover { text-decoration: underline; }

    .skill-category { margin-bottom: 14px; }
    .skill-category-title { font-size: 11px; font-weight: 600; color: var(--ink-soft); margin-bottom: 6px; }
    .skill-items { display: flex; flex-wrap: wrap; gap: 5px; }
    .skill-badge { display: inline-block; font-size: 10px; background: rgba(139,147,255,0.2);
      border: 1px solid rgba(255,255,255,0.16); color: #e5e9ff; padding: 3px 9px; border-radius: 999px;
      backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.18); }

    .header-name { font-size: 26px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; text-transform: uppercase; }
    .header-title { font-size: 12px; font-weight: 700; color: var(--accent); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
    .divider { height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.25), rgba(255,255,255,0)); margin: 15px 0; }
    .bio-text { font-size: 12px; line-height: 1.6; color: var(--ink-soft); margin-bottom: 25px; }

    .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #ffffff; margin-bottom: 18px; position: relative; }
    .section-title::after { content: ''; position: absolute; left: 0; bottom: -4px; width: 22px; height: 2px; border-radius: 2px; background: linear-gradient(90deg, var(--accent), var(--accent-2)); }

    .main-section { margin-bottom: 30px; }
    .timeline-container { position: relative; padding-left: 20px; }
    .timeline-container::before { content: ''; position: absolute; left: 3px; top: 6px; bottom: 6px; width: 1px; background: rgba(255,255,255,0.14); }
    .timeline-item { position: relative; margin-bottom: 22px; }
    .timeline-node { position: absolute; left: -20px; top: 4px; width: 9px; height: 9px; border-radius: 50%; background: #0b0f19; border: 2px solid var(--accent); box-shadow: 0 0 0 3px rgba(139,147,255,0.22); }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
    .exp-company { font-size: 12px; font-weight: 700; color: #ffffff; }
    .exp-title { font-size: 11px; font-weight: 500; color: var(--ink-soft); }
    .exp-date { font-size: 10px; font-weight: 600; color: var(--accent); margin-top: 1px; }
    .exp-desc { font-size: 11px; line-height: 1.5; color: var(--ink-soft); margin-top: 4px; }

    .proj-item { margin-bottom: 18px; }
    .proj-title { font-size: 12px; font-weight: 700; color: #ffffff; }
    .proj-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 3px; }
    .proj-tag { font-size: 9px; background: rgba(139,147,255,0.14); border: 1px solid rgba(139,147,255,0.28); color: #c7ccff; padding: 2px 8px; border-radius: 999px; }
    .proj-desc { font-size: 11px; line-height: 1.5; color: var(--ink-soft); margin-top: 4px; }

    .floating-badge { position: fixed; bottom: 26px; right: 26px; background: rgba(255,255,255,0.1);
      box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.2);
      backdrop-filter: blur(14px) saturate(var(--lg-sat)); -webkit-backdrop-filter: blur(14px) saturate(var(--lg-sat));
      padding: 11px 22px; border-radius: 999px; font-size: 12px; font-weight: 600; z-index: 100;
      cursor: pointer; text-decoration: none; color: var(--ink); display: flex; align-items: center; gap: 6px;
      transition: transform 0.2s ease, background 0.3s; }
    .floating-badge:hover { transform: translateY(-2px); background: rgba(139,147,255,0.3); color: #fff; }

    /* ══ PRINT: auto LIGHT liquid glass — white-dominant = ink-friendly ══ */
    @media print {
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .no-print { display: none !important; }
      .orb { display: none !important; }

      body {
        background: #ffffff !important;
        color: #0f172a !important;
        display: block !important;
      }

      .page-container {
        margin: 0 !important; width: 210mm !important; min-height: 297mm !important;
        grid-template-columns: 62mm 1fr !important; gap: 6mm !important;
        border-radius: 0 !important;
        /* just a whisper of pastel at the edges — barely any ink */
        background:
          radial-gradient(70mm 55mm at 90% 2%, rgba(99,102,241,0.06), transparent 70%),
          radial-gradient(80mm 65mm at -4% 45%, rgba(16,185,129,0.05), transparent 70%),
          radial-gradient(72mm 60mm at 98% 99%, rgba(192,38,211,0.05), transparent 70%),
          #ffffff !important;
        background-repeat: no-repeat !important;
      }

      /* frosted panels — light, thin rim, subtle inner highlight (no live blur) */
      .lg::after { display: none !important; }
      .lg::before { background: linear-gradient(140deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 44%) !important; }

      .glass-card-left, .glass-card-right {
        backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
        border-radius: 12px !important;
        box-shadow: inset 0 1px 1px rgba(255,255,255,0.9) !important;
      }
      .glass-card-left {
        background: rgba(241,243,250,0.75) !important; color: #1e293b !important;
        border: 1px solid rgba(99,102,241,0.18) !important;
      }
      .glass-card-right {
        background: rgba(255,255,255,0.82) !important; color: #0f172a !important;
        border: 1px solid rgba(15,23,42,0.08) !important;
      }

      /* recolor text/lines for the light panels */
      .side-title { color: #4f46e5 !important; border-bottom-color: rgba(99,102,241,0.25) !important; }
      .contact-label { color: #64748b !important; }
      .contact-val, .contact-val a { color: #1e293b !important; }
      .skill-category-title { color: #334155 !important; }
      .skill-badge { background: rgba(99,102,241,0.1) !important; border: 1px solid rgba(99,102,241,0.3) !important; color: #4338ca !important; box-shadow: none !important; }
      .header-name { color: #0f172a !important; }
      .header-title { color: #4f46e5 !important; }
      .divider { background: linear-gradient(90deg, rgba(15,23,42,0.15), rgba(15,23,42,0)) !important; }
      .bio-text { color: #475569 !important; }
      .section-title { color: #0f172a !important; }
      .timeline-container::before { background: #e2e8f0 !important; }
      .timeline-node { background: #fff !important; border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important; }
      .exp-company, .proj-title { color: #0f172a !important; }
      .exp-title, .exp-desc, .proj-desc { color: #475569 !important; }
      .exp-date { color: #6366f1 !important; }
      .proj-tag { background: rgba(99,102,241,0.1) !important; border: 1px solid rgba(99,102,241,0.2) !important; color: #6366f1 !important; }
      .avatar { border-color: #6366f1 !important; box-shadow: none !important; }
    }
  </style>
</head>
<body>

  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="42" result="noise"/>
      <feGaussianBlur in="noise" stdDeviation="2" result="soft"/>
      <feDisplacementMap in="SourceGraphic" in2="soft" scale="16" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </svg>

  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="orb orb-3"></div>
  <div class="orb orb-4"></div>

  <div class="control-bar lg no-print">
    <div class="control-title">🫧 Liquid Glass Resume · Dark screen / Light print</div>
    <div class="control-btns">
      <button class="btn btn-primary" onclick="window.print()">Print / Save PDF</button>
      <button class="btn btn-secondary" onclick="window.close()">Close Preview</button>
    </div>
  </div>

  <a class="floating-badge lg no-print" href="${currentOrigin}" target="_blank">
    Open Portfolio ↗
  </a>

  <div class="page-container">

    <div class="glass-card-left lg">
      <div class="avatar-wrapper">
        <div class="avatar-ring-outer"></div>
        <img class="avatar" src="/img/avatar.jpg" alt="Avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div style="display:none; width:140px; height:140px; border-radius:50%; background:#1a202c; color:#fff; align-items:center; justify-content:center; font-size:26px; font-weight:bold; border:2px solid #8b93ff;">
          ${(profile.name || 'Resume').split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
      </div>

      <div class="side-section">
        <div class="side-title">Contact</div>
        ${emailHtml}
        <div class="contact-item">
          <span class="contact-label">GitHub</span>
          <span class="contact-val"><a href="${github}" target="_blank">${formatUrlLabel(github)}</a></span>
        </div>
        <div class="contact-item">
          <span class="contact-label">LinkedIn</span>
          <span class="contact-val"><a href="${linkedin}" target="_blank">${formatUrlLabel(linkedin)}</a></span>
        </div>
        <div class="contact-item">
          <span class="contact-label">Website</span>
          <span class="contact-val"><a href="${website}" target="_blank">${formatUrlLabel(website)}</a></span>
        </div>
      </div>

      <div class="side-section">
        <div class="side-title">Core Skills</div>
        ${skillsHtml}
      </div>
    </div>

    <div class="glass-card-right lg">
      <h1 class="header-name">${profile.name || 'Chatkawin Taola'}</h1>
      <div class="header-title">${profile.title || 'System Analyst & Full Stack Developer'}</div>
      <div class="divider"></div>

      <p class="bio-text">${profile.bio || ''}</p>

      <div class="main-section">
        <div class="section-title">Work Experience</div>
        <div class="timeline-container">
          ${expHtml}
        </div>
      </div>

      <div class="main-section">
        <div class="section-title">Key Projects</div>
        <div>
          ${projHtml}
        </div>
      </div>
    </div>

  </div>

  <script>
    // Fit-to-one-page: scale the container down only if content exceeds A4 height.
    (function () {
      var MM_TO_PX = 96 / 25.4;          // 1mm at 96dpi
      var A4_H = 297 * MM_TO_PX;         // ~1122.5px
      function fitToPage() {
        var page = document.querySelector('.page-container');
        if (!page) return;
        page.style.transform = 'none';
        page.style.transformOrigin = 'top center';
        var h = page.scrollHeight;
        if (h > A4_H) page.style.transform = 'scale(' + (A4_H / h).toFixed(4) + ')';
      }
      window.addEventListener('load', fitToPage);
      window.addEventListener('resize', fitToPage);
      window.addEventListener('beforeprint', fitToPage);
    })();
  </script>

</body>
</html>`;

  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }
}