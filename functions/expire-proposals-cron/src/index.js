import { Client, Databases, Query } from "node-appwrite";

function getConfig() {
  return {
    endpoint:
      process.env.APPWRITE_FUNCTION_ENDPOINT || process.env.APPWRITE_ENDPOINT,
    projectId:
      process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID,
    apiKey: process.env.APPWRITE_FUNCTION_API_KEY || process.env.APPWRITE_API_KEY,
    databaseId: process.env.APPWRITE_DB_ID || "main",
    proposalsCollectionId:
      process.env.APPWRITE_COL_RENTAL_PROPOSALS_ID || "rental_proposals",
  };
}

export default async ({ res, error }) => {
  const config = getConfig();
  if (!config.endpoint || !config.projectId || !config.apiKey) {
    return res.json({ ok: false, message: "Missing Appwrite configuration" }, 500);
  }

  const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey);
  const db = new Databases(client);

  try {
    const now = new Date().toISOString();
    const expired = await db.listDocuments(
      config.databaseId,
      config.proposalsCollectionId,
      [
        Query.equal("status", ["PENDING"]),
        Query.lessThan("expiresAt", now),
        Query.equal("enabled", [true]),
        Query.limit(100),
      ]
    );

    await Promise.all(
      expired.documents.map((doc) =>
        db.updateDocument(
          config.databaseId,
          config.proposalsCollectionId,
          doc.$id,
          { status: "EXPIRED" }
        )
      )
    );

    return res.json(
      { ok: true, processed: expired.documents.length, executedAt: now },
      200
    );
  } catch (e) {
    error(e.message);
    return res.json({ ok: false, message: e.message }, 500);
  }
};
