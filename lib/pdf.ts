import type { PortfolioData } from './types'

/**
 * Generates a PDF resume from the given portfolio data and triggers a browser download.
 * Requirements: 13.2, 13.3
 */
export async function generateResumePDF(data: PortfolioData): Promise<void> {
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = margin

  const addText = (text: string, size: number, bold = false, color = '#000000') => {
    doc.setFontSize(size)
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setTextColor(color)
    const lines = doc.splitTextToSize(text, contentWidth) as string[]
    doc.text(lines, margin, y)
    y += lines.length * size * 0.4 + 2
  }

  const addDivider = () => {
    doc.setDrawColor('#cccccc')
    doc.line(margin, y, pageWidth - margin, y)
    y += 4
  }

  const checkPageBreak = (needed = 20) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }
  }

  const { profile, experiences, skills } = data

  // ── Header ──────────────────────────────────────────────────────────────
  addText(profile.name || 'Name', 22, true, '#1a1a2e')
  addText(profile.title || '', 14, false, '#4f46e5')

  if (profile.bio) {
    y += 2
    addText(profile.bio, 10, false, '#374151')
  }

  // Social / contact line
  const socialParts: string[] = []
  if (profile.social.email)    socialParts.push(profile.social.email)
  if (profile.social.github)   socialParts.push(profile.social.github)
  if (profile.social.linkedin) socialParts.push(profile.social.linkedin)
  if (profile.social.website)  socialParts.push(profile.social.website)
  if (socialParts.length > 0) {
    y += 2
    addText(socialParts.join('  |  '), 9, false, '#6b7280')
  }

  y += 4
  addDivider()

  // ── Experience ──────────────────────────────────────────────────────────
  if (experiences.length > 0) {
    checkPageBreak(12)
    addText('Experience', 14, true, '#1a1a2e')
    y += 2

    for (const exp of experiences) {
      checkPageBreak(24)
      const endLabel = exp.endDate ? exp.endDate : 'Present'
      addText(`${exp.company} — ${exp.title}`, 11, true, '#111827')
      addText(`${exp.startDate} – ${endLabel}`, 9, false, '#6b7280')
      if (exp.description) {
        addText(exp.description, 10, false, '#374151')
      }
      y += 3
    }

    addDivider()
  }

  // ── Skills ──────────────────────────────────────────────────────────────
  if (skills.length > 0) {
    checkPageBreak(12)
    addText('Skills', 14, true, '#1a1a2e')
    y += 2

    for (const category of skills) {
      checkPageBreak(10)
      const itemNames = category.items.map((i) => i.name).join(', ')
      addText(`${category.category}: ${itemNames}`, 10, false, '#374151')
      y += 1
    }
  }

  doc.save('resume.pdf')
}
