import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';

const features = [
  {
    icon: Icons.barChart,
    title: 'Smart Analytics',
    description: 'Get insights into your spending patterns and financial trends',
  },
  {
    icon: Icons.shield,
    title: 'Secure & Private',
    description: 'Bank-level security to keep your financial data safe',
  },
  {
    icon: Icons.target,
    title: 'Goal Tracking',
    description: 'Set and track your financial goals with ease',
  },
  {
    icon: Icons.smartphone,
    title: 'Mobile Ready',
    description: 'Access your finances anywhere, anytime',
  },
];

const Index = () => {
  const featuresRef = useRef<HTMLElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Icons.dollarSign className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl">Finance Manager Pro</span>
          </div>
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Take Control of Your Financial Future
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The most powerful and intuitive personal finance manager designed for modern users. 
              Track expenses, manage budgets, and achieve your financial goals.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg px-8">
                Start Free Today
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8" onClick={scrollToFeatures}>
              <Icons.activity className="w-5 h-5 mr-2" />
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="container mx-auto px-4 py-20 scroll-mt-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your finances effectively
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Ready to Transform Your Finances?</h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of users who have taken control of their financial future with Finance Manager Pro
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg px-8">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Finance Manager Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
