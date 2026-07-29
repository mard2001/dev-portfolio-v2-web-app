import { ChevronLeft, ChevronRight, FileCode, X, ZoomIn } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Cable, Calendar, ChartLineIcon, Code, CodeSquare, Info, LayoutGridIcon, SquareArrowOutUpRight, User } from 'lucide-react'

export const ProjectModal = ({ open, onClose, content }) => {
    // Hooks must run unconditionally on every render — the old early-return above these
    // broke that rule. Mount/visible are split so the closing transition actually gets
    // time to play instead of the component unmounting the instant `open` flips.
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [loadingImages, setLoadingImages] = useState(
        content?.images?.map(() => true) ?? []
    );

    useEffect(() => {
        setLoadingImages(content?.images?.map(() => true) ?? []);
    }, [content?.images]);

    useEffect(() => {
        if (open) {
            setMounted(true);
            const raf = requestAnimationFrame(() => setVisible(true));
            return () => cancelAnimationFrame(raf);
        }
        setVisible(false);
        const timeout = setTimeout(() => setMounted(false), 300);
        return () => clearTimeout(timeout);
    }, [open]);

    // Lock background scroll and allow Escape to close while the modal is up.
    useEffect(() => {
        if (!mounted) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const imageCount = content?.images?.length ?? 0;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (selectedImageIndex !== null) setSelectedImageIndex(null);
                else onClose();
                return;
            }
            if (selectedImageIndex === null || imageCount < 2) return;
            if (e.key === 'ArrowRight') {
                setSelectedImageIndex((prev) => (prev + 1) % imageCount);
            } else if (e.key === 'ArrowLeft') {
                setSelectedImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [mounted, selectedImageIndex, onClose, content?.images?.length]);

    const goToPrevImage = (e) => {
        e.stopPropagation();
        setSelectedImageIndex((prev) => (prev - 1 + content.images.length) % content.images.length);
    };

    const goToNextImage = (e) => {
        e.stopPropagation();
        setSelectedImageIndex((prev) => (prev + 1) % content.images.length);
    };

    const handleImageLoad = (idx) => {
        setLoadingImages((prev) => {
            const newLoading = [...prev];
            newLoading[idx] = false;
            return newLoading;
        });
    };

    if (!mounted || !content) return null;

    return (
        <div
            onClick={onClose}
            className={`fixed inset-0 z-50 flex justify-center items-center bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`w-full mx-4 sm:mx-10 sm:w-200 md:w-300 h-[90vh] bg-surface border border-border rounded-xl shadow-2xl shadow-black/40 p-6 transition-all duration-300 ease-out ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
                <button
                    type='button'
                    aria-label='Close project details'
                    onClick={onClose}
                    className='absolute top-3 right-3 p-1.5 bg-card border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                >
                    <X size={18} />
                </button>

                <div className='overflow-y-auto w-full gap-4 relative h-[85vh]'>
                    <div className='pt-1 pb-6'>
                        <div className='flex items-center gap-2 mb-5 pr-8'>
                            <FileCode size={20} className='text-primary shrink-0' />
                            <h1 className='font-bold text-lg text-foreground'>{content.title}</h1>
                        </div>
                        <hr className='border-border' />
                    </div>

                    <div className='flex flex-col-reverse md:flex-row gap-6'>
                        <div className="grow md:h-full md:overflow-y-auto md:overflow-x-hidden pr-1">
                            <div className="projectDescDiv">
                                <div className='projectHeader flex items-center mb-3'>
                                    <Info size={20} className='text-primary mr-2' />
                                    <span className='font-bold text-foreground'>About the Project</span>
                                </div>
                                <div className='projectContent mb-4'>
                                    {content.fullDescription.map((desc, idx) => (
                                        <p key={idx} className='text-muted-foreground text-sm pl-7 mb-3 text-justify'>
                                            {desc}
                                        </p>
                                    ))}
                                </div>
                                <div className='flex flex-wrap gap-2 pl-7 mb-10'>
                                    {content.tech.map((tech, idx) => (
                                        <span
                                            key={"tech1-" + idx}
                                            className='text-[0.65rem] border border-border px-2 py-1 rounded-full text-secondary/80'
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {content.techChallenges?.length > 0 && (
                                <div className="projectChallenges mt-5">
                                    <div className='projectHeader flex items-center'>
                                        <Cable size={20} className='text-primary mr-2' />
                                        <span className='font-bold text-foreground'>Technical Challenges</span>
                                    </div>
                                    <div className="pl-7 pt-2">
                                        {content.techChallenges.map((challenge, idx) => (
                                            <div key={idx} className='rounded-xl border border-border bg-card/50 px-3 py-4 my-3 flex items-center gap-3'>
                                                <span className='shrink-0 rounded-full bg-primary/15 w-7 h-7 flex items-center justify-center'>
                                                    <span className='text-primary text-xs font-medium'>{idx + 1}</span>
                                                </span>
                                                <span className='text-xs text-muted-foreground'>
                                                    {challenge}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {content.impact?.length > 0 && (
                                <div className="projectImpact mt-5">
                                    <div className='projectHeader flex items-center'>
                                        <ChartLineIcon size={20} className='text-primary mr-2' />
                                        <span className='font-bold text-foreground'>Impact &amp; Results</span>
                                    </div>
                                    <div className="pt-4 pb-3 mb-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                        {content.impact.map((impact, idx) => (
                                            <div key={'impactList' + idx} className="border border-border bg-card/50 p-3 rounded-lg">
                                                <div className='text-center text-lg font-semibold text-primary'>{impact.value}</div>
                                                <div className='text-center text-xs text-muted-foreground'>{impact.title}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {content.images?.length > 0 && (
                                <div className="projectGallery mt-5">
                                    <div className='projectHeader flex items-center'>
                                        <LayoutGridIcon size={20} className='text-primary mr-2' />
                                        <span className='font-bold text-foreground'>Gallery</span>
                                    </div>
                                    <div className='pt-4 pb-3 mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2'>
                                        {content.images.map((img, idx) => (
                                            <button
                                                type='button'
                                                key={'projectPhotoGal' + idx}
                                                onClick={() => setSelectedImageIndex(idx)}
                                                aria-label={`View screenshot ${idx + 1} of ${content.title}`}
                                                className="group/thumb relative w-full aspect-video overflow-hidden rounded-lg border border-border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                            >
                                                {loadingImages[idx] && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-surface">
                                                        <div className="border-2 border-border border-t-primary rounded-full w-5 h-5 animate-spin" />
                                                    </div>
                                                )}
                                                <img
                                                    src={`/images/projectScreenshots/${img}`}
                                                    alt={`${content.title} screenshot ${idx + 1}`}
                                                    className={`w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-110 ${loadingImages[idx] ? 'opacity-0' : 'opacity-100'}`}
                                                    onLoad={() => handleImageLoad(idx)}
                                                    onError={() => handleImageLoad(idx)}
                                                />
                                                <div className='absolute inset-0 bg-background/0 group-hover/thumb:bg-background/40 transition-colors duration-300 flex items-center justify-center'>
                                                    <ZoomIn size={18} className='text-foreground opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300' />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-none md:w-65 lg:w-80">
                            <div className='rounded-2xl border border-border bg-card/40 p-5'>
                                <span className='uppercase text-xs tracking-wider text-muted-foreground'>Project Metadata</span>

                                <div className='flex items-center my-5'>
                                    <Calendar size={20} className='text-muted-foreground mr-4 shrink-0' />
                                    <div className='flex flex-col'>
                                        <span className="text-xs text-muted-foreground">Duration</span>
                                        <span className='text-sm text-foreground'>{content.duration}</span>
                                    </div>
                                </div>
                                <div className='flex items-center my-5'>
                                    <User size={20} className='text-muted-foreground mr-4 shrink-0' />
                                    <div className='flex flex-col'>
                                        <span className="text-xs text-muted-foreground">Role</span>
                                        <span className='text-sm text-foreground'>{content.role}</span>
                                    </div>
                                </div>
                                <div className='flex items-center my-5'>
                                    <CodeSquare size={20} className='text-muted-foreground mr-4 shrink-0' />
                                    <div className='flex flex-col'>
                                        <span className="text-xs text-muted-foreground">Stack</span>
                                        <span className='text-sm text-foreground'>
                                            {content.tech.map((tech, idx) => (
                                                <span key={"tech" + idx}>
                                                    {tech}{idx < content.tech.length - 1 ? ", " : ""}
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                </div>

                                <hr className='border-border my-5' />

                                {content.link && (
                                    <a
                                        href={content.link}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='flex items-center justify-center gap-2 text-center bg-primary text-primary-foreground px-3 py-2 rounded-lg w-full mb-3 text-sm font-medium hover:bg-primary/90 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                                    >
                                        <SquareArrowOutUpRight size={15} /> Live Dashboard
                                    </a>
                                )}
                                {content.github && (
                                    <a
                                        href={content.github}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='flex items-center justify-center gap-2 text-center bg-card border border-border px-3 py-2 rounded-lg w-full text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                                    >
                                        <Code size={15} /> Source Code
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image lightbox */}
            {selectedImageIndex !== null && (
                <div
                    className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-[60]"
                    onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(null); }}
                >
                    <div className="relative flex items-center gap-2 sm:gap-4 max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
                        {content.images.length > 1 && (
                            <button
                                type='button'
                                aria-label='Previous image'
                                onClick={goToPrevImage}
                                className="shrink-0 p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/40 cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}

                        <div className="relative">
                            <button
                                type='button'
                                aria-label='Close image preview'
                                className="absolute -top-3 -right-3 p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-primary cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                onClick={() => setSelectedImageIndex(null)}
                            >
                                <X size={16} />
                            </button>
                            <img
                                src={`/images/projectScreenshots/${content.images[selectedImageIndex]}`}
                                alt={`${content.title} screenshot ${selectedImageIndex + 1}`}
                                className="max-w-[75vw] max-h-[80vh] rounded-2xl shadow-2xl border border-border"
                                onClick={(e) => e.stopPropagation()}
                            />
                            {content.images.length > 1 && (
                                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs bg-background/70 border border-border rounded-full px-3 py-1 text-muted-foreground">
                                    {selectedImageIndex + 1} / {content.images.length}
                                </span>
                            )}
                        </div>

                        {content.images.length > 1 && (
                            <button
                                type='button'
                                aria-label='Next image'
                                onClick={goToNextImage}
                                className="shrink-0 p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/40 cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <ChevronRight size={20} />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}