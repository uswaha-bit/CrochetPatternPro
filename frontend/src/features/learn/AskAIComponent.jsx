import { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { useChatReply } from "../../hooks/useAI";
import AskAIIcon from "../../assets/ask-ai.png";
import { FaUserCircle } from "react-icons/fa";
import {
  setCurrentQuestion,
  addUserMessage,
  addAIMessage,
  clearCurrentQuestion,
  selectChatHistory,
  selectCurrentQuestion,
} from "./chatSlice";
import { Heading, Lede, patchButton } from "./shared";
import { colors } from "../../ui/theme";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  height: min(68vh, 720px);
  min-height: 440px;
`;

/* A stitched panel: dashed border, lighter paper inside */
const ChatWindow = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  padding: 20px;
  border: 2px dashed ${colors.stitchLine};
  border-radius: 16px;
  background: ${colors.surface};
`;

const EmptyHint = styled.p`
  margin: auto;
  max-width: 32ch;
  text-align: center;
  font-size: 1.1rem;
  line-height: 1.5;
  color: ${colors.muted};
`;

const MessageWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex-direction: ${({ $role }) => ($role === "user" ? "row-reverse" : "row")};
`;

const Avatar = styled.div`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border: 2px solid ${colors.ink};
  border-radius: 50%;
  background: ${colors.paper};
  object-fit: cover;
`;

const MessageBubble = styled.div`
  box-sizing: border-box;
  max-width: min(75%, 60ch);
  padding: 12px 16px;
  border: 2px solid ${colors.ink};
  border-radius: ${({ $role }) =>
    $role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px"};
  background: ${({ $role }) => ($role === "user" ? colors.yarn : colors.paper)};
  color: ${colors.ink};
  font-size: 1rem;
  line-height: 1.55;
  white-space: pre-wrap;
`;

const InlineCode = styled.code`
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(22, 48, 32, 0.1);
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 0.9em;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const TextArea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  height: 96px;
  padding: 14px 16px;
  border: 2px solid ${colors.ink};
  border-radius: 12px;
  background: ${colors.surface};
  color: ${colors.ink};
  font: inherit;
  font-size: 1rem;
  resize: none;

  &::placeholder {
    color: ${colors.muted};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }
`;

const Button = styled.button`
  ${patchButton}
  align-self: flex-end;
`;

// Simple markdown parser component (logic unchanged)
const MarkdownText = ({ children }) => {
  const parseMarkdown = (text) => {
    const parts = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold text (**text** or *text*)
      const boldMatch = remaining.match(/(\*\*([^*]+)\*\*|\*([^*]+)\*)/);
      if (boldMatch) {
        if (boldMatch.index > 0) {
          parts.push(
            <span key={key++}>{remaining.slice(0, boldMatch.index)}</span>
          );
        }
        const boldText = boldMatch[2] || boldMatch[3];
        parts.push(<strong key={key++}>{boldText}</strong>);
        remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      }
      // Inline code (`code`)
      else {
        const codeMatch = remaining.match(/`([^`]+)`/);
        if (codeMatch) {
          if (codeMatch.index > 0) {
            parts.push(
              <span key={key++}>{remaining.slice(0, codeMatch.index)}</span>
            );
          }
          parts.push(<InlineCode key={key++}>{codeMatch[1]}</InlineCode>);
          remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
        } else {
          parts.push(<span key={key++}>{remaining}</span>);
          break;
        }
      }
    }

    return parts.length > 0 ? parts : [<span key={0}>{text}</span>];
  };

  return <>{parseMarkdown(children)}</>;
};

export default function AskAIComponent() {
  const dispatch = useDispatch();
  const history = useSelector(selectChatHistory);
  const currentQuestion = useSelector(selectCurrentQuestion);
  const { mutate: askAI, isPending } = useChatReply();
  const bottomRef = useRef();

  const handleAsk = () => {
    const trimmed = currentQuestion.trim();
    if (!trimmed) return;

    // Add user message to Redux store
    dispatch(addUserMessage(trimmed));

    // Create updated history for API call
    const updatedHistory = [...history, { role: "user", text: trimmed }];

    askAI(
      { history: updatedHistory, message: trimmed },
      {
        onSuccess: (reply) => {
          dispatch(addAIMessage(reply));
          dispatch(clearCurrentQuestion());
        },
        onError: (err) => {
          dispatch(addAIMessage(err.message || "Error occurred."));
          dispatch(clearCurrentQuestion());
        },
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleInputChange = (e) => {
    dispatch(setCurrentQuestion(e.target.value));
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  return (
    <>
      <Heading>Ask AI</Heading>
      <Lede>Stuck on a stitch or a step in the editor? Ask away.</Lede>

      <Wrap>
        <ChatWindow role="log" aria-live="polite" aria-label="Conversation">
          {history.length === 0 && (
            <EmptyHint>
              Ask about a stitch, a chart symbol, or anything in the editor.
            </EmptyHint>
          )}

          {history.map((entry, index) => (
            <MessageWrapper key={index} $role={entry.role}>
              <Avatar>
                {entry.role === "user" ? (
                  <FaUserCircle size={36} color={colors.ink} />
                ) : (
                  <AvatarImage src={AskAIIcon} alt="AI" />
                )}
              </Avatar>
              <MessageBubble $role={entry.role}>
                {entry.role === "model" ? (
                  <MarkdownText>{entry.text}</MarkdownText>
                ) : (
                  entry.text
                )}
              </MessageBubble>
            </MessageWrapper>
          ))}
          <div ref={bottomRef} />
        </ChatWindow>

        <InputArea>
          <TextArea
            placeholder="Type your question here..."
            aria-label="Your question"
            value={currentQuestion}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <Button
            type="button"
            onClick={handleAsk}
            disabled={!currentQuestion.trim() || isPending}
          >
            {isPending ? "Thinking..." : "Ask"}
          </Button>
        </InputArea>
      </Wrap>
    </>
  );
}