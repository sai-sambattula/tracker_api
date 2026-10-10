import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkDatabseConnection } from './Config/sqlHelper.js';
import indexappRouter from './Core/indexRoutes.js';
import { env } from './Config/config.js';



checkDatabseConnection();
const app = express();
const PORT = env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const corsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization','ngrok-skip-browser-warning'],
    credentials: true
};


app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});

app.use(cors(corsOptions));


// ---------------- BODY PARSERS ----------------
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));



// ---------------- STATIC ----------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/appapi', (req, res) => {
    res.send('Server is Working...');
});
// ---------------- ROUTES ----------------
app.use('/appapi', indexappRouter);




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/appapi/`);
});


