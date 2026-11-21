interface IntroSeccionProps {
  numero: string
  titulo: string
  texto: string
}

// Encabezado de sección al estilo de la página oficial: "01 / Paquetes"
export function IntroSeccion({ numero, titulo, texto }: IntroSeccionProps) {
  return (
    <div className="intro">
      <p className="intro__numero">{numero}</p>
      <h2>{titulo}</h2>
      <p className="intro__texto">{texto}</p>
    </div>
  )
}
