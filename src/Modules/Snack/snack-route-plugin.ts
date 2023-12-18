import { FastifyInstance } from "fastify";
import { Knex } from '../../../database/knex'
import { z } from 'zod'
import moment from "moment";
import { getSnacksByUserEmail, getTotalSnacksByDiet, getBestDietScore } from '../../Domain/Snack/Sevice'


const snackValidation = z.object({
    name: z.string(),
    description: z.string(),    
    diet: z.boolean(),
})

export async function snackRoutes(server: FastifyInstance) {

    server.get(`/user/all`, async (request: any, reply: any) => {
        try {

            const result = getSnacksByUserEmail(request.cookies.email);
            
            if(!result) {
                throw new Error('Not Found')
            }

            return result

        } catch (error) {
            return reply.code(200).send(error)
        }
    });

    server.get(`/:id`, async (request: any, reply: any) => {

        try {

            const result = await Knex('snacks').where('id', request.params.id).first()

            if(!result) {            
                throw new Error('Not Found')
            }
            
            return result;

        } catch (error) {
            return reply.code(400).send(error)
        }
    });

    server.post(`/`, async (request: any, reply: any) => {
        const { name, description, diet } = request.body;        

        try {
            snackValidation.parse(request.body)        

            const snack = await Knex('snacks').insert({ 
                name,
                description,
                time: moment().format(),
                user_id: request.cookies.id,
                diet,
                created_at: moment().format()
            }).then((data) => data);

            if(!snack) {
                throw new Error('Not Found')   
            }

            return Knex('snacks').where('id', snack[0]).first();

        } catch (error) {
            return reply.code(400).send(error)
        }
    });

    server.put(`/:id`, async (request: any, reply: any) => {
        const id = request.params.id;
        const { name, description, diet } = request.body;

        try {
            snackValidation.parse(request.body)

            const snacks = await Knex('snacks').where('id', id).returning('*').update({ name, description, diet }).count();            

            if (!snacks.length) {
                throw new Error('Not Found')
            }

            return snacks;    
        } catch (error) {
            return reply.code(400).send(error)
        }
    });

    server.delete(`/:id`, async (request: any, reply: any) => {

        try {
            const id = request.params.id;

            const deleted = await Knex('snacks').where('id', id).del();  
            
            if(!deleted) {
                throw new Error('Not Found')
            }

            return reply.code(204).send(deleted)
        } catch (error) {
            return reply.code(400).send(error)
        }
    });

    server.get(`/total`, async (request: any, reply: any) => {

        try {
            const result = await getSnacksByUserEmail(request.cookies.email)

            if(!result) {
                throw new Error('Not Found')
            }

            return result.length

        } catch (error) {
            return reply.code(400).send(error)            
        }

    })    

    server.get(`/diet/:bool`, async (request: any, reply: any) => {

        try {
            console.log(request.cookies.email, request.params.bool)
            const result = await getTotalSnacksByDiet(request.cookies.email, request.params.bool)

            if(!result) {
                throw new Error('Not Found')
            }

            return result

        } catch (error) {
            return reply.code(400).send(error)            
        }
    })

    server.get(`/diet/score`, async (request: any, reply: any) => {

        try {

            const result = getBestDietScore(request.cookies.email)

            if(!result) {
                throw new Error('Not Found')
            }

            return result
            

        } catch (error) {
            return reply.code(400).send(error)            
        }
    })
}
