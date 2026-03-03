import _knex from "knex";
import knexConfig from "#config/knex/knexfile.js";
import { logger } from "#common/logger/logger-config.js";

const knex = _knex(knexConfig);
export default knex;

function logMigrationResults(action: string, result: [number, string[]]) {
    if (result[1].length === 0) {
        logger.info(
            ["latest", "up"].includes(action)
                ? "All migrations are up to date"
                : "All migrations have been rolled back",
        );
        return;
    }
    logger.info("Migrations batch completed", {
        action,
        batch: result[0],
        files: result[1],
    });
}
function logMigrationList(list: [{ name: string }[], { file: string }[]]) {
    logger.info("Migrations list", {
        completedCount: list[0].length,
        completed: list[0].map((m) => m.name),
        pendingCount: list[1].length,
        pending: list[1].map((m) => m.file),
    });
}

function logSeedRun(result: [string[]]) {
    if (result[0].length === 0) {
        logger.info("No seeds to run");
        return;
    }
    logger.info("Ran seed files", {
        count: result[0].length,
        files: result[0].map((name) => name?.split(/\/|\\/).pop()),
    });
}

function logSeedMake(name: string) {
    logger.info("Created seed", { file: name.split(/\/|\\/).pop() });
}

export const migrate = {
    latest: async () => {
        logMigrationResults("latest", await knex.migrate.latest());
    },
    rollback: async () => {
        logMigrationResults("rollback", await knex.migrate.rollback());
    },
    down: async (name?: string) => {
        logMigrationResults("down", await knex.migrate.down({ name }));
    },
    up: async (name?: string) => {
        logMigrationResults("up", await knex.migrate.up({ name }));
    },
    list: async () => {
        logMigrationList(await knex.migrate.list());
    },
    make: async (name: string) => {
        if (!name) {
            logger.error("Please provide a migration name");
            process.exit(1);
        }
        const filePath = await knex.migrate.make(name, { extension: "js" });
        logMigrationResults("make", [0, [String(filePath)]]);
    },
};

export const seed = {
    run: async () => {
        logSeedRun(await knex.seed.run());
    },
    make: async (name: string) => {
        if (!name) {
            logger.error("Please provide a seed name");
            process.exit(1);
        }
        logSeedMake(await knex.seed.make(name));
    },
};
