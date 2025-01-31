import Link from "next/link";
import Image from "next/image";
import { role } from "@/lib/data";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "organization"],
      },
      {
        icon: "/student.png",
        label: "Organizations",
        href: "organizations",
        visible: ["admin"],
      },
      {
        icon: "/assignment.png",
        label: "Manage Forms",
        href: "manage-forms",
        visible: ["admin", "organization"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "events",
        visible: ["admin", "organization"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "announcements",
        visible: ["admin", "organization"],
      },
    ],
  },
];
const Menu = () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
