import express from 'express';
import UserController from './controllers/UserController';
import HourController from './controllers/HourController';
import LoginController from './controllers/LoginController';

const routes = express.Router();

routes.get('/', (req, res) => {
    res.json(true);
});

routes.post('/users', UserController.create);
routes.get('/users', UserController.index);
routes.put('/users/:id', UserController.update);

routes.post('/login', LoginController.login);

routes.post('/hours', HourController.create);
routes.get('/hours', HourController.index);
routes.get('/hours/:user_id', HourController.list);
routes.put('/hour/:id', HourController.update);
routes.delete('/hours/:id', HourController.delete)

export default routes;