import { useState, useEffect } from "react";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { HomePage } from "./components/pages/HomePage.jsx";
import { LoginPage } from "./components/pages/LoginPage.jsx";
import { SignupPage } from "./components/pages/SignupPage.jsx";
import { RecipeDetailPage } from "./components/pages/RecipeDetailPage.jsx";
import { CategoriesPage } from "./components/pages/CategoriesPage.jsx";
import { CategoryDetailPage } from "./components/pages/CategoryDetailPage.jsx";
import { FavoritesPage } from "./components/pages/FavoritesPage.jsx";
import { AboutPage } from "./components/pages/AboutPage.jsx";
import { Toaster, toast } from "sonner";
import { auth } from "./firebase.js"; // ✅ import Firebase
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [navigationHistory, setNavigationHistory] = useState(["home"]);
  const [favorites, setFavorites] = useState([]);

  // ✅ keep user logged in until logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name:
            firebaseUser.displayName ||
            firebaseUser.email.split("@")[0], // fallback to email prefix
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setNavigationHistory((prev) => [...prev, page]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current page
      const previousPage = newHistory[newHistory.length - 1];
      setCurrentPage(previousPage);
      setNavigationHistory(newHistory);
    } else {
      handleNavigation("home");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAuth = (action) => {
    handleNavigation(action);
  };

  const handleLogin = (firebaseUser) => {
    setUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name:
        firebaseUser.displayName ||
        firebaseUser.email.split("@")[0], // safer than .name
    });
  };

  const handleSignup = (firebaseUser) => {
    setUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name:
        firebaseUser.displayName ||
        firebaseUser.email.split("@")[0],
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // ✅ Firebase logout
      setUser(null);
      setFavorites([]);
      toast.success("Successfully logged out");
      handleNavigation("home");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const handleToggleFavorite = (recipeId) => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      return;
    }
    setFavorites((prev) => {
      const isFavorited = prev.includes(recipeId);
      if (isFavorited) {
        toast.success("Removed from favorites");
        return prev.filter((id) => id !== recipeId);
      } else {
        toast.success("Added to favorites");
        return [...prev, recipeId];
      }
    });
  };

  const isFavorite = (recipeId) => favorites.includes(recipeId);

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    handleNavigation("recipe-detail");
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    handleNavigation("category-detail");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "login":
        return <LoginPage onNavigate={handleNavigation} onLogin={handleLogin} />;
      case "signup":
        return <SignupPage onNavigate={handleNavigation} onSignup={handleSignup} />;
      case "recipe-detail":
        return selectedRecipe ? (
          <RecipeDetailPage
            recipe={selectedRecipe}
            onNavigate={handleNavigation}
            onGoBack={handleGoBack}
          />
        ) : (
          <HomePage onViewRecipe={handleViewRecipe} />
        );
      // case "categories":
      //   return (
      //     <CategoriesPage
      //       onNavigate={handleNavigation}
      //       onGoBack={handleGoBack}
      //       onSelectCategory={handleSelectCategory}
      //     />
      //   );
      // case "category-detail":
      //   return selectedCategory ? (
      //     <CategoryDetailPage
      //       category={selectedCategory}
      //       onNavigate={handleNavigation}
      //       onGoBack={handleGoBack}
      //       onViewRecipe={handleViewRecipe}
      //       favorites={favorites}
      //       onToggleFavorite={handleToggleFavorite}
      //       isLoggedIn={!!user}
      //     />
      //   ) : (
      //     <CategoriesPage
      //       onNavigate={handleNavigation}
      //       onGoBack={handleGoBack}
      //       onSelectCategory={handleSelectCategory}
      //     />
      //   );
      case "favorites":
        return (
          <FavoritesPage
            onNavigate={handleNavigation}
            onGoBack={handleGoBack}
            onViewRecipe={handleViewRecipe}
            isLoggedIn={!!user}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case "about":
        return <AboutPage onNavigate={handleNavigation} onGoBack={handleGoBack} />;
      case "home":
      default:
        return (
          <>
            <HomePage
              onViewRecipe={handleViewRecipe}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              isLoggedIn={!!user}
            />
            {/* <Footer onNavigate={handleNavigation} /> */}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigation}
        onAuth={handleAuth}
        user={user}
        onLogout={handleLogout}
      />
      {renderCurrentPage()}
      <Toaster  position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: { zIndex: 9999, pointerEvents: "auto" },
      }}/>
    </div>
  );
}
