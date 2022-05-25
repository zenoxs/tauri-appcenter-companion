import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Branch, BundledApplication, useStores } from '../../../models'
import {
  CommandBar,
  ConstrainMode,
  DetailsList,
  DetailsRow,
  GroupHeader,
  IColumn,
  IGroup,
  Image,
  Persona,
  PersonaSize,
  ProgressIndicator,
  SelectionMode,
  Stack,
  Text
} from '@fluentui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BuildButton, BuildStatusIndicator } from '../../components'
import { ApplicationMenuButton } from './ApplicationMenuButton'
import { BundledAppMenuButton } from './BundledAppMenuButton'

export const ApplicationListScreen = observer(() => {
  const {
    bundledApplicationStore: { bundledApplications, refresh, initialLoading },
    branchStore: { branches }
  } = useStores()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [renderTable, setRenderTable] = useState(false)

  const onRefresh = () => {
    setIsLoading(true)
    refresh().finally(() => {
      setIsLoading(false)
    })
  }

  useEffect(() => {
    // prevent to reload the data every time
    if (!initialLoading) onRefresh()
    // HACK to get the correct table width
    setRenderTable(true)
  }, [initialLoading])

  let items: Array<Branch> = []
  const groups: Array<IGroup> = []
  for (const application of bundledApplications) {
    // force reload on application deps change
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
      minWidth: 150,
      maxWidth: 250
    },
    {
      key: 'branch',
      name: 'Branch',
      onRender: (item: Branch) => item.name,
      minWidth: 50,
      maxWidth: 80
    },
    {
      key: 'commit',
      name: 'Commit',
      onRender: ({ lastCommit }: Branch) => (
        <Persona
          size={PersonaSize.size32}
          showSecondaryText
          imageUrl={lastCommit.author.avatar_url}
          text={lastCommit.commit.message}
          secondaryText={lastCommit.commit.author.name}
        />
      ),
      minWidth: 150
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
      minWidth: 40
    },
    {
      key: 'actions',
      name: 'Actions',
      onRender: (item: Branch, index) => {
        const lastBuild = item.lastBuild
        const group = groups.find((g) => g.startIndex <= index! && g.startIndex + g.count > index!)!
        const branch = branches.get(item.id)!
        return (
          <Stack horizontal horizontalAlign='end' grow>
            <ApplicationMenuButton bundledApplication={group.data} branch={branch} />
            {lastBuild && (
              <BuildButton
                isBuildable={branch.isBuildable}
                onBuild={branch.startBuild}
                onCancelBuild={branch.cancelBuild}
                buildStatus={lastBuild.status}
              />
            )}
          </Stack>
        )
      },
      minWidth: 70
    }
  ]

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
        {renderTable && (
          <DetailsList
            constrainMode={ConstrainMode.horizontalConstrained}
            selectionMode={SelectionMode.none}
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
            groupProps={{
              onRenderHeader: (props) => (
                <GroupHeader
                  {...props}
                  onRenderTitle={(props) => {
                    const application: BundledApplication = props?.group?.data
                    return (
                      <Stack
                        horizontal
                        horizontalAlign='space-between'
                        tokens={{ childrenGap: 10 }}
                        verticalAlign={'center'}
                        grow
                      >
                        <Stack horizontal tokens={{ childrenGap: 10 }}>
                          <Text variant='medium'>{props?.group?.name}</Text>
                          {application && (
                            <BuildStatusIndicator
                              status={application.status}
                              result={application.result}
                            />
                          )}
                        </Stack>
                        <div style={{ paddingRight: 8 }}>
                          <BundledAppMenuButton bundledApplication={application} />
                          <BuildButton
                            buildStatus={application.status}
                            onBuild={application.startBuild}
                            onCancelBuild={application.cancelBuild}
                            isBuildable={application.isBuildable}
                          />
                        </div>
                      </Stack>
                    )
                  }}
                />
              )
            }}
            columns={columns}
          />
        )}
      </div>
    </>
  )
})
