import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  Search, 
  Clock, 
  Eye, 
  Heart, 
  BookOpen, 
  Play, 
  Star,
  GraduationCap,
  Stethoscope,
  AlertTriangle,
  User,
  LucideIcon
} from 'lucide-react-native';
import { learningCategories, mockLearningArticles, getFeaturedArticles } from '@/data/learningContent';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedButton from '@/components/AnimatedButton';
import { databaseService, supabase, LearningArticle } from '@/lib/supabase';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

// Icon mapping for category icons
const iconMap: Record<string, LucideIcon> = {
  Heart: Heart,
  GraduationCap: GraduationCap,
  Stethoscope: Stethoscope,
  BookOpen: BookOpen,
  AlertTriangle: AlertTriangle,
};

export default function LearnScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockLearningArticles>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const featuredArticles = getFeaturedArticles();
  
  // Use all categories for the main categories section
  const mainCategories = learningCategories;

  useEffect(() => {
    // Initialize database articles
    const loadArticles = async () => {
      try {
        if (supabase) {
          // Try to load articles from database
          await databaseService.getPublishedArticles();
        }
      } catch (error) {
        console.log('Using mock data for articles');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticles();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    const filtered = mockLearningArticles.filter(article => 
      article.title.toLowerCase().includes(text.toLowerCase()) ||
      article.summary.toLowerCase().includes(text.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(text.toLowerCase()))
    );
    
    setSearchResults(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: '/learn/category/[id]' as any,
      params: { id: categoryId }
    });
  };

  const handleArticlePress = (articleId: string) => {
    router.push({
      pathname: '/learn/article/[id]' as any, 
      params: { id: articleId }
    });
  };


  const renderCategoryCard = (category: typeof learningCategories[0]) => {
    const IconComponent = iconMap[category.icon];
    
    return (
      <TouchableOpacity
        key={category.id}
        style={[styles.categoryCard, { borderLeftColor: category.color }]}
        onPress={() => handleCategoryPress(category.id)}
      >
        <View style={styles.categoryContent}>
          <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '20' }]}>
            {IconComponent && (
              <IconComponent 
                size={24} 
                color={category.color} 
                strokeWidth={2}
              />
            )}
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
            <Text style={styles.articleCount}>{category.articleCount} articles</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderArticleCard = (article: typeof mockLearningArticles[0], isLarge = false) => (
    <TouchableOpacity
      key={article.id}
      style={[styles.articleCard, isLarge && styles.largeArticleCard]}
      onPress={() => handleArticlePress(article.id)}
    >
      <Image source={{ uri: article.featuredImage }} style={[styles.articleImage, isLarge && styles.largeArticleImage]} />
      
      {article.videoUrl && (
        <View style={styles.videoIndicator}>
          <Play size={16} color="white" fill="white" />
        </View>
      )}
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={[styles.articleGradient, isLarge && styles.largeArticleGradient]}
      >
        <View style={styles.articleContent}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {learningCategories.find(cat => cat.id === article.category)?.name}
            </Text>
          </View>
          
          <Text style={[styles.articleTitle, isLarge && styles.largeArticleTitle]} numberOfLines={isLarge ? 3 : 2}>
            {article.title}
          </Text>
          
          {isLarge && (
            <Text style={styles.articleSummary} numberOfLines={2}>
              {article.summary}
            </Text>
          )}
          
          <View style={styles.articleMeta}>
            <View style={styles.metaItem}>
              <Clock size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.metaText}>{article.estimatedReadTime} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Eye size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.metaText}>{article.views}</Text>
            </View>
            <View style={styles.metaItem}>
              <Heart size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.metaText}>{article.likes}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Learning Center</Text>
            <Text style={styles.subtitle}>Become the best pet parent</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            <User size={24} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search articles, tips, guides..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search Results */}
        {isSearching && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Search Results {searchResults.length > 0 && `(${searchResults.length})`}
            </Text>
            {searchResults.length > 0 ? (
              searchResults.map(article => (
                <TouchableOpacity
                  key={article.id}
                  style={styles.searchResultItem}
                  onPress={() => handleArticlePress(article.id)}
                >
                  <Image source={{ uri: article.featuredImage }} style={styles.searchResultImage} />
                  <View style={styles.searchResultContent}>
                    <Text style={styles.searchResultTitle} numberOfLines={2}>
                      {article.title}
                    </Text>
                    <Text style={styles.searchResultSummary} numberOfLines={2}>
                      {article.summary}
                    </Text>
                    <View style={styles.searchResultMeta}>
                      <Text style={styles.searchResultCategory}>
                        {learningCategories.find(cat => cat.id === article.category)?.name}
                      </Text>
                      <Text style={styles.searchResultReadTime}>{article.estimatedReadTime} min read</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No articles found for "{searchQuery}"</Text>
                <Text style={styles.noResultsSubtext}>Try different keywords or browse categories below</Text>
              </View>
            )}
          </View>
        )}

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading articles...</Text>
          </View>
        )}

        {/* Show regular content only when not searching and not loading */}
        {!isSearching && !isLoading && (
          <>
            {/* Featured Article */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Star size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Featured Article</Text>
              </View>
              {renderArticleCard(featuredArticles[0], true)}
            </View>

            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Explore Topics</Text>
              <View style={styles.categoriesContainer}>
                {mainCategories.map(renderCategoryCard)}
              </View>
            </View>

            {/* Recent Articles */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Latest Articles</Text>
              {mockLearningArticles.slice(1, 4).map(article => (
                <TouchableOpacity 
                  key={article.id} 
                  style={styles.recentArticle}
                  onPress={() => handleArticlePress(article.id)}
                >
                  <Image source={{ uri: article.featuredImage }} style={styles.recentArticleImage} />
                  <View style={styles.recentArticleContent}>
                    <Text style={styles.recentArticleTitle} numberOfLines={2}>
                      {article.title}
                    </Text>
                    <Text style={styles.recentArticleAuthor}>By {article.author}</Text>
                    <View style={styles.recentArticleMeta}>
                      <View style={styles.metaItem}>
                        <Clock size={12} color="#666" />
                        <Text style={styles.recentMetaText}>{article.estimatedReadTime} min</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Eye size={12} color="#666" />
                        <Text style={styles.recentMetaText}>{article.views}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerContent: {
    flex: 1,
  },
  profileButton: {
    padding: 10,
    backgroundColor: `${COLORS.secondary}15`,
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#333',
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginLeft: 8,
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    marginBottom: 4,
  },
  articleCount: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: COLORS.primary,
  },
  articleCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: 'white',
    width: 250,
  },
  largeArticleCard: {
    width: '100%',
  },
  articleImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  largeArticleImage: {
    height: 200,
  },
  videoIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    padding: 6,
  },
  articleGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-end',
  },
  largeArticleGradient: {
    height: 140,
  },
  articleContent: {
    padding: 16,
  },
  categoryBadge: {
    backgroundColor: `${COLORS.primary}E6`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontFamily: 'Nunito-SemiBold',
    color: 'white',
  },
  articleTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginBottom: 8,
  },
  largeArticleTitle: {
    fontSize: 20,
  },
  articleSummary: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  recentArticle: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recentArticleImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  recentArticleContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  recentArticleTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  recentArticleAuthor: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    marginBottom: 8,
  },
  recentArticleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recentMetaText: {
    fontSize: 11,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
  },
  searchResultItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchResultImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  searchResultContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  searchResultTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  searchResultSummary: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  searchResultMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchResultCategory: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  searchResultReadTime: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#999',
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    marginTop: 12,
  },
});
