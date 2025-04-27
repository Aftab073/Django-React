import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - Modern Blog</title>
        <meta name="description" content="The page you are looking for could not be found." />
      </Helmet>

      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-9xl font-bold text-primary-500 dark:text-primary-400">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Page Not Found</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="mt-8">
            <Button as={Link} to="/" variant="primary" size="lg">
              Go back home
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage; 