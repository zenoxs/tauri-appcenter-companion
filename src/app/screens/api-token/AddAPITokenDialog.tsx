import React from 'react'
import {
  ChoiceGroup,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  Stack,
  TextField
} from '@fluentui/react'
import { useForm, Controller } from 'react-hook-form'
import { observer } from 'mobx-react-lite'
import { TokenSnapshot, TOKEN_ACCESS, useStores } from '../../../models'

export interface AddAPITokenDialogProps {
  hidden: boolean
  onDismiss: () => void
}

export const AddAPITokenDialog = observer(({ hidden, onDismiss }: AddAPITokenDialogProps) => {
  const {
    tokenStore: { addToken }
  } = useStores()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<TokenSnapshot>({ mode: 'all' })

  const onSubmit = (data: TokenSnapshot) => {
    addToken(data)
    onDismiss()
  }

  return (
    <Dialog
      hidden={hidden}
      onDismiss={onDismiss}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: 'Add API token',
        subText: 'You need at least one application to create a bundled app.'
      }}
      minWidth={300}
      modalProps={{
        isBlocking: false
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack tokens={{ childrenGap: 10 }}>
          <TextField
            required
            label='Name'
            {...register('name', { required: { value: true, message: 'Name is required' } })}
            errorMessage={errors.name?.message}
          />
          <Controller
            name='access'
            control={control}
            rules={{ required: { value: true, message: 'Access is required' } }}
            render={({ field }) => (
              <ChoiceGroup
                required
                options={TOKEN_ACCESS.map((access) => ({ key: access, text: access }))}
                label='Access type'
                value={field.value}
                onChange={(event, item) => field.onChange(item?.key)}
              />
            )}
          />
          <TextField
            required
            label='Token'
            {...register('token', { required: { value: true, message: 'Token is required' } })}
            type='password'
            canRevealPassword
            revealPasswordAriaLabel='Show token'
            errorMessage={errors.token?.message}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton type='submit' text='Save' />
          <DefaultButton onClick={onDismiss} text='Cancel' />
        </DialogFooter>
      </form>
    </Dialog>
  )
})
