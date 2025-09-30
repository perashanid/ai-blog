import { useState } from 'react';
import { HiPlus, HiTrash } from 'react-icons/hi2';
import YouTubeEmbed from './YouTubeEmbed';
import { isYouTubeUrl, extractYouTubeId } from '../utils/videoUtils';

const YouTubeUrlInput = ({ onAdd, existingVideos = [] }) => {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setError('');
    
    if (newUrl && isYouTubeUrl(newUrl)) {
      const videoId = extractYouTubeId(newUrl);
      if (videoId) {
        setPreview({ url: newUrl, videoId });
      } else {
        setPreview(null);
        setError('Invalid YouTube URL');
      }
    } else if (newUrl) {
      setPreview(null);
      setError('Please enter a valid YouTube URL');
    } else {
      setPreview(null);
    }
  };

  const handleAdd = () => {
    if (!url) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!isYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    const videoId = extractYouTubeId(url);
    if (!videoId) {
      setError('Could not extract video ID from URL');
      return;
    }

    // Check if video already exists
    const exists = existingVideos.some(video => 
      video.videoId === videoId || video.url === url
    );

    if (exists) {
      setError('This video has already been added');
      return;
    }

    onAdd({
      type: 'youtube',
      url,
      caption,
      videoId,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    });

    // Reset form
    setUrl('');
    setCaption('');
    setPreview(null);
    setError('');
  };

  return (
    <div className="youtube-url-input">
      <h4>Add YouTube Video</h4>
      
      <div className="input-group">
        <label htmlFor="youtube-url">YouTube URL:</label>
        <input
          id="youtube-url"
          type="url"
          value={url}
          onChange={handleUrlChange}
          placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
          className={error ? 'error' : ''}
        />
        {error && <span className="error-message">{error}</span>}
      </div>

      <div className="input-group">
        <label htmlFor="youtube-caption">Caption (optional):</label>
        <input
          id="youtube-caption"
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Enter a caption for this video"
        />
      </div>

      {preview && (
        <div className="youtube-preview">
          <h5>Preview:</h5>
          <YouTubeEmbed 
            url={preview.url}
            videoId={preview.videoId}
            title={caption || 'YouTube Video Preview'}
            showThumbnail={true}
          />
        </div>
      )}

      <button 
        type="button" 
        onClick={handleAdd}
        className="btn btn-primary"
        disabled={!preview}
      >
        <HiPlus className="inline w-4 h-4 mr-1" />
        Add Video
      </button>
    </div>
  );
};

export default YouTubeUrlInput;