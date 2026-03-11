import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('specialist', table => {
    table.point('clinic_coords').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('specialist', table => {
    table.dropColumn('clinic_coords');
  });
}
