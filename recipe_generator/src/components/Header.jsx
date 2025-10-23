import { Button } from "./ui/button.jsx";
import { Menu, ChefHat, User, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "./ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


export function Header({ currentPage, onNavigate, onAuth, user, onLogout }) {
  const navItems = ["Home", "Favorites", "About"];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => onNavigate("home")}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <ChefHat className="h-8 w-8 text-green-600" />
          <span className="font-bold text-xl text-gray-900">RecipeFinder</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => onNavigate(item.toLowerCase())}
              className={`transition-colors duration-200 ${
                currentPage === item.toLowerCase() 
                  ? "text-green-600 font-medium" 
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Desktop Auth/User Section */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-green-600 text-white text-sm">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-gray-700">{user.name.split(' ')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onNavigate("favorites")}>
                  <User className="w-4 h-4 mr-2" />
                  My Favorites
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-green-600"
                onClick={() => onAuth("login")}
              >
                Login
              </Button>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => onAuth("signup")}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <VisuallyHidden>
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>Main navigation menu for RecipeFinder</SheetDescription>
            </VisuallyHidden>
            <div className="flex flex-col space-y-4 mt-6">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => onNavigate(item.toLowerCase())}
                  className={`text-lg transition-colors duration-200 text-left ${
                    currentPage === item.toLowerCase() 
                      ? "text-green-600 font-medium" 
                      : "text-gray-600 hover:text-green-600"
                  }`}
                >
                  {item}
                </button>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-green-600 text-white">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-gray-600 hover:text-green-600 justify-start"
                      onClick={() => onNavigate("favorites")}
                    >
                      <User className="w-4 h-4 mr-2" />
                      My Favorites
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-gray-600 hover:text-red-600 justify-start"
                      onClick={onLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      className="text-gray-600 hover:text-green-600 justify-start"
                      onClick={() => onAuth("login")}
                    >
                      Login
                    </Button>
                    <Button 
                      className="bg-orange-500 hover:bg-orange-600 text-white justify-start"
                      onClick={() => onAuth("signup")}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}