import { Request, Response, Router } from 'express'
import { createUser, createUserForProvider, validateUserExist } from '../modules/Users/actions';
import { hash } from 'bcrypt';
const routes = Router()

routes.get('/test', async (req: Request, res: Response) => {
  const pass = await hash('123456', 10)
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

routes.post('/create-user-socials', async (req: Request, res: Response) => {
  const data = await req.body

  try {
    const user = await createUserForProvider(data)
    console.log(user);

    return res.json(user)

  } catch (error) {
    console.log('un error: ', error);
    return res.json({ authorize: false, user: null, error: 'Error authenticate' })
  }
})

routes.post('/create-user', async (req: Request, res: Response) => {
  const data = await req.body

  try {
    const user = await createUser(data)
    console.log(user);
    console.log('paso bien', user?.error);

    return res/* .status(user?.status!) */.json(user)

  } catch (error) {
    console.log('un error: ', error);
    return res/* .status(400) */.json({ authorize: false, user: null, error: 'Error authenticate' })
  }
})


export default routes