import {
  DetailsHeader,
  DetailsList,
  IColumn,
  IDetailsHeaderProps,
  IGroup,
  Selection,
  Spinner,
  SpinnerSize
} from '@fluentui/react'
import { useConst } from '@fluentui/react-hooks'
import { useObserver } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { Branch, useStores } from '../../../models'

export interface SelectApplicationListProps {
  onSelectionChanged: (brancheIds: Array<string>) => void
}

export const SelectApplicationList = ({ onSelectionChanged }: SelectApplicationListProps) => {
  const {
    applicationStore: { fetchApplications, applicationList },
    tokenStore: { tokens }
  } = useStores()

  const [isLoading, setIsLoading] = useState(true)

  const selection = useConst(
    () =>
      new Selection({
        onSelectionChanged: () => {
          onSelectionChanged((selection.getSelection() as Array<Branch>).map((b) => b.id))
        }
      })
  )

  const columns = useConst<Array<IColumn>>([
    {
      key: 'name',
      name: 'Name',
      fieldName: 'name',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    },
    {
      key: 'token',
      name: 'token',
      onRender: (item: Branch) => item.application?.token?.name,
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    }
  ])

  useEffect(() => {
    setIsLoading(true)
    Promise.all(
      tokens.map((token) => fetchApplications(token.token, { withBranches: true }))
    ).finally(() => setIsLoading(false))
  }, [])

  return useObserver(() => {
    const [items, groups] = (() => {
      let items: Array<Branch> = []
      const groups: Array<IGroup> = []
      for (const application of applicationList) {
        const branches = application.configuredBranches
        groups.push({
          key: application.id,
          name: application.displayName,
          startIndex: items.length,
          count: branches.length,
          level: 0,
          isCollapsed: true
        })
        items = items.concat(branches)
      }

      return [items, groups]
    })()

    return isLoading ? (
      // eslint-disable-next-line react/react-in-jsx-scope
      <Spinner size={SpinnerSize.large} label='Fetching applications...' />
    ) : (
      <DetailsList
        styles={{ root: { flex: 1 } }}
        selection={selection}
        items={items}
        groups={groups}
        columns={columns}
        ariaLabelForSelectAllCheckbox='Toggle selection for all items'
        ariaLabelForSelectionColumn='Toggle selection'
        checkButtonAriaLabel='select row'
        checkButtonGroupAriaLabel='select section'
        onRenderDetailsHeader={(props?: IDetailsHeaderProps) => (
          <DetailsHeader {...props!} ariaLabelForToggleAllGroupsButton={'Expand collapse groups'} />
        )}
        groupProps={{
          showEmptyGroups: true
        }}
        onRenderItemColumn={(item?: Branch, index?: number, column?: IColumn) => {
          const value =
            item && column && column.fieldName ? item[column.fieldName as keyof Branch] || '' : ''

          return <div data-is-focusable={true}>{value}</div>
        }}
      />
    )
  })
}
