import React, { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../components/ui/Button';
import { fetchApi, postFormData } from '../utils/api';

// Lazy load ReactQuill to avoid SSR issues
const ReactQuill = lazy(() => import('react-quill'));

// Load the CSS only when ReactQuill is used
const ReactQuillCSS = () => {
  React.useEffect(() => {
    import('react-quill/dist/quill.snow.css');
  }, []);
  return null;
};

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  excerpt: yup.string().required('Excerpt is required').max(200, 'Excerpt should be less than 200 characters'),
  content: yup.string().required('Content is required').min(50, 'Content should be at least 50 characters'),
  tags: yup.string(),
  coverImage: yup.mixed()
    .test('fileSize', 'File too large (max: 5MB)', value => {
      if (!value) return true;
      return value.size <= 5000000; // 5MB
    })
    .test('fileType', 'Unsupported file format', value => {
      if (!value) return true;
      return ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(value.type);
    }),
});

// The rich text editor toolbar configuration
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

const EditPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [post, setPost] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isValid, dirtyFields },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const content = watch('content');
  const title = watch('title');
  const excerpt = watch('excerpt');
  const tags = watch('tags');

  // Fetch post data when component mounts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const data = await fetchApi(`/posts/${slug}/`);
        setPost(data);
        
        // Set form values from fetched post
        reset({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags.toString(),
        });

        // Set image preview if available
        if (data.cover_image_url) {
          setCoverImagePreview(data.cover_image_url);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setSubmitError('Failed to load post data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError('Image too large. Please select an image under 5MB.');
        return;
      }
      
      // Check file type
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        setSubmitError('Invalid file type. Please select a JPEG, PNG, WebP or GIF image.');
        return;
      }
      
      setValue('coverImage', file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.onerror = () => {
        setSubmitError('Failed to read the image file. Please try another image.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Parse tags string to array
  const tagsArray = useMemo(() => {
    if (!tags) return [];
    return tags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
  }, [tags]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      console.log("Form data before submission:", data);
      
      const formData = new FormData();
      
      // Append all form data to FormData
      Object.keys(data).forEach(key => {
        if (key === 'tags') {
          // Convert tags string to array
          formData.append(key, JSON.stringify(tagsArray));
        } else if (key === 'content') {
          // Make sure content is a string
          formData.append(key, data[key] || '');
        } else if (key === 'coverImage') {
          // Only append if a new image was selected
          const file = data[key];
          if (file) {
            console.log("Appending image file:", file.name, file.type, file.size);
            formData.append('cover_image', file);
          }
        } else {
          formData.append(key, data[key]);
        }
      });

      // Log all form data being sent
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Use the API utility with the PATCH method for update
      const result = await postFormData(`/posts/${slug}/`, formData, 'PATCH');
      console.log("API response:", result);
      navigate(`/blog/${result.slug}`);
    } catch (error) {
      console.error('Error updating post:', error);
      setSubmitError(error.message || 'Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Post - Modern Blog</title>
        <meta name="description" content="Edit your blog post and update your content." />
      </Helmet>
      <ReactQuillCSS />

      <div className="bg-gray-50 dark:bg-gray-900 py-8 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Post
            </h1>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Edit Post' : 'Preview Post'}
              </Button>
              <Button
                onClick={() => navigate(`/blog/${slug}`)}
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </div>

          {submitError && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 p-4 rounded-md">
              <p className="font-medium">Error: {submitError}</p>
            </div>
          )}

          {showPreview ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="mb-6">
                {coverImagePreview ? (
                  <img
                    src={coverImagePreview}
                    alt="Cover preview"
                    className="w-full h-64 object-cover rounded-lg mb-6"
                    onError={() => {
                      setCoverImagePreview('/placeholder.jpg');
                      setSubmitError('Failed to display image preview. Using placeholder instead.');
                    }}
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">No image selected</p>
                  </div>
                )}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {title || 'Untitled Post'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {excerpt || 'No excerpt provided.'}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tagsArray.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content || '<p>No content yet.</p>' }}
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  {...register('title')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter post title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label
                  htmlFor="excerpt"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Excerpt <span className="text-red-500">*</span>
                  <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">
                    (A brief summary of your post, max 200 characters)
                  </span>
                </label>
                <textarea
                  id="excerpt"
                  {...register('excerpt')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter post excerpt"
                />
                {errors.excerpt && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.excerpt.message}
                  </p>
                )}
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                  {excerpt ? excerpt.length : 0}/200
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label
                  htmlFor="coverImage"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Cover Image
                  <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">
                    (JPEG, PNG, WebP, GIF, max 5MB)
                  </span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-gray-300 dark:border-gray-700">
                  <div className="space-y-1 text-center">
                    {coverImagePreview ? (
                      <div className="relative">
                        <img
                          src={coverImagePreview}
                          alt="Cover preview"
                          className="mx-auto max-h-48 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCoverImagePreview(null);
                            setValue('coverImage', null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex justify-center text-sm text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="coverImage"
                            className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="coverImage"
                              name="coverImage"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {errors.coverImage && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.coverImage.message}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Tags
                  <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">
                    (Comma separated)
                  </span>
                </label>
                <input
                  type="text"
                  id="tags"
                  {...register('tags')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g. technology, programming, web development"
                />
                {tagsArray.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tagsArray.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Content <span className="text-red-500">*</span>
                </label>
                <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>}>
                  <ReactQuill
                    theme="snow"
                    value={content || ''}
                    onChange={(value) => setValue('content', value, { shouldValidate: true })}
                    modules={quillModules}
                    className="h-64 dark:bg-gray-800 dark:text-white rounded-md"
                  />
                </Suspense>
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.content.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting || !isValid}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? 'Saving...' : 'Update Post'}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default EditPostPage; 