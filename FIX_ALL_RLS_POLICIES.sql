-- =====================================================
-- COMPLETE RLS FIX - Run this to fix ALL RLS policies
-- =====================================================
-- This script sets up RLS policies for:
-- 1. user_profiles
-- 2. pet_interactions  ← THIS FIXES YOUR CURRENT ERROR!
-- 3. pet_favorites
-- Run this ONCE in Supabase SQL Editor to enable all features
-- =====================================================

-- =====================================================
-- PART 1: USER PROFILES
-- =====================================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own profile"
ON public.user_profiles FOR INSERT TO authenticated
WITH CHECK (true);  -- Permissive for first-time profile creation

CREATE POLICY "Users can view own profile"
ON public.user_profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE TO authenticated
USING (auth.uid() = id) WITH CHECK (true);

CREATE POLICY "Users can delete own profile"
ON public.user_profiles FOR DELETE TO authenticated
USING (auth.uid() = id);

-- =====================================================
-- PART 2: PET INTERACTIONS (Swipes/Likes/Dislikes)
-- THIS IS THE CRITICAL PART THAT FIXES YOUR ERROR!
-- =====================================================
DROP POLICY IF EXISTS "Users can insert own interactions" ON public.pet_interactions;
DROP POLICY IF EXISTS "Users can view own interactions" ON public.pet_interactions;
DROP POLICY IF EXISTS "Users can update own interactions" ON public.pet_interactions;
DROP POLICY IF EXISTS "Users can delete own interactions" ON public.pet_interactions;

ALTER TABLE public.pet_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own interactions"
ON public.pet_interactions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own interactions"
ON public.pet_interactions FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own interactions"
ON public.pet_interactions FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own interactions"
ON public.pet_interactions FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- =====================================================
-- PART 3: PET FAVORITES (Saved Pets)
-- =====================================================
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.pet_favorites;
DROP POLICY IF EXISTS "Users can view own favorites" ON public.pet_favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.pet_favorites;

ALTER TABLE public.pet_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own favorites"
ON public.pet_favorites FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own favorites"
ON public.pet_favorites FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
ON public.pet_favorites FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- =====================================================
-- VERIFICATION - Check all policies were created
-- =====================================================

-- User Profiles policies
SELECT 
  'USER_PROFILES' as table_name,
  policyname,
  cmd as operation,
  with_check as check_expression
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- Pet Interactions policies
SELECT 
  'PET_INTERACTIONS' as table_name,
  policyname,
  cmd as operation,
  with_check as check_expression
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'pet_interactions'
ORDER BY cmd, policyname;

-- Pet Favorites policies
SELECT 
  'PET_FAVORITES' as table_name,
  policyname,
  cmd as operation,
  with_check as check_expression
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'pet_favorites'
ORDER BY cmd, policyname;

-- Check your auth UID
SELECT 'Current Auth UID:' as info, auth.uid() as user_id;

-- =====================================================
-- Expected Results:
-- - 4-5 policies for user_profiles
-- - 4 policies for pet_interactions ← CRITICAL!
-- - 3 policies for pet_favorites
-- - auth.uid() should show: 703d7ccc-cc09-43ef-b6df-b3544e315d56
-- =====================================================

