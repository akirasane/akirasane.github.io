// Root store shape — key: "portfolio_data"
export interface PortfolioData {
  profile:        Profile
  landing:        LandingContent
  experiences:    Experience[]
  skills:         SkillCategory[]
  projects:       Project[]
  certifications: Certification[]
  contact:        ContactInfo
}

export interface Profile {
  name:        string          // required
  title:       string          // required
  bio:         string
  avatarUrl:   string          // empty string → show placeholder
  resumeUrl:   string          // optional external PDF URL (fallback to generated)
  social: {
    github:    string          // empty string → omit link
    linkedin:  string
    email:     string
    twitter:   string
    website:   string
  }
}

export interface LandingContent {
  displayName:  string         // name shown in hero (may differ from profile.name)
  tagline:      string         // empty → use DEFAULT_TAGLINE
  ctaLinks: Array<{
    label:  string
    target: string             // section id, e.g. "about", "experience"
  }>
}

export interface Experience {
  id:          string          // uuid
  company:     string          // required
  title:       string          // required (job title)
  startDate:   string          // ISO date string, required
  endDate:     string          // ISO date string or "" → display "Present"
  description: string
  color:       string          // accent color name, e.g. "indigo", "emerald"
}

export interface SkillCategory {
  id:       string             // uuid
  category: string             // required
  color:    string             // accent color name
  items:    SkillItem[]
}

export interface SkillItem {
  id:          string          // uuid
  name:        string          // required
  proficiency: number          // 0–100, required
  years:       number
}

export interface Project {
  id:          string          // uuid
  title:       string          // required
  description: string          // required
  tags:        string[]        // technology tag strings
  link:        string          // optional project URL
  imageUrl:    string          // optional preview image
}

export interface Certification {
  id:            string        // uuid
  name:          string        // required, e.g. "AWS Certified Solutions Architect"
  issuer:        string        // required, e.g. "Amazon Web Services"
  issueDate:     string        // ISO date string, required
  expiryDate:    string        // ISO date string or "" → no expiry
  credentialUrl: string        // optional verification link
  imageUrl:      string        // optional badge/logo image
}

export interface ContactInfo {
  email:    string             // required, validated as email format
  phone:    string             // optional
  location: string             // optional
  social: {
    github:   string
    linkedin: string
    twitter:  string
    website:  string
  }
  formEndpoint: string         // external form service URL (e.g. formsubmit.co)
}
