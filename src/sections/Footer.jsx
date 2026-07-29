import React, { useState } from 'react'
import { contactInfo } from '../constants/Constants'
import { Copy, Mail, Check, PhoneForwarded } from 'lucide-react';
import MdiReact from '@mdi/react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

const Icon = MdiReact.default

const Footer = () => {
    const [copiedField, setCopiedField] = useState(null);
    const email = "marvinnavarro15@gmail.com";
    const phone = "+63 906 322 0193";

    const handleCopy = (field, value) => {
        navigator.clipboard.writeText(value)
            .then(() => {
                setCopiedField(field);
                setTimeout(() => setCopiedField(null), 1500);
            })
            .catch(() => {
                // Clipboard API can reject (insecure context, denied permission, etc.) —
                // fail quietly rather than throwing an unhandled rejection.
            });
    };

    useGSAP(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) return;

        gsap.set('.footerReveal', { opacity: 0, y: 30 });
        gsap.to('.footerReveal', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#Contact',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });
    }, []);

    return (
        <div className='relative text-center mt-30' id='Contact'>
            <h1 className='footerReveal text-4xl md:text-5xl font-bold mt-4 mb-6 text-secondary-foreground'>Let’s build something together</h1>
            <p className='footerReveal text-sm text-muted-foreground mb-10'>Have a project in mind? I'm currently available for freelance work or full time work and open to new opportunities.</p>

            <div className='footerReveal flex flex-col items-center gap-5'>
                <div className="relative inline-flex items-center gap-3 rounded-xl bg-card/70 backdrop-blur-md border border-border px-4 py-3 text-sm text-foreground shadow-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Mail size={16} />
                    </div>
                    <span className="select-all font-medium">{email}</span>
                    <button
                        type='button'
                        aria-label='Copy email address'
                        onClick={() => handleCopy('email', email)}
                        className="relative ml-2 text-muted-foreground transition-colors duration-200 hover:text-primary cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                        {copiedField === 'email' ? <Check size={16} /> : <Copy size={16} />}
                        <span
                            role='status'
                            aria-live='polite'
                            className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-card border border-border px-2 py-1 text-xs text-foreground shadow-lg transition-all duration-200 ${copiedField === 'email' ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
                        >
                            Copied!
                        </span>
                    </button>
                </div>

                <div className="relative inline-flex items-center gap-3 rounded-xl bg-card/70 backdrop-blur-md border border-border px-4 py-3 text-sm text-foreground shadow-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <PhoneForwarded size={16} />
                    </div>
                    <span className="select-all font-medium">{phone}</span>
                    <button
                        type='button'
                        aria-label='Copy phone number'
                        onClick={() => handleCopy('phone', phone)}
                        className="relative ml-2 text-muted-foreground transition-colors duration-200 hover:text-primary cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                        {copiedField === 'phone' ? <Check size={16} /> : <Copy size={16} />}
                        <span
                            role='status'
                            aria-live='polite'
                            className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-card border border-border px-2 py-1 text-xs text-foreground shadow-lg transition-all duration-200 ${copiedField === 'phone' ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
                        >
                            Copied!
                        </span>
                    </button>
                </div>
            </div>

            <div className='footerReveal flex flex-row flex-wrap justify-center'>
                {contactInfo.map((contact, indx) => (
                    <a
                        href={contact.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        key={indx}
                        className='mt-8 mx-2 flex flex-row items-center rounded-xl bg-card/70 backdrop-blur-md border border-border px-4 py-3 text-sm text-muted-foreground shadow-lg transition-all duration-300 hover:-translate-y-1 hover:text-primary hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                    >
                        <Icon path={contact.icon} size={0.8} className='w-5 h-5 mr-1' />
                        {contact.title}
                    </a>
                ))}
            </div>

            <hr className='footerReveal border-border mt-20 mb-10' />

            <p className='footerReveal text-sm text-muted-foreground/60 mb-15 mx-10'>&#169; 2026 Marvin Navarro Dev • All Rights Reserved • Crafted with precision and passion</p>
        </div>
    )
}

export default Footer