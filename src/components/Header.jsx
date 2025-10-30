import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useState } from "react";

const navItems = [
  { label: "Browse Cars", href: "/browse-cars" },
  { label: "Auto Parts", href: "/auto-parts" },
  { label: "Sell Items", href: "/sell-items" },
  { label: "About", href: "/about" },
];

const Header = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white bg-opacity-40 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 shadow-md">
      <div className="flex justify-between items-center gap-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-700 rounded-md" />
          <h1 className="text-lg sm:text-2xl font-bold text-blue-900 whitespace-nowrap">
            SalvageSearch
          </h1>
        </Link>

        {/* Navigation Section - Desktop */}
        <nav className="hidden md:flex gap-4 lg:gap-6 flex-1 justify-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-black font-semibold hover:text-blue-700 text-sm lg:text-base whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Navigation Dropdown - Mobile */}
        <div className="md:hidden relative flex-1">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-blue-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800 flex items-center justify-center gap-2"
          >
            Menu
            <span className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg mt-2 z-10">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-3 text-black font-semibold hover:bg-blue-100 hover:text-blue-700 border-b border-gray-200 last:border-b-0"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Auth & Cart Section */}
        <div className="flex gap-2 sm:gap-3 lg:gap-4 items-center flex-shrink-0">
          {user ? (
            <>
              <Link
                to="/profile"
                className="hidden sm:block text-black font-semibold hover:text-blue-700 text-sm lg:text-base"
              >
                {user.username}
              </Link>
              <button
                onClick={logout}
                className="bg-white text-black px-2 sm:px-4 py-1 sm:py-2 rounded-md border border-black hover:shadow text-xs sm:text-sm font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/signin"
              className="bg-white text-black px-2 sm:px-4 py-1 sm:py-2 rounded-md border border-black hover:shadow text-xs sm:text-sm font-semibold"
            >
              Sign In
            </Link>
          )}

          <Link
            to="/cart"
            className="bg-blue-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md flex items-center gap-1 sm:gap-2 hover:bg-blue-800 text-xs sm:text-sm font-semibold whitespace-nowrap"
          >
            🛒 <span className="hidden sm:inline">View Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
