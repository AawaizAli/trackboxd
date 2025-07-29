// hooks/useUser.ts
import { useState, useEffect } from "react";

export default function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/me");
        if (!response.ok) throw new Error("Failed to fetch user");
        
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}