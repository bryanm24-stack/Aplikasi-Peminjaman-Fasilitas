import React, { createContext, useContext, useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export const AuthContext = createContext(null)

// Protected Route Component
export const ProtectedRoute = ({ element, allowedRoles }) => {
  const auth = useContext(AuthContext)
  const location = useLocation()

  if (auth.isLoading) return <div>Loading System...</div>
  if (!auth.user) return <Navigate to="/login" replace state={{ from: location }} />
  
  if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
    return <div style={{padding: 20}}>Akses Ditolak: Anda bukan {allowedRoles.join('/')}</div>
  }

  return element
}

export default function Auth({ children }) {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [facilities, setFacilities] = useState([])
  const [loans, setLoans] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshData = async () => {
    try {
      setUsers(await window.api.getUsers())
      setFacilities(await window.api.getFacilities())
      setLoans(await window.api.getLoans())
      setFeedbacks(await window.api.getFeedbacks())
    } catch (err) {
      console.error("Error loading data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { refreshData() }, [])

  const login = async (username, password) => {
    await refreshData() 
    const found = users.find(u => u.username === username && u.password === password)
    if (found) {
      setUser(found)
      return found
    }
    throw new Error("Username atau Password salah!")
  }

  const logout = () => setUser(null)

  const register = async (fullName, username, password) => {
    if (users.find(u => u.username === username)) throw new Error("Username sudah dipakai")
    
    // ID Urut untuk User
    const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0
    const nextId = maxId + 1

    const newUser = {
      id: nextId, 
      username, 
      password, 
      fullName, 
      role: 'user'
    }
    
    const newList = [...users, newUser]
    setUsers(newList)
    await window.api.saveUsers(newList)
    setUser(newUser)
  }

  const addFacility = async (data) => {
    // ID Urut untuk Facility
    const maxId = facilities.length > 0 ? Math.max(...facilities.map(f => f.id)) : 0
    const newItem = { ...data, id: maxId + 1 }
    
    const newList = [...facilities, newItem]
    setFacilities(newList)
    await window.api.saveFacilities(newList)
  }

  const deleteFacility = async (id) => {
    const isUsed = loans.some(l => l.facilityId === id && ['pending', 'approved'].includes(l.status))
    if(isUsed) throw new Error("Tidak bisa dihapus! Fasilitas sedang dipinjam atau ada request pending.")

    const newList = facilities.filter(f => f.id !== id)
    setFacilities(newList)
    await window.api.saveFacilities(newList)
  }

  const editFacility = async (id, data) => {
    const newList = facilities.map(f => 
      f.id === id ? { ...f, ...data } : f
    )
    setFacilities(newList)
    await window.api.saveFacilities(newList)
  }

  const requestLoan = async (facilityId, date, reason) => {
    const conflict = loans.find(l => 
      l.facilityId === facilityId && 
      l.date === date && 
      l.status === 'approved'
    )
    if (conflict) throw new Error("Fasilitas tidak tersedia pada tanggal tersebut.")

    // ID Urut untuk Loan (Peminjaman)
    const maxId = loans.length > 0 ? Math.max(...loans.map(l => l.id)) : 0
    const nextId = maxId + 1

    const facility = facilities.find(f => f.id === facilityId)
    const newLoan = {
      id: nextId,
      userId: user.id,
      userName: user.fullName,
      facilityId,
      facilityName: facility.name,
      date,
      reason,
      status: 'pending', 
      requestDate: new Date().toISOString()
    }
    const newList = [...loans, newLoan]
    setLoans(newList)
    await window.api.saveLoans(newList)
  }

  const updateLoanStatus = async (loanId, newStatus) => {
    if(newStatus === 'approved') {
       const targetLoan = loans.find(l => l.id === loanId)
       const conflict = loans.find(l => 
          l.id !== loanId &&
          l.facilityId === targetLoan.facilityId && 
          l.date === targetLoan.date && 
          l.status === 'approved'
       )
       if(conflict) throw new Error("Gagal Approve! Sudah ada peminjaman lain yang di-approve di tanggal/fasilitas sama.")
    }

    const newList = loans.map(l => l.id === loanId ? { ...l, status: newStatus } : l)
    setLoans(newList)
    await window.api.saveLoans(newList)
  }

  const sendFeedback = async (message) => {
    // ID Urut untuk Feedback
    const maxId = feedbacks.length > 0 ? Math.max(...feedbacks.map(f => f.id)) : 0
    
    const newFeedback = {
      id: maxId + 1,
      userId: user.id,
      userName: user.fullName,
      message,
      date: new Date().toLocaleDateString()
    }
    const newList = [...feedbacks, newFeedback]
    setFeedbacks(newList)
    await window.api.saveFeedbacks(newList)
  }

  // const register = async (fullName, username, password, role) => {
  //   if (users.find(u => u.username === username)) throw new Error("Username sudah dipakai")
    
  //   const newUser = {
  //     id: Date.now(),
  //     username, 
  //     password, 
  //     fullName, 
  //     role: role // Gunakan role yang dikirim dari form (bisa 'admin' atau 'user')
  //   }
    
  //   const newList = [...users, newUser]
  //   setUsers(newList)
  //   await window.api.saveUsers(newList)
  //   setUser(newUser)
  //   return newUser // Return user baru agar bisa dicek role-nya di halaman Register
  // }

  const value = {
    user, isLoading, facilities, loans, feedbacks,
    login, logout, register,
    addFacility, deleteFacility,
    requestLoan, updateLoanStatus, editFacility,
    sendFeedback
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}