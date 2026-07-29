import React, { useState, useRef } from 'react'
import { projects } from '../constants/Constants'
import { ProjCard } from '../components/projCard'
import { ProjectModal } from '../components/ProjectModal'
import { Code } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger, SplitText } from 'gsap/all'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const [open, setOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const scrollRef = useRef();

  const handleOpen = (project) => {
    setSelectedProject(project)
    setOpen(true)
  }

  // Magnetic tilt: the card leans toward the cursor, then springs back on exit.
  const handleTilt = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    gsap.to(card, {
      rotateX: (relY - 0.5) * -10,
      rotateY: (relX - 0.5) * 10,
      transformPerspective: 900,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    gsap.to(card, {
      '--glow-x': `${relX * 100}%`,
      '--glow-y': `${relY * 100}%`,
      duration: 0.3,
      overwrite: 'auto',
    });
  };

  const resetTilt = (e) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
    });
  };

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const projectCards = gsap.utils.toArray(scrollRef.current.children);

    if (reduceMotion) {
      gsap.set(['.projTitle', '.projSubHeader', '.projMiniTitle', ...projectCards], {
        opacity: 1, y: 0, rotateX: 0, filter: 'none',
      });
      return;
    }

    const title = new SplitText('.projTitle', { type: 'words' });
    const paragraph = new SplitText('.projSubHeader', { type: 'words' });

    // Header reveal: blur-to-focus rather than a plain slide, feels more editorial.
    gsap.set(title.words, { opacity: 0, yPercent: 100, filter: 'blur(10px)' });
    gsap.set(paragraph.words, { opacity: 0, yPercent: 100, filter: 'blur(6px)' });
    gsap.set('.projMiniTitle', { opacity: 0, x: -24 });

    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.projTitle',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    headerTl
      .to('.projMiniTitle', { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' })
      .to(title.words, {
        opacity: 1, yPercent: 0, filter: 'blur(0px)',
        duration: 0.9, stagger: 0.045, ease: 'expo.out',
      }, '-=0.35')
      .to(paragraph.words, {
        opacity: 1, yPercent: 0, filter: 'blur(0px)',
        duration: 0.7, stagger: 0.03, ease: 'expo.out',
      }, '-=0.6');

    // Card grid: 3D flip-up cascade, batched so it retriggers cleanly per card as it enters view.
    gsap.set(projectCards, {
      opacity: 0, y: 70, rotateX: -18,
      transformPerspective: 900, transformOrigin: 'top center',
    });

    ScrollTrigger.batch(projectCards, {
      start: 'top 88%',
      onEnter: (batch) => gsap.to(batch, {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.9, stagger: 0.12, ease: 'power3.out',
      }),
    });

    // Ambient glows drift slowly instead of sitting static.
    gsap.to('.orb-1', { x: 40, y: -30, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.orb-2', { x: -30, y: 25, duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.orb-3', { x: 25, y: 35, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    return () => {
      title.revert();
      paragraph.revert();
    };
  }, []);

  return (
    <>
      <div id='Projects' className='pt-20 relative'>
        <section className='px-3 relative overflow-hidden'>
          {/* Subtle grain gives the dark surface texture instead of a flat gradient — ties to "Craft" */}
          <svg className='pointer-events-none absolute inset-0 w-full h-full opacity-[0.035] mix-blend-overlay' aria-hidden='true'>
            <filter id='grain'>
              <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch' />
            </filter>
            <rect width='100%' height='100%' filter='url(#grain)' />
          </svg>

          <div className='orb-1 absolute top-1/4 right-1/64 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2' />
          <div className='orb-2 absolute top-1/4 left-1/64 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2' />
          <div className='orb-3 absolute bottom-32 right-1/64 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2' />

          <div className="container mx-auto">
            <div className='mb-15 flex flex-col items-center text-center'>
              <div className='projMiniTitle flex items-center gap-2'>
                <Code className='w-4 h-4 text-secondary' />
                <span className='text-secondary text-sm font-medium tracking-wider uppercase'>Code &amp; Craft</span>
              </div>
              <h2 className='projTitle text-4xl md:text-5xl font-bold mt-3 mb-2 text-secondary-foreground'>
                Featured Deployments
              </h2>
              <p className='projSubHeader text-muted-foreground max-w-xl'>
                Transforming complex business requirements into elegant digital products.
              </p>
            </div>

            <div ref={scrollRef} className='projectsContainer mb-20 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
              {projects.map((project, indx) => (
                <div
                  key={indx}
                  onMouseMove={handleTilt}
                  onMouseLeave={resetTilt}
                  className='group relative h-full rounded-[var(--radius)] [transform-style:preserve-3d] transition-shadow duration-100 hover:shadow-[0_20px_50px_-15px_rgba(214,162,94,0.25)]'
                  style={{
                    background: 'radial-gradient(circle at var(--glow-x,50%) var(--glow-y,50%), color-mix(in srgb, var(--color-primary) 18%, transparent), transparent 60%)',
                  }}
                >
                  <ProjCard project={project} onOpen={handleOpen} />
                  {/* Hairline border that lights up on hover, reinforcing the tilt without touching ProjCard internals */}
                  <div className='pointer-events-none absolute inset-0 rounded-[var(--radius)] border border-border group-hover:border-primary/40 transition-colors duration-100' />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <ProjectModal
        open={open}
        onClose={() => setOpen(false)}
        content={selectedProject}
      />
    </>
  )
}