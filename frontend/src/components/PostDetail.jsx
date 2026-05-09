import { useState, useEffect } from 'react';
import './PostDetail.css';

const API_URL = 'http://172.20.10.3:5000/api';

function PostDetail({ post, onClose, nickname, isLoggedIn, token, onDelete }) {
  const [comments, setComments] = useState(post.comments || []);
  const [commentContent, setCommentContent] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      const response = await fetch(`${API_URL}/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          author: nickname,
          content: commentContent
        })
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([...comments, newComment]);
        setCommentContent('');
      }
    } catch (error) {
      console.error('添加评论失败:', error);
    }
  };

  return (
    <div className="post-detail-overlay" onClick={onClose}>
      <div className="post-detail-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>✕</button>

        {isLoggedIn && (
          <button onClick={() => onDelete(post.id)} className="btn-delete-detail">
            删除帖子
          </button>
        )}

        <div className="post-detail-body">
          <p className="post-detail-text">{post.content}</p>
          {post.image && (
            <div className="post-detail-image">
              <img src={post.image} alt="帖子图片" />
            </div>
          )}
          <p className="post-detail-date">
            {new Date(post.createdAt).toLocaleString('zh-CN')}
          </p>
        </div>

        <div className="comments-section-detail">
          <h3>评论 ({comments.length})</h3>
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment-detail">
                <strong>{comment.author}</strong>
                <p>{comment.content}</p>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleString('zh-CN')}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="comment-form-detail">
            <textarea
              placeholder="写下你的评论..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows="3"
            />
            <button type="submit" className="btn-primary">
              发表评论
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
