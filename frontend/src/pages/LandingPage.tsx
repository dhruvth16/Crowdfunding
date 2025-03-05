import { Heart, Home, Menu, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import HeroSection from "../components/ui/HeroSection";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/role");
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-black text-white p-4 fixed w-full z-50 top-15">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8" />
            <span className="text-xl font-bold">Crowdfunding</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 md:items-center">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Home
            </a>
            <a href="#about" className="hover:text-gray-300 transition-colors">
              About
            </a>
            <Button
              variant="primary"
              size="lg"
              text="Sign in"
              onClick={handleClick}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-950 p-4">
            <div className="flex flex-col space-y-4">
              <a href="#" className="hover:text-gray-300 transition-colors">
                Home
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                About
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <HeroSection isVisible={isVisible} />

      {/* Categories Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Impact Categories
          </h2>
          <div className="flex items-center gap-2 justify-between flex-wrap">
            <Card
              isVisible={isVisible}
              icon={<Users />}
              title="Education"
              count="150+ Campaigns"
            />
            <Card
              isVisible={isVisible}
              icon={<Heart />}
              title="Healthcare"
              count="200+ Campaigns"
            />
            <Card
              isVisible={isVisible}
              icon={<Home />}
              title="Orphanage"
              count="100+ Campaigns"
            />
          </div>
        </div>
      </div>

      {/* Learn More Section */}
      <div className="py-20 bg-white" id="about">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Learn More About Our Mission
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Our Impact</h3>
                <p className="text-gray-600">
                  Since our inception, we've helped thousands of people across
                  the globe through various campaigns. Our platform ensures that
                  every donation makes a real difference in someone's life.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">How It Works</h3>
                <p className="text-gray-600">
                  We connect donors directly with verified campaigns. Our
                  transparent process ensures that your contributions reach
                  those who need them most, with regular updates on the impact
                  of your donation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
