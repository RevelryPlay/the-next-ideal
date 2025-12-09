import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import EmailSignup from './components/EmailSignup';
import Feed from './components/Feed';
import SupportLinks from './components/SupportLinks';
import Admin from './components/Admin';
import { ADMIN } from './config';
import { initSEO, updateSEO } from './utils/seo';
import {ThemeToggle} from "./components/ThemeToggle.jsx";
import {Header} from "./components/Header.jsx";
import {Footer} from "./components/Footer.jsx";
import {Hosts} from "./components/Hosts.jsx";
import {Intro} from "./components/Intro.jsx";
import {NotFound} from "./components/NotFound.jsx";
import {Resources} from "./components/Resources.jsx";

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
    useEffect(() => {
        updateSEO({
            title: 'Stormlight Self-Help',
            description: 'Real lessons from a fantasy world - we approach the Stormlight Archive as a therapy text, working our way through The Way of Kings by Brandon Sanderson, using modern psychology theories and practices to help you find your Next Ideal.',
            path: '/',
        });
    }, []);

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
    useEffect(() => {
        updateSEO({
            title: 'Episodes',
            description: 'Browse all episodes of The Next Ideal podcast. Journey through The Way of Kings chapter by chapter, exploring mental health themes, psychological insights, and the wisdom of the Radiant Ideals.',
            path: '/episodes',
            keywords: 'stormlight archive podcast, way of kings episodes, brandon sanderson podcast, mental health podcast, fantasy therapy',
        });
    }, []);

    return (
        <Layout>
            <Feed/>
        </Layout>
    );
}

function ResourcesPage() {
    useEffect(() => {
        updateSEO({
            title: 'Mental Health Resources',
            description: 'Recommended mental health resources for Radiants. Learn about the Next Step Coin, find geek-focused counseling through NerdHQ, and discover 24/7 virtual mental health support from TimelyCare. Journey before destination.',
            path: '/resources',
            keywords: 'mental health resources, next step coin, nerdhq, timelycare, stormlight mental health, radiant support',
        });
    }, []);

    return (
        <Layout>
            <Resources/>
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
            <Route path="/resources" element={<ResourcesPage/>}/>
            <Route path={ADMIN.path} element={<Admin/>}/>
            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    );
}
