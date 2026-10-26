"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
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
    if (!activeImage) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActiveImage(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      imageTriggerRef.current?.focus();
    };
  }, [activeImage]);

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
        <p className="hero-role">Construction Estimator &amp; Quantity Surveyor</p>
        <p className="hero-lede">
          Registered Civil Engineer based in Cebu City, focused on accurate takeoffs, clean BOQs, and
          pricing that holds up under scrutiny — across interior fit-outs and large commercial builds,
          using Cubit, PlanSwift, and CostX. Looking to take on more responsibility with an established
          estimating firm.
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
      <p className="section-lede">From a virtual internship pricing precast structures to running estimates for an Australian-owned firm — the throughline is accuracy you can build on.</p>
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
          <p className="ledger-company">TL Construction — Cebu City, Cebu</p>
          <ul>
            <li>Perform cost estimation across a range of construction projects, from interior fit-outs to full commercial building builds</li>
            <li>Work in industry-standard estimating software to produce accurate takeoffs and pricing</li>
            <li>Contribute to the growth of an Australian-owned estimating firm serving clients worldwide</li>
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
            <li>Completed a rotational internship within the Material Management department</li>
            <li>Collaborated on real-world projects under senior guidance</li>
            <li>Developed technical skills in engineering applications and effective team communication</li>
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
            <li>Estimated quantities and costs for precast structures</li>
          </ul>
        </div>
      </article>

    </div>
  </section>

  
  <section className="projects-section" id="projects">
    <div className="section-head">
      <p className="eyebrow">Dwg. A-03 &middot; Field File</p>
      <h2>Sample projects</h2>
      <p className="section-lede">Selected drawing sheets and quantity takeoff work.</p>
    </div>
    <div className="projects-grid">

      <article className="project-card project-card-featured blueprint-frame">
        <div className="project-gallery">
          <figure className="project-gallery-item">
            <button
              className="project-gallery-trigger"
              type="button"
              aria-label="View enlarged image: First floor finishes plan and reflected ceiling plan"
              onClick={(event) => {
                imageTriggerRef.current = event.currentTarget;
                setActiveImage({
                  src: "/projects/first-floor-finishes.webp",
                  alt: "First floor finishes plan and reflected ceiling plan with quantity takeoff legend",
                  caption: "First floor · finishes and reflected ceiling plan",
                  width: 876,
                  height: 698,
                });
              }}
            >
              <Image
                className="project-gallery-image"
                src="/projects/first-floor-finishes.webp"
                alt="First floor finishes plan and reflected ceiling plan with quantity takeoff legend"
                width={876}
                height={698}
              />
            </button>
            <figcaption>First floor · finishes and reflected ceiling plan</figcaption>
          </figure>
          <figure className="project-gallery-item">
            <button
              className="project-gallery-trigger"
              type="button"
              aria-label="View enlarged image: Ground floor finishes plan and reflected ceiling plan"
              onClick={(event) => {
                imageTriggerRef.current = event.currentTarget;
                setActiveImage({
                  src: "/projects/ground-floor-finishes.webp",
                  alt: "Ground floor finishes plan and reflected ceiling plan with quantity takeoff legend",
                  caption: "Ground floor · finishes and reflected ceiling plan",
                  width: 892,
                  height: 719,
                });
              }}
            >
              <Image
                className="project-gallery-image"
                src="/projects/ground-floor-finishes.webp"
                alt="Ground floor finishes plan and reflected ceiling plan with quantity takeoff legend"
                width={892}
                height={719}
              />
            </button>
            <figcaption>Ground floor · finishes and reflected ceiling plan</figcaption>
          </figure>
          <figure className="project-gallery-item">
            <button
              className="project-gallery-trigger"
              type="button"
              aria-label="View enlarged image: Architectural exterior elevations"
              onClick={(event) => {
                imageTriggerRef.current = event.currentTarget;
                setActiveImage({
                  src: "/projects/exterior-elevations.webp",
                  alt: "Architectural exterior elevations with cladding quantity takeoff legend",
                  caption: "Exterior elevations · cladding takeoff",
                  width: 1023,
                  height: 715,
                });
              }}
            >
              <Image
                className="project-gallery-image"
                src="/projects/exterior-elevations.webp"
                alt="Architectural exterior elevations with cladding quantity takeoff legend"
                width={1023}
                height={715}
              />
            </button>
            <figcaption>Exterior elevations · cladding takeoff</figcaption>
          </figure>
        </div>
        <div className="project-body">
          <h3>Floor Plans &amp; Elevations — Quantity Takeoff</h3>
          <p className="project-meta">Architectural drawings · Finishes, ceilings &amp; cladding</p>
          <p>Selected sheets showing floor finish and reflected ceiling plans alongside exterior elevations, each with measured quantities.</p>
        </div>
      </article>

      <article className="project-card blueprint-frame">
        <div className="project-thumb placeholder-thumb" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="1"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <path d="M21 15l-5-5L5 21"></path>
          </svg>
          <span>Image coming soon</span>
        </div>
        <div className="project-body">
          <h3>Commercial Building — Cost Estimation</h3>
          <p className="project-meta">Commercial build · Australia (remote)</p>
          <p>Full-building cost estimate prepared for an Australian client using industry-standard estimating software. Details and photos to be added.</p>
        </div>
      </article>

      <article className="project-card blueprint-frame">
        <div className="project-thumb placeholder-thumb" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="1"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <path d="M21 15l-5-5L5 21"></path>
          </svg>
          <span>Image coming soon</span>
        </div>
        <div className="project-body">
          <h3>Precast Structures — Estimation</h3>
          <p className="project-meta">Precast concrete · PICE eVISMA, Qatar</p>
          <p>Estimation of precast structural elements completed during a virtual internship. Details and photos to be added.</p>
        </div>
      </article>

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
      <span className="skill-chip">Civil, Structural &amp; Architectural Works</span>
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
      <p className="references-note">References available on request.</p>
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
      if (event.target === event.currentTarget) setActiveImage(null);
    }}
  >
    <div
      className="image-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-caption"
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          event.preventDefault();
          closeButtonRef.current?.focus();
        }
      }}
    >
      <button
        ref={closeButtonRef}
        className="image-modal-close"
        type="button"
        aria-label="Close enlarged image"
        onClick={() => setActiveImage(null)}
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <Image
        className="image-modal-image"
        src={activeImage.src}
        alt={activeImage.alt}
        width={activeImage.width}
        height={activeImage.height}
        sizes="(max-width: 900px) 96vw, 1100px"
      />
      <p className="image-modal-caption" id="image-modal-caption">{activeImage.caption}</p>
    </div>
  </div>
)}

    </>
  );
}
