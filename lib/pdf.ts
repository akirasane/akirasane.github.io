import type { PortfolioData } from './types'

// Stub — full implementation in task 15
export async function generateResumePDF(_data: PortfolioData): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  const { profile, experiences } = _data

  doc.setFontSize(22)
  doc.text(profile.name, 20, 20)
  doc.setFontSize(14)
  doc.text(profile.title, 20, 30)

  if (profile.bio) {
    doc.setFontSize(11)
    const lines = doc.splitTextToSize(profile.bio, 170)
    doc.text(lines, 20, 45)
  }

  let y = 70
  if (experiences.length > 0) {
    doc.setFontSize(14)
    doc.text('Experience', 20, y)
    y += 8
    for (const exp of experiences) {
      doc.setFontSize(11)
      doc.text(`${exp.title} @ ${exp.company}`, 20, y)
      y += 6
      doc.setFontSize(10)
      doc.text(`${exp.startDate} – ${exp.endDate || 'Present'}`, 20, y)
      y += 5
      if (exp.description) {
        const lines = doc.splitTextToSize(exp.description, 170)
        doc.text(lines, 20, y)
        y += lines.length * 5 + 4
      }
      if (y > 270) { doc.addPage(); y = 20 }
    }
  }

  doc.save('resume.pdf')
}
