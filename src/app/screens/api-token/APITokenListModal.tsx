import React, { useState } from 'react'
import {
  CommandBar,
  DetailsList,
  FontWeights,
  getTheme,
  IButtonStyles,
  IColumn,
  IconButton,
  Selection,
  mergeStyleSets,
  Modal
} from '@fluentui/react'
import { observer } from 'mobx-react-lite'
import { useBoolean, useConst, useId } from '@fluentui/react-hooks'
import { Token, useStores } from '../../../models'
import { AddAPITokenDialog } from './AddAPITokenDialog'
import { toJS } from 'mobx'

const theme = getTheme()
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch'
  },
  header: [
    theme.fonts.xxLarge,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px'
    }
  ],
  body: {
    padding: '0 0 12px 0'
  }
})

const iconButtonStyles: Partial<IButtonStyles> = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px'
  },
  rootHovered: {
    color: theme.palette.neutralDark
  }
}

export interface APITokenListModalProps {
  isOpen: boolean
  onDismiss: () => void
}

const columns: Array<IColumn> = [
  {
    key: 'name',
    name: 'Name',
    minWidth: 100,
    onRender: (item: Token) => item.name
  },
  {
    key: 'accessToken',
    name: 'Access',
    minWidth: 100,
    onRender: (item: Token) => item.access
  },
  {
    key: 'token',
    name: 'Token',
    minWidth: 100,
    onRender: (item: Token) => item.token
  }
]

export const APITokenListModal = observer(({ isOpen, onDismiss }: APITokenListModalProps) => {
  const titleId = useId('title-api-token-list-modal')
  const [hideAPITokenDialog, { toggle: toggleHideAPITokenDialog }] = useBoolean(true)
  const {
    tokenStore: { tokens, removeToken }
  } = useStores()
  const [selectedTokens, setSelectedTokens] = useState<Array<Token>>([])
  const selection = useConst(
    () =>
      new Selection({
        onSelectionChanged: () => {
          setSelectedTokens(selection.getSelection() as Array<Token>)
        }
      })
  )

  const onRemoveTokens = () => {
    for (const token of selectedTokens) {
      console.log(token)
      removeToken(token)
    }
  }

  return (
    <Modal titleAriaId={titleId} onDismiss={onDismiss} isOpen={isOpen}>
      {!hideAPITokenDialog && (
        <AddAPITokenDialog hidden={hideAPITokenDialog} onDismiss={toggleHideAPITokenDialog} />
      )}
      <div className={contentStyles.header}>
        <span id={titleId}>API Tokens</span>
        <IconButton
          styles={iconButtonStyles}
          iconProps={{ iconName: 'Cancel' }}
          ariaLabel='Close popup modal'
          onClick={onDismiss}
        />
      </div>
      <div className={contentStyles.body}>
        <CommandBar
          items={[
            {
              key: 'add',
              text: 'Add',
              iconProps: { iconName: 'Add' },
              onClick: toggleHideAPITokenDialog
            },
            {
              key: 'delete',
              text: 'Delete',
              iconProps: { iconName: 'Delete' },
              onClick: onRemoveTokens,
              disabled: selectedTokens.length === 0
            }
          ]}
          ariaLabel='Tokens actions'
          primaryGroupAriaLabel='Tokens actions'
          farItemsGroupAriaLabel='More actions'
          styles={{ root: { padding: '0 14px 0 14px' } }}
        />
        <DetailsList selection={selection} items={toJS(tokens)} columns={columns} setKey='name' />
      </div>
    </Modal>
  )
})
