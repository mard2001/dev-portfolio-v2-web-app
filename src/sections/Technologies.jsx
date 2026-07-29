import React, { useRef } from 'react'
import { technologies } from '../constants/Constants'
import { TechCards } from '../components/TechCards';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger)

export default function Technologies() {
    const scrollRef = useRef();

    useGSAP(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const techCards = gsap.utils.toArray(scrollRef.current.children);

        if (reduceMotion) {
            gsap.set(['.techMiniTitle', '.techTitle', '.techSubHeader', ...techCards], {
                opacity: 1, y: 0, rotation: 0, scale: 1,
            });
            return;
        }

        // Header reveal — same language as the Projects section header, so the two sections
        // read as one system rather than two separately-built pieces.
        gsap.set('.techMiniTitle', { opacity: 0, x: -24 });
        gsap.set('.techTitle', { opacity: 0, y: 24 });
        gsap.set('.techSubHeader', { opacity: 0, y: 16 });

        gsap.timeline({
            scrollTrigger: {
                trigger: '.techTitle',
                start: 'top 88%',
                toggleActions: 'play none none none',
            },
        })
            .to('.techMiniTitle', { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' })
            .to('.techTitle', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
            .to('.techSubHeader', { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.35');

        // Card grid: each card animates itself (not the whole class), batched into a single
        // scroll-triggered cascade instead of one competing trigger per card.
        gsap.set(techCards, { y: 40, rotation: -12, scale: 0.85, opacity: 0 });

        ScrollTrigger.batch(techCards, {
            start: 'top 92%',
            onEnter: (batch) => gsap.to(batch, {
                y: 0,
                rotation: 0,
                scale: 1,
                opacity: 1,
                duration: 0.7,
                stagger: { each: 0.06, from: 'center' },
                ease: 'back.out(1.6)',
            }),
        });
    }, [])

    return (
        <div id='Technologies' className='pt-10'>
            <div className='mb-10 flex flex-col items-center text-center px-3'>
                <div className='techMiniTitle flex items-center gap-2'>
                    <Layers className='w-4 h-4 text-secondary' />
                    <span className='text-secondary text-sm font-medium tracking-wider uppercase'>The Toolkit</span>
                </div>
                <h2 className='techTitle text-4xl md:text-5xl font-bold mt-3 mb-2 text-secondary-foreground'>
                    Technologies I Work With
                </h2>
                <p className='techSubHeader text-muted-foreground max-w-xl'>
                    The languages, frameworks, and tools behind the projects above.
                </p>
            </div>

            <div ref={scrollRef} className='mb-10 mx-auto container flex flex-wrap justify-center gap-5 px-3'>
                {technologies.map((tech, idx) => (
                    <div
                        key={idx}
                    >
                        <TechCards index={idx} {...tech} />
                    </div>
                ))}
            </div>
        </div>
    )
}