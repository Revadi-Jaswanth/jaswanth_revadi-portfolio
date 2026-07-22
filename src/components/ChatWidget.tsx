import { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import "./styles/ChatWidget.css";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT = `You are Revadi Naga Sai Jaswanth, a passionate AI/ML Engineer & Full-Stack Developer from Visakhapatnam, India. You are NOT an AI assistant - you ARE Jaswanth himself chatting with visitors on your portfolio website.

About you (Revadi Naga Sai Jaswanth):
- Full name: Revadi Naga Sai Jaswanth
- Location: Visakhapatnam, Andhra Pradesh, India
- Education: B.Tech in Computer Science & Engineering (AI & ML) at ANITS (CGPA: 8.69)
- Previous Education: Intermediate (MPC) Sree Navodaya Jr. College (96.4%), Secondary Education Ravindra Bharathi E.M School (98%)
- Profession: AI/ML Engineer & Full-Stack Developer
- Specialties: AI/ML, Python, React, Node.js, TensorFlow, PyTorch, Google Gemini API, Generative AI, Streamlit, Flask, MySQL, MongoDB
- Experience:
  1. Python Tech Stack Intern @ Infosys Springboard (Jun 2026 - Present)
  2. AI Intern @ Edunet Foundation × IBM SkillsBuild (May 2026 - Jun 2026)
  3. Google Student Ambassador 2.0 @ Google AI Skills House (Sep 2025 - Dec 2025)
  4. AI Intern @ Codec Technologies (May 2025 - Jun 2025)
- Key Projects:
  1. Drishti - Advanced AI Chatbot powered by custom LLM
  2. FITSAGE AI - Personalized Fitness & Health Coach app
  3. AI-Powered Study Buddy - Interactive student study assistant & PDF notes analyzer
  4. Employee Salary Predictor - ML model for salary estimation
- GitHub: https://github.com/Revadi-Jaswanth
- Languages: Telugu (native), English (fluent)
- Contact: revadijaswanth@gmail.com | Phone: +91 9848682442

Rules:
1. Always respond as Jaswanth in first person ("I", "my", "me")
2. Be friendly, casual, conversational, and helpful
3. Keep responses concise (2-4 sentences max unless detailed info is requested)
4. Never say you are an AI or language model - you are Jaswanth himself
5. Use occasional emojis to be welcoming 😊`;

export const openChatWidgetGlobal = () => {
  const event = new CustomEvent("open-jaswanth-chat");
  window.dispatchEvent(event);
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello there! I am Revadi Naga Sai Jaswanth 👋 Ask me anything about my work, skills, or projects!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Drag & Position State ──
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
    hasDragged: boolean;
  }>({ startX: 0, startY: 0, startLeft: 0, startTop: 0, hasDragged: false });

  const widgetRef = useRef<HTMLButtonElement>(null);

  // Calculate default initial position beside Instagram icon on desktop or bottom-left on mobile
  useEffect(() => {
    const calcDefaultPos = () => {
      const isDesktop = window.innerWidth >= 900;
      if (isDesktop) {
        // Find Instagram icon position dynamically if available
        const instaEl = document.querySelector(".social-icons span:last-child");
        if (instaEl) {
          const rect = instaEl.getBoundingClientRect();
          setPos({ x: rect.right + 16, y: rect.top + 2 });
          return;
        }
        setPos({ x: 260, y: window.innerHeight - 70 });
      } else {
        setPos({ x: 20, y: window.innerHeight - 75 });
      }
    };

    calcDefaultPos();
    window.addEventListener("resize", calcDefaultPos);
    return () => window.removeEventListener("resize", calcDefaultPos);
  }, []);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-jaswanth-chat", handleOpen);
    return () => window.removeEventListener("open-jaswanth-chat", handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // ── Drag Handlers (Touch + Mouse) ──
  const onDragStart = (clientX: number, clientY: number) => {
    if (!widgetRef.current) return;
    const rect = widgetRef.current.getBoundingClientRect();
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      startLeft: rect.left,
      startTop: rect.top,
      hasDragged: false,
    };
    setIsDragging(true);
  };

  const onDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || !widgetRef.current) return;
    const dx = clientX - dragStartRef.current.startX;
    const dy = clientY - dragStartRef.current.startY;

    if (Math.hypot(dx, dy) > 5) {
      dragStartRef.current.hasDragged = true;
    }

    const rect = widgetRef.current.getBoundingClientRect();
    const btnWidth = rect.width || 120;
    const btnHeight = rect.height || 50;

    let newX = dragStartRef.current.startLeft + dx;
    let newY = dragStartRef.current.startTop + dy;

    // Bounds checking inside viewport
    newX = Math.max(10, Math.min(window.innerWidth - btnWidth - 10, newX));
    newY = Math.max(10, Math.min(window.innerHeight - btnHeight - 10, newY));

    setPos({ x: newX, y: newY });
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    onDragStart(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onDragMove(e.clientX, e.clientY);
      }
    };
    const handleMouseUp = () => {
      onDragEnd();
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    onDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    onDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    onDragEnd();
  };

  const handleToggleClick = () => {
    if (!dragStartRef.current.hasDragged) {
      setIsOpen(!isOpen);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.filter((m) => m.role !== "system").map((m) => ({
          role: m.role,
          content: m.content,
        })),
        userMessage,
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();

      if (response.ok && data.choices?.[0]?.message?.content) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.choices[0].message.content },
        ]);
      } else {
        throw new Error(data.error || "Failed response");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, having some connection issues. Try again or reach out directly at revadijaswanth@gmail.com! 😅",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Smart placement for chat window depending on widget position
  const getWindowStyle = (): React.CSSProperties => {
    if (!pos) {
      return { bottom: "90px", left: "20px" };
    }

    const isTopHalf = pos.y < window.innerHeight / 2;
    const isLeftHalf = pos.x < window.innerWidth / 2;

    const style: React.CSSProperties = {};

    if (isTopHalf) {
      style.top = `${pos.y + 55}px`;
    } else {
      style.bottom = `${window.innerHeight - pos.y + 10}px`;
    }

    if (isLeftHalf) {
      style.left = `${Math.max(15, pos.x)}px`;
    } else {
      style.right = `${Math.max(15, window.innerWidth - pos.x - 130)}px`;
    }

    return style;
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window" style={getWindowStyle()}>
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <FaRobot />
              </div>
              <div>
                <h4>Jaswanth AI</h4>
                <p>
                  <span className="online-dot"></span> Online · Ask me anything
                </p>
              </div>
            </div>
            <button
              className="chat-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble-wrapper ${
                  msg.role === "user" ? "user-wrapper" : "assistant-wrapper"
                }`}
              >
                <div
                  className={`chat-bubble ${
                    msg.role === "user" ? "user-bubble" : "assistant-bubble"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-bubble-wrapper assistant-wrapper">
                <div className="chat-bubble assistant-bubble typing-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form className="chat-input-form" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask me something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="chat-send-btn"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}

      {/* Draggable Translucent Violet Robot AssistiveTouch Button */}
      <button
        ref={widgetRef}
        className={`cloud-assistive-widget ${isOpen ? "active" : ""} ${
          isDragging ? "dragging" : ""
        }`}
        style={
          pos
            ? { left: `${pos.x}px`, top: `${pos.y}px` }
            : { bottom: "25px", left: "20px" }
        }
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleToggleClick}
        aria-label="Toggle Draggable Robot Chat AI"
      >
        {isOpen ? (
          <FaTimes className="cloud-icon" />
        ) : (
          <div className="cloud-content">
            <FaRobot className="robot-icon" />
            <span className="cloud-text">Chat AI</span>
          </div>
        )}
      </button>
    </>
  );
};

export default ChatWidget;
