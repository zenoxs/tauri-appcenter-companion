import React from 'react'
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  Stack,
  TextField
} from '@fluentui/react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { BundledApplicationSnapshotIn, useStores } from '../../../models'
import { SelectApplicationList } from './SelectApplicationList'

export const AddBundledAppDialog = () => {
  const {
    bundledApplicationStore: { addBundledApplication }
  } = useStores()

  const navigate = useNavigate()

  const {
    register,
    unregister,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<BundledApplicationSnapshotIn>()

  // TODO: a rules to check that their is at least one branches
  React.useEffect(() => {
    register('branches')
    return () => unregister('branches')
  }, [register])

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
          <SelectApplicationList
            onSelectionChanged={(brancheIds) => setValue('branches', brancheIds)}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton type='submit' text='Save' />
          <DefaultButton onClick={onDismiss} text='Cancel' />
        </DialogFooter>
      </form>
    </Dialog>
  )
}
