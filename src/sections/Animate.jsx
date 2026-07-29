import React from 'react'
import { leftData, rightData } from '../constants/Constants'
import MdiReact from '@mdi/react'
import { useMediaQuery } from 'react-responsive'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const Icon = MdiReact.default

const Animate = () => {
    const isMobile = useMediaQuery({ maxWidth: 767 });

    useGSAP(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion) {
            // Skip the scroll-locked reveal entirely for reduced-motion users and jump
            // straight to the end state — the closing tagline is the more important
            // content, and a pinned scrub is exactly the kind of motion this setting
            // asks us to avoid.
            gsap.set('.content-will-fade', { opacity: 0 });
            gsap.set('.masked-img', { scale: 1.3, maskPosition: 'top', maskSize: '1400%' });
            gsap.set('.masked-container', { opacity: 1 });
            return;
        }

        const start = isMobile ? 'top 10%' : 'top 30%';

        const maskTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.masked-img',
                start,
                end: 'bottom top',
                scrub: 1.5,
                pin: true
            }
        });

        maskTimeline
            .to('.content-will-fade', { opacity: 0, stagger: 0.2, ease: 'power1.inOut' })
            .to('.masked-img', { scale: 1.3, maskPosition: 'top', maskSize: '1400%', duration: 5, ease: 'power1.inOut' })
            .to('.masked-container', { opacity: 1, duration: 1, ease: 'power1.inOut' });
    }, [isMobile]);

    return (
        <section id="Animate">
            <div className='absolute bottom-32 right-1/64 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2' />
            <div className='absolute top-1/4 left-1/64 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/18' />
            <div className='absolute top-1/2 left-1/2 w-100 h-100 bg-background/60 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2' />

            <div className="container mx-auto h-full pt-30 relative">
                <h2 id='animateHeader' className='content-will-fade absolute text-[70px] lg:text-[180px]'>The Builder</h2>
                <div className="flex items-center gap-4 w-90 mx-auto md:mt-10 content-will-fade">
                    <div className="flex-1 h-px bg-primary/30"></div>
                    <h1 className="text-lg font-semibold whitespace-nowrap text-primary" id='animateSubHeader'>Code Principle</h1>
                    <div className="flex-1 h-px bg-primary/30"></div>
                </div>

                <div className="content flex flex-col items-center md:items-start md:justify-around md:flex-row pt-15 px-10">
                    <ul className='space-y-4 content-will-fade order-1 md:order-1'>
                        {
                            leftData.map((item, index) => (
                                <li key={"leftData" + index} className='my-8'>
                                    <div className='flex items-center'>
                                        <Icon path={item.icon} size={1} className='w-8 h-8 mr-5 mb-5 text-primary' />
                                        <div>
                                            <p className='mb-0 text-nowrap'>{item.header}</p>
                                            <p className='mb-0 text-xs text-muted-foreground'>{item.subContent}</p>
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>

                    <div className="animatePhotoDiv w-full pt-5 order-3 md:order-2">
                        <img
                            src="/images/programmer.png"
                            alt="Illustration of a developer at work"
                            className='abs-center masked-img rounded-xl object-contain'
                        />
                    </div>

                    <ul className='space-y-4 content-will-fade order-2 md:order-3'>
                        {
                            rightData.map((item, index) => (
                                <li key={"rightData" + index} className='my-8'>
                                    <div className='flex justify-end text-end'>
                                        <div>
                                            <p className='mb-0 text-nowrap text-right'>{item.header}</p>
                                            <p className='mb-0 text-xs text-muted-foreground text-right'>{item.subContent}</p>
                                        </div>
                                        <Icon path={item.icon} size={1} className='w-8 h-8 ml-5 mb-5 text-primary' />
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>

                <div className="masked-container mx-auto text-center">
                    <div className="mt-30 mb-20 mx-5">
                        <h1 className='maskedHeaderText text-4xl text-secondary-foreground'>Focused on quality, performance, and user satisfaction.</h1>
                        <p className='text-muted-foreground'>It makes me happy when clients are satisfied as this reflects my work quality and my character.</p>
                    </div>
                </div>
                <hr className='w-100 mx-auto border-primary/30 mt-35' />
            </div>
        </section>
    )
}

export default Animate