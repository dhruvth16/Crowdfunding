import { ArrowDown, ArrowLeft, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import gsap from "gsap";
import Button from "../components/ui/Button";
import CreateCampaign from "../components/ui/CreateCampaign";
import AdminCampaignCard from "../components/ui/AdminCampaignCard";
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

function AdminDashBoard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [category, setCategory] = useState(false);
  const [isCampaign, setIsCampaign] = useState(false);

  const token = localStorage.getItem("admin")?.replace(/^"(.*)"$/, "$1");
  const categoryRef = useRef<HTMLDivElement>(null);
  const campaignRef = useRef<HTMLDivElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const updateCampaignInState = (
    campaignId: string,
    updatedCampaign: Campaign
  ) => {
    setCampaigns((prevCampaigns) =>
      prevCampaigns.map((campaign) =>
        campaign.id === campaignId ? updatedCampaign : campaign
      )
    );
  };

  // const addCampaignToState = (newCampaign: Campaign) => {
  //   setCampaigns((prevCampaigns) => {
  //     const isDuplicate = prevCampaigns.some(
  //       (campaign) => campaign.id === newCampaign.id
  //     );
  //     if (isDuplicate) return prevCampaigns;
  //     return [...prevCampaigns, newCampaign];
  //   });
  // };

  // const removeCampaignFromState = (campaignId: string) => {
  //   setCampaigns((prevCampaigns) =>
  //     prevCampaigns.filter((campaign) => campaign.id !== campaignId)
  //   );
  // };

  useEffect(() => {
    if (category && categoryRef.current) {
      gsap.to(categoryRef.current, { visibility: "visible", duration: 0.8 });
    } else if (categoryRef.current) {
      gsap.to(categoryRef.current, { visibility: "hidden", duration: 0.8 });
    }
  }, [category]);
  useEffect(() => {
    if (isCampaign && campaignRef.current) {
      gsap.to(campaignRef.current, { visibility: "visible", duration: 0.8 });
    } else if (campaignRef.current) {
      gsap.to(campaignRef.current, { visibility: "hidden", duration: 0.8 });
    }
  }, [isCampaign]);

  useEffect(() => {
    const getCampaigns = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/admin/get-campaign`,
          {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          }
        );
        setCampaigns(response.data.campaign);
        setFilteredCampaigns(response.data.campaign);
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
    const token = localStorage.getItem("admin")?.replace(/^"(.*)"$/, "$1");
    if (!token) {
      localStorage.removeItem("admin");
      navigate("/adminSignin");
      return;
    }

    setIsLoggingOut(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.removeItem("admin");
      navigate("/adminSignin");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="md:px-4 lg:px-40 px-2 w-full min-h-screen pt-[70px] bg-gray-50 overflow-y-scroll no-scrollbar">
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
      <div className="flex items-center gap-4 justify-between py-4 text-black">
        <div className="flex items-center md:gap-2 font-semibold md:text-3xl text-lg">
          <h2>Campaign by you</h2>
        </div>
        <div className="md:flex-row flex items-center gap-3 flex-col">
          <Button
            text="Create"
            size="lg"
            variant="secondary"
            icon={<Plus />}
            onClick={() => setIsCampaign(true)}
          />
          <h2
            onClick={() => setCategory(!category)}
            className="flex items-center cursor-pointer hover:text-blue-600 text-blue-700 md:text-lg text-sm"
          >
            {selectedCategory ? selectedCategory : "Category"} <ArrowDown />
          </h2>
        </div>
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

      <AdminCampaignCard
        campaigns={filteredCampaigns}
        updateCampaignInState={updateCampaignInState}
        // removeCampaignFromState={removeCampaignFromState}
      />
      <CreateCampaign
        campaignRef={campaignRef}
        setIscampaign={setIsCampaign}
        // addCampaignToState={addCampaignToState}
      />
    </div>
  );
}

export default AdminDashBoard;
