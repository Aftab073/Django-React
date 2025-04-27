import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Modern Blog</title>
        <meta name="description" content="Learn more about our modern blog platform and our mission to share valuable content." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose dark:prose-invert max-w-none"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            About Modern Blog
          </h1>
          
          <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg mb-8 border-l-4 border-primary-500">
            <p className="text-primary-700 dark:text-primary-300 font-medium">
              Our mission is to share knowledge, inspire creativity, and build a community of like-minded individuals passionate about technology and design.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Our Story
          </h2>
          <p>
            Modern Blog was founded in 2025 with a simple goal: to create a platform where developers and designers could share their knowledge and experiences with the wider community. What started as a small personal blog has grown into a comprehensive resource for anyone interested in web development, design, and the latest tech trends.
          </p>
          
          <div className="my-8">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
              alt="Our team" 
              className="rounded-lg shadow-md w-full h-auto object-cover"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              Our diverse team of contributors from around the world
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            What We Cover
          </h2>
          <p>
            Our content spans a wide range of topics in the tech and design world:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Frontend Development (React, Vue, Angular)</li>
            <li>Backend Technologies (Django, Node.js, Express)</li>
            <li>UI/UX Design Principles</li>
            <li>DevOps and Deployment Strategies</li>
            <li>Career Advice and Professional Growth</li>
            <li>Industry News and Trends</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Join Our Community
          </h2>
          <p>
            We believe in the power of community and knowledge sharing. Here's how you can get involved:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Write for Us</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Share your expertise with our growing audience and establish yourself as a thought leader.
              </p>
              <Button variant="outline" as={Link} to="/contact">
                Become a Contributor
              </Button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Subscribe</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Never miss an update. Get our latest articles delivered straight to your inbox.
              </p>
              <Button variant="primary" as={Link} to="/#newsletter">
                Join Newsletter
              </Button>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="text-center p-4">
              <div className="mx-auto bg-primary-100 dark:bg-primary-900/50 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We embrace new technologies and ideas
              </p>
            </div>
            <div className="text-center p-4">
              <div className="mx-auto bg-primary-100 dark:bg-primary-900/50 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Accessibility</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Content should be available to everyone
              </p>
            </div>
            <div className="text-center p-4">
              <div className="mx-auto bg-primary-100 dark:bg-primary-900/50 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Community</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We grow and learn together
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Contact Us
          </h2>
          <p>
            Have questions, suggestions, or just want to say hello? We'd love to hear from you.
          </p>
          <div className="mt-4 mb-8">
            <Button variant="primary" as={Link} to="/contact" size="lg">
              Get in Touch
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AboutPage; 