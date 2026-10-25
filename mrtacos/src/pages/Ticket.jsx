import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import IconoFilete from "../components/IconoFilete";
import * as api from "../services/api";
import { fechaLarga, hora } from "../utils/fechas";
import { formatoPrecio } from "../utils/platillos";

const Hoja = styled.article`
  max-width: 480px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid var(--borde);
  border-top: 6px solid var(--vino);
  border-radius: 10px;
  background-color: var(--superficie);

  header {
    text-align: center;
  }

  header h1 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 0;
  }

  header p {
    margin: 4px 0 0;
    color: var(--texto-secundario);
  }
`;

const Datos = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 12px;
  margin: 16px 0;

  dt {
    color: var(--texto-secundario);
  }

  dd {
    margin: 0;
    text-align: right;
  }

  dd::first-letter {
    text-transform: uppercase;
  }
`;

const Tabla = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;

  th,
  td {
    padding: 6px 4px;
    text-align: left;
  }

  th {
    border-bottom: 1px solid var(--vino);
    color: var(--texto-secundario);
    font-weight: 600;
  }

  .numero {
    text-align: right;
    white-space: nowrap;
  }

  tfoot tr:first-child td {
    border-top: 1px dashed var(--borde-campo);
  }

  tfoot tr:last-child td {
    font-size: 1.15rem;
    font-weight: 800;
  }
`;

const Nota = styled.p`
  margin: 16px 0 0;
  color: var(--texto-secundario);
  font-size: 0.85rem;
  text-align: center;
`;

function Ticket() {
  const { id } = useParams();
  const [resultado, setResultado] = useState({ id: null, ticket: null });

  useEffect(() => {
    let activo = true;
    api
      .obtenerTicket(id)
      .then((ticket) => {
        if (activo) setResultado({ id, ticket });
      })
      .catch(() => {
        if (activo) setResultado({ id, ticket: null });
      });
    return () => {
      activo = false;
    };
  }, [id]);

  if (resultado.id !== id) return <p>Cargando ticket…</p>;

  const { ticket } = resultado;
  if (!ticket) {
    return (
      <>
        <h1>Ticket no encontrado</h1>
        <Link to="/log">Volver al log</Link>
      </>
    );
  }

  return (
    <>
      <p>
        <Link to={`/log?fecha=${ticket.fecha}`}>‹ Volver al log</Link>
      </p>
      <Hoja aria-label={`Ticket ${ticket.folio}`}>
        <header>
          <h1>
            <IconoFilete tamano={32} />
            Mr. Tacos
          </h1>
          <p>Ticket #{String(ticket.folio).padStart(3, "0")}</p>
        </header>

        <Datos>
          <dt>Fecha</dt>
          <dd>{fechaLarga(ticket.fecha)}</dd>
          <dt>Mesa</dt>
          <dd>{ticket.mesa}</dd>
          <dt>Apertura</dt>
          <dd>{hora(ticket.apertura)}</dd>
          <dt>Cobro</dt>
          <dd>{hora(ticket.cierre)}</dd>
        </Datos>

        <Tabla>
          <thead>
            <tr>
              <th>Cant.</th>
              <th>Platillo</th>
              <th className="numero">P. unit.</th>
              <th className="numero">Importe</th>
            </tr>
          </thead>
          <tbody>
            {ticket.platillos.map((platillo) => (
              <tr key={platillo.nombre}>
                <td>{platillo.cantidad}</td>
                <td>{platillo.nombre}</td>
                <td className="numero">{formatoPrecio(platillo.precio)}</td>
                <td className="numero">{formatoPrecio(platillo.importe)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Subtotal</td>
              <td className="numero">{formatoPrecio(ticket.subtotal)}</td>
            </tr>
            <tr>
              <td colSpan="3">IVA (16%)</td>
              <td className="numero">{formatoPrecio(ticket.iva)}</td>
            </tr>
            <tr>
              <td colSpan="3">Total</td>
              <td className="numero">{formatoPrecio(ticket.total)}</td>
            </tr>
          </tfoot>
        </Tabla>

        <Nota>Precios con IVA incluido. ¡Gracias por su visita!</Nota>
      </Hoja>
    </>
  );
}

export default Ticket;
