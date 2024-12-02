const express = require('express');
const userRouter = require('../src/routers/userRouter');

const app = express();
const apiRouter = express.Router();
app.use(express.json());
app.use('/usuarios',userRouter);

app.use('/api', apiRouter);
module.exports = app;