-- =====================================================
-- FIX: Pet Interactions RLS Policies
-- =====================================================
-- Run this in Supabase SQL Editor to enable pet interactions
-- (liking/disliking pets, recording swipes)
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert own interactions" ON public.pet_interactions;
DROP POLICY IF EXISTS "Users can view own interactions" ON public.pet_interactions;
DROP POLICY IF EXISTS "Users can update own interactions" ON public.pet_interactions;
DROP POLICY IF EXISTS "Users can delete own interactions" ON public.pet_interactions;

-- Enable RLS on pet_interactions table
ALTER TABLE public.pet_interactions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICY 1: INSERT - Users can record their own interactions
-- =====================================================
CREATE POLICY "Users can insert own interactions"
ON public.pet_interactions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- POLICY 2: SELECT - Users can view their own interactions
-- =====================================================
CREATE POLICY "Users can view own interactions"
ON public.pet_interactions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- =====================================================
-- POLICY 3: UPDATE - Users can update their own interactions
-- =====================================================
CREATE POLICY "Users can update own interactions"
ON public.pet_interactions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- POLICY 4: DELETE - Users can delete their own interactions
-- =====================================================
CREATE POLICY "Users can delete own interactions"
ON public.pet_interactions
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
  AND tablename = 'pet_interactions'
ORDER BY cmd, policyname;

-- Expected output: 4 policies
-- 1. Users can insert own interactions (INSERT)
-- 2. Users can view own interactions (SELECT)
-- 3. Users can update own interactions (UPDATE)
-- 4. Users can delete own interactions (DELETE)

-- Test: Check if auth.uid() works
SELECT 'Your Auth UID:' as info, auth.uid() as user_id;
