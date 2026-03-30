import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const projectId = "where2pweb";
const collectionName = "toilets";

const toiletSeedData = [
  {
    id: "piccadilly-gardens",
    name: "Piccadilly Gardens Public Toilets",
    description:
      "Busy city-centre toilets near the tram stop with regular cleaning checks and clear signage.",
    address: "Piccadilly Gardens, Manchester M1 1RG",
    location: { lat: 53.4814, lng: -2.2375 },
    rating: 4.4,
    reviewCount: 127,
    accessibility: ["wheelchair", "baby-changing"],
    openingHours: "Open daily · 7am to 10pm",
    photosCount: 8,
  },
  {
    id: "central-library",
    name: "Manchester Central Library",
    description:
      "Indoor toilets inside Central Library with step-free access and plenty of space for parents.",
    address: "St Peter's Square, Manchester M2 5PD",
    location: { lat: 53.4787, lng: -2.2447 },
    rating: 4.8,
    reviewCount: 94,
    accessibility: ["wheelchair", "baby-changing", "gender-neutral"],
    openingHours: "Library hours · closes 8pm",
    photosCount: 5,
  },
  {
    id: "arndale-centre",
    name: "Manchester Arndale",
    description:
      "Reliable shopping-centre facilities close to food court seating and family services.",
    address: "49 High Street, Manchester M4 3AQ",
    location: { lat: 53.4844, lng: -2.2402 },
    rating: 4.1,
    reviewCount: 203,
    accessibility: ["wheelchair", "baby-changing"],
    openingHours: "Centre hours · closes 9pm",
    photosCount: 12,
  },
  {
    id: "northern-quarter",
    name: "Northern Quarter Community Hub",
    description:
      "Smaller but well-kept option with gender-neutral stalls and quick access from the high street.",
    address: "Stevenson Square, Manchester M1 1DB",
    location: { lat: 53.4838, lng: -2.2349 },
    rating: 3.9,
    reviewCount: 41,
    accessibility: ["gender-neutral"],
    openingHours: "Mon-Sat · 8am to 6pm",
    photosCount: 3,
  },
  {
    id: "deansgate-station",
    name: "Deansgate Station Facilities",
    description:
      "Transport-hub toilets suited for quick stops, with accessible cubicles and clear directions.",
    address: "Deansgate Station, Manchester M3 4LG",
    location: { lat: 53.474, lng: -2.2501 },
    rating: 4.2,
    reviewCount: 58,
    accessibility: ["wheelchair"],
    openingHours: "Station hours · early to late",
    photosCount: 4,
  },
];

function fieldValue(value) {
  if (typeof value === "string") {
    return { stringValue: value };
  }

  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }

  if (typeof value === "boolean") {
    return { booleanValue: value };
  }

  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map((item) => fieldValue(item)),
      },
    };
  }

  if (value && typeof value === "object") {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(value).map(([key, nestedValue]) => [key, fieldValue(nestedValue)]),
        ),
      },
    };
  }

  return { nullValue: null };
}

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

async function upsertToilet(accessToken, toilet) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}/${toilet.id}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        name: fieldValue(toilet.name),
        description: fieldValue(toilet.description),
        address: fieldValue(toilet.address),
        location: fieldValue(toilet.location),
        rating: fieldValue(toilet.rating),
        reviewCount: fieldValue(toilet.reviewCount),
        accessibility: fieldValue(toilet.accessibility),
        openingHours: fieldValue(toilet.openingHours),
        photosCount: fieldValue(toilet.photosCount),
        searchKeywords: fieldValue(toilet.name.toLowerCase().split(" ")),
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to seed ${toilet.id}: ${errorText}`);
  }
}

async function main() {
  const accessToken = await readAccessToken();

  for (const toilet of toiletSeedData) {
    await upsertToilet(accessToken, toilet);
  }

  console.log(`Seeded ${toiletSeedData.length} toilets into ${projectId}.`);
}

await main();
