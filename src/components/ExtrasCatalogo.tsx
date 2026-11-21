import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { obtenerOpcionesAdicionales } from '../services/villaApi'
import { normalizar } from '../utils/formato'
import { Buscador } from './Buscador'
import { Cargando, MensajeError, SinResultados } from './Estados'
import { OpcionCard } from './OpcionCard'
import { Selector } from './Selector'

export function ExtrasCatalogo() {
  const { datos, cargando, error, reintentar } = useApi(obtenerOpcionesAdicionales, [])
  const [busqueda, setBusqueda] = useState('')
  const [productoId, setProductoId] = useState('todos')

  if (cargando) return <Cargando texto="Cargando productos adicionales…" />
  if (error) return <MensajeError mensaje={error} onReintentar={reintentar} />

  const opciones = datos ?? []

  // Lista de productos sin repetir, sacada de las mismas opciones, para llenar el filtro
  const productos = Array.from(
    new Map(opciones.map((o) => [o.productoAdicional.id, o.productoAdicional])).values(),
  )

  const termino = normalizar(busqueda)
  const filtradas = opciones.filter((o) => {
    const coincideProducto = productoId === 'todos' || o.productoAdicionalId === Number(productoId)
    const texto = normalizar(`${o.productoAdicional.nombre} ${o.nombre} ${o.descripcion ?? ''}`)
    return coincideProducto && texto.includes(termino)
  })

  const hayFiltros = busqueda !== '' || productoId !== 'todos'
  const limpiar = () => {
    setBusqueda('')
    setProductoId('todos')
  }

  return (
    <section className="seccion">
      <div className="filtros">
        <Buscador
          valor={busqueda}
          onCambio={setBusqueda}
          placeholder="Busca un extra (ej. chocolate)"
        />
        <Selector
          etiqueta="Filtrar por producto"
          valor={productoId}
          onCambio={setProductoId}
          opciones={[
            { valor: 'todos', etiqueta: 'Todos los productos' },
            ...productos.map((p) => ({ valor: String(p.id), etiqueta: p.nombre })),
          ]}
        />
      </div>
      <p className="contador">
        {filtradas.length} de {opciones.length} opciones
      </p>

      {filtradas.length === 0 ? (
        <SinResultados
          texto={
            opciones.length === 0
              ? 'No hay productos adicionales disponibles en este momento.'
              : 'Ningún extra coincide con tu búsqueda.'
          }
          onLimpiar={hayFiltros ? limpiar : undefined}
        />
      ) : (
        <div className="grilla">
          {filtradas.map((o) => (
            <OpcionCard key={o.id} opcion={o} />
          ))}
        </div>
      )}
    </section>
  )
}
