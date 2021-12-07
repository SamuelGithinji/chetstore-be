// view 

const pool = require('../../config');

const authAccount = require('../authentication/authenticateToken');

const viewComments = async (req, res) => {

    const {
        postId
    } = req.params;
    try {

        const viewFromDatabase = pool.query(`SELECT * FROM forum WHERE postid = $1`, [postId]);

        const isPost = await viewFromDatabase;

        if(isPost.rows.length < 1) return res.status(404).json({
            error: `No post for this id`
        });

        
        const findPostUser = pool.query(`SELECT * FROM users WHERE userid = $1`, [isPost.rows[0].byuser]);

        const isPostUser = await findPostUser;

        const viewComments = pool.query(`SELECT * FROM comments WHERE postid = $1 ORDER BY commentid DESC`, [postId]);

        const areComments = await viewComments;

        // if(areComments.rows.length < 1) return res.status(404).json({
        //     error: `No comments found for this post`
        // });
        

        areComments.rows.forEach((comment) => {
            const findCommentUser = pool.query(`SELECT * FROM users WHERE userid = $1`, [comment.byuser])
            .then((response) => {
                comment.byuser = response.rows[0].name;
            });
        });


        setTimeout(() => {
            res.status(201).json({
                message: `Comments data`,
                post: isPost.rows[0],
                postOwner: isPostUser.rows[0].name,
                comments: areComments.rows
            });
        }, 2000);

    } catch(e) {
        console.log(e);
        res.status(400).json({
            message: `An error occured`,
            e
        });
    }
}

module.exports = viewComments;