import { Link } from "react-router-dom";

const navItems = [
  { label: "Browse Cars", href: "/browse-cars" },
  { label: "Auto Parts", href: "/auto-parts" },
  { label: "Sell Items", href: "/sell-items" },
  { label: "About", href: "/about" },
];

const Header = () => {
  return (
    <header className="w-full bg-white bg-opacity-40 backdrop-blur-sm px-6 py-4 shadow-md flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-blue-700 rounded-md" />
        <h1 className="text-2xl font-bold text-blue-900">SalvageSearch</h1>
      </Link>

      <nav className="flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="text-black font-semibold hover:text-blue-700"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex gap-4">
        <Link
          to="/signin"
          className="bg-white text-black px-4 py-2 rounded-md border border-black hover:shadow"
        >
          Sign In
        </Link>
        <Link
          to="/cart"
          className="bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-800"
        >
          🛒 View Cart
        </Link>
      </div>
    </header>
  );
};

export default Header;
