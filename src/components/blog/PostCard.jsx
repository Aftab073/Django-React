import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../utils/api';

const PostCard = ({ post = {} }) => {
  const [imageError, setImageError] = useState(false);
  
  // Handle missing data with default values
  const {
    id = 1,
    slug = 'sample-post',
    title = 'Sample Post Title',
    excerpt = 'This is a sample post excerpt when real data is not available.',
    cover_image_url = '',
    cover_image = '',
    publishedAt = new Date().toISOString(),
    readingTime = '3',
    tags = ['sample']
  } = post;

  // If cover_image_url is a full URL starting with http, use it directly
  // Otherwise, use a local placeholder
  const serverPlaceholder = 'http://localhost:8000/media/posts/placeholder.jpg';
  const defaultImage = serverPlaceholder;

  // Determine the image URL to use
  let imageUrl = '';
  
  if (imageError) {
    imageUrl = serverPlaceholder;
  } else if (cover_image_url && cover_image_url.startsWith('http')) {
    imageUrl = cover_image_url;
  } else if (cover_image) {
    imageUrl = getImageUrl(cover_image);
  } else {
    imageUrl = serverPlaceholder;
  }

  const handleImageError = () => {
    console.log("Image failed to load:", imageUrl);
    setImageError(true);
  };

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <Link to={`/blog/${slug}`}>
        <img
          src={imageUrl}
          onError={handleImageError}
          alt={title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs font-medium px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link to={`/blog/${slug}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {excerpt}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>
            {new Date(publishedAt).toLocaleDateString()}
          </span>
          <span>{readingTime} min read</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard; 