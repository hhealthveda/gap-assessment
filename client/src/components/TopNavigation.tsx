import { Menu } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type TopNavigationProps = {
  setSidebarOpen: (open: boolean) => void;
  currentPath: string;
};

const TopNavigation = ({ setSidebarOpen, currentPath }: TopNavigationProps) => {
  const { toast } = useToast();

  const getPageTitle = () => {
    switch (true) {
      case currentPath === "/":
        return "Dashboard";
      case currentPath === "/assessment/level1":
        return "CMMC Level 1 Assessment";
      case currentPath === "/assessment/level2":
        return "CMMC Level 2 Assessment";
      case currentPath === "/gap-analysis":
        return "Gap Analysis";
      case currentPath === "/reports":
        return "Reports";
      case currentPath === "/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your results are being exported. The download will begin shortly.",
    });
    
    // In a real implementation, this would trigger an API call to generate and download a report
    setTimeout(() => {
      toast({
        title: "Export Completed",
        description: "Your assessment results have been exported successfully.",
      });
    }, 2000);
  };

  return (
    <div className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="md:hidden flex items-center">
              <button 
                type="button" 
                className="text-slate-500 hover:text-slate-900 focus:outline-none"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center">
              <ol className="flex text-sm leading-6 text-slate-500">
                <li className="flex items-center">
                  <Link href="/">
                    <a className="hover:text-primary">Home</a>
                  </Link>
                  <svg className="h-3 w-3 mx-2 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li className="flex items-center text-primary font-medium">
                  {getPageTitle()}
                </li>
              </ol>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Button onClick={handleExport}>Export Results</Button>
            </div>
            <div className="ml-4 relative">
              <div>
                <button type="button" className="flex text-sm rounded-full focus:outline-none" id="user-menu-button">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold">
                    JD
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
