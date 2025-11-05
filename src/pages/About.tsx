import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Package, Users, Clock, Shield } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Package,
      title: "Campus-Only Delivery",
      description: "All deliveries happen within campus boundaries, ensuring quick and secure service."
    },
    {
      icon: Users,
      title: "Student-to-Student",
      description: "Fellow students deliver your items, creating earning opportunities for peers."
    },
    {
      icon: Clock,
      title: "Fast & Reliable",
      description: "Get your items delivered quickly with real-time tracking throughout the journey."
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "All students are verified with college ID, ensuring a trusted delivery network."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" 
         style={{ background: "var(--gradient-bg)" }}>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 px-6 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="bg-card rounded-[3rem] shadow-2xl p-8 md:p-16 space-y-12">
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  About Hostel-it
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  A peer-to-peer delivery platform built exclusively for college students, 
                  connecting those who need items delivered with students looking to earn.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="space-y-3 p-6 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-6 pt-8 border-t border-border">
                <h2 className="text-2xl font-bold text-foreground">How It Works</h2>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Create Your Account</h4>
                      <p className="text-muted-foreground">Sign up with your college email and phone number</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Place an Order</h4>
                      <p className="text-muted-foreground">Select pickup and drop-off locations within campus</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Track Your Delivery</h4>
                      <p className="text-muted-foreground">Watch as a fellow student picks up and delivers your item</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default About;
