import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/AuthContext/AuthContext";
import { useEffect } from "react";

const userDetails = JSON.parse(localStorage.getItem("login")) || {}; // This is sample data.

const data = {
  user: {
    name: userDetails.name || "", // Use fallback if name doesn't exist
    email: userDetails.username || "", // Make sure this is the correct property
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "TradeMate",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Customer Management",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Add Customer",
          url: "/addcustomer",
        },
        {
          title: "Customer List",
          url: "/customers",
        },
        {
          title: "Red Customers",
          url: "/red",
        },
      ],
    },
    {
      title: "Sales",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Add Sale",
          url: "/addsale",
        },
        {
          title: "Sales List",
          url: "/sales",
        },
        {
          title: "Remaining",
          url: "/remaining",
        },
      ],
    },
    {
      title: "Purchase",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Add Purchase",
          url: "/addpurchase",
        },
        {
          title: "Purchase List",
          url: "/purchases",
        },
        {
          title: "Remainings",
          url: "/raminngPurchases",
        },
      ],
    },
    {
      title: "Stock Management",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Add Stock Item",
          url: "/addstock",
        },
        {
          title: "Stock List",
          url: "/stocks",
        },
        {
          title: "Need to Order",
          url: "#",
        },
        {
          title: "Most Sold Items",
          url: "#",
        },
      ],
    },
    {
      title: "Seller Management",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Add Seller",
          url: "/addseller",
        },
        {
          title: "Seller List",
          url: "/sellers",
        },
        {
          title: "Red Sellers",
          url: "/redseller",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: Settings2,
      items: [],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { changeValue } = useAuth(); // Call useAuth inside the component
useEffect(()=>{
console.log("CHnageing value")
},[changeValue])
  return (
  
    <Sidebar collapsible="icon" {...props}>
      <div className="text-right">
        {/* You can use changeValue here if needed */}
      </div>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {localStorage.getItem("companyId") && <NavMain items={data.navMain} />}
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>

  );
}
