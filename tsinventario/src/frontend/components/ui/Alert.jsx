import React, { useState, useEffect } from 'react'

export function Alert({ type = 'default', message, duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const getAlertClass = () => {
    switch (type) {
      case 'error':
        return 'alert-custom error'
      case 'success':
        return 'alert-custom success'
      case 'warning':
        return 'alert-custom warning'
      default:
        return 'alert-custom'
    }
  }

  return (

    <div
      className={"alert alert-custom"}
      role="alert"
    >
      {Array.isArray(message) ? (
        <ul>
          {message.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      ) : (
        <p>{message}</p>
      )}
    </div>
  )
}