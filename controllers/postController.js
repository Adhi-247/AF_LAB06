let posts = [];
let id = 1;

exports.createPost = (req, res) => {
    const { title, content } = req.body;

    const newPost = {
        id: id++,
        title,
        content,
        user: req.user.username
    };

    posts.push(newPost);
    res.json(newPost);
};

exports.getPosts = (req, res) => {
    res.json(posts);
};

exports.updatePost = (req, res) => {
    const post = posts.find(p => p.id == req.params.id);

    if (!post) return res.status(404).send("Post not found");

    post.title = req.body.title;
    post.content = req.body.content;

    res.json(post);
};

exports.deletePost = (req, res) => {
    posts = posts.filter(p => p.id != req.params.id);
    res.send("Post deleted");
};