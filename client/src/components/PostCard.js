import { useNavigate } from 'react-router-dom';
import { HiCpuChip, HiPencilSquare, HiClock, HiArrowRight, HiNewspaper } from 'react-icons/hi2';

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

  const formatExcerpt = (excerpt) => {
    if (!excerpt) return '';
    
    // Remove markdown links from excerpt for cleaner display
    return excerpt.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  };

  return (
    <article className="post-card" onClick={handleClick}>
      <div className="post-card-header">
        <span className={`post-type ${post.newsDigest ? 'news-digest' : post.ai_generated ? 'ai' : 'manual'}`}>
          {post.newsDigest ? (
            <>
              <HiNewspaper className="inline w-4 h-4 mr-1" />
              News Digest
            </>
          ) : post.ai_generated ? (
            <>
              <HiCpuChip className="inline w-4 h-4 mr-1" />
              AI-Generated
            </>
          ) : (
            <>
              <HiPencilSquare className="inline w-4 h-4 mr-1" />
              Manual
            </>
          )}
        </span>
        <span className="reading-time">
          <HiClock className="inline w-4 h-4 mr-1" />
          {getReadingTime(post.content)}
        </span>
      </div>
      
      <h2 className="post-card-title">{post.title}</h2>
      <p className="post-excerpt">{formatExcerpt(post.excerpt)}</p>
      
      <div className="post-card-footer">
        <span className="post-date">{formatDate(post.date)}</span>
        <span className="read-more">
          Read more <HiArrowRight className="inline w-4 h-4 ml-1" />
        </span>
      </div>
    </article>
  );
};

export default PostCard;