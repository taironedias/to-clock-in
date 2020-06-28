import connection from '../database/connection';

export default {
    async login(req, res) {
        const { login, password } = req.body;

        const data = await connection('users')
            .where({
                login: login,
                password: password
            })
            .select('id', 'permission')
            .first();

        if (!data) {
            res.status(400).json({ error: 'Invalid credentials.' });
        }

        return res.json(data);
    }
}