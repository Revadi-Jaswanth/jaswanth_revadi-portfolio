import { MdCopyright } from "react-icons/md";
import { useState, useEffect } from "react";
import "./styles/Contact.css";
import { config } from "../config";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FormStatus = "idle" | "sending" | "success" | "error";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top 80%",
        end: "bottom center",
        toggleActions: "play none none none",
      },
    });

    tl.fromTo(
      ".contact-section h3",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
    ).fromTo(
      ".contact-info-col, .contact-form-col",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" },
      "-=0.3"
    );

    return () => { tl.kill(); };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: config.contact.web3formsKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: formData.name,
          replyto: formData.email,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        {/* Centered name */}
        <h3>{config.developer.fullName}</h3>

        <div className="contact-flex">
          {/* ── Left: info + credit ── */}
          <div className="contact-info-col">
            <div className="contact-info-items">
              <h4>Contact</h4>
              <p>
                <a href="tel:+919848682442" data-cursor="disable">
                  +91 9848682442
                </a>
              </p>
              <p>
                <a href={`mailto:${config.contact.email}`} data-cursor="disable">
                  {config.contact.email}
                </a>
              </p>
              <h4>Location</h4>
              <p>{config.social.location}</p>
            </div>

            <div className="contact-credit">
              <h2>
                Designed and Developed
                <br />
                by <span>{config.developer.fullName}</span>
              </h2>
              <h5>
                <MdCopyright /> {new Date().getFullYear()}
              </h5>
            </div>
          </div>

          {/* ── Right: contact form ── */}
          <div className="contact-form-col">
            <div className="contact-form-header">
              <h2 className="contact-form-title">
                Have an Idea?
              </h2>
              <p className="contact-form-desc">
                Whether it's a new project, a startup idea, or just a chat about
                technology, my inbox is always open. I'm actively looking for
                internship and collaboration opportunities.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="cf-name">NAME</label>
                  <input
                    id="cf-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="cf-email">EMAIL</label>
                  <input
                    id="cf-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="cf-subject">SUBJECT</label>
                <input
                  id="cf-subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="cf-message">MESSAGE</label>
                <textarea
                  id="cf-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or opportunity..."
                  required
                  rows={5}
                />
              </div>

              <button
                type="submit"
                className={`contact-submit ${status}`}
                disabled={status === "sending"}
              >
                {status === "sending" && "Sending..."}
                {status === "success" && "✓ Message Sent!"}
                {status === "error" && "Try Again"}
                {status === "idle" && "Send Message →"}
              </button>

              {status === "error" && (
                <p className="contact-form-error">
                  Something went wrong. Please try again or email directly.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
