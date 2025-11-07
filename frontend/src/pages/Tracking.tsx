import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, Package, MapPin, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { orderAPI, type Order } from "@/services/api";

const Tracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [trackingId, setTrackingId] = useState(orderId);

  useEffect(() => {
    if (orderId) {
      setTrackingId(orderId);
    }
  }, [orderId]);

  const { data: order, isLoading, error, refetch } = useQuery({
    queryKey: ["order", trackingId],
    queryFn: () => orderAPI.getById(trackingId),
    enabled: !!trackingId,
  });

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast.error("Please enter an order ID");
      return;
    }
    setTrackingId(orderId.trim());
    setSearchParams({ orderId: orderId.trim() });
    refetch();
  };

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
      accepted: { label: "Accepted", variant: "default" as const, icon: CheckCircle2 },
      picked_up: { label: "Picked Up", variant: "default" as const, icon: Package },
      delivered: { label: "Delivered", variant: "default" as const, icon: CheckCircle2 },
      cancelled: { label: "Cancelled", variant: "destructive" as const, icon: XCircle },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="text-sm px-3 py-1">
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
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
                  placeholder="Enter Order ID"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="flex-1 h-12 rounded-xl text-lg"
                />
                <Button type="submit" size="lg" className="px-6 rounded-xl" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                </Button>
              </div>
            </form>
            
            {isLoading && trackingId ? (
              <div className="bg-secondary/50 rounded-2xl p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading order details...</p>
              </div>
            ) : error ? (
              <div className="bg-destructive/10 rounded-2xl p-8 text-center">
                <XCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
                <p className="text-destructive font-semibold mb-2">Order not found</p>
                <p className="text-muted-foreground text-sm">Please check the order ID and try again</p>
              </div>
            ) : order ? (
              <Card className="p-6 rounded-2xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                    <p className="font-mono font-semibold text-lg">{order._id}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>Pickup Location</span>
                    </div>
                    <p className="font-semibold">{order.pickup.address || "Pickup Location"}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span>Drop-off Location</span>
                    </div>
                    <p className="font-semibold">{order.dropoff.address || "Drop-off Location"}</p>
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Items</p>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.name} (x{item.quantity})</span>
                          <span className="font-semibold">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-bold text-lg text-primary">₹{order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>
                  {order.driverId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Driver Assigned</span>
                      <span className="font-mono">Yes</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Order Date</span>
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="bg-secondary/50 rounded-2xl p-8 text-center">
                <p className="text-muted-foreground">
                  Your delivery status will appear here once you track an order
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tracking;
