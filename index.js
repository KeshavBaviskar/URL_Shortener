const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser');
const { connectDB } = require('./connect');
const { restrictToLoggedInUserOnly, checkAuth } = require('./middlewares/auth')
const URL = require('./models/url')
require('dotenv').config();
const urlRoute = require('./routes/url')
const staticRoute = require("./routes/staticRouter")
const userRoute = require("./routes/user")
const app = express();
const PORT = process.env.PORT || 8001;


connectDB(process.env.MONGO_URL)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch((err) => console.log('Mongo Connection Error', err));

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, 'views'));

// --- MIDDLEWARE  ---

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

// --- ROUTES ---
app.use('/url', restrictToLoggedInUserOnly, urlRoute);
app.use('/user',userRoute);
app.use("/",checkAuth,staticRoute);


app.listen(PORT, () => {
    console.log(`Server Started at PORT:${PORT}`)
})