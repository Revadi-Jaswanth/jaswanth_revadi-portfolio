import "./styles/Career.css";
import "./styles/Education.css";
import { config } from "../config";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Education = () => {
  useEffect(() => {
    const list = document.querySelector(".edu-list") as HTMLElement;
    const items = document.querySelectorAll(".edu-item");

    if (!list || items.length === 0) return;

    const listRect = list.getBoundingClientRect();
    const firstItemRect = items[0].getBoundingClientRect();
    const lastItemRect = items[items.length - 1].getBoundingClientRect();

    // Align vline top with the first entry level
    const vlineTop = firstItemRect.top + 4 - listRect.top;

    // Target height = distance from first entry to last entry
    const targetHeight = lastItemRect.top + 4 - (firstItemRect.top + 4);

    const vlineEl = document.querySelector(".edu-vline") as HTMLElement;
    if (vlineEl) vlineEl.style.top = `${vlineTop}px`;

    // ── Grow line from first entry to last entry, scrubbed to scroll ──
    gsap.fromTo(
      ".edu-vline",
      { height: 0 },
      {
        height: targetHeight,
        ease: "none",
        scrollTrigger: {
          trigger: ".edu-list",
          start: "top 50%",
          end: "bottom 50%",
          scrub: 1,
        },
      }
    );

    // ── Fade each entry in as scroll reaches it ──
    gsap.fromTo(
      ".edu-item",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.18,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".edu-list",
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
    <div className="education-section section-container" id="education">
      <div className="career-container">
        <h2 className="edu-heading">Education</h2>
        <div className="edu-list">
          <div className="edu-vline">
            <div className="edu-dot"></div>
          </div>
          {config.education.map((edu, i) => (
            <div key={i} className="edu-item">
              <div className="edu-left">
                <span className="edu-period">{edu.period}</span>
                {edu.grade && <span className="edu-grade-badge">{edu.grade}</span>}
              </div>
              <div className="edu-right">
                <h4>{edu.degree}</h4>
                <h5>{edu.institution}</h5>
                <p>{edu.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Education;
