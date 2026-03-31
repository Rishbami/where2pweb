import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const projectId = "where2pweb";
const collectionName = "toilets";

async function readAccessToken() {
  const file = path.join(os.homedir(), ".config", "configstore", "firebase-tools.json");
  const raw = await fs.readFile(file, "utf8");
  const config = JSON.parse(raw);
  const accessToken = config?.tokens?.access_token;

  if (!accessToken) {
    throw new Error("No Firebase access token found. Run firebase login --reauth.");
  }

  return accessToken;
}

async function listToilets(accessToken) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to load toilets: ${errorText}`);
  }

  const payload = await response.json();
  return payload.documents ?? [];
}

async function resetToiletStats(accessToken, documentName) {
  const url = `https://firestore.googleapis.com/v1/${documentName}?updateMask.fieldPaths=rating&updateMask.fieldPaths=reviewCount&updateMask.fieldPaths=photosCount`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        rating: { integerValue: "0" },
        reviewCount: { integerValue: "0" },
        photosCount: { integerValue: "0" },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to reset ${documentName}: ${errorText}`);
  }
}

async function main() {
  const accessToken = await readAccessToken();
  const toilets = await listToilets(accessToken);

  for (const toilet of toilets) {
    await resetToiletStats(accessToken, toilet.name);
  }

  console.log(`Reset rating, reviewCount, and photosCount for ${toilets.length} toilets.`);
}

await main();
