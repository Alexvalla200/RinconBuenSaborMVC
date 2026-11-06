import { getConnection, sql } from '../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { nombre, tipo_id, proteina_id } = body

  if (!nombre || !tipo_id || !proteina_id) {
    throw createError({ statusCode: 400, statusMessage: 'Todos los campos son obligatorios' })
  }

  try {
    const pool = await getConnection()

    // Validación: Solo bloquea si existe el mismo nombre con la misma proteína exacta
    const checkQuery = await pool.request()
      .input('nombre', sql.NVarChar, nombre.trim())
      .input('proteina_id', sql.Int, Number(proteina_id))
      .query('SELECT id FROM Platos WHERE nombre = @nombre AND proteina_id = @proteina_id')

    if (checkQuery.recordset.length > 0) {
      throw createError({ 
        statusCode: 409, 
        statusMessage: 'Violación de integridad: Ya existe un plato con ese nombre y esa misma proteína específica.' 
      })
    }

    // Inserción permitiendo repetir nombres, tipos y grupos si la proteína cambia
    const insertQuery = await pool.request()
      .input('nombre', sql.NVarChar, nombre.trim())
      .input('tipo_id', sql.Int, Number(tipo_id))
      .input('proteina_id', sql.Int, Number(proteina_id))
      .query(`
        INSERT INTO Platos (nombre, tipo_id, proteina_id) 
        OUTPUT INSERTED.* 
        VALUES (@nombre, @tipo_id, @proteina_id)
      `)

    return { success: true, plato: insertQuery.recordset[0] }

  } catch (error: any) {
    if (error.number === 2627) {
      throw createError({ statusCode: 409, statusMessage: 'Error BD: Plato duplicado para esta proteína.' })
    }
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Error interno: ${error.message || error}` 
    })
  }
})