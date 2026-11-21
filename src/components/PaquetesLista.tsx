import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { obtenerPaquetes } from '../services/villaApi'
import { normalizar } from '../utils/formato'
import { Buscador } from './Buscador'
import { Cargando, MensajeError, SinResultados } from './Estados'
import { PaqueteCard } from './PaqueteCard'

interface PaquetesListaProps {
  seleccionadoId: number | null
  onSeleccionar: (id: number) => void
}

export function PaquetesLista({ seleccionadoId, onSeleccionar }: PaquetesListaProps) {
  const { datos, cargando, error, reintentar } = useApi(obtenerPaquetes, [])
  const [busqueda, setBusqueda] = useState('')

  if (cargando) return <Cargando texto="Cargando paquetes…" />
  if (error) return <MensajeError mensaje={error} onReintentar={reintentar} />

  const paquetes = datos ?? []
  const termino = normalizar(busqueda)

  // Busca por nombre, descripción o por el nombre de cualquier servicio incluido
  const filtrados = paquetes.filter((p) => {
    const servicios = p.paquetesServicios.map((ps) => ps.servicio.nombre).join(' ')
    return normalizar(`${p.nombre} ${p.descripcion ?? ''} ${servicios}`).includes(termino)
  })

  return (
    <section className="seccion">
      <div className="filtros">
        <Buscador
          valor={busqueda}
          onCambio={setBusqueda}
          placeholder="Busca un paquete o servicio (ej. piscina)"
        />
      </div>
      <p className="contador">
        {filtrados.length} de {paquetes.length} paquetes
      </p>

      {filtrados.length === 0 ? (
        <SinResultados
          texto={
            paquetes.length === 0
              ? 'No hay paquetes disponibles en este momento.'
              : `Ningún paquete coincide con "${busqueda}".`
          }
          onLimpiar={busqueda ? () => setBusqueda('') : undefined}
        />
      ) : (
        <div className="grilla">
          {filtrados.map((p) => (
            <PaqueteCard
              key={p.id}
              paquete={p}
              seleccionado={p.id === seleccionadoId}
              onSeleccionar={onSeleccionar}
            />
          ))}
        </div>
      )}
    </section>
  )
}
