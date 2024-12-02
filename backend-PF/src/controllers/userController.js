const { TYPES, Request } = require('tedious');
const { connectDB } = require('../config/database');

// Función para ejecutar un procedimiento almacenado
function executeStoredProcedure(procedureName, parameters) {
  return new Promise((resolve, reject) => {
    const connection = connectDB();

    // Verificar el estado de la conexión
    if (connection.state.name !== 'LoggedIn') {
      return reject(new Error('La conexión no está en estado LoggedIn.'));
    }

    const request = new Request(procedureName, (err) => {
      if (err) {
        reject(new Error(`Error al ejecutar el procedimiento almacenado: ${err.message}`));
      }
    });

    // Agregar parámetros al request
    parameters.forEach((param) => {
      if (param.output) {
        request.addOutputParameter(param.name, param.type);
      } else {
        request.addParameter(param.name, param.type, param.value);
      }
    });

    const outputParameters = {};

    request.on('returnValue', (parameterName, value) => {
      outputParameters[parameterName] = value;
    });

    request.on('doneInProc', (rowCount, more) => {
      // Este evento se activa cuando la operación se completa
      console.log(`Procedimiento almacenado ejecutado: ${procedureName} - Filas afectadas: ${rowCount}`);
    });

    request.on('requestCompleted', () => {
      resolve(outputParameters); // Resolver la promesa solo cuando todo se complete correctamente
    });

    request.on('error', (err) => {
      reject(new Error(`Error en la solicitud: ${err.message}`));
    });

    connection.callProcedure(request);
  });
}

const crearUsuario = async (req, res) => {
  const {
    nombre,
    appat,
    apmat,
    email,
    pssword,
    tel,
    rol,
    estatus_act,
    edad,
    id_especialidad,
    cedula,
    turno,
  } = req.body;

  try {
    // Crear el usuario y obtener el ID generado
    const output = await executeStoredProcedure('sp_CreateUsuario', [
      { name: 'nombre', type: TYPES.VarChar, value: nombre },
      { name: 'appat', type: TYPES.VarChar, value: appat },
      { name: 'apmat', type: TYPES.VarChar, value: apmat },
      { name: 'email', type: TYPES.VarChar, value: email },
      { name: 'pssword', type: TYPES.VarChar, value: pssword },
      { name: 'tel', type: TYPES.VarChar, value: tel },
      { name: 'rol', type: TYPES.Int, value: rol },
      { name: 'estatus_act', type: TYPES.Bit, value: estatus_act },
      { name: 'id_usuario', type: TYPES.Int, output: true },
    ]);

    const id_usuario = output.id_usuario;

    // Ejecutar el procedimiento específico según el rol
    switch (rol) {
      case 1: // Paciente
        await executeStoredProcedure('sp_CreatePaciente', [
          { name: 'id_usuario', type: TYPES.Int, value: id_usuario },
          { name: 'edad', type: TYPES.Date, value: edad },
        ]);
        break;
      case 2: // Doctor
        await executeStoredProcedure('sp_CreateDoctor', [
          { name: 'id_usuario', type: TYPES.Int, value: id_usuario },
          { name: 'id_especialidad', type: TYPES.Int, value: id_especialidad },
          { name: 'cedula', type: TYPES.VarChar, value: cedula },
        ]);
        break;
      case 3: // Recepcionista
        await executeStoredProcedure('sp_CreateRecepcionista', [
          { name: 'id_usuario', type: TYPES.Int, value: id_usuario },
          { name: 'turno', type: TYPES.VarChar, value: turno },
        ]);
        break;
      default:
        throw new Error('Rol no válido');
    }

    res.status(201).json({
      message: 'Usuario y especialización creados correctamente',
      data: { id_usuario },
    });
  } catch (error) {
    console.error('Error al crear el usuario y su especialización:', error.message);
    res.status(500).json({
      message: 'Ocurrió un error al procesar la solicitud.',
      error: error.message,
    });
  }
};

module.exports = {
  crearUsuario,
};
