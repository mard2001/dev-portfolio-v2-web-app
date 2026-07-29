import React from 'react'
import Tilt from 'react-parallax-tilt';

export const TechCards = ({ index, iconName, link }) => {
    return (
        <Tilt
            perspective={300}
            transitionSpeed={400}
            glareEnable={true}
            glareMaxOpacity={0.25}
            glareColor="var(--color-primary)"
            glarePosition="all"
            glareBorderRadius="0.5rem"
        >
            <div className='techCardDiv group relative p-2 rounded-lg glass shadow-xl/20 inset-shadow-sm border border-transparent hover:border-primary/20 hover:scale-110 transition-all duration-500'>
                {/* Soft glow pulse behind the icon — a second, slower-feeling layer of motion
                    distinct from the tilt/scale, so hover reads as richer rather than just
                    "bigger". */}
                <div className='pointer-events-none absolute inset-0 rounded-lg bg-primary/0 group-hover:bg-primary/10 blur-md scale-75 group-hover:scale-110 transition-all duration-500' />

                {link && (
                    <img
                        src={link}
                        alt={iconName}
                        className='relative h-10 opacity-60 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-500'
                    />
                )}

                {/* Name reveals on hover — previously only available as invisible alt text */}
                {iconName && (
                    <span className='pointer-events-none absolute left-1/2 top-full -translate-x-1/2 -translate-y-1 mt-2 z-20 text-[0.65rem] font-medium text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300'>
                        {iconName}
                    </span>
                )}
            </div>
        </Tilt>
    )
}