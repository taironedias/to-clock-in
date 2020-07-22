import connection from '../database/connection';

export default {
    async create(req, res) {
        const user_id = req.headers.authorization;
        const { amount, amount_goal, hours_goal, start, end } = req.body;

        const exist = await connection('users_config')
            .where('user_id', user_id)
            .select('*');

        if (exist.length) {
            return res.status(400).json({ error: 'Cann\'t possible to save the users configurations, because it already exists.' });
        }

        const response = await connection('users_config').insert({
            user_id,
            amount,
            amount_goal,
            hours_goal,
            start,
            end
        });

        if (!response) {
            return res.status(400).json({ error: 'Cann\'t possible to save the users configurations' });
        }

        return res.status(204).send();
    }
}