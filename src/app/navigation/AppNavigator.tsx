import React, { useContext, useEffect, useState } from 'react'
import {
  CommandButton,
  INavLinkGroup,
  INavStyles,
  Nav,
  Stack,
  Text,
  Theme,
  ThemeContext
} from '@fluentui/react'
import { os } from '@tauri-apps/api'
import { ApplicationListScreen } from '../screens/application-list/ApplicationListScreen'
import { Routes, Route, useNavigate, useLocation, Location } from 'react-router-dom'
import './AppNavigator.css'
import { APITokenListModal } from '../screens/api-token/APITokenListModal'
import { AddBundledAppDialog } from '../screens/application-list/AddBundledAppDialog'
import { useConst } from '@fluentui/react-hooks'

const navStyles = (theme: Theme): Partial<INavStyles> => ({
  root: {
    marginTop: 20,
    width: 180,
    boxSizing: 'border-box',
    overflowY: 'auto',
    background: 'transparent'
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
})

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
        icon: 'Build',
        disabled: true
      }
    ]
  }
]

export const AppNavigator = () => {
  const theme = useContext(ThemeContext)!
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { backgroundLocation?: Location }
  const titleBarHeight = useConst('35px')

  // set non transparent background for linux systems
  const [background, setBackground] = useState<string | undefined>()
  useEffect(() => {
    os.type().then((type) => {
      if (type === 'Linux') {
        setBackground(theme.semanticColors.bodyStandoutBackground)
      }
    })
  }, [theme])

  return (
    <Stack verticalFill styles={{ root: { height: '100vh', width: '100vw', background } }}>
      <div className='titlebar' data-tauri-drag-region style={{ height: titleBarHeight }}></div>
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
            styles={navStyles(theme)}
            groups={navLinkGroups}
          />
          <Stack.Item verticalFill>
            <span />
          </Stack.Item>
          <CommandButton
            text='API Tokens'
            iconProps={{ iconName: 'Signin' }}
            styles={{ root: { backgroundColor: 'transparent' } }}
            onClick={() => navigate('/api-tokens', { state: { backgroundLocation: location } })}
          />
        </Stack>
        <Stack
          grow
          horizontalAlign='stretch'
          verticalFill
          styles={{
            root: {
              backgroundColor: theme.semanticColors.bodyBackground,
              overflowX: 'hidden',
              overflowY: 'auto',
              height: `calc(100vh - ${titleBarHeight})`,
              borderRadius: '10px 0px 0px 0px'
            }
          }}
          tokens={{ padding: theme.spacing.m }}
        >
          <Routes location={state?.backgroundLocation ?? location}>
            <Route path='/' element={<ApplicationListScreen />} />
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
