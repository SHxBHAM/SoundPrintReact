import { Link } from "react-router-dom";

interface HeaderProps {
  showNav?: boolean;
}

const Header = ({ showNav = true }: HeaderProps) => {
  return (
    <header className="border-b border-zinc-800/50 py-8 px-8 backdrop-blur-sm bg-black/20">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/home"
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-zinc-200 to-white bg-clip-text text-transparent tracking-wider"
        >
          SOUNDPRINT
        </Link>
        {showNav && (
          <nav className="hidden md:flex space-x-12">
            <a
              href="#about"
              className="text-sm text-zinc-400 hover:text-white transition-all duration-500 tracking-wide"
            >
              ABOUT
            </a>
            <a
              href="#how"
              className="text-sm text-zinc-400 hover:text-white transition-all duration-500 tracking-wide"
            >
              HOW IT WORKS
            </a>
            <a
              href="#faq"
              className="text-sm text-zinc-400 hover:text-white transition-all duration-500 tracking-wide"
            >
              FAQ
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
