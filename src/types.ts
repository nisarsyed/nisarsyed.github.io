export interface Job {
  company: string;
  location: string;
  role: string;
  period: string;
  details: string[];
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  link?: string;
  // New fields for Blueprint Mode
  features?: string[];
  architecture?: string;
}

export interface Education {
  institution: string;
  location: string;
  degree: string;
  date: string;
  gpa: string;
  awards: string;
  coursework: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
}

export interface ToastMessage {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}