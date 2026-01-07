'use client';

import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Default fallback size chart image
const DEFAULT_SIZE_CHART = '/Sizechart.png';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  sizeChartUrl?: string;
  sizeChartTip?: string;
}

export default function SizeGuideModal({ isOpen, onClose, sizeChartUrl, sizeChartTip }: SizeGuideModalProps) {
  // Use product-specific size chart or fallback to default
  const imageUrl = sizeChartUrl || DEFAULT_SIZE_CHART;

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

          {/* Size Guide Image - Consistent 800x600 sizing */}
          <div className="relative w-full mb-8" style={{ aspectRatio: '4/3' }}>
            <Image
              src={imageUrl}
              alt="Size Guide"
              width={800}
              height={600}
              className="w-full h-full object-contain rounded-lg"
              priority
            />
          </div>

          {/* Info Text */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-light">
              {sizeChartTip || (
                <>💡 <strong>Tip:</strong> Please measure yourself and compare with our size chart to find the perfect fit. If you're between sizes, we recommend choosing the larger size for a more comfortable fit.</>
              )}
            </p>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}



