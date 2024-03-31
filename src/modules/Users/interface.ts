export interface validateUserExistI {
  email: string
  provider?: string
}

export type authType = 'login' | 'register'

export interface createUserI {
  id?: number
  name: string
  email: string
  provider?: string
  pass: string
  nickName?: string
  isNew?: boolean
  type?: authType
}

export interface resCreateUserI {
  authorize: boolean
  user: createUserI | null
  error?: string | null
  status: number
}