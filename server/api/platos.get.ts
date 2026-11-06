import { getConnection } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const pool = await getConnection()
    
    // Consulta con JOINs para obtener los nombres legibles de cada relación
    const result = await pool.request().query(`
      SELECT 
        p.id, 
        p.nombre, 
        t.nombre AS tipo, 
        cp.nombre AS categoria, 
        prot.nombre AS proteina
      FROM Platos p
      INNER JOIN TiposPlato t ON p.tipo_id = t.id
      INNER JOIN Proteinas prot ON p.proteina_id = prot.id
      INNER JOIN CategoriasProteina cp ON prot.categoria_id = cp.id
      ORDER BY p.id DESC
    `)

    return { success: true, platos: result.recordset }
  } catch (error: any) {
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Error al obtener los platos: ${error.message}` 
    })
  }
})