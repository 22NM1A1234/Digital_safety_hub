import { supabase } from "@/integrations/supabase/client";

export const clearAllData = async () => {
  try {
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear any potential cached data
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
    }
    
    // Reload the page to reset all state
    window.location.href = '/';
    
  } catch (error) {
    console.error('Error clearing data:', error);
    // Force reload even if there's an error
    window.location.reload();
  }
};