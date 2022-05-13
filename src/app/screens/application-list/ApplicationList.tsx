import React, { createRef, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Branch, useStores } from '../../../models'
import {
  CommandBar,
  ConstrainMode,
  DetailsList,
  DetailsRow,
  IColumn,
  IDetailsList,
  IGroup,
  Image,
  ProgressIndicator,
  SelectionMode,
  Stack,
  Text
} from '@fluentui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BuildStatusIndicator } from '../../components'

export const ApplicationList = observer(() => {
  const {
    bundledApplicationStore: { bundledApplications, refresh }
  } = useStores()
  const detailsList = createRef<IDetailsList>()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)

  const onRefresh = () => {
    setIsLoading(true)
    refresh().finally(() => {
      setIsLoading(false)
    })
  }

  useEffect(() => {
    onRefresh()
  }, [])

  const columns: Array<IColumn> = [
    {
      key: 'name',
      name: 'Name',
      onRender: (item: Branch) => {
        const appName = (
          <Text styles={{ root: { fontWeight: 500 } }} variant='medium'>
            {item.application?.displayName}
          </Text>
        )
        if (item.application?.iconUrl) {
          return (
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <Image
                width={25}
                height={25}
                styles={{ root: { borderRadius: 5 } }}
                src={item.application.iconUrl}
                alt={item.application.name}
              />
              {appName}
            </Stack>
          )
        }
        return appName
      },
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
    },
    {
      key: 'build',
      name: 'Build',
      onRender: (item: Branch) => {
        const lastBuild = item.lastBuild

        if (lastBuild?.id) {
          return <BuildStatusIndicator status={lastBuild.status} result={lastBuild.result} />
        }
      },
      minWidth: 50,
      maxWidth: 100,
      isResizable: true
    }
  ]

  let items: Array<Branch> = []
  const groups: Array<IGroup> = []
  for (const application of bundledApplications) {
    const branches = application.branches.map((b) => ({
      ...b,
      application: b?.application,
      lastBuild: b?.lastBuild
    })) as Array<Branch>
    groups.push({
      key: application.id,
      name: application.name,
      data: application,
      startIndex: items.length,
      count: branches.length,
      level: 0,
      isCollapsed: false
    } as IGroup)
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
            onClick: onRefresh
          }
        ]}
        styles={{ root: { padding: 0 } }}
      />
      <div>
        {isLoading && (
          <ProgressIndicator
            progressHidden={false}
            barHeight={2}
            styles={{ itemProgress: { padding: 0 } }}
          />
        )}
        {!isLoading && <div style={{ height: 2 }} />}
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
          onRenderRow={(props) => {
            if (props) {
              return <DetailsRow {...props} styles={{ fields: { alignItems: 'center' } }} />
            }
            return null
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
