import type { OpcionProductoAdicional } from '../types/villa'
import { formatearColones } from '../utils/formato'

interface OpcionCardProps {
  opcion: OpcionProductoAdicional
}

export function OpcionCard({ opcion }: OpcionCardProps) {
  return (
    <article className="tarjeta">
      <p className="producto">{opcion.productoAdicional.nombre}</p>
      <h3>{opcion.nombre}</h3>
      <p className="precio">{formatearColones(opcion.precioVentaColones)}</p>
      {opcion.descripcion && <p className="descripcion">{opcion.descripcion}</p>}
      <p className="meta">
        Para {opcion.cantidadPersonas} personas · {opcion.cantidadIncluida} {opcion.unidadMedida}
      </p>
    </article>
  )
}
