const jwt = require('jsonwebtoken');

const pool = require('../../config');

const authData = async (req, res) => {
    try {
        const token = req.header('authorization');

        if(!token) return res.status(403).json({
            error: `No token found`
        });

        jwt.verify(token,  process.env.secret_token, async (err, decoded) => {
            if(err) return res.status(400).json({
                error: err
            });

            const email = decoded.email;

            if(!email) return res.status(409).json({
                error: `Invalid request`
            });
    
            const checkUser = pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    
            const checkUserRes = await  checkUser;
    
            if(checkUserRes.rows.length < 1) return res.status(409).json({
                error: `Email does not exist`
            });
            
            res.status(201).json({
                success: `User data`,
                data: checkUserRes.rows
            });

        });
     
    } catch(e) {

        console.log(e)
        res.status(400).json({
            message: `An error occurred`,
            e
        })
    }
}

module.exports = authData;