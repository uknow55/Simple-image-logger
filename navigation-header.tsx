import { Camera, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

type Tab = "viewer" | "admin" | "analytics";

interface NavigationHeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function NavigationHeader({ activeTab, onTabChange }: NavigationHeaderProps) {
  const tabs = [
    { id: "viewer" as const, label: "Image View" },
    { id: "admin" as const, label: "Admin Panel" },
    { id: "analytics" as const, label: "Analytics" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Camera className="text-primary text-2xl" />
              <h1 className="text-xl font-semibold text-gray-900">ImageLogger</h1>
            </div>
            <nav className="hidden md:flex space-x-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className={activeTab === tab.id ? "bg-primary text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}
                >
                  {tab.label}
                </Button>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span>Admin</span>
            </div>
            <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
