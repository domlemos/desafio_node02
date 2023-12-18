import { snackRoutes } from './Modules/Snack/snack-route-plugin.ts';
import { userRoutes } from './Modules/User/user-route-plugin.ts';
import fastify from "fastify";
import cookie from '@fastify/cookie'
import { FastifyCookieOptions } from '@fastify/cookie'
import { loginRoutes } from './Modules/Login/login-route-plugin.ts';
import { middie } from './middlewares/cookielogin.ts'

const server = fastify();

server.register(cookie, {
    email: 'user-email',
    id: 'user-id'
} as FastifyCookieOptions)

const middleware = middie(server)

server.register(loginRoutes, {
    prefix: 'login',
})

server.register(snackRoutes, {
    prefix: 'snacks',
    preHandler: middleware
});

server.register(userRoutes, {
    prefix: 'users',
    preHandler: middleware
});

server.listen({ port: 8000 }, (err, address) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`Server listening at: ${address}`)
});
