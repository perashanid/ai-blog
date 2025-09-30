import { Link } from 'react-router-dom';
import { HiHome, HiCog6Tooth } from 'react-icons/hi2';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Intellect
        </Link>
        <nav className="nav-links">
          <Link to="/">
            <HiHome className="w-4 h-4" />
            Home
          </Link>
          <Link to="/admin">
            <HiCog6Tooth className="w-4 h-4" />
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;