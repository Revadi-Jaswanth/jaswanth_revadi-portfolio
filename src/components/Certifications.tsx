import "./styles/Certifications.css";
import { config } from "../config";

const Certifications = () => {
  return (
    <div className="certs-section section-container" id="certs">
      <div className="certs-container">
        <h2>
          Certifications <span>&</span>
          <br /> Credentials
        </h2>
        <div className="certs-grid">
          {config.certifications.map((cert, index) => (
            <a
              key={index}
              href={cert.url && cert.url !== "#" ? cert.url : undefined}
              target={cert.url && cert.url !== "#" ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="cert-card"
              data-cursor="disable"
              onClick={!cert.url || cert.url === "#" ? (e) => e.preventDefault() : undefined}
              style={{ cursor: !cert.url || cert.url === "#" ? "default" : "pointer" }}
            >
              <div className="cert-top">
                <div className="cert-icon">{cert.icon}</div>
              </div>
              <div className="cert-content">
                <h3 className="cert-title">{cert.title}</h3>
                <p className="cert-meta">{cert.issuer}</p>
                {cert.verified && (
                  <div className="cert-badge">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="#4ade80"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Verified
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certifications;
