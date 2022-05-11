import React, { createRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Branch, useStores } from '../../../models'
import {
  CommandBar,
  ConstrainMode,
  DetailsList,
  IColumn,
  IDetailsList,
  IGroup,
  SelectionMode
} from '@fluentui/react'
import { useNavigate, useLocation } from 'react-router-dom'

export const ApplicationList = observer(() => {
  const {
    bundledApplicationStore: { bundledApplications, refresh }
  } = useStores()
  const detailsList = createRef<IDetailsList>()
  const navigate = useNavigate()
  const location = useLocation()

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

  return (
    <>
      <CommandBar
        items={[
          {
            key: 'add',
            text: 'Add',
            iconProps: { iconName: 'Add' },
            onClick: () => navigate('/add-bundled-app', { state: { backgroundLocation: location } })
          }
        ]}
        farItems={[
          {
            key: 'refresh',
            iconProps: { iconName: 'Refresh' },
            onClick: refresh
          }
        ]}
        styles={{ root: { padding: 0 } }}
      />
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
