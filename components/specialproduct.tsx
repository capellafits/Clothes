import Image from 'next/image'

const Specialproduct = () => {
  // Define paths for clarity
  const desktopImageSrc = '/maharaja detailings.svg';
  // REPLACE 'YOUR_MOBILE_IMAGE.svg' with the actual path to your mobile image
  const mobileImageSrc = '/M9.svg'; 

  return (
    <div 
      className="flex flex-col items-center justify-center w-full"
      style={{ backgroundColor: '#F2EFE8' }}
    >
       
      {/* Image Container - Full Width */}
      <div className="w-full relative">

        {/* --- MOBILE IMAGE --- */}
        {/* Logic: 'block' (visible by default on small screens), 
                 'md:hidden' (hidden on medium screens and larger) 
        */}
        <div className="block md:hidden w-full">
           <Image 
              src={mobileImageSrc} 
              alt='Punjab Hoodie - Mobile' 
              // IMPORTANT: Adjust width/height to match your MOBILE image's aspect ratio
              // Example vertical ratio: 
              width={800} 
              height={1200}
              className="w-full h-auto"
              priority
           />
        </div>

        
        
        <div className="hidden md:block w-full">
            <Image 
              src={desktopImageSrc} 
              alt='Punjab Hoodie - Desktop' 
              // Keep original width/height for desktop aspect ratio
              width={1920}
              height={1080}
              className="w-full h-auto"
              priority
            />
        </div>

      </div>
    </div>
  )
}

export default Specialproduct