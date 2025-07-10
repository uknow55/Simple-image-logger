import { Info, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-600" />
            <span>Privacy & Data Collection</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-sm text-gray-600 py-4">
          <div>
            <p className="font-semibold text-gray-900 mb-2">What data we collect:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Click coordinates and timestamps on images</li>
              <li>General location data (city/region) if you grant permission</li>
              <li>Device type and browser information</li>
              <li>Session duration and interaction patterns</li>
            </ul>
          </div>
          
          <div>
            <p className="font-semibold text-gray-900 mb-2">How we use this data:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Educational research and analysis</li>
              <li>Understanding user behavior patterns</li>
              <li>Improving user experience design</li>
            </ul>
          </div>
          
          <div>
            <p className="font-semibold text-gray-900 mb-2">Data protection:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>All data is anonymized and cannot be traced to individuals</li>
              <li>No personally identifiable information is stored</li>
              <li>Data is used solely for educational purposes</li>
              <li>You can opt out of location tracking at any time</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onClose} className="bg-primary text-white hover:bg-primary/90">
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
