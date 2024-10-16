import { signOut } from "next-auth/react";
import React, { Suspense } from "react";
import { SidebarMenu } from "../../sidebar";
import NavbarComponent from "../../navbar";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CalendarCheck,
  CircleUser,
  CreditCard,
  DollarSign,
  Loader,
  Menu,
  Package2,
  Search,
  SubscriptIcon,
  Users,
  Users2Icon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shadcn/ui/avatar";
import { Badge } from "@/shadcn/ui/badge";
import { Button } from "@/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { Input } from "@/shadcn/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/shadcn/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import { auth } from "@/auth";
import OwnerAdminDashboard from "@/components/RoleBasedDashboards/OwnerAdminDashboard";
import { TechnicianDashboard } from "@/components/technian/TechnicianDashboard";
import { getTechicianJob } from "@/components/technian/ServerAction";

const Page = async () => {
  const session = await auth();
  const technician = await getTechicianJob();

  console.log(technician, "the data tech");

  return (
    <div>
      <Suspense
        fallback={
          <div className="fle items-center justify-center">
            <Loader className="text-primary800 animate animate-spin" />
          </div>
        }
      >
        {session?.user?.role === "business owner" || session?.user?.role === "business admin" ? (
          <OwnerAdminDashboard />
        ) : session?.user?.role === "technician" ? (
          <TechnicianDashboard />
        ) : (
          <div>No access</div> 
        )}
      </Suspense>
    </div>
  );
};

export default Page;
