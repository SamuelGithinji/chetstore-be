// import modules

const pool = require('../../config');

// import files

const authAccount = require('../authentication/authenticateToken');

// define function

const addToCart = async (req, res) => {
    try {

        // declare variables

        const user = authAccount;
    
        const {
            productId,
        } = req.body;

        // see if email is in database

        const findUserQ = pool.query(`SELECT * FROM users WHERE email = $1`, [user.user.email]);

        const isUser = await findUserQ;
    
        if(isUser.rows.length < 1) return res.status(400).json({
            error: `Retry your login`
        });

        // see if product is in database
    
        const findProduct = pool.query(`SELECT * FROM products WHERE productid = $1`, [productId]);
    
        const productExists = await findProduct;
    
        if(productExists.rows.length < 1) return res.status(400).json({
            error: `Invalid product id`
        });

        // add product to cart
    
        const addToCartQ = pool.query(`INSERT INTO carts (byuser, productid) VALUES ($1, $2)`, [isUser.rows[0].userid, productId]);

        const isAddedToCart = await addToCartQ;

        // send success
        res.status(201).json({
            success: `Added product to cart successfully`
        })
    } 
    
    // catch any error, send to client
    catch (e) {
        console.log(e);
        res.status(400).json({
            message: `An error occured`,
            e
        });
    }
}

module.exports = addToCart;