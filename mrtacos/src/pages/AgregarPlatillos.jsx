import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Boton, BotonEnlace } from "../components/Botones";
import { useOrdenes } from "../hooks/useOrdenes";
import { MESAS, TIEMPOS } from "../data/opciones";
import { formatoPrecio } from "../utils/platillos";

const Grupo = styled.section`
  margin-bottom: 20px;

  h2 {
    margin: 0 0 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid var(--vino);
    font-size: 1.1rem;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
`;

const Fila = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--borde);
  border-radius: 8px;
  background-color: ${(props) =>
    props.$seleccionado ? "var(--vino-fondo)" : "var(--superficie)"};

  small {
    display: block;
    color: var(--texto-secundario);
  }
`;

const Contador = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;

  button {
    width: 40px;
    height: 40px;
    border: 1px solid var(--borde-campo);
    border-radius: 50%;
    color: var(--texto);
    background-color: var(--superficie-alta);
    font-size: 1.2rem;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  output {
    min-width: 1.5em;
    font-weight: 700;
    text-align: center;
  }
`;

const Pie = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px 12px;
  margin: 0 -16px;
  padding: 12px 16px;
  border-top: 2px solid var(--vino);
  background-color: var(--superficie);

  p {
    flex: 1;
    margin: 0;
    font-weight: 700;
  }
`;

function AgregarPlatillos() {
  const { numero } = useParams();
  const mesa = Number(numero);
  const { menu, cargando, agregarPlatillos } = useOrdenes();
  const navigate = useNavigate();
  const [cantidades, setCantidades] = useState({});
  const [guardando, setGuardando] = useState(false);

  if (!MESAS.includes(mesa)) {
    return <Navigate to="/mesa/1" replace />;
  }

  const cambiarCantidad = (id, cambio) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + cambio),
    }));
  };

  const seleccion = menu
    .filter((platillo) => cantidades[platillo.id] > 0)
    .map((platillo) => ({ platillo, cantidad: cantidades[platillo.id] }));
  const total = seleccion.reduce((suma, s) => suma + s.platillo.precio * s.cantidad, 0);

  const guardar = async () => {
    setGuardando(true);
    const guardado = await agregarPlatillos(mesa, seleccion);
    setGuardando(false);
    if (guardado) navigate(`/mesa/${mesa}`);
  };

  return (
    <>
      <h1>Agregar a la mesa {mesa}</h1>
      {cargando && <p>Cargando menú…</p>}

      {Object.entries(TIEMPOS).map(([tipo, tiempo]) => (
        <Grupo key={tipo} aria-labelledby={`grupo-${tipo}`}>
          <h2 id={`grupo-${tipo}`}>{tiempo.plural}</h2>
          <ul>
            {menu
              .filter((platillo) => platillo.tipo === tipo)
              .map((platillo) => {
                const cantidad = cantidades[platillo.id] ?? 0;
                return (
                  <Fila key={platillo.id} $seleccionado={cantidad > 0}>
                    <div>
                      {platillo.nombre}
                      <small>
                        {platillo.detalle && `${platillo.detalle} · `}
                        {formatoPrecio(platillo.precio)}
                      </small>
                    </div>
                    <Contador>
                      <button
                        type="button"
                        onClick={() => cambiarCantidad(platillo.id, -1)}
                        disabled={cantidad === 0}
                        aria-label={`Quitar uno de ${platillo.nombre}`}
                      >
                        −
                      </button>
                      <output aria-label={`Cantidad de ${platillo.nombre}`}>
                        {cantidad}
                      </output>
                      <button
                        type="button"
                        onClick={() => cambiarCantidad(platillo.id, 1)}
                        aria-label={`Agregar uno de ${platillo.nombre}`}
                      >
                        +
                      </button>
                    </Contador>
                  </Fila>
                );
              })}
          </ul>
        </Grupo>
      ))}

      <Pie>
        <p>Total a agregar: {formatoPrecio(total)}</p>
        <BotonEnlace to={`/mesa/${mesa}`} $secundario>
          Cancelar
        </BotonEnlace>
        <Boton
          type="button"
          onClick={guardar}
          disabled={seleccion.length === 0 || guardando}
        >
          {guardando ? "Guardando…" : `Agregar a la mesa ${mesa}`}
        </Boton>
      </Pie>
    </>
  );
}

export default AgregarPlatillos;
