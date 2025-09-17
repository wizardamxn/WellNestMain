import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, TrendingUp, Moon, Users } from 'lucide-react';

const SuccessStories = () => {
  const [currentStory, setCurrentStory] = useState(0);

  const stories = [
    {
      id: 1,
      name: "Rahul",
      background: "Engineering Student, Rural Background",
      challenge: "Severe academic anxiety, considering dropping out",
      intervention: "AI chat for coping strategies, counselor sessions, stress management resources",
      outcome: "GPA improved from 4.2 to 7.8, completed degree successfully",
      quote: "I learned that asking for help isn't weakness - it's smart planning",
      icon: TrendingUp,
      color: "blue",
      metrics: "78% of students saw improved academic performance"
    },
    {
      id: 2,
      name: "Priya",
      background: "Medical Student with Chronic Insomnia",
      challenge: "2-3 hours sleep nightly, affecting concentration and health",
      intervention: "Sleep hygiene modules, relaxation audio in Hindi, peer support group",
      outcome: "Achieved 6-7 hours regular sleep, better clinical performance",
      quote: "The guided meditation in my mother tongue made all the difference",
      icon: Moon,
      color: "purple",
      metrics: "85% improvement in sleep quality scores"
    },
    {
      id: 3,
      name: "Arjun",
      background: "Computer Science Student with Social Anxiety",
      challenge: "Couldn't participate in class, avoided group projects",
      intervention: "Social skills modules, peer chat support, gradual exposure techniques",
      outcome: "Became class representative, led tech fest organizing committee",
      quote: "The anonymous peer support gave me courage to practice social skills",
      icon: Users,
      color: "green",
      metrics: "67% of socially anxious students reported increased participation"
    }
  ];

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const story = stories[currentStory];
  const IconComponent = story.icon;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Real Stories, Real Impact
          </h2>
          <p className="text-xl text-gray-600">
            Transforming lives through accessible mental health support
          </p>
        </div>

        <div className="relative">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={prevStory}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex space-x-2">
                {stories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStory(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentStory ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextStory}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${story.color}-100 mb-6`}>
                  <IconComponent className={`w-8 h-8 text-${story.color}-600`} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{story.name}</h3>
                <p className="text-gray-600 mb-4">{story.background}</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-600 mb-1">Challenge:</h4>
                    <p className="text-gray-700">{story.challenge}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-1">Intervention:</h4>
                    <p className="text-gray-700">{story.intervention}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-600 mb-1">Outcome:</h4>
                    <p className="text-gray-700">{story.outcome}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8">
                <div className="flex items-start space-x-3 mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-lg text-gray-800 italic mb-6">
                  "{story.quote}"
                </blockquote>
                
                <div className={`bg-${story.color}-50 rounded-lg p-4`}>
                  <h4 className="font-semibold text-gray-900 mb-2">Impact Metric:</h4>
                  <p className={`text-${story.color}-700 font-medium`}>{story.metrics}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Impact Statistics */}
        <div className="mt-16 grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">3,000+</div>
            <div className="text-gray-600">Students Supported</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">40%</div>
            <div className="text-gray-600">Reduction in Severe Anxiety</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">300%</div>
            <div className="text-gray-600">Increase in Help-Seeking</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">25%</div>
            <div className="text-gray-600">Reduction in Dropouts</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;