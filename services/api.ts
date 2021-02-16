import nc from 'next-connect'
import { onError, useError } from './middlewares/error'
import { NextApiRequest, NextApiResponse } from 'next'
import { API } from './middlewares/error'
import { StoreProvider } from '@notea/store'

export type ApiRequest = NextApiRequest & {
  store: StoreProvider
  user: any
}

export type ApiResponse = NextApiResponse & {
  APIError: typeof API
}

export type ApiNext = () => void

export const api = () =>
  nc<ApiRequest, ApiResponse>({
    onError,
  }).use(useError)
