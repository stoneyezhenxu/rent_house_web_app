import { Skeleton } from 'antd-mobile'
import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import AuthRoute from './components/AuthRoute'

// 按需加载子页面
const HomePage = lazy(() => import('./pages/HomePage'))
const Home = lazy(() => import('./pages/HomePage/Home'))
const Search = lazy(() => import('./pages/HomePage/Search'))
const News = lazy(() => import('./pages/HomePage/News'))
const Profile = lazy(() => import('./pages/HomePage/Profile'))

const CityList = lazy(() => import('./pages/CityList'))
const Map = lazy(() => import('./pages/Map'))
const HouseDetail = lazy(() => import('./pages/HouseDetail'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Favorite = lazy(() => import('./pages/Favorite'))

const Rent = lazy(() => import('./pages/Rent'))
const RentAdd = lazy(() => import('./pages/Rent/RentAdd'))
const RentSearch = lazy(() => import('./pages/Rent/RentSearch'))


const Routers = () => {
    return (
        <BrowserRouter>
            {/* 设置加载指示器 */}
            <Suspense fallback={<Loading />}>
                <Routes>
                    {/* 默认打开/home页面 */}
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/home" element={<HomePage />} >
                        <Route path="/home" element={<Home />} />
                        <Route path="/home/search" element={<Search />} />
                        <Route path="/home/news" element={<News />} />
                        <Route path="/home/profile" element={<Profile />} />
                    </Route>
                    <Route path="/citylist" element={<CityList />} />
                    <Route path="/map" element={<Map />} />
                    <Route path="/detail/:id" element={<HouseDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/favorite"
                        element={(
                            <AuthRoute>
                                <Favorite />
                            </AuthRoute>
                        )}
                    />
                    <Route
                        path="/rent"
                        element={(
                            <AuthRoute>
                                <Rent />
                            </AuthRoute>
                        )}
                    />
                    <Route
                        path="/rent/add"
                        element={(
                            <AuthRoute>
                                <RentAdd />
                            </AuthRoute>
                        )}
                    /><Route
                        path="/rent/search"
                        element={(
                            <AuthRoute>
                                <RentSearch />
                            </AuthRoute>
                        )}
                    />
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