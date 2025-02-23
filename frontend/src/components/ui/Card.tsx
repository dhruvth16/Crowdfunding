import { ReactElement } from "react";

type Proptypes = {
  isVisible: boolean;
  icon: ReactElement;
  title: string;
  count: string;
};

function Card({ isVisible, icon, title, count }: Proptypes) {
  return (
    <div
      className={`bg-white p-8 w-[400px] rounded-lg shadow-lg text-center transform transition-all duration-500 hover:scale-105 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${0.5 * 200}ms` }}
    >
      <div className="flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{count}</p>
    </div>
  );
}

export default Card;
