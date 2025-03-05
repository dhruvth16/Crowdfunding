import { RefObject, useEffect, useState } from "react";

import Button from "./Button";
import { Input, inputVariants } from "./Input";
import { X } from "lucide-react";
import { currency_list } from "../../config";
import axios from "axios";

interface PaymentProps {
  paymentRef: RefObject<HTMLDivElement | null>;
  setIsPayment: (value: boolean) => void;
  campaignId: string;
  // updateRaisedAmountInState: (campaignId: string, amount: number) => void;
}

function PaymentPage({
  paymentRef,
  setIsPayment,
  campaignId,
}: // updateRaisedAmountInState,
PaymentProps) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js").then(
      (success) => {
        if (!success) {
          console.error("Razorpay SDK failed to load");
        }
      }
    );
  }, []);

  const currencyOptions = currency_list;

  const paymentHandler = async () => {
    if (!amount || !currency) {
      alert("Please enter amount and currency");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/payment/create-payment`,
        {
          amount: Number(amount),
          currency,
          campaignId,
        }
      );

      const order = response.data;
      console.log(order);

      const paymentObject = new (window as any).Razorpay({
        key: import.meta.env.RAZORPAY_KEY_ID,
        order_id: order.id,
        ...order,

        handler: async function (response: any) {
          console.log(response);

          const options = {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            campaignId,
            amount: Number(amount),
          };

          await axios
            .post(`${import.meta.env.VITE_PAYMENT_URL}/verify-payment`, options)
            .then((res) => {
              console.log(res.data);
              if (res.data.success) {
                alert("Payment successfull!");
                // updateRaisedAmountInState(campaignId, Number(amount));
                window.location.reload();
                setIsPayment(false);
              } else {
                alert("Payment failed!");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        },
      });

      paymentObject.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
  };

  return (
    <div
      ref={paymentRef}
      className="fixed invisible inset-0 flex items-center justify-center bg-black/50 pt-[220px] md:pt-8 overflow-y-scroll md:overflow-y-scroll z-50 md:p-10 p-2"
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-white px-6 md:px-10 py-5 rounded-lg w-full max-w-[600px] shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-center mb-5">Donate</h1>
          <div onClick={() => setIsPayment(false)} className="cursor-pointer">
            <X />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="amount" className="text-lg font-semibold">
            Amount
          </label>
          <Input
            id="amount"
            value={amount}
            setValue={setAmount}
            type="number"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="currency" className="text-lg font-semibold">
            Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={inputVariants}
          >
            {currencyOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.code} - {option.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <Button
            variant="primary"
            text="Pay"
            size="lg"
            onClick={paymentHandler}
          />
        </div>
      </form>
    </div>
  );
}

export default PaymentPage;
