'use client';

import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg p-0">
        
        {/* Header */}
        <DialogHeader className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <DialogTitle className="text-lg font-light text-gray-900">
            Size Guide
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 py-8">
          
          {/* Size Guide Image */}
          <div className="relative w-full h-auto mb-8">
            <Image
              src="/Sizechart.png"
              alt="Size Guide"
              width={800}
              height={600}
              className="w-full h-auto object-cover rounded-lg"
              priority
            />
          </div>

          

          {/* Info Text */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-light">
              💡 <strong>Tip:</strong> Please measure yourself and compare with our size chart to find the perfect fit. If you're between sizes, we recommend choosing the larger size for a more comfortable fit.
            </p>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}



