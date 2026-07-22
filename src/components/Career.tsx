import "./styles/Career.css";
import { config } from "../config";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const getDisplayYear = (period: string) => {
  if (period.toLowerCase().includes("present")) return "NOW";
  const start = period.split(" - ")[0].trim();
  const yearMatch = start.match(/\d{4}/);
  return yearMatch ? yearMatch[0] : start;
};

const Career = () => {
  useEffect(() => {
    const list = document.querySelector(".career-list") as HTMLElement;
    const items = document.querySelectorAll(".career-item");

    if (!list || items.length === 0) return;

    const listRect = list.getBoundingClientRect();
    const firstItemRect = items[0].getBoundingClientRect();
    const lastItemRect = items[items.length - 1].getBoundingClientRect();

    // Align vline top with the first entry's marker level (11px from item top)
    const vlineTop = firstItemRect.top + 11 - listRect.top;

    // Target height = distance from first entry marker to last entry marker
    const targetHeight = lastItemRect.top + 11 - (firstItemRect.top + 11);

    // Apply the calculated top position to the vline
    const vlineEl = document.querySelector(".career-vline") as HTMLElement;
    if (vlineEl) vlineEl.style.top = `${vlineTop}px`;

    // ── Grow line from first entry to last entry, scrubbed to scroll ──
    gsap.fromTo(
      ".career-vline",
      { height: 0 },
      {
        height: targetHeight,
        ease: "none",
        scrollTrigger: {
          trigger: ".career-list",
          start: "top 50%",
          end: "bottom 50%",
          scrub: 1,
        },
      }
    );

    // ── Fade each entry in as scroll reaches it ──
    gsap.fromTo(
      ".career-item",
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        stagger: 0.18,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".career-list",
          start: "top 78%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="career-section section-container" id="experience">
      <div className="career-container">
        <h2>
          Professional <span>Experience</span>
        </h2>
        <div className="career-list">
          <div className="career-vline">
            <div className="career-dot"></div>
          </div>
          {config.experiences.map((exp, i) => (
            <div key={i} className="career-item">
              <div className="career-item-header">
                <span className="career-year">{getDisplayYear(exp.period)}</span>
                <div className="career-role-block">
                  <h4>{exp.position}</h4>
                  <h5>{exp.company}</h5>
                  <span className="career-period">{exp.period}</span>
                </div>
              </div>
              <p className="career-desc">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
