const formatoColones = new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
})

// 60000 -> ₡60 000
export function formatearColones(monto: number): string {
    return formatoColones.format(Number(monto))
}

// Quita tildes y mayúsculas para que la búsqueda "musica" encuentre "Música"
export function normalizar(texto: string): string {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
}