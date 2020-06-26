import express from 'express';
import UserController from './controllers/UserController';

const routes = express.Router();

routes.get('/', (req, res) => {
    res.json(true);
});

routes.post('/users', UserController.create);

routes.get('/users', UserController.index);

export default routes;