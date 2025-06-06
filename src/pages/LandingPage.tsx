import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Upload, BarChart3, Target, Shield, Zap, Check, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AuthModal } from '../components/auth/AuthModal';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const features = [
    {
      icon: <Target className="w-8 h-8 text-red-500" />,
      title: 'Punch Analytics',
      description: 'Track speed, type, volume, and accuracy of every punch thrown during training.',
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: 'Defensive Analysis',
      description: 'Analyze guard positioning, head movement, and defensive effectiveness.',
    },
    {
      icon: <Zap className="w-8 h-8 text-red-500" />,
      title: 'Footwork Tracking',
      description: 'Monitor stance, movement patterns, and ring positioning for optimal performance.',
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-red-500" />,
      title: 'Actionable Insights',
      description: 'Get AI-powered recommendations to improve your technique and strategy.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Upload Your Video',
      description: 'Simply drag and drop your training or sparring footage.',
    },
    {
      number: '02',
      title: 'AI Analyzes',
      description: 'Our advanced AI processes your video and identifies key metrics.',
    },
    {
      number: '03',
      title: 'Get Your Report',
      description: 'Receive detailed insights and actionable recommendations.',
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
        'Progress tracking',
        'Export reports',
        'Priority support',
      ],
      uploadsLimit: 60,
      popular: true,
    },
  ];

  const testimonials = [
    {
      name: 'Marcus Rodriguez',
      role: 'Professional Boxer',
      content: 'ShadowBox AI helped me identify weaknesses in my defense that my coach and I missed. The insights are incredibly detailed.',
      rating: 5,
    },
    {
      name: 'Sarah Chen',
      role: 'Boxing Coach',
      content: 'This tool has revolutionized how I analyze my fighters. The data-driven approach gives us a competitive edge.',
      rating: 5,
    },
    {
      name: 'Tommy Williams',
      role: 'Amateur Boxer',
      content: 'As someone training for my first competition, the feedback has been invaluable for improving my technique.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Analyze Your Fight.
              <br />
              <span className="text-red-500">Unleash Your Potential.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Get AI-powered feedback on your boxing technique from video analysis. 
              Identify strengths, weaknesses, and areas for improvement with precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-4">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4"
                  onClick={() => setShowAuthModal(true)}
                >
                  Start Your Free Analysis
                </Button>
              )}
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for
              <span className="text-red-500"> Elite Performance</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our AI analyzes every aspect of your boxing technique to provide comprehensive insights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It <span className="text-red-500">Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get professional-level analysis in three simple steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-400 text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your <span className="text-red-500">Plan</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start with our free trial and upgrade when you're ready for more advanced features.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'border-red-500 ring-2 ring-red-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-400">/{plan.interval}</span>
                  </div>
                  <p className="text-gray-400">{plan.uploadsLimit} video analyses</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full"
                  variant={plan.popular ? 'primary' : 'outline'}
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Fighters <span className="text-red-500">Say</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-900 to-red-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Training?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of fighters who are already using AI to improve their technique.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-4"
            onClick={() => !user && setShowAuthModal(true)}
          >
            Start Your Free Analysis Today
          </Button>
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