const express = require("express");
const {connectMongoDB} = require('./connect');
const urlRoute = require('./routes/url');
const URL = require('./models/url');
const app = express();
const port = 8001;

app.use(express.json());

connectMongoDB('mongodb://localhost:27017/short-url')
    .then(()=> console.log('MongoDB connected!'))
    .catch((err)=> console.log('MongoDB connection error', err));

app.use('/url', urlRoute);

app.get('/:shortId', async (req, res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {$push:
        {visitHistory: {
            timestamp: Date.now(),
        },
        },
    });
    res.redirect(entry.redirectURL);
})

app.listen(port, ()=> console.log(`Server Started at PORT: ${port}`));