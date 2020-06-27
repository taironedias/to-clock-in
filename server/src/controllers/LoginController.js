import connection from '../database/connection';

export default {
    async login(req, res) {
        const { login, password } = req.body;

        await connection('users')
            .where({
                login: login,
                password: password
            })
            .select('id', 'permission')
            .first()
            .then((data) => {

                if (!data) {
                    res.status(400).json({ error: 'Invalid credentials.' });
                }

                return res.json(data);
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }
}