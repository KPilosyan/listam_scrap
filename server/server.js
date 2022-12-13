import express from 'express';
import morgan from 'morgan';
import apiRoutes from './routes/api';
import { MORGAN_TYPE } from './constants';
import handleErrors from './middleware/HandleErrors';

require('dotenv').config();
process.setMaxListeners(0);
const PORT = process.env.PORT;
const HOSTNAME = process.env.HOSTNAME;

const app = express();
app.use(morgan(MORGAN_TYPE));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', apiRoutes);
app.use(handleErrors);

app.listen(PORT, () => {
    console.log(`Server is listening on ${HOSTNAME}:${PORT}`);
});
