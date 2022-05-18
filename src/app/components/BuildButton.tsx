import React from 'react'
import { IconButton } from '@fluentui/react'
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
  return (
    <IconButton
      disabled={!canBuild}
      onClick={onBuild}
      iconProps={{ iconName: 'Play' }}
      styles={{ root: { alignSelf: 'end' } }}
    />
  )
}
