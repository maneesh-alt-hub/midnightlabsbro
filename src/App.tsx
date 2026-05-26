
import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Workflow, 
  Database,
  ExternalLink,
  Users,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Sections
import { Navbar } from './components/sections/Navbar';
import { Hero } from './components/sections/Hero';
import { Services } from './components/sections/Services';
import { Process } from './components/sections/Process';
import { Stats } from './components/sections/Stats';
import { Team } from './components/sections/Team';
import { Projects } from './components/sections/Projects';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/sections/Footer';

// Utility Components
import { ChatBot } from './components/ChatBot';
import { CursorTrail } from './components/CursorTrail';
import { ScrollProgress } from './components/ScrollProgress';
import { BackToTop } from './components/BackToTop';
import { LoadingScreen } from './components/LoadingScreen';
import { LoginPage } from './pages/LoginPage.tsx';
import { SignupPage } from './pages/SignupPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { AdminProjectNew } from './pages/AdminProjectNew.tsx';
import { AdminClientNew } from './pages/AdminClientNew.tsx';
import { AdminProjectDetail } from './pages/AdminProjectDetail.tsx';
import { ClientDashboard } from './pages/ClientDashboard.tsx';
import { ClientProjectDetail } from './pages/ClientProjectDetail.tsx';

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen cursor-default selection:bg-brand-primary selection:text-white">
      <ScrollProgress />
      <CursorTrail />
      <BackToTop />
      <ChatBot />
      <AnimatePresence mode="wait">
        {!isLoaded && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <Navbar />
      
      <main>
        <Hero />
        <Services />
        <Process />
        <Stats />
        <Team />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  const path = window.location.pathname;
  const adminProjectMatch = path.match(/^\/admin\/projects\/([^/]+)$/);
  const clientProjectMatch = path.match(/^\/client\/projects\/([^/]+)$/);

  if (path === '/login') return <LoginPage />;
  if (path === '/signup') return <SignupPage />;
  if (path === '/admin/dashboard') return <AdminDashboard />;
  if (path === '/admin/clients/new') return <AdminClientNew />;
  if (path === '/admin/projects/new') return <AdminProjectNew />;
  if (path === '/client/dashboard') return <ClientDashboard />;
  if (adminProjectMatch) return <AdminProjectDetail id={adminProjectMatch[1]} />;
  if (clientProjectMatch) return <ClientProjectDetail id={clientProjectMatch[1]} />;

  return <LandingPage />;
}

