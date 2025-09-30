import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { postsAPI } from '../services/api';

const PostPage = () => {
  const { identifier } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [identifier]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postsAPI.getPost(identifier);
      setPost(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content) => {
    // If content contains HTML tags, render as HTML
    if (content.includes('<') && content.includes('>')) {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    
    // Otherwise, use the existing markdown-like formatting
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
      
      // Handle headers
      if (paragraph.startsWith('# ')) {
        return <h1 key={index} className="content-h1">{paragraph.substring(2)}</h1>;
      }
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="content-h2">{paragraph.substring(3)}</h2>;
      }
      if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="content-h3">{paragraph.substring(4)}</h3>;
      }
      
      // Handle lists
      if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').filter(line => line.startsWith('- '));
        return (
          <ul key={index} className="content-list">
            {items.map((item, i) => (
              <li key={i}>{item.substring(2)}</li>
            ))}
          </ul>
        );
      }
      
      // Handle numbered lists
      if (paragraph.match(/^\d+\. /)) {
        const items = paragraph.split('\n').filter(line => line.match(/^\d+\. /));
        return (
          <ol key={index} className="content-list">
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^\d+\. /, '')}</li>
            ))}
          </ol>
        );
      }
      
      // Regular paragraphs
      return <p key={index} className="content-paragraph">{paragraph}</p>;
    }).filter(Boolean);
  };

  const getReadingTime = (content) => {
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  if (loading) {
    return <LoadingSpinner message="Loading post..." />;
  }

  if (error) {
    return (
      <div className="error">
        <h2>Post Not Found</h2>
        <p>{error}</p>
        <Link to="/" className="btn">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="error">
        <h2>Post Not Found</h2>
        <p>The requested post could not be found.</p>
        <Link to="/" className="btn">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="post-page">
      <Link to="/" className="back-link">
        ← Back to Posts
      </Link>
      
      <article className="post-article">
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          
          <div className="post-meta">
            <div className="meta-left">
              <span className="post-date">{formatDate(post.date)}</span>
              <span className="reading-time">{getReadingTime(post.content)}</span>
            </div>
            <span className={`post-type ${post.ai_generated ? 'ai' : 'manual'}`}>
              {post.ai_generated ? '🤖 AI-Generated' : '✍️ Manual'}
            </span>
          </div>
        </header>
        
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            <h4>Tags:</h4>
            <div className="tags-list">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {post.media && post.media.length > 0 && (
          <div className="post-media">
            <h4>Media:</h4>
            <div className="media-gallery">
              {post.media.map((item, index) => (
                <div key={index} className="media-item">
                  {item.type === 'image' ? (
                    <img src={item.url} alt={item.caption} />
                  ) : (
                    <video src={item.url} controls />
                  )}
                  {item.caption && <p className="media-caption">{item.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="post-content">
          {formatContent(post.content)}
        </div>
      </article>
    </div>
  );
};

export default PostPage;