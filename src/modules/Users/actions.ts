import AppDataSource from "../../../config/data-source"
import { Users } from "../../Entity/Users"
import { createUserI, resCreateUserI, validateUserExistI } from './interface';
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

export const createUserForProvider = async (payload: createUserI) => {

  try {

    const userExist = await validateUserExist({ email: payload.email })

    payload.id = userExist?.id
    payload.pass = await hash(payload.pass, 10)
    payload.isNew = userExist?.id ? false : true

    const user = await repoUser.save(repoUser.create(payload))

    console.log(user);

    const res: createUserI = {
      ...user,
      pass: 'null'
    }

    return { authorize: true, user: res }
  } catch (error) {
    return { authorize: false, user: null }
  }

}

export const createUser = async (payload: createUserI): Promise<resCreateUserI | undefined> => {
  console.log({ payload });
  try {

    if (payload.type === 'login') {
      const user = await repoUser.findOne({ where: { email: payload.email, provider: 'credential' } })

      if (!user?.id) {
        // throw new Error("User not Found");
        return { authorize: false, user: null, error: "User not Found", status: 404 }
      }

      const validatePas = await compare(payload.pass, user.pass)

      if (!validatePas) {
        // throw new Error("Invalid Credentials data");
        return { authorize: false, user: null, error: "Invalid Credentials data", status: 401 }
      }

      const res: createUserI = {
        ...user,
        pass: 'null'
      }

      return { authorize: true, user: res, status: 200, error: null }

    }
  } catch (error) {
    return { authorize: false, user: null, error: 'Error authenticate', status: 400 }
  }
}