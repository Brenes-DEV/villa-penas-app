import { useEffect, useState } from 'react'

// Una consulta recibe la señal para poder cancelarse y devuelve una promesa con los datos
type Consulta<T> = (signal: AbortSignal) => Promise<T>

interface EstadoApi<T> {
    datos: T | null
    cargando: boolean
    error: string | null
}

// Hook reutilizable: ejecuta la consulta y maneja los estados de carga y error
export function useApi<T>(consulta: Consulta<T>, dependencias: readonly unknown[]) {
    const [estado, setEstado] = useState<EstadoApi<T>>({ datos: null, cargando: true, error: null })
    const [intento, setIntento] = useState(0)

    useEffect(() => {
        const controlador = new AbortController()
        setEstado((previo) => ({ ...previo, cargando: true, error: null }))

        consulta(controlador.signal)
            .then((datos) => setEstado({ datos, cargando: false, error: null }))
            .catch((error: unknown) => {
                // Si el componente se desmontó o cambió la consulta, se ignora el resultado
                if (controlador.signal.aborted) return
                const mensaje = error instanceof Error ? error.message : 'Ocurrió un error desconocido.'
                setEstado({ datos: null, cargando: false, error: mensaje })
            })

        // Al cambiar de consulta o salir de la pantalla, se cancela la petición anterior
        return () => controlador.abort()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependencias, intento])

    const reintentar = () => setIntento((n) => n + 1)

    return { ...estado, reintentar }
}