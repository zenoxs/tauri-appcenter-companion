import { AppcenterApi } from '../services'

export class Environment {
  readonly appcenterApi: AppcenterApi
  readonly appcenterUrl: string = 'https://appcenter.ms/'

  private constructor({ appcenterApi }: Omit<Environment, 'appcenterUrl'>) {
    this.appcenterApi = appcenterApi
  }

  static async create(): Promise<Environment> {
    return new Environment({ appcenterApi: await AppcenterApi.create() })
  }
}
