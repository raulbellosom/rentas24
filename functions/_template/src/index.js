import { Client, Databases, Storage, Users } from "node-appwrite";

export default async ({ req, res, error }) => {
  try {
    const endpoint =
      process.env.APPWRITE_FUNCTION_ENDPOINT || process.env.APPWRITE_ENDPOINT;
    const projectId =
      process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_FUNCTION_API_KEY || process.env.APPWRITE_API_KEY;

    if (!endpoint || !projectId || !apiKey) {
      return res.json(
        { ok: false, message: "Missing required Appwrite connection variables." },
        500
      );
    }

    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);

    const databases = new Databases(client);
    const storage = new Storage(client);
    const users = new Users(client);

    return res.json({
      ok: true,
      message: "Function template running",
      meta: {
        method: req.method,
        path: req.path,
        services: {
          databases: Boolean(databases),
          storage: Boolean(storage),
          users: Boolean(users),
        },
      },
    });
  } catch (e) {
    error(e.message || String(e));
    return res.json({ ok: false, message: String(e) }, 500);
  }
};
