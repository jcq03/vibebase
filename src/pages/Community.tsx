import { Users } from "lucide-react";

const Community = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
          <Users className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold mb-3">Coming Soon...</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          We're building something amazing. The community feature will be available soon!
        </p>
      </div>
    </div>
  );
};

export default Community;
