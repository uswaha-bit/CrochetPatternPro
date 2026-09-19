import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { FaCommentDots } from "react-icons/fa";
import { io } from "socket.io-client";
import { URL } from "../../config";
import { colors, fontStack, patchButton } from "../../ui/theme";

/* ---------- Launcher (closed state) ---------- */
const Launcher = styled.button`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: 2px solid ${colors.ink};
  border-radius: 50%;
  background: ${colors.yarn};
  color: ${colors.ink};
  font-size: 26px;
  cursor: pointer;
  box-shadow: 0 4px 0 ${colors.ink};
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 ${colors.ink};
  }

  &:active {
    transform: translateY(3px);
    box-shadow: 0 1px 0 ${colors.ink};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const UnreadBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  box-sizing: border-box;
  padding: 0 5px;
  border: 2px solid ${colors.ink};
  border-radius: 12px;
  background: ${colors.error};
  color: ${colors.surface};
  font-family: ${fontStack};
  font-size: 12px;
  font-weight: 700;
`;

/* ---------- Panel (open state): the stitched swatch again ---------- */
const Panel = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: min(350px, calc(100vw - 32px));
  height: min(500px, calc(100dvh - 40px));
  border: 2px solid ${colors.ink};
  border-radius: 20px;
  background: ${colors.surface};
  color: ${colors.ink};
  font-family: ${fontStack};
  box-shadow: 0 6px 0 ${colors.ink};
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 12px 18px;
  border-bottom: 2px dashed ${colors.stitchLine};
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 2px solid ${colors.ink};
  border-radius: 10px;
  background: transparent;
  color: ${colors.ink};
  font: inherit;
  font-size: 1.3rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${colors.ink};
    color: ${colors.paper};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const MessagesArea = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding: 16px;
  background: ${colors.paper};
`;

const EmptyText = styled.p`
  margin: auto;
  max-width: 24ch;
  color: ${colors.muted};
  text-align: center;
  line-height: 1.5;
`;

const MessageRow = styled.div`
  display: flex;
  justify-content: ${({ $own }) => ($own ? "flex-end" : "flex-start")};
`;

const Bubble = styled.div`
  box-sizing: border-box;
  max-width: 75%;
  padding: 8px 12px;
  border: 2px solid ${colors.ink};
  border-radius: ${({ $own }) =>
    $own ? "14px 4px 14px 14px" : "4px 14px 14px 14px"};
  background: ${({ $own }) => ($own ? colors.yarn : colors.surface)};
  color: ${colors.ink};
  line-height: 1.45;
  overflow-wrap: anywhere;
`;

const Time = styled.div`
  margin-top: 4px;
  font-size: 0.72rem;
  opacity: 0.7;
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const Dots = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${colors.muted};
`;

const Dot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${colors.ink};
  animation: ${bounce} 1.4s infinite ease-in-out;
  animation-delay: ${({ $i }) => $i * 0.16}s;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 2px dashed ${colors.stitchLine};
`;

const TextInput = styled.input`
  box-sizing: border-box;
  flex: 1;
  min-width: 0;
  height: 44px;
  padding: 0 14px;
  border: 2px solid ${colors.ink};
  border-radius: 12px;
  background: ${colors.surface};
  color: ${colors.ink};
  font: inherit;
  font-size: 0.95rem;

  &::placeholder {
    color: ${colors.muted};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const SendButton = styled.button`
  ${patchButton}
  flex: none;
  min-height: 44px;
  padding: 0 18px;
  font-size: 0.95rem;
`;

const Banner = styled.div`
  padding: 8px;
  border-top: 2px solid ${colors.ink};
  background: ${colors.yarn};
  color: ${colors.ink};
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
`;

/* ---------- Pieces ---------- */
const Message = ({ message, isOwn = false, timestamp }) => (
  <MessageRow $own={isOwn}>
    <Bubble $own={isOwn}>
      <div>{message}</div>
      {timestamp && (
        <Time>
          {new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Time>
      )}
    </Bubble>
  </MessageRow>
);

const TypingIndicator = () => (
  <MessageRow>
    <Bubble aria-label="Typing">
      <Dots>
        <span>Typing</span>
        {[1, 2, 3].map((i) => (
          <Dot key={i} $i={i} />
        ))}
      </Dots>
    </Bubble>
  </MessageRow>
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

  const handleKeyDown = (e) => {
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
    <InputRow>
      <TextInput
        type="text"
        value={message}
        onChange={(e) => handleTyping(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        aria-label="Message"
        disabled={disabled}
      />
      <SendButton
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !message.trim()}
      >
        Send
      </SendButton>
    </InputRow>
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

  if (!isOpen) {
    return (
      <Launcher
        type="button"
        onClick={toggleChat}
        aria-label={
          unreadCount > 0
            ? `Open chat, ${unreadCount} unread messages`
            : "Open chat"
        }
      >
        <FaCommentDots />
        {unreadCount > 0 && (
          <UnreadBadge aria-hidden="true">
            {unreadCount > 9 ? "9+" : unreadCount}
          </UnreadBadge>
        )}
      </Launcher>
    );
  }

  return (
    <Panel role="dialog" aria-label="Chat support">
      <HeaderBar>
        <HeaderTitle>Chat support</HeaderTitle>
        <CloseButton type="button" aria-label="Close chat" onClick={toggleChat}>
          ×
        </CloseButton>
      </HeaderBar>

      <MessagesArea role="log" aria-live="polite">
        {messages.length === 0 ? (
          <EmptyText>No messages yet. Start a conversation!</EmptyText>
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
      </MessagesArea>

      <ChatInput onSendMessage={handleSendMessage} disabled={!isConnected} />
      {!isConnected && <Banner>Connecting...</Banner>}
    </Panel>
  );
};