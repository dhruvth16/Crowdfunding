import { RefObject, useState } from "react";
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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [target_amt, setTarget_amt] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const token = localStorage.getItem("admin")?.replace(/^"(.*)"$/, "$1");

  const editCampaign = async () => {
    if (
      !name.trim() ||
      !description.trim() ||
      !target_amt.trim() ||
      !location.trim() ||
      !status.trim() ||
      !category.trim() ||
      !image.trim()
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
            Create Campaign
          </h1>
          <div
            onClick={() => setEditCampaign(false)}
            className="cursor-pointer"
          >
            <X />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="name" className="text-lg font-semibold">
            Campaign Name
          </label>
          <Input id="name" value={name} setValue={setName} type="text" />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="text-lg font-semibold">
            Description
          </label>
          <Input
            id="description"
            value={description}
            setValue={setDescription}
            type="text"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="target_amt" className="text-lg font-semibold">
            Target amount
          </label>
          <Input
            id="target_amt"
            value={target_amt}
            setValue={setTarget_amt}
            type="text"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="location" className="text-lg font-semibold">
            Location
          </label>
          <Input
            id="location"
            value={location}
            setValue={setLocation}
            type="text"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="text-lg font-semibold">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputVariants}
          >
            <option className="uppercase" value="ss">
              Select status
            </option>
            <option className="uppercase" value="active" autoFocus>
              Active
            </option>
            <option className="uppercase" value="completed">
              Completed
            </option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="text-lg font-semibold">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputVariants}
          >
            <option className="uppercase" value="sc">
              Select category
            </option>
            <option className="uppercase" value="education">
              Education
            </option>
            <option className="uppercase" value="health">
              Health
            </option>
            <option className="uppercase" value="disaster_Relief">
              Disaster_Relief
            </option>
            <option className="uppercase" value="orphanage">
              Orphanage
            </option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="location" className="text-lg font-semibold">
            Campaign image
          </label>
          <Input id="image" value={image} setValue={setImage} type="file" />
        </div>

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
