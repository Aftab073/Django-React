import React from 'react';
import { motion } from 'framer-motion';
import {
  TwitterShareButton,
  LinkedinShareButton,
  TwitterIcon,
  LinkedinIcon,
} from 'react-share';
import { FaGithub } from 'react-icons/fa';
import NewsletterForm from '../newsletter/NewsletterForm';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Newsletter Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Subscribe to our newsletter
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Get the latest posts delivered right to your inbox.
            </p>
            <NewsletterForm />
          </div>

          {/* Social Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Follow us
            </h3>
            <div className="flex space-x-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <a href="https://github.com/aftab073" target="_blank" rel="noopener noreferrer" className="inline-block">
                  <FaGithub size={32} className="text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 p-1 rounded-full" />
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <a href="https://x.com/Hungermind0" target="_blank" rel="noopener noreferrer">
                  <TwitterIcon size={32} round />
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <a href="https://www.linkedin.com/in/aftabt7" target="_blank" rel="noopener noreferrer">
                  <LinkedinIcon size={32} round />
                </a>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400">
            © {currentYear} Modern Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 