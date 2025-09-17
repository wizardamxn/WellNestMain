import React from 'react';
import { Heart, Shield, Users, Clock, Globe, TrendingUp } from 'lucide-react';

const InspiringSection = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16">
      {/* Breaking Barriers Section */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Breaking Barriers, Building Hope
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Technology eliminating traditional barriers to mental health support
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <Clock className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Instant Access</h3>
            <p className="text-gray-600">No more waiting weeks for appointments. Get support when you need it most.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <Shield className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Stigma-Free</h3>
            <p className="text-gray-600">No fear of judgment. Confidential support in a safe, private environment.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <Heart className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600">Available during 3 AM anxiety attacks or pre-exam stress moments.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <Globe className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Cultural Context</h3>
            <p className="text-gray-600">Mental health support in your native language, understanding your culture.</p>
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-6">Every Student Deserves Peace of Mind</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Fundamental Right</h3>
              <p className="opacity-90">Mental wellness in education is not a luxury—it's a necessity for every student's success.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Academic Excellence</h3>
              <p className="opacity-90">Mental health and academic performance go hand-in-hand. One supports the other.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Wellness Priority</h3>
              <p className="opacity-90">Creating campuses where seeking help is as normal as visiting the library.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            From Isolation to Connection
          </h2>
          <p className="text-xl text-gray-600">The ripple effect of mental wellness in our community</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Users className="w-8 h-8 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Peer Support Networks</h3>
                  <p className="text-gray-600">One student's recovery inspires their entire friend group, creating lasting support systems.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <TrendingUp className="w-8 h-8 text-green-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Future Leaders</h3>
                  <p className="text-gray-600">Building emotionally intelligent leaders who will transform workplaces and communities.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Heart className="w-8 h-8 text-red-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Academic Success</h3>
                  <p className="text-gray-600">Reducing dropout rates and improving academic outcomes through mental wellness.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Impact Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Academic Performance Improvement</span>
                <span className="text-2xl font-bold text-blue-600">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sleep Quality Enhancement</span>
                <span className="text-2xl font-bold text-green-600">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Social Participation Increase</span>
                <span className="text-2xl font-bold text-purple-600">67%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Crisis Interventions</span>
                <span className="text-2xl font-bold text-red-600">47</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InspiringSection;