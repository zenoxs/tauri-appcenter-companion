import { Body } from '@tauri-apps/api/http'
import { HttpClient } from '../http-client/http-client'
import { ApplicationDto, BranchDto, BranchWithCommitDto, CommitLiteDto } from './appcenter-api.type'

export class AppcenterApi {
  private readonly _http: HttpClient

  private constructor(http: HttpClient) {
    this._http = http
  }

  static async create(): Promise<AppcenterApi> {
    return new AppcenterApi(
      await HttpClient.getClient({ baseUrl: 'https://api.appcenter.ms/v0.1/' })
    )
  }

  getApplications(token: string): Promise<Array<ApplicationDto>> {
    return this._http
      .get<Array<ApplicationDto>>('apps', {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Token': token
        }
      })
      .then((res) => res.data)
  }

  getApplication(
    ownerName: string,
    applicationName: string,
    token: string
  ): Promise<ApplicationDto> {
    return this._http
      .get<ApplicationDto>(`apps/${ownerName}/${applicationName}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Token': token
        }
      })
      .then((res) => res.data)
  }

  async getBranches(
    ownerName: string,
    applicationName: string,
    token: string
  ): Promise<Array<BranchWithCommitDto>> {
    return this._http
      .get<Array<BranchDto>>(`apps/${ownerName}/${applicationName}/branches`, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Token': token
        }
      })
      .then(async (res) => {
        if (!res.ok) {
          return []
        }
        const commits = await this.getCommitsBatch(
          ownerName,
          applicationName,
          res.data.map((b) => b.branch.commit.sha),
          token
        )

        return res.data.map((b, index) => ({
          ...b,
          commit: commits[index]
        }))
      })
  }

  async getWebsocket(ownerName: string, applicationName: string, token: string) {
    return this._http
      .post<{ url: string }>(`apps/${ownerName}/${applicationName}/websockets`, undefined, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Token': token
        }
      })
      .then((res) => res.data.url)
  }

  async buildBranch({
    ownerName,
    applicationName,
    branchName,
    token,
    commit
  }: {
    ownerName: string
    applicationName: string
    branchName: string
    commit: string
    token: string
  }) {
    await this._http.post(
      `apps/${ownerName}/${applicationName}/branches/${branchName}/builds`,
      Body.json({
        sourceVersion: commit
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Token': token
        }
      }
    )
  }

  async cancelBranchBuild({
    ownerName,
    applicationName,
    token,
    buildId
  }: {
    ownerName: string
    applicationName: string
    buildId: number
    token: string
  }) {
    console.log('cancelBuild')
    const res = await this._http.patch(
      `apps/${ownerName}/${applicationName}/builds/${buildId}`,
      Body.json({
        status: 'cancelling'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Token': token
        }
      }
    )
    console.log(res)
  }

  async getCommitsBatch(
    ownerName: string,
    applicationName: string,
    hashes: Array<string>,
    token: string
  ): Promise<Array<CommitLiteDto>> {
    return this._http
      .get<Array<CommitLiteDto>>(`apps/${ownerName}/${applicationName}/commits/batch`, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Token': token
        },
        query: {
          form: 'lite',
          hashes: hashes.join(',')
        }
      })
      .then((res) => {
        if (!res.ok) {
          return []
        }

        return res.data
      })
  }
}
