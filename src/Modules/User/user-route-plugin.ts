import { FastifyInstance } from "fastify";
import { Knex } from '../../../database/knex'
import { z } from 'zod'
import moment from "moment";

const userValidation = z.object({
    name: z.string().min(5),
    email: z.string().email('Invalid email format')
})


export async function userRoutes(server: FastifyInstance) {

    server.get(`/all`, async (request: any, reply: any) => {

        try {
            const result =  Knex('users').select()

            if(!result) {
                throw new Error('Not Found')
            }

            return result
        } catch (error) {
            return reply.code(400).send(error)
        }

    });

    server.get(`/:id`, async (request: any, reply: any) => {
        const id = request.params.id;

        try {
            const user = Knex('users')
                .where('id', id)
                .first().catch(console.error);

            if(!user) {
                throw new Error('Not Found')
            }    
            
            return user

        } catch (err: any) {
            console.log(err)
        }

    });

    server.get(`/getcookie/:id`, async (request: any, reply: any) => {
        
        const cookie = request.cookies.email;

        return reply.send(cookie)

    });    

    server.post(`/`, async (request: any, reply: any) => {
        const { name, email } = request.body;

        try {
            userValidation.parse(request.body)        

            const user = await Knex('users').insert({ name, email, created_at: moment().format() }).then((data) => data);

            if (!user) {
                throw new Error('Not Found')
            }

            return Knex('users').where('id', user[0]).first();
        } catch (error) {
            return reply.code(400).send(error)
        }
    });    

    server.put(`/:id`, async (request: any, reply: any) => {
        const id = request.params.id;

        const { name } = request.body;

        try {

            const updateValidation = z.object({
                name: z.string().min(5)
            })
            
            updateValidation.parse(request.body)
    
            const user = await Knex('users').where('id', id).returning('*').update({ name }).count();

            if (!user.length) {
                throw new Error('Not Found')
            }
    
            return user;
            
        } catch (error) {
            return reply.code(400).send(error)
        }

        
    });

    server.delete(`/:id`, async (request: any, reply: any) => {
        const id = request.params.id;

        try {
            const deleted = await Knex('users').where('id', id).del();

            if (!deleted) {
                throw new Error('Not found')
            }

            return reply.code(204).send()

        } catch (error) {
            return reply.code(400).send(error)
        }        
    });
}
