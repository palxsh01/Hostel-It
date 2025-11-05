import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "male",
    collegeId: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement signup logic
    console.log("Signing up:", formData);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" 
         style={{ background: "var(--gradient-bg)" }}>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md bg-card rounded-[3rem] shadow-2xl p-8 md:p-12 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Join Hostel-it
              </h1>
              <p className="text-muted-foreground">
                Create your account to get started
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="h-12 rounded-xl"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">College Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-12 rounded-xl"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="h-12 rounded-xl"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="collegeId">College ID</Label>
                <Input
                  id="collegeId"
                  type="text"
                  placeholder="STU123456"
                  value={formData.collegeId}
                  onChange={(e) => setFormData({...formData, collegeId: e.target.value})}
                  className="h-12 rounded-xl"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <Label>Gender</Label>
                <RadioGroup 
                  value={formData.gender} 
                  onValueChange={(value) => setFormData({...formData, gender: value})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="font-normal cursor-pointer">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button type="submit" className="w-full h-12 rounded-xl text-lg font-semibold">
                Create Account
              </Button>
            </form>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Signup;
