import { useState, useRef } from "react";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Upload, Camera, X } from "lucide-react";
import { Card, CardContent } from "./ui/card.jsx";
import { Badge } from "./ui/badge.jsx";
import { toast } from "sonner";

export function Hero({ onSearch, searchQuery }) {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPhotoSearch, setShowPhotoSearch] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedImage(URL.createObjectURL(file));
    setIsAnalyzing(true);
    toast.info("Analyzing your photo...");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:8080/api/external/detect-object", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.ingredients?.length) {
        setDetectedIngredients(data.ingredients);
        toast.success(`Detected: ${data.ingredients.join(", ")}`);
        onSearch(data.ingredients.join(", ")); // auto search MealDB with all ingredients
      } else {
        toast.error("No ingredients detected");
        setDetectedIngredients([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to analyze image");
      setDetectedIngredients([]);
    }

    setIsAnalyzing(false);
  };

  const clearPhoto = () => {
    setUploadedImage(null);
    setDetectedIngredients([]);
    setIsAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-green-50 to-orange-50 overflow-hidden">
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Discover Amazing <span className="text-green-600">Recipes</span>
        </h1>

        {/* Text Search */}
        <div className="max-w-2xl mx-auto mb-8 flex">
          <Input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="flex-1 mr-2"
          />
          <Button onClick={() => onSearch(searchQuery)}>Search</Button>
        </div>

        {/* Photo Search Toggle */}
        <Button
          onClick={() => setShowPhotoSearch(!showPhotoSearch)}
          variant="outline"
          className="mb-4"
        >
          <Camera className="w-5 h-5 mr-2" /> Search by Photo
        </Button>

        {/* Photo Upload Section */}
        {showPhotoSearch && (
          <Card className="p-4 max-w-md mx-auto">
            {!uploadedImage ? (
              <div className="text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-5 h-5 mr-2" /> Choose Photo
                </Button>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={uploadedImage}
                  className="w-full h-48 object-cover rounded-lg"
                  alt="Uploaded ingredients"
                />
                <Button
                  onClick={clearPhoto}
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>

                {/* Detected Ingredients */}
                {detectedIngredients.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {detectedIngredients.map((ing, idx) => (
                      <Badge key={idx} variant="secondary">
                        {ing}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Analyzing Loader */}
                {isAnalyzing && (
                  <div className="mt-4 text-gray-600">
                    Analyzing image, please wait...
                  </div>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    </section>
  );
}




