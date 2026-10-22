import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CustomCursor from './components/CustomCursor';
import BackgroundCanvas from './components/BackgroundCanvas';
import RollingText from './components/RollingText';
import ProjectCard from './components/ProjectCard';
import FluidPaintCanvas from './components/FluidPaintCanvas';

import 'lenis/dist/lenis.css';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

// SVG Arrow matching 14islands' signature arrow
const ArrowIcon = () => (
  <svg
    viewBox="0 0 13 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMinYMid meet"
    className="Link_arrow"
  >
    <rect x="1" y="5" width="11" height="1" fill="currentColor"></rect>
    <path
      d="M6.93616 10.7958L11.5 5.5L6.93616 0.34082H8.24516L12.9202 5.55982L8.24516 10.7958H6.93616Z"
      fill="currentColor"
    ></path>
  </svg>
);

// High-resolution featured projects
const CASE_STUDIES = [
  {
    name: 'Exergy3',
    category: 'Clean Energy & Tech',
    image: '/projects/exergy3.png',
    url: 'https://www.exergy3.com/',
  },
  {
    name: 'Mojek Money',
    category: 'Fin Tech & AI',
    image: '/projects/mojek.png',
    url: 'https://www.mojek.money/',
  },
  {
    name: 'Elica',
    category: 'Design & Kitchen Innovation',
    image: '/projects/elica.png',
    url: 'https://www.elica.com/',
  },
  {
    name: 'Bathing Culture',
    category: 'Ecommerce & Lifestyle',
    image: '/projects/bathingculture.png',
    url: 'https://bathingculture.com/',
  },
  {
    name: 'Modify',
    category: 'Architecture & Construction',
    image: '/projects/modify.png',
    url: 'https://www.modify.com.au/',
  },
  {
    name: 'Ocelot Chocolate',
    category: 'Artisanal Ecommerce & Food',
    image: '/projects/ocelot.png',
    url: 'https://www.ocelotchocolate.com/',
  },
  {
    name: 'Lodg',
    category: 'Business & Tax Finance',
    image: '/projects/lodg.png',
    url: 'https://www.lodg.co.nz/',
  },
  {
    name: 'Fireball Finance',
    category: 'Personal Wealth & FinTech',
    image: '/projects/fireball.png',
    url: 'https://www.fireball.finance/',
  },
  {
    name: 'Plasfy',
    category: 'Design & Graphic Software',
    image: '/projects/plasfy.png',
    url: 'https://plasfy.com/',
  },
  {
    name: 'Core 1',
    category: 'eCommerce & Digital Studio',
    image: '/projects/core1.png',
    url: 'https://core1.co/',
  },
];

// Archive / Extended Selected Works
const ARCHIVE_PROJECTS = [
  { name: 'Exergy3', category: 'CleanTech & Thermal Storage', url: 'https://www.exergy3.com/' },
  { name: 'Mojek Money', category: 'FinTech & AI Tracker', url: 'https://www.mojek.money/' },
  { name: 'Elica Design', category: 'Smart Appliances & UX', url: 'https://www.elica.com/' },
  { name: 'Bathing Culture', category: 'Headless Commerce', url: 'https://bathingculture.com/' },
  { name: 'Modify Projects', category: 'Architectural Platform', url: 'https://www.modify.com.au/' },
  { name: 'Ocelot Studio', category: 'Luxury Brand Experience', url: 'https://www.ocelotchocolate.com/' },
  { name: 'Lodg Finance', category: 'SaaS Accounting Platform', url: 'https://www.lodg.co.nz/' },
  { name: 'Fireball Web3', category: 'Financial Independence Engine', url: 'https://www.fireball.finance/' },
  { name: 'Plasfy Suite', category: 'Cloud Graphic Design Suite', url: 'https://plasfy.com/' },
  { name: 'Core 1 Agency', category: 'eCommerce Engineering', url: 'https://core1.co/' },
  { name: 'Nexus AI Engine', category: 'Generative Interface & LLM', url: '#work' },
  { name: 'Hyperion Cloud', category: 'Enterprise Web Platform', url: '#work' },
];

const INTRO_CAROUSEL = [
  { row1: 'High-Performance Web', row2: 'engineered for modern scale' },
  { row1: 'Immersive Interfaces', row2: 'that elevate brand prestige' },
  { row1: 'Next-Gen Products', row2: 'from concept to production' },
];

export default function App() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroTitleRef = useRef(null);

  // Initialize Lenis buttery smooth inertial scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero headline entrance
      gsap.from('.HeroHeader_word, .HeroHeader_symbol', {
        y: 80,
        opacity: 0,
        stagger: 0.12,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.1,
      });

      // Paragraph fade-in
      gsap.from('.HeroHeader_taglineWrapper', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power3.out',
        delay: 0.35,
      });
    });

    return () => ctx.revert();
  }, []);

  // Cycle intro headline carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % INTRO_CAROUSEL.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className={`page page-index ${mobileMenuOpen ? 'menu-is-open' : ''}`}>
      {/* 1. Global Custom Fluid Cursor */}
      <CustomCursor />

      {/* 2. Three.js Interactive 3D WebGL Background Canvas */}
      <BackgroundCanvas />

      {/* 3. Header & Navigation */}
      <header className="MenuNavigation_header">
        <div className="Container_container">
          <div className="Header_inner">
            <a
              href="/"
              className="Desktop_logoLink"
              aria-label="Blazin Code Homepage"
              data-cursor="link"
              onClick={closeMobileMenu}
            >
              <span className="logo-badge">
                <span>BC</span>
                <span className="logo-badge-dot"></span>
              </span>
              <span className="logo-text">
                <RollingText text="blazincode" />
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="Desktop_nav">
              <ul className="Desktop_list">
                <li>
                  <a className="Desktop_link is-active" href="#work" data-cursor="link">
                    <RollingText text="WORK" />
                  </a>
                </li>
                <li>
                  <a className="Desktop_link" href="#services" data-cursor="link">
                    <RollingText text="SERVICES" />
                  </a>
                </li>
                <li>
                  <a className="Desktop_link" href="#culture" data-cursor="link">
                    <RollingText text="CULTURE" />
                  </a>
                </li>
                <li>
                  <a className="Desktop_link" href="#contact" data-cursor="link">
                    <RollingText text="CONTACT" />
                  </a>
                </li>
              </ul>
            </nav>

            {/* Mobile Hamburger Button */}
            <button
              className={`Mobile_menuToggle ${mobileMenuOpen ? 'is-active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span className="Mobile_toggleLine"></span>
              <span className="Mobile_toggleLine"></span>
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Overlay */}
        <div className={`Mobile_menuOverlay ${mobileMenuOpen ? 'is-open' : ''}`}>
          <div className="Mobile_menuContent">
            <ul className="Mobile_list">
              <li>
                <a href="#work" onClick={closeMobileMenu} className="Mobile_navLink">
                  <span>Work</span>
                  <ArrowIcon />
                </a>
              </li>
              <li>
                <a href="#services" onClick={closeMobileMenu} className="Mobile_navLink">
                  <span>Services</span>
                  <ArrowIcon />
                </a>
              </li>
              <li>
                <a href="#culture" onClick={closeMobileMenu} className="Mobile_navLink">
                  <span>Culture</span>
                  <ArrowIcon />
                </a>
              </li>
              <li>
                <a href="#contact" onClick={closeMobileMenu} className="Mobile_navLink">
                  <span>Contact</span>
                  <ArrowIcon />
                </a>
              </li>
            </ul>

            <div className="Mobile_menuFooter">
              <p className="Mobile_footerEmail">hello@blazincode.com</p>
              <p className="Mobile_footerCopyright">© 2026 Blazin Code</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main id="pageMain" className="Page_main">
        {/* 4. Hero Header: Clean 14islands Aesthetic (No paint canvas) */}
        <section className="HeroHeader_section">
          <div className="Container_container">
            {/* Tagline situated directly above the right-side word "Technology" */}
            <div className="HeroHeader_taglineWrapper">
              <div className="Grid_row">
                <div className="col-desktop-5"></div>
                <div className="col-4 col-desktop-7">
                  <div className="HeroHeader_taglineContent">
                    <p className="HeroHeader_taglineTitle">DIGITAL PRODUCT &amp; ENGINEERING STUDIO</p>
                    <p className="HeroHeader_taglineSub">WE CRAFT HIGH-PERFORMANCE WEB EXPERIENCES</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Giant Display Headline */}
            <div className="HeroHeader_headlineBlock" ref={heroTitleRef}>
              <div className="HeroHeader_firstRow">
                <h1 className="HeroHeader_word HeroHeader_designWord">
                  <RollingText text="Design" />
                </h1>
              </div>
              <div className="HeroHeader_secondRow">
                <div className="HeroHeader_symbolCol">
                  <span className="HeroHeader_symbol">&amp;</span>
                </div>
                <div className="HeroHeader_techCol">
                  <span className="HeroHeader_word HeroHeader_techWord">
                    <RollingText text="Technology" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Intro Block (Interactive Title Carousel) */}
        <section className="IntroBlock_section" id="services">
          <div className="Container_container">
            <div className="Grid_row">
              <div className="col-4 col-desktop-11 IntroBlock_title_container">
                <h2 className="Text_h3 IntroBlock_tagline">
                  <div>
                    <RollingText text={INTRO_CAROUSEL[carouselIndex].row1} />
                  </div>
                  <div>
                    <RollingText text={INTRO_CAROUSEL[carouselIndex].row2} />
                  </div>
                </h2>
              </div>
            </div>

            <div className="Grid_row" style={{ marginTop: '2.5rem' }}>
              <div className="col-desktop-6"></div>
              <div className="col-3 col-desktop-3 IntroBlock_descCol">
                <p className="Text_body_normal">
                  We partner with forward-thinking companies to transform complex requirements into sleek, category-leading digital solutions.
                </p>
                <a className="Link_link" href="#services" data-cursor="link">
                  <span className="Text_body">
                    <RollingText text="Services" />
                  </span>
                  <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Case Studies Grid (3D Interactive Tilt Cards) */}
        <section className="CaseStudiesGrid_section" id="work">
          <div className="Container_container">
            <div className="Grid_row">
              {CASE_STUDIES.map((project, idx) => (
                <div key={idx} className="col-4 col-desktop-6">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Case Studies Archive Table */}
        <section className="CaseStudiesList_section">
          <div className="Container_container">
            <div className="Grid_row">
              <div className="col-desktop-6"></div>
              <div className="col-4 col-desktop-6">
                <ul>
                  {ARCHIVE_PROJECTS.map((item, idx) => (
                    <li key={idx} className="CaseStudiesList_item">
                      <a
                        href={item.url || '#work'}
                        target={item.url && item.url !== '#work' ? '_blank' : undefined}
                        rel={item.url && item.url !== '#work' ? 'noopener noreferrer' : undefined}
                        className="CaseStudiesList_link"
                        data-cursor="link"
                      >
                        <h3 className="Text_h6 DashedLabel_labelWrapper">
                          <RollingText text={item.name} />
                          <span className="DashedLabel_suffixWrapper">
                            <span className="DashedLabel_dash"></span>
                            <span className="DashedLabel_suffix">{item.category}</span>
                          </span>
                        </h3>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Agency Statement / Culture */}
        <section className="TextBlockStandard_section" id="culture">
          <div className="Container_container">
            <div className="Grid_row">
              <div className="col-4 col-desktop-11">
                <p className="Text_h4 TextBlockStandard_quote">
                  <RollingText text="Blazin Code architects and builds" />{' '}
                  <span className="highlight-accent">
                    <RollingText text="high-conversion digital products, modern web apps," />
                  </span>{' '}
                  <span className="highlight-accent">
                    <RollingText text="and immersive brand platforms" />
                  </span>{' '}
                  — partnering with ambitious founders &amp; global brands.
                </p>
              </div>
            </div>

            <div className="Grid_row" style={{ marginTop: '3rem' }}>
              <div className="col-desktop-6"></div>
              <div className="col-3 col-desktop-3">
                <p className="Text_body_normal">
                  We blend high-end visual aesthetics, fluid 3D experiences, and rock-solid full-stack code to turn bold ideas into category-defining digital realities.
                </p>
                <a className="Link_link" href="#contact" data-cursor="link">
                  <span className="Text_body">
                    <RollingText text="Start a Project" />
                  </span>
                  <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 10. Footer with Fluid Rainbow Paint Effect */}
      <footer
        className="Footer_footer"
        id="contact"
        style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}
      >
        <FluidPaintCanvas />
        <div className="Container_container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="Footer_title">
            <p className="Text_h4">
              <RollingText text="Let’s make something" />
            </p>
            <p className="Text_h4">
              <RollingText text="great together" />
            </p>
          </div>

          <div className="Grid_row">
            <div className="col-desktop-6"></div>
            <div className="col-4 col-desktop-6">
              <a href="mailto:hello@blazincode.com" className="Footer_email" data-cursor="link">
                hello@blazincode.com
              </a>
            </div>
          </div>

          <div className="Footer_bottomBar">
            <div className="Grid_row">
              <div className="col-2 col-desktop-6">
                <span className="Footer_copyright">© 2026 Blazin Code</span>
              </div>
              <div className="col-2 col-desktop-6">
                <ul className="Footer_links">
                  <li>
                    <a className="Desktop_link" href="https://instagram.com" target="_blank" rel="noreferrer" data-cursor="link">
                      <RollingText text="Instagram" />
                    </a>
                  </li>
                  <li>
                    <a className="Desktop_link" href="https://twitter.com" target="_blank" rel="noreferrer" data-cursor="link">
                      <RollingText text="X / Twitter" />
                    </a>
                  </li>
                  <li>
                    <a className="Desktop_link" href="https://linkedin.com" target="_blank" rel="noreferrer" data-cursor="link">
                      <RollingText text="LinkedIn" />
                    </a>
                  </li>
                  <li>
                    <a className="Desktop_link" href="#privacy" data-cursor="link">
                      <RollingText text="Privacy" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
