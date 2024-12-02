const { sql } = require('../config/database');

const crearUsuario = async (req, res) => {
  const { nombre, appat, apmat, email, pssword, tel, rol, estatus_act, edad, id_especialidad, cedula, turno } = req.body;
    console.log(nombre,appat,apmat,email,pssword,tel,rol,estatus_act,edad,id_especialidad,cedula,turno);
  try {
    const request = new sql.Request();
    request.input('nombre', sql.VarChar, nombre);
    request.input('appat', sql.VarChar, appat);
    request.input('apmat', sql.VarChar, apmat);
    request.input('email', sql.VarChar, email);
    request.input('pssword', sql.VarChar, pssword);
    request.input('tel', sql.VarChar, tel);
    request.input('rol', sql.Int, rol);
    request.input('estatus_act', sql.Bit, estatus_act);
    request.output('id_usuario', sql.Int); // Parámetro de salida para obtener el ID generado

    // Ejecutar el procedimiento almacenado para crear el usuario
    await request.execute('sp_CreateUsuario');

    // Obtener el ID del usuario recién insertado
    const id_usuario = request.parameters.id_usuario.value;

    // Según el rol, insertar en la tabla especializada correspondiente
    switch (rol) {
      case 1: // Paciente
        const pacienteRequest = new sql.Request();
        pacienteRequest.input('id_usuario', sql.Int, id_usuario);
        pacienteRequest.input('edad', sql.Date, edad);
        await pacienteRequest.execute('sp_CreatePaciente');
        break;

      case 2: // Doctor
        const doctorRequest = new sql.Request();
        doctorRequest.input('id_usuario', sql.Int, id_usuario);
        doctorRequest.input('id_especialidad', sql.Int, id_especialidad);
        doctorRequest.input('cedula', sql.VarChar, cedula);
        await doctorRequest.execute('sp_CreateDoctor');
        break;

      case 3: // Recepcionista
        const recepcionistaRequest = new sql.Request();
        recepcionistaRequest.input('id_usuario', sql.Int, id_usuario);
        recepcionistaRequest.input('turno', sql.VarChar, turno);
        await recepcionistaRequest.execute('sp_CreateRecepcionista');
        break;

      default:
        break;
    }

    res.status(201).json({ message: 'Usuario y especialización creados correctamente' });
  } catch (error) {
    console.error('Error al crear el usuario y su especialización:', error);
    res.status(500).send('Error al crear el usuario y su especialización');
  }
};

module.exports = {
  crearUsuario
};
