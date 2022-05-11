import * as http from '@tauri-apps/api/http'

export interface HttpClientOptions {
  baseUrl?: string
}

export class HttpClient {
  private readonly _client: http.Client
  private readonly _baseUrl: string

  private constructor(client: http.Client, options?: HttpClientOptions) {
    this._client = client
    this._baseUrl = options?.baseUrl ?? ''
  }

  static async getClient(options?: HttpClientOptions): Promise<HttpClient> {
    return new HttpClient(await http.getClient(), options)
  }

  get<T>(url: string, options?: http.RequestOptions) {
    return this._client.get<T>(this._baseUrl + url, options)
  }

  post<T>(url: string, body?: http.Body, options?: http.RequestOptions) {
    return this._client.post<T>(this._baseUrl + url, body, options)
  }

  patch<T>(url: string, body: http.Body, options?: http.RequestOptions) {
    return this._client.request<T>({
      method: 'PATCH',
      url: this._baseUrl + url,
      body,
      ...options
    })
  }
}
