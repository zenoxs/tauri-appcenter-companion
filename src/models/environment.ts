import { AppcenterApi } from '../services'

export class Environment {
  readonly appcenterApi: AppcenterApi
  private constructor({ appcenterApi }: Environment) {
    this.appcenterApi = appcenterApi
  }

  static async create(): Promise<Environment> {
    return new Environment({ appcenterApi: await AppcenterApi.create() })
  }
}
