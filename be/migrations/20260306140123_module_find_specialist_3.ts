import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const roles = await knex<{ id: number }>('role')
    .select('id')
    .whereIn('id', [3]);

  await knex('component').insert({
    name: 'find_specialist',
    description: 'Allows patients to find specialists near their specified area',
    roles: JSON.stringify(roles.map(r => r.id)),
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex('component').where('name', 'find_specialist').del();
}
