const express = require('express');
const urlRoute = require('./routes/url')
const path = require('path')
const URL = require('./models/url')
const staticRoute = require("./routes/staticRouter")
const { connectDB } = require('./connect');
const app = express();
const PORT = 8001;

connectDB('mongodb://localhost:27017/short-url').then(() => console.log('MongoDB connected'));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }))

app.use('/url', urlRoute);
app.use("/", staticRoute);
app.use(express.json());
app.get("/test", async (req, res) => {
    const allUrls = await URL.find({});
    return res.render('home', {
        urls: allUrls,
    });
})



app.listen(PORT, () => {
    console.log(`Server Started at PORT:${PORT}`)
})
