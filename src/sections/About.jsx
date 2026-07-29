import React, { useRef } from 'react'
import { AboutSelfData, highlights } from '../constants/Constants'
import { TraitsCard } from '../components/TraitsCard'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger, SplitText } from 'gsap/all'
import gsap from 'gsap'
import { Quote } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const scrollRef = useRef();

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const highlightCards = gsap.utils.toArray(scrollRef.current.children);

    if (reduceMotion) {
      gsap.set(
        ['.sectionMiniTitle', '.sectionAboutTitle', '.aboutSelfParagraphs', '.aboutCta', ...highlightCards],
        { opacity: 1, x: 0, y: 0 }
      );
      return;
    }

    const title = new SplitText('.sectionAboutTitle', { type: 'words' });
    const paragraph = new SplitText('.aboutSelfParagraphs', { type: 'words' });

    gsap.set(title.words, { opacity: 0, yPercent: 100 });
    gsap.set(paragraph.words, { opacity: 0, yPercent: 100 });
    gsap.set('.sectionMiniTitle', { opacity: 0, x: -40 });
    gsap.set('.aboutCta', { opacity: 0, y: 20 });

    // One coordinated timeline instead of several independent from()/fromTo() calls with
    // hardcoded delays — easier to re-sequence, and it's the same pattern used in
    // Projects.jsx and Technologies.jsx so all three sections move the same way.
    const introTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.sectionAboutTitle',
        start: 'top 55%',
        toggleActions: 'play none none none',
      },
    });

    introTl
      .to('.sectionMiniTitle', { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' })
      .to(title.words, {
        opacity: 1, yPercent: 0, duration: 0.8, stagger: 0.04, ease: 'expo.out',
      }, '-=0.35')
      .to(paragraph.words, {
        opacity: 1, yPercent: 0, duration: 0.6, stagger: 0.03, ease: 'expo.out',
      }, '-=0.5')
      .to('.aboutCta', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');

    // Highlight cards: a single cascade on entry instead of a scrub tied to a short,
    // easy-to-outrun scroll range.
    gsap.set(highlightCards, { x: 60, opacity: 0 });

    ScrollTrigger.batch(highlightCards, {
      start: 'top 90%',
      onEnter: (batch) => gsap.to(batch, {
        x: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
      }),
    });

    return () => {
      title.revert();
      paragraph.revert();
    };
  }, [])

  return (
    <section id="About" className='py-5 relative overflow-hidden'>
      <div className='absolute top-1/3 left-1/32 w-96 h-96 bg-primary/5 rounded-full blur-2xl -translate-y-1/2' />
      <div className='absolute bottom-1/64 right-1/32 w-96 h-96 bg-secondary/5 rounded-full blur-2xl -translate-y-1/2' />
      <div className='container mx-auto px-6 relative z-10'>
        <div className='grid lg:grid-cols-2 gap-8 items-center'>
            {/* LEFT COLUMN */}
            <div className='space-y-8'>
              <div className='sectionMiniTitle mb-2'>
                <span className='text-secondary text-sm font-medium tracking-wider uppercase'>About Me</span>
              </div>

              <h2 className='sectionAboutTitle text-4xl md:text-5xl font-bold leading-tight text-secondary-foreground'>
                Developer Behind the Code
              </h2>
              <div className='space-y-4 text-muted-foreground aboutSelfParagraphs'>
                 <AboutSelfData />
              </div>

              <div className='flex aboutCta glass rounded-2xl p-6 glow-border relative overflow-hidden'>
                  <Quote className='w-6 h-6 text-primary/40 mb-2' />
                  <p className='text-lg font-medium italic text-foreground/85'>
                    Open to new opportunities and collaborations. I'd be happy to connect.
                  </p>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div ref={scrollRef} className='cardsContainer grid sm:grid-cols-2 gap-5'>
              {highlights.map((highlight, idx) => (
                <TraitsCard key={idx} quality={highlight} idx={idx} />
              ))}
            </div>
        </div>
      </div>
    </section>
  )
}