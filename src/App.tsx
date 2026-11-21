import { useState } from 'react'
import { ExtrasCatalogo } from './components/ExtrasCatalogo'
import { IntroSeccion } from './components/IntroSeccion'
import { PaqueteDetalle } from './components/PaqueteDetalle'
import { PaquetesLista } from './components/PaquetesLista'

type Vista = 'paquetes' | 'extras'

function App() {
  const [vista, setVista] = useState<Vista>('paquetes')
  const [paqueteId, setPaqueteId] = useState<number | null>(null)

  return (
    <div className="app">
      <header className="encabezado">
        <div className="encabezado__vidrio">
          <div className="sol">
            <div className="sol__medallon">
              <img src="/logo-villa-penas.png" alt="Logo de Villa Peñas, alquiler para eventos" />
            </div>
          </div>

          <div className="encabezado__contenido">
            <div className="encabezado__barra">
              <p className="marca">
                <span className="marca__punto" aria-hidden="true" />
                Villa Peñas
              </p>
              <ul className="encabezado__datos">
                <li>
                  <span className="punto-vivo" aria-hidden="true" />
                  Datos en tiempo real
                </li>
                <li>Chirco, Santa Cruz</li>
                <li>Guanacaste, Costa Rica</li>
              </ul>
            </div>

            <div className="encabezado__principal">
              <h1>
                Piscina.
                <br />
                Rancho.
                <br />
                Fiesta.
              </h1>
              <p className="subtitulo">
                Explora qué incluye cada paquete, encuentra el que mejor se adapta a tu celebración
                y súmale extras.
              </p>
            </div>

            <div className="encabezado__acciones">
              <nav
                className={vista === 'extras' ? 'pestanas pestanas--extras' : 'pestanas'}
                aria-label="Secciones"
              >
                <button
                  type="button"
                  className={vista === 'paquetes' ? 'pestana pestana--activa' : 'pestana'}
                  aria-pressed={vista === 'paquetes'}
                  onClick={() => setVista('paquetes')}
                >
                  Paquetes
                </button>
                <button
                  type="button"
                  className={vista === 'extras' ? 'pestana pestana--activa' : 'pestana'}
                  aria-pressed={vista === 'extras'}
                  onClick={() => setVista('extras')}
                >
                  Productos adicionales
                </button>
              </nav>

              <a
                className="boton boton--cotizar"
                href="https://eventosvillapenas.com/es"
                target="_blank"
                rel="noreferrer"
              >
                Cotizar en el sitio oficial ↗
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="contenido">
        {vista === 'paquetes' ? (
          <div
            key="paquetes"
            className={paqueteId !== null ? 'distribucion distribucion--detalle' : 'distribucion'}
          >
            <div>
              <IntroSeccion
                numero="01 / Paquetes"
                titulo="Elige cómo quieres disfrutar Villa Peñas."
                texto="Cada paquete reúne una forma distinta de vivir tu evento. Explora qué incluye cada uno."
              />
              <PaquetesLista seleccionadoId={paqueteId} onSeleccionar={setPaqueteId} />
            </div>
            {paqueteId !== null && (
              <PaqueteDetalle id={paqueteId} onCerrar={() => setPaqueteId(null)} />
            )}
          </div>
        ) : (
          <div key="extras" className="distribucion">
            <IntroSeccion
              numero="02 / Extras"
              titulo="Súmale algo especial a tu celebración."
              texto="Productos adicionales que puedes agregar a cualquier paquete."
            />
            <ExtrasCatalogo />
          </div>
        )}
      </main>

      <footer className="pie">
        <p className="pie__marca">Villa Peñas</p>
        <p>1 km sur de la entrada a Moya, Chirco, Santa Cruz, Guanacaste, Costa Rica.</p>
        <p className="pie__nota">
          Proyecto académico · Programación III · Universidad Nacional · Datos de la API pública de
          Villa Peñas
        </p>
      </footer>
    </div>
  )
}

export default App
