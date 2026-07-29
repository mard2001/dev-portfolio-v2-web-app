import React from 'react'
import { experiences } from '../constants/Constants'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react';
import { ScrollTrigger, SplitText } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rows = gsap.utils.toArray('.experienceRow');

    if (reduceMotion) {
      gsap.set(['.sectionExpMiniTitle', '.sectionExpTitle', '.exptSubTitle', ...rows], {
        opacity: 1, x: 0, y: 0, scale: 1,
      });
      return;
    }

    const title = new SplitText('.sectionExpTitle', { type: 'words' });
    const paragraph = new SplitText('.exptSubTitle', { type: 'words' });

    gsap.set(title.words, { opacity: 0, yPercent: 100 });
    gsap.set(paragraph.words, { opacity: 0, yPercent: 100 });
    gsap.set('.sectionExpMiniTitle', { opacity: 0, x: -40 });

    // One coordinated intro timeline (mini title -> title -> subtitle), same pattern
    // used across the other sections instead of three independent tweens with
    // hardcoded delay values.
    gsap.timeline({
      scrollTrigger: {
        trigger: '.sectionExpTitle',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    })
      .to('.sectionExpMiniTitle', { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' })
      .to(title.words, {
        opacity: 1, yPercent: 0, duration: 0.8, stagger: 0.04, ease: 'expo.out',
      }, '-=0.35')
      .to(paragraph.words, {
        opacity: 1, yPercent: 0, duration: 0.6, stagger: 0.03, ease: 'expo.out',
      }, '-=0.5');

    // Each timeline row slides in from the side it visually sits on — left rows from
    // the left, right rows from the right — so the motion reinforces the zigzag layout
    // instead of being arbitrary. Replaces the old page-load-only fade (which had
    // already finished playing by the time this section scrolled into view) and the
    // separate scale-pulse gimmick.
    rows.forEach((row, idx) => {
      const fromX = idx % 2 === 0 ? -50 : 50;
      gsap.set(row, { x: fromX, opacity: 0 });
      gsap.to(row, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 88%',
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
    <section id='Experience' className='py-32 relative overflow-hidden'>
      {/* BACKGROUND */}
      <div className='absolute inset-0'>
        <img src="/images/texturedBurntFabric.jpg" alt="" className='w-full h-full object-cover opacity-60' />
        <div className='absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background' />
      </div>

      <div className='absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2' />
      <div className='absolute top-1/5 right-1/4 w-96 h-96 bg-primary/4 rounded-full blur-3xl -translate-y-1/2' />
      <div className='absolute bottom-1/64 right-1/32 w-96 h-96 bg-primary/5 rounded-full blur-2xl -translate-y-1/2' />

      <div className='container mx-auto px-6 relative z-10'>
        {/* SECTION HEADER */}
        <div className='mb-16'>
          <div className='sectionExpMiniTitle'>
            <span className='text-secondary text-sm font-medium tracking-wider uppercase'>Career Journey</span>
          </div>
          <h2 className='sectionExpTitle text-4xl md:text-5xl font-bold mt-4 mb-6 text-secondary-foreground'>
            Hands-On Experience That Shows Growth.
          </h2>
          <p className='exptSubTitle text-muted-foreground'>Learning, building, and improving with every opportunity and experience.</p>
        </div>

        {/* TIMELINE */}
        <div className="relative">
          <div className='absolute left-0 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/70 via-primary/30 to-transparent md:-translate-x-1/2 ' />

          {/* EXPERIENCES */}
          <div className='space-y-12'>
            {experiences.map((exp, idx) => (
              <div key={idx} className='experienceRow relative grid md:grid-cols-2 gap-8'>

                {/* TIMELINE DOT */}
                <div className='absolute left-0 md:left-1/2 top-0 w-3 h-3 bg-primary rounded-full -translate-x-1/2 ring-4 ring-background z-10'>
                  {exp.current && <span className='absolute inset-0 rounded-full bg-primary animate-ping opacity-75'/>}
                </div>

                {/* CONTENT */}
                <div className={`experienceCard group pl-8 md:pl-0 transition-transform duration-300 hover:-translate-y-2 ${idx % 2 == 0 ? "md:pr-8 md:text-right" : "md:col-start-2 md:pl-8"}`}>
                  <div className='p-4 rounded-2xl border border-transparent border-b-4 hover:border-b-primary/30 hover-glass transition-all duration-300'>
                    <span className='text-sm text-primary/50 group-hover:text-primary font-medium transition-colors duration-300'>{exp.period}</span>
                    <h3 className='text-xl font-semibold mt-2 text-foreground'>{exp.role}</h3>
                    <p className='text-muted-foreground'>{exp.company}</p>
                    {
                      exp.description.map((text, textId) => (
                        <p key={textId} className='text-xs text-muted-foreground mt-4 leading-5'>{text}</p>
                      ))
                    }

                    <div className={`flex flex-wrap gap-2 mt-4 ${idx % 2 == 0 ? "md:justify-end" : ""}`}>
                      {exp.technologies.map((tech, techIdx) => (
                        <span key={techIdx} className='px-3 py-1 bg-surface border border-border text-xs rounded-full text-muted-foreground'>{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}