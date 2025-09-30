import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/${post.slug || post._id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReadingTime = (content) => {
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  return (
    <article className="post-card" onClick={handleClick}>
      <div className="post-card-header">
        <span className={`post-type ${post.ai_generated ? 'ai' : 'manual'}`}>
          {post.ai_generated ? '🤖 AI-Generated' : '✍️ Manual'}
        </span>
        <span className="reading-time">{getReadingTime(post.content)}</span>
      </div>
      
      <h2 className="post-card-title">{post.title}</h2>
      <p className="post-excerpt">{post.excerpt}</p>
      
      <div className="post-card-footer">
        <span className="post-date">{formatDate(post.date)}</span>
        <span className="read-more">Read more →</span>
      </div>
    </article>
  );
};

export default PostCard;