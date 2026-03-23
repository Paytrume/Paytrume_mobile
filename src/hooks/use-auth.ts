// hooks/use-auth.ts
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      // Your auth check logic
    //   const user = await getUser();
      const user = 'mockUser'; // Mock user for demonstration
      setIsAuthenticated(!!user);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  return { isAuthenticated, isLoading };
};
