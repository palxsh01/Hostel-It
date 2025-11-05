import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Package, Clock, IndianRupee } from "lucide-react";
import { useState } from "react";
const Deliver = () => {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [acceptAllLocations, setAcceptAllLocations] = useState(false);
  const campusLocations = ["Boys Hostel A", "Boys Hostel B", "Girls Hostel A", "Girls Hostel B", "Library", "Main Building", "Cafeteria", "Sports Complex", "Medical Center"];
  const deliveryRequests = [{
    id: "ORD001",
    pickup: "Boys Hostel A",
    dropoff: "Library",
    weight: "Light (< 2kg)",
    price: 25,
    distance: "0.5 km",
    timePosted: "5 mins ago"
  }, {
    id: "ORD002",
    pickup: "Cafeteria",
    dropoff: "Girls Hostel B",
    weight: "Medium (2-5kg)",
    price: 35,
    distance: "1.2 km",
    timePosted: "12 mins ago"
  }, {
    id: "ORD003",
    pickup: "Main Building",
    dropoff: "Sports Complex",
    weight: "Heavy (5-10kg)",
    price: 55,
    distance: "1.8 km",
    timePosted: "18 mins ago"
  }, {
    id: "ORD004",
    pickup: "Medical Center",
    dropoff: "Boys Hostel B",
    weight: "Light (< 2kg)",
    price: 20,
    distance: "0.8 km",
    timePosted: "23 mins ago"
  }];
  const toggleLocation = (location: string) => {
    setSelectedLocations(prev => prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]);
  };
  return <div className="min-h-screen flex flex-col relative overflow-hidden" style={{
    background: "var(--gradient-bg)"
  }}>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1 px-6 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Filter Section */}
            <div className="bg-card rounded-[3rem] shadow-2xl p-8 md:p-12">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <MapPin className="h-12 w-12 text-primary mx-auto" />
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Delivery Preferences</h2>
                  <p className="text-muted-foreground">
                    Select specific pickup and delivery locations
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="filter-pickup" className="text-base font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Pickup Location
                    </Label>
                    <Select>
                      <SelectTrigger id="filter-pickup" className="h-12 rounded-2xl bg-background">
                        <SelectValue placeholder="Any pickup location" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="all">All Locations</SelectItem>
                        {campusLocations.map(location => <SelectItem key={location} value={location.toLowerCase().replace(/\s+/g, '-')}>
                            {location}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="filter-dropoff" className="text-base font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      Drop-off Location
                    </Label>
                    <Select>
                      <SelectTrigger id="filter-dropoff" className="h-12 rounded-2xl bg-background">
                        <SelectValue placeholder="Any drop-off location" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="all">All Locations</SelectItem>
                        {campusLocations.map(location => <SelectItem key={location} value={location.toLowerCase().replace(/\s+/g, '-')}>
                            {location}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Preferences */}
            

            {/* Available Delivery Requests */}
            <div className="bg-card rounded-[3rem] shadow-2xl p-8 md:p-12">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Package className="h-12 w-12 text-primary mx-auto" />
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Available Deliveries
                  </h2>
                  <p className="text-muted-foreground">
                    {deliveryRequests.length} active delivery requests
                  </p>
                </div>

                <div className="grid gap-4">
                  {deliveryRequests.map(request => <Card key={request.id} className="p-6 rounded-2xl hover:shadow-lg transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono">
                              {request.id}
                            </Badge>
                            <Badge variant="secondary">
                              {request.weight}
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-muted-foreground">Pickup</p>
                                <p className="font-semibold">{request.pickup}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-muted-foreground">Drop-off</p>
                                <p className="font-semibold">{request.dropoff}</p>
                                <Badge className="mt-1 bg-primary/10 text-primary border-primary/20">
                                  {request.weight}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {request.timePosted}
                            </span>
                            <span>•</span>
                            <span>{request.distance}</span>
                          </div>
                        </div>

                        <div className="flex md:flex-col items-center md:items-end gap-3">
                          <div className="text-center md:text-right">
                            <p className="text-sm text-muted-foreground">You'll earn</p>
                            <p className="text-2xl font-bold text-primary flex items-center gap-1">
                              <IndianRupee className="h-5 w-5" />
                              {request.price}
                            </p>
                          </div>
                          <Button size="lg" className="rounded-2xl min-w-32">
                            Accept
                          </Button>
                        </div>
                      </div>
                    </Card>)}
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>;
};
export default Deliver;