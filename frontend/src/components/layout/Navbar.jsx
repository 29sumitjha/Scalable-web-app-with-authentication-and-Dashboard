import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">TaskMaster</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Profile
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Hi, {user?.name}</span>
                  <Button variant="secondary" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;