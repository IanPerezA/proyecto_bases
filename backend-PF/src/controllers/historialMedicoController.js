const { Request, TYPES } = require('tedious');
const { connectDB } = require('../config/database');

const addHistoryEntry = async (req, res) => {
  const { pacienteId, doctorId, diagnostico, tratamiento } = req.body;

  try {
    const connection = connectDB();

    if (connection.state.name !== 'LoggedIn') {
      return res.status(500).json({ error: 'La conexión a la base de datos no está activa.' });
    }

    const request = new Request('sp_AddHistoryEntry', (err) => {
      if (err) {
        console.error('Error al ejecutar el procedimiento almacenado:', err.message);
        return res.status(500).json({ error: 'Error al ejecutar el procedimiento almacenado.' });
      }
    });

    request.addParameter('pacienteId', TYPES.Int, pacienteId);
    request.addParameter('doctorId', TYPES.Int, doctorId);
    request.addParameter('diagnostico', TYPES.VarChar, diagnostico);
    request.addParameter('tratamiento', TYPES.VarChar, tratamiento);

    request.on('requestCompleted', () => {
      res.status(201).json({ message: 'Entrada al historial médico agregada correctamente.' });
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

const getPatientHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = connectDB();

    if (connection.state.name !== 'LoggedIn') {
      return res.status(500).json({ error: 'La conexión a la base de datos no está activa.' });
    }

    const request = new Request('sp_GetPatientHistory', (err) => {
      if (err) {
        console.error('Error al ejecutar el procedimiento almacenado:', err.message);
        return res.status(500).json({ error: 'Error al ejecutar el procedimiento almacenado.' });
      }
    });

    request.addParameter('pacienteId', TYPES.Int, id);

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
  addHistoryEntry,
  getPatientHistory,
};
