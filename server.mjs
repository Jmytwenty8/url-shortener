import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import ShortUrl from './models/shortUrl.mjs';
// import morgan from 'morgan';

const app = express();
dotenv.config()

// app.use(morgan('short'));
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true, useUnifiedTopology:true})

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}))

app.get('/', async(req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index',{shortUrls: shortUrls});
})

app.post('/shortUrls', async(req, res) => {
    await ShortUrl.create({
        full: req.body.fullUrl
    })
    res.redirect('/');
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })

    if (shortUrl == null) return res.sendStatus(404);
    shortUrl.clicks++;
    shortUrl.save();
    
    res.redirect(shortUrl.full);
})







app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})

