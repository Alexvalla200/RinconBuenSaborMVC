import sql from 'mssql'; // Importación estándar, sin msnodesqlv8

const sqlConfig = {
  user: 'sa', 
  password: '123456789', // La contraseña que hayas configurado
  database: 'RinconBuenSabor',
  server: 'localhost', 
  port: 1433, // Añade esta línea para forzar el puerto que acabamos de abrir
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;

export const getConnection = async () => {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(sqlConfig).connect();
  }
  return poolPromise;
};

export { sql };