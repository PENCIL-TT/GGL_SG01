
import { useEffect, useState } from 'react';
import { detectUserCountryAndRedirect, detectCountryByTimezone } from '@/utils/geoRedirect';

export const useGeoRedirect = () => {
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const handleGeoRedirection = async () => {
      // Prevent multiple checks
      if (hasChecked) return;
      
      setHasChecked(true);
      
      try {
        // First try IP-based detection
        const ipRedirectTriggered = await detectUserCountryAndRedirect();
        
        // If IP detection failed or didn't trigger redirect, try timezone fallback
        if (!ipRedirectTriggered) {
          const timezoneRedirectTriggered = detectCountryByTimezone();
          
          if (!timezoneRedirectTriggered) {
            console.log('User not detected as being from India');
          }
        }
      } catch (error) {
        console.error('Geo-redirection error:', error);
      }
    };

    // Run the check immediately
    handleGeoRedirection();
  }, [hasChecked]);

  return {};
};
