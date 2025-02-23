type ButtonProps = {
  variant: "primary" | "secondary" | "tertiary";
  text: string;
  size: "sm" | "md" | "lg";
  onClick?: () => void;
};

function Button(props: ButtonProps) {
  const btnStyle =
    props.variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-700"
      : props.variant === "secondary"
      ? "border-2 border-indigo-600 text-indigo-600"
      : "flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2";

  return (
    <button
      onClick={props.onClick}
      className={`${btnStyle} py-${
        props.size === "sm" ? 1 : props.size === "md" ? 1 : 2
      } cursor-pointer px-6 py-2 rounded-full transition`}
    >
      {props.text}
    </button>
  );
}

export default Button;
