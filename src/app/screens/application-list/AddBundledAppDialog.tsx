import React, { useEffect, useMemo } from 'react'
import {
  DefaultButton,
  DetailsHeader,
  DetailsList,
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
  Dropdown
} from '@fluentui/react'
import { observer } from 'mobx-react-lite'
import { useForm, Controller } from 'react-hook-form'
import { Branch, BundledApplicationSnapshotIn, useStores } from '../../../models'
import { useConst } from '@fluentui/react-hooks'

export interface AddBundledAppDialogProps {
  hidden: boolean
  onDismiss: () => void
}

const columns = [
  {
    key: 'name',
    name: 'Name',
    fieldName: 'name',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true
  }
]

export const AddBundledAppDialog = observer(({ hidden, onDismiss }: AddBundledAppDialogProps) => {
  const {
    applicationStore: { fetchApplications, applicationsByToken },
    bundledApplicationStore: { addBundledApplication },
    tokenStore: { tokens }
  } = useStores()

  const {
    register,
    unregister,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<BundledApplicationSnapshotIn>()

  // TODO: a rules to check that their is at least one branches
  React.useEffect(() => {
    register('branches')
    return () => unregister('branches')
  }, [register])

  const selectedToken = watch('token', undefined) as string | undefined

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
    if (!hidden && selectedToken) {
      fetchApplications(selectedToken, { withBranches: true })
    }
  }, [hidden, selectedToken])

  const [items, groups] = useMemo(() => {
    let items: Array<Branch> = []
    const groups: Array<IGroup> = []
    if (!selectedToken) {
      return [items, groups]
    }
    const applications = applicationsByToken(selectedToken)
    for (const application of applications) {
      const branches = application.configuredBranches as Array<Branch>
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
  }, [selectedToken])

  const onSubmit = (data: BundledApplicationSnapshotIn) => {
    addBundledApplication(data)
    onDismiss()
  }

  return (
    <Dialog
      hidden={hidden}
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
        <Stack>
          <TextField
            required
            label='Name'
            {...register('name', { required: { value: true, message: 'Name is required' } })}
            errorMessage={errors.name?.message}
          />
          <Controller
            name='token'
            control={control}
            rules={{ required: { value: true, message: 'Token is required' } }}
            render={({ field }) => (
              <Dropdown
                required
                options={tokens.map((token) => ({ key: token.token, text: token.name }))}
                label='API Token'
                selectedKey={field.value}
                onChange={(event, item) => field.onChange(item?.key)}
                errorMessage={errors.token?.message}
              />
            )}
          />
          {selectedToken && (
            <DetailsList
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
