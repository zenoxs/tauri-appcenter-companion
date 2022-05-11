import React, { useContext } from 'react'
import {
  CommandButton,
  INavLinkGroup,
  INavStyles,
  Nav,
  Stack,
  Text,
  ThemeContext
} from '@fluentui/react'
import { ApplicationList } from '../screens/application-list/ApplicationList'
import { Routes, Route, useNavigate, useLocation, Location } from 'react-router-dom'
import './AppNavigator.css'
import { APITokenListModal } from '../screens/api-token/APITokenListModal'
import { AddBundledAppDialog } from '../screens/application-list/AddBundledAppDialog'

const navStyles: Partial<INavStyles> = {
  root: {
    marginTop: 20,
    width: 180,
    boxSizing: 'border-box',
    overflowY: 'auto'
    // background: 'rgba(0,0,0,0.6)'
  },
  navItem: {
    backgroundColor: 'transparent'
  },
  navItems: {
    backgroundColor: 'transparent'
  },
  link: {
    backgroundColor: 'transparent',
    '.ms-Nav-compositeLink:hover &': {
      backgroundColor: 'transparent'
    }
  }
}

const navLinkGroups: INavLinkGroup[] = [
  {
    links: [
      {
        name: 'Applications',
        key: 'aplications',
        url: '/',
        icon: 'AllApps'
      },
      {
        name: 'Buid',
        url: '/build',
        key: 'build',
        icon: 'Build'
      }
    ]
  }
]

export const AppNavigator = () => {
  const theme = useContext(ThemeContext)!
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { backgroundLocation?: Location }

  return (
    <Stack verticalFill styles={{ root: { height: '100vh', width: '100vw' } }}>
      <div className='titlebar' data-tauri-drag-region style={{ height: '35px' }}></div>
      <Stack className='container' grow horizontal styles={{ root: { display: 'flex' } }}>
        <Stack>
          <Stack.Item align='center'>
            <Text variant='xLarge'>AC Companion</Text>
          </Stack.Item>
          <Nav
            onLinkClick={(event, link) => {
              event?.preventDefault()
              return navigate(link?.url ?? '/')
            }}
            styles={navStyles}
            groups={navLinkGroups}
          />
          <Stack.Item verticalFill>
            <span />
          </Stack.Item>
          <CommandButton
            text='API Tokens'
            iconProps={{ iconName: 'Signin' }}
            onClick={() => navigate('/api-tokens', { state: { backgroundLocation: location } })}
          />
        </Stack>
        <Stack
          grow
          horizontalAlign='stretch'
          verticalFill
          styles={{
            root: {
              backgroundColor: theme?.semanticColors.bodyBackground,
              overflowX: 'hidden',
              borderRadius: '10px 0px 0px 0px'
            }
          }}
          tokens={{ padding: theme.spacing.m }}
        >
          <Routes location={state?.backgroundLocation ?? location}>
            <Route path='/' element={<ApplicationList />} />
          </Routes>
          {state?.backgroundLocation && (
            <Routes>
              <Route path='/add-bundled-app' element={<AddBundledAppDialog />} />
              <Route path='/api-tokens' element={<APITokenListModal />} />
            </Routes>
          )}
        </Stack>
      </Stack>
    </Stack>
  )
}
