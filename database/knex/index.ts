import knex from 'knex'
import { development } from './knexfile.ts'

export const Knex = knex(development)
