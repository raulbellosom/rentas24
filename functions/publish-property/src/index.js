import { Client, Databases } from "node-appwrite";

function parseBody(req) {
  try {
    const raw = req.body ?? req.payload ?? "{}";
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

function getConfig() {
  return {
    endpoint:
      process.env.APPWRITE_FUNCTION_ENDPOINT || process.env.APPWRITE_ENDPOINT,
    projectId:
      process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID,
    apiKey: process.env.APPWRITE_FUNCTION_API_KEY || process.env.APPWRITE_API_KEY,
    databaseId: process.env.APPWRITE_DB_ID || "main",
    propertiesCollectionId: process.env.APPWRITE_COL_PROPERTIES_ID || "properties",
  };
}

export default async ({ req, res, error }) => {
  const config = getConfig();
  if (!config.endpoint || !config.projectId || !config.apiKey) {
    return res.json({ ok: false, message: "Missing Appwrite configuration" }, 500);
  }

  const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey);
  const db = new Databases(client);
  const body = parseBody(req);
  const propertyId = body.propertyId || body.id;
  const callerId = process.env.APPWRITE_FUNCTION_USER_ID;

  if (!propertyId) {
    return res.json({ ok: false, message: "propertyId is required" }, 400);
  }

  try {
    const property = await db.getDocument(
      config.databaseId,
      config.propertiesCollectionId,
      propertyId
    );

    if (!callerId || property.ownerId !== callerId) {
      return res.json(
        { ok: false, message: "Only owner can publish this property" },
        403
      );
    }

    const address =
      typeof property.addressJson === "string" ? property.addressJson : "{}";
    const hasAddress = address !== "{}";
    const hasPhotos =
      Array.isArray(property.photoFileIds) && property.photoFileIds.length > 0;
    const hasPrice = Number(property.price || 0) > 0;
    const hasTitle = String(property.title || "").trim().length > 0;
    const hasDescription = String(property.description || "").trim().length > 0;

    if (!hasAddress || !hasPhotos || !hasPrice || !hasTitle || !hasDescription) {
      return res.json(
        {
          ok: false,
          message:
            "Property must have title, description, address, price and at least one photo",
        },
        422
      );
    }

    const updated = await db.updateDocument(
      config.databaseId,
      config.propertiesCollectionId,
      propertyId,
      { published: true, enabled: true }
    );

    return res.json({ ok: true, propertyId: updated.$id, published: true }, 200);
  } catch (e) {
    error(e.message);
    return res.json({ ok: false, message: e.message }, 500);
  }
};
