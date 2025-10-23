
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { ArrowLeft, Heart, Clock, Users, ChefHat } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { db, auth } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export function FavoritesPage({ onNavigate, onGoBack, onViewRecipe, isLoggedIn }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const user = auth.currentUser;
    if (!user) return;

    const favCollectionRef = collection(db, "users", user.uid, "favorites");

    // Listen for real-time updates
    const unsubscribe = onSnapshot(favCollectionRef, (snapshot) => {
      const favs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavorites(favs);
    });

    return () => unsubscribe();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={onGoBack} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign in to view favorites</h1>
          <p className="text-gray-600 mb-8">
            Create an account or sign in to save your favorite recipes and access them anytime.
          </p>
          <div className="space-y-3 max-w-xs mx-auto">
            <Button onClick={() => onNavigate("login")} className="w-full bg-green-600 hover:bg-green-700">Sign In</Button>
            <Button onClick={() => onNavigate("signup")} variant="outline" className="w-full">Create Account</Button>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center mb-8">
            <Heart className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Favorite Recipes</h1>
              <p className="text-gray-600">Your saved recipes collection</p>
            </div>
          </div>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((recipe) => (
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
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => e.stopPropagation()} // Optional: add unfavorite functionality later
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-500 hover:text-red-600"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </Button>
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
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No favorites yet</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start exploring recipes and click the heart icon to save your favorites here.
              </p>
              <Button 
                onClick={() => onNavigate("home")}
                className="bg-green-600 hover:bg-green-700"
              >
                Discover Recipes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
