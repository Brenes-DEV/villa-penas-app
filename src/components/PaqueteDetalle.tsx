import { useApi } from '../hooks/useApi'
import { obtenerPaquetePorId } from '../services/villaApi'
import { formatearColones } from '../utils/formato'
import { Cargando, MensajeError, SinResultados } from './Estados'

interface PaqueteDetalleProps {
  id: number
  onCerrar: () => void
}

export function PaqueteDetalle({ id, onCerrar }: PaqueteDetalleProps) {
  // Cada vez que cambia el id se consulta de nuevo el endpoint de detalle
  const { datos, cargando, error, reintentar } = useApi(
    (signal) => obtenerPaquetePorId(id, signal),
    [id],
  )

  const servicios = datos ? [...datos.paquetesServicios].sort((a, b) => a.orden - b.orden) : []

  return (
    <aside className="detalle" aria-label="Detalle del paquete">
      <div className="detalle__encabezado">
        <h2>Todo lo que incluye</h2>
        <button type="button" className="boton boton--secundario" onClick={onCerrar}>
          Cerrar
        </button>
      </div>

      {cargando && <Cargando texto="Consultando el paquete…" />}
      {!cargando && error && <MensajeError mensaje={error} onReintentar={reintentar} />}

      {!cargando && !error && datos && (
        <>
          <h3>{datos.nombre}</h3>
          <p className="precio">{formatearColones(datos.precioColones)}</p>
          <p className="descripcion">{datos.descripcion}</p>

          <h4>{servicios.length} servicios incluidos</h4>
          {servicios.length === 0 ? (
            <SinResultados texto="Este paquete no tiene servicios registrados." />
          ) : (
            <ul className="servicios">
              {servicios.map((ps) => (
                <li key={ps.id}>
                  <strong>{ps.servicio.nombre}</strong>
                  {ps.servicio.descripcion && <span>{ps.servicio.descripcion}</span>}
                  {ps.detalle && <span className="meta">{ps.detalle}</span>}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </aside>
  )
}
