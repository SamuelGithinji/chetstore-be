// import modules

const pool = require('../../config');

// import files

const authAccount = require('../authentication/authenticateToken');

// define function

const addComment = async (req, res) => {
    try {

        // declare variables

        const user = authAccount;

        const {
            postId,
        } = req.params;
    
        const {
            commentContent
        } = req.body;

        // see if email is in database

        const findUserQ = pool.query(`SELECT * FROM users WHERE email = $1`, [user.user.email]);

        const isUser = await findUserQ;
    
        if(isUser.rows.length < 1) return res.status(400).json({
            error: `Retry your login`
        });
    
        if(!commentContent) return res.status(409).json({
            error: `Comment is required`
        });

        // see if post is in forum
    
        const findPost = pool.query(`SELECT * FROM forum WHERE postid = $1`, [postId]);
    
        const posttExists = await findPost;
    
        if(posttExists.rows.length < 1) return res.status(400).json({
            error: `Could not complete your request. Invalid post id error`
        });

        // add comment to post
    
        const addToForumQ = pool.query(`INSERT INTO comments (postid, byuser, comment) VALUES ($1, $2, $3)`, [postId, isUser.rows[0].userid, commentContent]);

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

module.exports = addComment;