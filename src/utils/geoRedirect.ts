// Utility for handling IP-based geographic redirection
export const detectUserCountryAndRedirect = async () => {
  try {
    // Try multiple IP geolocation services for better reliability
    let countryCode = '';
    
    // Service 1: ipapi.co (free tier, no API key required)
    try {
      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        countryCode = data.country_code;
        console.log('Detected country from ipapi.co:', countryCode);
      }
    } catch (error) {
      console.log('ipapi.co failed, trying alternative service');
    }
    
    // Service 2: Fallback to ip-api.com if first service fails
    if (!countryCode) {
      try {
        const response = await fetch('http://ip-api.com/json/', {
          method: 'GET',
        });
        
        if (response.ok) {
          const data = await response.json();
          countryCode = data.countryCode;
          console.log('Detected country from ip-api.com:', countryCode);
        }
      } catch (error) {
        console.log('ip-api.com also failed');
      }
    }
    
    // Check if user is from India and redirect
    if (countryCode === 'IN') {
      console.log('User detected from India, redirecting to GGL India website');
      
      // Add a small delay to ensure the page has loaded
      setTimeout(() => {
        window.location.href = 'https://gglindia.com';
      }, 100);
      
      return true; // Indicates redirect will happen
    }
    
    return false; // No redirect needed
  } catch (error) {
    console.error('Error detecting user location:', error);
    return false;
  }
};

// Alternative method using browser's timezone as fallback
export const detectCountryByTimezone = () => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log('User timezone:', timezone);
    
    // Indian timezones
    const indianTimezones = [
      'Asia/Kolkata',
      'Asia/Calcutta',
      'Asia/Mumbai',
      'Asia/Delhi'
    ];
    
    if (indianTimezones.includes(timezone)) {
      console.log('User timezone suggests India location, redirecting...');
      window.location.href = 'https://gglindia.com/';
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error detecting timezone:', error);
    return false;
  }
};


