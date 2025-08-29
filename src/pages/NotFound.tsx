import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
            <Icons.alertCircle className="w-24 h-24 text-destructive" />
        </div>
        <div>
            <h1 className="text-6xl font-bold">404</h1>
            <p className="text-2xl text-muted-foreground mt-2">Oops! Page not found</p>
            <p className="text-muted-foreground mt-1">The page you are looking for does not exist or has been moved.</p>
        </div>
        <Button asChild>
          <Link to="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
