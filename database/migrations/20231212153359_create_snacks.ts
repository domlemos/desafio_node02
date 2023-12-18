import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('snacks', function (table) {
        table.increments('id');
        table.string('name', 255).notNullable();
        table.string('description', 255).notNullable();
        table.timestamp('time');
        table.boolean('diet');
        table.integer('user_id')
        table.timestamp('created_at');
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropTable('snacks');
}
