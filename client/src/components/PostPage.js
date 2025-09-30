import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiCpuChip, HiPencilSquare, HiClock, HiArrowLeft, HiNewspaper } from 'react-icons/hi2';
import LoadingSpinner from './LoadingSpinner';
import YouTubeEmbed from './YouTubeEmbed';
import { postsAPI } from '../services/api';
import { isYouTubeUrl, replaceYouTubeUrls } from '../utils/videoUtils';

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
    // First, replace YouTube URLs with embeds
    let processedContent = replaceYouTubeUrls(content);
    
    // Convert markdown links to HTML links
    processedContent = processedContent.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="content-link">$1</a>'
    );
    
    // Convert plain URLs to clickable links (but not if they're already in HTML tags)
    processedContent = processedContent.replace(
      /(?<!href=["'])(https?:\/\/[^\s<>"]+)(?![^<]*>)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="content-link">$1</a>'
    );
    
    // If content contains HTML tags, we need to format it properly while preserving the HTML
    if (processedContent.includes('<') && processedContent.includes('>')) {
      // Process HTML content to add proper classes to images
      processedContent = processedContent.replace(
        /<img([^>]*)>/g, 
        '<img$1 class="content-image" />'
      );
      
      // Format the HTML content with proper paragraph structure
      const formattedHtml = processedContent
        // Split by double line breaks to create paragraphs
        .split(/\n\s*\n/)
        .map(paragraph => {
          const trimmed = paragraph.trim();
          if (!trimmed) return '';
          
          // Check if it's already a header or other block element
          if (trimmed.match(/^<(h[1-6]|div|blockquote|ul|ol|pre|img)/i)) {
            return trimmed;
          }
          
          // Wrap in paragraph tags if not already wrapped
          if (!trimmed.startsWith('<p>')) {
            return `<p class="content-paragraph">${trimmed}</p>`;
          }
          
          return trimmed;
        })
        .filter(p => p)
        .join('\n\n');
      
      return <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />;
    }
    
    // Split content by various delimiters to handle mixed content
    const parts = content.split(/(\n\n|\n(?=<img)|(?<=<\/?\w+[^>]*>)\n)/);
    const elements = [];
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      if (!part || part === '\n' || part === '\n\n') continue;
      
      // Handle HTML images
      if (part.includes('<img')) {
        const imgMatch = part.match(/<img[^>]*src="([^"]*)"[^>]*>/);
        if (imgMatch) {
          elements.push(
            <div key={`img-${i}`} className="content-image-container">
              <img src={imgMatch[1]} alt="" className="content-image" />
            </div>
          );
          continue;
        }
      }
      
      // Handle headers
      if (part.startsWith('# ')) {
        elements.push(<h1 key={i} className="content-h1">{part.substring(2).trim()}</h1>);
        continue;
      }
      if (part.startsWith('## ')) {
        elements.push(<h2 key={i} className="content-h2">{part.substring(3).trim()}</h2>);
        continue;
      }
      if (part.startsWith('### ')) {
        elements.push(<h3 key={i} className="content-h3">{part.substring(4).trim()}</h3>);
        continue;
      }
      
      // Handle unordered lists
      if (part.includes('\n- ') || part.startsWith('- ')) {
        const items = part.split('\n')
          .filter(line => line.trim().startsWith('- '))
          .map(line => line.trim().substring(2).trim());
        
        elements.push(
          <ul key={i} className="content-list">
            {items.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        );
        continue;
      }
      
      // Handle ordered lists
      if (part.match(/^\d+\.\s/) || part.includes('\n1. ')) {
        const items = part.split('\n')
          .filter(line => line.trim().match(/^\d+\.\s/))
          .map(line => line.trim().replace(/^\d+\.\s/, ''));
        
        elements.push(
          <ol key={i} className="content-list">
            {items.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ol>
        );
        continue;
      }
      
      // Handle blockquotes
      if (part.startsWith('> ')) {
        elements.push(
          <blockquote key={i} className="content-blockquote">
            {part.substring(2).trim()}
          </blockquote>
        );
        continue;
      }
      
      // Handle code blocks
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3).trim();
        elements.push(
          <pre key={i} className="content-code-block">
            <code>{code}</code>
          </pre>
        );
        continue;
      }
      
      // Regular paragraphs - handle line breaks properly
      if (part.length > 0) {
        const lines = part.split('\n').filter(line => line.trim());
        if (lines.length > 0) {
          const formattedParagraph = lines.map((line, lineIndex) => (
            <span key={lineIndex}>
              {line.trim()}
              {lineIndex < lines.length - 1 && <br />}
            </span>
          ));
          
          elements.push(<p key={i} className="content-paragraph">{formattedParagraph}</p>);
        }
      }
    }
    
    return elements;
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
        <HiArrowLeft className="w-4 h-4" />
        Back to Posts
      </Link>
      
      <article className="post-article">
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          
          <div className="post-meta">
            <div className="meta-left">
              <span className="post-date">{formatDate(post.date)}</span>
              <span className="reading-time">
                <HiClock className="inline w-4 h-4 mr-1" />
                {getReadingTime(post.content)}
              </span>
            </div>
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
                  ) : item.type === 'youtube' ? (
                    <YouTubeEmbed 
                      url={item.url}
                      videoId={item.videoId}
                      title={item.caption || `Video ${index + 1}`}
                      showThumbnail={true}
                    />
                  ) : item.type === 'video' && isYouTubeUrl(item.url) ? (
                    <YouTubeEmbed 
                      url={item.url} 
                      title={item.caption || `Video ${index + 1}`}
                      showThumbnail={true}
                    />
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