const pool = require('../../config');

const authAccount = require('../authentication/authenticateToken');

const removeFromCart = async (req, res) => {
    try {

        const user = authAccount;
    
        const {
            cartId,
        } = req.body;

        const findUserQ = pool.query(`SELECT * FROM users WHERE email = $1`, [user.user.email]);

        const isUser = await findUserQ;
    
        const addToCartQ = pool.query(`DELETE FROM carts WHERE cartid = $1`, [cartId]);

        res.status(201).json({
            success: `Removed product successfully`
        })
    } catch (e) {
        console.log(e);
        res.status(400).json({
            message: `An error occured`,
            e
        });
    }
}

module.exports = removeFromCart;