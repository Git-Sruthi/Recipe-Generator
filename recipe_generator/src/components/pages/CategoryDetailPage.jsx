


import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { ArrowLeft, Clock, Users, ChefHat, Filter, Heart } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const categoryRecipes = {
  italian: [
    {
      id: "italian-1",
      name: "Classic Spaghetti Carbonara",
      description: "Creamy Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
      image: "https://images.unsplash.com/photo-1712746784296-e62c1cc7b1f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2glMjByZXN0YXVyYW50fGVufDF8fHx8MTc1ODM2NDk3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      cookTime: "25 min",
      servings: 4,
      difficulty: "Medium",
      category: "italian"
    },
    {
      id: "italian-2",
      name: "Margherita Pizza",
      description: "Traditional Neapolitan pizza with tomato sauce, mozzarella, and fresh basil.",
      image: "https://images.unsplash.com/photo-1585991866018-b9462b2f4ad6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwZm9vZCUyMHBhc3RhfGVufDF8fHx8MTc1ODM3NDYzMHww&ixlib=rb-4.1.0&q=80&w=1080",
      cookTime: "30 min",
      servings: 2,
      difficulty: "Medium",
      category: "italian"
    },
    {
      id: "italian-3",
      name: "Risotto Milanese",
      description: "Creamy Italian rice dish with saffron, white wine, and Parmesan cheese.",
      image: "https://images.unsplash.com/photo-1585991866018-b9462b2f4ad6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwZm9vZCUyMHBhc3RhfGVufDF8fHx8MTc1ODM3NDYzMHww&ixlib=rb-4.1.0&q=80&w=1080",
      cookTime: "45 min",
      servings: 4,
      difficulty: "Hard",
      category: "italian"
    }
  ],
  asian: [
    {
      id: "asian-1",
      name: "Spicy Thai Green Curry",
      description: "Aromatic coconut curry with vegetables and your choice of protein.",
      image: "https://images.unsplash.com/photo-1743674453123-93356ade2891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFyaWFuJTIwY3VycnklMjBkaXNofGVufDF8fHx8MTc1ODM3NDYzMHww&ixlib=rb-4.1.0&q=80&w=1080",
      cookTime: "35 min",
      servings: 4,
      difficulty: "Medium",
      category: "asian"
    },
    {
      id: "asian-2",
      name: "Japanese Chicken Teriyaki",
      description: "Glazed chicken with sweet and savory teriyaki sauce served with rice.",
      image: "https://images.unsplash.com/photo-1682423187670-4817da9a1b23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMG1lYWx8ZW58MXx8fHwxNzU4MzcyMTU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      cookTime: "30 min",
      servings: 4,
      difficulty: "Easy",
      category: "asian"
    }
  ],
  mexican: [
    {
      id: "mexican-1",
      name: "Beef Tacos",
      description: "Authentic Mexican tacos with seasoned ground beef and fresh toppings.",
      image: "https://images.unsplash.com/photo-1682423187670-4817da9a1b23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMG1lYWx8ZW58MXx8fHwxNzU4MzcyMTU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      cookTime: "30 min",
      servings: 4,
      difficulty: "Easy",
      category: "mexican"
    }
  ],
  american: [
    {
      id: "american-1",
      name: "Classic Cheeseburger",
      description: "Juicy beef patty with cheese, lettuce, tomato, and special sauce.",
      image: "https://images.unsplash.com/photo-1712746784296-e62c1cc7b1f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2glMjByZXN0YXVyYW50fGVufDF8fHx8MTc1ODM2NDk3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      cookTime: "20 min",
      servings: 4,
      difficulty: "Easy",
      category: "american"
    }
  ],
  mediterranean: [
    {
      id: "mediterranean-1",
      name: "Greek Mediterranean Salad",
      description: "Fresh vegetables with olives, feta cheese, and olive oil dressing.",
      image: "https://images.unsplash.com/photo-1620019989479-d52fcedd99fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwYm93bHxlbnwxfHx8fDE3NTgzMDAzNjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      cookTime: "15 min",
      servings: 4,
      difficulty: "Easy",
      category: "mediterranean"
    }
  ],
  vegetarian: [
    {
      id: "vegetarian-1",
      name: "Quinoa Buddha Bowl",
      description: "Nutritious bowl with quinoa, roasted vegetables, and tahini dressing.",
      image: "https://images.unsplash.com/photo-1620019989479-d52fcedd99fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwYm93bHxlbnwxfHx8fDE3NTgzMDAzNjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      cookTime: "35 min",
      servings: 2,
      difficulty: "Easy",
      category: "vegetarian"
    }
  ]
};

const getCategoryInfo = (category) => {
  const categoryInfo = {
    italian: {
      title: "Italian Cuisine",
      description: "Authentic Italian recipes featuring pasta, pizza, risotto, and classic desserts from different regions of Italy."
    },
    asian: {
      title: "Asian Cuisine",
      description: "Diverse Asian flavors from Thailand, Japan, Korea, Vietnam, and more with aromatic spices and fresh ingredients."
    },
    mexican: {
      title: "Mexican Cuisine",
      description: "Traditional Mexican dishes with bold flavors, fresh ingredients, and authentic cooking techniques."
    },
    american: {
      title: "American Cuisine",
      description: "Classic American comfort foods, BBQ favorites, and iconic dishes that define American cooking."
    },
    mediterranean: {
      title: "Mediterranean Cuisine",
      description: "Healthy Mediterranean recipes featuring olive oil, fresh herbs, vegetables, and lean proteins."
    },
    vegetarian: {
      title: "Vegetarian Cuisine",
      description: "Plant-based recipes that are nutritious, flavorful, and satisfying for all dietary preferences."
    }
  };
  
  return categoryInfo[category] || { title: "Recipes", description: "Delicious recipes from around the world." };
};

export function CategoryDetailPage({ category, onNavigate, onGoBack, onViewRecipe, favorites, onToggleFavorite, isLoggedIn }) {
  const [categoryData, setCategoryData] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    fetch(`http://localhost:8080/api/categories/${category}`)
      .then(res => res.json())
      .then(data => setCategoryData(data));
    fetch(`http://localhost:8080/api/recipes?category=${category}`)
      .then(res => res.json())
      .then(data => setRecipes(data));
  }, [category]);

  useEffect(() => {
    let filtered = recipes;
    if (filterBy !== "all") {
      filtered = filtered.filter(recipe => recipe.difficulty && recipe.difficulty.toLowerCase() === filterBy);
    }
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "cookTime":
          return parseInt(a.cookTime) - parseInt(b.cookTime);
        case "difficulty":
          const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case "servings":
          return a.servings - b.servings;
        default:
          return a.name.localeCompare(b.name);
      }
    });
    setFilteredRecipes(filtered);
  }, [recipes, sortBy, filterBy]);

  if (!categoryData) return <div>Loading...</div>;

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
            Back to Categories
          </Button>
        </div>
      </div>
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b">
            <div className="container mx-auto px-4 py-4">
              <Button
                variant="ghost"
                onClick={onGoBack}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
            </div>
          </div>
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              {/* Category Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{categoryData.name}</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                  {categoryData.description}
                </p>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {recipes.length} recipes available
                </Badge>
              </div>
              {/* Filters and Sorting */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="cookTime">Cook Time</SelectItem>
                      <SelectItem value="difficulty">Difficulty</SelectItem>
                      <SelectItem value="servings">Servings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Recipes Grid */}
              {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <Card 
                      key={recipe.id}
                      className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      onClick={() => onViewRecipe(recipe)}
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <ImageWithFallback
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3 flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite && onToggleFavorite(recipe.id);
                              }}
                              className={`w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 ${
                                favorites?.includes(recipe.id) 
                                  ? 'text-red-500 hover:text-red-600' 
                                  : 'text-gray-400 hover:text-red-500'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${favorites?.includes(recipe.id) ? 'fill-current' : ''}`} />
                            </Button>
                            <Badge 
                              className={`${
                                recipe.difficulty === 'Easy' ? 'bg-green-500' :
                                recipe.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                              } text-white`}
                            >
                              {recipe.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                            {recipe.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {recipe.description}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{recipe.cookTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{recipe.servings}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ChefHat className="w-4 h-4" />
                                <span>{recipe.difficulty}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">No recipes found</h2>
                  <p className="text-gray-600 mb-8">
                    Try adjusting your filters or check back later for more recipes.
                  </p>
                  <Button onClick={() => setFilterBy("all")} className="bg-green-600 hover:bg-green-700">
                    Clear Filters
                  </Button>
                </div>
              )}
              {/* Call to Action */}
              <div className="text-center mt-16">
                <div className="bg-gradient-to-r from-green-50 to-orange-50 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Love {categoryData.name}?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Explore more categories and discover new flavors from around the world.
                  </p>
                  <Button 
                    onClick={() => onNavigate("categories")}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  >
                    Browse All Categories
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }