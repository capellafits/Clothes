const Returns = () => {
  return (
    <div className="w-full bg-[#F2EFE8] py-16 sm:py-24 px-6 sm:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* --- Header --- */}
        <div className="mb-10 border-b border-gray-300 pb-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 uppercase">
            Returns & Exchanges
          </h2>
          <p className="mt-4 text-sm text-gray-500 font-mono uppercase tracking-wider">
            Policy Updated: 2024
          </p>
        </div>

        {/* --- Policy Grid --- */}
        <div className="space-y-10">
          
          {/* 1. Window */}
          <div className="flex flex-col sm:flex-row sm:gap-8">
            <h3 className="w-full sm:w-48 text-sm font-bold uppercase tracking-wide shrink-0 mb-2 sm:mb-0">
              Return Window
            </h3>
            <p className="text-base sm:text-lg font-light text-gray-800 leading-relaxed">
              Return requests must be initiated within <strong>14 days</strong> of the delivery date.
            </p>
          </div>

          {/* 2. Condition */}
          <div className="flex flex-col sm:flex-row sm:gap-8">
            <h3 className="w-full sm:w-48 text-sm font-bold uppercase tracking-wide shrink-0 mb-2 sm:mb-0">
              Item Condition
            </h3>
            <p className="text-base sm:text-lg font-light text-gray-800 leading-relaxed">
              To be eligible for a return, items must remain <strong>unused, unwashed, and in original condition</strong> with all brand tags and packaging intact.
            </p>
          </div>

          {/* 3. Refund Method (Highlighted Box) */}
          <div className="bg-white p-6 sm:p-8 border border-gray-200">
            <h3 className="text-base font-bold uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full"></span>
              Refund Policy: Store Credit Only
            </h3>
            <div className="space-y-4 text-base font-light text-gray-800 leading-relaxed">
              <p>
                Please note that refunds are <strong>not issued</strong> to the original payment method.
              </p>
              <p>
                Upon approval, the return amount is credited exclusively as <strong>Capella Store Credit</strong>.
              </p>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium text-black">Lifetime Validity:</span> Your store credit never expires and may be applied toward any future acquisition.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Contact */}
          <div className="flex flex-col sm:flex-row sm:gap-8 pt-4">
            <h3 className="w-full sm:w-48 text-sm font-bold uppercase tracking-wide shrink-0 mb-2 sm:mb-0">
              Initiate Return
            </h3>
            <p className="text-base sm:text-lg font-light text-gray-800 leading-relaxed">
              To start a return process or for assistance, please contact client services at: <br />
              <a href="mailto:support@capellafits.com" className="underline underline-offset-4 hover:text-gray-500 transition-colors font-normal">
                support@capellafits.com
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Returns