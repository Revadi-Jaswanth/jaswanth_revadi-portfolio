import { config } from "../config";
import { openChatWidgetGlobal } from "./ChatWidget";
import "./styles/CallToAction.css";

const CallToAction = () => {
  return (
    <div className="cta-section">
      <div className="cta-buttons">
        <button
          onClick={openChatWidgetGlobal}
          className="cta-btn cta-btn-play"
          data-cursor="disable"
          style={{ cursor: "pointer" }}
        >
          Chat with AI →
        </button>
        
        <a 
          href={config.contact.linkedin} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="cta-btn cta-btn-hire"
          data-cursor="disable"
        >
          Hire Me →
        </a>
      </div>
    </div>
  );
};

export default CallToAction;
