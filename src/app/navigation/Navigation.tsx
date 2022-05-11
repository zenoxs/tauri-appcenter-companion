import React, { useContext } from 'react'
import { CommandButton, INavLinkGroup, INavStyles, Nav, Stack, ThemeContext } from '@fluentui/react'
import { ApplicationList } from '../screens/application-list/ApplicationList'
import './Navigation.css'
import { APITokenListModal } from '../screens/api-token/APITokenListModal'
import { useBoolean } from '@fluentui/react-hooks'

const navStyles: Partial<INavStyles> = {
  root: {
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
    // backgroundColor: 'rgba(0,0,0,0.3)'
  }
}

const navLinkGroups: INavLinkGroup[] = [
  {
    links: [
      {
        name: 'Applications',
        url: 'http://example.com',
        key: 'key3',
        icon: 'AllApps',
        target: '_blank'
      },
      {
        name: 'Buid',
        url: 'http://msn.com',
        key: 'key4',
        icon: 'Build',
        target: '_blank'
      }
    ]
  }
]

export const Navigation = () => {
  const [openAPITokenListModal, { toggle: toggleOpenAPITokenListModal }] = useBoolean(false)
  const theme = useContext(ThemeContext)!
  return (
    <Stack verticalFill styles={{ root: { height: '100vh', width: '100vw' } }}>
      <div className='titlebar' data-tauri-drag-region style={{ height: '35px' }}></div>
      <Stack className='container' grow horizontal styles={{ root: { display: 'flex' } }}>
        <Stack verticalAlign='space-between'>
          <Nav onLinkClick={() => null} styles={navStyles} groups={navLinkGroups} />
          <CommandButton
            text='API Tokens'
            iconProps={{ iconName: 'Signin' }}
            onClick={toggleOpenAPITokenListModal}
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
          <ApplicationList />
        </Stack>
      </Stack>
      <APITokenListModal isOpen={openAPITokenListModal} onDismiss={toggleOpenAPITokenListModal} />
    </Stack>
  )
}
