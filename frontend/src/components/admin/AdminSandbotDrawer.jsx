import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Trash2, Sparkles, Database, FileText, Copy, Check, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { API_BASE } from "../../config/api";
import styles from "./AdminSandbotDrawer.module.css";

const PRESET_ADMIN_PROMPTS = [
  "Give me a complete summary of all database counts",
  "Draft a new memory: Topic 'Her Favorite Sitar Ragas', Category 'Creative Passions', Answer 'She finds deep peace in evening ragas, especially Yaman and Bhairavi, playing them when looking for calm.'",
  "Draft an archive essay: Title 'Quiet Morning Reflections', Tag 'Restoration Series', Paragraphs 'The world is quiet before the noise of routine begins. In this space, thoughts rest easily.'",
  "Draft a safety protocol: Title 'Navigating Overwhelming Crowds', Summary 'Grounding techniques and immediate exit strategies for sensory overload in public spaces.'",
  "List all pending feature requests",
];

const INITIAL_SANDBOT_GREETING = {
  id: "init",
  sender: "assistant",
  text: "Greetings, Master Admin Manik. I am Sandbot, your executive archive AI drafting copilot. I can query database summaries and intelligently structure & draft new essays, memories, safety protocols, or acknowledgements for you. Whenever I compose a draft, click 'Prefill into Form' to review and customize the input boxes before saving.",
  time: "Online",
};

const AdminSandbotDrawer = ({ isOpen, onClose, onDataMutated, onPrefillForm }) => {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("archive_admin_sandbot_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not load Sandbot chat history:", e);
    }
    return [INITIAL_SANDBOT_GREETING];
  });

  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const messagesEndRef = useRef(null);

  const handleCopy = (msgId, text) => {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedMsgId(msgId);
      setTimeout(() => {
        setCopiedMsgId((current) => (current === msgId ? null : current));
      }, 2000);
    } catch (err) {
      console.warn("Could not copy message:", err);
    }
  };

  // Persist conversation history to localStorage on any message update
  useEffect(() => {
    try {
      localStorage.setItem("archive_admin_sandbot_history", JSON.stringify(messages));
    } catch (e) {
      console.warn("Could not save Sandbot history:", e);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("archive_admin_token") || "";
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isProcessing) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsProcessing(true);

    try {
      // Build conversation history excluding init message
      const history = messages
        .filter((m) => m.id !== "init")
        .slice(-4)
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        }));

      const res = await fetch(`${API_BASE}/admin/ai-agent/chat`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          message: query,
          history,
        }),
      });

      const data = await res.json();

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: data.reply || "Draft structured for you, Manik.",
        executedAction: data.executedAction || null,
        actionResult: data.actionResult || null,
        suggestedDraft: data.suggestedDraft || data.actionResult?.suggestedDraft || null,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);

      if (data.refreshRequired && onDataMutated) {
        onDataMutated();
      }
    } catch (err) {
      console.error("Sandbot chat error:", err);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: "Manik, I encountered an error connecting to the drafting engine. Please verify your session.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([INITIAL_SANDBOT_GREETING]);
    localStorage.removeItem("archive_admin_sandbot_history");
  };

  if (!isOpen) return null;

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawerPanel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.headerTitle}>
              <Bot size={18} color="var(--color-secondary, #800020)" />
              <span>Sandbot &bull; AI Drafting Copilot</span>
            </h2>
            <p className={styles.headerSubtitle}>
              Drafts structure & prefills input boxes for your review &bull; Read-only DB
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.iconBtn}
              title="Clear Conversation History"
              onClick={handleClearHistory}
            >
              <Trash2 size={14} />
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              title="Close Sandbot"
              onClick={onClose}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className={styles.messagesList}>
          {messages.map((m) => {
            const isUser = m.sender === "user";
            const isCopied = copiedMsgId === m.id;
            return (
              <div
                key={m.id}
                className={`${styles.message} ${
                  isUser ? styles.userMessage : styles.assistantMessage
                }`}
              >
                <div className={styles.bubble}>
                  {m.executedAction && m.executedAction !== "none" && (
                    <div className={`${styles.actionBadge} ${styles.actionBadgeSuccess}`}>
                      <Sparkles size={11} />
                      <span>Mode: {m.executedAction}</span>
                    </div>
                  )}

                  <div className={`${styles.markdownContent} ${isUser ? styles.userMarkdown : ""}`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ href, children, ...props }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.chatLink}
                            onClick={(e) => e.stopPropagation()}
                            {...props}
                          >
                            <span>{children}</span>
                            <ExternalLink size={11} className={styles.inlineLinkIcon} />
                          </a>
                        ),
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
                  </div>

                  {/* Suggested Draft Prefill Action Card */}
                  {m.suggestedDraft && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.75rem 0.9rem",
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid var(--color-border, #E5DFC0)",
                        borderRadius: "8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.4rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span
                          style={{
                            fontSize: "0.6875rem",
                            fontWeight: 700,
                            color: "var(--color-secondary, #800020)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          ✨ DRAFT READY: {m.suggestedDraft.type?.toUpperCase()}
                        </span>
                      </div>

                      <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-primary, #2B2825)" }}>
                        {m.suggestedDraft.data?.title ||
                          m.suggestedDraft.data?.topic ||
                          m.suggestedDraft.data?.quote ||
                          "Structured Draft"}
                      </div>

                      <button
                        type="button"
                        onClick={() => onPrefillForm && onPrefillForm(m.suggestedDraft)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.4rem",
                          padding: "0.5rem 0.85rem",
                          marginTop: "0.25rem",
                          backgroundColor: "var(--color-primary, #2B2825)",
                          color: "#F5F1E8",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "opacity 150ms ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                      >
                        <Sparkles size={13} color="#E2B8C0" />
                        <span>Prefill into Form & Edit</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.msgFooter}>
                  <button
                    type="button"
                    className={styles.copyMsgBtn}
                    onClick={() => handleCopy(m.id, m.text)}
                    title="Copy message"
                    aria-label="Copy message"
                  >
                    {isCopied ? (
                      <>
                        <Check size={11} className={styles.copiedIcon} />
                        <span className={styles.copiedText}>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <span className={styles.timestamp}>{m.time}</span>
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className={`${styles.message} ${styles.assistantMessage}`}>
              <div className={`${styles.bubble} ${styles.typingIndicator}`}>
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Directive Chips */}
        <div className={styles.suggestionsBar}>
          <span
            style={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              color: "var(--color-text-muted, #736b63)",
              alignSelf: "center",
              marginRight: "0.25rem",
            }}
          >
            DRAFTING DIRECTIVES:
          </span>
          {PRESET_ADMIN_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              className={styles.suggestionChip}
              onClick={() => handleSendMessage(prompt)}
              disabled={isProcessing}
            >
              {prompt.length > 40 ? prompt.substring(0, 40) + "..." : prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          className={styles.inputArea}
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="text"
            className={styles.inputField}
            placeholder="Ask Sandbot to draft (e.g. 'Draft an essay about rain', 'Draft a memory for sitar ragas')..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isProcessing}
          />
          <button
            type="submit"
            className={styles.sendBtn}
            disabled={!inputValue.trim() || isProcessing}
          >
            <Send size={13} style={{ marginRight: "0.3rem" }} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSandbotDrawer;
