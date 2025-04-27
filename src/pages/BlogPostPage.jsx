import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from 'react-share';
import PostCard from '../components/blog/PostCard';
import Button from '../components/ui/Button';
import { fetchApi, getImageUrl, deleteApi } from '../utils/api';
import { BASE_URL, API_BASE_URL } from '../config';

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Default placeholder image path
  const defaultImage = '/placeholder.jpg';

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use the API utility
        const data = await fetchApi(`/posts/${slug}/`);
        setPost(data);

        // Fetch related posts
        const relatedData = await fetchApi(`/posts/${slug}/related/`);
        setRelatedPosts(relatedData);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteApi(`/posts/${slug}/`);
      setShowDeleteModal(false);
      // Navigate to the home/blog list page after deletion
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post. Please try again.');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 mx-auto max-w-lg">
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
        <Button onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Post not found
        </h1>
      </div>
    );
  }

  const shareUrl = window.location.href;
  
  // Get the image URL using the utility function
  let imageUrl = post.cover_image_url 
    ? post.cover_image_url  // Use the server-provided URL directly
    : (post.cover_image ? getImageUrl(post.cover_image) : defaultImage);
  
  // If image error occurred, use default image
  if (imageError) {
    // Use absolute URL for placeholder
    imageUrl = post.cover_image_url || `${BASE_URL}/media/posts/placeholder.jpg`;
  }

  // For debugging 
  console.log('Post image data:', {
    cover_image: post.cover_image,
    cover_image_url: post.cover_image_url,
    finalImageUrl: imageUrl
  });

  return (
    <>
      <Helmet>
        <title>{post.title} - Modern Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={shareUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {post.title}
              </h1>
              <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                <time dateTime={post.publishedAt}>
                  {new Date(post.published_at).toLocaleDateString()}
                </time>
                <span>•</span>
                <span>{post.reading_time || '5'} min read</span>
              </div>
            </div>
            
            {/* Post Actions */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/edit-post/${post.slug}`)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteClick}
              >
                Delete
              </Button>
            </div>
          </header>

          <div className="prose dark:prose-invert max-w-none">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-96 object-cover rounded-lg mb-8"
                onError={handleImageError}
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {post.tags && post.tags.map(tag => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
              <div className="flex space-x-2">
                <FacebookShareButton url={shareUrl}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={post.title}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <LinkedinShareButton url={shareUrl} title={post.title}>
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>
              </div>
            </div>
          </div>
        </motion.div>

        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map(relatedPost => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Delete Post
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{post.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogPostPage;