import { Button } from "./ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Filter } from "lucide-react";
import { useState, useEffect } from "react";

export function Sidebar({ 
  className, 
  filters = {}, // default to empty object
  onApplyFilters, 
  onClearFilters
}) {
  const [localCuisineType, setLocalCuisineType] = useState(filters.cuisineType || "all");
  const [localDietaryPreferences, setLocalDietaryPreferences] = useState(filters.dietaryPreferences || []);
  const [localCookTime, setLocalCookTime] = useState([filters.maxCookTime || 120]);

  useEffect(() => {
    setLocalCuisineType(filters.cuisineType || "all");
    setLocalDietaryPreferences(filters.dietaryPreferences || []);
    setLocalCookTime([filters.maxCookTime || 120]);
  }, [filters]);

  const cuisineTypes = [
    "Italian",
    "Mexican",
    "Asian",
    "Mediterranean",
    "American",
    "Indian",
    "French"
  ];

  const dietaryPreferences = [
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" },
    { id: "gluten-free", label: "Gluten-Free" },
    { id: "dairy-free", label: "Dairy-Free" },
    { id: "low-carb", label: "Low Carb" },
    { id: "keto", label: "Keto" }
  ];

  const handleDietaryPreferenceChange = (preferenceId, checked) => {
    if (checked) {
      setLocalDietaryPreferences(prev => [...prev, preferenceId]);
    } else {
      setLocalDietaryPreferences(prev => prev.filter(id => id !== preferenceId));
    }
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      cuisineType: localCuisineType,
      dietaryPreferences: localDietaryPreferences,
      maxCookTime: localCookTime[0]
    });
  };

  return (
    <div className={className}>
      <Card className="border-0 shadow-lg rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Filter className="h-5 w-5 text-green-600" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Cuisine Type */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Cuisine Type
            </label>
            <Select value={localCuisineType} onValueChange={setLocalCuisineType}>
              <SelectTrigger className="rounded-xl border-gray-200">
                <SelectValue placeholder="All cuisines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cuisines</SelectItem>
                {cuisineTypes.map(cuisine => (
                  <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dietary Preferences */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Dietary Preferences
            </label>
            <div className="space-y-3">
              {dietaryPreferences.map(pref => (
                <div key={pref.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={pref.id}
                    checked={localDietaryPreferences?.includes(pref.id) || false} // ✅ safe check
                    onCheckedChange={checked => handleDietaryPreferenceChange(pref.id, checked)}
                    className="rounded border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <label htmlFor={pref.id} className="text-sm text-gray-600 cursor-pointer">
                    {pref.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Cooking Time */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Max Cooking Time
            </label>
            <div className="px-2">
              <Slider
                value={localCookTime}
                onValueChange={setLocalCookTime}
                max={120}
                min={5}
                step={5}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>5 min</span>
                <span className="font-medium text-green-600">{localCookTime[0]} min</span>
                <span>120 min</span>
              </div>
            </div>
          </div>

          {/* Apply/Clear Buttons */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <Button
              onClick={handleApplyFilters}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl"
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="w-full border-gray-200 text-gray-600 hover:text-gray-900 rounded-xl"
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
