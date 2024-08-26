"use client"
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '../../store/Store'

const ReactReduxProvider = ({children}:{children:ReactNode}) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

export default ReactReduxProvider
