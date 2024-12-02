const { Request, TYPES } = require('tedious');
const { connectDB } = require('../config/database');

const addMedication = async (req, res) => {
  const { name, stock, price } = req.body;

  try {
    const connection = connectDB();

    if (connection.state.name !== 'LoggedIn') {
      return res.status(500).json({ error: 'La conexión a la base de datos no está activa.' });
    }

    const request = new Request('sp_AddMedication', (err) => {
      if (err) {
        console.error('Error al ejecutar el procedimiento almacenado:', err.message);
        return res.status(500).json({ error: 'Error al ejecutar el procedimiento almacenado.' });
      }
    });

    request.addParameter('name', TYPES.VarChar, name);
    request.addParameter('stock', TYPES.Int, stock);
    request.addParameter('price', TYPES.Float, price);

    request.on('requestCompleted', () => {
      res.status(201).json({ message: 'Medicamento agregado correctamente.' });
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
  addMedication,
};
