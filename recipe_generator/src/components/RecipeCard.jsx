import { Button } from "./ui/button.jsx";
import { Card, CardContent } from "./ui/card";
import { Clock, Users, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Link } from "react-router-dom";

export function RecipeCard({
  id,
  name,
  description,
  image,
  cookTime,
  servings,
  difficulty,
  isFavorite,
  onViewRecipe,
  onToggleFavorite,
  isLoggedIn
}) {
  // Handle favorite click
  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      alert("Please sign in to save favorites");
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    const favDocRef = doc(db, "users", user.uid, "favorites", id);

    try {
      if (isFavorite) {
        // Remove from favorites
        await deleteDoc(favDocRef);
      } else {
        // Add to favorites
        await setDoc(favDocRef, {
          recipeId: id,
          name,
          description,
          image,
          cookTime,
          servings,
          difficulty,
          addedAt: new Date()
        });
      }

      // Update parent component state
      onToggleFavorite && onToggleFavorite(id);
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-2xl cursor-pointer">
      <div className="relative overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleFavoriteClick}
            className={`w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 ${
              isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-600 rounded-full">
            {difficulty}
          </span>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{cookTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{servings} servings</span>
          </div>
        </div>

        <Button
          onClick={onViewRecipe}
          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors duration-200"
        >
          View Recipe
        </Button>
        {/* <Link to={`/recipe/${id}`} className="w-full">
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors duration-200">
            View Recipe
          </Button>
        </Link> */}
      </CardContent>
    </Card>
  );
}
