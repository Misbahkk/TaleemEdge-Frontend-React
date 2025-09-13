import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { AboutOrganization } from "@/components/landing/about-organization"
import { Features } from "@/components/landing/features"
import { Team } from "@/components/landing/team"
import { Testimonials } from "@/components/landing/testimonials"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white w-full">
      <Navbar />
      <main className="w-full">
        <Hero />
        <AboutOrganization />
        <Features />
        <Team />
        <Testimonials />
        <Footer />
      </main>
    </div>
  )
}
