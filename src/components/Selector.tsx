import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

export interface OpcionSelector {
  valor: string
  etiqueta: string
}

interface SelectorProps {
  opciones: OpcionSelector[]
  valor: string
  onCambio: (valor: string) => void
  etiqueta: string
}

// Lista desplegable propia (reemplaza al <select> nativo, que no se puede diseñar)
// Funciona con mouse y teclado: flechas, Enter, Espacio y Escape
export function Selector({ opciones, valor, onCambio, etiqueta }: SelectorProps) {
  const [abierto, setAbierto] = useState(false)
  const [resaltado, setResaltado] = useState(0)
  const contenedor = useRef<HTMLDivElement>(null)
  const idLista = useId()

  const seleccionada = opciones.find((o) => o.valor === valor) ?? opciones[0]

  // Cierra la lista si se hace clic fuera de ella
  useEffect(() => {
    if (!abierto) return
    const alHacerClicFuera = (e: MouseEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false)
    }
    document.addEventListener('mousedown', alHacerClicFuera)
    return () => document.removeEventListener('mousedown', alHacerClicFuera)
  }, [abierto])

  const abrir = () => {
    setResaltado(Math.max(0, opciones.findIndex((o) => o.valor === valor)))
    setAbierto(true)
  }

  const elegir = (nuevoValor: string) => {
    onCambio(nuevoValor)
    setAbierto(false)
  }

  const alPresionarTecla = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!abierto) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        abrir()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setResaltado((i) => Math.min(i + 1, opciones.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setResaltado((i) => Math.max(i - 1, 0))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        elegir(opciones[resaltado].valor)
        break
      case 'Escape':
        e.preventDefault()
        setAbierto(false)
        break
      case 'Tab':
        setAbierto(false)
        break
    }
  }

  return (
    <div className={abierto ? 'selector selector--abierto' : 'selector'} ref={contenedor}>
      <button
        type="button"
        className="campo selector__boton"
        role="combobox"
        aria-label={etiqueta}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-controls={idLista}
        aria-activedescendant={abierto ? `${idLista}-${resaltado}` : undefined}
        onClick={() => (abierto ? setAbierto(false) : abrir())}
        onKeyDown={alPresionarTecla}
      >
        <span>{seleccionada?.etiqueta}</span>
        <span className="selector__flecha" aria-hidden="true" />
      </button>

      {abierto && (
        <ul className="selector__lista" role="listbox" id={idLista} aria-label={etiqueta}>
          {opciones.map((o, i) => {
            const clases = ['selector__opcion']
            if (i === resaltado) clases.push('selector__opcion--resaltada')
            if (o.valor === valor) clases.push('selector__opcion--elegida')

            return (
              <li
                key={o.valor}
                id={`${idLista}-${i}`}
                role="option"
                aria-selected={o.valor === valor}
                className={clases.join(' ')}
                onMouseEnter={() => setResaltado(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => elegir(o.valor)}
              >
                {o.etiqueta}
                {o.valor === valor && (
                  <span className="selector__marca" aria-hidden="true">
                    ✓
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
