import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import * as api from "../services/api";
import { fechaISO, fechaLarga, hora } from "../utils/fechas";
import { formatoPrecio } from "../utils/platillos";

const Filtro = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 220px;
  margin-bottom: 8px;
  color: var(--texto-secundario);

  input {
    min-height: 44px;
    padding: 8px;
    border: 1px solid var(--borde-campo);
    border-radius: 8px;
  }
`;

const Resumen = styled.p`
  color: var(--texto-secundario);

  &::first-letter {
    text-transform: uppercase;
  }
`;

const Lista = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Enlace = styled(Link)`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--borde);
  border-left: 4px solid var(--vino);
  border-radius: 8px;
  color: var(--texto);
  background-color: var(--superficie);
  text-decoration: none;

  &:hover {
    background-color: var(--superficie-alta);
  }

  small {
    display: block;
    color: var(--texto-secundario);
  }
`;

function Log() {
  const [parametros, setParametros] = useSearchParams();
  const fecha = parametros.get("fecha") ?? fechaISO();
  const [resultado, setResultado] = useState({ fecha: null, tickets: [], error: "" });

  useEffect(() => {
    let activo = true;
    api
      .obtenerTickets(fecha)
      .then((tickets) => {
        if (activo) setResultado({ fecha, tickets, error: "" });
      })
      .catch(() => {
        if (activo) {
          setResultado({ fecha, tickets: [], error: "No se pudieron cargar los tickets." });
        }
      });
    return () => {
      activo = false;
    };
  }, [fecha]);

  const cargando = resultado.fecha !== fecha;
  const tickets = [...resultado.tickets].sort((a, b) => a.folio - b.folio);
  const totalDelDia = tickets.reduce((suma, t) => suma + t.total, 0);

  return (
    <>
      <h1>Log de órdenes</h1>
      <Filtro>
        Día
        <input
          type="date"
          value={fecha}
          max={fechaISO()}
          onChange={(e) => e.target.value && setParametros({ fecha: e.target.value })}
        />
      </Filtro>

      {cargando ? (
        <p>Cargando tickets…</p>
      ) : resultado.error ? (
        <p role="alert">{resultado.error}</p>
      ) : (
        <>
          <Resumen>
            {fechaLarga(fecha)}: {tickets.length}{" "}
            {tickets.length === 1 ? "ticket" : "tickets"}, {formatoPrecio(totalDelDia)}
          </Resumen>
          {tickets.length === 0 ? (
            <p>No hay tickets cobrados este día.</p>
          ) : (
            <Lista>
              {tickets.map((ticket) => (
                <li key={ticket.id}>
                  <Enlace to={`/log/${ticket.id}`}>
                    <strong>#{String(ticket.folio).padStart(3, "0")}</strong>
                    <span>
                      Mesa {ticket.mesa}
                      <small>Cobrado a las {hora(ticket.cierre)}</small>
                    </span>
                    <strong>{formatoPrecio(ticket.total)}</strong>
                  </Enlace>
                </li>
              ))}
            </Lista>
          )}
        </>
      )}
    </>
  );
}

export default Log;
