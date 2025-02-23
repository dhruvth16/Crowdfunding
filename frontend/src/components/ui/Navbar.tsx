import { Heart, Search } from "lucide-react";

function Navbar() {
  return (
    <nav className="w-full bg-slate-950 py-4 md:px-20 px-4 z-20 fixed">
      <div className="flex items-center text-xl justify-between font-semibold text-white">
        <div className="flex items-center gap-2">
          <Heart />
          CrowdFunding
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="px-2 py-1 bg-slate-900 rounded-md outline-none hidden md:block"
          />
          <div className="cursor-pointer">
            <Search />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
