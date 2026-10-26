"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const navToggle = document.getElementById("navToggle");
    const nav = document.getElementById("nav");
    const closeNav = () => {
      nav?.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    };
    const toggleNav = () => {
      if (!nav || !navToggle) return;
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    };
    navToggle?.addEventListener("click", toggleNav);
    nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));

    const toolLabels = Array.from(document.querySelectorAll<HTMLButtonElement>(".tool-label"));
    const previewImg = document.getElementById("toolsPreviewImg") as HTMLImageElement | null;
    const showToolPreview = (label: HTMLButtonElement) => {
      if (!previewImg) return;
      const imageUrl = label.dataset.image;
      if (imageUrl) {
        previewImg.src = imageUrl;
        previewImg.alt = label.dataset.alt ?? "";
        previewImg.hidden = false;
      } else {
        previewImg.removeAttribute("src");
        previewImg.alt = "";
        previewImg.hidden = true;
      }
    };
    const toolClickHandlers = toolLabels.map((label) => {
      const handler = () => {
        const alreadyActive = label.classList.contains("active");
        toolLabels.forEach((item) => {
          item.classList.remove("active");
          item.setAttribute("aria-pressed", "false");
        });
        if (alreadyActive) {
          if (previewImg) {
            previewImg.removeAttribute("src");
            previewImg.alt = "";
            previewImg.hidden = true;
          }
          return;
        }
        label.classList.add("active");
        label.setAttribute("aria-pressed", "true");
        showToolPreview(label);
      };
      label.addEventListener("click", handler);
      return { label, handler };
    });
    const defaultLabel = document.querySelector<HTMLButtonElement>(".tool-label.active") ?? toolLabels[0];
    if (defaultLabel) showToolPreview(defaultLabel);

    const revealEls = document.querySelectorAll<HTMLElement>("[data-reveal]");
    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window && revealEls.length) {
      observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            currentObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach((element) => observer?.observe(element));
    } else {
      revealEls.forEach((element) => element.classList.add("in-view"));
    }

    return () => {
      navToggle?.removeEventListener("click", toggleNav);
      nav?.querySelectorAll("a").forEach((link) => link.removeEventListener("click", closeNav));
      toolClickHandlers.forEach(({ label, handler }) => label.removeEventListener("click", handler));
      observer?.disconnect();
    };
  }, []);

  return (
    <>
<div className="grain" aria-hidden="true"></div>

<header className="site-header">
  <a className="brand" href="#top">
    <span className="brand-seal">LJEDC</span>
    <span className="brand-name">Lorie Jean Estrera De Castro</span>
  </a>
  <nav className="nav" id="nav">
    <a href="#experience">Experience</a>
    <a href="#skills">Skills</a>
    <a href="#tools">Tools</a>
    <a href="#education">Education</a>
    <a href="#contact">Contact</a>
  </nav>
  <button className="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</header>

<main id="top">

  
  <section className="hero">
    <div className="hero-inner">
      <p className="eyebrow">Statement of Account — Professional Record</p>
      <h1>Lorie Jean Estrera De Castro</h1>
      <p className="hero-role">Tenant Relationship Manager &amp; Property Administration Professional</p>
      <p className="hero-lede">
        Ten years across leasing offices, front desks, and back-office ledgers in Cebu City and remote
        for Brisbane — keeping tenancies compliant, arrears current, and every file exactly where
        it should be. Licensed Professional Teacher by training, property administrator by trade.
      </p>
      <div className="hero-actions">
        <a className="btn btn-primary" href="#experience">View the experiences</a>
        <a className="btn btn-ghost" href="mailto:loriejeanestrera@gmail.com">Get in touch</a>
      </div>
    </div>
  </section>

  
  <section className="ledger-section" id="experience">
    <div className="section-head">
      <p className="eyebrow">Employment Experience</p>
      <h2>Every entry, accounted for</h2>
      <p className="section-lede">Four postings, one throughline: portfolios that run on time, records that hold up, and people who feel looked after.</p>
    </div>

    <div className="ledger">

      <article className="ledger-entry" data-reveal>
        <div className="ledger-period">
          <span className="ledger-dates">May 2026 — Present</span>
          <span className="ledger-tag ledger-tag-current">Current</span>
        </div>
        <div className="ledger-line" aria-hidden="true"><span className="ledger-node"></span></div>
        <div className="ledger-card">
          <h3>Tenant Relationship Manager</h3>
          <p className="ledger-company">Wingman Group Remote — Brisbane, Australia</p>
          <ul>
            <li>Primary point of contact across the portfolio, holding a 24-hour response time on a phone-first approach</li>
            <li>Ran the full tenancy lifecycle — leasing, renewals, and vacates — from first enquiry to final move-out</li>
            <li>Coordinated maintenance end-to-end, liaising with trades and preparing quotes for landlord sign-off</li>
            <li>Managed arrears, bonds, and invoice accuracy; handled insurance claims and QCAT dispute resolution alongside the Senior Property Manager</li>
            <li>Kept real-time, audit-ready records in PropertyMe against SOP requirements</li>
          </ul>
        </div>
      </article>

      <article className="ledger-entry" data-reveal>
        <div className="ledger-period">
          <span className="ledger-dates">Jun 2024 — Apr 2026</span>
        </div>
        <div className="ledger-line" aria-hidden="true"><span className="ledger-node"></span></div>
        <div className="ledger-card">
          <h3>Property Management &amp; Receptionist Assistant · Australian VA</h3>
          <p className="ledger-company">Smartsourcing Inc. — Cebu City</p>
          <ul>
            <li>Managed calendars, correspondence, and filing for an Australian property portfolio</li>
            <li>Processed commercial invoices — council rates, owners' corporation fees, insurance, water, and maintenance</li>
            <li>Documented property manager and support-team processes and procedures</li>
            <li>Handled bond claims through RTBA and maintained databases and reporting spreadsheets</li>
          </ul>
        </div>
      </article>

      <article className="ledger-entry" data-reveal>
        <div className="ledger-period">
          <span className="ledger-dates">Aug 2023 — Jun 2024</span>
        </div>
        <div className="ledger-line" aria-hidden="true"><span className="ledger-node"></span></div>
        <div className="ledger-card">
          <h3>Administrative Assistant</h3>
          <p className="ledger-company">World Navi Inc. — Banilad, Mandaue City, Cebu</p>
          <ul>
            <li>Owned daily time records, monthly financial reporting, and petty cash for the office</li>
            <li>Ran payroll and accounts payable, and handled online banking</li>
            <li>Rebuilt the filing system across hard and soft copies for faster retrieval</li>
            <li>Supported recruitment — screening calls and pre-interviews with applicants</li>
          </ul>
        </div>
      </article>

      <article className="ledger-entry" data-reveal>
        <div className="ledger-period">
          <span className="ledger-dates">Jan 2022 — Aug 2023</span>
        </div>
        <div className="ledger-line" aria-hidden="true"><span className="ledger-node"></span></div>
        <div className="ledger-card">
          <h3>Administrative Assistant</h3>
          <p className="ledger-company">Prosynergy Inc. — Cebu City</p>
          <ul>
            <li>Submitted monitoring reports and incident updates on tight timelines</li>
            <li>Coordinated with BIR, LTO, the Assessor's Office, and Registry of Deeds on assigned accounts</li>
            <li>Kept filing audit-ready for easy retrieval and cross-department collaboration</li>
            <li>Represented the company to clients and partners while resolving day-to-day issues</li>
          </ul>
        </div>
      </article>

    </div>
  </section>

  
  <section className="skills-section" id="skills">
    <div className="section-head">
      <p className="eyebrow">Working Knowledge</p>
      <h2>What she manages, daily</h2>
    </div>
    <div className="skills-grid">
      <span className="skill-chip">Tenant Relationship Management</span>
      <span className="skill-chip">Leasing &amp; Lease Renewals</span>
      <span className="skill-chip">Arrears &amp; Bond Management</span>
      <span className="skill-chip">Maintenance Coordination</span>
      <span className="skill-chip">Dispute Resolution (QCAT)</span>
      <span className="skill-chip">Customer Relations</span>
      <span className="skill-chip">Account Servicing</span>
      <span className="skill-chip">Payroll &amp; Budgeting</span>
      <span className="skill-chip">Administrative Support</span>
      <span className="skill-chip">Record Keeping</span>
      <span className="skill-chip">Time Management &amp; Prioritisation</span>
    </div>
  </section>

  
  <section className="tools-section" id="tools">
    <div className="section-head">
      <p className="eyebrow">Systems of Record</p>
      <h2>Tools on the desk</h2>
    </div>
    <div className="tools-panel">
      <div className="tools-list" role="list">
        <button type="button" className="tool-label active" data-image="/images/propertyme.webp" data-alt="PropertyMe trust accounting interface" data-mark="PM" aria-pressed="true">
          <span className="tool-mark-sm">PM</span>
          <span className="tool-label-copy">
            <span className="tool-label-name">PropertyMe</span>
            <span className="tool-description">Tenancy workflows, trust accounting, and arrears tracking.</span>
          </span>
        </button>
        <button type="button" className="tool-label" data-image="/images/ourproperty.webp" data-alt="OurProperty landlord desktop interface" data-mark="OP" aria-pressed="false">
          <span className="tool-mark-sm">OP</span>
          <span className="tool-label-copy">
            <span className="tool-label-name">OurProperty</span>
            <span className="tool-description">Property portfolio and landlord management platform.</span>
          </span>
        </button>
        <button type="button" className="tool-label" data-image="/images/rtba.webp" data-alt="RTBA bond summary interface" data-mark="RB" aria-pressed="false">
          <span className="tool-mark-sm">RB</span>
          <span className="tool-label-copy">
            <span className="tool-label-name">RTBA — rentalbonds.vic.gov.au</span>
            <span className="tool-description">Victorian portal for rental bond lodgements and claims.</span>
          </span>
        </button>
        <button type="button" className="tool-label" data-image="/images/powerbi.webp" data-alt="Power BI Sales and Marketing sample dashboard" data-mark="PBI" aria-pressed="false">
          <span className="tool-mark-sm">PBI</span>
          <span className="tool-label-copy">
            <span className="tool-label-name">Power BI</span>
            <span className="tool-description">Dashboards for exploring business metrics and trends.</span>
          </span>
        </button>
      </div>
      <div className="tools-preview" id="toolsPreview">
        <img className="tools-preview-img" id="toolsPreviewImg" src="/images/propertyme.webp" alt="PropertyMe trust accounting interface" loading="lazy" />
      </div>
    </div>
  </section>

  
  <section className="education-section" id="education">
    <div className="section-head">
      <p className="eyebrow">Credential on File</p>
      <h2>Education</h2>
    </div>
    <div className="education-card">
      <h3>Bachelor of Secondary Education, Major in Science</h3>
      <p className="education-school">Cebu Technological University — Main Campus</p>
      <p className="education-dates">August 2018 — May 2019</p>
    </div>
    <div className="education-card">
      <h3>Licensed Professional Teacher</h3>
      <p className="education-dates">2021</p>
    </div>
  </section>

  
  <section className="contact-section" id="contact">
    <div className="contact-inner">
      <p className="eyebrow">Close the File</p>
      <h2>Let's talk about your portfolio</h2>
      <p className="section-lede">Open to tenant relationship, property administration, and back-office roles — remote or Cebu-based.</p>
      <div className="contact-row">
        <a className="contact-link" href="mailto:loriejeanestrera@gmail.com">loriejeanestrera@gmail.com</a>
      </div>
      <p className="references-note">References available on request.</p>
    </div>
  </section>

</main>

<footer className="site-footer">
  <p>Lorie Jean Estrera De Castro · Licensed Professional Teacher (2021) &amp; Administrative Professional</p>
</footer>

    </>
  );
}
