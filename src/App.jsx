import React from 'react'
import NavBar from './components/Navbar'
import Jumbotron from './components/Jumbotron'
import BlogHeading from './components/BlogHeading'
import BlogContainer from './components/BlogContainer'
import Footer from './components/Footer'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import AddBlogPage from './pages/AddBlogPage';
import PageNotFound from './pages/PageNotFound';

const App = () => {

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} /> 
      <Route path="/add-blog" element={<AddBlogPage />} />
      <Route path="*" element={<PageNotFound />} />
    </Route>
  ))

  return (
    <RouterProvider router={router} />
  )
}

export default App