import { RefObject, useState } from "react";
import Button from "./Button";
import { Input, inputVariants } from "./Input";
import { Plus, X } from "lucide-react";
import axios from "axios";

interface CreateCampaignProps {
  campaignRef: RefObject<HTMLDivElement | null>;
  setIscampaign: (value: boolean) => void;
}

function CreateCampaign({ campaignRef, setIscampaign }: CreateCampaignProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [target_amt, setTarget_amt] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null); // Store file
  const token = localStorage.getItem("admin")?.replace(/^"(.*)"$/, "$1");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  };

  const createCampaign = async () => {
    if (
      !name ||
      !description ||
      !target_amt ||
      !status ||
      !category ||
      !image
    ) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("target_amt", target_amt);
    formData.append("location", location);
    formData.append("status", status.toUpperCase());
    formData.append("category", category.toUpperCase());
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/campaign/create-campaign`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      window.location.reload();
      setIscampaign(false);
      console.log(response.data);
      alert("Campaign created successfully!");
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  return (
    <div
      ref={campaignRef}
      className="fixed inset-0 flex items-center justify-center bg-black/50 pt-[220px] md:pt-8 overflow-y-scroll md:overflow-y-scroll z-50 md:p-10 p-2"
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-white px-6 md:px-10 py-5 rounded-lg w-full max-w-[600px] shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-center mb-5">
            Create Campaign
          </h1>
          <div onClick={() => setIscampaign(false)} className="cursor-pointer">
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
            Target Amount
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
            <option value="">Select status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
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
            <option value="">Select category</option>
            <option value="education">Education</option>
            <option value="health">Health</option>
            <option value="disaster_relief">Disaster Relief</option>
            <option value="orphanage">Orphanage</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="text-lg font-semibold">
            Campaign Image
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div className="flex justify-center">
          <Button
            variant="primary"
            text="Create Campaign"
            size="lg"
            onClick={createCampaign}
            icon={<Plus />}
          />
        </div>
      </form>
    </div>
  );
}

export default CreateCampaign;
