import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/Footer";
import DecorativeDots from "@/components/DecorativeDots";
import heroIllustration from "@/assets/hero-illustration.png";

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden" 
         style={{ background: "var(--gradient-bg)" }}>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-7xl bg-card rounded-[3rem] shadow-2xl p-8 md:p-16 relative overflow-hidden">
            <DecorativeDots />
            
            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Need to send a parcel across campus?
                </h1>
                
                <p className="text-lg text-muted-foreground">
                  Get your parcels delivered by fellow students fast, safe, and with a tip that makes someone's day.
                </p>
                
                <Link to="/signup">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-2xl font-semibold">
                    Get Started
                  </Button>
                </Link>
              </div>
              
              <div className="relative flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--dot-yellow))] to-transparent rounded-full blur-3xl opacity-30" />
                  <img 
                    src={heroIllustration} 
                    alt="Student delivering packages on campus" 
                    className="relative z-10 w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
};

export default Home;
