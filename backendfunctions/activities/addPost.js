// import modules

const pool = require('../../config');

// import files

const authAccount = require('../authentication/authenticateToken');

// define function

const addPost = async (req, res) => {
    try {

        // declare variables

        const user = authAccount;
    
        const {
            postTitle,
            postContent
        } = req.body;

        // see if email is in database

        const findUserQ = pool.query(`SELECT * FROM users WHERE email = $1`, [user.user.email]);

        const isUser = await findUserQ;
    
        if(isUser.rows.length < 1) return res.status(400).json({
            error: `Retry your login`
        });
    
        if(!postTitle) return res.status(409).json({
            error: `Post title is required`
        });
    
        if(!postContent) return res.status(409).json({
            error: `Post content is required`
        });

        // see if post is in forum
    
        const findPost = pool.query(`SELECT * FROM forum WHERE posttitle = $1`, [postTitle]);
    
        const posttExists = await findPost;
    
        if(posttExists.rows.length > 0) return res.status(400).json({
            error: `Choose a different title`
        });

        // add post to forum
    
        const addToForumQ = pool.query(`INSERT INTO forum (byuser, posttitle, postcontent) VALUES ($1, $2, $3)`, [isUser.rows[0].userid, postTitle, postContent]);

        const isAddedPost = await addToForumQ;

        // send success
        res.status(201).json({
            success: `Added post successfully`
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

module.exports = addPost;