import React, { useMemo } from 'react'
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IconButton,
  PrimaryButton
} from '@fluentui/react'
import { Branch, BundledApplication } from '../../../models'
import { open } from '@tauri-apps/api/shell'
import { useBoolean } from '@fluentui/react-hooks'

export interface ApplicationMenuButtonProps {
  branch: Branch
  bundledApplication: BundledApplication
}

export const ApplicationMenuButton = ({
  branch,
  bundledApplication
}: ApplicationMenuButtonProps) => {
  const [hideRemoveDialog, { toggle: toggleHideReemodeDialog }] = useBoolean(true)
  const removeDialogContentProps = useMemo(
    () => ({
      type: DialogType.normal,
      title: `Remove ${branch.application.displayName} / ${branch.name}`,
      closeButtonAriaLabel: 'Close',
      subText: `Do you want to remove ${branch.application.displayName} / ${branch.name} from ${bundledApplication.name}`
    }),
    [branch, bundledApplication]
  )

  const onRemove = () => {
    bundledApplication.removeBranch(branch)
    toggleHideReemodeDialog()
  }

  return (
    <>
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
              onClick: toggleHideReemodeDialog
            }
          ]
        }}
      />
      <Dialog
        hidden={hideRemoveDialog}
        onDismiss={toggleHideReemodeDialog}
        dialogContentProps={removeDialogContentProps}
      >
        <DialogFooter>
          <PrimaryButton onClick={onRemove} text='Remove' />
          <DefaultButton onClick={toggleHideReemodeDialog} text="Don't remove" />
        </DialogFooter>
      </Dialog>
    </>
  )
}
