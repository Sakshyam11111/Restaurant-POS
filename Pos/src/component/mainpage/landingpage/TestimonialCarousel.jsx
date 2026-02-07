import React, { useEffect, useRef, useState } from 'react';

const TestimonialCarousel = () => {
  const testimonials = [
    {
      name: "Anita Shrestha",
      role: "Fast Food Outlet Owner",
      quote: "What we love most about Bollore is how simple it is. No unnecessary features, just exactly what a restaurant needs.",
      rating: 5,
      avatar: "./avatar1.jpg"
    },
    {
      name: "Riya Shrestha",
      role: "Restaurant Owner, Kathmandu",
      quote: "Bollore completely changed how we run our restaurant. Order management is faster, billing is smooth, and our staff picked it up in just one day.",
      rating: 5,
      avatar: "./avatar2.jpg"
    },
    {
      name: "Dr. Ramesh Adhikari",
      role: "Café Manager",
      quote: "From table orders to KOT and billing, everything works seamlessly. Bollore reduced our mistakes during rush hours.",
      rating: 5,
      avatar: "./avatar3.jpg"
    }
  ];

  const duplicatedTestimonials = [...testimonials, ...testimonials];
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const speed = 1; // pixels per frame
    let animationFrame;

    const animate = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += speed;

        // Reset to beginning when halfway through (seamless loop)
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isPaused]);

  const StarRating = ({ rating }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="w-full py-16 bg-[#F8FAFC] overflow-x-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-5 py-2 text-[#386890] rounded-full text-sm font-semibold mb-4">
            Testimonial
          </span>
          <h2 className="text-[48px] md:text-[48px] font-regular text-gray-900">
            What Our Clients Say
          </h2>
        </div>

        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            ref={scrollRef}
            className="flex gap-6 md:gap-8 overflow-x-hidden"
            style={{
              scrollBehavior: 'auto', // Changed from 'smooth' for animation
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-none w-[320px] sm:w-[400px] md:w-[450px] lg:w-[500px] bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm">{testimonial.role}</p>
                  </div>
                </div>

                <StarRating rating={testimonial.rating} />

                <p className="mt-5 text-gray-600 leading-relaxed text-sm md:text-base">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;