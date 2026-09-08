import { pageMetadata } from '@/lib/seo';
import React from 'react'

const Shipping = () => {
  return (
    <div className="w-full bg-[#FFFFFF] py-16 sm:py-24 px-6 sm:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 uppercase mb-10 border-b border-gray-300 pb-6">
          Shipping Information
        </h1>

        {/* List Content */}
        <ul className="space-y-6">
          
          <li className="flex items-start gap-4">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
            <p className="text-base sm:text-lg font-light text-gray-800 leading-relaxed">
              <strong>Processing Time:</strong> All orders are processed and dispatched within 3 to 5 business days following payment confirmation.
            </p>
          </li>

          <li className="flex items-start gap-4">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
            <p className="text-base sm:text-lg font-light text-gray-800 leading-relaxed">
              <strong>Transit Regions:</strong> Delivery timelines vary based on your destination. We currently serve regions within Canada.
            </p>
          </li>

          <li className="flex items-start gap-4">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
            <p className="text-base sm:text-lg font-light text-gray-800 leading-relaxed">
              <strong>Tracking:</strong> A shipping confirmation email containing your unique tracking number will be issued immediately upon dispatch.
            </p>
          </li>

          <li className="flex items-start gap-4">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
            <p className="text-base sm:text-lg font-light text-gray-800 leading-relaxed">
              <strong>Calculated Rates:</strong> Shipping fees are calculated precisely at checkout based on the shipping destination and package weight.
            </p>
          </li>

          <li className="flex items-start gap-4">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
            <p className="text-base sm:text-lg font-light text-gray-800 leading-relaxed">
              <strong>Our Commitment:</strong> We are dedicated to ensuring your order is delivered as securely and efficiently as possible.
            </p>
          </li>

        </ul>
      </div>
    </div>
  )
}

export const metadata = pageMetadata("Shipping & Delivery Information", "Read Capella Fits shipping information, including processing times, delivery details and free shipping on orders over CA$150.", "/Shipping");

export default Shipping
