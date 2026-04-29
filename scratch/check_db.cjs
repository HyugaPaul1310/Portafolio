const mysql = require('mysql2/promise');

async function checkSchema() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Assuming no password as per usual local dev
    database: 'portafoliopaul' // Adjust if needed
  });

  try {
    const [rows] = await connection.query('DESCRIBE about_me');
    console.log('Columns in about_me:');
    console.table(rows);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await connection.end();
  }
}

checkSchema();
