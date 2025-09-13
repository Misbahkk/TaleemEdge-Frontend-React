"use client"

import Image from "next/image"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"

const testimonials = [
  {
    name: "Dr. Amina Hassan",
    role: "Dean of Academic Affairs",
    university: "FAST University",
    content:
      "Taleem Edge has revolutionized how our students access learning resources. The platform's comprehensive approach to education support has significantly improved our students' academic outcomes.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Prof. Ahmed Malik",
    role: "Vice Chancellor",
    university: "NED University",
    content:
      "We've partnered with Taleem Edge to enhance our digital learning infrastructure. The mentorship programs and AI-powered tools have become integral to our educational ecosystem.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Dr. Fatima Zahra",
    role: "Director of Student Services",
    university: "Aga Khan University",
    content:
      "The scholarship database and career guidance features have helped hundreds of our students find funding opportunities and career paths they wouldn't have discovered otherwise.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Prof. Muhammad Tariq",
    role: "Head of Innovation",
    university: "IBA Karachi",
    content:
      "Taleem Edge's workshop platform has enabled us to extend our reach beyond campus. We can now offer specialized training programs to students nationwide.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Dr. Sarah Khan",
    role: "Academic Director",
    university: "COMSATS University",
    content:
      "The platform's analytics help us track student engagement and learning outcomes. It's become an essential tool for our academic planning and student success initiatives.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Prof. Omar Rehman",
    role: "Provost",
    university: "LUMS",
    content:
      "Taleem Edge bridges the gap between traditional education and modern learning needs. Our collaboration has enhanced both teaching quality and student satisfaction.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
]

export function Testimonials() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -420, // card width + gap
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 420, // card width + gap
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="py-20 px-4 bg-white w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What <span className="text-green-600">Organizations</span> Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted by leading educational institutions across the country
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">50+</div>
              <div className="text-sm text-gray-600">Partner Universities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">4.8/5</div>
              <div className="text-sm text-gray-600">Institution Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">98%</div>
              <div className="text-sm text-gray-600">Partnership Renewal</div>
            </div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Left Arrow Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-green-50 transition-all duration-200 group"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-green-600" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-green-50 transition-all duration-200 group"
            aria-label="Next testimonials"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-green-600" />
          </button>

          <div className="overflow-x-auto scrollbar-hide mx-12" ref={scrollContainerRef}>
            <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="group bg-green-50 p-8 rounded-2xl border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative flex-shrink-0"
                  style={{ width: '400px', minWidth: '400px' }}
                >
                  <Quote className="absolute top-4 right-4 h-8 w-8 text-green-200" />

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>

                  <div className="flex items-center">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="rounded-full mr-4 border-2 border-green-100"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-xs text-green-600 font-medium">{testimonial.university}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Scroll Indicator */}
          {/* <div className="flex justify-center mt-4">
            <p className="text-sm text-gray-500">Use arrow buttons or scroll to see more testimonials</p>
          </div> */}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-green-100 rounded-2xl p-8 inline-block">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Partner With Us?</h3>
            <p className="text-gray-600 mb-6">
              Join leading educational institutions that trust Taleem Edge for their students' success
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors">
                Become a Partner
              </button>
              <button className="border border-green-600 text-green-600 px-8 py-3 rounded-full hover:bg-green-50 transition-colors">
                View Case Studies
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
