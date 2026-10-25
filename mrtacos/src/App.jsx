import { Link, Navigate, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Encabezado from "./components/Encabezado";
import MarcaDeAgua from "./components/MarcaDeAgua";
import { useOrdenes } from "./hooks/useOrdenes";
import AgregarPlatillos from "./pages/AgregarPlatillos";
import Log from "./pages/Log";
import Tablero from "./pages/Tablero";
import Ticket from "./pages/Ticket";

const Principal = styled.main`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
`;

const AvisoError = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid var(--vino-claro);
  border-radius: 8px;
  background-color: var(--vino-fondo);

  button {
    padding: 6px 10px;
    border: 1px solid var(--borde-campo);
    border-radius: 6px;
    color: var(--texto);
    background: transparent;
    cursor: pointer;
  }
`;

function App() {
  const { error, setError } = useOrdenes();

  return (
    <>
      <MarcaDeAgua />
      <Encabezado />
      <Principal>
        {error && (
          <AvisoError role="alert">
            {error}
            <button type="button" onClick={() => setError("")}>
              Cerrar
            </button>
          </AvisoError>
        )}
        <Routes>
          <Route path="/" element={<Navigate to="/mesa/1" replace />} />
          <Route path="/mesa" element={<Navigate to="/mesa/1" replace />} />
          <Route path="/mesa/:numero" element={<Tablero />} />
          <Route path="/mesa/:numero/agregar" element={<AgregarPlatillos />} />
          <Route path="/log" element={<Log />} />
          <Route path="/log/:id" element={<Ticket />} />
          <Route
            path="*"
            element={
              <>
                <h1>Página no encontrada</h1>
                <Link to="/">Volver a las mesas</Link>
              </>
            }
          />
        </Routes>
      </Principal>
    </>
  );
}

export default App;
