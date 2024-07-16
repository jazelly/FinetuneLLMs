const { getGitVersion } = require("../../endpoints/utils");
const { Telemetry } = require("../../models/telemetry");

function checkColumnTemplate(tablename = null, column = null) {
  if (!tablename || !column)
    throw new Error(`Migration Error`, { tablename, column });
  return `SELECT COUNT(*) AS _exists FROM pragma_table_info('${tablename}') WHERE name='${column}'`;
}

async function checkForMigrations(model, db) {
  if (model.migrations().length === 0) return;
  const toMigrate = [];
  for (const { colName, execCmd, doif } of model.migrations()) {
    const { _exists } = await db.get(
      checkColumnTemplate(model.tablename, colName),
    );
    const colExists = _exists !== 0;
    if (colExists !== doif) continue;

    toMigrate.push(execCmd);
  }

  if (toMigrate.length === 0) return;

  console.log(`Running ${toMigrate.length} migrations`, toMigrate);
  await db.exec(toMigrate.join(";\n"));
  return;
}

async function validateTablePragmas(force = false) {
  try {
    if (process.env.NODE_ENV !== "development" && force === false) {
      console.log(
        `\x1b[34m[MIGRATIONS STUBBED]\x1b[0m Please ping /migrate once server starts to run migrations`,
      );
      return;
    }
    const { SystemSettings } = require("../../models/systemSettings");
    const { User } = require("../../models/user");
    const { Workspace } = require("../../models/workspace");
    const { WorkspaceUser } = require("../../models/workspaceUsers");
    const { Document } = require("../../models/documents");
    const { DocumentVectors } = require("../../models/vectors");
    const { WorkspaceChats } = require("../../models/workspaceChats");
    const { Invite } = require("../../models/invite");
    const { WelcomeMessages } = require("../../models/welcomeMessages");
    const { ApiKey } = require("../../models/apiKeys");

    await SystemSettings.migrateTable();
    await User.migrateTable();
    await Workspace.migrateTable();
    await WorkspaceUser.migrateTable();
    await Document.migrateTable();
    await DocumentVectors.migrateTable();
    await WorkspaceChats.migrateTable();
    await Invite.migrateTable();
    await WelcomeMessages.migrateTable();
    await ApiKey.migrateTable();
  } catch (e) {
    console.error(`validateTablePragmas: Migrations failed`, e);
  }
  return;
}

module.exports = {
  checkForMigrations,
  validateTablePragmas,
};
