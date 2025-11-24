import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EmailSignup from './components/EmailSignup';
import Feed from './components/Feed';
import SupportLinks from './components/SupportLinks';
import Admin from './components/Admin';
import { ADMIN } from './config';
import { initSEO } from './utils/seo';
import {ThemeToggle} from "./components/ThemeToggle.jsx";
import {Header} from "./components/Header.jsx";
import {Footer} from "./components/Footer.jsx";
import {Hosts} from "./components/Hosts.jsx";
import {Intro} from "./components/Intro.jsx";
import {NotFound} from "./components/NotFound.jsx";

// Initialize all SEO meta tags from config
initSEO();

function Layout({ children }) {
  return (
      <div className="min-h-screen flex flex-col">
          <a href="#main"
             className="absolute top-[-45px] left-0 focus:top-0 bg-midnight text-white p-2 z-50 no-underline transition-all">
              Skip to main content
          </a>

          <ThemeToggle />

          <Header />

          {/* Main Content */}
          <main className="flex-1 max-w-6xl mx-auto px-8 py-12 w-full max-sm:px-4 max-sm:py-8" id="main">
              {children}
          </main>

          {/* Footer - Midnight dark */}
          <Footer />
      </div>
  );
}

function HomePage() {
    return (
        <Layout>
            <Intro/>
            <Hosts/>
            <EmailSignup/>
            <SupportLinks/>
        </Layout>
    );
}

function FeedPage() {
    return (
        <Layout>
            <Feed/>
        </Layout>
    );
}

function NotFoundPage() {
    return (
        <Layout>
            <NotFound/>
        </Layout>
    );
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/episodes" element={<FeedPage/>}/>
            <Route path={ADMIN.path} element={<Admin/>}/>
            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    );
}
