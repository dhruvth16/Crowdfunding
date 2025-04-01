import { ArrowDown, ArrowLeft, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import CampaignCard from "../components/ui/UserCampaignCard";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

export interface Campaign {
  id: string;
  name: string;
  description: string;
  target_amt: number;
  raised_amt: number;
  image: string;
  category: string;
}

function UserDashBoard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const token = localStorage.getItem("user");
  const [category, setCategory] = useState(false);
  const categoryRef = useRef(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (category && categoryRef.current) {
      gsap.to(categoryRef.current, { visibility: "visible" });
    } else if (categoryRef.current) {
      gsap.to(categoryRef.current, { visibility: "hidden" });
    }
  }, [category]);

  useEffect(() => {
    const getCampaigns = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/campaign/campaigns`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCampaigns(response.data.campaigns);
        setFilteredCampaigns(response.data.campaigns);
      } catch (error) {
        console.log(error);
      }
    };

    getCampaigns();
  }, [token]);

  const filterCampaigns = (category: string | null) => {
    if (category === null) {
      setFilteredCampaigns(campaigns);
    } else {
      const filtered = campaigns.filter(
        (c) => c.category === category.toUpperCase()
      );
      setFilteredCampaigns(filtered);
    }
    setSelectedCategory(category);
    setCategory(false);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("user")?.replace(/^"(.*)"$/, "$1");
    if (!token) {
      localStorage.removeItem("user");
      navigate("/userSignin");
      return;
    }

    setIsLoggingOut(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.removeItem("user");
      navigate("/userSignin");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // const updateRaisedAmountInState = (
  //   campaignId: string,
  //   donatedAmount: number
  // ) => {
  //   setCampaigns((prevCampaigns) =>
  //     prevCampaigns.map((campaign) =>
  //       campaign.id === campaignId
  //         ? { ...campaign, raised_amt: campaign.raised_amt + donatedAmount }
  //         : campaign
  //     )
  //   );
  // };

  return (
    <div className="md:px-4 lg:px-40 px-2 w-full min-h-screen pt-[70px] bg-gray-50">
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`text-red-500 flex items-center gap-2 font-semibold text-lg hover:underline hover:cursor-pointer ${
          isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <ArrowLeft />
        {isLoggingOut ? "Logging out..." : "Log out"}
      </button>
      <div className="flex items-center justify-between py-4 text-black">
        <h1 className="font-semibold text-3xl">Campaigns</h1>
        <h2
          onClick={() => setCategory(!category)}
          className="flex cursor-pointer hover:text-blue-600 text-blue-700"
        >
          {selectedCategory ? selectedCategory : "Category"} <ArrowDown />
        </h2>
        <div
          ref={categoryRef}
          className="shadow-xl p-4 rounded-lg absolute z-20 bg-white top-[120px] right-[130px] w-[200px] invisible"
        >
          <div
            onClick={() => setCategory(false)}
            className="absolute right-1 text-black"
          >
            <X />
          </div>
          <div
            onClick={() => filterCampaigns(null)}
            className="cursor-pointer mb-3 text-blue-600 hover:text-blue-500"
          >
            All
          </div>
          <div
            onClick={() => filterCampaigns("Education")}
            className="cursor-pointer mb-3 text-blue-600 hover:text-blue-500"
          >
            Education
          </div>
          <div
            onClick={() => filterCampaigns("Health")}
            className="cursor-pointer mb-3 text-blue-600 hover:text-blue-500"
          >
            Health
          </div>
          <div
            onClick={() => filterCampaigns("Disaster_Relief")}
            className="cursor-pointer mb-3 text-blue-600 hover:text-blue-500"
          >
            Disaster_Relief
          </div>
          <div
            onClick={() => filterCampaigns("Orphanage")}
            className="cursor-pointer mb-3 text-blue-600 hover:text-blue-500"
          >
            Orphanage
          </div>
        </div>
      </div>

      <CampaignCard
        // updateRaisedAmountInState={updateRaisedAmountInState}
        campaigns={filteredCampaigns}
      />
    </div>
  );
}

export default UserDashBoard;
