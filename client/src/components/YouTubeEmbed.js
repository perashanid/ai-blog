import { useState } from 'react';
import { HiPlay } from 'react-icons/hi2';
import { extractYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnail } from '../utils/videoUtils';

const YouTubeEmbed = ({ 
  url, 
  videoId, 
  title = "YouTube video player",
  autoplay = false,
  showThumbnail = true,
  className = "",
  ...embedOptions 
}) => {
  const [isLoaded, setIsLoaded] = useState(!showThumbnail);
  const [error, setError] = useState(false);
  
  // Extract video ID from URL if not provided directly
  const finalVideoId = videoId || extractYouTubeId(url);
  
  if (!finalVideoId) {
    return (
      <div className={`youtube-embed-error ${className}`}>
        <p>Invalid YouTube URL or video ID</p>
      </div>
    );
  }
  
  const embedUrl = getYouTubeEmbedUrl(finalVideoId, {
    autoplay: autoplay ? 1 : 0,
    ...embedOptions
  });
  
  const thumbnailUrl = getYouTubeThumbnail(finalVideoId, 'hqdefault');
  
  const handleThumbnailClick = () => {
    setIsLoaded(true);
  };
  
  const handleIframeError = () => {
    setError(true);
  };
  
  if (error) {
    return (
      <div className={`youtube-embed-error ${className}`}>
        <p>Failed to load YouTube video</p>
        <a 
          href={`https://www.youtube.com/watch?v=${finalVideoId}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="youtube-fallback-link"
        >
          Watch on YouTube
        </a>
      </div>
    );
  }
  
  return (
    <div className={`youtube-embed-container ${className}`}>
      {!isLoaded && showThumbnail ? (
        <div className="youtube-thumbnail" onClick={handleThumbnailClick}>
          <img 
            src={thumbnailUrl} 
            alt={title}
            className="youtube-thumbnail-image"
            onError={() => setError(true)}
          />
          <div className="youtube-play-button">
            <HiPlay className="play-icon" />
          </div>
          <div className="youtube-overlay">
            <span>Click to play</span>
          </div>
        </div>
      ) : (
        <iframe
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="youtube-embed"
          onError={handleIframeError}
        />
      )}
    </div>
  );
};

export default YouTubeEmbed;