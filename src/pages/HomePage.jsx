import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PostCard from '../components/blog/PostCard';
import SearchBar from '../components/blog/SearchBar';
import Button from '../components/ui/Button';
import { useInView } from 'react-intersection-observer';
import { fetchApi } from '../utils/api';

// Mock data to use when API fails
const MOCK_POSTS = [
  {
    id: 1,
    title: 'Getting Started with React',
    slug: 'getting-started-with-react',
    excerpt: 'Learn the basics of React and build your first app.',
    content: '<p>React is a JavaScript library for building user interfaces...</p>',
    tags: ['react', 'javascript', 'frontend'],
    publishedAt: '2025-04-10T12:00:00Z',
    readingTime: 5
  },
  {
    id: 2,
    title: 'Introduction to Django REST Framework',
    slug: 'introduction-to-django-rest-framework',
    excerpt: 'Build powerful APIs with Django REST Framework.',
    content: '<p>Django REST framework is a powerful and flexible toolkit for building Web APIs...</p>',
    tags: ['django', 'python', 'backend', 'api'],
    publishedAt: '2025-04-12T12:00:00Z',
    readingTime: 7
  },
  {
    id: 3,
    title: 'Creating a Modern Blog with React and Django',
    slug: 'creating-a-modern-blog-with-react-and-django',
    excerpt: 'A comprehensive guide to building a modern blog with React and Django.',
    content: '<p>In this tutorial, we will build a modern blog application using React for the frontend and Django for the backend...</p>',
    tags: ['react', 'django', 'fullstack', 'tutorial'],
    publishedAt: '2025-04-15T12:00:00Z',
    readingTime: 10
  },
];

// Featured content
const FEATURED_CONTENT = {
  title: "The Future of Web Development",
  description: "Explore the emerging trends and technologies shaping the future of web development in 2025 and beyond.",
  image: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  link: "/blog/getting-started-with-react",
  items: [
    {
      title: "AI-Assisted Development",
      description: "How AI tools are revolutionizing the way developers work",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: "WebAssembly Evolution",
      description: "Bringing high-performance computing to the browser",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Edge Computing",
      description: "Moving computation closer to users for faster experiences",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
  ],
};

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { ref: featuredRef, inView: featuredInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to fetch real data
        const data = await fetchApi('/posts/');
        setPosts(data);
        setFeaturedPosts(data.slice(0, 3));
        setTags([...new Set(data.flatMap(post => post.tags))]);
        setUseMockData(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts from API. Displaying mock data.');
        
        // Use mock data on failure
        setPosts(MOCK_POSTS);
        setFeaturedPosts(MOCK_POSTS.slice(0, 3));
        setTags([...new Set(MOCK_POSTS.flatMap(post => post.tags))]);
        setUseMockData(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  return (
    <>
      <Helmet>
        <title>Modern Blog - Home</title>
        <meta name="description" content="Welcome to our modern blog. Discover the latest articles and insights." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Welcome to Our Blog
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover the latest articles, insights, and stories from our community.
          </p>
        </motion.div>

        {/* Featured Content Section */}
        <motion.div
          ref={featuredRef}
          initial={{ opacity: 0, y: 20 }}
          animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-20 bg-gradient-to-r from-primary-100 to-primary-50 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden shadow-lg"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-2">
                Featured Content
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl mb-4">
                {FEATURED_CONTENT.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                {FEATURED_CONTENT.description}
              </p>
              
              <div className="space-y-4 mb-8">
                {FEATURED_CONTENT.items.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 text-primary-600 dark:text-primary-400">
                      {item.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <Button as={Link} to={FEATURED_CONTENT.link} variant="primary" size="lg">
                  Read Article
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src={FEATURED_CONTENT.image} 
                alt="Future of Web Development" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Search and Tags */}
        <div className="mb-12">
          <SearchBar onSearch={setSearchQuery} />
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Button
              variant={!selectedTag ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag(null)}
            >
              All
            </Button>
            {tags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && useMockData && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 mx-auto max-w-3xl">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {error} You can continue browsing with sample content.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Featured Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section ref={ref}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Latest Posts
          </h2>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No posts found.</p>
            </div>
          ) : (
            <motion.div
              initial={false}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </motion.div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mt-20">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-12 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Want to Learn More?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Explore our comprehensive guides and tutorials on web development, design principles, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button as={Link} to="/about" variant="primary" size="lg" className="transform transition hover:-translate-y-0.5">
                  About Us
                </Button>
                <Button as={Link} to="/contact" variant="outline" size="lg" className="transform transition hover:-translate-y-0.5">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section id="newsletter" className="mt-20">
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg overflow-hidden">
            <div className="px-6 py-12 md:p-12">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Subscribe to Our Newsletter
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Get the latest posts delivered right to your inbox. No spam, ever.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-grow px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                  <Button variant="primary" onClick={() => alert('Subscription successful!')}>
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;