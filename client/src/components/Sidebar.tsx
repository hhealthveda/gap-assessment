import { Link } from "wouter";
import { ChevronDown, ChevronRight, Home, Layers, BarChart2, FileText, Settings } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type SidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentPath: string;
};

const Sidebar = ({ open, setOpen, currentPath }: SidebarProps) => {
  const [level1Open, setLevel1Open] = useState(true);
  const [level2Open, setLevel2Open] = useState(false);

  const isActive = (path: string) => currentPath === path;

  const NavLinks = () => (
    <>
      <div className="flex items-center justify-center h-16 bg-primary text-white">
        <span className="text-xl font-semibold">CMMC Assessment</span>
      </div>
      
      <div className="flex flex-col flex-grow px-4 py-5 overflow-y-auto">
        <div className="space-y-1">
          <Link href="/">
            <a className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive("/") 
                ? "bg-primary bg-opacity-10 text-primary" 
                : "text-slate-700 hover:bg-slate-100"
            }`}>
              <Home className="h-5 w-5 mr-2" />
              Dashboard
            </a>
          </Link>
          
          <Collapsible open={level1Open} onOpenChange={setLevel1Open}>
            <CollapsibleTrigger className="flex items-center w-full px-2 py-2 text-sm font-medium text-left rounded-md text-slate-700 hover:bg-slate-100 focus:outline-none">
              <Layers className="h-5 w-5 mr-2" />
              CMMC Level 1
              {level1Open ? (
                <ChevronDown className="ml-auto h-4 w-4" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-8 mt-1 space-y-1">
              <Link href="/assessment/level1">
                <a className={`block px-2 py-1 text-sm font-medium rounded-md ${
                  isActive("/assessment/level1") 
                    ? "text-primary" 
                    : "text-slate-700 hover:bg-slate-100"
                }`}>
                  Assessment Progress
                </a>
              </Link>
              <Link href="/gap-analysis">
                <a className={`block px-2 py-1 text-sm font-medium rounded-md ${
                  isActive("/gap-analysis") && level1Open
                    ? "text-primary" 
                    : "text-slate-700 hover:bg-slate-100"
                }`}>
                  Gap Analysis
                </a>
              </Link>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible open={level2Open} onOpenChange={setLevel2Open}>
            <CollapsibleTrigger className="flex items-center w-full px-2 py-2 text-sm font-medium text-left rounded-md text-slate-700 hover:bg-slate-100 focus:outline-none">
              <Layers className="h-5 w-5 mr-2" />
              CMMC Level 2
              {level2Open ? (
                <ChevronDown className="ml-auto h-4 w-4" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-8 mt-1 space-y-1">
              <Link href="/assessment/level2">
                <a className={`block px-2 py-1 text-sm font-medium rounded-md ${
                  isActive("/assessment/level2") 
                    ? "text-primary" 
                    : "text-slate-700 hover:bg-slate-100"
                }`}>
                  Assessment Progress
                </a>
              </Link>
              <Link href="/gap-analysis">
                <a className={`block px-2 py-1 text-sm font-medium rounded-md ${
                  isActive("/gap-analysis") && level2Open
                    ? "text-primary" 
                    : "text-slate-700 hover:bg-slate-100"
                }`}>
                  Gap Analysis
                </a>
              </Link>
            </CollapsibleContent>
          </Collapsible>
          
          <Link href="/reports">
            <a className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive("/reports") 
                ? "bg-primary bg-opacity-10 text-primary" 
                : "text-slate-700 hover:bg-slate-100"
            }`}>
              <FileText className="h-5 w-5 mr-2" />
              Reports
            </a>
          </Link>
          
          <Link href="/settings">
            <a className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive("/settings") 
                ? "bg-primary bg-opacity-10 text-primary" 
                : "text-slate-700 hover:bg-slate-100"
            }`}>
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </a>
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-slate-200 bg-white">
          <NavLinks />
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 border-r border-slate-200 bg-white">
          <NavLinks />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
