import React, { useMemo } from 'react'
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IconButton,
  PrimaryButton
} from '@fluentui/react'
import { BundledApplication, useStores } from '../../../models'
import { useBoolean } from '@fluentui/react-hooks'

export interface BundledAppMenuButtonProps {
  bundledApplication: BundledApplication
}

export const BundledAppMenuButton = ({ bundledApplication }: BundledAppMenuButtonProps) => {
  const [hideRemoveDialog, { toggle: toggleHideReemodeDialog }] = useBoolean(true)
  const { bundledApplicationStore } = useStores()
  const removeDialogContentProps = useMemo(
    () => ({
      type: DialogType.normal,
      title: `Remove ${bundledApplication.name}`,
      closeButtonAriaLabel: 'Close',
      subText: `Do you want to remove ${bundledApplication.name}`
    }),
    [bundledApplication]
  )

  const onRemove = () => {
    bundledApplicationStore.removeBundledApplication(bundledApplication)
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
