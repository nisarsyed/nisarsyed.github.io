import { Job, Project, Education, SkillCategory } from './types';

export const PERSONAL_INFO = {
  name: "Syed Nisar Hussain",
  role: "Backend Developer II & ML Engineer",
  location: "Karachi, PK",
  email: "nisarsyed510@gmail.com",
  phone: "(92) 333 4058268",
  linkedin: "linkedin.com/in/snh510/",
  github: "github.com/NisarSyed",
  bio: "Architecting reliable event-driven systems and optimizing backend pipelines. Passionate about bridging the gap between scalable software engineering and machine learning intelligence."
};

export const EXPERIENCE: Job[] = [
  {
    company: "Future Technologies",
    location: "Karachi, PK",
    role: "Backend Developer II",
    period: "July 2024 - Present",
    details: [
      "Architecting a Kafka-based event-driven system with pub/sub and the outbox pattern, ensuring reliable microservice synchronization.",
      "Optimized end-to-end testing pipelines with pytest, reducing execution time by 70% (30s → ~7s) and enabling faster iteration cycles."
    ]
  },
  {
    company: "Sych",
    location: "Karachi, PK",
    role: "Software Development Engineer",
    period: "Feb 2025 - June 2025",
    details: [
      "Built and optimized scalable pages in a Next.js AI app using TypeScript, following clean architecture principles.",
      "Extended FastAPI backend with new features and endpoints to support evolving frontend requirements.",
      "Maintained 95%+ test coverage using Jest and Playwright for robust unit and end-to-end testing."
    ]
  },
  {
    company: "Systems Limited",
    location: "Karachi, PK",
    role: "ML Intern",
    period: "June 2024 - Sept 2024",
    details: [
      "Developed a Python script to automate data extraction and tokenization from large log file datasets.",
      "Trained and containerized a K-Means clustering model (using Podman) to classify log data.",
      "Leveraged the ELK stack and Elastic ML to analyze live service data, enhancing real-time monitoring."
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    name: "HireHub",
    description: "Recruitment platform featuring an LLM-based resume ranking and analysis system using LlamaIndex and OpenAI.",
    techStack: ["Next.js", "FastAPI", "Docker", "Google Cloud Run", "CI/CD"],
    features: [
        "LLM Resume Parsing & Ranking",
        "Automated CI/CD Pipeline via GCR",
        "Clean Architecture Implementation",
        "Real-time Candidate Status Tracking"
    ],
    architecture: "Microservices (FastAPI) <-> Next.js Frontend. Data persistence via PostgreSQL. AI processing via LlamaIndex + OpenAI API."
  },
  {
    name: "Financial Fraud Detection",
    description: "Data app identifying financial fraud using graph features extracted from a Neo4j database and Random Forest classification.",
    techStack: ["Python", "Neo4j", "Streamlit", "GraphDataScience", "Scikit-learn"],
    features: [
        "Graph-based Feature Extraction",
        "Random Forest Classification Model",
        "Interactive Streamlit Dashboard",
        "Cypher Query Optimization"
    ],
    architecture: "Neo4j Graph DB -> GraphDataScience Lib -> Random Forest Model -> Streamlit UI Visualization."
  },
  {
    name: "Welfare Society CMS",
    description: "Responsive website and admin panel for a social welfare society with Cloudinary image handling.",
    techStack: ["MERN Stack", "Cloudinary", "Vercel", "Render"],
    features: [
        "Custom Content Management System",
        "Role-based Admin Panel",
        "Cloudinary Media Optimization",
        "Secure Donation Gateway Integration"
    ],
    architecture: "MongoDB Atlas <-> Express/Node API <-> React Frontend. Static Assets via Cloudinary CDN."
  }
];

export const EDUCATION: Education = {
  institution: "Habib University",
  location: "Karachi",
  degree: "B.S. in Computer Science",
  date: "May 2025",
  gpa: "3.60/4.00",
  awards: "YOHSIN Scholar (100% Merit Scholarship), Dean's List - Fall 2023",
  coursework: "OOP, Data Structures, Algorithms, Database Systems, OS, Data Science, WebDev"
};

export const SKILLS: SkillCategory[] = [
  {
    category: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "SQL", "HTML/CSS"]
  },
  {
    category: "Frameworks & Backend",
    items: ["FastAPI", "Express.js", "Next.js", "SQLAlchemy", "Apache Kafka", "Pub/Sub"]
  },
  {
    category: "ML & Data",
    items: ["PyTorch", "TensorFlow", "Hugging Face", "LlamaIndex", "PostgreSQL", "MongoDB"]
  },
  {
    category: "DevOps & Tools",
    items: ["Docker", "Git", "Google Cloud", "pytest", "Jest", "Playwright"]
  }
];

export const CERTIFICATIONS = [
  "Machine Learning Specialization – Stanford Online, Coursera",
  "Open-Source Models with Hugging Face – DeepLearning.AI"
];