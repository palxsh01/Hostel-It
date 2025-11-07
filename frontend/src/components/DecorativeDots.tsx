const DecorativeDots = () => {
  return (
    <>
      <div className="absolute top-[15%] right-[20%] w-3 h-3 rounded-full bg-[hsl(var(--dot-green))] animate-pulse" 
           style={{ animationDelay: "0s", animationDuration: "3s" }} />
      <div className="absolute top-[25%] right-[15%] w-2 h-2 rounded-full bg-[hsl(var(--dot-purple))] animate-pulse" 
           style={{ animationDelay: "0.5s", animationDuration: "3s" }} />
      <div className="absolute top-[30%] right-[25%] w-3 h-3 rounded-full bg-[hsl(var(--dot-orange))] animate-pulse" 
           style={{ animationDelay: "1s", animationDuration: "3s" }} />
      <div className="absolute bottom-[25%] right-[18%] w-2 h-2 rounded-full bg-[hsl(var(--dot-cyan))] animate-pulse" 
           style={{ animationDelay: "1.5s", animationDuration: "3s" }} />
      <div className="absolute bottom-[15%] right-[12%] w-4 h-4 rounded-full bg-[hsl(var(--dot-pink))] animate-pulse" 
           style={{ animationDelay: "2s", animationDuration: "3s" }} />
    </>
  );
};

export default DecorativeDots;
