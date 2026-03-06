import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const roles = await knex<{ id: number }>('role')
    .select('id')
    .whereIn('id', [3, 4]);

  await knex('component').insert({
    name: 'medical_report',
    description: 'Allows both patients and specialist to view and upload or download medical reports',
    roles: JSON.stringify(roles.map(r => r.id)),
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex('component').where('name', 'medical_report').del();
}
