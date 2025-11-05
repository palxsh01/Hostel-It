import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Tracking = () => {
  const [orderId, setOrderId] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement tracking logic
    console.log("Tracking order:", orderId);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" 
         style={{ background: "var(--gradient-bg)" }}>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-2xl bg-card rounded-[3rem] shadow-2xl p-8 md:p-16 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Track Your Delivery
              </h1>
              <p className="text-lg text-muted-foreground">
                Enter your order ID to see real-time delivery status
              </p>
            </div>
            
            <form onSubmit={handleTrack} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter Order ID (e.g., ORD123456)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="flex-1 h-12 rounded-xl text-lg"
                />
                <Button type="submit" size="lg" className="px-6 rounded-xl">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>
            
            <div className="bg-secondary/50 rounded-2xl p-8 text-center">
              <p className="text-muted-foreground">
                Your delivery status will appear here once you track an order
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tracking;
