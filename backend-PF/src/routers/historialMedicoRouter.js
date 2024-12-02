const express = require('express');
const { addHistoryEntry, getPatientHistory } = require('../controllers/historialMedicoController');

const router = express.Router();

router.post('/add', addHistoryEntry);
router.get('/paciente/:id', getPatientHistory);

module.exports = router;
