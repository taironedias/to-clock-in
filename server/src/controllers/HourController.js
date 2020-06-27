import connection from '../database/connection';

export default {
    /** Cria um ponto (data e hora) para um usuário */
    async create(req, res) {
        const { punch_clock } = req.body;
        const user_id = req.headers.authorization;

        const [id] = await connection('hours').insert({
            user_id,
            punch_clock
        });

        return res.json({ id });
    },

    async index(req, res) {
        const hours = await connection('hours').select('*');
        return res.json(hours);
    },

    async list(req, res) {
        const { user_id } = req.params;

        const hours = await connection('hours')
            .where('user_id', user_id)
            .select('*');
        
            return res.json(hours);
    },

    /** Edita um ponto (data e hora) de um usuário */
    async update(req, res) {
        const { id } = req.params;
        const user_id = req.headers.authorization;
        const { punch_clock } = req.body;

        await connection('hours')
            .where({
                id,
                user_id
            })
            .update('punch_clock', punch_clock)
            .then((data) => {
                if (!data) {
                    res.status(400).json({ error: 'Hour not found for update' });
                }

                return res.status(204).send();
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    },

    /** Remove um ponto salvo para um usuário */
    async delete(req, res) {
        const { id } = req.params;
        const user_id = req.headers.authorization;

        const hour = await connection('hours')
            .where({
                'id': id,
                'user_id': user_id
            })
            .select('*');

        if (!hour.length) {
            return res.status(401).json({ error: 'Operation not permitted.' });
        }

        await connection('hours').where('id', id).delete();

        return res.status(204).send();
    }
}