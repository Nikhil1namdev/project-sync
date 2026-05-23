import React from 'react'

const LoginOne = () => {
  const googleLogin=()=>{
    window.open('https://localHost:5000/auth/google','_self')
  }
  return (
    <>
    <div className='text-center mt-[100px]'>
      <h2>Sign With Google</h2>
      <button onClick={()=>{googleLogin}}>Login</button>
    </div>
    <div>Login</div>
    </>
  )
}

export default LoginOne