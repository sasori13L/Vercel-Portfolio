"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import projects from "./projects.json";

function ProjectGallery({ project, onImageOpen }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const image = project.images[activeIndex];
  const imageCount = project.images.length;
  const moveImage = (offset) => {
    setActiveIndex((current) => (current + offset + imageCount) % imageCount);
  };

  return (
    <div className="project-gallery" role="group" aria-label={`${project.title} image gallery`}>
      <figure className="project-slide">
        <button
          className="project-gallery-trigger"
          type="button"
          aria-label={`View enlarged image: ${image.caption}`}
          onClick={(event) => onImageOpen(event.currentTarget, project.images, activeIndex)}
        >
          <Image
            className="project-gallery-image"
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(max-width: 820px) 100vw, 60vw"
          />
        </button>
        <figcaption>{image.caption}</figcaption>
      </figure>
      <div className="project-slider-controls">
        <button
          className="project-slider-button"
          type="button"
          aria-label={`Previous image in ${project.title}`}
          onClick={() => moveImage(-1)}
        >
          <span aria-hidden="true">←</span>
        </button>
        <span className="project-slider-count" aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")} / {String(imageCount).padStart(2, "0")}
        </span>
        <button
          className="project-slider-button"
          type="button"
          aria-label={`Next image in ${project.title}`}
          onClick={() => moveImage(1)}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeGallery, setActiveGallery] = useState(null);
  const activeImage = activeGallery?.images[activeGallery.index] ?? null;
  const modalOpen = activeGallery !== null;
  const imageTriggerRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    revealElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActiveGallery(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      imageTriggerRef.current?.focus();
    };
  }, [modalOpen]);

  const moveModalImage = (offset) => {
    setActiveGallery((current) => {
      if (!current) return current;
      const count = current.images.length;
      return { ...current, index: (current.index + offset + count) % count };
    });
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
<header className="site-header">
  <a className="brand" href="#top">
    <span className="brand-seal">LCQ</span>
    <span className="brand-name">Lyla&nbsp;Chairein&nbsp;Quintana</span>
  </a>
  <nav className={`nav${menuOpen ? " open" : ""}`}>
    <a href="#experience" onClick={closeMenu}>Site&nbsp;Log</a>
    <a href="#projects" onClick={closeMenu}>Projects</a>
    <a href="#skills" onClick={closeMenu}>Skills</a>
    <a href="#tools" onClick={closeMenu}>Software</a>
    <a href="#education" onClick={closeMenu}>Credentials</a>
    <a href="#contact" onClick={closeMenu}>Contact</a>
  </nav>
  <button
    className="nav-toggle"
    aria-label="Toggle menu"
    aria-expanded={menuOpen}
    onClick={() => setMenuOpen((open) => !open)}
  >
    <span></span><span></span><span></span>
  </button>
</header>

<main id="top">

  
  <section className="hero">
    <div className="hero-grid">
      <div className="hero-inner">
        <p className="eyebrow">Dwg. A-01 &middot; Cover Sheet</p>
        <h1>Lyla&nbsp;Chairein&nbsp;Quintana</h1>
        <p className="hero-role">Pre-construction Estimator &amp; Quantity Surveyor</p>
        <p className="hero-lede">
          Detail-driven Registered Civil Engineer in Cebu City, experienced in reading drawings,
          scoping projects, and preparing accurate takeoffs and BOQs for interior fit-outs through large
          commercial builds. Experienced with Cubit, PlanSwift, CostX, and AutoCAD, and ready to take on
          greater responsibility in pre-construction.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#experience">View the site log</a>
          <a className="btn btn-ghost" href="mailto:quintanalyla@gmail.com">Get in touch</a>
        </div>
      </div>
      <div className="hero-stamp" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="stamp-svg">
          <rect x="14" y="46" width="172" height="108" className="stamp-outer"></rect>
          <rect x="22" y="54" width="156" height="92" className="stamp-inner"></rect>
          <text x="100" y="72" className="stamp-small">Civil Engineer &middot; Q.S.</text>
          <text x="100" y="108" className="stamp-big">CERTIFIED</text>
          <text x="100" y="128" className="stamp-tiny">ESTIMATE — FOR TENDER</text>
          <text x="100" y="142" className="stamp-tiny">RCE NO. 2025 &middot; CEBU CITY, PH</text>
        </svg>
      </div>
    </div>
  </section>

  
  <section className="ledger-section" id="experience">
    <div className="section-head">
      <p className="eyebrow">Dwg. A-02 &middot; Site Log</p>
      <h2>Every entry, accounted for</h2>
      <p className="section-lede">Tender documentation, scope reviews, quantity takeoffs, and BOQs across single-trade and multi-disciplinary construction packages.</p>
    </div>

    <div className="ledger">

      <article className="ledger-entry" data-reveal>
        <div className="ledger-period">
          <span className="ledger-dates">Apr 2025 — Present</span>
          <span className="ledger-tag ledger-tag-current">Current</span>
        </div>
        <div className="ledger-line" aria-hidden="true"><span className="ledger-node"></span></div>
        <div className="ledger-card blueprint-frame">
          <h3>Construction Estimator / Quantity Surveyor</h3>
          <p className="ledger-company">Costimate — Remote · Cebu City, Cebu</p>
          <ul>
            <li>Deliver detailed takeoffs and BOQs for single-trade packages including partitions, ceilings, doors, painting, carpentry, tiling, roofing, and structural work</li>
            <li>Prepare full BOQs for architectural, structural, civil, and landscaping packages</li>
            <li>Review drawings, specifications, material schedules, reports, and tender documents to define scope</li>
            <li>Raise RFIs to resolve tender-stage gaps, and clarify inclusions, exclusions, and allowances with clients</li>
            <li>Update BOQs for addenda and scope changes; support lead estimators in completing coordinated estimates to tight deadlines</li>
          </ul>
        </div>
      </article>

      <article className="ledger-entry" data-reveal>
        <div className="ledger-period">
          <span className="ledger-dates">Feb 2025 — Apr 2025</span>
        </div>
        <div className="ledger-line" aria-hidden="true"><span className="ledger-node"></span></div>
        <div className="ledger-card blueprint-frame">
          <h3>Intern Solution Engineer</h3>
          <p className="ledger-company">TecSurge — Cebu Business Park</p>
          <ul>
            <li>Managed piping specification and catalog data for real-world projects under project leads</li>
            <li>Provided system support and quality checks for data entries</li>
            <li>Maintained clear communication with the project team</li>
          </ul>
        </div>
      </article>

      <article className="ledger-entry" data-reveal>
        <div className="ledger-period">
          <span className="ledger-dates">Virtual Internship</span>
        </div>
        <div className="ledger-line" aria-hidden="true"><span className="ledger-node"></span></div>
        <div className="ledger-card blueprint-frame">
          <h3>Civil Engineer Intern</h3>
          <p className="ledger-company">PICE eVISMA — PICE Qatar</p>
          <ul>
            <li>Estimated precast structures and used AutoCAD for design work</li>
          </ul>
        </div>
      </article>

    </div>
  </section>

  
  <section className="projects-section" id="projects">
    <div className="section-head">
      <p className="eyebrow">Dwg. A-03 &middot; Field File</p>
      <h2>Selected projects</h2>
      <p className="section-lede">Cost planning, quantity takeoffs and drawing sets across public, education and commercial projects.</p>
    </div>
    <div className="projects-grid">
      {projects.map((project) => (
        <article className="project-card blueprint-frame" key={project.id}>
          <ProjectGallery
            project={project}
            onImageOpen={(trigger, images, index) => {
              imageTriggerRef.current = trigger;
              setActiveGallery({ images, index });
            }}
          />
          <div className="project-body">
            <h3>{project.title}</h3>
            <p className="project-meta">{project.meta}</p>
            <p>{project.description}</p>
          </div>
        </article>
      ))}
    </div>
  </section>

  <section className="skills-section" id="skills">
    <div className="section-head">
      <p className="eyebrow">Dwg. A-04 &middot; Specification</p>
      <h2>What she manages, daily</h2>
    </div>
    <div className="skills-grid">
      <span className="skill-chip">Quantity Takeoff &amp; Measurement</span>
      <span className="skill-chip">Cost Estimation</span>
      <span className="skill-chip">BOQ Preparation</span>
      <span className="skill-chip">Construction Drawing Interpretation</span>
      <span className="skill-chip">Civil, Structural, Architectural &amp; Landscaping Works</span>
      <span className="skill-chip">Attention to Detail &amp; Accuracy</span>
      <span className="skill-chip">Team Collaboration</span>
      <span className="skill-chip">Time Management &amp; Deadlines</span>
    </div>
  </section>

  <section className="tools-section" id="tools">
    <div className="section-head">
      <p className="eyebrow">Dwg. A-05 &middot; Instrument Panel</p>
      <h2>Software on the desk</h2>
    </div>
    <div className="tools-grid">
      <div className="tool-card blueprint-frame"><Image className="tool-logo" src="/images/cubit-estimating.svg" alt="Cubit Estimating logo" width={459} height={59} /><span className="tool-name">Cubit Estimating</span><p className="tool-description">Quantity takeoff and construction cost estimating.</p></div>
      <div className="tool-card blueprint-frame"><Image className="tool-logo" src="/images/planswift.webp" alt="PlanSwift logo" width={1496} height={301} /><span className="tool-name">PlanSwift</span><p className="tool-description">Digital takeoff and estimating from project plans.</p></div>
      <div className="tool-card blueprint-frame"><Image className="tool-logo tool-logo-costx" src="/images/costx-logo.jpg" alt="RIB CostX logo" width={1920} height={1080} /><span className="tool-name">CostX</span><p className="tool-description">2D and BIM takeoff with cost estimating.</p></div>
      <div className="tool-card blueprint-frame"><span className="tool-mark" aria-hidden="true">CAD</span><span className="tool-name">AutoCAD</span><p className="tool-description">Design work during civil engineering internship.</p></div>
    </div>
  </section>

  
  <section className="education-section" id="education">
    <div className="section-head">
      <p className="eyebrow">Dwg. A-06 &middot; On File</p>
      <h2>Education &amp; License</h2>
    </div>
    <div className="credentials-grid">
      <div className="education-card blueprint-frame">
        <h3>Bachelor of Science in Civil Engineering</h3>
        <p className="education-school">Construction Management · Cebu Technological University — Main Campus</p>
        <p className="education-dates">August 2019 — August 2023</p>
      </div>
      <div className="education-card blueprint-frame credential-license">
        <h3>Registered Civil Engineer</h3>
        <p className="education-school">Professional Regulation Commission</p>
        <p className="education-dates">February 2025</p>
      </div>
    </div>
  </section>

  
  <section className="contact-section" id="contact">
    <div className="contact-inner">
      <p className="eyebrow">Dwg. A-07 &middot; Transmittal</p>
      <h2>Let's talk about your next estimate</h2>
      <p className="section-lede">Open to construction estimating and quantity surveying roles — Cebu-based or remote.</p>
      <div className="contact-row">
        <a className="contact-link" href="mailto:quintanalyla@gmail.com">quintanalyla@gmail.com</a>
        <span className="contact-link" style={{ borderBottom: "none" }}>Cebu City, Philippines</span>
      </div>
    </div>
  </section>

</main>

<footer className="site-footer">
  <svg viewBox="0 0 160 20" className="scale-bar" aria-hidden="true">
    <line x1="2" y1="10" x2="158" y2="10" stroke="#93A9BC" strokeWidth="1"/>
    <rect x="2" y="7" width="20" height="6" fill="#93A9BC"/>
    <rect x="42" y="7" width="20" height="6" fill="#93A9BC"/>
    <rect x="82" y="7" width="20" height="6" fill="#93A9BC"/>
    <rect x="122" y="7" width="20" height="6" fill="#93A9BC"/>
    <text x="2" y="19" fontFamily="IBM Plex Mono" fontSize="6" fill="#93A9BC">0</text>
    <text x="118" y="19" fontFamily="IBM Plex Mono" fontSize="6" fill="#93A9BC">SCALE NTS</text>
  </svg>
  <p>Lyla Chairein Quintana · Registered Civil Engineer &amp; Construction Estimator</p>
</footer>

{activeImage && (
  <div
    className="image-modal-backdrop"
    onClick={(event) => {
      if (event.target === event.currentTarget) setActiveGallery(null);
    }}
  >
    <div
      className="image-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-caption"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          moveModalImage(event.key === "ArrowRight" ? 1 : -1);
        }
        if (event.key === "Tab") {
          const buttons = event.currentTarget.querySelectorAll("button:not([disabled])");
          const firstButton = buttons[0];
          const lastButton = buttons[buttons.length - 1];
          if (event.shiftKey && document.activeElement === firstButton) {
            event.preventDefault();
            lastButton?.focus();
          } else if (!event.shiftKey && document.activeElement === lastButton) {
            event.preventDefault();
            firstButton?.focus();
          }
        }
      }}
    >
      <button
        ref={closeButtonRef}
        className="image-modal-close"
        type="button"
        aria-label="Close enlarged image"
        onClick={() => setActiveGallery(null)}
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <div className="image-modal-viewer">
        <button
          className="image-modal-nav image-modal-nav-previous"
          type="button"
          aria-label="View previous image"
          onClick={() => moveModalImage(-1)}
        >
          <span aria-hidden="true">←</span>
        </button>
        <Image
          className="image-modal-image"
          src={activeImage.src}
          alt={activeImage.alt}
          width={activeImage.width}
          height={activeImage.height}
          sizes="(max-width: 900px) 96vw, 1100px"
        />
        <button
          className="image-modal-nav image-modal-nav-next"
          type="button"
          aria-label="View next image"
          onClick={() => moveModalImage(1)}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className="image-modal-footer">
        <p className="image-modal-caption" id="image-modal-caption">{activeImage.caption}</p>
        <span className="image-modal-count" aria-live="polite">
          {String(activeGallery.index + 1).padStart(2, "0")} / {String(activeGallery.images.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  </div>
)}

    </>
  );
}
