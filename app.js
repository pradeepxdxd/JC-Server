import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import route from './routes/index.js';
import dbConnection from './config/db.config.js';

const app = express();
const PORT = process.env.PORT
dbConnection()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1', route);

app.listen(PORT, (_, err) => {
    if (err) console.log('Something went wrong')
    else console.log('Server connected successfully', PORT)
})