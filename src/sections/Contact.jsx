import React, { useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { Mail, MessageSquare, Send, User, CheckCircle2, AlertCircle } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const initialForm = { name: '', email: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    gsap.set('.contactReveal', { opacity: 0, y: 30 });
    gsap.to('.contactReveal', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#ContactForm',
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Please enter your name.';
    if (!form.email.trim()) {
      nextErrors.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!form.message.trim()) nextErrors.message = 'Please add a short message.';
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('submitting');
    try {
      // TODO: wire this up to your actual send mechanism — e.g. EmailJS, Formspree,
      // or a POST to your own API route. This is the only place that needs to change.
      //
      // Example (EmailJS):
      // await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', form, 'PUBLIC_KEY');
      //
      // Example (your own API route):
      // const res = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(form),
      // });
      // if (!res.ok) throw new Error('Request failed');

      throw new Error('No send handler configured yet');
    } catch (err) {
      setStatus('error');
      return;
    }

    setStatus('success');
    setForm(initialForm);
  };

  return (
    <section id='ContactForm' className='py-20 relative overflow-hidden'>
      <div className='absolute top-1/3 right-1/32 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2' />
      <div className='absolute bottom-1/4 left-1/32 w-96 h-96 bg-secondary/5 rounded-full blur-3xl' />

      <div className='container mx-auto px-6 relative z-10 max-w-2xl'>
        <div className='contactReveal text-center mb-10'>
          <div className='flex items-center justify-center gap-2 mb-2'>
            <MessageSquare className='w-4 h-4 text-secondary' />
            <span className='text-secondary text-sm font-medium tracking-wider uppercase'>Send a Message</span>
          </div>
          <h2 className='text-4xl md:text-5xl font-bold mb-3 text-secondary-foreground'>Get In Touch</h2>
          <p className='text-muted-foreground'>Tell me a bit about your project and I'll get back to you soon.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className='contactReveal glass rounded-2xl border border-border p-6 md:p-8 space-y-5'
        >
          <div>
            <label htmlFor='contact-name' className='flex items-center gap-2 text-sm font-medium text-foreground mb-2'>
              <User className='w-4 h-4 text-primary' /> Name
            </label>
            <input
              id='contact-name'
              name='name'
              type='text'
              value={form.name}
              onChange={handleChange}
              placeholder='Your name'
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              className='w-full rounded-lg bg-surface border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-200'
            />
            {errors.name && (
              <p id='contact-name-error' className='mt-1.5 text-xs text-red-400'>{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor='contact-email' className='flex items-center gap-2 text-sm font-medium text-foreground mb-2'>
              <Mail className='w-4 h-4 text-primary' /> Email
            </label>
            <input
              id='contact-email'
              name='email'
              type='email'
              value={form.email}
              onChange={handleChange}
              placeholder='you@example.com'
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              className='w-full rounded-lg bg-surface border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-200'
            />
            {errors.email && (
              <p id='contact-email-error' className='mt-1.5 text-xs text-red-400'>{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor='contact-message' className='flex items-center gap-2 text-sm font-medium text-foreground mb-2'>
              <MessageSquare className='w-4 h-4 text-primary' /> Message
            </label>
            <textarea
              id='contact-message'
              name='message'
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="What's on your mind?"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              className='w-full rounded-lg bg-surface border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-200 resize-none'
            />
            {errors.message && (
              <p id='contact-message-error' className='mt-1.5 text-xs text-red-400'>{errors.message}</p>
            )}
          </div>

          <button
            type='submit'
            disabled={status === 'submitting'}
            className='w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
          >
            <Send className='w-4 h-4' />
            {status === 'submitting' ? 'Sending…' : 'Send Message'}
          </button>

          {status === 'success' && (
            <p role='status' className='flex items-center gap-2 text-sm text-secondary justify-center'>
              <CheckCircle2 className='w-4 h-4' /> Message sent — thanks for reaching out!
            </p>
          )}
          {status === 'error' && (
            <p role='alert' className='flex items-center gap-2 text-sm text-red-400 justify-center'>
              <AlertCircle className='w-4 h-4' /> Something went wrong. Please try again, or email me directly below.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}