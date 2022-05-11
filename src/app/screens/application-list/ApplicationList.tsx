import React, { createRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Branch, useStores } from '../../../models'
import {
  ConstrainMode,
  DefaultButton,
  DetailsList,
  IColumn,
  IDetailsList,
  IGroup,
  SelectionMode,
  Stack
} from '@fluentui/react'
import { AddBundledAppDialog } from './AddBundledAppDialog'
import { useBoolean } from '@fluentui/react-hooks'

export const ApplicationList = observer(() => {
  const {
    bundledApplicationStore: { bundledApplications }
  } = useStores()
  const detailsList = createRef<IDetailsList>()
  const [hideAddBunddledAppDialog, { toggle: toggleHideAddBundledAppDialog }] = useBoolean(true)

  const columns: Array<IColumn> = [
    {
      key: 'name',
      name: 'Name',
      onRender: (item: Branch) => item.application.displayName,
      minWidth: 100,
      maxWidth: 250,
      isResizable: true
    },
    {
      key: 'branch',
      name: 'Branch',
      onRender: (item: Branch) => item.name,
      minWidth: 50,
      maxWidth: 100,
      isResizable: true
    }
  ]

  let items: Array<Branch> = []
  const groups: Array<IGroup> = []
  for (const application of bundledApplications) {
    const branches = application.branches as Array<Branch>
    groups.push({
      key: application.id,
      name: application.name,
      startIndex: items.length,
      count: branches.length,
      level: 0,
      isCollapsed: false
    })
    items = items.concat(branches)
  }

  const refresh = () => {
    // applicationStore.fetchApplications()
  }

  return (
    <>
      <AddBundledAppDialog
        hidden={hideAddBunddledAppDialog}
        onDismiss={toggleHideAddBundledAppDialog}
      />
      <Stack horizontal>
        <DefaultButton onClick={refresh} text='Refresh' />
        <DefaultButton onClick={toggleHideAddBundledAppDialog} text='Add an item' />
      </Stack>
      <div>
        <DetailsList
          constrainMode={ConstrainMode.horizontalConstrained}
          selectionMode={SelectionMode.none}
          componentRef={detailsList}
          items={items}
          styles={{
            root: {
              display: 'flex'
            }
          }}
          groups={groups}
          columns={columns}
          ariaLabelForSelectAllCheckbox='Toggle selection for all items'
          ariaLabelForSelectionColumn='Toggle selection'
          checkButtonAriaLabel='select row'
          checkButtonGroupAriaLabel='select section'
        />
      </div>
    </>
  )
})
