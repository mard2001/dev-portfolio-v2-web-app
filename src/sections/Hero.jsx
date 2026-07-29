import React, { useMemo } from 'react'
import Button from '../components/Button'
import { shortAboutSelf, socMedLinks } from '../constants/Constants'
import Typewriter from "typewriter-effect";
import ButtonAnimate from '../components/ButtonAnimate';
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import MdiReact from '@mdi/react'

const Icon = MdiReact.default

export default function Hero() {
  // Computed once instead of on every render, so the ambient dots don't jump to new
  // random positions if this component ever re-renders for any reason.
  const dots = useMemo(() => Array.from({ length: 50 }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 5,
  })), []);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const heroSplit = new SplitText('.heroHeader2Main', { type: 'chars, words' });
    const paragraph = new SplitText('.heroAboutSelf', { type: 'words' });

    heroSplit.chars.forEach((char) => {
      char.classList.add("text-gradient");
    });

    if (reduceMotion) {
      gsap.set(
        ['.availabilityDiv', ...heroSplit.chars, '.typeWriter', ...paragraph.words, '.heroCtaRow', '.socialRow', '.profileImgDiv'],
        { opacity: 1, x: 0, y: 0, scale: 1 }
      );
      return () => {
        heroSplit.revert();
        paragraph.revert();
      };
    }

    gsap.set('.availabilityDiv', { x: -60, opacity: 0 });
    gsap.set(heroSplit.chars, { xPercent: 100, opacity: 0 });
    gsap.set('.typeWriter', { opacity: 0, y: 12 });
    gsap.set(paragraph.words, { yPercent: 100, opacity: 0 });
    gsap.set('.heroCtaRow', { opacity: 0, y: 16 });
    gsap.set('.socialRow', { opacity: 0, y: 16 });
    gsap.set('.profileImgDiv', { y: 100, opacity: 0, scale: 0.8 });

    // One coordinated intro sequence using relative offsets instead of independent
    // tweens with hardcoded delay values that silently drift out of sync with each
    // other if any single piece's timing changes.
    const tl = gsap.timeline();

    tl.to('.availabilityDiv', { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
      .to(heroSplit.chars, {
        xPercent: 0, opacity: 1, duration: 0.8, stagger: 0.04, ease: 'power2.inOut',
      }, '-=0.3')
      .to('.typeWriter', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .to(paragraph.words, {
        yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: 'expo.out',
      }, '-=0.2')
      .to('.heroCtaRow', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .to('.socialRow', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .to('.profileImgDiv', { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' }, '-=1.1');

    return () => {
      heroSplit.revert();
      paragraph.revert();
    };
  }, [])

  return (
    <section className='relative min-h-screen flex items-center overflow-hidden'>

      {/* BACKGROUND */}
      <div className='absolute inset-0'>
        <img src="/images/BlueHorizon.avif" alt="" className='w-full h-full object-cover opacity-40' />
        <div className='absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background' />
      </div>

      {/* MOVING ANIMATED DOTS */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {dots.map((dot, i) => (
          <div
            key={i}
            className='absolute w-1.5 h-1.5 rounded-full opacity-60'
            style={{
              background: "var(--color-primary)",
              left: dot.left,
              top: dot.top,
              animation: `slow-drift ${dot.duration}s ease-in-out infinite`,
              animationDelay: `${dot.delay}s`
            }}
          />
        ))}
      </div>

      {/* CONTENT */}
      <div className='container mx-auto px-6 pt-32 pb-20 relative z-10'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          {/* LEFT COLUMN */}
          <div className='space-y-8'>
            <div className='availabilityDiv'>
              <span className='inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary'>
                <span className='w-2 h-2 bg-primary rounded-full animate-pulse heroBadge' />
                Developer is Open to Work
              </span>
            </div>

            {/* HEADLINE */}
            <div className='space-y-3'>
              <h2 className='text-2xl md:text-5xl font-bold leading-tight text-secondary-foreground text-gradient heroHeader2Main'>Hi, You can call me Marv,</h2>
              <h1 className="font-bold typeWriter text-2xl md:text-4xl lg:text-5xl text-primary">
                  <Typewriter
                    options={{
                      strings: [
                        "a Software Engineer.",
                        "a Front-End Web Developer.",
                        "a Back-End Web Developer.",
                        "a Full-Stack Web Developer.",
                        "a Data Engineer.",
                        "a Data Analyst.",
                      ],
                      autoStart: true,
                      loop: true,
                      delay: 75,
                      deleteSpeed: 50,
                    }}
                  />
              </h1>
              <p className='text-lg text-muted-foreground max-w-lg heroAboutSelf'>
                {shortAboutSelf}
              </p>
            </div>

            {/* CALL TO ACTION */}
            <div className="heroCtaRow flex items-center gap-4">
              <a href="/MarvinNavarro-Resume.pdf" download="MarvinNavarro-Resume.pdf">
                <Button size='sm'>Download Resume</Button>
              </a>
              <a href="#Projects">
                <ButtonAnimate>View Projects</ButtonAnimate>
              </a>
            </div>

            {/* SOCIAL MEDIA LINKS */}
            <div className='socialRow flex items-center gap-3 text-muted/50'>
              {socMedLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className='rounded-[10px] p-2 glass hover:bg-primary/10 hover:text-primary transition-colors duration-200'
                >
                  <Icon path={social.icon} size={0.8} />
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className='relative profileImgDiv'>
            {/* PROFILE IMAGE */}
            <div className='relative w-[18.5rem] sm:w-[22.5rem] md:w-full md:max-w-md mx-auto'>
              <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/30 via-transparent to-primary/10 blur-2xl animate-pulse-glow'/>
              <div className='relative glass rounded-3xl p-2 glow-border'>
                <img
                  src="/images/ProfilePhoto2.jpg"
                  alt="Portrait of Marvin Navarro"
                  className='w-full aspect-[4/5] object-cover rounded-2xl rotate-3 hover:rotate-0 duration-300'
                />

                {/* FLOATING BADGE */}
                <div className='absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-16 md:-right-20 rounded-xl px-4 py-3 animate-float'>
                  <img src="/images/Floating.png" alt="" className='w-32 sm:w-40 shadow-xl/30' />
                </div>

                {/* STATUS BADGE */}
                <div className='absolute -top-4 -left-4 glass rounded-xl px-4 py-3 animate-float animation-delay-600 bg-surface/80'>
                  <div className='text-2xl font-bold text-primary'>3+</div>
                  <div className='text-xs text-muted-foreground'>Years Exp.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}