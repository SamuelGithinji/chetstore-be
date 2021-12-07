// import modules
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

//import files

const pool = require('../../config');

// define function

const signupUser = async (req, res) => {

    // declare variables (in try block)
    try {
        const {
            name, 
            email,
            password
        } = req.body;

        // check user input
        
        if(!name) return res.status(409).json({
            error: `Name is required`
        });

        if(!email) return res.status(409).json({
            error: `Email is required`
        });

        if(!password) return res.status(409).json({
            error: `Password is required`
        });

        // check if email is in database

        const checkUser = pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

        const checkUserRes = await  checkUser;

        if(checkUserRes.rows.length > 0) return res.status(409).json({
            error: `This email already exists`
        });

        // encrypt password

        const hashed = bcrypt.hashSync(password, 12);

        // add user to database with hashed password

        const addUser = pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`, [name, email, hashed]);

        const isAdded = await addUser;

        // create new authentication token for user in frontend

        const token  = jwt.sign({
            email
        }, process.env.secret_token);


        // send success response
        res.status(201).json({
            success: `Added account successfully`,
            token
        });

    } 
    // catch any errors and send to client/ console
    catch(e) {

        console.log(e)
        res.status(400).json({
            message: `An error occurred`,
            e
        })
    }
}

// export function to call in route

module.exports = signupUser;