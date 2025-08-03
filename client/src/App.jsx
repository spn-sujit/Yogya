import React from 'react'
import Navbar from './components/Navbar'
import Login from './page/login'
import { Route, Routes } from 'react-router-dom'
import Sessions from './components/All-sessions'
import MySessions from './components/My-sessions'
import Publish from './components/Publish'
import {Toaster} from 'react-hot-toast'

import Footer from './components/Footer'
import MySessionDetails from './components/MySessionDetails'
import { useAppContext } from './context/AppContext'
import Loading from './page/loading'
import AllDrafts from './components/AllDrafts'

const App = () => {
  const {loadingUser}=useAppContext();

  if(loadingUser) return <Loading/>;
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <Toaster/>
    
     <main className='flex-grow'>
      <Routes>
      <Route path='/' element={<Sessions/>} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/my-sessions' element={<MySessions/>}/>
      <Route path='/publish' element={<Publish/>}/>
      <Route path='/publish/:id' element={<Publish/>}/>
      <Route path='/draft' element={<AllDrafts/>}/>
      <Route path='/my-session/:id' element={<MySessionDetails/>}/>
     </Routes>
     </main>
       <Footer/>
    </div>
  )
}

export default App
