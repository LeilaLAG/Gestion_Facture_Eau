import React from 'react'

export default function FormErrorMsg(props) {
  return (
    <div className='formErrorMsgContainer' style={{width : props.width}}>
      {/* <div style={{backgroundColor : props.coleur}}></div> */}
      <p style={{color : props.coleur}} >
          {props.msg}
      </p>
    </div>
  )
}
