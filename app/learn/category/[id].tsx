import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, Eye, Heart, BookOpen } from 'lucide-react-native';
import { learningCategories } from '@/data/learningContent';
import * as learningService from '@/lib/services/learningService';
import type { LearningArticle } from '@/lib/services/learningService';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
  const [categoryArticles, setCategoryArticles] = useState<LearningArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Find the category
  const category = learningCategories.find(cat => cat.id === id);

  useEffect(() => {
    loadCategoryArticles();
  }, [id]);

  const loadCategoryArticles = async () => {
    try {
      console.log(`📚 [Category] Loading articles for category: ${id}`);
      const { data, error } = await learningService.getArticlesByCategory(id as string);
      
      if (data && data.length > 0) {
        console.log(`✅ [Category] Loaded ${data.length} articles`);
        setCategoryArticles(data);
      } else {
        console.log(`⚠️ [Category] No articles found for category ${id}`);
        setCategoryArticles([]);
      }
    } catch (error) {
      console.error('❌ [Category] Error loading articles:', error);
      setCategoryArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCategoryArticles();
    setRefreshing(false);
  }, [id]);

  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Category</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Category not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleArticlePress = (articleId: string) => {
    router.push({
      pathname: '/learn/article/[id]',
      params: { id: articleId }
    });
  };

  const toggleLike = (articleId: string) => {
    setLikedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const renderArticleItem = ({ item }: { item: LearningArticle }) => (
    <TouchableOpacity style={styles.articleCard} onPress={() => handleArticlePress(item.id)}>
      <Image source={{ uri: item.featuredImage }} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <View style={styles.articleHeader}>
          <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
          <TouchableOpacity onPress={() => toggleLike(item.id)}>
            <Heart 
              size={20} 
              color="#FF6B6B" 
              fill={likedArticles.includes(item.id) ? "#FF6B6B" : "none"} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.articleSummary} numberOfLines={3}>{item.summary}</Text>
        
        <View style={styles.articleMeta}>
          <View style={styles.metaItem}>
            <Clock size={14} color="#666" />
            <Text style={styles.metaText}>{item.estimatedReadTime} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Eye size={14} color="#666" />
            <Text style={styles.metaText}>{item.views}</Text>
          </View>
          <View style={styles.metaItem}>
            <Heart size={14} color="#666" />
            <Text style={styles.metaText}>{item.likes}</Text>
          </View>
        </View>
        
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 2).map((tag: string, index: number) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.categoryHeader}>
        <View style={styles.categoryIconWrapper}>
          <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
            <BookOpen size={20} color={category.color} />
          </View>
          <View style={[styles.articleCountBadge, { backgroundColor: category.color }]}>
            <Text style={styles.articleCountBadgeText}>
              {categoryArticles.length}
            </Text>
          </View>
        </View>
        <Text style={styles.categoryDescription}>{category.description}</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : (
        <FlatList
          data={categoryArticles}
          renderItem={renderArticleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FF6B6B']}
              tintColor="#FF6B6B"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <BookOpen size={48} color="#CCC" />
              <Text style={styles.emptyTitle}>No articles yet</Text>
              <Text style={styles.emptyMessage}>
                Articles for this category will be added soon!
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  categoryHeader: {
    backgroundColor: 'white',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryIconWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleCountBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  articleCountBadgeText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    lineHeight: 12,
  },
  categoryDescription: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  listContainer: {
    padding: 16,
  },
  articleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  articleContent: {
    padding: 16,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  articleTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginRight: 12,
  },
  articleSummary: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  articleMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
});
