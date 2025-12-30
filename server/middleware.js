import pg from './db.js';

const middleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        //console.log('TOKEN:', token);

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await pg.query(
            'SELECT user_id FROM users WHERE jwt_token=$1',
            [token]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user.rows[0].user_id;
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export default middleware;
