/**
 * Learning Articles Service
 * Handles fetching and managing learning content from the database
 */

import { supabase } from '../supabase';

// Database schema interface
export interface DbLearningArticle {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string;
  read_time: string;
  author: string;
  is_featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// App-compatible interface (matches mock data structure)
export interface LearningArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  featuredImage: string;
  estimatedReadTime: string;
  views: string;
  likes: string;
  tags: string[];
  videoUrl?: string;
  isFeatured: boolean;
  difficulty?: string;
  createdAt?: string;
}

// Transform function to convert DB format to App format
function transformArticle(dbArticle: DbLearningArticle): LearningArticle {
  return {
    id: dbArticle.id,
    title: dbArticle.title,
    category: dbArticle.category,
    summary: dbArticle.excerpt,
    content: dbArticle.content,
    author: dbArticle.author,
    featuredImage: dbArticle.image_url || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e',
    estimatedReadTime: dbArticle.read_time || '5 min',
    views: '0', // Could track later
    likes: '0', // Could track later
    tags: dbArticle.tags || [],
    videoUrl: undefined,
    isFeatured: dbArticle.is_featured,
    difficulty: 'beginner', // Default value
    createdAt: dbArticle.created_at,
  };
}

export interface CategoryWithCount {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  articleCount: number;
}

/**
 * Get all published articles
 * @param category - Optional category filter
 */
export async function getPublishedArticles(category?: string) {
  try {
    console.log('📚 [Learning] Fetching published articles...', category ? `Category: ${category}` : '');
    
    if (!supabase) {
      console.warn('⚠️ [Learning] Supabase not initialized');
      return { data: null, error: new Error('Supabase not initialized') };
    }

    let query = supabase
      .from('learning_articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('❌ [Learning] Error fetching articles:', error);
      return { data: null, error };
    }
    
    console.log(`✅ [Learning] Fetched ${data?.length || 0} articles`);
    return { data: data?.map(transformArticle) || [], error: null };
  } catch (err) {
    console.error('💥 [Learning] Unexpected error in getPublishedArticles:', err);
    return { data: null, error: err };
  }
}

/**
 * Get featured articles
 */
export async function getFeaturedArticles() {
  try {
    console.log('⭐ [Learning] Fetching featured articles...');
    
    if (!supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }

    const { data, error } = await supabase
      .from('learning_articles')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('❌ [Learning] Error fetching featured articles:', error);
      return { data: null, error };
    }
    
    console.log(`✅ [Learning] Fetched ${data?.length || 0} featured articles`);
    return { data: data?.map(transformArticle) || [], error: null };
  } catch (err) {
    console.error('💥 [Learning] Unexpected error in getFeaturedArticles:', err);
    return { data: null, error: err };
  }
}

/**
 * Get article by ID
 */
export async function getArticleById(id: string) {
  try {
    console.log('📖 [Learning] Fetching article:', id);
    
    if (!supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }

    const { data, error } = await supabase
      .from('learning_articles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('❌ [Learning] Error fetching article:', error);
      return { data: null, error };
    }
    
    console.log('✅ [Learning] Article fetched successfully');
    return { data: data ? transformArticle(data as DbLearningArticle) : null, error: null };
  } catch (err) {
    console.error('💥 [Learning] Unexpected error in getArticleById:', err);
    return { data: null, error: err };
  }
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(category: string) {
  try {
    console.log('📂 [Learning] Fetching articles for category:', category);
    
    if (!supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }

    const { data, error } = await supabase
      .from('learning_articles')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ [Learning] Error fetching articles by category:', error);
      return { data: null, error };
    }
    
    console.log(`✅ [Learning] Fetched ${data?.length || 0} articles for category ${category}`);
    return { data: data?.map(transformArticle) || [], error: null };
  } catch (err) {
    console.error('💥 [Learning] Unexpected error in getArticlesByCategory:', err);
    return { data: null, error: err };
  }
}

/**
 * Get category counts
 */
export async function getCategoryCounts() {
  try {
    console.log('📊 [Learning] Fetching category counts...');
    
    if (!supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }

    const { data, error } = await supabase
      .from('learning_articles')
      .select('category')
      .order('category');
    
    if (error) {
      console.error('❌ [Learning] Error fetching category counts:', error);
      return { data: null, error };
    }
    
    // Count articles per category
    const counts: Record<string, number> = {};
    data?.forEach((article: { category: string }) => {
      counts[article.category] = (counts[article.category] || 0) + 1;
    });
    
    console.log('✅ [Learning] Category counts fetched:', counts);
    return { data: counts, error: null };
  } catch (err) {
    console.error('💥 [Learning] Unexpected error in getCategoryCounts:', err);
    return { data: null, error: err };
  }
}

/**
 * Search articles
 */
export async function searchArticles(query: string) {
  try {
    console.log('🔍 [Learning] Searching articles:', query);
    
    if (!supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }

    const { data, error } = await supabase
      .from('learning_articles')
      .select('*')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,tags.cs.{${query}}`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ [Learning] Error searching articles:', error);
      return { data: null, error };
    }
    
    console.log(`✅ [Learning] Found ${data?.length || 0} articles matching "${query}"`);
    return { data: data?.map(transformArticle) || [], error: null };
  } catch (err) {
    console.error('💥 [Learning] Unexpected error in searchArticles:', err);
    return { data: null, error: err };
  }
}
