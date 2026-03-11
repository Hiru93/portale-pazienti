import type { Knex } from 'knex';
import seedData from '../seeds/specialists_seed.json';

/**
 * Generates ~400 specialist seed records (40 cities × 10 specialists each)
 * distributed across the whole Italian territory, with clinic_coords as
 * PostgreSQL point(lng, lat).
 *
 * Data pools are defined in seeds/specialists_seed.json for easy editing.
 */

function pad3(s: string): string {
  return s.replace(/\s/g, '').toUpperCase().substring(0, 3).padEnd(3, 'X');
}

function buildCodFisc(
  lastName: string,
  firstName: string,
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  sex: string,
  n: number,
): string {
  const sur3 = pad3(lastName);
  const fir3 = pad3(firstName);
  const yr = String(birthYear % 100).padStart(2, '0');
  const mc = seedData.monthCodes[birthMonth - 1];
  const daySex = sex === 'F' ? birthDay + 40 : birthDay;
  const dayStr = String(daySex).padStart(2, '0');
  const seqCode = String(n).padStart(3, '0');
  return `${sur3}${fir3}${yr}${mc}${dayStr}H${seqCode}X`;
}

function buildPIva(j: number, n: number): string {
  return String(10000000000 + j * 10000 + n).substring(0, 11);
}

export async function up(knex: Knex): Promise<void> {
  const role = await knex('role')
    .where('description', 'specialist')
    .select('id')
    .first();

  if (!role) throw new Error('Specialist role not found');

  const {
    cities,
    maleFirstNames,
    femaleFirstNames,
    lastNames,
    specializations,
    sexPerSlot,
    personalStreets,
    clinicStreets,
    streetTypes,
    clinicPrefixes,
  } = seedData;

  const specialists: object[] = [];

  for (let j = 0; j < cities.length; j++) {
    const city = cities[j];

    for (let i = 0; i < 10; i++) {
      const n = j * 10 + i;
      const sex = sexPerSlot[i];
      const firstName =
        sex === 'M'
          ? maleFirstNames[j % maleFirstNames.length]
          : femaleFirstNames[j % femaleFirstNames.length];
      const lastName = lastNames[(j * 7 + i * 11) % lastNames.length];
      const specialization = specializations[i];

      const birthYear = 1960 + (n % 30);
      const birthMonth = (n % 12) + 1;
      const birthDay = (n % 28) + 1;
      const birthDate = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

      const isProf =
        (sex === 'M' && n % 7 === 0) || (sex === 'F' && n % 9 === 0);
      const title = isProf
        ? sex === 'M'
          ? 'Prof.'
          : 'Prof.ssa'
        : sex === 'M'
          ? 'Dott.'
          : 'Dott.ssa';

      const personalStreet = personalStreets[(j + i) % personalStreets.length];
      const streetType = streetTypes[i % streetTypes.length];
      const address = `${streetType} ${personalStreet}, ${(n % 98) + 1}`;

      const phonePrefix = String(20 + (n % 80)).padStart(2, '0');
      const phoneSuffix = String(1234567 + n).padStart(7, '0');
      const phone = `+39 3${phonePrefix} ${phoneSuffix}`;

      const emailSlug = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s/g, '').replace(/'/g, '')}${n}`;
      const email = `${emailSlug}@medici.it`;

      const clinicPrefix = clinicPrefixes[j % clinicPrefixes.length];
      const clinicStreet = clinicStreets[(j * 2 + i) % clinicStreets.length];
      const clinicStreetType = streetTypes[(i + 1) % streetTypes.length];
      const clinicAddress = `${clinicStreetType} ${clinicStreet}, ${(n % 49) + 1}`;
      const clinicName = `${clinicPrefix} ${lastName}`;
      const clinicPhone = `+39 0${String(j + 10).padStart(2, '0')} ${String(3000000 + n).padStart(7, '0')}`;

      // Spread clinics within city bounds (±0.04° lat, ±0.03° lng)
      const latOffset = ((n % 9) - 4) * 0.01;
      const lngOffset = ((n % 7) - 3) * 0.01;
      const clinicLat = parseFloat((city.lat + latOffset).toFixed(4));
      const clinicLng = parseFloat((city.lng + lngOffset).toFixed(4));

      specialists.push({
        id_role: role.id,
        deleted: false,
        cod_fisc: buildCodFisc(
          lastName,
          firstName,
          birthYear,
          birthMonth,
          birthDay,
          sex,
          n,
        ),
        first_name: firstName,
        last_name: lastName,
        email,
        cap: city.cap,
        city: city.city,
        state: city.state,
        address,
        p_iva: buildPIva(j, n),
        birth_date: birthDate,
        sex,
        phone,
        title,
        specialization,
        clinic_name: clinicName,
        clinic_cap: city.cap,
        clinic_city: city.city,
        clinic_address: clinicAddress,
        clinic_phone: clinicPhone,
        clinic_coords: knex.raw('point(?, ?)', [clinicLng, clinicLat]),
      });
    }
  }

  // Insert in batches of 50 to avoid statement size limits
  const batchSize = 50;
  for (let start = 0; start < specialists.length; start += batchSize) {
    await knex('specialist').insert(
      specialists.slice(start, start + batchSize),
    );
  }

  // Seed opening schedules + credentials
  const insertedSpecialists = await knex('specialist')
    .where('email', 'like', '%@medici.it')
    .select('id', 'email')
    .orderBy('id');

  const days = await knex('day').select('id').orderBy('id');
  // days[0]=Lunedì ... days[6]=Domenica

  const schedules: object[] = [];

  for (let si = 0; si < insertedSpecialists.length; si++) {
    const specId = insertedSpecialists[si].id;

    // Mon–Fri (days[0]–days[4])
    for (let di = 0; di < 5; di++) {
      // Wednesday half-day for every 3rd specialist
      const morningOnly = di === 2 && si % 3 === 0;
      schedules.push({
        id_specialist: specId,
        id_day: days[di].id,
        deleted: false,
        opening_morning: si % 2 === 0 ? '08:30:00' : '09:00:00',
        closing_morning: '13:00:00',
        opening_afternoon: morningOnly
          ? '13:00:00'
          : si % 2 === 0
            ? '14:30:00'
            : '15:00:00',
        closing_afternoon: morningOnly
          ? '13:00:00'
          : si % 2 === 0
            ? '18:30:00'
            : '19:00:00',
        slot_size_minutes: 30,
      });
    }

    // Saturday (days[5]) – 2 out of 3 specialists, morning only
    if (si % 3 !== 2) {
      schedules.push({
        id_specialist: specId,
        id_day: days[5].id,
        deleted: false,
        opening_morning: '09:00:00',
        closing_morning: '13:00:00',
        opening_afternoon: '13:00:00',
        closing_afternoon: '13:00:00',
        slot_size_minutes: 30,
      });
    }
  }

  const schedBatchSize = 100;
  for (let start = 0; start < schedules.length; start += schedBatchSize) {
    await knex('opening_schedule').insert(
      schedules.slice(start, start + schedBatchSize),
    );
  }

  // Seed user credentials for each specialist
  // Password: sonoUnaPasswordDiTest (same hash used for ghost users)
  const STOCK_PASSWORD =
    '$2b$10$XByQjshSrLI5kkz8OCgehOnJAXuUdFHFsfxt56TVDOIVf1xDWK1Ce';

  const credentials = insertedSpecialists.map(spec => ({
    email: spec.email,
    password: STOCK_PASSWORD,
    id_specialist: spec.id,
    id_patient: null,
    id_operator: null,
    active: true,
    deleted: false,
  }));

  const credBatchSize = 100;
  for (let start = 0; start < credentials.length; start += credBatchSize) {
    await knex('user_credential').insert(
      credentials.slice(start, start + credBatchSize),
    );
  }
}

export async function down(knex: Knex): Promise<void> {
  const seededIds = await knex<{ id: number }>('specialist')
    .where('email', 'like', '%@medici.it')
    .select('id');

  const ids = seededIds.map(s => s.id);

  // Delete in dependency order: credentials → schedules → specialists
  await knex('user_credential').whereIn('id_specialist', ids).del();
  await knex('opening_schedule').whereIn('id_specialist', ids).del();
  await knex('specialist').where('email', 'like', '%@medici.it').del();
}
