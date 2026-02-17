export const jwtConstants = {
  secret: process.env.PP_BE_SECRET,
};

export const userDefaultDataDTO = {
  register: {
    operator: {
      summary: 'Operator',
      description: 'Operator user-info sample payload',
      value: {
        opInfo: {
          email: 'operator@example.com',
          password: 'operator123',
          first_name: 'John',
          last_name: 'Operator',
          deleted: false,
          id_field: 1,
        },
        patInfo: null,
        specInfo: null,
      },
    },
    patient: {
      summary: 'Patient',
      description: 'Patient user-info sample payload',
      value: {
        patInfo: {
          email: 'patient@example.com',
          password: 'patient123',
          first_name: 'Mary',
          last_name: 'Patient',
          deleted: false,
          id_role: 2,
          cap: 12345,
          city: 'Milan',
          state: 'Italy',
          address: 'Via Roma 123',
          cod_fisc: 'ABCDEF12G34H567I',
          birth_date: '1990-01-01',
          sex: 'F',
          phone: '1234567890',
          birth_place: 'Rome',
        },
        opInfo: null,
        specInfo: null,
      },
    },
    specialist: {
      summary: 'Specialist',
      description: 'Specialist user-info sample payload',
      value: {
        spInfo: {
          email: 'specialist@example.com',
          password: 'specialist123',
          first_name: 'Robert',
          last_name: 'Specialist',
          deleted: false,
          id_role: 3,
          cap: 54321,
          city: 'Rome',
          state: 'Italy',
          address: 'Via Milano 456',
          cod_fisc: 'LMNOPQ78R90S123T',
          birth_date: '1985-05-15',
          sex: 'M',
          phone: '0987654321',
          p_iva: '12345678901',
          title: 'Dr.',
          specialization: 'Cardiology',
          clinic_name: 'Heart Center',
          clinic_cap: 12345,
          clinic_city: 'Florence',
          clinic_address: 'Via Napoli 789',
          clinic_phone: '1123581321',
        },
        patInfo: null,
        opInfo: null,
      },
    },
  },
  login: {
    operator: {
      summary: 'Operator',
      description: 'Operator user-info sample payload',
      value: {
        email: 'ghost.operator@mail.it',
        password: 'sonoUnaPasswordDiTest',
      },
    },
    patient: {
      summary: 'Patient',
      description: 'Patient user-info sample payload',
      value: {
        email: 'ghost.patient@mail.it',
        password: 'sonoUnaPasswordDiTest',
      },
    },
    specialist: {
      summary: 'Specialist',
      description: 'Specialist user-info sample payload',
      value: {
        email: 'ghost.specialist@mail.it',
        password: 'sonoUnaPasswordDiTest',
      },
    },
  },
};

export const roleDefaultDataDTO = {
  list: [
    {
      id: 1,
      description: 'Ghost',
      auth_list: {
        auth: ['ghost'],
      },
    },
    {
      id: 2,
      description: 'Operator',
      auth_list: {
        auth: ['operator'],
      },
    },
  ],
};
