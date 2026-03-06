import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const roles = await knex<{ id: number }>('role')
    .select('id')
    .whereIn('id', [1, 3, 4]);

  await knex('component').insert({
    name: 'agenda',
    description:
      'Allows both patients and specialists to manage their requested and received appointments',
    roles: JSON.stringify(roles.map(r => r.id)),
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex('component').where('name', 'agenda').del();
}
