import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.json(true);
});

app.listen(3333, () => {
    console.log('server running port 3333');
})