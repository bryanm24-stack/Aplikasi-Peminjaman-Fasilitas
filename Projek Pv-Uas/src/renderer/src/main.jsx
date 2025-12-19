import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'

import Auth, { ProtectedRoute } from './components/Auth'
import App from './App'
import LoginPage from './components/pages/LoginPage'
import RegisterPage from './components/pages/RegisterPage'
import AdminFacilities from './components/pages/AdminFacilities'
import AdminLoans from './components/pages/AdminLoans'
import AdminFeedbacks from './components/pages/AdminFeedbacks' 
import UserBrowse from './components/pages/UserBrowse'
import UserMyLoans from './components/pages/UserMyLoans'
import UserFeedback from './components/pages/UserFeedback'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> 
      <HashRouter>
        <Auth>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/" element={<ProtectedRoute element={<App />} allowedRoles={['admin', 'user']} />}>
  
              <Route path="admin/facilities" element={<ProtectedRoute element={<AdminFacilities />} allowedRoles={['admin']} />} />
              <Route path="admin/loans" element={<ProtectedRoute element={<AdminLoans />} allowedRoles={['admin']} />} />
              <Route path="admin/feedbacks" element={<ProtectedRoute element={<AdminFeedbacks />} allowedRoles={['admin']} />} />
              
              <Route path="user/browse" element={<ProtectedRoute element={<UserBrowse />} allowedRoles={['user']} />} />
              <Route path="user/my-loans" element={<ProtectedRoute element={<UserMyLoans />} allowedRoles={['user']} />} />
              <Route path="user/feedback" element={<ProtectedRoute element={<UserFeedback />} allowedRoles={['user']} />} />
              
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Route>
          </Routes>
        </Auth>
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>
)