import React, { useEffect, useState } from 'react'
import './App.css'
import { RootStore } from '../models/root-store/root-store'
import { RootStoreProvider, setupRootStore } from '../models'
import { DarkTheme, DefaultTheme } from '@uifabric/theme-samples'
import { AppNavigator } from './navigation/AppNavigator'
import { Theme, ThemeProvider } from '@fluentui/react'
import { invoke } from '@tauri-apps/api/tauri'

const darkTheme: Theme = {
  ...DarkTheme
}
const lightTheme: Theme = {
  ...DefaultTheme
}

export const App: React.FunctionComponent = () => {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)
  const [isDarkMode, setDarkMode] = useState(false)

  useEffect(() => {
    setupRootStore().then(setRootStore)
  }, [])

  useEffect(() => {
    // Add listener to update styles
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => setDarkMode(!!e.matches))

    // Setup dark/light mode for the first time
    setDarkMode(!!window.matchMedia('(prefers-color-scheme: dark)').matches)

    // Remove listener
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', () => {})
    }
  }, [])

  useEffect(() => {
    if (rootStore) {
      invoke('frontend_ready')
    }
  }, [rootStore])

  if (!rootStore) return null

  return (
    <RootStoreProvider value={rootStore}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme} applyTo='body'>
        <AppNavigator />
      </ThemeProvider>
    </RootStoreProvider>
  )
}
