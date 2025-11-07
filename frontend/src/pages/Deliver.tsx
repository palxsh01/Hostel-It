import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Package, Clock, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { driverAPI, type Order } from "@/services/api";
import { locationSlugToName } from "@/utils/locationCoordinates";

const Deliver = () => {
  const queryClient = useQueryClient();
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [acceptAllLocations, setAcceptAllLocations] = useState(false);
  const [driverId, setDriverId] = useState<string>("");
  const [driverLocation, setDriverLocation] = useState<{ lng: number; lat: number } | null>(null);
  
  const campusLocations = ["Boys Hostel A", "Boys Hostel B", "Girls Hostel A", "Girls Hostel B", "Library", "Main Building", "Cafeteria", "Sports Complex", "Medical Center"];

  // Initialize driver on mount
  useEffect(() => {
    const initDriver = async () => {
      try {
        // Get current location (default to center of campus)
        const defaultLocation = { lng: 77.2090, lat: 28.6139 };
        
        // Try to get actual location from browser
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const loc = { lng: position.coords.longitude, lat: position.coords.latitude };
              setDriverLocation(loc);
              updateDriverLocation(loc);
            },
            () => {
              setDriverLocation(defaultLocation);
              updateDriverLocation(defaultLocation);
            }
          );
        } else {
          setDriverLocation(defaultLocation);
          updateDriverLocation(defaultLocation);
        }
      } catch (error) {
        console.error("Failed to initialize driver:", error);
      }
    };

    const updateDriverLocation = async (location: { lng: number; lat: number }) => {
      try {
        const driver = await driverAPI.updateLocation({
          name: `Driver ${Date.now()}`,
          isAvailable: true,
          location: { coordinates: [location.lng, location.lat] },
        });
        setDriverId(driver._id);
      } catch (error) {
        console.error("Failed to update driver location:", error);
      }
    };

    initDriver();
  }, []);

  // Fetch nearby orders
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ["nearbyOrders", driverId],
    queryFn: () => driverAPI.getNearbyOrders(driverId || "", 5000),
    enabled: !!driverId,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Accept order mutation
  const acceptMutation = useMutation({
    mutationFn: (orderId: string) => driverAPI.acceptOrder(driverId, orderId),
    onSuccess: (order) => {
      toast.success(`Order ${order._id.slice(-6)} accepted successfully!`);
      queryClient.invalidateQueries({ queryKey: ["nearbyOrders"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to accept order");
    },
  });

  // Reject order mutation
  const rejectMutation = useMutation({
    mutationFn: (orderId: string) => driverAPI.rejectOrder(driverId, orderId),
    onSuccess: () => {
      toast.info("Order rejected");
      queryClient.invalidateQueries({ queryKey: ["nearbyOrders"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject order");
    },
  });

  // Helper function to format time ago
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hrs ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  // Helper function to calculate approximate distance (simplified)
  const getDistance = (order: Order): string => {
    // Simplified distance calculation - in production, use proper geospatial calculation
    return "0.5 km";
  };

  // Transform order to match UI format
  const transformOrder = (order: Order) => {
    const pickupName = order.pickup.address || locationSlugToName(order.pickup.address || "");
    const dropoffName = order.dropoff.address || locationSlugToName(order.dropoff.address || "");
    const itemName = order.items[0]?.name || "Package";
    const weight = itemName.includes("Light") ? "Light (< 2kg)" : 
                   itemName.includes("Medium") ? "Medium (2-5kg)" :
                   itemName.includes("Heavy") ? "Heavy (5-10kg)" : "Light (< 2kg)";
    
    return {
      id: order._id,
      pickup: pickupName,
      dropoff: dropoffName,
      weight,
      price: order.totalAmount,
      distance: getDistance(order),
      timePosted: getTimeAgo(order.createdAt),
      order,
    };
  };

  const deliveryRequests = orders.map(transformOrder);

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev => prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]);
  };

  const handleAccept = (orderId: string) => {
    if (!driverId) {
      toast.error("Driver not initialized");
      return;
    }
    acceptMutation.mutate(orderId);
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
                    {isLoading ? "Loading..." : `${deliveryRequests.length} active delivery requests`}
                  </p>
                </div>

                {isLoading && !driverId ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Initializing driver location...
                  </div>
                ) : deliveryRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No nearby delivery requests available
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {deliveryRequests.map(request => <Card key={request.id} className="p-6 rounded-2xl hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono">
                                {request.id.slice(-6)}
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
                            <Button 
                              size="lg" 
                              className="rounded-2xl min-w-32"
                              onClick={() => handleAccept(request.order._id)}
                              disabled={acceptMutation.isPending || request.order.status !== 'pending'}
                            >
                              {acceptMutation.isPending ? "Accepting..." : "Accept"}
                            </Button>
                          </div>
                        </div>
                      </Card>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>;
};
export default Deliver;