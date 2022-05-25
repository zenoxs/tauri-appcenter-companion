import React from 'react'
import { IconButton } from '@fluentui/react'
import { Branch } from '../../../models'
import { open } from '@tauri-apps/api/shell'

export interface ApplicationMenuButtonProps {
  branch: Branch
}

export const ApplicationMenuButton = ({ branch }: ApplicationMenuButtonProps) => {
  return (
    <IconButton
      iconProps={{ iconName: 'More' }}
      ariaLabel='Edit application'
      onRenderMenuIcon={() => null}
      menuProps={{
        shouldFocusOnMount: true,
        items: [
          {
            key: 'open_appceenter',
            text: 'Open in AppCenter',
            iconProps: { iconName: 'Globe' },
            onClick: () => open(branch.url)
          },
          {
            key: 'remove',
            text: 'Remove',
            iconProps: { iconName: 'Delete' },
            onClick: () => console.log('New clicked')
          }
        ]
      }}
    />
  )
}
