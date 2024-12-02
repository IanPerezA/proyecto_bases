const { Request, TYPES } = require('tedious');
const { connectDB } = require('../config/database');

const getSpecialties = async (req, res) => {
  try {
    const connection = connectDB();

    if (connection.state.name !== 'LoggedIn') {
      return res.status(500).json({ error: 'La conexión a la base de datos no está activa.' });
    }

    const request = new Request('sp_GetSpecialties', (err) => {
      if (err) {
        console.error('Error al ejecutar el procedimiento almacenado:', err.message);
        return res.status(500).json({ error: 'Error al ejecutar el procedimiento almacenado.' });
      }
    });

    const results = [];
    request.on('row', (columns) => {
      const row = {};
      columns.forEach((column) => {
        row[column.metadata.colName] = column.value;
      });
      results.push(row);
    });

    request.on('requestCompleted', () => {
      res.status(200).json(results);
    });

    connection.callProcedure(request);
  } catch (error) {
    console.error('Error en el controlador:', error.message);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const addSpecialty = async (req, res) => {
  const { name } = req.body;

  try {
    const connection = connectDB();

    if (connection.state.name !== 'LoggedIn') {
      return res.status(500).json({ error: 'La conexión a la base de datos no está activa.' });
    }

    const request = new Request('sp_AddSpecialty', (err) => {
      if (err) {
        console.error('Error al ejecutar el procedimiento almacenado:', err.message);
        return res.status(500).json({ error: 'Error al ejecutar el procedimiento almacenado.' });
      }
    });

    request.addParameter('name', TYPES.VarChar, name);

    request.on('requestCompleted', () => {
      res.status(201).json({ message: 'Especialidad agregada correctamente.' });
    });

    request.on('error', (err) => {
      console.error('Error en la solicitud:', err.message);
      res.status(500).json({ error: 'Error en la solicitud.' });
    });

    connection.callProcedure(request);
  } catch (error) {
    console.error('Error en el controlador:', error.message);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = {
  getSpecialties,
  addSpecialty,
};
