import { ReactElement } from "react";

type ButtonProps = {
  variant: "primary" | "secondary" | "tertiary";
  text: string;
  size: "sm" | "md" | "lg";
  onClick?: () => void;
  icon?: ReactElement;
};

function Button(props: ButtonProps) {
  const btnStyle =
    props.variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-700"
      : props.variant === "secondary"
      ? "bg-green-600 text-white rounded-md hover:bg-green-700"
      : "flex w-full justify-center rounded-full bg-red-600 text-white";

  return (
    <button
      onClick={props.onClick}
      className={`${btnStyle} py-${
        props.size === "sm" ? 1 : props.size === "md" ? 1 : 2
      } cursor-pointer px-4 rounded-full transition font-semibold flex items-center gap-2`}
    >
      {props.text} {props.icon}
    </button>
  );
}

export default Button;
