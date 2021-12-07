// view 

const pool = require('../../config');

const authAccount = require('../authentication/authenticateToken');

const viewPosts = async (req, res) => {
    try {

        const viewFromDatabase = pool.query(`SELECT * FROM forum ORDER BY postid DESC`);

        const arePosts = await viewFromDatabase;

        if(arePosts.rows.length < 1) return res.status(404).json({
            error: `No posts found`
        });

        arePosts.rows.forEach((post) => {
            const findPostUser = pool.query(`SELECT * FROM users WHERE userid = $1`, [post.byuser])
            .then((response) => {
                post.byuser = response.rows[0].name;
            });
        });

        setTimeout(() => {
            res.status(201).json({
                message: `Posts data`,
                posts: arePosts.rows
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

module.exports = viewPosts;