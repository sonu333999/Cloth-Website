import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero } from '../components/Hero';
import { FeaturedCollections } from '../components/FeaturedCollections';
import { EditorialSection } from '../components/EditorialSection';
import { EditorialCampaign } from '../components/EditorialCampaign';
import { ShopTheLook } from '../components/ShopTheLook';
import { About } from '../components/About';
import { Newsletter } from '../components/Newsletter';

gsap.registerPlugin(ScrollTrigger);

export const Home: React.FC = () => {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <main>
      <Hero />
      <FeaturedCollections />
      <EditorialSection />
      <EditorialCampaign />
      <ShopTheLook />
      <About />
      <Newsletter />
    </main>
  );
};
