import { RefObject, useEffect, useState } from "react";
import Button from "./Button";
import { Input, inputVariants } from "./Input";
import { Edit, X } from "lucide-react";
import axios from "axios";
import { Campaign } from "../../pages/UserDashBoard";

interface CreateCampaignProps {
  editcampaignRef: RefObject<HTMLDivElement | null>;
  setEditCampaign: (value: boolean) => void;
  campaignId: string;
  updateCampaignInState: (
    campaignId: string,
    updatedCampaign: Campaign
  ) => void;
}

function EditCampaign({
  editcampaignRef,
  setEditCampaign,
  campaignId,
  updateCampaignInState,
}: CreateCampaignProps) {
  const token = localStorage.getItem("admin")?.replace(/^"(.*)"$/, "$1");

  const [campaignData, setCampaignData] = useState({
    name: "",
    description: "",
    target_amt: "",
    location: "",
    status: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/v1/admin/campaign/${campaignId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCampaignData(response.data.campaign); // Ensure you access `campaign` from response
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  const editCampaign = async () => {
    const { name, description, target_amt, location, status, category, image } =
      campaignData;

    if (
      !name.trim() ||
      !description.trim() ||
      !target_amt.trim() ||
      !location.trim() ||
      !status.trim() ||
      !category.trim()
    ) {
      setEditCampaign(false);
      return;
    }

    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/v1/admin/edit-campaign/${campaignId}`,
        {
          name,
          description,
          target_amt,
          location,
          status: status.toUpperCase(),
          category: category.toUpperCase(),
          image,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      updateCampaignInState(campaignId, response.data);
      setEditCampaign(false);
      window.location.reload();
    } catch (error) {
      console.error("Error editing campaign:", error);
      setEditCampaign(false);
    }
  };

  return (
    <div
      ref={editcampaignRef}
      className="fixed invisible inset-0 flex items-center justify-center bg-black/50 pt-[220px] md:pt-8 overflow-y-scroll md:overflow-y-scroll z-50 md:p-10 p-2"
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-white px-6 md:px-10 py-5 rounded-lg w-full max-w-[600px] shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-center mb-5">
            Edit Campaign
          </h1>
          <div
            onClick={() => setEditCampaign(false)}
            className="cursor-pointer"
          >
            <X />
          </div>
        </div>

        {/* Campaign Name */}
        <div className="mb-3">
          <label htmlFor="name" className="text-lg font-semibold">
            Campaign Name
          </label>
          <Input
            id="name"
            value={campaignData.name || ""}
            setValue={(value) =>
              setCampaignData((prev) => ({ ...prev, name: value }))
            }
            type="text"
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="text-lg font-semibold">
            Description
          </label>
          <Input
            id="description"
            value={campaignData.description || ""}
            setValue={(value) =>
              setCampaignData((prev) => ({ ...prev, description: value }))
            }
            type="text"
          />
        </div>

        {/* Target Amount */}
        <div className="mb-3">
          <label htmlFor="target_amt" className="text-lg font-semibold">
            Target Amount
          </label>
          <Input
            id="target_amt"
            value={campaignData.target_amt || ""}
            setValue={(value) =>
              setCampaignData((prev) => ({ ...prev, target_amt: value }))
            }
            type="number"
          />
        </div>

        {/* Location */}
        <div className="mb-3">
          <label htmlFor="location" className="text-lg font-semibold">
            Location
          </label>
          <Input
            id="location"
            value={campaignData.location || ""}
            setValue={(value) =>
              setCampaignData((prev) => ({ ...prev, location: value }))
            }
            type="text"
          />
        </div>

        {/* Status */}
        <div className="mb-3">
          <label htmlFor="status" className="text-lg font-semibold">
            Status
          </label>
          <select
            value={campaignData.status || ""}
            onChange={(e) =>
              setCampaignData((prev) => ({ ...prev, status: e.target.value }))
            }
            className={inputVariants}
          >
            <option value="">Select status</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Category */}
        <div className="mb-3">
          <label htmlFor="category" className="text-lg font-semibold">
            Category
          </label>
          <select
            value={campaignData.category || ""}
            onChange={(e) =>
              setCampaignData((prev) => ({ ...prev, category: e.target.value }))
            }
            className={inputVariants}
          >
            <option value="">Select category</option>
            <option value="EDUCATION">Education</option>
            <option value="HEALTH">Health</option>
            <option value="DISASTER_RELIEF">Disaster Relief</option>
            <option value="ORPHANAGE">Orphanage</option>
          </select>
        </div>

        {/* Image */}
        <div className="mb-3">
          <label htmlFor="image" className="text-lg font-semibold">
            Campaign Image
          </label>
          <input
            id="image"
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setCampaignData((prev) => ({ ...prev, image: file.name }));
              }
            }}
            className={inputVariants}
          />
          {campaignData.image && (
            <p className="mt-2">Current: {campaignData.image}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            text="Edit Campaign"
            size="lg"
            onClick={editCampaign}
            icon={<Edit />}
          />
        </div>
      </form>
    </div>
  );
}

export default EditCampaign;
