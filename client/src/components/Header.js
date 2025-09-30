import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Intellect
        </Link>
        <nav className="nav-links">
          <Link to="/contact">Contact</Link>
          <Link to="/about">About Us</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;