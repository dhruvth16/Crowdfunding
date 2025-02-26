import { Heart, Instagram, Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-black text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <Heart className="w-6 h-6" />
            <span className="text-lg font-bold">Crowdfunding</span>
          </div>
          <div className="flex space-x-6 flex-col">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors flex items-center space-x-2"
            >
              <Instagram className="w-5 h-5" />
              <span>Follow us</span>
            </a>
            <a
              href="mailto:contact@fundhope.com"
              className="hover:text-gray-300 transition-colors flex items-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Contact us</span>
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400 text-sm">
          © 2025 Crowdfunding. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
