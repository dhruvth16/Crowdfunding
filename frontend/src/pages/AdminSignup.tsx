import { Eye, EyeOff, Heart } from "lucide-react";
import themeImg from "../assets/themeImg.avif";
import { Input } from "../components/ui/Input";
import { useContext, useState } from "react";
import Button from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminDataContext } from "../context/AdminDataContext";

function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [address, setAddress] = useState("");
  const [phone_num, setPhone_num] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setAdmin } = useContext(AdminDataContext);
  const navigate = useNavigate();

  const signup = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/v1/admin/signup`,
      {
        email,
        password,
        firstname,
        lastname,
        address,
        phone_num,
      }
    );

    setAdmin(response.data);
    navigate("/adminSignin");
    console.log("Admin::: ", response.data);
  };

  return (
    <div className="flex items-center w-full h-screen">
      <h2 className="flex items-center gap-2 p-4 text-xl font-semibold absolute top-0 border-b-[1px] border-gray-300 w-full">
        <Heart />
        <Link to="/">Crowdfunding</Link>
      </h2>
      <div className="md:w-1/2 w-full h-screen flex items-center justify-center p-4 flex-col">
        <div className="md:w-3/4 md:mt-0 w-full mt-[220px] bg-gradient-to-l from-blue-100 to-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">Sign up</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="email" className="text-lg font-semibold">
                Email
              </label>
              <Input
                id="email"
                value={email}
                setValue={setEmail}
                type="email"
                placeholder="Enter your email..."
              />
            </div>

            <div className="mt-1 relative">
              <label htmlFor="password" className="text-lg font-semibold">
                Password
              </label>
              <Input
                id="password"
                value={password}
                setValue={setPassword}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password..."
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center mt-4"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            <div>
              <label htmlFor="firstname" className="text-lg font-semibold">
                Firstname
              </label>
              <Input
                id="firstname"
                value={firstname}
                setValue={setFirstname}
                type="text"
                placeholder="Enter your firstname..."
              />
            </div>

            <div>
              <label htmlFor="lastname" className="text-lg font-semibold">
                Lastname
              </label>
              <Input
                id="lastname"
                value={lastname}
                setValue={setLastname}
                type="text"
                placeholder="Enter your lastname..."
              />
            </div>

            <div>
              <label htmlFor="address" className="text-lg font-semibold">
                Address
              </label>
              <Input
                id="address"
                value={address}
                setValue={setAddress}
                type="text"
                placeholder="Enter your address..."
              />
            </div>

            <div>
              <label htmlFor="phone_num" className="text-lg font-semibold">
                Phone Number
              </label>
              <Input
                id="phone_num"
                value={phone_num}
                setValue={setPhone_num}
                type="text"
                placeholder="Enter your phone number..."
              />
            </div>
            <Button
              onClick={signup}
              variant="primary"
              text="Sign up"
              size="lg"
            />
          </form>
        </div>
        <p className="mt-4">
          Already have an account?{" "}
          <Link to="/adminSignin" className="text-blue-500 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
      <div className="md:w-1/2 w-0 h-screen">
        <img src={themeImg} alt="Theme image" className="h-full object-cover" />
      </div>
    </div>
  );
}

export default AdminSignup;
