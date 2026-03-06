import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const roles = await knex<{ id: number }>('role')
    .select('id')
    .whereIn('id', [1, 2, 3, 4]);

  await knex('component').insert({
    name: 'profile',
    description: 'Allows each level of user auth to manage their user information',
    roles: JSON.stringify(roles.map(r => r.id)),
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex('component').where('name', 'profile').del();
}
