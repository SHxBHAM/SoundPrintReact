import { Link } from "react-router-dom"

interface HeaderProps {
  showNav?: boolean
}

const Header = ({ showNav = true }: HeaderProps) => {
  return (
    <header className="border-b border-zinc-900 py-6 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/home" className="text-lg font-bold">
          SOUNDPRINT
        </Link>
        {showNav && (
          <nav className="hidden md:flex space-x-8">
            <a href="#about" className="text-xs hover:text-[#c49f08] transition-colors">
              ABOUT
            </a>
            <a href="#how" className="text-xs hover:text-[#c49f08] transition-colors">
              HOW IT WORKS
            </a>
            <a href="#faq" className="text-xs hover:text-[#c49f08] transition-colors">
              FAQ
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header

