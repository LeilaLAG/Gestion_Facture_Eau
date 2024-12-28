import React from 'react'

export default function ErrorMsg(props) {
  return (
    <div className='formErrorMsgContainer'>
      <p style={{color : props.coleur , fontWeight : props.boldness}} className='d-flex justify-content-center align-items-center gap-2'>
          <img src={props.imgPath} alt='error' width={props.errorIconWidth}/>
          {props.msg}
      </p>
    </div>
  )
}
