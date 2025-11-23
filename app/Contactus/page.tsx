// app/page.tsx
import NewsletterSection from "@/components/Newsletter";
import { Mail, MessageCircle, Clock } from 'lucide-react';

export default function Home() {
  return (
    <>
      <NewsletterSection />
      
      {/* Contact Support Section */}
      <section className="w-full py-12 sm:py-16 border-t border-gray-200" style={{ backgroundColor: '#F2EFE8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2">
                Need Help?
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                We are here to assist you. Reach out anytime.
              </p>
            </div>

            {/* Contact Card */}
            <div className="bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon */}
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-white" />
                </div>

                {/* Email */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Contact us at</p>
                  <a
                    href="mailto:support@capellafits.com"
                    className="text-xl sm:text-2xl font-light text-gray-900 hover:text-gray-600 transition underline decoration-2 underline-offset-4"
                  >
                    support@capellafits.com
                  </a>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-3 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <div className="text-sm">
                      <p className="font-medium">Response Time</p>
                      <p className="text-gray-500">Within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-gray-600">
                    <MessageCircle className="w-5 h-5" />
                    <div className="text-sm">
                      <p className="font-medium">Support Hours</p>
                      <p className="text-gray-500">Mon-Sat, 9AM-6PM IST</p>
                    </div>
                  </div>
                </div>

                {/* Additional Help Text */}
                <p className="text-xs text-gray-500 pt-4">
                  For order inquiries, please include your order number in the subject line
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

