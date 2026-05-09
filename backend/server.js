const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 内存数据存储（生产环境应使用数据库）
let posts = [];
let adminUser = {
  username: 'admin',
  password: '$2a$10$YourHashedPasswordHere' // 默认密码: admin123
};

// 初始化管理员密码
bcrypt.hash('admin123', 10).then(hash => {
  adminUser.password = hash;
});

// 认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '未授权' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '令牌无效' });
    }
    req.user = user;
    next();
  });
};

// 登录接口
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== adminUser.username) {
    return res.status(401).json({ message: '用户名或密码错误' });
  }

  const validPassword = await bcrypt.compare(password, adminUser.password);
  if (!validPassword) {
    return res.status(401).json({ message: '用户名或密码错误' });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, username });
});

// 获取所有帖子
app.get('/api/posts', (req, res) => {
  res.json(posts.sort((a, b) => b.createdAt - a.createdAt));
});

// 创建帖子（需要认证）
app.post('/api/posts', authenticateToken, (req, res) => {
  const { content, image } = req.body;

  const newPost = {
    id: Date.now().toString(),
    content,
    image: image || '',
    createdAt: Date.now(),
    comments: []
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

// 添加评论（无需认证）
app.post('/api/posts/:postId/comments', (req, res) => {
  const { postId } = req.params;
  const { author, content } = req.body;

  const post = posts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ message: '帖子不存在' });
  }

  const newComment = {
    id: Date.now().toString(),
    author: author || '匿名',
    content,
    createdAt: Date.now()
  };

  post.comments.push(newComment);
  res.status(201).json(newComment);
});

// 删除帖子（需要认证）
app.delete('/api/posts/:postId', authenticateToken, (req, res) => {
  const { postId } = req.params;
  posts = posts.filter(p => p.id !== postId);
  res.json({ message: '删除成功' });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
