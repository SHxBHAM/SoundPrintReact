import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="border-t border-zinc-900 py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs text-zinc-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} SOUNDPRINT. ALL RIGHTS RESERVED.
          </div>
          <div className="flex space-x-6">
            <Link to="#" className="text-xs text-zinc-500 hover:text-white transition-colors">
              TERMS
            </Link>
            <Link to="#" className="text-xs text-zinc-500 hover:text-white transition-colors">
              PRIVACY
            </Link>
            <Link to="#" className="text-xs text-zinc-500 hover:text-white transition-colors">
              CONTACT
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

