import { ReactElement } from "react";

interface InputProps {
  value: string;
  setValue: (value: string) => void;
  type: string;
  placeholder?: string;
  id: string;
  onChange?: (e: ReactElement) => void;
}
export const inputVariants =
  "border outline-none w-full border-gray-300 rounded-md px-4 py-2 mt-1 mb-4 bg-blue-50";

export const Input = (props: InputProps) => {
  return (
    <>
      <input
        id={props.id}
        required={true}
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        type={props.type}
        placeholder={props.placeholder}
        className={inputVariants}
      />
    </>
  );
};
