"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Zap, Crown, Star, ChevronDown } from "lucide-react"

const pricingPlans = [
  {
    name: "Basic",
    description: "Perfect for individuals getting started",
    monthlyPrice: 9.99,
    yearlyPrice: 96,
    credits: 100,
    badge: null,
    features: [
      "100 high-quality images/month",
      "All style templates",
      "Standard generation speed",
      "Basic customer support",
      "JPG/PNG format downloads",
      "Commercial Use License (yearly only)"
    ],
    buttonText: "Start Basic",
    popular: false
  },
  {
    name: "Pro",
    description: "Most popular for professionals",
    monthlyPrice: 19.99,
    yearlyPrice: 192,
    credits: 500,
    badge: "Most Popular",
    features: [
      "500 high-quality images/month",
      "All style templates",
      "Priority generation queue",
      "Priority support",
      "JPG/PNG/WebP formats",
      "Batch generation",
      "Commercial Use License (yearly only)"
    ],
    buttonText: "Go Pro",
    popular: true
  },
  {
    name: "Max",
    description: "Enterprise level with premium features",
    monthlyPrice: 49.99,
    yearlyPrice: 480,
    credits: 2000,
    badge: "Best Value",
    features: [
      "2000 high-quality images/month",
      "All style templates",
      "Fastest generation speed",
      "Dedicated account manager",
      "All format downloads",
      "Batch generation",
      "Professional editing suite (coming soon)",
      "Commercial Use License (yearly only)"
    ],
    buttonText: "Go Max",
    popular: false
  }
]

const creditPacks = [
  { credits: 50, price: 4.99, value: "Great for testing" },
  { credits: 200, price: 15.99, value: "Most popular" },
  { credits: 500, price: 34.99, value: "Best value" },
  { credits: 1000, price: 59.99, value: "Enterprise" }
]

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const [showCreditPacks, setShowCreditPacks] = useState(false)

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800 rounded-full px-6 py-2 mb-8"
          >
            <span className="text-2xl">🍌</span>
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Limited Time: Save 20% with Annual Billing</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Choose Your{" "}
            <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-foreground/80 max-w-2xl mx-auto"
          >
            Transform unlimited images with our AI-powered editor. Start free, upgrade anytime.
          </motion.p>
        </div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-muted rounded-full p-1 flex items-center">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                !isYearly
                  ? "bg-background text-foreground shadow-md"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                isYearly
                  ? "bg-background text-foreground shadow-md"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-2 py-1 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.8, duration: 0.8 }}
              className={`relative bg-background/50 backdrop-blur-sm border rounded-3xl p-8 ${
                plan.popular
                  ? "border-orange-200 dark:border-orange-800 shadow-xl scale-105"
                  : "border-border hover:border-orange-200 dark:hover:border-orange-800"
              } transition-all duration-300 hover:shadow-lg`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    {plan.popular && <Star className="h-4 w-4" />}
                    <span>{plan.badge}</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-foreground/60 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-foreground/60 ml-2">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                  {isYearly && (
                    <div className="text-sm text-foreground/60 mt-2">
                      ${(plan.monthlyPrice * 12).toFixed(2)} billed annually
                    </div>
                  )}
                </div>

                <button className={`w-full py-3 px-6 rounded-full font-semibold transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:opacity-90"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}>
                  {plan.buttonText}
                </button>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Credit Packs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center"
        >
          <button
            onClick={() => setShowCreditPacks(!showCreditPacks)}
            className="inline-flex items-center space-x-2 text-lg font-semibold text-foreground/80 hover:text-foreground transition-colors"
          >
            <span>Or buy credits without subscription</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${showCreditPacks ? "rotate-180" : ""}`} />
          </button>

          {showCreditPacks && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {creditPacks.map((pack, index) => (
                <div
                  key={index}
                  className="bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-orange-200 dark:hover:border-orange-800 transition-all hover:shadow-lg"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{pack.credits} Credits</div>
                    <div className="text-3xl font-bold text-orange-500 mb-2">${pack.price}</div>
                    <div className="text-sm text-foreground/60 mb-4">{pack.value}</div>
                    <button className="w-full py-2 px-4 bg-muted hover:bg-muted/80 text-foreground rounded-full font-medium transition-colors">
                      Buy Credits
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-foreground/60 mb-6">
            All plans include our commercial use license and 30-day money-back guarantee
          </p>
          <div className="flex justify-center space-x-8 text-sm text-foreground/60">
            <span>💳 Credit/Debit Cards</span>
            <span>📱 Apple Pay</span>
            <span>🛒 Google Pay</span>
            <span>💰 Alipay</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}