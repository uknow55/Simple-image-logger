import { useState } from "react";
import NavigationHeader from "@/components/navigation-header";
import ImageViewer from "@/components/image-viewer";
import AdminPanel from "@/components/admin-panel";
import AnalyticsDashboard from "@/components/analytics-dashboard";
import PrivacyModal from "@/components/privacy-modal";

type Tab = "viewer" | "admin" | "analytics";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("viewer");
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "viewer":
        return <ImageViewer onShowPrivacy={() => setShowPrivacyModal(true)} />;
      case "admin":
        return <AdminPanel />;
      case "analytics":
        return <AnalyticsDashboard />;
      default:
        return <ImageViewer onShowPrivacy={() => setShowPrivacyModal(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      <PrivacyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
      />
    </div>
  );
}
