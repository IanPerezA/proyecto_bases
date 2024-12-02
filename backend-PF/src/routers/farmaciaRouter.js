const express = require('express');
const { addMedication } = require('../controllers/farmaciaController');

const router = express.Router();

router.post('/add', addMedication);

module.exports = router;
