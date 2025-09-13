import Image from "next/image"
import { Heart, Users, BookOpen, Target } from "lucide-react"

export function AboutOrganization() {
  return (
    <section className="py-20 px-4 bg-white w-full">
      <div className="max-w-7xl mx-auto">
        {/* Organization Introduction */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full mr-4">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              About <span className="text-green-600">Rah e Illahi</span>
            </h2>
          </div>

          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Rah e Illahi is a dedicated nonprofit organization committed to empowering students through comprehensive
            educational support and development programs. Our mission is to bridge the gap between academic learning and
            practical skill development, ensuring every student has access to quality resources, mentorship, and
            opportunities for growth.
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 text-left">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed text-left">
                We believe that education is the cornerstone of personal and societal development. Through Taleem Edge,
                we provide students with innovative tools, expert guidance, and comprehensive resources to excel in
                their academic journey and prepare for successful careers.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">500+</div>
                  <div className="text-sm text-gray-600">Students Helped</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-gray-600">Programs Offered</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-green-100 rounded-2xl p-8">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Rah e Illahi organization activities"
                  width={500}
                  height={400}
                  className="rounded-xl shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
            <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-3">Excellence</h4>
            <p className="text-gray-600">
              We strive for excellence in everything we do, ensuring the highest quality of educational support and
              resources.
            </p>
          </div>

          <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-3">Community</h4>
            <p className="text-gray-600">
              Building a supportive community where students can learn, grow, and succeed together.
            </p>
          </div>

          <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-100">
            <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-3">Impact</h4>
            <p className="text-gray-600">
              Creating meaningful impact in students' lives through accessible education and mentorship programs.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
