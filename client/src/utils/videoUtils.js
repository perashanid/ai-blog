// Utility functions for handling video content, especially YouTube videos

/**
 * Extract YouTube video ID from various YouTube URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if not a valid YouTube URL
 */
export const extractYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /youtu\.be\/([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

/**
 * Check if a URL is a YouTube video URL
 * @param {string} url - URL to check
 * @returns {boolean} - True if it's a YouTube URL
 */
export const isYouTubeUrl = (url) => {
  return extractYouTubeId(url) !== null;
};

/**
 * Generate YouTube embed URL from video ID
 * @param {string} videoId - YouTube video ID
 * @param {object} options - Embed options
 * @returns {string} - YouTube embed URL
 */
export const getYouTubeEmbedUrl = (videoId, options = {}) => {
  const {
    autoplay = 0,
    controls = 1,
    modestbranding = 1,
    rel = 0,
    showinfo = 0,
    start = null
  } = options;
  
  let embedUrl = `https://www.youtube.com/embed/${videoId}?`;
  const params = new URLSearchParams({
    autoplay: autoplay.toString(),
    controls: controls.toString(),
    modestbranding: modestbranding.toString(),
    rel: rel.toString(),
    showinfo: showinfo.toString()
  });
  
  if (start) {
    params.append('start', start.toString());
  }
  
  return embedUrl + params.toString();
};

/**
 * Get YouTube video thumbnail URL
 * @param {string} videoId - YouTube video ID
 * @param {string} quality - Thumbnail quality (default, mqdefault, hqdefault, sddefault, maxresdefault)
 * @returns {string} - Thumbnail URL
 */
export const getYouTubeThumbnail = (videoId, quality = 'hqdefault') => {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

/**
 * Extract all YouTube URLs from text content
 * @param {string} content - Text content to search
 * @returns {Array} - Array of YouTube URLs found
 */
export const extractYouTubeUrls = (content) => {
  if (!content || typeof content !== 'string') return [];
  
  const urlPattern = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\s\n<>"']+)/g;
  const matches = [];
  let match;
  
  while ((match = urlPattern.exec(content)) !== null) {
    matches.push(match[0]);
  }
  
  return matches;
};

/**
 * Replace YouTube URLs in content with embed iframes
 * @param {string} content - Content with YouTube URLs
 * @param {object} embedOptions - Options for YouTube embed
 * @returns {string} - Content with YouTube embeds
 */
export const replaceYouTubeUrls = (content, embedOptions = {}) => {
  if (!content || typeof content !== 'string') return content;
  
  const urlPattern = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\s\n<>"']+)/g;
  
  return content.replace(urlPattern, (match) => {
    const videoId = extractYouTubeId(match);
    if (videoId) {
      const embedUrl = getYouTubeEmbedUrl(videoId, embedOptions);
      return `<div class="youtube-embed-container">
        <iframe 
          src="${embedUrl}" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen
          class="youtube-embed">
        </iframe>
      </div>`;
    }
    return match;
  });
};