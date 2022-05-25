import React from 'react'
import { IconButton } from '@fluentui/react'
import { Branch, BundledApplication } from '../../../models'
import { open } from '@tauri-apps/api/shell'

export interface ApplicationMenuButtonProps {
  branch: Branch
  bundledApplication: BundledApplication
}

export const ApplicationMenuButton = ({
  branch,
  bundledApplication
}: ApplicationMenuButtonProps) => {
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
            onClick: () => bundledApplication.removeBranch(branch)
          }
        ]
      }}
    />
  )
}
