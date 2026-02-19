"use client";

import Reveal from "./Reveal";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    centered?: boolean;
    light?: boolean;
}

export default function SectionHeader({ title, subtitle, centered = true, light = false }: SectionHeaderProps) {
    return (
        <div className={`mb-16 ${centered ? "text-center" : ""}`}>
            <Reveal>
                <h2 className={`font-display text-4xl md:text-5xl ${light ? "text-white" : "text-white"}`}>
                    {title}
                </h2>
            </Reveal>
            {subtitle && (
                <Reveal variant="fade" delay={0.08} className={centered ? "mx-auto" : ""}>
                    <p className={`mt-6 text-lg max-w-2xl ${centered ? "mx-auto" : ""} text-white/50`}>
                        {subtitle}
                    </p>
                </Reveal>
            )}
        </div>
    );
}
