import { Heart, Instagram, Mail, Twitter } from "lucide-react";

function Navbar() {
  return (
    <nav className="w-full bg-slate-950 py-4 md:px-20 px-4 z-20 fixed">
      <div className="flex items-center text-xl justify-between font-semibold text-white">
        <div className="flex items-center gap-2">
          <Heart />
          CrowdFunding
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors flex items-center space-x-2"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="mailto:contact@fundhope.com"
            className="hover:text-gray-300 transition-colors flex items-center space-x-2"
          >
            <Mail className="w-6 h-6" />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors flex items-center space-x-2"
          >
            <Twitter className="w-6 h-6" />
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
