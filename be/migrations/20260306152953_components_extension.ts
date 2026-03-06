import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('component', table => {
    table.string('label').nullable();
    table.string('icon').nullable();
    table.integer('order').nullable();
  });

  const agendaComponent = await knex('component')
    .where({ name: 'agenda' })
    .select('id')
    .first();

  await knex('component')
    .update({
      label: 'Appuntamenti',
      icon: 'FaCalendar',
      order: 1,
    })
    .where({ id: agendaComponent.id });

  const findSpecialistComponent = await knex('component')
    .where({ name: 'find_specialist' })
    .select('id')
    .first();

  await knex('component')
    .update({
      label: 'Trova uno specialista',
      icon: 'FaUserMd',
      order: 2,
    })
    .where({ id: findSpecialistComponent.id });

  const medicalReportComponent = await knex('component')
    .where({ name: 'medical_report' })
    .select('id')
    .first();

  await knex('component')
    .update({
      label: 'Referti',
      icon: 'FaFileAlt',
      order: 3,
    })
    .where({ id: medicalReportComponent.id });

  const profileComponent = await knex('component')
    .where({ name: 'profile' })
    .select('id')
    .first();

  await knex('component')
    .update({
      label: 'Profilo',
      icon: 'ImProfile',
      order: 4,
    })
    .where({ id: profileComponent.id });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('component', table => {
    table.dropColumn('icon');
    table.dropColumn('order');
    table.dropColumn('label');
  });
}
