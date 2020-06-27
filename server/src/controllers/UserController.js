import connection from '../database/connection';

export default {
    async create(req, res) {
        const { login, password, name, email } = req.body;

        const rootUsers = [
            'breno',
            'tayane',
            'giselle',
            'tairone'
        ];

        const permission = rootUsers.includes(name.toLowerCase()) ? 'root' : 'default';

        const [id] = await connection('users').insert({
            login,
            password,
            name,
            email,
            permission
        });

        return res.json({ user_id: id });
    },

    async index(req, res) {
        const users = await connection('users').select('*');
        return res.json(users);
    },

    async update(req, res) {
        const { id } = req.params;
        const user_id = req.headers.authorization;

        if (id !== user_id) {
            return res.status(401).json({ error: 'Operation not permitted.' });
        }

        const { login, password, name, email } = req.body;

        const user = await connection('users')
            .where({ id: id })
            .update({
                login,
                password,
                name,
                email
            }, ['id', 'login', 'password', 'name', 'email']);

        if (!user) {
            return res.status(404).json({ error: 'User not found for update.' });
        }

        return res.status(204).send();
    }
}