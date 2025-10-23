import { Button } from "./ui/button.jsx";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Sidebar } from "./Sidebar.jsx";
import { Filter } from "lucide-react";

export function MobileFilters({ filters, onApplyFilters, onClearFilters }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden border-gray-200 text-gray-600 rounded-xl">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle>Filter Recipes</SheetTitle>
        </SheetHeader>
        <div className="p-6">
          <Sidebar 
            filters={filters}
            onApplyFilters={onApplyFilters}
            onClearFilters={onClearFilters}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}