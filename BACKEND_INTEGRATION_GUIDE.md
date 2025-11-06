# Backend Integration Guide

This guide explains how to use the Supabase backend services in your PawMatch app.

## 📦 Services Overview

All backend operations are handled through dedicated service modules located in `lib/services/`:

- **`authService`** - User authentication (sign up, sign in, OAuth)
- **`petService`** - Pet data operations (fetch, search, favorites, interactions)
- **`shopService`** - Pet services/shops data (veterinary, grooming, shelters, etc.)
- **`databaseService`** - General database operations (from supabase.ts)

## 🔐 Authentication

### Using Auth Service

```typescript
import { authService } from '@/lib/services';

// Sign up with email/password
const { user, error } = await authService.signUp({
  email: 'user@example.com',
  password: 'securePassword123',
  fullName: 'John Doe'
});

// Sign in with email/password
const { user, error } = await authService.signIn({
  email: 'user@example.com',
  password: 'securePassword123'
});

// Sign in with Google OAuth
await authService.signInWithGoogle();

// Sign out
await authService.signOut();

// Get current user
const user = await authService.getCurrentUser();

// Get user profile from database
const profile = await authService.getUserProfile(userId);

// Update profile
const updatedProfile = await authService.updateProfile(userId, {
  full_name: 'Jane Doe',
  phone: '+1234567890',
  location: 'Dhaka, Bangladesh'
});

// Reset password
await authService.resetPassword('user@example.com');
```

### Using useAuth Hook (Context)

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, profile, signIn, signOut, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  
  if (!user) {
    return <LoginButton onPress={signIn} />;
  }

  return (
    <View>
      <Text>Welcome {profile?.full_name}</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}
```

## 🐾 Pet Operations

### Using Pet Service Directly

```typescript
import { petService } from '@/lib/services';

// Get all available pets
const pets = await petService.getAvailablePets(limit, offset);

// Get pets for swiping (excludes already interacted)
const swipePets = await petService.getPetsForSwipe(userId, 20);

// Get single pet with details
const pet = await petService.getPetById(petId);

// Record swipe interaction
await petService.recordInteraction(userId, petId, 'like'); // 'like' | 'pass' | 'super_like'

// Add to favorites
await petService.addToFavorites(userId, petId);

// Remove from favorites
await petService.removeFromFavorites(userId, petId);

// Get user's favorites
const favorites = await petService.getUserFavorites(userId);

// Check if pet is favorited
const isFavorited = await petService.isPetFavorited(userId, petId);

// Search pets
const searchResults = await petService.searchPets({
  breed: 'Golden Retriever',
  size: 'large',
  gender: 'male',
  location: 'Dhaka',
  maxAge: 5
});
```

### Using Pet Hooks (Recommended)

```typescript
import { usePets, usePetsForSwipe, useFavorites, useSearchPets } from '@/hooks/usePets';

// Get all pets
function PetList() {
  const { pets, loading, error, refetch } = usePets();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <FlatList
      data={pets}
      renderItem={({ item }) => <PetCard pet={item} />}
      onRefresh={refetch}
    />
  );
}

// Swipeable cards
function SwipeScreen() {
  const { user } = useAuth();
  const { pets, loading, recordSwipe } = usePetsForSwipe(user?.id);
  
  const handleSwipe = (pet, direction) => {
    if (direction === 'right') {
      recordSwipe(pet.id, 'like');
    } else if (direction === 'left') {
      recordSwipe(pet.id, 'pass');
    }
  };
  
  return <SwipeCards pets={pets} onSwipe={handleSwipe} />;
}

// Favorites management
function FavoritesScreen() {
  const { user } = useAuth();
  const { favorites, loading, addToFavorites, removeFromFavorites } = useFavorites(user?.id);
  
  return (
    <FlatList
      data={favorites}
      renderItem={({ item }) => (
        <PetCard 
          pet={item} 
          onUnfavorite={() => removeFromFavorites(item.id)}
        />
      )}
    />
  );
}

// Search pets
function SearchScreen() {
  const { pets, loading, searchPets } = useSearchPets();
  
  const handleSearch = () => {
    searchPets({
      breed: 'Husky',
      size: 'medium',
      location: 'Dhaka'
    });
  };
  
  return <SearchResults pets={pets} loading={loading} />;
}
```

## 🏪 Shop/Service Operations

### Using Shop Service

```typescript
import { shopService } from '@/lib/services';

// Get all shops
const shops = await shopService.getAllShops(limit, offset);

// Get shops by type
const vets = await shopService.getShopsByType('veterinary');
const groomers = await shopService.getShopsByType('grooming');
const shelters = await shopService.getShopsByType('shelter');

// Get single shop
const shop = await shopService.getShopById(shopId);

// Get verified shops only
const verifiedShops = await shopService.getVerifiedShops();

// Search shops
const results = await shopService.searchShops('Happy Paws');

// Get shops by location
const localShops = await shopService.getShopsByLocation('Dhaka');

// Get shops by service
const trainers = await shopService.getShopsByService('dog training');
```

### Using Shop Hooks

```typescript
import { useShops, useShopsByType, useVerifiedShops, useSearchShops } from '@/hooks/useShops';

// Get all shops
function ShopList() {
  const { shops, loading, error, refetch } = useShops();
  
  return (
    <FlatList
      data={shops}
      renderItem={({ item }) => <ShopCard shop={item} />}
    />
  );
}

// Filter by type
function VetList() {
  const { shops, loading } = useShopsByType('veterinary');
  
  return <ShopGrid shops={shops} loading={loading} />;
}

// Verified shops only
function TrustedShops() {
  const { shops, loading } = useVerifiedShops();
  
  return <ShopCarousel shops={shops} />;
}

// Search functionality
function ShopSearch() {
  const { shops, loading, searchShops, searchByLocation } = useSearchShops();
  
  return (
    <View>
      <SearchBar onSearch={searchShops} />
      <LocationPicker onSelect={searchByLocation} />
      <ShopResults shops={shops} loading={loading} />
    </View>
  );
}
```

## 📊 Data Types

### Pet Interface
```typescript
interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  color: string;
  personality: string[];
  description: string;
  images: string[];
  location: string;
  contact_info: any;
  adoption_status: 'available' | 'pending' | 'adopted';
  owner_id?: string;
  shelter_id?: string;
  created_at: string;
  updated_at: string;
}
```

### PetShop Interface
```typescript
interface PetShop {
  id: string;
  name: string;
  type: 'shelter' | 'veterinary' | 'grooming' | 'training' | 'pet_store' | 'daycare';
  description: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  location: any;
  images: string[];
  services: string[];
  opening_hours?: any;
  rating?: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
}
```

### UserProfile Interface
```typescript
interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  preferences?: any;
  is_admin?: boolean;
  created_at: string;
  updated_at: string;
}
```

## 🔄 Migration from Mock Data

### Before (Mock Data)
```typescript
import { mockPets } from '@/data/pets';

function MyScreen() {
  const [pets, setPets] = useState(mockPets);
  // ...
}
```

### After (Supabase Backend)
```typescript
import { usePets } from '@/hooks/usePets';

function MyScreen() {
  const { pets, loading, error } = usePets();
  // ...
}
```

## 🚀 Quick Start Examples

### Complete Authentication Flow
```typescript
import { authService } from '@/lib/services';
import { useState } from 'react';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { user, error } = await authService.signIn({ email, password });
    
    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
      // Navigate to home screen
      router.replace('/(tabs)');
    }
    setLoading(false);
  };

  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
      <Button title="Login" onPress={handleLogin} disabled={loading} />
    </View>
  );
}
```

### Complete Swipe Card Flow
```typescript
import { usePetsForSwipe } from '@/hooks/usePets';
import { useAuth } from '@/hooks/useAuth';

function DiscoverScreen() {
  const { user } = useAuth();
  const { pets, loading, recordSwipe } = usePetsForSwipe(user?.id || '');

  const handleSwipeLeft = (pet) => {
    recordSwipe(pet.id, 'pass');
  };

  const handleSwipeRight = (pet) => {
    recordSwipe(pet.id, 'like');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View>
      {pets.map(pet => (
        <PetCard
          key={pet.id}
          pet={pet}
          onSwipeLeft={() => handleSwipeLeft(pet)}
          onSwipeRight={() => handleSwipeRight(pet)}
        />
      ))}
    </View>
  );
}
```

## ⚙️ Environment Setup

Ensure your `.env` file has the correct Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🐛 Error Handling

All services include proper error handling:

```typescript
const { pets, loading, error } = usePets();

if (error) {
  return <ErrorView message={error} onRetry={refetch} />;
}
```

## 📝 Notes

- All hooks automatically handle loading states
- Services return empty arrays/null on errors (check console for details)
- User authentication is required for favorites and interactions
- Services work seamlessly with your existing Supabase database

## 🎯 Next Steps

1. Replace mock data imports with service hooks
2. Test authentication flow
3. Verify pet data is loading from Supabase
4. Test favorites and interactions
5. Integrate shop data in relevant screens

Need help? Check the individual service files in `lib/services/` for full documentation.
