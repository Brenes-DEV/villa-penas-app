import type { OpcionProductoAdicional, Paquete } from '../types/villa'

const API_URL = 'https://villa-penas-production.up.railway.app'

// Función genérica: hace el GET, revisa el código HTTP y devuelve el JSON tipado
async function getJson<T>(ruta: string, signal?: AbortSignal): Promise<T> {
  let respuesta: Response

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      headers: { Accept: 'application/json' },
      signal,
    })
  } catch (error) {
    // Si la consulta se canceló a propósito, se deja pasar el error original
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    // fetch solo falla aquí cuando no hay conexión o el navegador bloquea la respuesta (CORS)
    throw new Error(
      'No pudimos conectar con la API. Revisa tu conexión a Internet e intenta de nuevo.',
    )
  }

  if (respuesta.status === 404) {
    throw new Error('El recurso no existe o no está disponible públicamente (error 404).')
  }

  if (!respuesta.ok) {
    throw new Error(`La API respondió con el error ${respuesta.status} al consultar ${ruta}.`)
  }

  return (await respuesta.json()) as T
}

// Endpoint 1: lista de paquetes activos
export function obtenerPaquetes(signal?: AbortSignal) {
  return getJson<Paquete[]>('/public/paquetes', signal)
}

// Endpoint 2: detalle de un paquete con sus servicios
export function obtenerPaquetePorId(id: number, signal?: AbortSignal) {
  return getJson<Paquete>(`/public/paquetes/${id}`, signal)
}

// Endpoint 3: opciones de productos adicionales
export function obtenerOpcionesAdicionales(signal?: AbortSignal) {
  return getJson<OpcionProductoAdicional[]>('/public/opciones-productos-adicionales', signal)
}
