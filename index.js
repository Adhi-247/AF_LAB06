const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const PORT = 3000;
const SECRET = "mysecretkey";

// ================= DATA =================
let posts = [];
let id = 1;

// ================= AUTH MIDDLEWARE =================
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.status(403).send("Access Denied");

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).send("Invalid Token");

        req.user = user;
        next();
    });
}

// ================= ROUTES =================

// Home
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Login
app.post('/login', (req, res) => {
    const user = {
        username: req.body.username
    };

    const token = jwt.sign(user, SECRET);
    res.json({ token });
});

// CREATE POST (Protected)
app.post('/posts', authenticateToken, (req, res) => {
    const { title, content } = req.body;

    const newPost = {
        id: id++,
        title,
        content,
        user: req.user.username
    };

    posts.push(newPost);
    res.json(newPost);
});

// READ POSTS
app.get('/posts', (req, res) => {
    res.json(posts);
});

// UPDATE POST (Protected)
app.put('/posts/:id', authenticateToken, (req, res) => {
    const post = posts.find(p => p.id == req.params.id);

    if (!post) return res.status(404).send("Post not found");

    post.title = req.body.title;
    post.content = req.body.content;

    res.json(post);
});

// DELETE POST (Protected)
app.delete('/posts/:id', authenticateToken, (req, res) => {
    posts = posts.filter(p => p.id != req.params.id);
    res.send("Post deleted");
});

// START SERVER
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});