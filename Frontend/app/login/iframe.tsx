import React, { useState } from 'react'
import { createPortal } from 'react-dom'

export const IFrame = ({
  children,
  ...props
}) => {
  const [contentRef, setContentRef] = useState(null)
  const mountNode =
    contentRef?.contentWindow?.document?.body
  return (
    <iframe id='myframe' {...props} ref={setContentRef} style={{backgroundColor:'#030712'}} allow="identity-credentials-get">
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  )
}