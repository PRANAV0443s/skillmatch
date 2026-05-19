const getApiBaseUrl = () => {
    // Check if an explicit API base URL is provided in the environment variables
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }
    
    // Dynamic fallback for local network mobile testing
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.endsWith('.vercel.app')) {
        // If accessed via a local IP (e.g. 192.168.1.15:5173), dynamically point to that same IP's backend port
        return `http://${hostname}:8080`;
    }
    
    // Default to localhost
    return 'http://localhost:8080';
};

export const API_BASE_URL = getApiBaseUrl();
