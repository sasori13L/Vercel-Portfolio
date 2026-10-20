"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

const experiences = [
  { role: "AI Prompt Engineer", org: "Forty Degrees Celsius Inc.", place: "Cebu City, Philippines", dates: "Jan 2026 — Present", current: true, points: ["Designed and tested prompts and LLM orchestration for production features using OpenAI, Anthropic, and Gemini APIs.", "Built the API integration layer behind those features, including structured outputs, error handling, and provider fallbacks.", "Used Claude Code and Cursor with GitHub Speckit to turn requirements into implementation and tests, reviewing every generated change before merge."] },
  { role: "Full Stack Web Developer", org: "Forty Degrees Celsius Inc.", place: "Cebu City, Philippines", dates: "Sep 2024 — Present", current: true, points: ["Contributed to a team-led, AI-assisted migration of a large CakePHP 2 codebase to Laravel 12 while preserving existing behavior.", "Built end-to-end Playwright coverage, improving release confidence and reducing regressions.", "Modernized legacy Angular and Vue.js interfaces by migrating them to Next.js.", "Delivered pixel-accurate pages from Figma designs and implemented technical SEO with XML sitemaps, canonical tags, and robots.txt."] },
  { role: "Freelance Full-Stack Developer", org: "TheoAppSolutions — my own branded freelancing company", place: "Remote", dates: "2024 — Present", points: ["Run TheoAppSolutions as my own branded freelancing company, delivering focused web and systems work for clients.", "Modernized two school grading platforms, upgrading Laravel 6 to Laravel 12 and re-architecting the frontend as headless Next.js.", "Developed an RSVP website with Next.js, Supabase, and Vercel, covering the guest-facing experience and the hosted application workflow."] },
  { role: "Lead Full-Stack System Developer", org: "Theomeds Marketing", place: "Tacloban City, Philippines", dates: "Oct 2019 — Jul 2024", points: ["Designed and built a Laravel + FilamentPHP inventory and cash flow system from scratch.", "Migrated spreadsheet-based approval workflows into Power Apps and Power Automate.", "Built an offline-first Flutter app for field reps with automatic reconciliation once back online.", "Deployed and maintained applications on a Hostinger Linux VPS, mentoring junior developers through code review."] },
  { role: "Front-End Web Developer", org: "Online Freelance Web Design", place: "Remote", dates: "Aug 2017 — Sep 2019", points: ["Delivered e-commerce front-end work across WordPress, Shopify, and WooCommerce.", "Converted Figma, Zeplin, and Photoshop files into pixel-accurate responsive pages."] },
  { role: "Full-Stack System Developer", org: "Highlands Christian Grammar School", place: "Remote", dates: "Jan 2017 — Sep 2019", points: ["Built a Laravel grading system covering grade computation, report cards, and multi-role access.", "Provided ongoing remote support during grading periods."] },
  { role: "Full-Stack System Developer", org: "Bethel International School", place: "Palo, Philippines", dates: "Jun 2015 — Dec 2016", points: ["Designed and built a Laravel-based grading and school management system, replacing a fully paper-based process.", "Handled grade computation, report generation, and role-based access from architecture through launch."] },
];

const stacks = {
  Backend: ["PHP", "Laravel", "CakePHP", "FilamentPHP", "Livewire", "Django", "Node.js", "PHPUnit"],
  Frontend: ["React", "Next.js", "Vue.js", "JavaScript", "TypeScript", "jQuery", "Alpine.js"],
  "CSS / UI": ["Tailwind CSS", "Bootstrap", "Sass", "Material Design", "Foundation"],
  Data: ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "Supabase", "NoSQL"],
  "Testing / Methodology": ["Playwright E2E", "PHPUnit", "Codeception", "TDD", "Spec-Driven Dev"],
  "DevOps / CI": ["Docker", "Jenkins", "Git", "GitHub", "Bitbucket", "Jira", "SSH / CLI"],
  Mobile: ["Dart", "Flutter", "Flutter Flow"],
  "AI / LLM": ["Prompt Engineering", "LLM Orchestration", "Structured Outputs", "Prompt Evaluation", "OpenAI API", "Anthropic API", "Gemini API", "Claude Code", "Cursor", "GitHub Copilot", "Codex"],
  Platform: ["WordPress", "Shopify", "WooCommerce", "Hostinger", "Power Apps", "Power Automate", "Power BI"],
  Others: ["Technical SEO", "Figma-to-code", "Legacy migrations", "CakePHP 2 → Laravel 12", "Angular/Vue → Next.js"],
} as const;

type StackCategory = keyof typeof stacks;

const techIcons: Record<string, { path: string; color: string }> = {
  PHP: { color: "#777BB4", path: "M7.01 10.2h-.94l-.52 2.65h.84c.56 0 .97-.1 1.24-.31.27-.21.46-.56.55-1.05.09-.47.05-.8-.12-1s-.52-.29-1.05-.29ZM12 5.69C5.37 5.69 0 8.51 0 12s5.37 6.31 12 6.31S24 15.49 24 12 18.63 5.69 12 5.69Z" },
  Laravel: { color: "#FF2D20", path: "M23.64 5.43v5.25l-4.51 2.6v4.93L9.93 23.95.53 18.75V2.97L5.42.05l4.51 2.6v9.65l3.76-2.16V5.53l4.51-2.6 5.44 2.5Z" },
  React: { color: "#61DAFB", path: "M12 9.77a2.24 2.24 0 1 0 0 4.47 2.24 2.24 0 0 0 0-4.47Zm0-8.46c-1.35 0-3.11.96-4.89 2.62-1.78-1.65-3.54-2.6-4.89-2.6C.85 1.33 0 5.4 1.98 8.92 0 10.42 0 13.58 1.98 15.08c-1.98 3.53-1.13 7.6.24 7.6 1.34 0 3.11-.96 4.89-2.62 1.78 1.65 3.54 2.6 4.89 2.6 1.37 0 2.22-4.07.24-7.6C14.22 13.58 14.22 10.42 12.24 8.92 14.22 5.4 13.37 1.33 12 1.31Z" },
  "Next.js": { color: "#111111", path: "M18.67 21.98A12 12 0 1 1 12 0a12 12 0 0 1 5.93 22.06L9.22 7.2H7.2v9.6h1.62V9.25l9.85 12.73Zm-3.33-8.53 1.6 2.06V7.2h-1.6v6.25Z" },
  "Vue.js": { color: "#42B883", path: "M24 1.61h-9.94L12 5.16 9.94 1.61H0l12 20.78L24 1.61Zm-12 12.47L5.16 2.23h4.43L12 6.41l2.41-4.18h4.43L12 14.08Z" },
  TypeScript: { color: "#3178C6", path: "M1.13 0h21.74C23.5 0 24 .5 24 1.13v21.74c0 .63-.5 1.13-1.13 1.13H1.13C.5 24 0 23.5 0 22.87V1.13C0 .5.5 0 1.13 0Zm2.24 12.1h3.42v9.65h2.72V12.1h3.42V9.94H3.37v2.16Zm13.36-2.35c-1.8 0-3.3.96-3.3 2.82 0 1.8 1.04 2.45 2.64 3.12 1.25.52 1.76.86 1.76 1.5 0 .64-.56 1.03-1.5 1.03-1.04 0-1.85-.48-2.59-1.2v2.63c.62.32 1.49.65 2.88.65 2.25 0 3.66-1.1 3.66-3.26 0-1.78-.98-2.54-2.97-3.37-.97-.4-1.4-.69-1.4-1.13 0-.45.4-.75 1.2-.75.83 0 1.57.3 2.3.82v-2.46c-.62-.24-1.35-.4-2.68-.4Z" },
  "Tailwind CSS": { color: "#06B6D4", path: "M12 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.91.23 1.56.89 2.29 1.62C13.67 10.62 15.03 12 18 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.91-.23-1.56-.89-2.29-1.62C16.34 6.18 14.98 4.8 12 4.8ZM6 12c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.91.23 1.56.89 2.29 1.62C7.66 17.82 9.03 19.2 12 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.91-.23-1.56-.89-2.29-1.62C10.34 13.38 8.98 12 6 12Z" },
  Flutter: { color: "#02569B", path: "M14.31 0 2.3 12 6 15.7 21.68 0h-7.37Zm.01 11.07-6.47 6.46L14.33 24h7.37l-6.46-6.47 6.46-6.46h-7.38Z" },
  "Claude Code": { color: "#D97757", path: "M21 10.5h3v3h-3v3h-1.5v3H18v-3h-1.5v3H15v-3H9v3H7.5v-3H6v3H4.5v-3H3v-3H0v-3h3v-6h18v6Z" },
  "Gemini API": { color: "#8E75B2", path: "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81t-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81Z" },
};

function TechIcon({ name }: { name: string }) {
  const icon = techIcons[name];
  return <span className={styles.techIcon} style={icon ? { "--icon-color": icon.color } as React.CSSProperties : undefined}>{icon ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.path} /></svg> : <span>{name.slice(0, 1)}</span>}</span>;
}

const commands = [
  ["About", "#about"], ["Experience", "#experience"], ["Stack", "#stack"], ["Contact", "#contact"],
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
      <a href="#top" className={styles.brand}><span className={styles.brandDot} />Lemuel De Castro</a>
      <nav aria-label="Primary navigation">{commands.map(([name, href]) => <a key={href} href={href}>{name}</a>)}</nav>
      <div className={styles.navRight}><button className={styles.jump} onClick={() => setPaletteOpen(true)}>Jump to <kbd>/</kbd></button><a className={styles.navCta} href="mailto:lemueldecastro13@gmail.com">Let&apos;s talk <span>↗</span></a></div>
    </header>

    <main id="top">
      <section className={styles.hero}>
        <div className={styles.heroNoise} />
        <div className={styles.heroContent}>
          <div className={styles.heroLabel}><span className={styles.pulse} /> Available for selected projects</div>
          <h1>I make complex systems feel <em>simple.</em></h1>
          <p className={styles.heroLead}>Full-stack developer with 10+ years turning legacy codebases, manual workflows, and ambitious product ideas into dependable software.</p>
          <div className={styles.heroActions}><a className={styles.buttonPrimary} href="#experience">Explore my work <span>↓</span></a><a className={styles.textLink} href="https://www.linkedin.com/in/lemuel-de-castro-a19524194" target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a></div>
        </div>
        <div className={styles.heroVisual}>
          <div className={`${styles.orbit} ${styles.orbitOne}`} /><div className={`${styles.orbit} ${styles.orbitTwo}`} />
          <div className={styles.avatarFrame}><Image src="/assets/avatar.png" alt="Lemuel De Castro" fill priority sizes="(max-width: 760px) 180px, 270px" /></div>
          <div className={styles.avatarNote}><span>01 / 04</span><span>Systems builder<br />based in Cebu</span></div>
        </div>
        <div className={styles.heroMeta}><span>SCROLL TO EXPLORE</span><span className={styles.line} /><span>↓</span></div>
      </section>

      <section className={styles.marquee} aria-label="Core capabilities"><div>Laravel <span>✦</span> Next.js <span>✦</span> Flutter <span>✦</span> AI integrations <span>✦</span> System design <span>✦</span> Laravel <span>✦</span> Next.js <span>✦</span></div></section>

      <section className={styles.section} id="about"><div className={styles.sectionIntro}><span className={styles.kicker}>01 — ABOUT</span><h2>The work is technical.<br /><span>The goal is human.</span></h2></div><div className={styles.aboutCopy}><p>I&apos;m a senior full-stack developer centered on PHP and Laravel, from v6 to 12, with MySQL, REST APIs, Vue.js, React, and Next.js on the front end. I build complete systems from database schema to deployment, and I&apos;m increasingly focused on the practical edge of AI: prompts, orchestration, structured outputs, fallbacks, and the tests that keep generated code honest.</p><p>I like the projects other developers avoid: undocumented codebases, cash flow trapped in spreadsheets, grading systems that still run on paper. There&apos;s usually a clear before and after. That&apos;s the part I care about.</p><div className={styles.stats}><div><strong>10+</strong><span>years building</span></div><div><strong>v6 → 12</strong><span>Laravel range</span></div><div><strong>∞</strong><span>curiosity</span></div></div></div></section>

      <section className={`${styles.section} ${styles.experienceSection}`} id="experience"><div className={styles.sectionIntro}><span className={styles.kicker}>02 — EXPERIENCE</span><h2>A decade of<br /><span>shipping systems.</span></h2><p className={styles.sectionAside}>From paper-based processes to AI-assisted products, I&apos;ve worked where the messy parts are.</p></div><div className={styles.timeline}>{experiences.map((item, index) => <article className={`${styles.job} ${openRole === index ? styles.jobOpen : ""}`} key={`${item.role}-${item.org}`}><button className={styles.jobHeader} onClick={() => setOpenRole(openRole === index ? -1 : index)} aria-expanded={openRole === index}><span className={styles.jobIndex}>0{index + 1}</span><span className={styles.jobTitle}><strong>{item.role}</strong><small>{item.org} · {item.place}</small></span><span className={styles.jobDate}>{item.dates}{item.current && <i>Current</i>}</span><span className={styles.chevron}>↗</span></button>{openRole === index && <div className={styles.jobDetails}><ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul></div>}</article>)}</div></section>

      <section className={`${styles.section} ${styles.stackSection}`} id="stack"><div className={styles.sectionIntro}><span className={styles.kicker}>03 — TOOLKIT</span><h2>Tools are only<br /><span>half the story.</span></h2></div><div className={styles.stackBody}><p className={styles.stackLead}>A practical, evolving toolkit for building products that hold up in production.</p><div className={styles.filters}>{["All", ...Object.keys(stacks)].map((item) => <button key={item} className={category === item ? styles.filterActive : ""} onClick={() => setCategory(item as "All" | StackCategory)}>{item}</button>)}</div><div className={styles.techGrid}>{visibleStack.map((item) => <span key={item} className={styles.techItem}><TechIcon name={item} />{item}</span>)}</div></div></section>

      <section className={styles.contactSection} id="contact"><div className={styles.contactInner}><span className={styles.kicker}>04 — CONTACT</span><h2>Have a messy problem<br /><em>worth solving?</em></h2><p>I&apos;m open to full-stack roles and freelance projects — especially the kind with a legacy codebase attached.</p><a className={styles.contactEmail} href="mailto:lemueldecastro13@gmail.com">lemueldecastro13@gmail.com <span>↗</span></a><div className={styles.contactBottom}><button onClick={copyEmail}>{copied ? "Copied to clipboard" : "Copy email address"}</button><span>Cebu City, Philippines</span></div></div></section>
    </main>

    <footer className={styles.footer}><span>© 2026 Lemuel De Castro</span><span>Built with care, curiosity, and a lot of tabs.</span><span>B.S. Computer Science · ACLC College Tacloban</span></footer>

    {paletteOpen && <div className={styles.paletteBackdrop} onClick={() => setPaletteOpen(false)}><div className={styles.palette} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><div className={styles.paletteTop}><span>⌕</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Jump to a section…" /><kbd>esc</kbd></div><div className={styles.paletteList}>{filteredCommands.map(([name, href]) => <a href={href} key={href} onClick={() => setPaletteOpen(false)}><span>{name}</span><small>{href}</small></a>)}</div></div></div>}
  </>;
}
