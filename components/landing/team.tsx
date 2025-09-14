"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Linkedin, Mail, Github, MapPin, Calendar, Briefcase } from "lucide-react";

export function Team() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
const isDevelopment = process.env.NODE_ENV === 'development'
const myBaseUrl = isDevelopment ? process.env.NEXT_PUBLIC_API_BASE_URL_LOCAL : process.env.NEXT_PUBLIC_API_BASE_URL_DEPLOY


  // Fetch mentors from API
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${myBaseUrl}}/mentore/student/mentors/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // Show only first 3 mentors for homepage
        setMentors(data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching mentors:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="py-20 px-4 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Our <span className="text-green-600">Expert Mentors</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with industry professionals who are ready to guide your learning journey
            </p>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex flex-col items-center pt-6 pb-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="px-6 pb-6">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-2/3 mx-auto"></div>
                  <div className="h-12 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="flex space-x-3 justify-center">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 px-4 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to load mentors</h3>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gray-50 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Meet Our <span className="text-green-600">Expert Mentors</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with industry professionals who are ready to guide your learning journey
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="mb-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative mt-3">
                  <div className='w-24 h-24 ml-3 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300'>
                     <Image
                    src={mentor.profile_picture_url || "/placeholder.svg?height=300&width=300"}
                    alt={mentor.full_name}
                    width={100}
                    height={100}
                    className="w-24 h-24 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=300&width=300";
                    }}
                  />
                  </div>
                 
                  {/* Experience badge */}
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-1 py-1 rounded-full text-sm font-medium">
                    {Math.abs(mentor.years_of_experience)} years
                  </div>
                </div>
                
                <div className="pl-5 m-1">
                  <h4 className="text-xl font-semibold mb-1 group-hover:text-green-600 transition-colors">
                    {mentor.full_name}
                  </h4>
                  
                  <div className="flex items-center text-green-600 font-medium mb-1">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {mentor.job_title}
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-1">{mentor.company}</p>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    {mentor.location}
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Available: {mentor.availability}
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-1 text-sm line-clamp-3">
                    {mentor.bio}
                  </p>
                  
                  {/* Expertise Areas */}
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Expertise:</p>
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise_areas_list.slice(0, 3).map((area, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                        >
                          {area}
                        </span>
                      ))}
                      {mentor.expertise_areas_list.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          +{mentor.expertise_areas_list.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Languages */}
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Languages:</p>
                    <div className="flex flex-wrap gap-1">
                      {mentor.languages_list.map((language, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Social Links */}
                  <div className="flex space-x-3">
                    <button className="p-2 bg-gray-100 rounded-full hover:bg-green-100 hover:text-green-600 transition-colors">
                      <Mail className="h-4 w-4" />
                    </button>
                    {mentor.linkedin_profile && (
                      <a
                        href={mentor.linkedin_profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-800 hover:text-white transition-colors">
                      <Github className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Mentors Button */}
        <div className="text-center mb-16">
          <button className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors font-medium">
            View All Mentors
          </button>
        </div>

        {/* Join Us CTA */}
        <div className="text-center">
          <div className="bg-green-600 rounded-2xl p-8 text-white">
            <h1 className="text-2xl font-bold mb-4">Ready to Transform Your Learning?</h1>
            <p className="text-lg mb-6 opacity-90">
              Connect with expert mentors and accelerate your career growth
            </p>
            <button className="bg-white text-green-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors font-medium">
              Find Your Mentor Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}