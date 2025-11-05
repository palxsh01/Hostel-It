import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement OTP sending logic
    console.log("Sending OTP to:", phoneNumber);
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement OTP verification logic
    console.log("Verifying OTP:", otp);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" 
         style={{ background: "var(--gradient-bg)" }}>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md bg-card rounded-[3rem] shadow-2xl p-8 md:p-12 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Login to continue your deliveries
              </p>
            </div>
            
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full h-12 rounded-xl text-lg font-semibold">
                  Send OTP
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="h-12 rounded-xl text-center text-lg tracking-widest"
                    maxLength={6}
                    required
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    OTP sent to {phoneNumber}
                  </p>
                </div>
                
                <Button type="submit" className="w-full h-12 rounded-xl text-lg font-semibold">
                  Verify & Login
                </Button>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setOtpSent(false)}
                >
                  Change Phone Number
                </Button>
              </form>
            )}
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary font-semibold hover:underline">
                  Sign up
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

export default Login;
