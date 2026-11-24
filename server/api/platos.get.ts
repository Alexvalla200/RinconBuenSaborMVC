import { getDbPool } from '../utils/db'

export default defineEventHandler(async () => {
  try {
    const pool = getDbPool()
    const result = await pool.query(`
      SELECT
        p.id,
        p.nombre,
        p.tipo_id,
        t.nombre AS tipo,
        p.proteina_id,
        pr.nombre AS proteina,
        pr.categoria_id,
        cp.nombre AS categoria
      FROM platos p
      INNER JOIN tipos_plato t ON p.tipo_id = t.id
      INNER JOIN proteinas pr ON p.proteina_id = pr.id
      INNER JOIN categorias_proteina cp ON pr.categoria_id = cp.id
      ORDER BY p.id DESC
    `)

    return {
      success: true,
      platos: result.rows
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Error al consultar platos: ${error.message || error}`
    })
  }
})