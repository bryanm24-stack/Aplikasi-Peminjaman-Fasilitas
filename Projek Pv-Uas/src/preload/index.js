import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  getUsers: () => ipcRenderer.invoke('get_users'),
  saveUsers: (data) => ipcRenderer.invoke('save_users', data),
  
  getFacilities: () => ipcRenderer.invoke('get_facilities'),
  saveFacilities: (data) => ipcRenderer.invoke('save_facilities', data),
  
  getLoans: () => ipcRenderer.invoke('get_loans'),
  saveLoans: (data) => ipcRenderer.invoke('save_loans', data),

  getFeedbacks: () => ipcRenderer.invoke('get_feedbacks'),
  saveFeedbacks: (data) => ipcRenderer.invoke('save_feedbacks', data),
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}