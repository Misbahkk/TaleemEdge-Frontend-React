import Image from "next/image"
import { BookOpen, Video, Users, Award, MessageCircle, Calendar, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: MessageCircle,
    title: "AI Chatbot",
    description: "Get instant answers and learning support 24/7 with our intelligent assistant",
    color: "bg-purple-100 text-purple-600",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    icon: BookOpen,
    title: "Virtual Library",
    description: "Access thousands of books and educational resources in our digital library",
    color: "bg-blue-100 text-blue-600",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    icon: Video,
    title: "Video Resources",
    description: "Curated YouTube content and educational videos from top educators",
    color: "bg-red-100 text-red-600",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    icon: Users,
    title: "Mentorship Programs",
    description: "Connect with industry experts and experienced mentors for guidance",
    color: "bg-green-100 text-green-600",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    icon: Award,
    title: "Scholarships",
    description: "Discover and apply for educational scholarships and funding opportunities",
    color: "bg-yellow-100 text-yellow-600",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    icon: Calendar,
    title: "Workshops",
    description: "Join interactive workshops and skill-building sessions with experts",
    color: "bg-indigo-100 text-indigo-600",
    image: "/placeholder.svg?height=300&width=400",
  },
]

const benefits = [
  "Personalized learning paths",
  "24/7 AI-powered support",
  "Industry expert mentorship",
  "Comprehensive resource library",
  "Interactive workshops",
  "Scholarship opportunities",
]

export function Features() {
  return (
    <section className="py-20 px-4 bg-gray-50 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to <span className="text-green-600">Excel</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Comprehensive tools and resources designed to support your educational journey from start to finish
          </p>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-center bg-white p-3 rounded-lg shadow-sm">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } flex flex-col lg:flex-row`}
            >
              <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 group-hover:text-green-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <Button variant="ghost" className="self-start text-green-600 hover:text-green-700 p-0">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="lg:w-1/2 relative">
                <Image
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.title}
                  width={400}
                  height={300}
                  className="w-full h-64 lg:h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-green-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Learning?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who are already succeeding with Taleem Edge
          </p>
          <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-full">
            Start Your Journey Today
          </Button>
        </div>
      </div>
    </section>
  )
}
