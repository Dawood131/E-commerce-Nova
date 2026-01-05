import React, { useEffect } from 'react'
import Header from '../components/Header.jsx/Header'

const Login = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Header />
    </div>
  )
}

export default Login