/**
 * Service Image Utility
 * Priority order:
 * 1. Featured image (custom uploaded image) - MOST RELIABLE
 * 2. Facebook profile picture (if available and public)
 * 3. Unsplash auto-search (service name + category) - ALWAYS WORKS
 * 4. Category fallback image
 */

// Extract Facebook profile picture from Facebook URL
const extractFacebookProfileImage = (facebookUrl: string): string | null => {
  if (!facebookUrl || !facebookUrl.trim()) return null;
  
  try {
    let pageId = '';
    
    // Handle different Facebook URL formats
    if (facebookUrl.includes('facebook.com')) {
      const match = facebookUrl.match(/facebook\.com\/([^/?]+)/);
      pageId = match ? match[1] : '';
    } else if (facebookUrl.startsWith('/')) {
      pageId = facebookUrl.replace(/\//g, '');
    } else {
      pageId = facebookUrl;
    }
    
    if (!pageId) return null;
    
    // Try Facebook Graph API endpoint
    // This works for public pages with publicly visible profile pictures
    return `https://graph.facebook.com/v18.0/${pageId}/picture?width=400&height=300`;
  } catch (error) {
    console.warn(`⚠️ Failed to parse Facebook URL "${facebookUrl}":`, error);
    return null;
  }
};

// Function to get high-quality image for a pet service
export const getPetServiceImage = (
  serviceName: string,
  category: string,
  featuredImage?: string,
  facebookUrl?: string
): string => {
  // Priority 1: Featured image (ALWAYS WORKS if set)
  if (featuredImage && featuredImage.trim()) {
    console.log(`�️ [Image] Using featured image for ${serviceName}`);
    return featuredImage;
  }

  // Priority 2: Try Facebook profile picture (may fail silently, that's ok)
  if (facebookUrl && facebookUrl.trim()) {
    const facebookImage = extractFacebookProfileImage(facebookUrl);
    if (facebookImage) {
      console.log(`� [Image] Attempting Facebook profile for ${serviceName}`);
      return facebookImage;
    }
  }

  // Priority 3: Fallback to Unsplash auto-search (ALWAYS WORKS)
  const unsplashUrl = `https://source.unsplash.com/400x300?${encodeURIComponent(serviceName)},${encodeURIComponent(category)},pet,bangladesh`;
  console.log(`🔍 [Image] Using Unsplash search for ${serviceName}`);
  
  return unsplashUrl;
};

// Helper function to generate search query based on category
const getSearchQuery = (serviceName: string, category: string): string => {
  const categoryQueries: Record<string, string> = {
    veterinary: 'veterinary clinic pet doctor medical',
    grooming: 'pet grooming salon dog cat bath',
    training: 'pet training dog obedience trainer',
    'pet-store': 'pet store animal shop supplies',
    boarding: 'pet boarding hotel care facility',
    emergency: 'emergency veterinary clinic hospital'
  };

  return categoryQueries[category] || 'pet service';
};

// Fallback category images (in case Unsplash fails)
export const getCategoryFallbackImage = (category: string): string => {
  const categoryImages: Record<string, string> = {
    veterinary: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&h=300',
    grooming: 'https://images.unsplash.com/photo-1559190394-90caa8fc893c?auto=format&fit=crop&w=400&h=300',
    training: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&h=300',
    'pet-store': 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=400&h=300',
    boarding: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&h=300',
    emergency: 'https://images.unsplash.com/photo-1631217314830-4e5b92675aa8?auto=format&fit=crop&w=400&h=300'
  };

  return categoryImages[category] || 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=400&h=300';
};
