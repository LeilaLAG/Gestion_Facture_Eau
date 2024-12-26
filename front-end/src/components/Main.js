import React from 'react'
import '../style/main.css'

export default function Main({children}) {
  return (
    <div className='Main'>
        <div className='w-100 p-5'>
            {children}
        </div>
    </div>
  )
}
