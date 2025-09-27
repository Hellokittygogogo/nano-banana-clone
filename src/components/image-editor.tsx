"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, Wand2, Download, RotateCw, Sparkles } from "lucide-react"
import Image from "next/image"

export function ImageEditor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [editedImage, setEditedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string)
        setEditedImage(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEdit = async () => {
    if (!originalImage || !prompt.trim()) return

    setIsProcessing(true)

    // Simulate AI processing
    setTimeout(() => {
      // For demo purposes, we'll just copy the original image
      // In a real app, this would call your AI API
      setEditedImage(originalImage)
      setIsProcessing(false)
    }, 3000)
  }

  const handleDownload = () => {
    if (!editedImage) return

    const link = document.createElement('a')
    link.href = editedImage
    link.download = 'nano-banana-edited.png'
    link.click()
  }

  return (
    <section id="editor" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Try the{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Editor
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl text-foreground/80 max-w-2xl mx-auto"
          >
            Upload an image and describe the changes you want to see
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload/Original Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold mb-4">Original Image</h3>

              {!originalImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-primary transition-colors bg-muted/20"
                >
                  <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Upload an image</p>
                  <p className="text-foreground/60">Drag and drop or click to select</p>
                  <p className="text-sm text-foreground/40 mt-2">PNG, JPG up to 10MB</p>
                </div>
              ) : (
                <div className="relative group">
                  <Image
                    src={originalImage}
                    alt="Original"
                    width={400}
                    height={256}
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Upload className="h-8 w-8 text-white" />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </motion.div>

            {/* Edited Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold mb-4">AI Edited Result</h3>

              <div className="border border-border rounded-2xl p-12 text-center bg-muted/20 h-64 flex items-center justify-center">
                {isProcessing ? (
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-lg font-medium">Processing...</p>
                    <p className="text-foreground/60">AI is working its magic</p>
                  </div>
                ) : editedImage ? (
                  <div className="relative group w-full h-full">
                    <Image
                      src={editedImage}
                      alt="Edited"
                      width={400}
                      height={256}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      onClick={handleDownload}
                      className="absolute top-4 right-4 bg-primary text-primary-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Sparkles className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                    <p className="text-foreground/60">Edited image will appear here</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Prompt Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 space-y-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the changes you want to make... (e.g., 'Change the background to a sunset beach scene')"
                  className="w-full p-4 border border-border rounded-2xl bg-background/50 backdrop-blur-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <button
                onClick={handleEdit}
                disabled={!originalImage || !prompt.trim() || isProcessing}
                className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8 py-4 rounded-2xl font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                {isProcessing ? (
                  <>
                    <RotateCw className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" />
                    <span>Transform</span>
                  </>
                )}
              </button>
            </div>

            {/* Example Prompts */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-foreground/60">Try:</span>
              {[
                "Add a sunset background",
                "Change to winter scene",
                "Make it look like a painting",
                "Add magical sparkles"
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-sm bg-muted hover:bg-muted/80 text-foreground/70 px-3 py-1 rounded-full transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}