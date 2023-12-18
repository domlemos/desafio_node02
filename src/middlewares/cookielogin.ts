import { Knex } from '../../database/knex'
import { FastifyInstance, RequestBodyDefault } from "fastify";

export const middie = (server: FastifyInstance) => {
    server.addHook('onSend', async (request: any, reply: any) => {
        const emailCookie = request.cookies.email ?? false;
        if (!emailCookie) {
            throw new Error('Invalid Request')
        }

        const user =  await Knex('users').where('email', emailCookie).first();        

        if(emailCookie !== user.email) {
            throw new Error('Invalid Request')
        }        
    })
}
