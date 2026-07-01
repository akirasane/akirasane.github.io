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

  // Load avatar asynchronously before PDF generation starts
  let circularAvatarBase64: string | null = null
  try {
    const avatarImg = await loadImage('/img/avatar.jpg')
    circularAvatarBase64 = getCircularAvatarData(avatarImg)
  } catch (err) {
    console.warn('Failed to load avatar image, using initials badge', err)
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

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor('#FFFFFF')
    doc.text(initials, x - 2.8, yVal + 1.2)
  }

  const addLeftHeader = (title: string, yVal: number) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor('#6366F1')
    doc.text(title.toUpperCase(), 15, yVal)
    
    doc.setDrawColor('#1E293B')
    doc.setLineWidth(0.3)
    doc.line(15, yVal + 1.8, 50, yVal + 1.8)
    return yVal + 5
  }

  const addContactItem = (label: string, value: string, yVal: number) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6.5)
    doc.setTextColor('#94A3B8')
    doc.text(label.toUpperCase(), 15, yVal)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor('#FFFFFF')
    
    const lines = doc.splitTextToSize(value, 38) as string[]
    doc.text(lines, 15, yVal + 3.5)
    
    return yVal + 3.5 + lines.length * 3 + 3.2
  }

  const drawSkillPill = (text: string, x: number, yVal: number) => {
    doc.setFont('helvetica', 'normal')
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
    doc.setFont('helvetica', 'bold')
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
    const avatarWidth = 49.5 // 90% of 55mm column card width
    const avatarX = 37.5 - avatarWidth / 2 // Centered (card center is 37.5)
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

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(22)
      doc.setTextColor('#FFFFFF')
      doc.text(initials, centerAvatarX - 6.5, centerAvatarY + 2.8)
    }
    
    // Shifted down starting y to accommodate 49.5mm avatar height
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
    doc.setFont('helvetica', 'bold')
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
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor('#0F172A')
  doc.text((profile.name || 'Chatkawin Taola').toUpperCase(), 75, yRight)
  
  yRight += 5.5
  doc.setFont('helvetica', 'bold')
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
    doc.setFont('helvetica', 'normal')
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
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      const companyTitle = `${exp.company} — ${exp.title}`
      const companyLines = doc.splitTextToSize(companyTitle, 113) as string[]

      doc.setFont('helvetica', 'normal')
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
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor('#0F172A')
      doc.text(companyLines, 82, yRight + 2)
      yRight += companyLines.length * 4.2 + 0.5

      // Date stamp
      const endLabel = exp.endDate ? exp.endDate : 'Present'
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor('#6366F1')
      doc.text(`${exp.startDate} – ${endLabel}`, 82, yRight + 1.5)
      yRight += 4.5

      // Description list
      if (exp.description) {
        doc.setFont('helvetica', 'normal')
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
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      const projTitle = proj.title
      const titleLines = doc.splitTextToSize(projTitle, 113) as string[]

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      const descLines = proj.description ? (doc.splitTextToSize(proj.description, 113) as string[]) : []

      const tagsText = `Tech Stack: ${proj.tags.join(', ')}`
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(7.5)
      const tagLines = doc.splitTextToSize(tagsText, 113) as string[]

      const neededHeight = titleLines.length * 4 + tagLines.length * 3.5 + descLines.length * 3.8 + 6
      checkPageBreakRight(neededHeight)

      // Project Title
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor('#0F172A')
      doc.text(titleLines, 82, yRight + 2)
      yRight += titleLines.length * 4 + 0.5

      // Tech Stack Tags
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(7.5)
      doc.setTextColor('#6366F1')
      doc.text(tagLines, 82, yRight + 1.5)
      yRight += tagLines.length * 3.5 + 0.5

      // Description
      if (proj.description) {
        doc.setFont('helvetica', 'normal')
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


