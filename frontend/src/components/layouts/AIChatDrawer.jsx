import { useState, useRef, useEffect, useMemo } from "react";
import {
  Send,
  Trash2,
  History,
  Plus,
  MessageSquare,
  Search,
  X,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  Clock,
  RotateCcw,
  Check,
  Copy,
  FileText,
  ExternalLink,
  Bot,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Drawer from "../common/Drawer/Drawer";
import Input from "../common/Input/Input";
import Button from "../common/Button/Button";
import { useAuth } from "../../hooks/useAuth";
import { formatChatDateTime, groupSessionsByTimeframe } from "../../utils/timeUtils";
import { API_BASE } from "../../config/api";
import styles from "./AIChatDrawer.module.css";

const STORAGE_SESSIONS_KEY = "archive_client_chat_sessions_v2";
const STORAGE_ACTIVE_SESSION_KEY = "archive_active_chat_session_id";

const defaultPrompts = [
  "What do you know about me?",
  "Tell me about Manik and his respect for me",
];

const INITIAL_GREETING = {
  id: "init",
  sender: "assistant",
  text: "Hello, I am your archive companion. Ask me anything about you, Manik, shared memories, safety protocols, or quiet reflections.",
  time: "Online",
  timestamp: Date.now(),
};

// Safe localStorage loader for sessions
const loadLocalSessions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_SESSIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((s) => s && s.sessionId && !s.clientDeleted);
      }
    }
  } catch (err) {
    console.warn("Could not load local chat sessions:", err);
  }
  return [];
};

// Safe localStorage saver
const saveLocalSessions = (sessions) => {
  try {
    localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.warn("Could not save local chat sessions:", err);
  }
};

const generateSecureSessionId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `session_${crypto.randomUUID()}`;
  }
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
};

const resolveWorkingDocUrl = (rawUrl) => {
  if (!rawUrl) return rawUrl;
  let cleanUrl = rawUrl.trim().replace(/[),.;]+$/, "");

  // If it's a known guide link or API resource link, route via current API_BASE stream
  if (cleanUrl.includes("Indian_Scripture_Definitions_of_Love")) {
    return `${API_BASE}/resources/Indian_Scripture_Definitions_of_Love/view`;
  }
  if (cleanUrl.includes("Women_s_Safety") || cleanUrl.includes("womens-safety")) {
    return `${API_BASE}/resources/womens-safety-and-ocd-guide/view`;
  }
  if (cleanUrl.includes("/resources/")) {
    const resourcePath = cleanUrl.substring(cleanUrl.indexOf("/resources/"));
    return `${API_BASE}${resourcePath}`;
  }
  return cleanUrl;
};

const isDocumentOrPdfUrl = (url = "") => {
  const lower = url.toLowerCase();
  return (
    lower.endsWith(".pdf") ||
    lower.includes("/resources/") ||
    lower.includes("definitions_of_love") ||
    lower.includes("safety") ||
    lower.includes("guide") ||
    lower.includes("view")
  );
};

const getDocumentTitle = (children, href = "") => {
  if (
    typeof children === "string" &&
    !children.startsWith("http://") &&
    !children.startsWith("https://")
  ) {
    return children;
  }
  const lowerHref = href.toLowerCase();
  if (lowerHref.includes("indian_scripture") || lowerHref.includes("definitions_of_love")) {
    return "Indian Scripture Definitions of Love (PDF)";
  }
  if (lowerHref.includes("women_s_safety") || lowerHref.includes("womens-safety")) {
    return "Women's Safety & Boundary Guide (PDF)";
  }
  if (lowerHref.includes("/resources/")) {
    return "Archive Resource Document (PDF)";
  }
  return typeof children === "string" ? children : "View Document (PDF)";
};

const MarkdownMessage = ({ content, isUser }) => {
  if (typeof content !== "string") return null;

  return (
    <div className={`${styles.markdownContent} ${isUser ? styles.userMarkdown : ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            const finalHref = resolveWorkingDocUrl(href);
            const isDoc = isDocumentOrPdfUrl(href || "");
            const docTitle = getDocumentTitle(children, href || "");

            if (isDoc) {
              return (
                <a
                  href={finalHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.docCardLink}
                  onClick={(e) => e.stopPropagation()}
                  title={`Open document: ${docTitle}`}
                  {...props}
                >
                  <div className={styles.docCardIconWrap}>
                    <FileText size={16} />
                  </div>
                  <div className={styles.docCardDetails}>
                    <span className={styles.docCardTitle}>{docTitle}</span>
                    <span className={styles.docCardSub}>Click to open document &bull; PDF</span>
                  </div>
                  <ExternalLink size={13} className={styles.docCardExternal} />
                </a>
              );
            }

            return (
              <a
                href={finalHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.chatLink}
                onClick={(e) => e.stopPropagation()}
                {...props}
              >
                <span>{children}</span>
                <ExternalLink size={11} className={styles.inlineLinkIcon} />
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const AIChatDrawer = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  // Active Session ID
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    return (
      localStorage.getItem(STORAGE_ACTIVE_SESSION_KEY) ||
      generateSecureSessionId()
    );
  });

  // Client-Side Session History List
  const [sessions, setSessions] = useState(() => loadLocalSessions());

  // Active Messages State
  const [messages, setMessages] = useState(() => {
    const local = loadLocalSessions();
    const active = local.find((s) => s.sessionId === localStorage.getItem(STORAGE_ACTIVE_SESSION_KEY));
    if (active && Array.isArray(active.messages) && active.messages.length > 0) {
      return active.messages;
    }
    return [INITIAL_GREETING];
  });

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  const handleCopyMessage = (msgId, text) => {
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
      setCopiedMessageId(msgId);
      setTimeout(() => {
        setCopiedMessageId((current) => (current === msgId ? null : current));
      }, 2000);
    } catch (err) {
      console.warn("Could not copy message to clipboard:", err);
    }
  };

  const renderMessageContent = (content, isUser = false) => {
    return <MarkdownMessage content={content} isUser={isUser} />;
  };

  const currentUserIdentifier =
    user?.role === "master_admin" || user?.username === "developermanikdas"
      ? "Manik"
      : user?.fullName || "Vanshika";

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Persist current session ID & active messages to local storage and sync local sessions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACTIVE_SESSION_KEY, currentSessionId);
    } catch (e) {
      console.warn("Error setting active session ID:", e);
    }

    setSessions((prevSessions) => {
      const existingIdx = prevSessions.findIndex((s) => s.sessionId === currentSessionId);
      const userFirstMsg = messages.find((m) => m.sender === "user");
      const title =
        existingIdx >= 0 && prevSessions[existingIdx].sessionTitle !== "New Conversation"
          ? prevSessions[existingIdx].sessionTitle
          : userFirstMsg
          ? (userFirstMsg.text.length > 32 ? `${userFirstMsg.text.slice(0, 32)}...` : userFirstMsg.text)
          : "New Conversation";

      const updatedEntry = {
        sessionId: currentSessionId,
        sessionTitle: title,
        userIdentifier: currentUserIdentifier,
        messages: messages,
        totalMessages: messages.filter((m) => m.id !== "init").length,
        lastActivityAt: new Date().toISOString(),
        createdAt: existingIdx >= 0 ? prevSessions[existingIdx].createdAt : new Date().toISOString(),
        clientDeleted: false,
      };

      let newSessions;
      if (existingIdx >= 0) {
        newSessions = [...prevSessions];
        newSessions[existingIdx] = updatedEntry;
      } else {
        newSessions = [updatedEntry, ...prevSessions];
      }

      saveLocalSessions(newSessions);
      return newSessions;
    });
  }, [messages, currentSessionId, currentUserIdentifier]);

  // Sync sessions with backend when drawer opens
  const fetchBackendSessions = async () => {
    setSyncing(true);
    try {
      const res = await fetch(
        `${API_BASE}/chat/sessions?userIdentifier=${encodeURIComponent(currentUserIdentifier)}`
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSessions((currentLocal) => {
          const mergedMap = new Map();
          // First add local
          currentLocal.forEach((s) => {
            if (s && s.sessionId) mergedMap.set(s.sessionId, s);
          });
          // Merge backend metadata if not present locally
          data.data.forEach((bs) => {
            if (bs && bs.sessionId) {
              if (!mergedMap.has(bs.sessionId)) {
                mergedMap.set(bs.sessionId, {
                  sessionId: bs.sessionId,
                  sessionTitle: bs.sessionTitle || "Conversation",
                  userIdentifier: bs.userIdentifier || currentUserIdentifier,
                  totalMessages: bs.totalMessages || 0,
                  messages: [],
                  lastActivityAt: bs.lastActivityAt || bs.createdAt,
                  createdAt: bs.createdAt,
                  clientDeleted: false,
                });
              }
            }
          });

          const mergedList = Array.from(mergedMap.values()).sort(
            (a, b) =>
              new Date(b.lastActivityAt || b.createdAt).getTime() -
              new Date(a.lastActivityAt || a.createdAt).getTime()
          );

          saveLocalSessions(mergedList);
          return mergedList;
        });
      }
    } catch (err) {
      console.warn("Could not sync backend chat sessions:", err);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBackendSessions();
    }
  }, [isOpen]);

  // Start a fresh new chat session
  const handleStartNewChat = () => {
    const newSessionId = generateSecureSessionId();
    setCurrentSessionId(newSessionId);
    setMessages([INITIAL_GREETING]);
    setIsSidebarOpen(false);
    setSearchQuery("");
  };

  // Select an existing session from history
  const handleSelectSession = async (session) => {
    const { sessionId } = session;
    if (sessionId === currentSessionId) {
      setIsSidebarOpen(false);
      return;
    }

    // Check if session messages are stored locally with actual messages
    if (Array.isArray(session.messages) && session.messages.length > 0) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
      setIsSidebarOpen(false);
      return;
    }

    // Otherwise fetch transcript from backend API
    try {
      const res = await fetch(`${API_BASE}/chat/sessions/${sessionId}`);
      const resData = await res.json();
      if (resData.success && resData.data) {
        const loadedMessages = (resData.data.messages || []).map((m) => ({
          id: m.id || m._id || `${Date.now()}_${Math.random()}`,
          sender: m.sender,
          text: m.text,
          time: new Date(m.timestamp || Date.now()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: new Date(m.timestamp || Date.now()).getTime(),
        }));

        const finalMsgs = loadedMessages.length > 0 ? loadedMessages : [INITIAL_GREETING];
        setCurrentSessionId(sessionId);
        setMessages(finalMsgs);

        // Update local cache
        setSessions((prev) => {
          const updated = prev.map((s) =>
            s.sessionId === sessionId ? { ...s, messages: finalMsgs } : s
          );
          saveLocalSessions(updated);
          return updated;
        });
      }
    } catch (err) {
      console.error("Failed to load session transcript:", err);
    } finally {
      setIsSidebarOpen(false);
    }
  };

  // Delete an individual session from history
  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();

    // 1. Remove from client local storage
    const remaining = sessions.filter((s) => s.sessionId !== sessionId);
    setSessions(remaining);
    saveLocalSessions(remaining);

    // 2. Soft-delete on backend in background
    try {
      await fetch(`${API_BASE}/chat/sessions/${sessionId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Failed to soft-delete on backend:", err);
    }

    // 3. If the currently active chat was deleted, start a new chat
    if (sessionId === currentSessionId) {
      handleStartNewChat();
    }
  };

  // Clear all client-side chat sessions
  const handleClearAllSessions = () => {
    localStorage.removeItem(STORAGE_SESSIONS_KEY);
    setSessions([]);
    setConfirmClearAll(false);
    handleStartNewChat();
  };

  // Send message
  const handleSend = async (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isTyping) return;

    const currentTime = new Date();
    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      time: currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: currentTime.getTime(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      const recentHistory = updatedMessages
        .filter((m) => m.id !== "init")
        .slice(-6)
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        }));

      const res = await fetch(`${API_BASE}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: recentHistory,
          sessionId: currentSessionId,
          userIdentifier: currentUserIdentifier,
        }),
      });

      const data = await res.json();
      const replyText =
        data.success && data.reply
          ? data.reply
          : "Thank you for reaching out. What else would you like to explore in the archive?";

      const botTime = new Date();
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: replyText,
        time: botTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timestamp: botTime.getTime(),
      };

      setMessages((prev) => [...prev, botMsg]);
      fetchBackendSessions();
    } catch {
      const fallbackTime = new Date();
      const fallbackMsg = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: "The archive is always here for quiet reflection, boundary awareness, and calm reassurance. What is on your mind?",
        time: fallbackTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timestamp: fallbackTime.getTime(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Filter sessions by search query
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase().trim();
    return sessions.filter((s) => {
      const matchTitle = s.sessionTitle?.toLowerCase().includes(q);
      const matchMsg = s.messages?.some((m) => m.text?.toLowerCase().includes(q));
      return matchTitle || matchMsg;
    });
  }, [sessions, searchQuery]);

  // Group filtered sessions chronologically
  const groupedSessions = useMemo(() => {
    return groupSessionsByTimeframe(filteredSessions);
  }, [filteredSessions]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      headerAction={
        <div className={styles.headerActions}>
          <button
            type="button"
            className={`${styles.sidebarToggleBtn} ${isSidebarOpen ? styles.sidebarToggleActive : ""}`}
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            title="Toggle Chat History Sidebar"
            aria-label="Toggle Chat History Sidebar"
          >
            {isSidebarOpen ? <PanelLeftClose size={15} /> : <PanelLeft size={15} />}
            <span className={styles.historyBtnLabel}>History</span>
            {sessions.length > 0 && (
              <span className={styles.historyCountBadge}>{sessions.length}</span>
            )}
          </button>

          <button
            type="button"
            className={styles.headerNewChatBtn}
            onClick={handleStartNewChat}
            title="Start New Chat"
            aria-label="Start New Chat"
          >
            <Plus size={14} />
            <span className={styles.newChatText}>New Chat</span>
          </button>
        </div>
      }
    >
      <div className={styles.container}>
        {/* ChatGPT-Style Sidebar Backdrop (for Mobile & Overlay) */}
        <div
          className={`${styles.sidebarBackdrop} ${isSidebarOpen ? styles.sidebarBackdropVisible : ""}`}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden={!isSidebarOpen}
        />

        {/* ChatGPT-Style Chat History Sidebar */}
        <aside
          className={`${styles.historySidebar} ${isSidebarOpen ? styles.historySidebarOpen : ""}`}
          aria-label="Chat history sidebar"
        >
          {/* Sidebar Top Section */}
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarTitleRow}>
              <div className={styles.sidebarTitleWrap}>
                <History size={14} color="var(--color-primary)" />
                <span className={styles.sidebarTitle}>Chat History</span>
                <span className={styles.sidebarBadge}>{sessions.length}</span>
              </div>

              <button
                type="button"
                className={styles.closeSidebarBtn}
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close history sidebar"
              >
                <X size={15} />
              </button>
            </div>

            {/* "+ New Chat" Action in Sidebar */}
            <button
              type="button"
              className={styles.sidebarNewChatBtn}
              onClick={handleStartNewChat}
            >
              <Plus size={14} />
              <span>New Conversation</span>
            </button>

            {/* Quick Search Box */}
            <div className={styles.sidebarSearchWrap}>
              <Search size={13} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.sidebarSearchInput}
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery("")}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar Grouped Sessions List */}
          <div className={styles.sidebarList}>
            {groupedSessions.length === 0 ? (
              <div className={styles.emptyHistory}>
                <MessageSquare size={20} className={styles.emptyIcon} />
                <p className={styles.emptyText}>
                  {searchQuery ? "No matching chats found." : "No conversations yet."}
                </p>
                <span className={styles.emptySubtext}>
                  {searchQuery ? "Try a different search term" : "Your previous reflections will be saved here."}
                </span>
              </div>
            ) : (
              groupedSessions.map((group) => (
                <div key={group.label} className={styles.timeGroup}>
                  <div className={styles.groupHeader}>{group.label}</div>
                  <div className={styles.groupItems}>
                    {group.items.map((s) => {
                      const isActive = s.sessionId === currentSessionId;
                      return (
                        <div
                          key={s.sessionId}
                          className={`${styles.sessionItem} ${isActive ? styles.sessionItemActive : ""}`}
                          onClick={() => handleSelectSession(s)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSelectSession(s);
                          }}
                        >
                          <div className={styles.sessionIconWrap}>
                            <MessageSquare
                              size={13}
                              className={isActive ? styles.sessionIconActive : styles.sessionIcon}
                            />
                          </div>

                          <div className={styles.sessionInfo}>
                            <span className={styles.sessionTitle}>
                              {s.sessionTitle || "Conversation"}
                            </span>

                            {/* Small, unobtrusive Date & Time */}
                            <span className={styles.sessionDateTime}>
                              {formatChatDateTime(s.lastActivityAt || s.createdAt)}
                            </span>
                          </div>

                          <button
                            type="button"
                            className={styles.sessionDeleteBtn}
                            onClick={(e) => handleDeleteSession(e, s.sessionId)}
                            title="Delete this chat"
                            aria-label={`Delete chat: ${s.sessionTitle}`}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar Footer */}
          <div className={styles.sidebarFooter}>
            {sessions.length > 0 && (
              <>
                {confirmClearAll ? (
                  <div className={styles.confirmClearRow}>
                    <span className={styles.confirmText}>Delete all chats?</span>
                    <div className={styles.confirmBtns}>
                      <button
                        type="button"
                        className={styles.confirmYesBtn}
                        onClick={handleClearAllSessions}
                      >
                        Yes, Clear
                      </button>
                      <button
                        type="button"
                        className={styles.confirmNoBtn}
                        onClick={() => setConfirmClearAll(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={styles.clearAllBtn}
                    onClick={() => setConfirmClearAll(true)}
                  >
                    <Trash2 size={12} />
                    <span>Clear all client chats</span>
                  </button>
                )}
              </>
            )}

            <div className={styles.privacyNote}>
              <span>Client Archive &bull; Private &amp; Instant</span>
            </div>
          </div>
        </aside>

        {/* Main Chat Conversation Area */}
        <div className={styles.chatArea}>
          {/* Messages Stream */}
          <div className={styles.messagesList}>
            {messages.map((m) => {
              const isUser = m.sender === "user";
              const isCopied = copiedMessageId === m.id;
              return (
                <div
                  key={m.id}
                  className={`${styles.message} ${
                    isUser ? styles.userMessage : styles.assistantMessage
                  }`}
                >
                  <div className={styles.bubble}>
                    <MarkdownMessage content={m.text} isUser={isUser} />
                  </div>
                  <div className={styles.msgFooter}>
                    <button
                      type="button"
                      className={styles.copyMsgBtn}
                      onClick={() => handleCopyMessage(m.id, m.text)}
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

            {isTyping && (
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

          {/* Suggestion Prompts for new/short chats */}
          {messages.length <= 2 && (
            <div className={styles.suggestions}>
              {defaultPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  className={styles.suggestionPill}
                  onClick={() => handleSend(prompt)}
                >
                  <Sparkles size={11} className={styles.pillIcon} />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          )}

          {/* Chat Message Input Area */}
          <form
            className={styles.inputArea}
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <Input
              variant="boxed"
              placeholder="Ask a reflection or safety question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
              containerClassName="flex-1"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={15} />
            </Button>
          </form>
        </div>
      </div>
    </Drawer>
  );
};

export default AIChatDrawer;
