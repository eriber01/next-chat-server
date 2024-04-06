import AppDataSource from "../../../config/data-source"
import { Users } from "../../Entity/Users"
import { AuthenticationUserI, resAuthenticationUserI, validateUserExistI } from './interface';
import { hash, compare } from "bcrypt";

const repoUser = AppDataSource.getRepository(Users)

export const validateUserExist = async ({ email }: validateUserExistI) => {

  const user = await repoUser.findOne({ where: { email } })

  if (user) {
    return user
  } else {
    return null
  }
}

export const getUserByEmail = async (email: string) => {
  const user = await repoUser.findOne({ where: { email } })

  if (!user?.id) {
    return { status: 404, user: null, message: 'User not found' }
  }

  const res = {
    ...user,
    pass: 'null',
    createdAt: 'null',
    updatedAt: 'null'
  }

  return { status: 201, user: res, message: null }

}

export const AuthenticationUserForProvider = async (payload: AuthenticationUserI) => {

  try {

    const userExist = await validateUserExist({ email: payload.email })
    if (userExist?.id && userExist?.provider !== payload.provider) {
      return { authorize: false, user: null, error: "Email register with other provider", status: 404 }
    }

    payload.id = userExist?.id
    payload.pass = await hash(payload.pass, 10)
    payload.isNew = userExist?.id ? false : true

    const user = await repoUser.save(repoUser.create(payload))
    const res: AuthenticationUserI = {
      ...user,
      pass: 'null',
      createdAt: 'null',
      updatedAt: 'null'
    }

    return { authorize: true, user: res }
  } catch (error) {
    return { authorize: false, user: null }
  }

}

const loginUser = async (payload: AuthenticationUserI): Promise<resAuthenticationUserI | undefined> => {
  const user = await repoUser.findOne({ where: { email: payload.email, provider: 'credential' } })

  if (!user?.id) {
    return { authorize: false, user: null, error: "User not Found", status: 404 }
  }

  const validatePas = await compare(payload.pass, user.pass)

  if (!validatePas) {
    return { authorize: false, user: null, error: "Invalid Credentials data", status: 401 }
  }

  const res: AuthenticationUserI = {
    ...user,
    pass: 'null',
    createdAt: 'null',
    updatedAt: 'null'
  }

  return { authorize: true, user: res, status: 200, error: null }
}

const createUser = async (payload: AuthenticationUserI): Promise<resAuthenticationUserI | undefined> => {
  const validateUser = await validateUserExist({ email: payload.email })
  try {

    if (validateUser?.id) {
      return { authorize: false, user: null, error: "Email exist", status: 401 }
    }
    payload.provider = 'credential'
    payload.pass = await hash(payload.pass, 10)
    payload.isNew = true

    const user = await repoUser.save(repoUser.create(payload))
    console.log({ validateUser, payload, user });

    const res: AuthenticationUserI = {
      ...user,
      createdAt: 'null',
      updatedAt: 'null'
    }

    return { authorize: true, user: res, status: 200, error: null }

  } catch (error) {
    return { authorize: false, user: null, error: 'Error authenticate', status: 400 }
  }
}

export const AuthenticationUser = async (payload: AuthenticationUserI): Promise<resAuthenticationUserI | undefined> => {
  console.log({ payload });
  try {
    if (payload.type === 'login') {
      const loginUserRes = await loginUser(payload)
      return loginUserRes
    } else if (payload.type === 'register') {
      const createUserRes = await createUser(payload)
      return createUserRes
    }
    return { authorize: false, user: null, error: 'Error authenticate', status: 400 }
  } catch (error) {
    return { authorize: false, user: null, error: 'Error authenticate', status: 400 }
  }
}