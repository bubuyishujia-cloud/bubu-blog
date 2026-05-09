import { useState, useEffect } from 'react';
import './MainPage.css';
import avatarImg from '../assets/avatar.jpg';
import PostDetail from './PostDetail';

const API_URL = 'https://bubu-blog-backend.onrender.com/api';

function MainPage({ isLoggedIn, token, nickname, onNicknameChange, onLoginClick, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', image: '' });
  const [selectedPost, setSelectedPost] = useState(null);
  const [showNicknameEdit, setShowNicknameEdit] = useState(false);
  const [tempNickname, setTempNickname] = useState(nickname);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('获取帖子失败:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPost)
      });

      if (response.ok) {
        setNewPost({ content: '', image: '' });
        setShowNewPost(false);
        fetchPosts();
      }
    } catch (error) {
      console.error('创建帖子失败:', error);
    }
  };

  const handleAddComment = async (postId) => {
    const commentData = commentInputs[postId];
    if (!commentData?.content?.trim()) return;

    try {
      const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
      });

      if (response.ok) {
        setCommentInputs({ ...commentInputs, [postId]: { author: '', content: '' } });
        fetchPosts();
      }
    } catch (error) {
      console.error('添加评论失败:', error);
    }
  };

  const handleNicknameSave = () => {
    if (tempNickname.trim()) {
      onNicknameChange(tempNickname);
      setShowNicknameEdit(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({ ...newPost, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('确定要删除这篇帖子吗？')) return;

    try {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSelectedPost(null);
        fetchPosts();
      }
    } catch (error) {
      console.error('删除帖子失败:', error);
    }
  };

  const updateCommentInput = (postId, field, value) => {
    setCommentInputs({
      ...commentInputs,
      [postId]: {
        ...(commentInputs[postId] || { author: '', content: '' }),
        [field]: value
      }
    });
  };

  return (
    <div className="main-page">
      <header className="header">
        <div className="header-left">
          <img src={avatarImg} alt="布布" className="avatar" />
          <h1>布布的家</h1>
        </div>
        <div className="header-actions">
          {!isLoggedIn && (
            <div className="nickname-display">
              {showNicknameEdit ? (
                <div className="nickname-edit">
                  <input
                    type="text"
                    value={tempNickname}
                    onChange={(e) => setTempNickname(e.target.value)}
                    placeholder="输入昵称"
                  />
                  <button onClick={handleNicknameSave} className="btn-save">保存</button>
                  <button onClick={() => setShowNicknameEdit(false)} className="btn-cancel">取消</button>
                </div>
              ) : (
                <div className="nickname-show" onClick={() => setShowNicknameEdit(true)}>
                  {nickname} ✏️
                </div>
              )}
            </div>
          )}
          {isLoggedIn ? (
            <>
              <button onClick={() => setShowNewPost(true)} className="btn-primary">
                发布新帖
              </button>
              <button onClick={onLogout} className="btn-secondary">
                退出登录
              </button>
            </>
          ) : (
            <button onClick={onLoginClick} className="btn-primary">
              登录
            </button>
          )}
        </div>
      </header>

      <main className="content">
        {showNewPost && (
          <div className="new-post-form">
            <h2>发布新帖</h2>
            <form onSubmit={handleCreatePost}>
              <textarea
                placeholder="分享你的想法..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                required
                rows="6"
              />
              <div className="image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="image-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="image-upload" className="upload-label">
                  📷 添加图片
                </label>
                {newPost.image && (
                  <div className="image-preview">
                    <img src={newPost.image} alt="预览" />
                    <button
                      type="button"
                      onClick={() => setNewPost({ ...newPost, image: '' })}
                      className="remove-image"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">发布</button>
                <button type="button" onClick={() => setShowNewPost(false)} className="btn-secondary">
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="posts-list">
          {posts.length === 0 ? (
            <p className="empty-message">还没有帖子，快来发布第一篇吧！</p>
          ) : (
            posts.map(post => (
              <div key={post.id} className="post-card" onClick={() => setSelectedPost(post)}>
                <p className="post-content">{post.content}</p>
                {post.image && (
                  <div className="post-image">
                    <img src={post.image} alt="帖子图片" />
                  </div>
                )}
                <div className="post-footer">
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleString('zh-CN')}
                  </span>
                  <span className="comment-count">
                    💬 {post.comments?.length || 0}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedPost && (
          <PostDetail
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            nickname={nickname}
            isLoggedIn={isLoggedIn}
            token={token}
            onDelete={handleDeletePost}
          />
        )}
      </main>
    </div>
  );
}

export default MainPage;
