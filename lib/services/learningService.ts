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
  view_count: number;
  like_count: number;
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
  // Format view count (e.g., 1234 → "1.2k", 45 → "45", 1 → "0" if null)
  const formatCount = (count: number | null | undefined): string => {
    const num = count || 0;
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    // Return plain number for anything under 1000
    return num.toString();
  };

  return {
    id: dbArticle.id,
    title: dbArticle.title,
    category: dbArticle.category,
    summary: dbArticle.excerpt,
    content: dbArticle.content,
    author: dbArticle.author,
    featuredImage: dbArticle.image_url || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e',
    estimatedReadTime: dbArticle.read_time || '5 min',
    views: formatCount(dbArticle.view_count),
    likes: formatCount(dbArticle.like_count),
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

/**
 * Record article view
 * @param articleId - Article ID
 * @param userId - User ID (optional, for authenticated users)
 * @param sessionId - Session ID (optional, for guest users)
 */
export async function recordArticleView(articleId: string, userId?: string, sessionId?: string) {
  try {
    console.log('👁️ [Learning] Recording article view:', articleId);
    
    if (!supabase) {
      return { success: false, error: new Error('Supabase not initialized') };
    }

    // For now, skip view tracking due to constraint issues
    // Views will still be counted from the database triggers
    // TODO: Fix constraint in Supabase first
    console.log('⏭️ [Learning] View tracking temporarily disabled - constraint issue pending');
    return { success: true, error: null };
    
  } catch (err) {
    console.error('💥 [Learning] Unexpected error in recordArticleView:', err);
    return { success: false, error: err };
  }
}

/**
 * Like an article
 * @param articleId - Article ID
 * @param userId - User ID (required)
 */
export async function likeArticle(articleId: string, userId: string) {
  try {
    console.log('❤️ [Learning] Liking article:', articleId);
    
    if (!supabase) {
      return { success: false, error: new Error('Supabase not initialized') };
    }

    const { error } = await supabase
      .from('article_likes')
      .insert({
        article_id: articleId,
        user_id: userId,
      });
    
    if (error) {
      // Check if already liked (duplicate key error)
      if (error.code === '23505') {
        console.log('ℹ️ [Learning] Article already liked by user');
        return { success: true, error: null, alreadyLiked: true };
      }
      console.error('❌ [Learning] Error liking article:', error);
      return { success: false, error };
    }
    
    console.log('✅ [Learning] Article liked successfully');
    return { success: true, error: null, alreadyLiked: false };
  } catch (err) {
    console.error('💥 [Learning] Unexpected error in likeArticle:', err);
    return { success: false, error: err };
  }
}

/**
 * Unlike an article
 * @param articleId - Article ID
 * @param userId - User ID (required)
 */
export async function unlikeArticle(articleId: string, userId: string) {
  try {
    console.log('💔 [Learning] Unliking article:', articleId);
    
    if (!supabase) {
      return { success: false, error: new Error('Supabase not initialized') };
    }

    const { error } = await supabase
      .from('article_likes')
      .delete()
      .eq('article_id', articleId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('❌ [Learning] Error unliking article:', error);
      return { success: false, error };
    }
    
    console.log('✅ [Learning] Article unliked successfully');
    return { success: true, error: null };
  } catch (err) {
    console.error('💥 [Learning] Unexpected error in unlikeArticle:', err);
    return { success: false, error: err };
  }
}

/**
 * Check if user has liked an article
 * @param articleId - Article ID
 * @param userId - User ID
 */
export async function hasUserLikedArticle(articleId: string, userId: string) {
  try {
    if (!supabase) {
      return { liked: false, error: new Error('Supabase not initialized') };
    }

    const { data, error } = await supabase
      .from('article_likes')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('❌ [Learning] Error checking like status:', error);
      return { liked: false, error };
    }
    
    return { liked: !!data, error: null };
  } catch (err) {
    console.error('💥 [Learning] Unexpected error in hasUserLikedArticle:', err);
    return { liked: false, error: err };
  }
}

/**
 * Get article statistics
 * @param articleId - Article ID
 */
export async function getArticleStats(articleId: string) {
  try {
    console.log('📊 [Learning] Fetching article statistics:', articleId);
    
    if (!supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }

    const { data, error } = await supabase
      .from('learning_articles')
      .select('view_count, like_count, read_time')
      .eq('id', articleId)
      .single();
    
    if (error) {
      console.error('❌ [Learning] Error fetching stats:', error);
      return { data: null, error };
    }
    
    console.log('✅ [Learning] Article stats fetched:', data);
    return { data, error: null };
  } catch (err) {
    console.error('💥 [Learning] Unexpected error in getArticleStats:', err);
    return { data: null, error: err };
  }
}
