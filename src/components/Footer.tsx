import { Link } from "react-router-dom";
import { Package } from "lucide-react";
const Footer = () => {
  return <footer className="w-full px-6 py-8 border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Package className="h-6 w-6 text-primary" />
            <span>Hostel-it</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              About Us
            </Link>
            <p className="text-sm text-muted-foreground">© 2025 Hostel-it. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;