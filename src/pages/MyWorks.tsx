import { useNavigate } from "react-router-dom";
import { config } from "../config";
import "./MyWorks.css";

const MyWorks = () => {
  const navigate = useNavigate();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/#work");
    }
  };

  return (
    <div className="myworks-page">
      <div className="myworks-header">
        <button
          onClick={handleBack}
          className="back-button"
          data-cursor="disable"
          style={{ background: "none", cursor: "pointer", fontFamily: "inherit" }}
        >
          ← Back to Home
        </button>
        <h1>
          All <span>Works</span>
        </h1>
        <p>A collection of all my projects and creations</p>
      </div>

      <div className="myworks-grid">
        {config.projects.map((project, index) => (
          <a
            href={project.link && project.link !== "#" ? project.link : undefined}
            target={project.link && project.link !== "#" ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="myworks-card"
            key={project.id}
            data-cursor="disable"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="myworks-card-number">0{index + 1}</div>
            <div className="myworks-card-image">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="myworks-card-info">
              <h3>{project.title}</h3>
              {project.category && <p className="myworks-card-category">{project.category}</p>}
              <p className="myworks-card-description">{project.description}</p>
              <p className="myworks-card-tech">{project.technologies}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default MyWorks;
