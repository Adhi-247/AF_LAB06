const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const PORT = 3000;
const SECRET = "mysecretkey";

// import
const authenticateToken = require('./middleware/authMiddleware');
const postController = require('./controllers/postController');

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

// Routes
app.post('/posts', authenticateToken, postController.createPost);
app.get('/posts', postController.getPosts);
app.put('/posts/:id', authenticateToken, postController.updatePost);
app.delete('/posts/:id', authenticateToken, postController.deletePost);

// Start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});