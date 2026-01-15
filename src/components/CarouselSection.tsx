import * as React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";

const images = [
    {
        src: "/carousel-1.png",
        alt: "Expert Computer Repair",
        title: "Computer Repair",
        subtitle: "Expert diagnostics, virus removal, and hardware optimization"
    },
    {
        src: "/carousel-4.png",
        alt: "Printer Repair Services",
        title: "Printer Repair",
        subtitle: "Complete maintenance and repair for all printer brands"
    },
    {
        src: "/carousel-5.png",
        alt: "CCTV Security Systems",
        title: "CCTV Repair & Installation",
        subtitle: "Professional security camera infrastructure and monitoring"
    },
    {
        src: "/carousel-2.png",
        alt: "Networking Solutions",
        title: "Networking Services",
        subtitle: "Robust business and home network infrastructure setup"
    },
    {
        src: "/carousel-3.png",
        alt: "IT Consultation",
        title: "Other Services",
        subtitle: "Custom IT solutions, consulting, and technical support"
    }
];

import { Link } from "react-router-dom";

export function CarouselSection() {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );

    return (
        <div className="w-full max-w-5xl mx-auto mt-12 sm:mt-16 lg:mt-20">
            <Carousel
                plugins={[plugin.current]}
                opts={{
                    loop: true,
                    align: "start",
                }}
                className="w-full relative group"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent>
                    {images.map((image, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                                <Link to="/request">
                                    <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden glass-card hover:cursor-pointer group/card">
                                        <CardContent className="flex p-0 relative aspect-video items-center justify-center h-[300px] sm:h-[400px] lg:h-[500px]">
                                            <img
                                                src={image.src}
                                                alt={image.alt}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-10 text-left">
                                                <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 lg:mb-3 transform transition-all duration-500 translate-y-0 opacity-100 drop-shadow-md leading-tight">
                                                    {image.title}
                                                </h3>
                                                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/95 max-w-xl transform transition-all duration-500 translate-y-0 opacity-100 drop-shadow-sm leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-3">
                                                    {image.subtitle}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm hidden sm:flex" />
                <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm hidden sm:flex" />
            </Carousel>
        </div>
    );
}
