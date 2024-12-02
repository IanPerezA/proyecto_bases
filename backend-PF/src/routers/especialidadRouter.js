const express = require('express');
const { getSpecialties, addSpecialty } = require('../controllers/especialidadController');

const router = express.Router();

router.get('/', getSpecialties);
router.post('/add', addSpecialty);

module.exports = router;
