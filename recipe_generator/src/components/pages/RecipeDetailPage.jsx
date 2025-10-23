import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { ArrowLeft, Clock, Users, ChefHat, Heart } from "lucide-react";
import { toast } from "sonner";
import { RecipeChatBot } from "../RecipeChatBot.jsx";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";

export function RecipeDetailPage({ recipe, onGoBack, favorites, onToggleFavorite }) {
  const [user, setUser] = useState(auth.currentUser);
  const [isFavorite, setIsFavorite] = useState(favorites?.includes(recipe.idMeal || recipe.id));
  const [fullRecipe, setFullRecipe] = useState(recipe); // start with partial data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  useEffect(() => {
    setIsFavorite(favorites?.includes(recipe.idMeal || recipe.id));
  }, [favorites, recipe.idMeal, recipe.id]);

  // ✅ Fetch full recipe from MealDB
  useEffect(() => {
    const fetchFullRecipe = async () => {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal || recipe.id}`
        );
        const data = await res.json();
        if (data.meals && data.meals.length > 0) {
          setFullRecipe(data.meals[0]);
        }
      } catch (err) {
        console.error("Failed to fetch full recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFullRecipe();
  }, [recipe]);

  const handleFavorite = async () => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      return;
    }
    const recipeId = recipe.idMeal || recipe.id;
    const favDocRef = doc(db, "users", user.uid, "favorites", recipeId);
    try {
      if (isFavorite) {
        await deleteDoc(favDocRef);
        toast.info(`${fullRecipe.strMeal || recipe.name} removed from favorites`);
      } else {
        await setDoc(favDocRef, {
          recipeId: recipeId,
          name: fullRecipe.strMeal || recipe.name,
          description: fullRecipe.strCategory || recipe.description || "",
          image: fullRecipe.strMealThumb || recipe.image,
          cookTime: recipe.cookTime || "N/A",
          servings: recipe.servings || "N/A",
          difficulty: recipe.difficulty || "Medium",
          addedAt: new Date()
        });
        toast.success(`${fullRecipe.strMeal || recipe.name} added to favorites`);
      }
      setIsFavorite(!isFavorite);
      onToggleFavorite && onToggleFavorite(recipeId);
    } catch (error) {
      toast.error("Failed to update favorites");
      console.error(error);
    }
  };

  // ✅ Extract ingredients dynamically
  const extractIngredients = (recipe) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(`${measure || ""} ${ingredient}`.trim());
      }
    }
    return ingredients;
  };

  const ingredients = fullRecipe ? extractIngredients(fullRecipe) : [];
  const instructions = fullRecipe?.strInstructions
    ? fullRecipe.strInstructions.split(".").filter(line => line.trim() !== "")
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading recipe...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onGoBack} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recipes
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Recipe Header */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{fullRecipe.strMeal || recipe.name}</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {fullRecipe.strCategory || recipe.description || "No description available."}
                </p>
              </div>

              {/* Recipe Meta */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{recipe.cookTime || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span>{recipe.servings || "N/A"} servings</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <ChefHat className="w-5 h-5" />
                  <span>{recipe.difficulty || "Medium"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleFavorite}
                  className={`text-white ${isFavorite ? "bg-red-500 hover:bg-red-600" : "bg-gray-500 hover:bg-gray-600"}`}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {isFavorite ? "Unlike" : "Like"}
                </Button>
              </div>
            </div>

            {/* Recipe Image */}
            <div className="relative">
              <img
                src={fullRecipe.strMealThumb || recipe.image}
                alt={fullRecipe.strMeal || recipe.name}
                className="w-full h-[400px] object-cover rounded-xl shadow-lg"
              />
              <Badge className="absolute top-4 right-4 bg-green-600 text-white">
                {fullRecipe.strCategory || recipe.difficulty || "Recipe"}
              </Badge>
            </div>
          </div>

          {/* Ingredients & Instructions */}
          <div className="space-y-8">
            {/* Ingredients */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Ingredients</h2>
                <ul className="space-y-3">
                  {ingredients.length > 0 ? ingredients.map((item, idx) => (
                    <li key={idx} className="text-gray-700">{item}</li>
                  )) : <p className="text-gray-500">No ingredients found.</p>}
                </ul>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Instructions</h2>
                <ol className="space-y-4 list-decimal pl-5">
                  {instructions.length > 0 ? instructions.map((step, idx) => (
                    <li key={idx} className="text-gray-700">{step}</li>
                  )) : <p className="text-gray-500">No instructions available.</p>}
                </ol>
              </CardContent>
            </Card>

            {/* Chat Bot Integration */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Ask About This Recipe</h2>
                <RecipeChatBot recipe={recipe} />
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
      
    </div>
    
  );
}
