import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { ImageEditor } from "@/components/image-editor"
import { Pricing } from "@/components/pricing"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <ImageEditor />
      <Pricing />
    </main>
  );
}
