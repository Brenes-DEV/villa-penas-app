import type { Paquete } from '../types/villa'
import { formatearColones } from '../utils/formato'

interface PaqueteCardProps {
  paquete: Paquete
  seleccionado: boolean
  onSeleccionar: (id: number) => void
}

export function PaqueteCard({ paquete, seleccionado, onSeleccionar }: PaqueteCardProps) {
  // Se muestran los primeros 3 servicios, como en la página oficial
  const servicios = [...paquete.paquetesServicios].sort((a, b) => a.orden - b.orden)
  const destacados = servicios.slice(0, 3)
  const restantes = servicios.length - destacados.length

  return (
    <article className={seleccionado ? 'tarjeta tarjeta--activa' : 'tarjeta'}>
      <h3>{paquete.nombre}</h3>
      <p className="precio">{formatearColones(paquete.precioColones)}</p>
      <p className="descripcion">{paquete.descripcion}</p>
      <div className="incluye">
        <p className="incluye__titulo">Incluye</p>
        <ul className="chips">
          {destacados.map((ps) => (
            <li key={ps.id}>{ps.servicio.nombre}</li>
          ))}
          {restantes > 0 && <li className="chips__mas">+{restantes} más</li>}
        </ul>
      </div>
      <button type="button" className="boton" onClick={() => onSeleccionar(paquete.id)}>
        {seleccionado ? 'Viendo lo que incluye' : 'Ver todo lo que incluye'}
      </button>
    </article>
  )
}
