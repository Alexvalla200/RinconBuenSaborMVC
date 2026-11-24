import { getDbPool } from '../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const nombre = typeof body?.nombre === 'string' ? body.nombre.trim() : ''
  const tipoId = Number(body?.tipo_id)
  const proteinaId = Number(body?.proteina_id)

  if (!nombre || !tipoId || !proteinaId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Todos los campos son obligatorios'
    })
  }

  try {
    const pool = getDbPool()

    const dup = await pool.query(
      'SELECT id FROM platos WHERE LOWER(nombre) = LOWER($1) AND proteina_id = $2',
      [nombre, proteinaId]
    )

    if (dup.rows.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: '🚨 Error BD: Plato duplicado para esta proteína.'
      })
    }

    const inserted = await pool.query(
      `INSERT INTO platos (nombre, tipo_id, proteina_id)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, tipo_id, proteina_id`,
      [nombre, tipoId, proteinaId]
    )

    return {
      success: true,
      plato: inserted.rows[0]
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    if (error.code === '23505') {
      throw createError({
        statusCode: 409,
        statusMessage: '🚨 Error BD: Plato duplicado para esta proteína.'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: `Error interno: ${error.message || error}`
    })
  }
})