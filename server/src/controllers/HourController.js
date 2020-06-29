import connection from '../database/connection';
import moment from 'moment';

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

    async listInfos(req, res) {
        /**
         * SELECT
                punch_clock,
                GROUP_CONCAT(TIME_TO_SEC(TIME(punch_clock))) as seconds
            FROM hours h
            WHERE h.user_id = 1
                AND MONTH(punch_clock) = 6
            GROUP BY DAY(punch_clock)
            ORDER BY punch_clock ASC;
         */
        const user_id = req.headers.authorization;
        const { date } = req.query;

        const month = moment(date).format('M');

        const response = await connection.select(connection.raw('DATE_FORMAT(punch_clock, "%Y-%m-%d") as date, GROUP_CONCAT(TIME_TO_SEC(TIME(punch_clock))) as seconds'))
            .from('hours')
            .whereRaw('user_id = ? AND MONTH(punch_clock) = ?', [`${user_id}`, `${month}`])
            .groupByRaw('DAY(punch_clock)')
            .orderBy('punch_clock', 'asc');

        let workedHoursPerDay = response.map((value) => {
            let arr_seconds = value.seconds.split(',');
            let workedHours = 0;
            let i;

            for(i=0; i<arr_seconds.length; i++) {
                if (arr_seconds[i+1]) {
                    let diffWorkedHours = parseInt(arr_seconds[i+1]) - parseInt(arr_seconds[i]);
                    workedHours += diffWorkedHours
                    i++;
                }
            }

            return {
                date: value.date,
                workedHours: workedHours
            };
        });

        const totalWorkedHoursInDay = workedHoursPerDay.filter((value) => {
            return value.date == date;
        })[0].workedHours;

        const weekNumber = moment(date).week();
        let totalWordkedHoursInWeek = 0;
        workedHoursPerDay.forEach((value, index, elements) => {
            if (moment(value.date).week() === weekNumber) {
                totalWordkedHoursInWeek += value.workedHours;
            }
        });

        const usersConfig = await connection.from('users_config')
            .where('user_id', user_id)
            .select('*');
        
        const { amount, amount_goal, hours_goal, start, end } = usersConfig[0];
        
        const dayBalance = totalWorkedHoursInDay - (end - start);

        return res.json({
            totalWorkedHoursInDay,
            dayBalance,
            totalWordkedHoursInWeek
        });
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