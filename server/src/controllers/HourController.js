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

    /** Retorna as horas que bateu o ponto de um dia específico */
    async listHoursInDay(req, res) {
        /**
         * SELECT id, DATE_FORMAT(punch_clock, "%H:%i:%s") 
         * FROM hours 
         * WHERE user_id = :user_id 
         *  AND DATE(punch_clock) = :yyyy_mm_dd
         */
        const user_id = req.headers.authorization;
        const { day } = req.query;

        const data = await connection('hours')
            .whereRaw('hours.user_id = ? AND DATE(hours.punch_clock) = ?', [`${user_id}`, `${day}`])
            .select(connection.raw('id, DATE_FORMAT(punch_clock, "%H:%i:%s") AS punch_clock'));

        if (!data.length) {
            res.status(400).json({ error: `Hour not found for day: ${day}` });
        }

        return res.json(data);
    },
    /** Edita um ponto (data e hora) de um usuário */
    async update(req, res) {
        const { id } = req.params;
        const user_id = req.headers.authorization;
        const { punch_clock } = req.body;

        const data = await connection('hours')
            .where({
                id,
                user_id
            })
            .update('punch_clock', punch_clock);

        if (!data) {
            res.status(400).json({ error: 'Hour not found for update' });
        }

        return res.status(204).send();
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