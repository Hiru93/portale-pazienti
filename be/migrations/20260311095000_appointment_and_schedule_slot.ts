import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add slot_size_minutes to opening_schedule (may already exist if init SQL was re-run)
  const hasSlotCol = await knex.schema.hasColumn(
    'opening_schedule',
    'slot_size_minutes',
  );
  if (!hasSlotCol) {
    await knex.schema.alterTable('opening_schedule', table => {
      table.integer('slot_size_minutes').notNullable().defaultTo(30);
    });
  }

  // Create appointment table
  await knex.schema.createTableIfNotExists('appointment', table => {
    table.increments('id').primary();
    table
      .integer('id_patient')
      .notNullable()
      .references('id')
      .inTable('patient');
    table
      .integer('id_specialist')
      .notNullable()
      .references('id')
      .inTable('specialist');
    table.integer('id_status').notNullable().references('id').inTable('status');
    table.date('date').notNullable();
    table.time('time_start').notNullable();
    table.time('time_end').notNullable();
    table.text('notes').nullable();
    table.boolean('deleted').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
    table.unique(['id_specialist', 'date', 'time_start']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('appointment');

  await knex.schema.alterTable('opening_schedule', table => {
    table.dropColumn('slot_size_minutes');
  });
}
