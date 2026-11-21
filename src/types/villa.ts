// Tipos basados en las respuestas reales de la API pública de Villa Peñas

export interface Servicio {
    id: number
    nombre: string
    descripcion: string | null
    unidadMedida: string
}

export interface PaqueteServicio {
    id: number
    paqueteId: number
    servicioId: number
    cantidad: number | null
    detalle: string | null
    orden: number
    servicio: Servicio
}

export interface Paquete {
    id: number
    nombre: string
    descripcion: string | null
    precioColones: number
    activo: boolean
    paquetesServicios: PaqueteServicio[]
}

export interface ProductoAdicional {
    id: number
    nombre: string
    descripcion: string | null
    imagenUrl: string | null
}

export interface OpcionProductoAdicional {
    id: number
    productoAdicionalId: number
    productoAdicional: ProductoAdicional
    nombre: string
    descripcion: string | null
    unidadMedida: string
    cantidadIncluida: number
    cantidadPersonas: number
    precioVentaColones: number
}