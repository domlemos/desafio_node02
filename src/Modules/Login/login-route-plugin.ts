import { FastifyInstance } from "fastify";
import { Knex } from '../../../database/knex'
import { z } from 'zod'

const userValidation = z.object({
    email: z.string().email('Invalid email format')
})

export async function loginRoutes(server: FastifyInstance) {
    server.post(`/`, async (request: any, reply: any) => {

        const { email } = request.body;

        const user = await Knex('users').whereRaw('email = ?', email).then(data => data)

        const id =  user[0].id        

        return reply
            .setCookie('email', email, { email })
            .setCookie('id', id, { id })
            .send('Login')
    });
}
