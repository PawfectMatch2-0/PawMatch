-- =====================================================
-- FIX: Pet Favorites RLS Policies
-- =====================================================
-- Run this in Supabase SQL Editor to enable saving favorites
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.pet_favorites;
DROP POLICY IF EXISTS "Users can view own favorites" ON public.pet_favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.pet_favorites;

-- Enable RLS on pet_favorites table
ALTER TABLE public.pet_favorites ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICY 1: INSERT - Users can add to their favorites
-- =====================================================
CREATE POLICY "Users can insert own favorites"
ON public.pet_favorites
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- POLICY 2: SELECT - Users can view their own favorites
-- =====================================================
CREATE POLICY "Users can view own favorites"
ON public.pet_favorites
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- =====================================================
-- POLICY 3: DELETE - Users can remove from their favorites
-- =====================================================
CREATE POLICY "Users can delete own favorites"
ON public.pet_favorites
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 
  policyname,
  cmd as operation,
  roles::text,
  qual as using_expression,
  with_check as check_expression
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'pet_favorites'
ORDER BY cmd, policyname;

-- Expected output: 3 policies
-- 1. Users can insert own favorites (INSERT)
-- 2. Users can view own favorites (SELECT)
-- 3. Users can delete own favorites (DELETE)
