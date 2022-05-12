import React from 'react'
import { FontIcon, Spinner, useTheme } from '@fluentui/react'
import { BuildResult, BuildStatus } from '../../services'

export interface BuildStatusIndicatorrProps {
  status: BuildStatus
  result?: BuildResult
  size?: number
}

export const BuildStatusIndicator = ({ result, status, size = 25 }: BuildStatusIndicatorrProps) => {
  const theme = useTheme()
  const style = { width: size, height: size, fontSize: size }
  let icon = 'UnknownSolid'
  let loading = false
  let color = theme.semanticColors.disabledBodyText

  if (status === 'completed') {
    if (result === 'canceled') {
      icon = 'Blocked2Solid'
    } else if (result === 'failed') {
      icon = 'StatusErrorFull'
      color = theme.semanticColors.errorIcon
    } else if (result === 'succeeded') {
      icon = 'CompletedSolid'
      color = theme.semanticColors.successIcon
    }
  } else if (status === 'inProgress') {
    loading = true
    icon = 'ProgressRingDots'
  } else if (status === 'notStarted') {
    icon = 'AwayStatus'
  } else if (status === 'cancelling') {
    icon = 'Blocked2Solid'
  }

  if (loading) {
    return (
      <Spinner
        styles={{
          root: style,
          circle: style
        }}
      />
    )
  }

  return <FontIcon iconName={icon} style={{ ...style, color }} />
}
