# 我的碎碎念网站

一个简单的个人博客网站，支持管理员发帖和访客评论。

## 功能特点

- 欢迎页面，带有自定义背景和进入按钮
- 管理员登录后可以发布和删除帖子
- 访客可以匿名评论
- 响应式设计

## 技术栈

- 前端: React + Vite
- 后端: Node.js + Express
- 认证: JWT

## 安装和运行

### 1. 启动后端服务器

```bash
cd backend
npm run dev
```

后端服务器将运行在 http://localhost:5000

### 2. 启动前端开发服务器

打开新的终端窗口：

```bash
cd frontend
npm run dev
```

前端将运行在 http://localhost:5173

### 3. 访问网站

在浏览器中打开 http://localhost:5173

## 默认登录信息

- 用户名: admin
- 密码: admin123

## 修改背景图

要自定义欢迎页面的背景，可以修改 `frontend/src/components/WelcomePage.css` 文件中的 `.welcome-page` 样式。

当前使用的是渐变背景，你可以替换为图片：

```css
.welcome-page {
  background-image: url('你的图片路径');
  background-size: cover;
  background-position: center;
}
```

## 注意事项

- 当前数据存储在内存中，重启服务器后数据会丢失
- 生产环境建议使用真实数据库（如 MongoDB、PostgreSQL）
- 记得修改 `.env` 文件中的 JWT_SECRET
