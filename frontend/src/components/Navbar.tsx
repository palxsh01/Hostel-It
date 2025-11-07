import { Link, useLocation } from "react-router-dom";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="w-full px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
          <Package className="h-8 w-8 text-primary" />
          <span>Hostel-it</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/") ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link 
            to="/place-order" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/place-order") ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Place Order
          </Link>
          <Link 
            to="/deliver" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/deliver") ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Deliver
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="font-medium">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="font-medium">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
