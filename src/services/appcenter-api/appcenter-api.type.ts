export interface OwnerDto {
  id: string
  avatar_url: null | string
  display_name: string
  email: null
  name: string
  type: string
}

export interface ApplicationDto {
  id: string
  app_secret: string
  description: null
  display_name: string
  name: string
  os: string
  platform: string
  origin: string
  icon_url: null | string
  created_at: Date
  updated_at: Date
  release_type: null | string
  owner: OwnerDto
  azure_subscription: null
  member_permissions: string[]
}

export interface CommitDto {
  sha: string
}

export interface BuildDto {
  id: number
  buildNumber: string
  queueTime: string
  startTime: string
  finishTime: string
  lastChangedDate: string
  status: string
  result: string
  reason: string
  sourceBranch: string
  sourceVersion: string
  tags: string[]
  properties: Record<string, string>
}

export interface BranchValueDto {
  name: string
  commit: CommitDto
}

export interface BranchDto {
  branch: BranchValueDto
  configured: boolean
  lastBuild?: BuildDto
  trigger?: string
}
