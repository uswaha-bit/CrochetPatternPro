import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5); /* light transparent background */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const SpinnerCircle = styled.div`
  border: ${({ $border }) => $border || '8px'} solid rgba(0, 0, 0, 0.1);
  border-top: ${({ $border }) => $border || '8px'} solid var(--color-accent, #4a3f35);
  border-radius: 50%;
  width: ${({ $size }) => $size || '64px'};
  height: ${({ $size }) => $size || '64px'};
  animation: ${spin} 1s linear infinite;
`;

function Spinner({ width, border, overlay = false }) {
  const spinner = <SpinnerCircle $size={width} $border={border} />;
  return overlay ? <Overlay>{spinner}</Overlay> : spinner;
}

export default Spinner;
