import styled from "styled-components";
import IconoFilete from "./IconoFilete";

const Fondo = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0.08;
  pointer-events: none;
  user-select: none;
  transform: rotate(-12deg);

  svg {
    width: 40vmin;
    height: 40vmin;
  }

  span {
    font-size: 14vmin;
    font-weight: 800;
    white-space: nowrap;
  }
`;

function MarcaDeAgua() {
  return (
    <Fondo aria-hidden="true">
      <IconoFilete />
      <span>Mr. Tacos</span>
    </Fondo>
  );
}

export default MarcaDeAgua;
