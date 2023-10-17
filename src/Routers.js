import { Skeleton } from 'antd-mobile'
import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// import AuthRoute from './components/AuthRoute'

// Load the page by lazy 
const HomePage = lazy(() => import('./pages/HomePage'))
const Home = lazy(() => import('./pages/HomePage/Home'))
const Search = lazy(() => import('./pages/HomePage/Search'))
const News = lazy(() => import('./pages/HomePage/News'))
const Profile = lazy(() => import('./pages/HomePage/Profile'))
const CityList = lazy(() => import('./pages/CityList'))


const Routers = () => {
  return (
    <BrowserRouter>
      {/* setting the loading */}
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* default page -> Home */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomePage />} >
            <Route path="/home/" element={<Home />} />
            <Route path="/home/search" element={<Search />} />
            <Route path="/home/news" element={<News />} />
            <Route path="/home/profile" element={<Profile />} />
          </Route>
          <Route path="/citylist" element={<CityList />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

const Loading = () => {
  return (
    <>
      <Skeleton.Title animated={true} />
      <Skeleton.Paragraph animated={true} />
    </>
  )
}


export default Routers