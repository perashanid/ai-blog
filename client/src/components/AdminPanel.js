import React, { useState } from 'react';
import { postsAPI } from '../services/api';

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'published',
    media: [],
    tags: []
  });
  const [editingPost, setEditingPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('create');
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    aiPosts: 0,
    manualPosts: 0
  });
  const [profile, setProfile] = useState(null);

  const handleCredentialChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleMediaAdd = () => {
    const url = prompt('Enter image/video URL (supports YouTube links):');
    const caption = prompt('Enter caption (optional):');
    
    if (url) {
      let type = 'video';
      
      // Detect media type
      if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        type = 'image';
      } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
        type = 'youtube';
      }
      
      setFormData({
        ...formData,
        media: [...formData.media, { type, url, caption: caption || '', position: formData.media.length }]
      });
    }
  };

  const handleMediaRemove = (index) => {
    const newMedia = formData.media.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      media: newMedia
    });
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData({
      ...formData,
      tags
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      setMessage({ type: 'error', text: 'Please enter both username and password' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // Test authentication by trying to fetch admin posts
      await postsAPI.getAdminPosts(credentials);
      setIsAuthenticated(true);
      setMessage({ type: 'success', text: 'Successfully authenticated!' });
      
      // Load initial data
      await loadDashboardData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [postsResponse, profileResponse] = await Promise.all([
        postsAPI.getAdminPosts(credentials),
        postsAPI.getAdminProfile(credentials)
      ]);
      
      setPosts(postsResponse.data);
      setProfile(profileResponse.data);
      
      // Use stats from profile for accuracy
      setStats(profileResponse.data.stats);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setLoading(true);
      await postsAPI.deletePost(postId, credentials);
      setMessage({ type: 'success', text: 'Post deleted successfully!' });
      
      // Reload data
      await loadDashboardData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setMessage({ type: 'error', text: 'Please fill in both title and content' });
      return;
    }

    if (formData.title.length > 200) {
      setMessage({ type: 'error', text: 'Title cannot exceed 200 characters' });
      return;
    }

    if (formData.content.length > 50000) {
      setMessage({ type: 'error', text: 'Content cannot exceed 50000 characters' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      if (isEditing && editingPost) {
        await postsAPI.updatePost(editingPost._id, formData, credentials);
        setMessage({ type: 'success', text: 'Post updated successfully!' });
        setIsEditing(false);
        setEditingPost(null);
      } else {
        await postsAPI.createPost(formData, credentials);
        setMessage({ type: 'success', text: 'Post created successfully!' });
      }
      
      setFormData({ title: '', content: '', status: 'published', media: [], tags: [] });
      
      // Reload dashboard data
      await loadDashboardData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = async (postId) => {
    try {
      setLoading(true);
      const response = await postsAPI.getAdminPost(postId, credentials);
      const post = response.data;
      
      setEditingPost(post);
      setFormData({
        title: post.title,
        content: post.content,
        status: post.status || 'published',
        media: post.media || [],
        tags: post.tags || []
      });
      setIsEditing(true);
      setActiveTab('create');
      setMessage({ type: 'success', text: 'Post loaded for editing!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingPost(null);
    setFormData({ title: '', content: '', status: 'published', media: [], tags: [] });
    setMessage({ type: '', text: '' });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
    setFormData({ title: '', content: '', status: 'published', media: [], tags: [] });
    setMessage({ type: '', text: '' });
    setActiveTab('create');
    setPosts([]);
    setStats({ totalPosts: 0, aiPosts: 0, manualPosts: 0 });
    setProfile(null);
    setIsEditing(false);
    setEditingPost(null);
  };

  const handleGenerateAI = async () => {
    if (!window.confirm('Generate a new AI post? This may take a few moments.')) {
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      await postsAPI.generateAIPost(credentials);
      
      setMessage({ type: 'success', text: 'AI post generated successfully!' });
      
      // Reload dashboard data
      await loadDashboardData();
      
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNewsDigest = async () => {
    if (!window.confirm('Generate today\'s tech news digest? This may take a few moments.')) {
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      await postsAPI.generateNewsDigest(credentials);
      
      setMessage({ type: 'success', text: 'Tech news digest generated successfully!' });
      
      // Reload dashboard data
      await loadDashboardData();
      
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalPosts}</h3>
          <p>Total Posts</p>
        </div>
        <div className="stat-card">
          <h3>{stats.aiPosts}</h3>
          <p>AI Generated</p>
        </div>
        <div className="stat-card">
          <h3>{stats.manualPosts}</h3>
          <p>Manual Posts</p>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <h3>Content Generation</h3>
        <div className="action-buttons-grid">
          <button 
            className="btn generate-ai-btn"
            onClick={handleGenerateAI}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate AI Post'}
          </button>
          <button 
            className="btn generate-news-btn"
            onClick={handleGenerateNewsDigest}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Tech News Digest'}
          </button>
        </div>
        <p className="action-description">
          Generate new content automatically using AI. AI posts cover various tech topics, 
          while news digests aggregate the latest tech news from multiple sources.
        </p>
      </div>
    </div>
  );

  const renderPostsList = () => (
    <div className="posts-list">
      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="posts-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>
                    <span className={`post-type ${post.ai_generated ? 'ai' : 'manual'}`}>
                      {post.ai_generated ? 'AI Generated' : 'Manual'}
                    </span>
                  </td>
                  <td>{new Date(post.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status ${post.status || 'published'}`}>
                      {post.status || 'Published'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn edit-btn"
                        onClick={() => handleEditPost(post._id)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn delete-btn"
                        onClick={() => handleDeletePost(post._id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="admin-profile">
      <h2>Admin Profile</h2>
      {profile ? (
        <div className="profile-content">
          <div className="profile-info">
            <div className="profile-card">
              <h3>Profile Information</h3>
              <div className="profile-details">
                <div className="profile-item">
                  <label>Username:</label>
                  <span>{profile.username}</span>
                </div>
                <div className="profile-item">
                  <label>Role:</label>
                  <span>{profile.role}</span>
                </div>
                <div className="profile-item">
                  <label>Member Since:</label>
                  <span>{new Date(profile.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="profile-stats">
              <h3>Your Statistics</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <h4>{profile.stats.totalPosts}</h4>
                  <p>Total Posts</p>
                </div>
                <div className="stat-card">
                  <h4>{profile.stats.aiPosts}</h4>
                  <p>AI Generated</p>
                </div>
                <div className="stat-card">
                  <h4>{profile.stats.manualPosts}</h4>
                  <p>Manual Posts</p>
                </div>
              </div>
            </div>
          </div>
          
          {profile.recentActivity && profile.recentActivity.length > 0 && (
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {profile.recentActivity.map(post => (
                  <div key={post._id} className="activity-item">
                    <span className="activity-title">{post.title}</span>
                    <span className="activity-meta">
                      {post.ai_generated ? 'AI Generated' : 'Manual'} • {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );

  const renderCreatePost = () => (
    <div className="create-post">
      <div className="post-form-header">
        <h2>{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
        {isEditing && (
          <button 
            type="button" 
            className="btn cancel-btn"
            onClick={handleCancelEdit}
          >
            Cancel Edit
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            placeholder="Enter post title (max 200 characters)"
            maxLength={200}
            required
          />
          <small style={{ color: '#666', fontSize: '0.8rem' }}>
            {formData.title.length}/200 characters
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleFormChange}
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated):</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags.join(', ')}
            onChange={handleTagsChange}
            placeholder="Enter tags separated by commas"
          />
        </div>
        
        <div className="form-group">
          <label>Media:</label>
          <div className="media-section">
            <button 
              type="button" 
              className="btn media-btn"
              onClick={handleMediaAdd}
            >
              Add Image/Video
            </button>
            
            {formData.media.length > 0 && (
              <div className="media-list">
                {formData.media.map((item, index) => (
                  <div key={index} className="media-item">
                    <div className="media-preview">
                      {item.type === 'image' ? (
                        <img src={item.url} alt={item.caption} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                      ) : (
                        <video src={item.url} style={{ maxWidth: '100px', maxHeight: '100px' }} controls />
                      )}
                    </div>
                    <div className="media-info">
                      <p><strong>Type:</strong> {item.type}</p>
                      <p><strong>URL:</strong> {item.url}</p>
                      <p><strong>Caption:</strong> {item.caption}</p>
                    </div>
                    <button 
                      type="button"
                      className="btn delete-btn"
                      onClick={() => handleMediaRemove(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleFormChange}
            placeholder="Enter post content (max 50000 characters). You can use HTML tags for formatting."
            maxLength={50000}
            required
          />
          <small style={{ color: '#666', fontSize: '0.8rem' }}>
            {formData.content.length}/50000 characters
          </small>
          <div className="content-help">
            <p><strong>HTML Tips:</strong></p>
            <ul>
              <li>&lt;h1&gt;, &lt;h2&gt;, &lt;h3&gt; for headings</li>
              <li>&lt;p&gt; for paragraphs</li>
              <li>&lt;strong&gt; for bold, &lt;em&gt; for italic</li>
              <li>&lt;ul&gt;&lt;li&gt; for lists</li>
              <li>&lt;img src="url" alt="description"&gt; for images</li>
              <li>&lt;a href="url"&gt;link text&lt;/a&gt; for links</li>
            </ul>
          </div>
        </div>
        
        <button type="submit" className="btn" disabled={loading}>
          {loading ? (isEditing ? 'Updating Post...' : 'Creating Post...') : (isEditing ? 'Update Post' : 'Create Post')}
        </button>
      </form>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="admin-panel">
        <div className="login-container">
          <div className="login-header">
            <h1 className="admin-title">Admin Panel</h1>
            <p>Please login to access the admin dashboard</p>
          </div>
          
          {message.text && (
            <div className={`${message.type}-message`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleCredentialChange}
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleCredentialChange}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button type="submit" className="btn login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="login-info">
            <p><strong>Default Credentials:</strong></p>
            <p>Username: admin</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <div className="admin-user">
          <span>Welcome, {credentials.username}</span>
          <button onClick={handleLogout} className="btn logout-btn">
            Logout
          </button>
        </div>
      </div>
      
      {message.text && (
        <div className={`${message.type}-message`}>
          {message.text}
        </div>
      )}
      
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Post
        </button>
        <button 
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          All Posts
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'create' && renderCreatePost()}
        {activeTab === 'posts' && renderPostsList()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};

export default AdminPanel;