import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('role').insert([
    { description: 'specialist', auth_list: { auth: ['specialist'] } },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex('role').where('description', 'specialist').del();
}
