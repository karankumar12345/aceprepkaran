"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../../../components/ui/navbar-menu";
import { cn } from "../../../lib/utils";

export function Header() {
  return (
    (<div className=" w-full  bg-gray-900 flex items-center justify-center">
      <Navbar className="" />
   
    </div>)
  );
}

function Navbar({
  className
}) {
  const [active, setActive] = useState(null);
  return (
    (<div
      className={cn("   max-w-2xl mx-auto z-50")}>
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/dashboard/development">Web Development Interview Practice</HoveredLink>
            <HoveredLink href="/dashboard/development-mcq">Web Development mcq Practice</HoveredLink>
            <HoveredLink href="/dashboard/dsa">DSA Interview Practice</HoveredLink>
            <HoveredLink href="/dashboard/dsamcq">DSA MCQ Interview Practice</HoveredLink>
          </div>
        </MenuItem>
  
        <MenuItem setActive={setActive} active={active} item="Home">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/">Home Page </HoveredLink>
            <HoveredLink href="/dashboard">Dashboard</HoveredLink>
            <HoveredLink href="/sign-in">Login</HoveredLink>
           
          </div>
        </MenuItem>
        <a href="/sign-in" className="text-white ">Login</a>

      </Menu>
    
    </div>)
  );
}
