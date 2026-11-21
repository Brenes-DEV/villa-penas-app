interface BuscadorProps {
  valor: string
  onCambio: (valor: string) => void
  placeholder: string
}

export function Buscador({ valor, onCambio, placeholder }: BuscadorProps) {
  return (
    <input
      className="campo"
      type="search"
      value={valor}
      placeholder={placeholder}
      aria-label={placeholder}
      onChange={(e) => onCambio(e.target.value)}
    />
  )
}
