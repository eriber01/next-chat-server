import { Request, Response, Router } from 'express'
import { AuthenticationUser, AuthenticationUserForProvider, getUserByEmail, validateUserExist } from '../modules/Users/actions';
import { hash } from 'bcrypt';
const routes = Router()

routes.get('/test', async (req: Request, res: Response) => {
  const pass = await hash('123456', 10)
  //$2b$10$Ri1dHpm6kvNy8P78xcU62ux9XhkvQxcIdAitk/Yrm7KRN4XjRrE3O
  return res.status(200).send({
    message: pass
  })
})

routes.get('/validate-user-exists', async (req: Request, res: Response) => {
  const query = await req.query

  const payload = {
    email: query.email as string,
    provider: query.provider as string
  }

  console.log(payload);
  try {

    const validate = await validateUserExist({ ...payload })
    console.log(validate);

    return res.status(200).send({
      validate
    })

  } catch (error) {
    return
  }


})

routes.get('/get-user-by-email', async (req: Request, res: Response) => {
  const query = await req.query
  const email = query.email as string

  try {
    const user = await getUserByEmail(email)
    return res.json(user)
  } catch (error) {
    return res.json({ status: 404, user: null, message: 'Error get the user' })
  }

})

routes.post('/authenticate-user-socials', async (req: Request, res: Response) => {
  const data = await req.body

  try {
    const user = await AuthenticationUserForProvider(data)
    return res.json(user)
  } catch (error) {
    return res.json({ authorize: false, user: null, error: 'Error authenticate' })
  }
})

routes.post('/authenticate-user', async (req: Request, res: Response) => {
  const data = await req.body

  try {
    const user = await AuthenticationUser(data)
    console.log(user);
    console.log('paso bien', user?.error);

    return res.json(user)

  } catch (error) {
    console.log('un error: ', error);
    return res.json({ authorize: false, user: null, error: 'Error authenticate' })
  }
})


export default routes