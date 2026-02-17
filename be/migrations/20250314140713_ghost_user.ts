import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const role = (
    await knex('role')
      .insert({
        description: 'ghost',
        auth_list: {
          auth: ['ghost'],
        },
      })
      .returning('id')
  )[0];

  const field = (
    await knex('field')
      .insert({
        description: 'ghost',
      })
      .returning('id')
  )[0];

  const ghost_patient = (
    await knex('patient')
      .insert({
        id_role: role.id,
        deleted: false,
        first_name: 'Ghost',
        last_name: 'Patient',
        email: 'ghost.patient@mail.it',
        cap: '12345',
        city: 'Ghost City',
        state: 'Ghost State',
        address: 'Ghost Address',
        cod_fisc: 'GHSPTH00G00H000H',
        birth_date: '2000-01-01',
        birth_place: 'Ghost City',
        sex: 'M',
        phone: '1234567890',
      })
      .returning('id')
  )[0];

  const ghost_bo_op = (
    await knex('bo_operator')
      .insert({
        id_role: role.id,
        id_field: field.id,
        deleted: false,
        first_name: 'Ghost',
        last_name: 'Operator',
        email: 'ghost.operator@mail.it',
      })
      .returning('id')
  )[0];

  const ghost_specialist = (
    await knex('specialist')
      .insert({
        id_role: role.id,
        deleted: false,
        cod_fisc: 'GHSPTH00G00H000H',
        first_name: 'Ghost',
        last_name: 'Specialist',
        email: 'ghost.specialist@mail.it',
        cap: '12345',
        city: 'Ghost City',
        state: 'Ghost State',
        address: 'Ghost Address',
        p_iva: '12345678901',
        birth_date: '2000-01-01',
        sex: 'M',
        phone: '1234567890',
        title: 'Ghost Title',
        specialization: 'Ghost Specialization',
        clinic_name: 'Ghost Clinic',
        clinic_cap: '12345',
        clinic_city: 'Ghost City',
        clinic_address: 'Ghost Address',
        clinic_phone: '1234567890',
      })
      .returning('id')
  )[0];

  await knex('user_credential').insert([
    {
      email: 'ghost.patient@mail.it',
      password: '$2b$10$XByQjshSrLI5kkz8OCgehOnJAXuUdFHFsfxt56TVDOIVf1xDWK1Ce', // sonoUnaPasswordDiTest
      id_patient: ghost_patient.id,
      id_operator: null,
      id_specialist: null,
      deleted: false,
    },
    {
      email: 'ghost.specialist@mail.it',
      password: '$2b$10$XByQjshSrLI5kkz8OCgehOnJAXuUdFHFsfxt56TVDOIVf1xDWK1Ce', // sonoUnaPasswordDiTest
      id_patient: null,
      id_operator: null,
      id_specialist: ghost_specialist.id,
      deleted: false,
    },
    {
      email: 'ghost.operator@mail.it',
      password: '$2b$10$XByQjshSrLI5kkz8OCgehOnJAXuUdFHFsfxt56TVDOIVf1xDWK1Ce', // sonoUnaPasswordDiTest
      id_patient: null,
      id_operator: ghost_bo_op.id,
      id_specialist: null,
      deleted: false,
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex('user_credential')
    .whereIn('email', [
      'ghost.patient@mail.it',
      'ghost.specialist@mail.it',
      'ghost.operator@mail.it',
    ])
    .del();

  await knex('patient').where('email', 'ghost.patient@mail.it').del();

  await knex('bo_operator').where('email', 'ghost.operator@mail.it').del();

  await knex('specialist').where('email', 'ghost.specialist@mail.it').del();

  await knex('role').where('description', 'ghost').del();

  await knex('field').where('description', 'ghost').del();
}
