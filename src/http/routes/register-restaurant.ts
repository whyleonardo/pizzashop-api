import { restaurants, users } from '@/db/schema'
import { db } from '@/db/connection'
import Elysia, { t } from 'elysia'
import { EmailAlreadyExists } from './errors/email-already-exists'

export const registerRestaurant = new Elysia()
  .error({
    EMAIL_ALREADY_EXISTS: EmailAlreadyExists,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'EMAIL_ALREADY_EXISTS':
        set.status = 422
        return { code, message: error.message }
    }
  })
  .post(
    '/restaurants',
    async ({ body, set }) => {
      const { restaurantName, managerName, email, phone } = body

      try {
        const [manager] = await db
          .insert(users)
          .values({
            name: managerName,
            email,
            phone,
            role: 'manager',
          })
          .returning()

        await db.insert(restaurants).values({
          name: restaurantName,
          managerId: manager.id,
        })

        set.status = 204
      } catch (err) {
        if (err.code === '23505') {
          throw new EmailAlreadyExists()
        }
      }
    },
    {
      body: t.Object({
        restaurantName: t.String(),
        managerName: t.String(),
        phone: t.String(),
        email: t.String({ format: 'email' }),
      }),
    },
  )
