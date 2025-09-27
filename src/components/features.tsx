"use client"

import { motion } from "framer-motion"
import {
  Zap,
  Brain,
  Image as ImageIcon,
  Palette,
  Clock,
  Users,
  CheckCircle,
  X
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Advanced AI Technology",
    description: "1M token context window with multimodal understanding for precise image transformations"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Transform images in just 3-8 seconds with our optimized AI processing pipeline"
  },
  {
    icon: Palette,
    title: "Creative Control",
    description: "Natural language prompts give you precise control over every aspect of your image"
  },
  {
    icon: ImageIcon,
    title: "Character Consistency",
    description: "Maintain character integrity across multiple edits and scene transformations"
  },
  {
    icon: Clock,
    title: "One-Shot Editing",
    description: "Get perfect results on the first try without multiple iterations"
  },
  {
    icon: Users,
    title: "Batch Processing",
    description: "Edit multiple images simultaneously with consistent style and quality"
  }
]

const comparison = [
  {
    feature: "Processing Speed",
    nanobanana: "3-8 seconds",
    competitor: "30-60 seconds",
    winner: true
  },
  {
    feature: "Character Consistency",
    nanobanana: "99% accuracy",
    competitor: "75% accuracy",
    winner: true
  },
  {
    feature: "Context Understanding",
    nanobanana: "1M tokens",
    competitor: "4K tokens",
    winner: true
  },
  {
    feature: "One-Shot Success",
    nanobanana: "95% first try",
    competitor: "60% first try",
    winner: true
  },
  {
    feature: "Batch Processing",
    nanobanana: "✓ Available",
    competitor: "✗ Limited",
    winner: true
  }
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Grid */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Nano Banana?
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl text-foreground/80 max-w-2xl mx-auto"
          >
            Experience the next generation of AI-powered image editing with unmatched speed and precision
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              See How We{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Compare
              </span>
            </h3>
            <p className="text-foreground/80">Nano Banana vs. Traditional AI Image Editors</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-semibold">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold">
                    <div className="flex items-center justify-center space-x-2">
                      <span>🍌</span>
                      <span>Nano Banana</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground/60">
                    Competitors
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="border-b border-border/50"
                  >
                    <td className="py-4 px-6 font-medium">{item.feature}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="font-semibold text-primary">{item.nanobanana}</span>
                        {item.winner && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-foreground/60">{item.competitor}</span>
                        <X className="h-4 w-4 text-red-500" />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}