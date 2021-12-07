// view 

const pool = require('../../config');

const authAccount = require('../authentication/authenticateToken');

const viewPost = async (req, res) => {

    const {
        postId
    } = req.query;

    try {

        const viewFromDatabase = pool.query(`SELECT * FROM forum WHERE postid = $1`, [postId]);

        const isPost = await viewFromDatabase;

        if(isPost.rows.length < 1) return res.status(404).json({
            error: `Invalid post id`
        });

        const findPostUser = pool.query(`SELECT * FROM users WHERE userid = $1`, [isPost.rows[0].byuser]);

        const isPostUser = await findPostUser;

        isPost.rows[0].byuser = isPostUser.rows[0].name;

        res.status(201).json({
            message: `Post data`,
            post: isPost.rows[0],
        });

    } catch(e) {
        console.log(e);
        res.status(400).json({
            message: `An error occured`,
            e
        });
    }
}

module.exports = viewPost;