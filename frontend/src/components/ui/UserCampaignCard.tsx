import { Droplet } from "lucide-react";
import Button from "./Button";
import { Campaign } from "../../pages/UserDashBoard";
import PaymentPage from "./PaymentPage";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

function CampaignCard({
  campaigns,
  updateRaisedAmountInState,
}: {
  campaigns: Campaign[];
  updateRaisedAmountInState: (campaignId: string, amount: number) => void;
}) {
  const [isPayment, setIsPayment] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null
  );
  const paymentRef = useRef(null);

  useEffect(() => {
    if (isPayment && paymentRef.current) {
      gsap.to(paymentRef.current, { visibility: "visible", duration: 0.8 });
    } else if (paymentRef.current) {
      gsap.to(paymentRef.current, { visibility: "hidden", duration: 0.8 });
    }
  }, [isPayment]);

  const handleDonateClick = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setIsPayment(true);
  };

  return (
    <div>
      <div className="flex flex-col">
        {campaigns.map((campaign) => {
          return (
            <div
              key={campaign.id}
              className="border-[1px] border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100 rounded-md p-8 m-6"
            >
              <div className="flex md:flex-row flex-col items-start gap-8">
                <div className="bg-gray-100 flex items-center justify-center object-cover rounded-md md:w-40 w-full h-40">
                  <img
                    className="h-40 md:w-40 w-full rounded-md"
                    src={campaign.image}
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
                  </div>
                  <div className="flex flex-col-reverse md:block">
                    <div className="md:mb-8 my-4">
                      <Button
                        variant="primary"
                        size="lg"
                        text="Donate"
                        icon={<Droplet />}
                        onClick={() => handleDonateClick(campaign.id)}
                      />
                    </div>
                    <p className="text-sm md:text-right">
                      Raised Amount:{" "}
                      <span className="font-semibold">
                        {campaign.raised_amt}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {isPayment && selectedCampaignId && (
        <PaymentPage
          paymentRef={paymentRef}
          setIsPayment={setIsPayment}
          campaignId={selectedCampaignId}
          updateRaisedAmountInState={updateRaisedAmountInState}
        />
      )}
    </div>
  );
}

export default CampaignCard;
