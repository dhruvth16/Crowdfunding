import { Edit, X } from "lucide-react";
import { Campaign } from "../../pages/UserDashBoard";
import Button from "./Button";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import EditCampaign from "./EditCampaign";
import gsap from "gsap";

function AdminCampaignCard({
  campaigns,
  updateCampaignInState,
}: // removeCampaignFromState,
{
  campaigns: Campaign[];
  updateCampaignInState: (
    campaignId: string,
    updatedCampaign: Campaign
  ) => void;
  // removeCampaignFromState: (campaignId: string) => void;
}) {
  const token = localStorage.getItem("admin")?.replace(/^"(.*)"$/, "$1");
  const [editCampaign, setEditCampaign] = useState(false);
  const editCampaignRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editCampaign && editCampaignRef.current) {
      gsap.to(editCampaignRef.current, {
        visibility: "visible",
        duration: 0.8,
      });
    } else if (editCampaignRef.current) {
      gsap.to(editCampaignRef.current, { visibility: "hidden", duration: 0.8 });
    }
  }, [editCampaign]);

  const deleteCampaign = async (campaignId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this campaign?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/v1/admin/remove-campaign/${campaignId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // removeCampaignFromState(campaignId);
      window.location.reload();
      alert("Campaign deleted successfully!");
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        {campaigns.map((campaign) => {
          return (
            <div
              key={campaign.id}
              className="border-[1px] border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100 rounded-md p-8 m-6 flex flex-col items-center md:block"
            >
              <div className="flex md:flex-row flex-col items-start gap-8 ">
                <div className="bg-gray-100 flex items-center justify-center object-cover rounded-md md:w-80 w-full h-40">
                  <img
                    className="h-40 md:w-40 w-full rounded-md"
                    src={
                      campaign.image &&
                      `${import.meta.env.VITE_BASE_URL}${campaign.image}`
                    }
                    alt="campaign image"
                  />
                </div>
                <div className="flex md:flex-row flex-col justify-between w-full">
                  <div>
                    <h1 className="text-2xl font-bold capitalize">
                      {campaign.name}
                    </h1>
                    <p className="text-gray-600 mb-4 capitalize">
                      {campaign.description}
                    </p>
                    <p className="text-sm">
                      Target Amount:{" "}
                      <span className="font-semibold">
                        {campaign.target_amt}
                      </span>
                    </p>
                    <p className="text-sm mt-8">
                      Raised Amount:{" "}
                      <span className="font-semibold mb-6">
                        {campaign.raised_amt}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ">
                  <div>
                    <Button
                      text="Edit"
                      size="lg"
                      variant="primary"
                      icon={<Edit />}
                      onClick={() => {
                        setEditCampaign(true);
                      }}
                    />
                  </div>
                  <Button
                    text="Delete"
                    size="lg"
                    variant="tertiary"
                    icon={<X />}
                    onClick={() => deleteCampaign(campaign.id)}
                  />
                </div>
              </div>

              <EditCampaign
                editcampaignRef={editCampaignRef}
                setEditCampaign={setEditCampaign}
                key={campaign.id}
                campaignId={campaign.id}
                updateCampaignInState={updateCampaignInState}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminCampaignCard;
