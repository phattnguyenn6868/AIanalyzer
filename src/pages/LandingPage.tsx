import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Upload, BarChart3, Target, Shield, Zap, Check, Star, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AuthModal } from '../components/auth/AuthModal';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const features = [
    {
      icon: <Target className="w-12 h-12 text-red-500" />,
      title: 'Punch Analytics',
      description: 'Track speed, type, volume, and accuracy of every punch thrown during training sessions.',
    },
    {
      icon: <Shield className="w-12 h-12 text-red-500" />,
      title: 'Defensive Analysis',
      description: 'Analyze guard positioning, head movement, and defensive effectiveness in real-time.',
    },
    {
      icon: <Zap className="w-12 h-12 text-red-500" />,
      title: 'Footwork & Stance Tracking',
      description: 'Monitor stance, movement patterns, and ring positioning for optimal performance.',
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-red-500" />,
      title: 'Actionable Insights',
      description: 'Get AI-powered recommendations to improve your technique and strategy instantly.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Upload Your Video',
      description: 'Simply drag and drop your training or sparring footage. Videos up to 3 minutes supported.',
      icon: <Upload className="w-8 h-8 text-red-500" />,
    },
    {
      number: '02',
      title: 'AI Analyzes',
      description: 'Our advanced AI processes your video and identifies key performance metrics.',
      icon: <BarChart3 className="w-8 h-8 text-red-500" />,
    },
    {
      number: '03',
      title: 'Get Your Report',
      description: 'Receive detailed insights and actionable recommendations to improve your game.',
      icon: <Target className="w-8 h-8 text-red-500" />,
    },
  ];

  const plans = [
    {
      name: 'Free Trial',
      price: 0,
      interval: 'forever',
      features: [
        '5 video analyses',
        'Basic performance metrics',
        'Fighter identification',
        'Core technique insights',
        'Video up to 3 minutes',
      ],
      uploadsLimit: 5,
      popular: false,
    },
    {
      name: 'Pro',
      price: 29,
      interval: 'month',
      features: [
        '60 video analyses per month',
        'Advanced performance metrics',
        'Detailed technique breakdown',
        'Progress tracking over time',
        'Export detailed reports',
        'Priority support',
        'Advanced AI insights',
      ],
      uploadsLimit: 60,
      popular: true,
    },
  ];

  const testimonials = [
    {
      name: 'Marcus Rodriguez',
      role: 'Professional Boxer',
      content: 'ShadowBox AI helped me identify weaknesses in my defense that my coach and I missed. The insights are incredibly detailed and actionable.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'Sarah Chen',
      role: 'Boxing Coach',
      content: 'This tool has revolutionized how I analyze my fighters. The data-driven approach gives us a competitive edge in training.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'Tommy Williams',
      role: 'Amateur Boxer',
      content: 'As someone training for my first competition, the feedback has been invaluable for improving my technique and confidence.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-red-800/20 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.1),transparent_50%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Analyze Your Fight.
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent">
                Unleash Your Potential.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Get AI-powered feedback on your boxing technique from video analysis. 
              Identify strengths, weaknesses, and areas for improvement with precision that rivals professional coaching.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="text-lg px-10 py-4 bg-red-600 hover:bg-red-700 transform hover:scale-105 transition-all duration-200">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg" 
                  className="text-lg px-10 py-4 bg-red-600 hover:bg-red-700 transform hover:scale-105 transition-all duration-200"
                  onClick={() => setShowAuthModal(true)}
                >
                  Start Your Free Analysis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
              <Button variant="outline" size="lg" className="text-lg px-10 py-4 border-gray-600 hover:border-red-500 hover:bg-red-500/10">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            <p className="text-gray-400 text-sm mt-6">
              No credit card required • 5 free analyses • Instant setup
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Powerful Features for
              <span className="text-red-500"> Elite Performance</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our AI analyzes every aspect of your boxing technique to provide comprehensive insights that help you train smarter, not harder.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center p-8 bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:border-red-500/50 transition-all duration-300">
                <div className="mb-6 flex justify-center transform hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              How It <span className="text-red-500">Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get professional-level analysis in three simple steps. No technical expertise required.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-red-500 to-transparent transform translate-x-4"></div>
                )}
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-2xl font-bold mb-8 mx-auto shadow-lg shadow-red-500/25">
                  {step.number}
                </div>
                <div className="mb-6 flex justify-center">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-6 text-white">{step.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Choose Your <span className="text-red-500">Plan</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start with our free trial and upgrade when you're ready for more advanced features and unlimited analyses.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative p-8 ${plan.popular ? 'border-red-500 ring-2 ring-red-500/20 bg-gradient-to-b from-red-950/20 to-gray-900' : 'bg-gray-900/50 border-gray-800'} backdrop-blur-sm`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-white">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-400 text-lg">/{plan.interval}</span>
                  </div>
                  <p className="text-gray-400 text-lg">{plan.uploadsLimit} video analyses</p>
                </div>
                
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-red-500 mr-4 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-4 text-lg font-semibold ${plan.popular ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'}`}
                  onClick={() => !user && setShowAuthModal(true)}
                >
                  {plan.price === 0 ? 'Start Free Trial' : 'Go Pro'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              What Fighters <span className="text-red-500">Say</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of boxers and coaches who are already using AI to improve their technique.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:border-red-500/50 transition-all duration-300">
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-8 italic text-lg leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-red-900 via-red-700 to-red-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">
            Ready to Transform Your Training?
          </h2>
          <p className="text-xl mb-12 text-red-100 max-w-3xl mx-auto leading-relaxed">
            Join thousands of fighters who are already using AI to improve their technique. 
            Start your free analysis today and see the difference data-driven training can make.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-12 py-4 bg-white text-red-700 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 font-semibold"
            onClick={() => !user && setShowAuthModal(true)}
          >
            Start Your Free Analysis Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-red-100 text-sm mt-6">
            No credit card required • Instant access • 5 free video analyses
          </p>
        </div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode="signup"
        onModeChange={() => {}}
      />
    </div>
  );
};