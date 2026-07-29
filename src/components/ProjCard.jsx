import { Code, ExternalLink } from 'lucide-react'
import React from 'react'

export const ProjCard = ({ project, onOpen }) => {
    return (
        <div className='projectCard h-[100%] group glass rounded-xl border border-border shadow-lg shadow-[#15121b]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#15121b]/40 h-full flex flex-col'>
            <div className='relative flex items-center justify-center mb-4 overflow-hidden rounded-t-xl'>
                <img
                    src={`/images/projectScreenshots/${project.images[0]}`}
                    alt={project.title}
                    className='w-full h-50 md:w-100 rounded-t-xl scale-100 group-hover:scale-110 transition-transform duration-300 ease-out'
                />
                {/* Gradient scrim guarantees the overlay text/button stay readable regardless of the screenshot underneath */}
                <div className='absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                <div className='absolute inset-0 hidden md:flex items-center justify-center'>
                    <button
                        onClick={() => onOpen(project)}
                        className='text-sm px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                    >
                        View More
                    </button>
                </div>
            </div>

            <div className='p-3 flex flex-col gap-5 flex-1'>
                <div className='flex justify-between items-start'>
                    <h3 className='text-base font-semibold text-foreground'>{project.title}</h3>
                    <div className='flex gap-1 items-center'>
                        {project.github && (
                            <button
                                type='button'
                                aria-label={`View ${project.title} source on GitHub`}
                                onClick={() => window.open(project.github, '_blank', 'noopener,noreferrer')}
                                className='p-1 rounded-md text-muted-foreground hover:text-primary cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                            >
                                <Code className='h-4 w-4' />
                            </button>
                        )}
                        {project.demo && (
                            <button
                                type='button'
                                aria-label={`Open ${project.title} live demo`}
                                onClick={() => window.open(project.demo, '_blank', 'noopener,noreferrer')}
                                className='p-1 rounded-md text-muted-foreground hover:text-primary cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                            >
                                <ExternalLink className='h-4 w-4' />
                            </button>
                        )}
                    </div>
                </div>

                {/* flex-1 absorbs the leftover height so short descriptions don't strand the tags mid-card */}
                <p className='text-sm text-muted-foreground flex-1'>{project.description}</p>

                <div className='flex flex-wrap gap-2 mt-auto'>
                    {project.tech.map((tech, idx) => (
                        <div
                            key={idx}
                            className='text-[0.65rem] border border-border px-2 py-1 rounded-full text-secondary/70 hover:text-secondary hover:border-secondary/40 transition-colors duration-300 cursor-default'
                        >
                            {tech}
                        </div>
                    ))}
                </div>

                <div className='md:hidden w-full'>
                    <hr className='border-border mb-5' />
                    <button
                        className='w-full px-4 py-2 text-sm relative overflow-hidden rounded-lg font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 inline-flex items-center justify-center gap-2 transition-colors duration-300'
                        onClick={() => onOpen(project)}
                    >
                        View Project
                    </button>
                </div>
            </div>
        </div>
    )
}