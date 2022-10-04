import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Spinner } from './components'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate
          loading={
            <div className='text-center py-4'>
              <Spinner />
            </div>
          } //* Edit Spinner later
          persistor={persistor}
        >
          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)
