import { PortfolioData } from "./types";

export const STORAGE_KEY = "portfolio_data";

export const DEFAULT_DATA: PortfolioData = {
  profile: {
    name: "Your Name",
    title: "Full Stack Developer & System Analyst",
    bio: "Passionate developer with experience building scalable web applications and analyzing complex business requirements.",
    avatarUrl: "",
    resumeUrl: "",
    social: {
      github: "",
      linkedin: "",
      email: "",
      twitter: "",
      website: "",
    },
  },

  landing: {
    displayName: "Your Name",
    tagline: "Building elegant solutions to complex problems.",
    ctaLinks: [
      { label: "View My Work", target: "projects" },
      { label: "About Me", target: "about" },
    ],
  },

  experiences: [
    {
      id: "exp-1",
      title: "System Analyst",
      company: "Bangkok Expressway and Metro Public Company Limited",
      startDate: "2025-10-01",
      endDate: "",
      color: "indigo",
      description:
        "Analyzing business requirements and designing technical solutions. Leading system architecture decisions and ensuring alignment with business objectives.",
    },
    {
      id: "exp-2",
      title: "System Analyst & Full Stack Developer",
      company: "Club 21 (Thailand) Co. Ltd.",
      startDate: "2022-07-01",
      endDate: "2025-08-31",
      color: "emerald",
      description:
        "Analyzed business requirements and developed full-stack solutions. Collaborated with stakeholders to deliver high-quality software products.",
    },
    {
      id: "exp-3",
      title: "Senior Programmer Support",
      company: "Club 21 (Thailand) Co. Ltd.",
      startDate: "2021-03-01",
      endDate: "2022-06-30",
      color: "gray",
      description:
        "Provided technical support and developed custom solutions for manufacturing operations. Maintained and enhanced existing systems.",
    },
  ],

  skills: [
    {
      id: "cat-1",
      category: "Frontend",
      color: "indigo",
      items: [
        { id: "skill-1-1", name: "HTML5/CSS3", proficiency: 90, years: 6 },
        { id: "skill-1-2", name: "JavaScript", proficiency: 82, years: 5 },
        { id: "skill-1-3", name: "React", proficiency: 70, years: 2 },
      ],
    },
    {
      id: "cat-2",
      category: "Backend",
      color: "emerald",
      items: [
        { id: "skill-2-1", name: "PHP", proficiency: 92, years: 6 },
        { id: "skill-2-2", name: "Laravel", proficiency: 95, years: 6 },
        { id: "skill-2-3", name: "REST API", proficiency: 90, years: 5 },
      ],
    },
  ],

  projects: [
    {
      id: "proj-1",
      title: "Real-Time Analytics Dashboard",
      description:
        "Built a real-time analytics dashboard for monitoring business metrics. Implemented WebSocket connections for live data updates.",
      tags: ["JavaScript", "PHP", "MySQL", "REST API"],
      link: "",
      imageUrl: "",
    },
    {
      id: "proj-2",
      title: "E-Commerce Platform",
      description:
        "Developed a custom e-commerce platform with product management, shopping cart, and payment integration.",
      tags: ["Shopify", "REST API", "PHP"],
      link: "",
      imageUrl: "",
    },
  ],

  contact: {
    email: "your.email@example.com",
    phone: "",
    location: "",
    social: {
      github: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    formEndpoint: "",
  },

  theme: "dark",
};
