import { Link } from "react-router";

const ChooseRole = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10 text-center">
        Choose Your Role
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-10">
        {/* User Role */}
        <Link to="/userSignin" className="group cursor-pointer text-center">
          <div className="w-36 h-36 md:w-48 md:h-48 bg-green-500 group-hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
            <span className="text-xl md:text-3xl font-bold text-white">
              User
            </span>
          </div>
          <p className="text-white text-sm md:text-lg font-medium mt-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            Login as a User
          </p>
        </Link>

        {/* Admin Role */}
        <Link to="/adminSignin" className="group cursor-pointer text-center">
          <div className="w-36 h-36 md:w-48 md:h-48 bg-yellow-500 group-hover:bg-yellow-600 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
            <span className="text-xl md:text-3xl font-bold text-white">
              Admin
            </span>
          </div>
          <p className="text-white text-sm md:text-lg font-medium mt-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            Login as an Admin
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ChooseRole;
