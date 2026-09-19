import styled from "styled-components";
import { colors } from "./theme";

/* ---------- Posts: flat entries divided by a stitch line ---------- */
export const Post = styled.article`
  padding: 32px 0;
  border-top: 2px dashed ${colors.stitchLine};
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
`;

export const PostUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
`;

export const Avatar = styled.img`
  flex: none;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: 2px solid ${colors.ink};
  border-radius: 50%;
  background: ${colors.paper};
  object-fit: cover;
  object-position: center;
`;

export const PostUserDetails = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const PostUserName = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.2;
  text-transform: capitalize;
`;

export const PostUserRole = styled.span`
  color: ${colors.muted};
  font-size: 0.9rem;
  text-transform: capitalize;
`;

export const PostMeta = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  gap: 14px;
`;

export const PostTime = styled.span`
  color: ${colors.muted};
  font-size: 0.9rem;
`;

export const PostTitle = styled.h2`
  margin: 0 0 10px;
  font-size: clamp(1.35rem, 2.4vw, 1.75rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
`;

export const PostDesc = styled.p`
  margin: 0 0 20px;
  color: ${colors.muted};
  font-size: 1.02rem;
  line-height: 1.6;
  white-space: pre-line;
  overflow-wrap: anywhere;
`;

export const MediaFrame = styled.div`
  margin-bottom: 16px;
  overflow: hidden;
  border: 2px solid ${colors.ink};
  border-radius: 14px;
`;

export const PostActions = styled.div`
  display: flex;
  gap: 8px;
  margin-left: -10px; /* align the icons with the text above */
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 6px 10px;
  border: 0;
  border-radius: 10px;
  background: none;
  color: ${({ $active, $activeColor }) =>
    $active ? $activeColor : colors.muted};
  font: inherit;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  svg {
    font-size: 20px;
  }

  &:hover {
    background: rgba(22, 48, 32, 0.08);
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }
`;


/* Small square icon button (edit, delete, ...) */
export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  background: none;
  color: ${({ $danger }) => ($danger ? colors.error : colors.ink)};
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: rgba(22, 48, 32, 0.08);
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }
`;