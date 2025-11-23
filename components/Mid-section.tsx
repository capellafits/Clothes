"use client"

import { useRef } from "react"
import Image from "next/image"
import { Recycle, CheckCircle2, Leaf, Heart } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function MidSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftCardRef = useRef<HTMLDivElement>(null)
  const topRightRef = useRef<HTMLDivElement>(null)
  const bottomRightRef = useRef<HTMLDivElement>(null)

  // Parallax for main container
  const { scrollYProgress: mainProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Individual card parallax
  const { scrollYProgress: leftProgress } = useScroll({
    target: leftCardRef,
    offset: ["start end", "end start"]
  })

  const { scrollYProgress: topRightProgress } = useScroll({
    target: topRightRef,
    offset: ["start end", "end start"]
  })

  const { scrollYProgress: bottomRightProgress } = useScroll({
    target: bottomRightRef,
    offset: ["start end", "end start"]
  })

  // Transform scroll progress to Y values for parallax
  const leftImageY = useTransform(leftProgress, [0, 1], [100, -100])
  const topRightImageY = useTransform(topRightProgress, [0, 1], [80, -80])
  const bottomRightImageY = useTransform(bottomRightProgress, [0, 1], [60, -60])
  const titleY = useTransform(mainProgress, [0, 1], [50, -50])

  return (
    <main className="min-h-screen bg-[#f2efe8] px-4 py-12 md:py-16 lg:py-20" ref={containerRef}>
      <div className="mx-auto max-w-7xl">
        {/* Header Section with Parallax */}
        <motion.div 
          style={{ y: titleY }}
          className="mb-12 text-center md:mb-16 lg:mb-20"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-2 text-4xl font-bold tracking-tight text-[#1a1c18] md:text-5xl lg:text-6xl xl:text-7xl"
          >
            Why Your Style
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="font-serif text-3xl tracking-wide text-[#3e3e3e] md:text-4xl lg:text-5xl xl:text-6xl"
          >
            Deserves the Best
          </motion.p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {/* Left Card - Proven Quality with Background Image */}
          <motion.div 
            ref={leftCardRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative flex flex-col justify-end overflow-hidden rounded-3xl shadow-lg md:row-span-2 hover:shadow-2xl transition-shadow duration-300 min-h-[600px] md:min-h-[800px]"
          >
            {/* Background Image with Parallax */}
            <motion.div
              style={{ y: leftImageY }}
              className="absolute inset-0 w-full h-[120%]"
            >
              <Image
                src="/Bottle.svg"
                alt="Person wearing blue graphic t-shirt"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
            </motion.div>

            {/* Content Overlay */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative z-10 flex flex-col gap-4 p-6 md:p-8 lg:p-10 text-white"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-white" />
                <h2 className="text-2xl font-semibold text-white lg:text-3xl">Proven</h2>
              </div>
              <p className="font-serif text-xl italic text-white/90 lg:text-2xl">Quality</p>
              <p className="text-sm leading-relaxed text-white/80 md:text-base max-w-md">
                Every piece is designed with precision and made to last — timeless, effortless, you
              </p>
            </motion.div>
          </motion.div>

          {/* Top Right Card - Eco-Friendly Fabrics with Background */}
          <motion.div 
            ref={topRightRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 min-h-[350px] md:min-h-[380px]"
          >
            {/* Background Image with Parallax */}
            <motion.div
              style={{ y: topRightImageY }}
              className="absolute inset-0 w-full h-[120%]"
            >
              <Image
                src="/Image.svg"
                alt="Person wearing eco-friendly fabric shirt"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-[#e6e7e8]/95 via-[#e6e7e8]/80 to-transparent" />
            </motion.div>

            {/* Content Overlay */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative z-10 flex flex-col justify-center gap-4 p-6 md:p-8 lg:p-10 h-full"
            >
              <Recycle className="h-8 w-8 text-[#1a1c18]" />
              <h2 className="text-2xl font-semibold text-[#1a1c18] lg:text-3xl">Eco-Friendly</h2>
              <p className="font-serif text-xl italic text-[#1a1c18] lg:text-2xl">Fabrics</p>
              <p className="text-sm leading-relaxed text-[#3e3e3e] md:text-base max-w-sm">
                Eco-friendly materials designed to care for the planet as much
              </p>
            </motion.div>
          </motion.div>

          {/* Bottom Right Card - 100% Ethical with Background */}
          <motion.div 
            ref={bottomRightRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 min-h-[350px] md:min-h-[380px]"
          >
            {/* Background Image with Parallax */}
            <motion.div
              style={{ y: bottomRightImageY }}
              className="absolute inset-0 w-full h-[120%]"
            >
              <Image
                src="/Background.svg"
                alt="Person wearing ethically made purple shirt"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-tl from-[#252525]/95 via-[#252525]/85 to-transparent" />
            </motion.div>

            {/* Content Overlay */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="relative z-10 flex flex-col justify-center gap-4 p-6 md:p-8 lg:p-10 h-full"
            >
              <h2 className="text-2xl font-semibold text-white lg:text-3xl">100% Ethical</h2>
              <p className="font-serif text-xl italic text-[#e6e7e8] lg:text-2xl">100% You</p>
              <div className="flex flex-col gap-3 text-sm text-[#e6e7e8] md:text-base">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2"
                >
                  <Leaf className="h-5 w-5" />
                  <span>No Fast Fashion</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2"
                >
                  <Recycle className="h-5 w-5" />
                  <span>Sustainably Sourced</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2"
                >
                  <Heart className="h-5 w-5" />
                  <span>Made with Love</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
