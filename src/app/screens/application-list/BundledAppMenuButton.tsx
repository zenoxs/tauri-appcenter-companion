import React, { useMemo, useState } from 'react'
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IconButton,
  PrimaryButton,
  Selection
} from '@fluentui/react'
import { Branch, BundledApplication, useStores } from '../../../models'
import { useBoolean, useConst } from '@fluentui/react-hooks'
import { SelectApplicationList } from './SelectApplicationList'

export interface BundledAppMenuButtonProps {
  bundledApplication: BundledApplication
}

export const BundledAppMenuButton = ({ bundledApplication }: BundledAppMenuButtonProps) => {
  const [hideRemoveDialog, { toggle: toggleHideRemoveDialog }] = useBoolean(true)
  const [hideLinkAppDialog, { toggle: toggleHideLinkAppDialog }] = useBoolean(true)
  const { bundledApplicationStore } = useStores()

  const onRemove = () => {
    bundledApplicationStore.removeBundledApplication(bundledApplication)
    toggleHideRemoveDialog()
  }

  const selection = useConst(() => new Selection<Branch>())

  const onAddBranches = () => {
    bundledApplication.addBranches(selection.getSelection())
    toggleHideLinkAppDialog()
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
              key: 'link',
              text: 'Add application',
              iconProps: { iconName: 'AddLink' },
              onClick: toggleHideLinkAppDialog
            },
            {
              key: 'remove',
              text: 'Remove',
              iconProps: { iconName: 'Delete' },
              onClick: toggleHideRemoveDialog
            }
          ]
        }}
      />
      <Dialog
        hidden={hideRemoveDialog}
        onDismiss={toggleHideRemoveDialog}
        dialogContentProps={{
          type: DialogType.normal,
          title: `Remove ${bundledApplication.name}`,
          closeButtonAriaLabel: 'Close',
          subText: `Do you want to remove ${bundledApplication.name}`
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={onRemove} text='Remove' />
          <DefaultButton onClick={toggleHideRemoveDialog} text="Don't remove" />
        </DialogFooter>
      </Dialog>
      <Dialog
        hidden={hideLinkAppDialog}
        onDismiss={toggleHideLinkAppDialog}
        minWidth={500}
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: `Link Apps to ${bundledApplication.name}`,
          closeButtonAriaLabel: 'Close'
        }}
      >
        <SelectApplicationList
          currentBundledApplication={bundledApplication}
          selection={selection}
        />
        <DialogFooter>
          <PrimaryButton onClick={onAddBranches} text='Add' />
          <DefaultButton onClick={toggleHideLinkAppDialog} text='Cancel' />
        </DialogFooter>
      </Dialog>
    </>
  )
}
