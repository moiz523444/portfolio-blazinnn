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
    name: 'Cartier',
    category: 'Luxury',
    image:
      'https://cdn.sanity.io/images/f3tpxs09/production/3ab4221c9b8bf2904c911fbf6507bcdf82ea0485-3200x1880.png?rect=190,0,2820,1880&w=1200&h=800&q=90&fit=max&auto=format',
    url: '#',
  },
  {
    name: 'Cogent',
    category: 'AI Technologies',
    image:
      'https://cdn.sanity.io/images/f3tpxs09/production/aca0e8d24a985421935c6622e07dd76523ef48ed-3200x1880.png?rect=190,0,2820,1880&w=1200&h=800&q=90&fit=max&auto=format',
    url: '#',
  },
  {
    name: 'Multiply',
    category: 'Business Solutions',
    image:
      'https://cdn.sanity.io/images/f3tpxs09/production/854d4efc50e6d7e41d2ed0fd24105aed4a17e8a9-3200x1880.png?rect=190,0,2820,1880&w=1200&h=800&q=90&fit=max&auto=format',
    url: '#',
  },
  {
    name: 'Xtend Health',
    category: 'Health Tech',
    image:
      'https://cdn.sanity.io/images/f3tpxs09/production/f8233033c7cf7d09802b888ec3a23c89068146e7-3200x1880.png?rect=190,0,2820,1880&w=1200&h=800&q=90&fit=max&auto=format',
    url: '#',
  },
  {
    name: 'Metanova',
    category: 'Bio Tech',
    image:
      'https://cdn.sanity.io/images/f3tpxs09/production/53285e158ddd82c16477229a40a4286d303c460f-3200x1800.jpg?rect=250,0,2700,1800&w=1200&h=800&q=90&fit=max&auto=format',
    url: '#',
  },
  {
    name: 'Sweeply',
    category: 'Hospitality',
    image:
      'https://cdn.sanity.io/images/f3tpxs09/production/60f8722b4db600969c0e8625350320da50f28a09-3200x1880.png?rect=190,0,2820,1880&w=1200&h=800&q=90&fit=max&auto=format',
    url: '#',
  },
  {
    name: 'Breakthrough Energy',
    category: 'Sustainability',
    image:
      'https://cdn.sanity.io/images/f3tpxs09/production/a1784068a26d209be1ff8988346a6b42fe7af0f9-3200x1880.png?rect=190,0,2820,1880&w=1200&h=800&q=90&fit=max&auto=format',
    url: '#',
  },
  {
    name: 'Tally',
    category: 'Business Solutions',
    image:
      'https://cdn.sanity.io/images/f3tpxs09/production/2f97ee741ca8387c885bd9e0441ca701544874bb-1590x1058.png?rect=2,0,1587,1058&w=1200&h=800&q=90&fit=max&auto=format',
    url: '#',
  },
  {
    name: 'GOALS Game',
    category: 'Gaming',
    image:
      'https://cdn.sanity.io/images/f3tpxs09/production/a725236272721157a1e6cc6e6c176c8ffe14d2e2-3200x1880.png?rect=190,0,2820,1880&w=1200&h=800&q=90&fit=max&auto=format',
    url: '#',
  },
  {
    name: 'Google Interland',
    category: 'Education',
    image:
      'https://cdn.sanity.io/images/f3tpxs09/production/99c4e354db9d27f53c2ab55068573012694e71c4-1656x1104.jpg?w=1200&h=800&q=90&fit=max&auto=format',
    url: '#',
  },
];

// Archive Project List
const ARCHIVE_PROJECTS = [
  { name: 'Ankra', category: 'Business Solutions' },
  { name: 'JustFoodForDogs', category: 'Ecommerce' },
  { name: 'Oyyo', category: 'Ecommerce' },
  { name: 'Antler', category: 'Corporate Website' },
  { name: 'Galxe', category: 'Fin Tech' },
  { name: 'Myriad', category: 'Business Solutions' },
  { name: 'Pluto', category: 'AR, VR, XR Tech' },
  { name: 'Flipside', category: 'Fin Tech' },
  { name: 'Axolot', category: 'Gaming' },
  { name: 'Cyberhaven', category: 'Security Tech' },
  { name: 'Blobmixer', category: 'Creative Tech' },
  { name: 'Hatom', category: 'Fin Tech' },
];

const INTRO_CAROUSEL = [
  { row1: 'Intelligent Products', row2: 'from vision to launch' },
  { row1: 'Branded Experiences', row2: 'that grow your business' },
  { row1: 'Strategic Innovation', row2: 'to unlock opportunities' },
];

export default function App() {
  const [carouselIndex, setCarouselIndex] = useState(0);
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

      // Video reel entrance
      gsap.from('.FullscreenMedia_ratioWrapper', {
        scale: 0.96,
        opacity: 0,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.FullscreenMedia_section',
          start: 'top 85%',
        },
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

  return (
    <div className="page page-index">
      {/* 1. Global Custom Fluid Cursor */}
      <CustomCursor />

      {/* 2. Three.js Interactive 3D WebGL Background Canvas */}
      <BackgroundCanvas />

      {/* 3. Header & Navigation */}
      <header className="MenuNavigation_header">
        <div className="Container_container">
          <div className="Grid_row">
            <div className="col-2 col-desktop-5">
              <a
                href="/"
                className="Desktop_logoLink"
                aria-label="Blazin Code Homepage"
                data-cursor="link"
              >
                <RollingText text="blazincode" />
              </a>
            </div>
            <div className="col-2 col-desktop-7 Desktop_nav">
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
                  <a className="Desktop_link" href="#journal" data-cursor="link">
                    <RollingText text="JOURNAL" />
                  </a>
                </li>
                <li>
                  <a className="Desktop_link" href="#ai" data-cursor="link">
                    <RollingText text="AI" />
                  </a>
                </li>
                <li>
                  <a className="Desktop_link" href="#contact" data-cursor="link">
                    <RollingText text="CONTACT" />
                  </a>
                </li>
              </ul>
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
                    <p className="HeroHeader_taglineTitle">CREATIVE PARTNER</p>
                    <p className="HeroHeader_taglineSub">WE CRAFT DIGITAL PRODUCTS AND BRANDS</p>
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

        {/* 5. Fullscreen Media Video Reel */}
        <section className="FullscreenMedia_section">
          <div className="Container_container">
            <div
              className="FullscreenMedia_ratioWrapper"
              data-cursor="project"
              data-cursor-text="PLAY"
            >
              <video
                autoPlay
                playsInline
                muted
                loop
                crossOrigin="anonymous"
                src="https://cdn.sanity.io/files/f3tpxs09/production/f7c533514e697633ae912646f5b296ee600340a9.mp4"
              />
            </div>
          </div>
        </section>

        {/* 6. Intro Block (Interactive Title Carousel) */}
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
                  We work closely with our clients to connect business goals with user needs.
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
                      <a href="#work" className="CaseStudiesList_link" data-cursor="link">
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
                  <RollingText text="Blazin Code designs and builds" />{' '}
                  <span className="highlight-accent">
                    <RollingText text="digital products, brands," />
                  </span>{' '}
                  <span className="highlight-accent">
                    <RollingText text="and experiences" />
                  </span>{' '}
                  — with offices in Stockholm and Reykjavík.
                </p>
              </div>
            </div>

            <div className="Grid_row" style={{ marginTop: '3rem' }}>
              <div className="col-desktop-6"></div>
              <div className="col-3 col-desktop-3">
                <p className="Text_body_normal">
                  Our team fosters an inclusive spirit of craft, collaboration, and creativity.
                </p>
                <a className="Link_link" href="#culture" data-cursor="link">
                  <span className="Text_body">
                    <RollingText text="Culture" />
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
