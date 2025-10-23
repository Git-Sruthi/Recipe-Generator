import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { ArrowLeft, ChefHat, Heart, Users, Star, Award, Globe } from "lucide-react";

export function AboutPage({ onNavigate, onGoBack }) {
  const features = [
    {
      icon: Heart,
      title: "Save Favorites",
      description: "Keep track of your favorite recipes and create personalized collections"
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Every recipe meets our high standards for taste and clarity"
    },
    {
      icon: Globe,
      title: "Global Cuisine",
      description: "Discover flavors from around the world in one convenient place"
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Head Chef & Founder",
      description: "Professional chef with 15 years of experience in fine dining and recipe development."
    },
    {
      name: "Mike Chen",
      role: "Culinary Director",
      description: "Expert in Asian cuisine and food photography, bringing authentic flavors to your kitchen."
    },
    {
      name: "Emma Rodriguez",
      role: "Nutrition Specialist",
      description: "Registered dietitian ensuring our recipes are both delicious and nutritious."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={onGoBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <ChefHat className="h-16 w-16 text-green-600 mr-4" />
                <h1 className="text-5xl font-bold text-gray-900">RecipeFinder</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We're passionate about bringing you the world's best recipes, carefully curated and 
                tested to ensure every dish you make is absolutely delicious. From quick weeknight 
                dinners to special occasion feasts, we've got you covered.
              </p>
            </div>

            {/* Mission Statement */}
            <div className="bg-gradient-to-r from-green-50 to-orange-50 rounded-2xl p-8 mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Our Mission</h2>
              <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto leading-relaxed">
                To inspire home cooks of all levels by providing accessible, tested recipes and 
                building a community where culinary creativity thrives. We believe everyone deserves 
                to create memorable meals that bring people together.
              </p>
            </div>

            {/* Features Grid */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose RecipeFinder?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <feature.icon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Team Section */}
            {/* <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet Our Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {team.map((member, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="p-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-orange-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-green-600 font-medium mb-3">{member.role}</p>
                      <p className="text-gray-600 text-sm">{member.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div> */}

            {/* Stats Section */}
            {/* <div className="bg-gray-900 rounded-2xl p-8 text-white mb-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">500+</div>
                  <div className="text-gray-300">Recipes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-400 mb-2">50K+</div>
                  <div className="text-gray-300">Happy Cooks</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">25+</div>
                  <div className="text-gray-300">Countries</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-400 mb-2">4.9★</div>
                  <div className="text-gray-300">Average Rating</div>
                </div>
              </div>
            </div> */}

            {/* Call to Action */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Cooking?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of home cooks who have already discovered their new favorite recipes.
              </p>
              <div className="space-x-4">
                <Button 
                  onClick={() => onNavigate("home")}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                >
                  Explore Recipes
                </Button>
                {/* <Button 
                  onClick={() => onNavigate("signup")}
                  variant="outline"
                  className="px-8 py-3"
                >
                  Join Community
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}