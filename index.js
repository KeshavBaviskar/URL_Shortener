const express = require('express');
const path = require('path')
const { connectDB } = require('./connect');
const URL = require('./models/url')
require('dotenv').config();
const urlRoute = require('./routes/url')
const staticRoute = require("./routes/staticRouter")

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

// --- ROUTES ---
app.use('/url', urlRoute);
app.use("/", staticRoute);


// --- TEST ROUTE (Temporary testing ke liye theek hai) ---
app.get("/test", async (req, res) => {
    const allUrls = await URL.find({});
    return res.render('home', {
        urls: allUrls,
    });
})

app.listen(PORT, () => {
    console.log(`Server Started at PORT:${PORT}`)
})