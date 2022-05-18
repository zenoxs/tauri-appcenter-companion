import React, { useEffect, useState } from 'react'
import {
  DefaultButton,
  DetailsHeader,
  Dialog,
  DialogFooter,
  DialogType,
  IColumn,
  IDetailsHeaderProps,
  IGroup,
  PrimaryButton,
  Stack,
  TextField,
  Selection,
  DetailsList,
  Spinner,
  SpinnerSize
} from '@fluentui/react'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useForm } from 'react-hook-form'
import { Branch, BundledApplicationSnapshotIn, useStores } from '../../../models'
import { useConst } from '@fluentui/react-hooks'

const columns: Array<IColumn> = [
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
]

export const AddBundledAppDialog = observer(() => {
  const {
    applicationStore: { fetchApplications, applicationList },
    bundledApplicationStore: { addBundledApplication },
    tokenStore: { tokens }
  } = useStores()

  const navigate = useNavigate()

  const {
    register,
    unregister,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<BundledApplicationSnapshotIn>()

  const [isLoading, setIsLoading] = useState(true)

  // TODO: a rules to check that their is at least one branches
  React.useEffect(() => {
    register('branches')
    return () => unregister('branches')
  }, [register])

  const selection = useConst(
    () =>
      new Selection({
        onSelectionChanged: () => {
          setValue(
            'branches',
            (selection.getSelection() as Array<Branch>).map((b) => b.id)
          )
        }
      })
  )

  useEffect(() => {
    setIsLoading(true)
    Promise.all(
      tokens.map((token) => fetchApplications(token.token, { withBranches: true }))
    ).finally(() => setIsLoading(false))
  }, [])

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

  const onDismiss = () => {
    navigate(-1)
  }

  const onSubmit = (data: BundledApplicationSnapshotIn) => {
    addBundledApplication(data)
    onDismiss()
  }

  return (
    <Dialog
      hidden={false}
      onDismiss={onDismiss}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: 'Add bundled application',
        subText: 'You need at least one application to create a bundled app.'
      }}
      minWidth={500}
      modalProps={{
        isBlocking: false
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack tokens={{ childrenGap: 10 }} styles={{ root: { height: '100%' } }}>
          <TextField
            required
            label='Name'
            {...register('name', { required: { value: true, message: 'Name is required' } })}
            errorMessage={errors.name?.message}
          />
          {isLoading ? (
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
                <DetailsHeader
                  {...props!}
                  ariaLabelForToggleAllGroupsButton={'Expand collapse groups'}
                />
              )}
              groupProps={{
                showEmptyGroups: true
              }}
              onRenderItemColumn={(item?: Branch, index?: number, column?: IColumn) => {
                const value =
                  item && column && column.fieldName
                    ? item[column.fieldName as keyof Branch] || ''
                    : ''

                return <div data-is-focusable={true}>{value}</div>
              }}
            />
          )}
        </Stack>
        <DialogFooter>
          <PrimaryButton type='submit' text='Save' />
          <DefaultButton onClick={onDismiss} text='Cancel' />
        </DialogFooter>
      </form>
    </Dialog>
  )
})
