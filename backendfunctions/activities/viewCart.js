const { default: axios } = require('axios');
const jwt = require('jsonwebtoken');

const pool = require('../../config');

const authAccount = require('../authentication/authenticateToken');

const viewCart = async (req, res) => {
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

            const findUserQ = pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

            const isUser = await findUserQ;

            if(isUser.rows.length < 1) return res.status(404).json({
                error: `Invalid request data. Check your email`
            });
        
            const viewCart = pool.query(`SELECT * FROM carts WHERE byuser = $1`, [isUser.rows[0].userid]);
        
            const hasCart = await viewCart;

            hasCart.rows.forEach(async  (item) => {
                const viewProduct = pool.query(`SELECT * FROM products WHERE productid = $1`, [item.productid]);

                const isProduct = await viewProduct;

                item.productData = isProduct.rows[0];
            });
            
            setTimeout(() => {
                res.status(200).json({
                    success: `Your cart`,
                    data: hasCart.rows
                });
            }, 2000);
        })
    } catch (e) {
        console.log(e);
        res.status(400).json({
            message: `An error occured`,
            e
        });
    }
}

module.exports = viewCart;