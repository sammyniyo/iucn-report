import Image from "next/image";
import UserMenu from "./Profile";
const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
      {/* Search Bar */}
      <div className="hidden md:flex items-center gap-2 rounded-full ring-2 ring-gray-300 px-3 py-1 bg-white">
        <Image src="/search.png" alt="Search Icon" width={16} height={16} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none text-sm"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Message Icon */}
        <div className="bg-white rounded-full w-9 h-9 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition">
          <Image src="/message.png" alt="Message Icon" width={20} height={20} />
        </div>

        {/* Announcement Icon */}
        <div className="relative bg-white rounded-full w-9 h-9 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition">
          <Image
            src="/announcement.png"
            alt="Announcement Icon"
            width={20}
            height={20}
          />
          <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-purple-500 text-white text-xs font-bold rounded-full">
            1
          </div>
        </div>

        {/* User Info */}
        <div className="flex flex-col text-right">
          <header>
            <UserMenu />
          </header>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
