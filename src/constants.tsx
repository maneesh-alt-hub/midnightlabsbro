
import * as React from 'react';
import { 
  MessageSquare, 
  Workflow, 
  Database, 
  Settings, 
  Zap, 
  Lightbulb 
} from 'lucide-react';
import { Service, Step, Stat, TeamMember, Project } from './types.ts';

export const SERVICES: Service[] = [
  {
    title: "Intelligent conversational agents",
    description: "Intelligent conversational agents designed to handle customer inquiries, support, and sales seamlessly around the clock.",
    icon: <MessageSquare size={32} />,
    iconColor: "bg-brand-secondary"
  },
  {
    title: "Workflow Automation",
    description: "Streamline repetitive tasks and connect disjointed systems to enhance operational efficiency and reduce manual errors.",
    icon: <Workflow size={32} />,
    iconColor: "bg-brand-primary"
  },
  {
    title: "Custom AI Models",
    description: "Custom web applications augmented with machine learning models to provide personalized, predictive user experiences.",
    icon: <Database size={32} />,
    iconColor: "bg-brand-secondary"
  },
  {
    title: "End-to-End Strategies",
    description: "End-to-end automation strategies that transform core business processes, driving scale and substantial cost savings.",
    icon: <Settings size={32} />,
    iconColor: "bg-brand-secondary"
  },
  {
    title: "Custom AI Integrations",
    description: "Seamlessly embed state-of-the-art AI capabilities into your existing software infrastructure and proprietary platforms.",
    icon: <Zap size={32} />,
    iconColor: "bg-brand-primary"
  },
  {
    title: "AI Consulting",
    description: "Strategic guidance to help organizations identify high-value AI opportunities and develop a robust implementation roadmap.",
    icon: <Lightbulb size={32} />,
    iconColor: "bg-brand-primary"
  }
];

export const STEPS: Step[] = [
  { id: "1", title: "DISCOVERY" },
  { id: "2", title: "DESIGN" },
  { id: "3", title: "BUILD" },
  { id: "4", title: "DEPLOY" }
];

export const STATS: Stat[] = [
  { label: "TEAM MEMBERS", value: "5+", color: "bg-brand-secondary text-white" },
  { label: "AUTOMATIONS BUILT", value: "10+", color: "bg-white text-brand-ink" },
  { label: "AI PRODUCTS", value: "3", color: "bg-brand-primary text-white" },
  { label: "CLIENT FOCUS", value: "100%", color: "bg-white text-brand-ink" }
];

export const TEAM: TeamMember[] = [
  { name: "Kruthik", role: "TEAM LEAD", desc: "Architects our most complex automation pipelines and machine learning models.", portfolio: "#" },
  { name: "Maneesh", role: "PRODUCT MANAGER", desc: "Ensures all client projects align perfectly with business goals and timelines.", portfolio: "#" },
  { name: "Rithika", role: "FULL STACK DEVELOPER", desc: "Builds the robust web applications that serve as the interface for our AI tools.", portfolio: "#" },
  { name: "Ritvika", role: "WORKFLOW SPECIALIST", desc: "Analyzes and optimizes business processes for maximum automation efficiency.", portfolio: "#" },
  { name: "Rishitha", role: "DATA SCIENTIST", desc: "Extracts actionable insights from data to train highly accurate predictive models.", portfolio: "#" }
];

export const PROJECTS: Project[] = [
  {
    title: "AI CUSTOMER PORTAL",
    category: "AI INTEGRATIONS",
    desc: "Unified automation portal for managing complex customer interactions and smart-routing support tickets.",
    icon: <Settings size={40} className="text-white" />,
    color: "bg-brand-primary"
  },
  {
    title: "WORKFLOW SYNC",
    category: "AUTOMATION",
    desc: "Architected custom cross-platform automation pipelines for legacy systems integration with modern SaaS tools.",
    icon: <Workflow size={40} className="text-white" />,
    color: "bg-brand-secondary"
  },
  {
    title: "NEXUS AGENT",
    category: "CONVERSATIONAL AI",
    desc: "Advanced LLM-driven conversational interface for lead generation with 24/7 autonomous operation.",
    icon: <MessageSquare size={40} className="text-white" />,
    color: "bg-brand-ink"
  },
  {
    title: "PREDICTIVE OPS",
    category: "DATA SCIENCE",
    desc: "Custom machine learning models for forecasting operational bottlenecks and inventory optimization.",
    icon: <Database size={40} className="text-white" />,
    color: "bg-brand-sand"
  }
];
