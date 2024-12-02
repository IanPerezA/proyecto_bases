const { Connection } = require('tedious');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER,  
  port: process.env.DB_PORT || 1433,  
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER,     
      password: process.env.DB_PASSWORD, 
    }
  },
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', 
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true', 
    database: process.env.DB_DATABASE 
  }
};

const connectDB = async () => {
  const connection = new Connection(config);

  connection.on('connect', (err) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
    } else {
      console.log('Conectado a la base de datos exitosamente.');
    }
  });

  connection.connect(); 
};

module.exports = {
  connectDB
};
