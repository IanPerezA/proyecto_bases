const express = require('express');

// Importar routers
const userRouter = require('./routers/userRouter');
const historialMedicoRouter = require('./routers/historialMedicoRouter');
const especialidadRouter = require('./routers/especialidadRouter');
const farmaciaRouter = require('./routers/farmaciaRouter');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Definir rutas
app.use('/usuarios', userRouter);
app.use('/historial-medico', historialMedicoRouter);
app.use('/especialidades', especialidadRouter);
app.use('/farmacia', farmaciaRouter);

// Manejo de errores para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Exportar la aplicación
module.exports = app;
