import React from 'react';
import { ArrowRight } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import TrustedBySection from './TrustedBySection';
import Dashoardimg from './Dashoardimg';
import MagicSection from './MagicSection';
import UnlockProfit from './UnlockProfit';
import StaffProfile from './StaffProfile';
import FeatureCards from './FeatureCards';
import TestimonialCarousel from './TestimonialCarousel';

const Landingpage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="./landing.png"
            alt="Restaurant interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl lg:text-[60px] font-bold text-white leading-tight">
                Best Restaurant Management Software in Nepal
              </h1>

              <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed">
                The all-in-one POS system designed for modern dining. Manage orders, staff, and growth with beautiful, intuitive software.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="group px-8 py-4 bg-[#386890] text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="group px-8 py-4 bg-white hover:bg-gray-100 text-[#386890] font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                  Start a 7-days Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="relative lg:justify-self-end">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <img
                  src="./landing2.png"
                  alt="Delicious food spread"
                  className="w-full max-w-lg rounded-2xl"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20" />
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent z-10" />
      </section>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>

      <TrustedBySection/>
      <Dashoardimg/>
      <MagicSection/>
      <UnlockProfit/>
      <StaffProfile/>
      <FeatureCards />
      <TestimonialCarousel />
      <Footer />
    </div>
  );
};

export default Landingpage;