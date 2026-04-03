import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MenuSection from '@/components/MenuSection';
import AboutSection from '@/components/AboutSection';
import GallerySection from '@/components/GallerySection';
import LocationSection from '@/components/LocationSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6]" data-testid="home-page">
      <Navbar />
      <HeroSection />
      <MenuSection />
      <AboutSection />
      <GallerySection />
      <LocationSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
