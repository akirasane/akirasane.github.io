/**
 * Resume Generator Utility
 * Generates a professional PDF resume from portfolio data
 */

class ResumeGenerator {
  constructor(portfolioData) {
    this.portfolioData = portfolioData;
    this._isGenerating = false;
  }

  get isGenerating() {
    return this._isGenerating;
  }

  /**
   * Main method to generate and download PDF resume
   */
  async generatePDF() {
    try {
      this._isGenerating = true;

      // Check if jsPDF is available
      if (typeof window.jspdf === 'undefined') {
        throw new Error('jsPDF library not loaded');
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // A4 dimensions: 210mm x 297mm
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 20;
      const contentWidth = pageWidth - (2 * margin);
      let yPosition = margin;

      // Add header
      yPosition = this.addHeader(doc, margin, yPosition, contentWidth);

      // Add personal info section
      yPosition = this.addSection(
        doc,
        'PERSONAL INFORMATION',
        this.formatPersonalInfo(),
        margin,
        yPosition,
        contentWidth,
        pageHeight
      );

      // Add skills section
      yPosition = this.addSection(
        doc,
        'SKILLS',
        this.formatSkills(),
        margin,
        yPosition,
        contentWidth,
        pageHeight
      );

      // Add experience section
      yPosition = this.addSection(
        doc,
        'WORK EXPERIENCE',
        this.formatExperience(),
        margin,
        yPosition,
        contentWidth,
        pageHeight
      );

      // Save the PDF
      doc.save('resume.pdf');

      return true;
    } catch (error) {
      console.error('[ResumeGenerator] PDF generation failed:', error);
      throw error;
    } finally {
      this._isGenerating = false;
    }
  }

  /**
   * Add header with name, title, and contact info
   */
  addHeader(doc, x, y, width) {
    const personalInfo = this.portfolioData.personalInfo || {};
    
    // Name
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229); // Indigo color
    doc.text(personalInfo.name || 'Chatkawin Taola', x, y);
    y += 10;

    // Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(personalInfo.title || 'Software Developer', x, y);
    y += 8;

    // Contact info
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    const contactInfo = [
      personalInfo.email || 'contact.chatkawin@gmail.com',
      personalInfo.phone || '',
      personalInfo.location || ''
    ].filter(Boolean).join(' | ');
    
    doc.text(contactInfo, x, y);
    y += 6;

    // Links
    if (personalInfo.github || personalInfo.linkedin) {
      const links = [
        personalInfo.github || 'github.com/akirasane',
        personalInfo.linkedin || 'linkedin.com/in/akirasane'
      ].filter(Boolean).join(' | ');
      doc.text(links, x, y);
      y += 8;
    }

    // Separator line
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(x, y, x + width, y);
    y += 8;

    return y;
  }

  /**
   * Add a section with title and content
   */
  addSection(doc, title, content, x, y, width, pageHeight) {
    const margin = 20;
    const bottomMargin = 20;

    // Check if we need a new page for the section title
    if (y > pageHeight - bottomMargin - 20) {
      doc.addPage();
      y = margin;
    }

    // Section title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text(title, x, y);
    y += 8;

    // Underline
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.3);
    doc.line(x, y, x + 40, y);
    y += 6;

    // Content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    // Process content array
    for (const item of content) {
      // Check if we need a new page
      if (y > pageHeight - bottomMargin - 15) {
        doc.addPage();
        y = margin;
      }

      if (item.type === 'text') {
        const lines = doc.splitTextToSize(item.content, width);
        doc.text(lines, x, y);
        y += lines.length * 5;
      } else if (item.type === 'heading') {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 40, 40);
        doc.text(item.content, x, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        y += 6;
      } else if (item.type === 'subheading') {
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(80, 80, 80);
        doc.text(item.content, x, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        y += 5;
      } else if (item.type === 'bullet') {
        doc.text('•', x, y);
        const lines = doc.splitTextToSize(item.content, width - 5);
        doc.text(lines, x + 5, y);
        y += lines.length * 5;
      } else if (item.type === 'space') {
        y += item.amount || 4;
      }
    }

    y += 6;
    return y;
  }

  /**
   * Format personal information
   */
  formatPersonalInfo() {
    const personalInfo = this.portfolioData.personalInfo || {};
    const content = [];

    if (personalInfo.summary) {
      content.push({
        type: 'text',
        content: personalInfo.summary
      });
    } else {
      content.push({
        type: 'text',
        content: "Passionate software developer with over 5 years of experience in building scalable web applications and analyzing complex systems. Specializing in full-stack development with a strong foundation in system design and architecture."
      });
    }

    return content;
  }

  /**
   * Format skills section
   */
  formatSkills() {
    const skills = this.portfolioData.skills || this.getDefaultSkills();
    const content = [];

    skills.forEach(category => {
      content.push({
        type: 'heading',
        content: category.title
      });

      const skillsList = category.items.join(', ');
      content.push({
        type: 'text',
        content: skillsList
      });

      content.push({
        type: 'space',
        amount: 3
      });
    });

    return content;
  }

  /**
   * Format work experience section
   */
  formatExperience() {
    const experiences = this.portfolioData.experiences || [];
    const content = [];

    experiences.forEach((exp, index) => {
      // Job title and company
      content.push({
        type: 'heading',
        content: `${exp.title} - ${exp.company}`
      });

      // Period
      content.push({
        type: 'subheading',
        content: exp.period
      });

      content.push({
        type: 'space',
        amount: 2
      });

      // Description
      if (exp.description) {
        content.push({
          type: 'text',
          content: exp.description
        });

        content.push({
          type: 'space',
          amount: 2
        });
      }

      // Projects
      if (exp.projects && exp.projects.length > 0) {
        exp.projects.forEach(project => {
          content.push({
            type: 'bullet',
            content: `${project.title}: ${project.description}`
          });
        });
      }

      // Add space between experiences
      if (index < experiences.length - 1) {
        content.push({
          type: 'space',
          amount: 5
        });
      }
    });

    return content;
  }

  /**
   * Get default skills if not provided
   */
  getDefaultSkills() {
    return [
      {
        title: 'Frontend',
        items: ['React', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'HTML5/CSS3']
      },
      {
        title: 'Backend',
        items: ['Node.js', 'REST API', 'C#', '.NET MVC', 'PHP', 'Laravel']
      },
      {
        title: 'Database',
        items: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL']
      },
      {
        title: 'DevOps & Tools',
        items: ['Docker', 'Git', 'CI/CD', 'AWS', 'Linux']
      },
      {
        title: 'System Analysis',
        items: ['UML', 'Requirements Analysis', 'System Design', 'Agile/Scrum']
      }
    ];
  }
}

// Make ResumeGenerator available globally
window.ResumeGenerator = ResumeGenerator;
