/**
 * Unit tests for Resume Generator
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('ResumeGenerator', () => {
  let ResumeGenerator;
  let mockJsPDF;
  let dom;

  beforeEach(async () => {
    // Create a DOM environment
    const html = `<!DOCTYPE html><html><body></body></html>`;
    dom = new JSDOM(html, { 
      url: 'http://localhost',
      runScripts: 'dangerously',
      resources: 'usable'
    });
    
    global.window = dom.window;
    global.document = dom.window.document;

    // Mock jsPDF
    mockJsPDF = vi.fn().mockImplementation(function(config) {
      this.config = config;
      this.pages = [];
      this.currentPage = { content: [] };
      
      this.setFontSize = vi.fn();
      this.setFont = vi.fn();
      this.setTextColor = vi.fn();
      this.setDrawColor = vi.fn();
      this.setLineWidth = vi.fn();
      this.text = vi.fn((text, x, y) => {
        this.currentPage.content.push({ type: 'text', text, x, y });
      });
      this.line = vi.fn();
      this.addPage = vi.fn(() => {
        this.pages.push(this.currentPage);
        this.currentPage = { content: [] };
      });
      this.splitTextToSize = vi.fn((text, width) => {
        // Simple split simulation
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
          if ((currentLine + word).length * 2 < width) {
            currentLine += (currentLine ? ' ' : '') + word;
          } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
          }
        });
        if (currentLine) lines.push(currentLine);
        
        return lines.length > 0 ? lines : [text];
      });
      this.save = vi.fn();
    });

    // Set up jsPDF in window
    window.jspdf = { jsPDF: mockJsPDF };

    // Load the ResumeGenerator
    const resumeGeneratorCode = fs.readFileSync(
      path.resolve(__dirname, '../../utils/resume-generator.js'),
      'utf-8'
    );
    
    // Execute the code in the JSDOM context
    const script = new dom.window.Function(resumeGeneratorCode);
    script();
    
    ResumeGenerator = dom.window.ResumeGenerator;
  });

  describe('Constructor', () => {
    it('should create a ResumeGenerator instance', () => {
      const portfolioData = { personalInfo: { name: 'Test User' } };
      const generator = new ResumeGenerator(portfolioData);
      
      expect(generator).toBeDefined();
      expect(generator.portfolioData).toEqual(portfolioData);
      expect(generator.isGenerating).toBe(false);
    });
  });

  describe('generatePDF', () => {
    it('should generate a PDF with personal info, skills, and experience', async () => {
      const portfolioData = {
        personalInfo: {
          name: 'John Doe',
          title: 'Software Engineer',
          email: 'john@example.com'
        },
        skills: [
          { title: 'Frontend', items: ['React', 'Vue.js'] }
        ],
        experiences: [
          {
            title: 'Developer',
            company: 'Tech Corp',
            period: '2020-2023',
            description: 'Built web apps',
            projects: []
          }
        ]
      };

      const generator = new ResumeGenerator(portfolioData);
      const result = await generator.generatePDF();

      expect(result).toBe(true);
      expect(mockJsPDF).toHaveBeenCalledWith({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
    });

    it('should reset isGenerating after completion', async () => {
      const portfolioData = { personalInfo: {}, skills: [], experiences: [] };
      const generator = new ResumeGenerator(portfolioData);

      // Check that isGenerating is false initially
      expect(generator.isGenerating).toBe(false);

      // Generate PDF
      await generator.generatePDF();

      // isGenerating should be false after completion
      expect(generator.isGenerating).toBe(false);
    });

    it('should throw error if jsPDF is not available', async () => {
      delete window.jspdf;
      
      const portfolioData = { personalInfo: {}, skills: [], experiences: [] };
      const generator = new ResumeGenerator(portfolioData);

      await expect(generator.generatePDF()).rejects.toThrow('jsPDF library not loaded');
      expect(generator.isGenerating).toBe(false);
    });

    it('should save PDF with correct filename', async () => {
      const portfolioData = { personalInfo: {}, skills: [], experiences: [] };
      const generator = new ResumeGenerator(portfolioData);

      await generator.generatePDF();

      // Get the mock instance
      const pdfInstance = mockJsPDF.mock.results[0].value;
      expect(pdfInstance.save).toHaveBeenCalledWith('resume.pdf');
    });
  });

  describe('formatPersonalInfo', () => {
    it('should format custom personal info', () => {
      const portfolioData = {
        personalInfo: {
          summary: 'Custom summary text'
        }
      };

      const generator = new ResumeGenerator(portfolioData);
      const formatted = generator.formatPersonalInfo();

      expect(formatted).toHaveLength(1);
      expect(formatted[0].type).toBe('text');
      expect(formatted[0].content).toBe('Custom summary text');
    });

    it('should use default summary if not provided', () => {
      const portfolioData = { personalInfo: {} };
      const generator = new ResumeGenerator(portfolioData);
      const formatted = generator.formatPersonalInfo();

      expect(formatted).toHaveLength(1);
      expect(formatted[0].type).toBe('text');
      expect(formatted[0].content).toContain('Passionate software developer');
    });
  });

  describe('formatSkills', () => {
    it('should format skills by category', () => {
      const portfolioData = {
        skills: [
          { title: 'Frontend', items: ['React', 'Vue.js', 'TypeScript'] },
          { title: 'Backend', items: ['Node.js', 'Python'] }
        ]
      };

      const generator = new ResumeGenerator(portfolioData);
      const formatted = generator.formatSkills();

      // Should have heading, text, and space for each category
      expect(formatted.length).toBeGreaterThan(0);
      
      const headings = formatted.filter(item => item.type === 'heading');
      expect(headings).toHaveLength(2);
      expect(headings[0].content).toBe('Frontend');
      expect(headings[1].content).toBe('Backend');

      const texts = formatted.filter(item => item.type === 'text');
      expect(texts[0].content).toContain('React');
      expect(texts[0].content).toContain('Vue.js');
    });

    it('should use default skills if not provided', () => {
      const portfolioData = {};
      const generator = new ResumeGenerator(portfolioData);
      const formatted = generator.formatSkills();

      expect(formatted.length).toBeGreaterThan(0);
      
      const headings = formatted.filter(item => item.type === 'heading');
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe('formatExperience', () => {
    it('should format work experience with projects', () => {
      const portfolioData = {
        experiences: [
          {
            title: 'Senior Developer',
            company: 'Tech Corp',
            period: '2020-2023',
            description: 'Led development team',
            projects: [
              {
                title: 'Project A',
                description: 'Built a web app'
              }
            ]
          }
        ]
      };

      const generator = new ResumeGenerator(portfolioData);
      const formatted = generator.formatExperience();

      expect(formatted.length).toBeGreaterThan(0);
      
      const headings = formatted.filter(item => item.type === 'heading');
      expect(headings[0].content).toContain('Senior Developer');
      expect(headings[0].content).toContain('Tech Corp');

      const subheadings = formatted.filter(item => item.type === 'subheading');
      expect(subheadings[0].content).toBe('2020-2023');

      const bullets = formatted.filter(item => item.type === 'bullet');
      expect(bullets).toHaveLength(1);
      expect(bullets[0].content).toContain('Project A');
    });

    it('should handle empty experiences array', () => {
      const portfolioData = { experiences: [] };
      const generator = new ResumeGenerator(portfolioData);
      const formatted = generator.formatExperience();

      expect(formatted).toEqual([]);
    });

    it('should format multiple experiences with spacing', () => {
      const portfolioData = {
        experiences: [
          {
            title: 'Job 1',
            company: 'Company 1',
            period: '2020-2021',
            description: 'Description 1',
            projects: []
          },
          {
            title: 'Job 2',
            company: 'Company 2',
            period: '2021-2023',
            description: 'Description 2',
            projects: []
          }
        ]
      };

      const generator = new ResumeGenerator(portfolioData);
      const formatted = generator.formatExperience();

      const spaces = formatted.filter(item => item.type === 'space' && item.amount === 5);
      expect(spaces).toHaveLength(1); // Space between experiences
    });
  });

  describe('addHeader', () => {
    it('should add header with name, title, and contact info', () => {
      const portfolioData = {
        personalInfo: {
          name: 'Jane Smith',
          title: 'Full Stack Developer',
          email: 'jane@example.com',
          github: 'github.com/jane',
          linkedin: 'linkedin.com/in/jane'
        }
      };

      const generator = new ResumeGenerator(portfolioData);
      const pdfInstance = new mockJsPDF();
      
      const yPosition = generator.addHeader(pdfInstance, 20, 20, 170);

      expect(pdfInstance.text).toHaveBeenCalled();
      expect(pdfInstance.line).toHaveBeenCalled();
      expect(yPosition).toBeGreaterThan(20);
    });
  });

  describe('addSection', () => {
    it('should add section with title and content', () => {
      const portfolioData = {};
      const generator = new ResumeGenerator(portfolioData);
      const pdfInstance = new mockJsPDF();
      
      const content = [
        { type: 'text', content: 'Sample text' },
        { type: 'heading', content: 'Sample heading' }
      ];

      const yPosition = generator.addSection(
        pdfInstance,
        'TEST SECTION',
        content,
        20,
        50,
        170,
        297
      );

      expect(pdfInstance.text).toHaveBeenCalled();
      expect(yPosition).toBeGreaterThan(50);
    });

    it('should handle page breaks for long content', () => {
      const portfolioData = {};
      const generator = new ResumeGenerator(portfolioData);
      const pdfInstance = new mockJsPDF();
      
      const content = [
        { type: 'text', content: 'Text 1' },
        { type: 'text', content: 'Text 2' }
      ];

      // Start near bottom of page
      const yPosition = generator.addSection(
        pdfInstance,
        'TEST SECTION',
        content,
        20,
        280,
        170,
        297
      );

      expect(pdfInstance.addPage).toHaveBeenCalled();
    });
  });
});
