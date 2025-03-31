"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../../../components/ui/navbar-menu";
import { cn } from "../../../lib/utils";

export function Header() {
  return (
    (<div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
      <p className="text-black dark:text-white">
   
      </p>
    </div>)
  );
}

function Navbar({
  className
}) {
  const [active, setActive] = useState(null);
  return (
    (<div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/dashboard/developmentmcq">Web Development Interview Practice</HoveredLink>
            <HoveredLink href="/dashboard/development">Web Development mcq Practice</HoveredLink>
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
      </Menu>
    
    </div>)
  );
}
