import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { URL } from "../../config";
// Styled Components
const ChatContainer = ({ isOpen = false, children, ...props }) => (
  <div
    {...props}
    style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: isOpen ? "350px" : "60px",
      height: isOpen ? "500px" : "60px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      transition: "all 0.3s ease",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

const ChatToggle = ({ onClick, isOpen, unreadCount = 0 }) => (
  <button
    onClick={onClick}
    style={{
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundColor: "#007bff",
      border: "none",
      color: "white",
      fontSize: "24px",
      cursor: "pointer",
      position: "absolute",
      bottom: isOpen ? "10px" : "0",
      right: isOpen ? "10px" : "0",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    }}
  >
    {isOpen ? "×" : "💬"}
    {unreadCount > 0 && !isOpen && (
      <span
        style={{
          position: "absolute",
          top: "-5px",
          right: "-5px",
          backgroundColor: "#ff4444",
          color: "white",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {unreadCount > 9 ? "9+" : unreadCount}
      </span>
    )}
  </button>
);

const ChatHeader = () => (
  <div
    style={{
      padding: "15px",
      backgroundColor: "#007bff",
      color: "white",
      fontWeight: "bold",
      borderRadius: "10px 10px 0 0",
    }}
  >
    Chat Support
  </div>
);

const MessagesContainer = ({ children }) => (
  <div
    style={{
      flex: 1,
      padding: "10px",
      overflowY: "auto",
      backgroundColor: "#f8f9fa",
    }}
  >
    {children}
  </div>
);

const Message = ({ message, isOwn = false, timestamp }) => (
  <div
    style={{
      display: "flex",
      justifyContent: isOwn ? "flex-end" : "flex-start",
      marginBottom: "10px",
    }}
  >
    <div
      style={{
        maxWidth: "70%",
        padding: "8px 12px",
        borderRadius: "15px",
        backgroundColor: isOwn ? "#007bff" : "#e9ecef",
        color: isOwn ? "white" : "#333",
      }}
    >
      <div>{message}</div>
      {timestamp && (
        <div
          style={{
            fontSize: "11px",
            opacity: 0.7,
            marginTop: "4px",
          }}
        >
          {new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}
    </div>
  </div>
);

const TypingIndicator = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-start",
      marginBottom: "10px",
    }}
  >
    <div
      style={{
        padding: "8px 12px",
        borderRadius: "15px",
        backgroundColor: "#e9ecef",
        color: "#666",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <span>Typing</span>
        <div
          style={{
            display: "flex",
            gap: "2px",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: "#666",
                animation: `bounce 1.4s infinite ease-in-out`,
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ChatInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTyping = (value) => {
    setMessage(value);

    if (!isTyping && value.trim()) {
      setIsTyping(true);
      // Emit typing event here if needed
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // Emit stop typing event here if needed
    }, 1000);
  };

  return (
    <div
      style={{
        padding: "10px",
        borderTop: "1px solid #ddd",
        display: "flex",
        gap: "8px",
      }}
    >
      <input
        type="text"
        value={message}
        onChange={(e) => handleTyping(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        disabled={disabled}
        style={{
          flex: 1,
          padding: "8px 12px",
          border: "1px solid #ddd",
          borderRadius: "20px",
          outline: "none",
          fontSize: "14px",
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !message.trim()}
        style={{
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "20px",
          cursor: "pointer",
          fontSize: "14px",
          opacity: disabled || !message.trim() ? 0.5 : 1,
        }}
      >
        Send
      </button>
    </div>
  );
};

// Main Chat Widget Component
export const ChatWidget = ({ userId, chatId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(URL, { withCredentials: true });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    newSocket.on("connected", () => {
      console.log("Socket authenticated");
    });

    newSocket.on("message received", (messageData) => {
      console.log("Message received:", messageData);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: messageData.data.content,
          sender: messageData.data.sender,
          timestamp: messageData.data.createdAt || new Date(),
          isOwn: false,
        },
      ]);

      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    newSocket.on("typing", ({ user, chatId: typingChatId }) => {
      if (typingChatId === chatId) {
        setIsTyping(true);
      }
    });

    newSocket.on("stop typing", ({ user, chatId: typingChatId }) => {
      if (typingChatId === chatId) {
        setIsTyping(false);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [chatId, isOpen]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear unread count when chat is opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (messageContent) => {
    if (!socket || !isConnected) {
      console.error("Socket not connected");
      return;
    }

    const messageData = {
      data: {
        content: messageContent,
        chat: {
          participants: [
            { _id: userId },
            { _id: "recipient_id" }, // Replace with actual recipient ID
          ],
        },
        sender: userId,
        createdAt: new Date(),
      },
    };

    // Add message to local state immediately
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: messageContent,
        sender: userId,
        timestamp: new Date(),
        isOwn: true,
      },
    ]);

    // Emit to server
    socket.emit("new message", messageData);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Add CSS animation for typing dots
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes bounce {
        0%, 80%, 100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <ChatContainer isOpen={isOpen}>
      {isOpen && (
        <>
          <ChatHeader />
          <MessagesContainer>
            {messages.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#666",
                  marginTop: "20px",
                }}
              >
                No messages yet. Start a conversation!
              </div>
            ) : (
              messages.map((msg) => (
                <Message
                  key={msg.id}
                  message={msg.content}
                  isOwn={msg.isOwn}
                  timestamp={msg.timestamp}
                />
              ))
            )}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </MessagesContainer>
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={!isConnected}
          />
          {!isConnected && (
            <div
              style={{
                padding: "8px",
                backgroundColor: "#ffc107",
                color: "#856404",
                textAlign: "center",
                fontSize: "12px",
              }}
            >
              Connecting...
            </div>
          )}
        </>
      )}
      <ChatToggle
        onClick={toggleChat}
        isOpen={isOpen}
        unreadCount={unreadCount}
      />
    </ChatContainer>
  );
};
