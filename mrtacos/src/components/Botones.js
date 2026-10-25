import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

const estiloBoton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  padding: 8px 16px;
  border: 1px solid var(--vino);
  border-radius: 8px;
  color: #fff;
  background-color: var(--vino);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--vino-oscuro);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const estiloSecundario = css`
  color: var(--texto);
  background-color: transparent;
  border-color: var(--borde-campo);

  &:hover {
    background-color: var(--superficie-alta);
  }
`;

export const Boton = styled.button`
  ${estiloBoton}
  ${(props) => props.$secundario && estiloSecundario}
`;

export const BotonEnlace = styled(Link)`
  ${estiloBoton}
  ${(props) => props.$secundario && estiloSecundario}
`;
