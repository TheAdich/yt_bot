import pg from './db.js';
import jwt from 'jsonwebtoken';
const middleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        //console.log('TOKEN:', token);

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await pg.query(
            'SELECT user_id, expiry_date FROM users WHERE jwt_token=$1',
            [token]
        );

        
        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if(Date.now() > user.rows[0].expiry_date){
            //refresh jwt token
            const user_id= user.rows[0].user_id;
            const newToken= jwt.sign({user_id},process.env.JWT_SECRET,{expiresIn:'1h'});
            const newExpiryDate= Date.now() + 3600000;
            const updateTokenResult=await pg.query(
                'UPDATE users SET jwt_token=$1, expiry_date=$2 WHERE user_id=$3',
                [newToken, newExpiryDate, user_id]
            );
            if(updateTokenResult.rowCount===0){

                return res.status(500).json({ message: 'Server error' });
            }
            else{
                console.log('Token refreshed for user:', user_id);
            }
            
        }
        else{
            console.log('Token valid for user:', user.rows[0].user_id);
        }
        

        req.user = user.rows[0].user_id;
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export default middleware;
