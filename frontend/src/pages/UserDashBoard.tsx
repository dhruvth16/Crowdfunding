import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import CampaignCard from "../components/ui/CampaignCard";

export interface Campaign {
  id: string;
  name: string;
  description: string;
  target_amt: number;
  raised_amt: number;
}

function UserDashBoard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getCampaigns = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/campaign/campaigns`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCampaigns(response.data.campaigns);
      } catch (error) {
        console.log(error);
      }
    };

    getCampaigns();
  }, [token]);

  return (
    <div className="md:px-4 lg:px-40 px-2 w-full h-screen pt-[70px] bg-gray-50 overflow-y-scroll no-scrollbar">
      <div className="flex items-center justify-between py-4 text-black">
        <h1 className="font-semibold text-2xl">Campaigns</h1>
        <h2 className="text-gray-700 flex cursor-pointer hover:text-gray-900">
          Category <ArrowDown />{" "}
        </h2>
      </div>

      <CampaignCard campaigns={campaigns} />
    </div>
  );
}

export default UserDashBoard;
