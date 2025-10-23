import { useState, useEffect, Fragment } from "react";
import { Hero } from "../Hero.jsx";
import { RecipeCard } from "../RecipeCard.jsx";
import { Button } from "../ui/button.jsx";
import { toast } from "sonner";
import { auth, db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

// Fetch default recipes
const fetchDefaultRecipes = async () => {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    const data = await res.json();
    if (!data.meals) return [];
    return data.meals.map(recipe => ({
      idMeal: recipe.idMeal,
      name: recipe.strMeal,
      description: recipe.strInstructions.slice(0, 120) + "...",
      image: recipe.strMealThumb,
      cookTime: "N/A",
      servings: 1,
      difficulty: "Medium",
      ingredients: Array.from({ length: 20 }, (_, i) => recipe[`strIngredient${i + 1}`]).filter(Boolean),
      measures: Array.from({ length: 20 }, (_, i) => recipe[`strMeasure${i + 1}`]).filter(Boolean),
    }));
  } catch (err) {
    toast.error(err.message);
    return [];
  }
};

// Fetch recipes by ingredient
const fetchRecipesByIngredients = async (ingredients = "") => {
  try {
    const ingredientList = ingredients.split(",").map(i => i.trim()).filter(Boolean);
    if (!ingredientList.length) return [];

    const ingredientResults = await Promise.all(
      ingredientList.map(async ing => {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ing)}`);
        const data = await res.json();
        return data.meals ? data.meals.map(r => r.idMeal) : [];
      })
    );

    const intersectedIds = ingredientResults.reduce((acc, ids) => acc.filter(id => ids.includes(id)));
    if (!intersectedIds.length) return [];

    const fullRecipes = await Promise.all(
      intersectedIds.map(async id => {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        const recipe = data.meals[0];
        return {
          idMeal: recipe.idMeal,
          name: recipe.strMeal,
          description: recipe.strInstructions.slice(0, 120) + "...",
          image: recipe.strMealThumb,
          cookTime: "N/A",
          servings: 1,
          difficulty: "Medium",
          ingredients: Array.from({ length: 20 }, (_, i) => recipe[`strIngredient${i + 1}`]).filter(Boolean),
          measures: Array.from({ length: 20 }, (_, i) => recipe[`strMeasure${i + 1}`]).filter(Boolean),
        };
      })
    );

    return fullRecipes;
  } catch (err) {
    toast.error(err.message);
    return [];
  }
};

// Fetch recipes by cuisine
const fetchRecipesByCuisine = async (cuisine = "") => {
  try {
    if (!cuisine) return await fetchDefaultRecipes();
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(cuisine)}`);
    const data = await res.json();
    if (!data.meals) return [];
    const fullRecipes = await Promise.all(
      data.meals.map(async meal => {
        const lookupRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
        const lookupData = await lookupRes.json();
        const recipe = lookupData.meals[0];
        return {
          idMeal: recipe.idMeal,
          name: recipe.strMeal,
          description: recipe.strInstructions.slice(0, 120) + "...",
          image: recipe.strMealThumb,
          cookTime: "N/A",
          servings: 1,
          difficulty: "Medium",
          ingredients: Array.from({ length: 20 }, (_, i) => recipe[`strIngredient${i + 1}`]).filter(Boolean),
          measures: Array.from({ length: 20 }, (_, i) => recipe[`strMeasure${i + 1}`]).filter(Boolean),
        };
      })
    );
    return fullRecipes;
  } catch (err) {
    toast.error(err.message);
    return [];
  }
};

// Fetch favorites
const fetchUserFavorites = async () => {
  if (!auth.currentUser) return [];
  try {
    const snapshot = await getDocs(collection(db, "users", auth.currentUser.uid, "favorites"));
    return snapshot.docs.map(doc => doc.id);
  } catch (err) {
    toast.error("Failed to fetch favorites");
    return [];
  }
};

export function HomePage({ onViewRecipe, isLoggedIn }) {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({ searchQuery: "" });
  const [selectedCuisine, setSelectedCuisine] = useState({ name: "All Cuisines", value: "" });
  const [loading, setLoading] = useState(false);

  const cuisines = [
    "American", "British", "Canadian", "Chinese", "Dutch", "Egyptian", "French",
    "Greek", "Indian", "Irish", "Italian", "Jamaican", "Japanese", "Kenyan",
    "Malaysian", "Mexican", "Moroccan", "Polish", "Portuguese", "Russian",
    "Spanish", "Thai", "Tunisian", "Turkish", "Vietnamese"
  ].map(c => ({ name: c, value: c }));

  const allCuisinesOption = { name: "All Cuisines", value: "" };
  const cuisineOptions = [allCuisinesOption, ...cuisines];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [defaultRecipes, userFavs] = await Promise.all([fetchDefaultRecipes(), fetchUserFavorites()]);
      setRecipes(defaultRecipes);
      setFavorites(userFavs);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSearch = async (query) => {
    setFilters({ searchQuery: query });
    setLoading(true);
    if (!query.trim()) {
      const data = selectedCuisine.value ? await fetchRecipesByCuisine(selectedCuisine.value) : await fetchDefaultRecipes();
      setRecipes(data);
      setLoading(false);
      return;
    }
    const data = await fetchRecipesByIngredients(query);
    setRecipes(data);
    setLoading(false);
  };

  const handleToggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <>
      <Hero onSearch={handleSearch} searchQuery={filters.searchQuery} />

      <main className="container mx-auto px-4 py-8">
        {/* Heading + Cuisine dropdown */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {filters.searchQuery ? `Results for "${filters.searchQuery}"` : "Featured Recipes"}
          </h2>
          <Listbox value={selectedCuisine} onChange={async (value) => {
            setSelectedCuisine(value);
            setFilters({ searchQuery: "" });
            setLoading(true);
            try {
              const data = value.value ? await fetchRecipesByCuisine(value.value) : await fetchDefaultRecipes();
              setRecipes(data);
            } catch (err) {
              toast.error("Failed to load recipes");
            } finally {
              setLoading(false);
            }
          }}>
            <div className="relative w-60">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <span className="block truncate">{selectedCuisine.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {cuisineOptions.map((c, idx) => (
                    <Listbox.Option
                      key={idx}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? "bg-green-100 text-green-900" : "text-gray-900"
                        }`
                      }
                      value={c}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? "font-semibold" : ""}`}>{c.name}</span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                              <Check className="w-5 h-5" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* Recipes grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 text-lg">Loading recipes...</div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">No recipes found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {recipes.map(recipe => (
              <RecipeCard
                key={recipe.idMeal || recipe.id}
                {...recipe}
                onViewRecipe={() => onViewRecipe(recipe)}
                isFavorite={favorites.includes(recipe.idMeal || recipe.id)}
                onToggleFavorite={handleToggleFavorite}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}


