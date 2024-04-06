export interface validateUserExistI {
  email: string
  provider?: string
}

export type authType = 'login' | 'register'

export interface AuthenticationUserI {
  id?: number
  name: string
  email: string
  provider?: string
  pass: string
  nickName?: string
  isNew?: boolean
  type?: authType
  createdAt?: string
  updatedAt?: string
}

export interface resAuthenticationUserI {
  authorize: boolean
  user: AuthenticationUserI | null
  error?: string | null
  status: number
}