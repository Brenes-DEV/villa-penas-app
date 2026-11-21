interface CargandoProps {
  texto?: string
}

export function Cargando({ texto = 'Cargando…' }: CargandoProps) {
  return (
    <div className="estado" role="status">
      <span className="spinner" aria-hidden="true" />
      <p>{texto}</p>
    </div>
  )
}

interface MensajeErrorProps {
  mensaje: string
  onReintentar?: () => void
}

export function MensajeError({ mensaje, onReintentar }: MensajeErrorProps) {
  return (
    <div className="estado estado--error" role="alert">
      <p className="estado__titulo">No pudimos cargar la información</p>
      <p>{mensaje}</p>
      {onReintentar && (
        <button type="button" className="boton" onClick={onReintentar}>
          Intentar de nuevo
        </button>
      )}
    </div>
  )
}

interface SinResultadosProps {
  texto: string
  onLimpiar?: () => void
}

export function SinResultados({ texto, onLimpiar }: SinResultadosProps) {
  return (
    <div className="estado estado--vacio">
      <p>{texto}</p>
      {onLimpiar && (
        <button type="button" className="boton boton--secundario" onClick={onLimpiar}>
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
