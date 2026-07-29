import React from 'react'
import { testimonies } from '../constants/Constants'
import { TestimonyCard } from '../components/TestimonyCard'
import Masonry from "react-masonry-css";
import gsap from 'gsap';
import { ScrollTrigger, SplitText } from 'gsap/all';
import { useGSAP } from '@gsap/react';

const breakpointColumnsObj = {
  default: 3,
  1280: 3,
  1024: 2,
  768: 2,
  640: 1
};

gsap.registerPlugin(ScrollTrigger)

export default function Testimony() {
  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = gsap.utils.toArray('.testimonyCardWrapper');

    if (reduceMotion) {
      gsap.set(['.testimonyMiniTitle', '.sectionTestimonyTitle', '.testimonyParagraphs', ...cards], {
        opacity: 1, x: 0, y: 0,
      });
      return;
    }

    const title = new SplitText('.sectionTestimonyTitle', { type: 'words' });
    const paragraph = new SplitText('.testimonyParagraphs', { type: 'words' });

    gsap.set(title.words, { opacity: 0, yPercent: 100 });
    gsap.set(paragraph.words, { opacity: 0, yPercent: 100 });
    gsap.set('.testimonyMiniTitle', { opacity: 0, x: -40 });

    // One coordinated intro timeline, anchored on the title itself rather than three
    // separate tweens all triggered off the subtitle paragraph.
    gsap.timeline({
      scrollTrigger: {
        trigger: '.sectionTestimonyTitle',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    })
      .to('.testimonyMiniTitle', { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' })
      .to(title.words, {
        opacity: 1, yPercent: 0, duration: 0.8, stagger: 0.04, ease: 'expo.out',
      }, '-=0.35')
      .to(paragraph.words, {
        opacity: 1, yPercent: 0, duration: 0.6, stagger: 0.03, ease: 'expo.out',
      }, '-=0.5');

    // Real fade+rise reveal per card instead of a bounce on content that was already
    // fully visible — matches how every other grid on the site reveals its items.
    gsap.set(cards, { y: 40, opacity: 0 });
    cards.forEach((card) => {
      gsap.to(card, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => {
      title.revert();
      paragraph.revert();
    };
  }, []);

  return (
    <div id='Testimony' className='relative pt-20'>
      {/* BACKGROUND */}
      <div className='absolute inset-0'>
        <img src="/images/texturedBurntFabric.jpg" alt="" className='w-full h-full object-cover opacity-40' />
        <div className='absolute inset-0 bg-gradient-to-b from-background via-background/88 to-background' />
      </div>

      <section className='container mx-auto px-6 relative z-10'>
        <div className='mb-5'>
          <div className="testimonyMiniTitle">
            <span className='text-secondary text-sm font-medium tracking-wider uppercase'>Voices of Trust & Partnership</span>
          </div>
          <h2 className='sectionTestimonyTitle text-4xl md:text-5xl font-bold mt-4 mb-6 text-secondary-foreground'>What Others Say.</h2>
          <p className='testimonyParagraphs text-muted-foreground'>Collaborations that turned goals into results.</p>
        </div>

        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex gap-5"
            columnClassName="flex flex-col gap-5 masonryCol"
          >
            {testimonies.map((testimony, idx) => (
              <div key={idx} className='testimonyCardWrapper transition-transform duration-300 hover:-translate-y-1'>
                <TestimonyCard testimony={testimony} idx={idx} />
              </div>
            ))}
        </Masonry>
      </section>
    </div>
  )
}