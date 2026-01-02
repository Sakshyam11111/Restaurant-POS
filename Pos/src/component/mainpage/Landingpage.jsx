// src/pages/LandingPage.jsx
import React, { useState } from 'react';
import { ChevronRight, Star, ShoppingBag, Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const goToJoinUs = () => navigate('/joinus');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed with: ${email}`);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        goToJoinUs={goToJoinUs} 
      />

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <div className="inline-block bg-[#3673B4]/10 text-[#3673B4] px-4 py-1 rounded-full text-sm font-semibold">
                #1 We Make Best Taste
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Choose Delicacy<br />
                <span className="text-[#3673B4]">
                  The Best Healthy
                </span><br />
                Way To Life
              </h1>

              <button
                onClick={goToJoinUs}
                className="bg-[#3673B4] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#2a5a94] transition-all duration-200 flex items-center gap-2 group"
              >
                Shop More
                <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <div className="grid grid-cols-2 gap-4 pt-8">
                {[
                  { name: "Pizza With Extra Toppings", price: "Rs 600", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=150&fit=crop" },
                  { name: "Pizza Margherita Cheese", price: "Rs 600", img: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=200&h=150&fit=crop" }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-blue-50 p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2"
                  >
                    <img src={item.img} alt={item.name} className="w-full h-24 object-cover rounded-lg mb-3" />
                    <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                    <div className="flex items-center gap-1 my-1">
                      {[1,2,3].map(i => <Star key={i} className="w-3 h-3 fill-[#3673B4] text-[#3673B4]" />)}
                      <Star className="w-3 h-3 text-gray-300" />
                      <Star className="w-3 h-3 text-gray-300" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Medium</span>
                      <span className="font-bold text-[#3673B4] text-sm">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="relative">
                <div className="w-full aspect-square max-w-lg mx-auto bg-[#3673B4] rounded-full p-8 relative overflow-hidden">
                  <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop"
                      alt="Grilled Fish"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                {/* Static floating images */}
                <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop" alt="Salad" className="absolute top-0 right-0 w-24 h-24 rounded-full shadow-xl" />
                <img src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=150&h=150&fit=crop" alt="Pasta" className="absolute top-1/3 -left-8 w-28 h-28 rounded-full shadow-xl" />
                <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=150&h=150&fit=crop" alt="Salad Bowl" className="absolute bottom-12 right-8 w-24 h-24 rounded-full shadow-xl" />
                <img src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=150&h=150&fit=crop" alt="Soup" className="absolute bottom-24 -left-4 w-20 h-20 rounded-full shadow-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Serve Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <p className="text-[#3673B4] font-semibold mb-2 uppercase text-sm tracking-wide">WHAT WE SERVE</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Your Favourite Food<br />Delivery Partner</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: ShoppingBag, title: "Easy To Order", desc: "Order in just a few taps with our seamless interface." },
            { icon: Clock, title: "Fastest Delivery", desc: "Get your food delivered hot and fresh in under 30 mins." },
            { icon: Award, title: "Best Quality", desc: "Premium ingredients and chef-crafted meals every time." }
          ].map((service, i) => (
            <div
              key={i}
              className="text-center p-8 rounded-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-b from-white to-gray-50 hover:-translate-y-2"
            >
              <div className="w-20 h-20 bg-[#3673B4]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <service.icon className="w-10 h-10 text-[#3673B4]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Food Quality Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#3673B4]/5 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative">
              <div className="absolute inset-0 bg-[#3673B4] rounded-full opacity-10 blur-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop"
                alt="Burger"
                className="relative rounded-full w-full max-w-md mx-auto shadow-2xl"
              />
            </div>

            <div className="space-y-6">
              <p className="text-[#3673B4] font-semibold uppercase text-sm tracking-wide">WHAT THEY SAY</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Food Quality Is The<br />Most Important Part<br />For Taste</h2>
              <p className="text-gray-600 leading-relaxed">
                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form by injected randomised words.
              </p>
              <button
                onClick={goToJoinUs}
                className="bg-[#3673B4] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2a5a94] transition-all duration-200 flex items-center gap-2"
              >
                Shop Now
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto mb-12">
          <p className="text-[#3673B4] font-semibold mb-2 uppercase text-sm tracking-wide">OUR CATEGORIES</p>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Browse Our Top Food Categories</h2>
            <a href="#" className="flex items-center gap-2 text-[#3673B4] font-semibold hover:gap-3 transition-all duration-200">
              See All
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Cheese Burger', price: 'Rs 600', rating: 3, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=250&fit=crop' },
            { name: 'French fries', price: 'Rs 300', rating: 3, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=250&fit=crop' },
            { name: 'Cheese Pizza', price: 'Rs 400', rating: 3, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=250&fit=crop' },
            { name: 'Veg Sandwich', price: 'Rs 800', rating: 3, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=250&fit=crop' }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < item.rating ? 'fill-[#3673B4] text-[#3673B4]' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="font-bold text-[#3673B4]">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-[#3673B4]/5">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <p className="text-[#3673B4] font-semibold mb-2 uppercase text-sm tracking-wide">OUR MENU</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Menu That Always Make<br />You Feel In Best Meal</h2>
        </div>

        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Oreo Shake', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop', tag: 'TOP SELLER' },
            { name: 'Dal Fry', image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=300&h=200&fit=crop', tag: 'TOP SELLER' },
            { name: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop', tag: 'TOP SELLER' },
            { name: 'Pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=200&fit=crop', tag: 'TOP SELLER' }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer hover:scale-105"
            >
              <div className="relative overflow-hidden h-48">
                <div className="absolute top-3 left-3 bg-[#3673B4] text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                  {item.tag}
                </div>
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Lorem ipsum dolor sit amet, dipiscing elit, sed</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <p className="text-[#3673B4] font-semibold mb-2 uppercase text-sm tracking-wide">TESTIMONIAL</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Clients About Us</h2>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
          <img
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
            alt="Customer"
            className="w-32 h-32 rounded-full object-cover shadow-lg flex-shrink-0"
          />
          <div className="flex-1">
            <div className="text-6xl md:text-8xl text-[#3673B4] leading-none mb-4">"</div>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
              There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
            </p>
            <div>
              <p className="font-bold text-gray-900 text-lg">Carry Mint</p>
              <p className="text-[#3673B4]">Food Expert</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
<section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#3673B4] to-[#2a5a94] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-semibold border border-white/20">
            📧 Stay Updated
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Subscribe To Our Newsletter
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Get the latest updates, articles, and resources delivered directly to your inbox.
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mt-8">
            <div className="flex-1 relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                required
                className="text-white w-full px-6 py-5 rounded-full focus:outline-none focus:ring-4 focus:ring-white/40 transition-all duration-300 shadow-lg group-hover:shadow-xl"
              />
            </div>
            <button
              type="submit"
              className="bg-white text-[#3673B4] px-10 py-5 rounded-full font-bold hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
            >
              SUBSCRIBE
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
          
          <p className="text-white/70 text-sm mt-6">
            🔒 We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;