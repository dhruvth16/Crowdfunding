import { Link } from "react-router-dom";
import heroImg from "../../assets/crowdfunding-hero-img.avif";

type HeroProp = {
  isVisible: boolean;
};

function HeroSection({ isVisible }: HeroProp) {
  return (
    <div className="relative pt-20 mt-30">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="People working together for a cause"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-32 text-center text-white">
        <h1
          className={`text-5xl md:text-6xl font-bold mb-6 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          Make a Difference Today
        </h1>
        <p
          className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          Join our community of changemakers and help transform lives through
          the power of giving
        </p>
        <Link
          to="/userSignin"
          className={`bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          Start Donating
        </Link>
      </div>
    </div>
  );
}

export default HeroSection;
