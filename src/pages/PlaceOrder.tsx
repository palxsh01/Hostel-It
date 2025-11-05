import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Package } from "lucide-react";

const PlaceOrder = () => {
  const campusLocations = [
    "Boys Hostel A",
    "Boys Hostel B",
    "Girls Hostel A",
    "Girls Hostel B",
    "Library",
    "Main Building",
    "Cafeteria",
    "Sports Complex",
    "Medical Center",
  ];

  const weightOptions = [
    { value: "light", label: "Light (< 2kg)", price: 20 },
    { value: "medium", label: "Medium (2-5kg)", price: 30 },
    { value: "heavy", label: "Heavy (5-10kg)", price: 50 },
    { value: "extra-heavy", label: "Extra Heavy (> 10kg)", price: 80 },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" 
         style={{ background: "var(--gradient-bg)" }}>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1 px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-[3rem] shadow-2xl p-8 md:p-12 space-y-8">
              <div className="text-center space-y-2">
                <Package className="h-12 w-12 text-primary mx-auto" />
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Place an Order
                </h1>
                <p className="text-muted-foreground">
                  Get your items delivered across campus quickly and safely
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="pickup" className="text-base font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Pickup Location
                    </Label>
                    <Select>
                      <SelectTrigger id="pickup" className="h-12 rounded-2xl bg-background">
                        <SelectValue placeholder="Select pickup location" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {campusLocations.map((location) => (
                          <SelectItem key={location} value={location.toLowerCase().replace(/\s+/g, '-')}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="dropoff" className="text-base font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      Drop-off Location
                    </Label>
                    <Select>
                      <SelectTrigger id="dropoff" className="h-12 rounded-2xl bg-background">
                        <SelectValue placeholder="Select drop-off location" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {campusLocations.map((location) => (
                          <SelectItem key={location} value={location.toLowerCase().replace(/\s+/g, '-')}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="weight" className="text-base font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    Package Weight
                  </Label>
                  <Select>
                    <SelectTrigger id="weight" className="h-12 rounded-2xl">
                      <SelectValue placeholder="Select package weight" />
                    </SelectTrigger>
                    <SelectContent>
                      {weightOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} - ₹{option.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-base font-semibold">
                    Item Description
                  </Label>
                  <Textarea 
                    id="description"
                    placeholder="Describe your item (optional)"
                    className="min-h-24 rounded-2xl"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-base font-semibold">
                    Special Instructions
                  </Label>
                  <Textarea 
                    id="notes"
                    placeholder="Any special delivery instructions (optional)"
                    className="min-h-24 rounded-2xl"
                  />
                </div>

                <div className="bg-secondary/50 rounded-2xl p-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-semibold">₹30</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="font-semibold">₹5</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-primary">₹35</span>
                  </div>
                </div>

                <Button size="lg" className="w-full h-14 text-lg rounded-2xl">
                  Place Order
                </Button>
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default PlaceOrder;
