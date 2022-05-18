import React from 'react'
import { IconButton, useTheme } from '@fluentui/react'
import { BuildStatus } from '../../services'

export interface BuildButtonProps {
  onBuild?: () => void
  onCancelBuild?: () => void
  buildStatus?: BuildStatus
  isBuildable: boolean
}

export const BuildButton = ({
  onBuild,
  onCancelBuild,
  buildStatus,
  isBuildable: canBuild
}: BuildButtonProps) => {
  const theme = useTheme()
  if (buildStatus === 'inProgress' || buildStatus === 'notStarted') {
    return (
      <IconButton
        disabled={!canBuild}
        onClick={onCancelBuild}
        iconProps={{ iconName: 'CircleStop' }}
        styles={{
          root: {
            alignSelf: 'end',
            color: theme.semanticColors.errorText
          },
          rootHovered: {
            color: theme.semanticColors.errorText
          }
        }}
      />
    )
  }
  return (
    <IconButton
      disabled={!canBuild}
      onClick={onBuild}
      iconProps={{ iconName: 'Play' }}
      styles={{ root: { alignSelf: 'end' } }}
    />
  )
}
