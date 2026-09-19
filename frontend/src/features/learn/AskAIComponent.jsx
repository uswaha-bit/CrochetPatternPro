import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useChatReply } from '../../hooks/useAI';
import AskAIIcon from '../../assets/ask-ai.png';
import { FaUserCircle } from 'react-icons/fa';
import {
  setCurrentQuestion,
  addUserMessage,
  addAIMessage,
  clearCurrentQuestion,
  selectChatHistory,
  selectCurrentQuestion,
} from './chatSlice'; 

const AskAIContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  max-height: 800px;
  background-color: #f7f9fc;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

const ChatWindow = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex-direction: ${({ role }) => (role === 'user' ? 'row-reverse' : 'row')};
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const MessageBubble = styled.div`
  padding: 1rem;
  border-radius: 14px;
  max-width: 70%;
  font-size: 1rem;
  color: #2c3e50;
  white-space: pre-wrap;
  background-color: ${({ role }) => (role === 'user' ? '#dbeafe' : '#eef1f7')};
  line-height: 1.5;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  padding: 1rem;
  font-size: 1rem;
  border-radius: 12px;
  border: 1px solid #ccc;
  resize: none;
  height: 100px;
  background: #fff;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: var(--primary-color, #6c5ce7);
  }
`;

const Button = styled.button`
  align-self: flex-end;
  padding: 0.75rem 1.5rem;
  background-color: #6c5ce7;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #574b90;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Simple markdown parser component
const MarkdownText = ({ children }) => {
  const parseMarkdown = (text) => {
    const parts = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold text (**text** or *text*)
      const boldMatch = remaining.match(/(\*\*([^*]+)\*\*|\*([^*]+)\*)/);
      if (boldMatch) {
        // Add text before bold
        if (boldMatch.index > 0) {
          parts.push(<span key={key++}>{remaining.slice(0, boldMatch.index)}</span>);
        }
        // Add bold text
        const boldText = boldMatch[2] || boldMatch[3];
        parts.push(<strong key={key++}>{boldText}</strong>);
        remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      }
      // Inline code (`code`)
      else {
        const codeMatch = remaining.match(/`([^`]+)`/);
        if (codeMatch) {
          // Add text before code
          if (codeMatch.index > 0) {
            parts.push(<span key={key++}>{remaining.slice(0, codeMatch.index)}</span>);
          }
          // Add code
          parts.push(
            <code 
              key={key++} 
              style={{
                backgroundColor: '#f1f5f9',
                padding: '0.125rem 0.375rem',
                borderRadius: '4px',
                fontFamily: 'Monaco, Consolas, monospace',
                fontSize: '0.875rem',
                color: '#e53e3e'
              }}
            >
              {codeMatch[1]}
            </code>
          );
          remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
        } else {
          // No more markdown, add remaining text
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
    const updatedHistory = [...history, { role: 'user', text: trimmed }];

    askAI(
      { history: updatedHistory, message: trimmed },
      {
        onSuccess: (reply) => {
          // Add AI response to Redux store
          dispatch(addAIMessage(reply));
          // Clear the current question
          dispatch(clearCurrentQuestion());
        },
        onError: (err) => {
          // Add error message to Redux store
          dispatch(addAIMessage(err.message || 'Error occurred.'));
          // Clear the current question even on error
          dispatch(clearCurrentQuestion());
        },
      }
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleInputChange = (e) => {
    dispatch(setCurrentQuestion(e.target.value));
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  return (
    <AskAIContainer>
      <ChatWindow>
        {history.map((entry, index) => (
          <MessageWrapper key={index} role={entry.role}>
            <Avatar>
              {entry.role === 'user' ? (
                <FaUserCircle size={36} color="black" />
              ) : (
                <AvatarImage src={AskAIIcon} alt="AI Avatar" />
              )}
            </Avatar>
            <MessageBubble role={entry.role}>
              {entry.role === 'model' ? (
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
          value={currentQuestion}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <Button onClick={handleAsk} disabled={!currentQuestion.trim() || isPending}>
          {isPending ? 'Thinking...' : 'Ask'}
        </Button>
      </InputArea>
    </AskAIContainer>
  );
}