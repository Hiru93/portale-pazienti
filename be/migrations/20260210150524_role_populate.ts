import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('role').insert([
    { description: 'operator', auth_list: { auth: ['operator'] } },
    { description: 'patient', auth_list: { auth: ['patient'] } },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex('role').whereIn('description', ['operator', 'patient']).del();
}
