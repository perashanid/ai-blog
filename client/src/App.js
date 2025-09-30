import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import PostPage from './components/PostPage';
import AdminLogin from './components/AdminLogin';
import Contact from './components/Contact';
import AboutUs from './components/AboutUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Import modern fonts
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/jetbrains-mono/400.css';

import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/post/:identifier" element={<PostPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/secret-admin-portal" element={<AdminLogin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
