import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-zinc-800/50 py-8 px-4 backdrop-blur-sm bg-black/20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs text-zinc-500 mb-4 md:mb-0 hover:text-zinc-400 transition-all duration-500">
            © {new Date().getFullYear()} SOUNDPRINT. ALL RIGHTS RESERVED.
          </div>
          <div className="flex space-x-6">
            <Link
              to="#"
              className="text-xs text-zinc-500 hover:text-white transition-all duration-500"
            >
              TERMS
            </Link>
            <Link
              to="#"
              className="text-xs text-zinc-500 hover:text-white transition-all duration-500"
            >
              PRIVACY
            </Link>
            <Link
              to="#"
              className="text-xs text-zinc-500 hover:text-white transition-all duration-500"
            >
              CONTACT
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
