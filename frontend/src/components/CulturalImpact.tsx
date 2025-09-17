import React from 'react';
import { Globe, Heart, MapPin, Users, BookOpen, Mic } from 'lucide-react';

const CulturalImpact = () => {
  const languages = [
    { name: 'Hindi', users: '2,340', satisfaction: '94%' },
    { name: 'Tamil', users: '1,890', satisfaction: '92%' },
    { name: 'Telugu', users: '1,650', satisfaction: '96%' },
    { name: 'Bengali', users: '1,420', satisfaction: '91%' },
    { name: 'Marathi', users: '1,200', satisfaction: '93%' },
    { name: 'Gujarati', users: '980', satisfaction: '95%' },
    { name: 'Kannada', users: '870', satisfaction: '92%' },
    { name: 'Malayalam', users: '760', satisfaction: '94%' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bridging Cultures, Healing Hearts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mental health support that understands and respects cultural diversity across India
          </p>
        </div>

        {/* Vernacular Healing Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <Mic className="w-8 h-8 text-orange-600 mr-3" />
                  <h3 className="text-3xl font-bold text-gray-900">Vernacular Healing Initiative</h3>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <Globe className="w-6 h-6 text-orange-600 mt-1" />
                    <p className="text-gray-700">Platform content developed in 8 regional languages</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Heart className="w-6 h-6 text-red-600 mt-1" />
                    <p className="text-gray-700">Traditional wellness practices integrated with modern therapy</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <BookOpen className="w-6 h-6 text-blue-600 mt-1" />
                    <p className="text-gray-700">Local cultural metaphors used in coping strategies</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <blockquote className="text-lg italic text-gray-800 mb-4">
                    "Feeling understood in my mother tongue helped me open up completely. The counselor used familiar stories and examples that made therapy feel natural."
                  </blockquote>
                  <div className="text-sm text-gray-600">- Anonymous Student, Rural Tamil Nadu</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {languages.map((lang, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-md">
                    <h4 className="font-semibold text-gray-900 mb-2">{lang.name}</h4>
                    <div className="text-sm text-gray-600 mb-1">{lang.users} active users</div>
                    <div className="text-sm font-medium text-green-600">{lang.satisfaction} satisfaction</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rural Campus Transformation */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Rural Campus Transformation
              </h3>
              <p className="text-lg text-gray-600">
                Bridging the Urban-Rural Mental Health Gap
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Telemedicine Access</h4>
                <p className="text-gray-600">Remote colleges connected to specialists via secure video calls</p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Peer Networks</h4>
                <p className="text-gray-600">Students connected across geographical barriers for support</p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Specialized Modules</h4>
                <p className="text-gray-600">Agricultural stress-specific content for farming community students</p>
              </div>
            </div>

            <div className="mt-12 bg-white rounded-xl p-8 shadow-lg">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">Rural Impact Metrics</h4>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">200%</div>
                  <div className="text-sm text-gray-600">Increase in Mental Health Awareness</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
                  <div className="text-sm text-gray-600">Rural Colleges Connected</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">89%</div>
                  <div className="text-sm text-gray-600">Student Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">45%</div>
                  <div className="text-sm text-gray-600">Reduction in Academic Stress</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cultural Integration Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Traditional Practices</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• Yoga and meditation in regional styles</li>
              <li>• Ayurvedic wellness principles</li>
              <li>• Local breathing techniques</li>
              <li>• Cultural storytelling therapy</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Regional Festivals</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• Festival-specific stress management</li>
              <li>• Cultural celebration integration</li>
              <li>• Community bonding activities</li>
              <li>• Traditional music therapy</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Family Dynamics</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• Joint family counseling approaches</li>
              <li>• Intergenerational communication</li>
              <li>• Cultural expectation management</li>
              <li>• Regional family therapy models</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CulturalImpact;