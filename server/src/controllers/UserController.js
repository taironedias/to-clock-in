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
    }
}