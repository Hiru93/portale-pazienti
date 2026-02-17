import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex("day").insert([
    { description: "Lunedì" },
    { description: "Martedì" },
    { description: "Mercoledì" },
    { description: "Giovedì" },
    { description: "Venerdì" },
    { description: "Sabato" },
    { description: "Domenica" },
  ]);

  await knex("status").insert([
    { description: "Pagato" },
    { description: "Non pagato" },
    { description: "Annullato" },
    { description: "Confermato" },
    { description: "Non confermato" },
    { description: "In attesa" },
    { description: "In corso" },
    { description: "Concluso" },
    { description: "Rifiutato" },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex("day").where({ description: "Lunedì" }).del();
  await knex("day").where({ description: "Martedì" }).del();
  await knex("day").where({ description: "Mercoledì" }).del();
  await knex("day").where({ description: "Giovedì" }).del();
  await knex("day").where({ description: "Venerdì" }).del();
  await knex("day").where({ description: "Sabato" }).del();
  await knex("day").where({ description: "Domenica" }).del();

  await knex("status").where({ description: "Pagato" }).del();
  await knex("status").where({ description: "Non pagato" }).del();
  await knex("status").where({ description: "Annullato" }).del();
  await knex("status").where({ description: "Confermato" }).del();
  await knex("status").where({ description: "Non confermato" }).del();
  await knex("status").where({ description: "In attesa" }).del();
  await knex("status").where({ description: "In corso" }).del();
  await knex("status").where({ description: "Concluso" }).del();
  await knex("status").where({ description: "Rifiutato" }).del();
}
