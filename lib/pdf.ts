import type { PortfolioData } from './types'

/**
 * Generates a PDF resume from the given portfolio data and triggers a browser download.
 * Incorporates a premium two-column split layout with skill badges and work timelines.
 */
export async function generateResumePDF(data: PortfolioData): Promise<void> {
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  
  let yLeft = 20
  let yRight = 20

  const { profile, experiences, skills } = data

  // ── Helper Drawings ───────────────────────────────────────────────────────

  const drawPageSkeleton = () => {
    // Left column background (Dark Slate)
    doc.setFillColor('#0B0F19')
    doc.rect(0, 0, 65, pageHeight, 'F')

    // Right column background (Pure White)
    doc.setFillColor('#FFFFFF')
    doc.rect(65, 0, pageWidth - 65, pageHeight, 'F')
  }

  const drawInitialsBadge = (x: number, yVal: number, name: string) => {
    const initials = name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()

    // Circular glass-style background
    doc.setFillColor('#1A202C')
    doc.circle(x, yVal, 10, 'F')

    // Thin accent glowing border
    doc.setDrawColor('#6366F1')
    doc.setLineWidth(0.4)
    doc.circle(x, yVal, 10, 'D')

    // Initials text
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor('#FFFFFF')
    doc.text(initials, x - 2.8, yVal + 1.2)
  }

  const addLeftHeader = (title: string, yVal: number) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor('#6366F1')
    doc.text(title.toUpperCase(), 12, yVal)
    
    // Bottom thin line
    doc.setDrawColor('#1E293B')
    doc.setLineWidth(0.3)
    doc.line(12, yVal + 1.8, 53, yVal + 1.8)
    return yVal + 5
  }

  const addContactItem = (label: string, value: string, yVal: number) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6.5)
    doc.setTextColor('#94A3B8')
    doc.text(label.toUpperCase(), 12, yVal)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor('#FFFFFF')
    
    const lines = doc.splitTextToSize(value, 41) as string[]
    doc.text(lines, 12, yVal + 3.5)
    
    return yVal + 3.5 + lines.length * 3 + 1
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
    doc.text(categoryName, 12, yVal)
    
    let currentY = yVal + 4.5
    let currentX = 12
    const rowHeight = 6.2

    items.forEach((item) => {
      const text = `${item.name} (${item.years}y)`
      const textWidth = doc.getTextWidth(text)
      const pillWidth = textWidth + 4.5

      if (currentX + pillWidth > 53) {
        currentX = 12
        currentY += rowHeight
      }

      drawSkillPill(text, currentX, currentY)
      currentX += pillWidth + 1.8
    })

    return currentY + 6.5
  }

  const drawLeftSidebar = () => {
    // Circular Avatar Initials
    drawInitialsBadge(32.5, 23, profile.name || 'Resume')
    
    let yL = 40
    
    // Contact Section
    yL = addLeftHeader('Contact', yL)
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
    yL += 2.5
    yL = addLeftHeader('Core Skills', yL)
    
    for (const category of skills) {
      yL = addLeftSkills(category.category, category.items, yL)
    }
  }

  const checkPageBreakRight = (neededHeight: number) => {
    if (yRight + neededHeight > pageHeight - 15) {
      doc.addPage()
      drawPageSkeleton()
      drawLeftSidebar()
      yRight = 25
      yLeft = 25
    }
  }

  const addRightHeader = (title: string) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor('#0F172A')
    doc.text(title.toUpperCase(), 75, yRight)
    
    // Sleek Accent Bar
    doc.setFillColor('#4F46E5')
    doc.rect(75, yRight + 1.8, 12, 1, 'F')
    
    yRight += 6.5
  }

  // ── Build Document ────────────────────────────────────────────────────────

  drawPageSkeleton()
  drawLeftSidebar()

  // Header Details (Name & Title)
  yRight = 24
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor('#0F172A')
  doc.text((profile.name || 'Chatkawin Taola').toUpperCase(), 75, yRight)
  
  yRight += 5.5
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
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
    const bioLines = doc.splitTextToSize(profile.bio, 120) as string[]
    doc.text(bioLines, 75, yRight)
    yRight += bioLines.length * 4.2 + 6
  }

  // Experience Section
  if (experiences.length > 0) {
    addRightHeader('Work Experience')
    yRight += 1.5

    for (const exp of experiences) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      const companyTitle = `${exp.company} — ${exp.title}`
      const companyLines = doc.splitTextToSize(companyTitle, 113) as string[]

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      const descLines = exp.description ? (doc.splitTextToSize(exp.description, 113) as string[]) : []

      // Calculate approximate block height
      const blockHeight = companyLines.length * 4.2 + descLines.length * 3.8 + 8

      checkPageBreakRight(blockHeight)

      const startY = yRight

      // Timeline axis node (Outer circular ring)
      doc.setFillColor('#6366F1')
      doc.circle(77, startY + 1.2, 1.4, 'F')
      // Timeline axis node (Inner center hole)
      doc.setFillColor('#FFFFFF')
      doc.circle(77, startY + 1.2, 0.6, 'F')

      // Company and Title Info
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
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

  doc.save('resume.pdf')
}

