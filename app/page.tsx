"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import iconData from "../icons-data";
import styles from "./page.module.css";

const experiences = [
  { role: "AI Agentic Full Stack Developer", org: "Forty Degrees Celsius Inc.", place: "Cebu City, Philippines", dates: "Jan 2026 — Oct 2026", points: ["Designed and tested prompts and LLM orchestration for production features using OpenAI, Anthropic, and Gemini APIs; built the integration layer with structured outputs, error handling, and provider fallbacks.", "Used Claude Code and Cursor with GitHub Speckit to turn requirements into implementation and tests, assisting with refactoring and debugging while reviewing every generated change before merge."] },
  { role: "Full Stack Web Developer", org: "Forty Degrees Celsius Inc.", place: "Cebu City, Philippines", dates: "Sep 2024 — Oct 2026", points: ["Contributed to a team-led, AI-assisted migration of a large CakePHP 2 codebase to Laravel 12, converting modules, models, and business logic while preserving existing behavior.", "Led architecture and delivery of an applicant tracking system using Vue.js, Tailwind CSS, and CakePHP.", "Built end-to-end Playwright coverage, improving release confidence and reducing regressions; maintained and refactored the existing CakePHP and Vue.js codebase.", "Modernized legacy Angular and Vue.js interfaces by migrating them to Next.js, delivered pixel-accurate pages from Figma, and implemented technical SEO with XML sitemaps, canonical tags, and robots.txt."] },
  { role: "Freelance Full-Stack Developer", org: "TheoAppSolutions", place: "Remote", dates: "2024 — Present", current: true, points: ["Run TheoAppSolutions as my own branded freelancing company, delivering focused web and systems work for clients.", "Modernized two school grading platforms, upgrading Laravel 6 to Laravel 12 and re-architecting the frontend as headless Next.js.", "Built a Laravel booking system for an Airbnb-style property, allowing guests to check room availability.", "Developed an RSVP website with Next.js, Supabase, and Vercel, covering the guest-facing experience and the hosted application workflow."] },
  { role: "Lead Full-Stack System Developer", org: "Theomeds Marketing", place: "Tacloban City, Philippines", dates: "Oct 2019 — Jul 2024", points: ["Designed and built a Laravel + FilamentPHP inventory and cash flow system from scratch.", "Migrated spreadsheet-based approval workflows into Power Apps and Power Automate.", "Built an offline-first Flutter app for field reps with automatic reconciliation once back online.", "Deployed and maintained applications on a Hostinger Linux VPS, mentoring junior developers through code review."] },
  { role: "Front-End Web Developer", org: "Online Freelance Web Design", place: "Remote", dates: "Aug 2017 — Sep 2019", points: ["Delivered e-commerce front-end work across WordPress, Shopify, and WooCommerce.", "Converted Figma, Zeplin, and Photoshop files into pixel-accurate responsive pages."] },
  { role: "Full-Stack System Developer", org: "Highlands Christian Grammar School", place: "Remote", dates: "Jan 2017 — Sep 2019", points: ["Built a Laravel grading system covering grade computation, report cards, and multi-role access.", "Provided ongoing remote support during grading periods."] },
  { role: "Full-Stack System Developer", org: "Bethel International School", place: "Palo, Philippines", dates: "Jun 2015 — Dec 2016", points: ["Designed and built a Laravel-based grading and school management system, replacing a fully paper-based process.", "Handled grade computation, report generation, and role-based access from architecture through launch."] },
];

const stacks = {
  Backend: ["PHP", "Laravel", "CakePHP", "FilamentPHP", "Livewire 3", "CodeIgniter", "Node.js"],
  Frontend: ["React", "Next.js", "Vue.js", "JavaScript", "TypeScript", "Pinia", "jQuery", "Alpine.js"],
  "CSS / UI": ["HTML", "CSS", "Tailwind CSS", "Bootstrap", "Sass", "Figma", "Zeplin"],
  Data: ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "Supabase"],
  "Testing / Methodology": ["Playwright E2E", "PHPUnit", "Codeception", "Test-Driven Development", "Spec-Driven Development", "GitHub Speckit"],
  "DevOps / CI": ["Docker", "Jenkins", "Git", "GitHub", "GitHub PR Agent", "Bitbucket", "Jira", "SSH / CLI"],
  Mobile: ["Dart", "Flutter", "Flutter Flow"],
  "AI / LLM": ["Prompt Engineering", "Prompt Evaluation & Testing", "LLM Orchestration", "OpenAI API", "Anthropic API", "Gemini", "Claude Code", "Cursor", "GitHub Copilot", "Codex"],
  Platform: ["WordPress", "Shopify", "WooCommerce", "Vercel", "Hostinger", "Power Apps", "Power Automate", "Power BI", "SharePoint", "n8n", "Airtable"],
  Others: ["Technical SEO", "Figma-to-code", "Legacy migrations", "CakePHP 2 → Laravel 12", "Angular/Vue → Next.js"],
} as const;

type StackCategory = keyof typeof stacks;

const skillIconKeys: Record<string, keyof typeof iconData> = {
  PHP: "php", Laravel: "laravel", CakePHP: "cakephp", FilamentPHP: "filament", Livewire: "livewire", Django: "django", "Node.js": "nodedotjs",
  React: "react", "Next.js": "nextdotjs", "Vue.js": "vuedotjs", JavaScript: "javascript", TypeScript: "typescript", jQuery: "jquery", "Alpine.js": "alpinedotjs",
  "Tailwind CSS": "tailwindcss", Bootstrap: "bootstrap", Sass: "sass", "Material Design": "materialdesign", MySQL: "mysql", PostgreSQL: "postgresql", MongoDB: "mongodb", Firebase: "firebase", Supabase: "supabase",
  Docker: "docker", Jenkins: "jenkins", Git: "git", GitHub: "github", Bitbucket: "bitbucket", Jira: "jirasoftware", Dart: "dart", Flutter: "flutter",
  "Claude Code": "claudecode", "Gemini API": "googlegemini", "GitHub Copilot": "githubcopilot", WordPress: "wordpress", Shopify: "shopify", WooCommerce: "woocommerce", Hostinger: "hostinger",
};

function TechIcon({ name }: { name: string }) {
  const iconKey = skillIconKeys[name];
  const icon = iconKey ? iconData[iconKey] : undefined;
  return <span className={styles.techIcon} style={icon ? { "--icon-color": `#${icon.hex}` } as React.CSSProperties : undefined}>{icon ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.path} /></svg> : <span>{name.slice(0, 1)}</span>}</span>;
}

const commands = [
  ["About", "#about"], ["Experience", "#experience"], ["Stack", "#stack"], ["Education", "#education"], ["Contact", "#contact"],
] as const;

export default function Home() {
  const [openRole, setOpenRole] = useState(0);
  const [category, setCategory] = useState<"All" | StackCategory>("All");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") { event.preventDefault(); setPaletteOpen(true); }
      if (event.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filteredCommands = useMemo(() => commands.filter(([name]) => name.toLowerCase().includes(query.toLowerCase())), [query]);
  const visibleStack = category === "All" ? Object.values(stacks).flat() : stacks[category];

  async function copyEmail() {
    await navigator.clipboard?.writeText("lemueldecastro13@gmail.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return <>
    <header className={styles.nav}>
      <a href="#top" className={styles.brand}><Image className={styles.brandLogo} src="/logo.svg" alt="" width={32} height={32} priority />Lemuel De Castro</a>
      <nav aria-label="Primary navigation">{commands.map(([name, href]) => <a key={href} href={href}>{name}</a>)}</nav>
      <div className={styles.navRight}><button className={styles.jump} onClick={() => setPaletteOpen(true)}>Jump to <kbd>/</kbd></button><a className={styles.navCta} href="mailto:lemueldecastro13@gmail.com">Let&apos;s talk <span>↗</span></a></div>
    </header>

    <main id="top">
      <section className={styles.hero}>
        <div className={styles.heroNoise} />
        <div className={styles.heroContent}>
          <div className={styles.heroLabel}><span className={styles.pulse} /> Available for selected projects</div>
          <h1>I make complex systems feel <em>simple.</em></h1>
          <p className={styles.heroLead}>Senior full-stack developer with 10+ years turning legacy codebases, manual workflows, and ambitious product ideas into dependable software.</p>
          <div className={styles.heroActions}><a className={styles.buttonPrimary} href="#experience">Explore my work <span>↓</span></a><a className={styles.textLink} href="https://www.linkedin.com/in/lemuel-de-castro-a19524194" target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a></div>
        </div>
        <div className={styles.heroVisual}>
          <div className={`${styles.orbit} ${styles.orbitOne}`} /><div className={`${styles.orbit} ${styles.orbitTwo}`} />
          <div className={styles.avatarFrame}><Image src="/assets/avatar.png" alt="Lemuel De Castro" fill priority sizes="(max-width: 760px) 180px, 270px" /></div>
          <div className={styles.avatarNote}><span>01 / 04</span><span>Systems builder<br />based in Cebu</span></div>
        </div>
        <div className={styles.heroMeta}><span>SCROLL TO EXPLORE</span><span className={styles.line} /><span>↓</span></div>
      </section>

      <section className={styles.section} id="about"><div className={styles.sectionIntro}><span className={styles.kicker}>01 — ABOUT</span><h2>The work is technical.<br /><span>The goal is human.</span></h2></div><div className={styles.aboutCopy}><p>I&apos;m a senior full-stack developer with 10+ years of experience centered on PHP and Laravel (v5–12), MySQL, and REST APIs, with Vue.js, React, and Next.js on the front end. I build complete systems from database schema to deployment, and use Claude Code, Cursor, and GitHub Copilot in a spec-driven workflow, reviewing AI-generated code before it ships.</p><p>I&apos;ve modernized legacy systems, built systems solo from the ground up, and worked comfortably on Linux servers over SSH. I like the projects other developers avoid: undocumented codebases, cash flow trapped in spreadsheets, and grading systems that still run on paper.</p><div className={styles.stats}><div><strong>10+</strong><span>years building</span></div><div><strong>v5 → 12</strong><span>Laravel range</span></div><div><strong>ACLC</strong><span>Computer Science</span></div></div></div></section>

      <section className={`${styles.section} ${styles.experienceSection}`} id="experience"><div className={styles.sectionIntro}><span className={styles.kicker}>02 — EXPERIENCE</span><h2>A decade of<br /><span>shipping systems.</span></h2><p className={styles.sectionAside}>From paper-based processes to AI-assisted products, I&apos;ve worked where the messy parts are.</p></div><div className={styles.timeline}>{experiences.map((item, index) => <article className={`${styles.job} ${openRole === index ? styles.jobOpen : ""}`} key={`${item.role}-${item.org}`}><button className={styles.jobHeader} onClick={() => setOpenRole(openRole === index ? -1 : index)} aria-expanded={openRole === index}><span className={styles.jobIndex}>0{index + 1}</span><span className={styles.jobTitle}><strong>{item.role}</strong><small>{item.org} · {item.place}</small></span><span className={styles.jobDate}>{item.dates}{item.current && <i>Current</i>}</span><span className={styles.chevron}>↗</span></button>{openRole === index && <div className={styles.jobDetails}><ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul></div>}</article>)}</div></section>

      <section className={`${styles.section} ${styles.stackSection}`} id="stack"><div className={styles.sectionIntro}><span className={styles.kicker}>03 — TOOLKIT</span><h2>Tools are only<br /><span>half the story.</span></h2></div><div className={styles.stackBody}><p className={styles.stackLead}>A practical, evolving toolkit for building products that hold up in production.</p><div className={styles.filters}>{["All", ...Object.keys(stacks)].map((item) => <button key={item} className={category === item ? styles.filterActive : ""} onClick={() => setCategory(item as "All" | StackCategory)}>{item}</button>)}</div><div className={styles.techGrid}>{visibleStack.map((item) => <span key={item} className={styles.techItem}><TechIcon name={item} />{item}</span>)}</div></div></section>

      <section className={`${styles.section} ${styles.educationSection}`} id="education"><div className={styles.sectionIntro}><span className={styles.kicker}>04 — EDUCATION</span><h2>Grounded in<br /><span>computer science.</span></h2></div><div className={styles.educationCard}><strong>Bachelor of Science in Computer Science</strong><span>ACLC College</span><small>June 2011 — April 2015</small></div></section>

      <section className={styles.contactSection} id="contact"><div className={styles.contactInner}><span className={styles.kicker}>05 — CONTACT</span><h2>Have a messy problem<br /><em>worth solving?</em></h2><p>I&apos;m open to full-stack roles and freelance projects — especially the kind with a legacy codebase attached.</p><a className={styles.contactEmail} href="mailto:lemueldecastro13@gmail.com">lemueldecastro13@gmail.com <span>↗</span></a><div className={styles.contactLinks}><a href="https://github.com/TheoAppSolutions" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/lemuel-de-castro-a19524194" target="_blank" rel="noreferrer">LinkedIn ↗</a></div><div className={styles.contactBottom}><button onClick={copyEmail}>{copied ? "Copied to clipboard" : "Copy email address"}</button><span>Cebu City, Philippines</span></div></div></section>
    </main>

    <footer className={styles.footer}><span>© 2026 Lemuel De Castro</span><span>Built with care, curiosity, and a lot of tabs.</span><span>B.S. Computer Science · ACLC College</span></footer>

    {paletteOpen && <div className={styles.paletteBackdrop} onClick={() => setPaletteOpen(false)}><div className={styles.palette} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><div className={styles.paletteTop}><span>⌕</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Jump to a section…" /><kbd>esc</kbd></div><div className={styles.paletteList}>{filteredCommands.map(([name, href]) => <a href={href} key={href} onClick={() => setPaletteOpen(false)}><span>{name}</span><small>{href}</small></a>)}</div></div></div>}
  </>;
}
