import React from 'react';

const TrustedBySection = () => {
    const logos = [
        { id: 1, name: 'OR2K', src: './logo1.png' },
        { id: 2, name: 'Kathmandu', src: './logo2.png' },
        { id: 3, name: 'Kathmandu Temple', src: './logo3.png' },
        { id: 4, name: 'Kathmandu Circle', src: './logo4.png' },
        { id: 5, name: "Chef's Kitchenesu", src: './logo5.png' },
        { id: 6, name: 'The Bungalow Kitchen', src: './logo6.png' },
        { id: 7, name: 'Spice Trail', src: './logo7.png' },
        { id: 8, name: 'OR2K', src: './logo1.png' },
        { id: 9, name: 'Kathmandu', src: './logo2.png' },
        { id: 10, name: 'Kathmandu Temple', src: './logo3.png' },
        { id: 11, name: 'Kathmandu Circle', src: './logo4.png' },
        { id: 12, name: "Chef's Kitchenesu", src: './logo5.png' },
    ];

    const duplicatedLogos = [...logos, ...logos, ...logos];

    return (
        <section className="py-16 bg-[#F8FAFC] overflow-hidden">
            <div className="text-center mb-12">
                <h2 className="text-[46px] font-regular text-gray-900">
                    Trusted by 15,000+ Restaurants
                </h2>
            </div>

            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div className="flex animate-marquee whitespace-nowrap">
                    {duplicatedLogos.map((logo, index) => (
                        <div
                            key={`${logo.id}-${index}`}
                            className="flex-shrink-0 mx-6 md:mx-10 flex items-center justify-center"
                        >
                            <img
                                src={logo.src}
                                alt={logo.name}
                                className="h-20 md:h-28 w-auto object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.33%);
          }
        }
        .animate-marquee {
          animation: marquee 6s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    );
};

export default TrustedBySection;