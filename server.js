import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  LifestyleMatchSchema,
  PetSearchQuerySchema,
} from "./shared/schemas.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.API_PORT || 4174);
const shelter = {
  id: "e81d89a2-3f11-4b10-87ef-32b0a32190bc",
  name: "Rose City Rescue",
  city: "Portland",
  state: "OR",
};
const featuredPetBios = {
  Maple:
    "A warm-hearted retriever who loves long sniffy walks and being close to her people.",
  Olive:
    "A gentle lap cat who saves her brightest purrs for a calm afternoon at home.",
  Mochi:
    "A tender little rabbit who feels safest with soft voices and a hideaway of his own.",
  Scout:
    "An eager young terrier who is always up for a new trail, toy, or friend.",
  Poppy:
    "A thoughtful tabby who likes a little time to settle in before sharing her affection.",
  Benny:
    "A friendly beagle who follows his nose to new adventures and good company.",
  Clover:
    "A sweet-natured lop who loves fresh greens and exploring at her own pace.",
  Frankie:
    "A devoted senior companion who has perfected the art of the cozy couch nap.",
  Juniper:
    "A bright, quick learner who would love puzzle games and an active home.",
  Waffles:
    "A cheerful orange cat who thinks every visitor might be here to say hello to him.",
  Biscuit:
    "A little dog with a huge heart, short legs, and an excellent neighborhood trot.",
  Miso: "A quiet, observant cat who enjoys soft blankets and a patient introduction.",
  River:
    "A joyful water-loving buddy who is happiest with room to roam and a person to follow.",
  Pippa:
    "A curious bunny who likes gentle company, leafy snacks, and a roomy place to hop.",
  Otis: "An easygoing older gentleman who would happily trade a short stroll for a long cuddle.",
  Ziggy:
    "A lively kitten who turns crinkly toys, paper bags, and sunny spots into big events.",
  Daisy:
    "An affectionate cuddle bug who greets her favorite people with a whole-body wiggle.",
  Peanut:
    "A tiny rabbit with a bold streak and a serious appreciation for fresh parsley.",
  Luna: "A graceful window watcher who enjoys a peaceful home and choosing when to say hi.",
  Milo: "A clever, eager-to-please pup who is ready to learn the rhythms of his new family.",
  Sesame:
    "A polite tuxedo cat who offers a soft hello, then settles in for a happy purr.",
  Rosie:
    "A merry little scent detective who makes every ordinary walk feel like an expedition.",
  Nibbles:
    "A soft-coated bunny who loves a leafy snack and a comfortable corner to unwind.",
  Archie:
    "An energetic sidekick who would love to trade fetch, trail time, and training games.",
  Cleo: "A sweet but shy young cat who blossoms with a steady routine and kind patience.",
  Sunny:
    "A sunshine-filled retriever who brings a happy hello to every room she enters.",
  Pickles:
    "A thoughtful companion who prefers a slow introduction and a familiar daily routine.",
  Teddy:
    "A gentle senior who is happiest beside his person, preferably with a blanket nearby.",
  Fig: "A curious little rabbit who celebrates a good day with joyful hops and binkies.",
  Coco: "A devoted small-dog shadow who likes a cozy lap and a person to call her own.",
  Marbles:
    "A bright-eyed bird watcher who can happily spend an afternoon at the window.",
  Blue: "A mellow hound with a soulful gaze, a steady stride, and a very waggy tail.",
};
const pets = [
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e001",
    "Maple",
    "Dog",
    "Golden Retriever mix",
    18,
    "Female",
    "Large",
    true,
    true,
    "photo-1552053831-71594a27632d",
    "Just arrived",
    "House",
    "High",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e002",
    "Olive",
    "Cat",
    "Domestic shorthair",
    30,
    "Female",
    "Small",
    false,
    true,
    "photo-1573865526739-10659fec78a5",
    "Foster favorite",
    "Apartment",
    "Low",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e003",
    "Mochi",
    "Rabbit",
    "Lionhead rabbit",
    10,
    "Male",
    "Small",
    false,
    false,
    "photo-1585110396000-c9ffd4e4b308",
    "Needs a quiet home",
    "Apartment",
    "Low",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e004",
    "Scout",
    "Dog",
    "Terrier mix",
    9,
    "Male",
    "Medium",
    true,
    true,
    "photo-1543466835-00a7907e9de1",
    "Ready for adventures",
    "House",
    "High",
    true,
    false,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e005",
    "Poppy",
    "Cat",
    "Tabby mix",
    14,
    "Female",
    "Small",
    false,
    true,
    "photo-1514888286974-6c03e2ca1dba",
    "A little shy at first",
    "Apartment",
    "Low",
    false,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e006",
    "Benny",
    "Dog",
    "Beagle mix",
    42,
    "Male",
    "Medium",
    true,
    true,
    "photo-1505628346881-b72b27e84530",
    "Looking for a pal",
    "House",
    "Moderate",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e007",
    "Clover",
    "Rabbit",
    "Mini lop",
    7,
    "Female",
    "Small",
    false,
    false,
    "photo-1535241749838-299277b6305f",
    "A sweet little friend",
    "Apartment",
    "Low",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e008",
    "Frankie",
    "Dog",
    "Chihuahua mix",
    60,
    "Male",
    "Small",
    false,
    false,
    "photo-1517849845537-4d257902454a",
    "Senior, sweetest heart",
    "Apartment",
    "Low",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e009",
    "Juniper",
    "Dog",
    "Australian Shepherd mix",
    24,
    "Female",
    "Large",
    true,
    true,
    "photo-1537151608828-ea2b11777ee8",
    "Brainy and bright",
    "House",
    "High",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e010",
    "Waffles",
    "Cat",
    "Orange tabby",
    8,
    "Male",
    "Small",
    true,
    true,
    "photo-1514888286974-6c03e2ca1dba",
    "Professional lap warmer",
    "Apartment",
    "Low",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e011",
    "Biscuit",
    "Dog",
    "Corgi mix",
    15,
    "Male",
    "Small",
    true,
    true,
    "photo-1543466835-00a7907e9de1",
    "Short legs, big heart",
    "Apartment",
    "Moderate",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e012",
    "Miso",
    "Cat",
    "Tortoiseshell",
    20,
    "Female",
    "Small",
    false,
    true,
    "photo-1573865526739-10659fec78a5",
    "Quiet, curious companion",
    "Apartment",
    "Low",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e013",
    "River",
    "Dog",
    "Labrador mix",
    36,
    "Male",
    "Large",
    true,
    true,
    "photo-1552053831-71594a27632d",
    "Loves every walking trail",
    "House",
    "High",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e014",
    "Pippa",
    "Rabbit",
    "Holland lop",
    11,
    "Female",
    "Small",
    true,
    true,
    "photo-1585110396000-c9ffd4e4b308",
    "A gentle little explorer",
    "Apartment",
    "Low",
    false,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e015",
    "Otis",
    "Dog",
    "Pug mix",
    72,
    "Male",
    "Small",
    true,
    true,
    "photo-1505628346881-b72b27e84530",
    "Easygoing senior sweetheart",
    "Apartment",
    "Low",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e016",
    "Ziggy",
    "Cat",
    "Black domestic shorthair",
    5,
    "Male",
    "Small",
    true,
    true,
    "photo-1514888286974-6c03e2ca1dba",
    "Playful kitten energy",
    "Apartment",
    "High",
    false,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e017",
    "Daisy",
    "Dog",
    "Pit bull mix",
    30,
    "Female",
    "Medium",
    true,
    true,
    "photo-1537151608828-ea2b11777ee8",
    "A+ cuddle enthusiast",
    "House",
    "Moderate",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e018",
    "Peanut",
    "Rabbit",
    "Netherland dwarf",
    6,
    "Male",
    "Small",
    false,
    true,
    "photo-1535241749838-299277b6305f",
    "Small friend, huge personality",
    "Apartment",
    "Low",
    false,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e019",
    "Luna",
    "Cat",
    "Calico",
    48,
    "Female",
    "Small",
    true,
    false,
    "photo-1573865526739-10659fec78a5",
    "A window-seat kind of cat",
    "Apartment",
    "Low",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e020",
    "Milo",
    "Dog",
    "Poodle mix",
    14,
    "Male",
    "Medium",
    true,
    true,
    "photo-1517849845537-4d257902454a",
    "Ready to learn new tricks",
    "House",
    "Moderate",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e021",
    "Sesame",
    "Cat",
    "Tuxedo cat",
    18,
    "Male",
    "Small",
    true,
    true,
    "photo-1514888286974-6c03e2ca1dba",
    "Polite hello, happy purr",
    "Apartment",
    "Low",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e022",
    "Rosie",
    "Dog",
    "Beagle mix",
    54,
    "Female",
    "Medium",
    true,
    true,
    "photo-1543466835-00a7907e9de1",
    "Nose-first neighborhood scout",
    "House",
    "Moderate",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e023",
    "Nibbles",
    "Rabbit",
    "Mini rex",
    16,
    "Male",
    "Small",
    true,
    false,
    "photo-1585110396000-c9ffd4e4b308",
    "Loves parsley and soft blankets",
    "Apartment",
    "Low",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e024",
    "Archie",
    "Dog",
    "Border collie mix",
    20,
    "Male",
    "Medium",
    true,
    true,
    "photo-1552053831-71594a27632d",
    "Your next trail buddy",
    "House",
    "High",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e025",
    "Cleo",
    "Cat",
    "Gray tabby",
    9,
    "Female",
    "Small",
    true,
    true,
    "photo-1573865526739-10659fec78a5",
    "Sweet once she says hello",
    "Apartment",
    "Low",
    false,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e026",
    "Sunny",
    "Dog",
    "Retriever mix",
    10,
    "Female",
    "Large",
    true,
    true,
    "photo-1537151608828-ea2b11777ee8",
    "The sunshine in every room",
    "House",
    "High",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e027",
    "Pickles",
    "Cat",
    "Domestic shorthair",
    36,
    "Male",
    "Small",
    false,
    true,
    "photo-1514888286974-6c03e2ca1dba",
    "A thoughtful, loyal sidekick",
    "Apartment",
    "Low",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e028",
    "Teddy",
    "Dog",
    "Shih tzu mix",
    84,
    "Male",
    "Small",
    true,
    true,
    "photo-1505628346881-b72b27e84530",
    "Senior snuggles specialist",
    "Apartment",
    "Low",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e029",
    "Fig",
    "Rabbit",
    "English spot",
    8,
    "Female",
    "Small",
    true,
    true,
    "photo-1535241749838-299277b6305f",
    "Binky breaks are guaranteed",
    "Apartment",
    "Low",
    false,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e030",
    "Coco",
    "Dog",
    "Chihuahua mix",
    28,
    "Female",
    "Small",
    true,
    false,
    "photo-1517849845537-4d257902454a",
    "Tiny, devoted, and stylish",
    "Apartment",
    "Moderate",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e031",
    "Marbles",
    "Cat",
    "Calico",
    24,
    "Female",
    "Small",
    true,
    true,
    "photo-1573865526739-10659fec78a5",
    "Part-time bird watcher",
    "Apartment",
    "Low",
    true,
    true,
  ],
  [
    "c39e4589-7b2a-4f11-9a2c-87d21b44e032",
    "Blue",
    "Dog",
    "Hound mix",
    42,
    "Male",
    "Large",
    true,
    true,
    "photo-1543466835-00a7907e9de1",
    "A mellow pal with a happy tail",
    "House",
    "Moderate",
    true,
    true,
  ],
].map(
  ([
    id,
    name,
    species,
    breed,
    age_months,
    gender,
    size,
    good_with_kids,
    good_with_pets,
    image,
    status,
    housing,
    activity_level,
    is_spayed_neutered,
    is_vaccinated,
  ]) => ({
    id,
    name,
    species,
    breed,
    age_months,
    gender,
    size,
    good_with_kids,
    good_with_pets,
    status: "available",
    display_status: status,
    bio: featuredPetBios[name] ?? status,
    housing,
    activity_level,
    is_spayed_neutered,
    is_vaccinated,
    has_special_care: name === "Mochi" || name === "Frankie",
    primary_image_url: `https://images.unsplash.com/${image}?auto=format&fit=crop&w=700&q=82`,
    shelter,
  }),
);
const generatedPetNames = [
  "Arlo",
  "Tansy",
  "Winnie",
  "Basil",
  "Nico",
  "Otto",
  "Maisie",
  "Pippin",
  "Freddie",
  "Junie",
  "Marlow",
  "Pearl",
  "Rory",
  "Suki",
  "Alfie",
  "Nell",
  "Indie",
  "Murray",
  "Fable",
  "Minnie",
  "Raffi",
  "Dahlia",
  "Sullivan",
  "Birdie",
  "Figaro",
  "Toby",
];
const generatedPetCallNames = [
  "Bluebell",
  "Bramble",
  "Cricket",
  "Doodle",
  "Moonbeam",
  "Pebble",
  "Socks",
  "Sprout",
];
const bioOpeners = [
  "A gentle",
  "A curious",
  "A thoughtful",
  "A sunny",
  "A quietly brave",
  "A playful",
  "A soft-hearted",
  "A clever",
  "A mellow",
  "A people-loving",
  "An easygoing",
  "A bright-eyed",
  "A tender-hearted",
];
const bioFinishes = [
  "who saves their biggest wiggles for morning walks",
  "who turns sunny windows into a full-time job",
  "who prefers soft blankets and a slow hello",
  "who'll follow a treat puzzle all the way to the end",
  "who makes a tiny celebration out of dinnertime",
  "who warms up best with a patient new friend",
  "who likes to be nearby while you go about your day",
  "who thinks every cardboard box deserves a closer look",
  "who's happiest with a familiar routine and a cozy nook",
  "who brings a little extra joy to the everyday",
  "who loves exploring at their own unhurried pace",
  "who has a knack for making new friends feel welcome",
  "who saves a special kind of wiggle for their favorite people",
  "who enjoys a good stretch, a snack, and a sunny spot",
  "who's learning that the world can be a kind place",
  "who would love to be your quiet little sidekick",
];
const petTypes = [
  {
    species: "Dog",
    breeds: [
      "Shepherd mix",
      "Terrier mix",
      "Retriever mix",
      "Hound mix",
      "Poodle mix",
      "Spaniel mix",
    ],
    images: [
      "photo-1552053831-71594a27632d",
      "photo-1543466835-00a7907e9de1",
      "photo-1505628346881-b72b27e84530",
      "photo-1517849845537-4d257902454a",
      "photo-1537151608828-ea2b11777ee8",
    ],
  },
  {
    species: "Cat",
    breeds: [
      "Domestic shorthair",
      "Tabby mix",
      "Tuxedo cat",
      "Calico mix",
      "Domestic longhair",
    ],
    images: [
      "photo-1514888286974-6c03e2ca1dba",
      "photo-1573865526739-10659fec78a5",
    ],
  },
  {
    species: "Rabbit",
    breeds: [
      "Mini lop",
      "Lionhead mix",
      "Dutch rabbit",
      "Mini rex",
      "Holland lop",
    ],
    images: [
      "photo-1585110396000-c9ffd4e4b308",
      "photo-1535241749838-299277b6305f",
    ],
  },
];
for (let index = 0; index < 208; index += 1) {
  const type = petTypes[index % petTypes.length];
  const name = `${generatedPetNames[index % generatedPetNames.length]} ${generatedPetCallNames[Math.floor(index / generatedPetNames.length)]}`;
  const age_months = 2 + ((index * 7) % 119);
  const bio = `${bioOpeners[index % bioOpeners.length]} ${type.species.toLowerCase()} ${bioFinishes[Math.floor(index / bioOpeners.length)]}.`;
  pets.push({
    id: `c39e4589-7b2a-4f11-9a2c-87d21b44e${String(index + 33).padStart(3, "0")}`,
    name,
    species: type.species,
    bio,
    breed: type.breeds[index % type.breeds.length],
    age_months,
    gender: index % 2 === 0 ? "Female" : "Male",
    size:
      type.species === "Dog"
        ? ["Small", "Medium", "Large", "Extra Large"][Math.floor(index / 3) % 4]
        : "Small",
    good_with_kids: index % 5 !== 0,
    good_with_pets: index % 4 !== 0,
    status: "available",
    display_status:
      age_months > 84
        ? "Senior sweetheart"
        : index % 3 === 0
          ? "Meet me soon"
          : "Ready for a home",
    housing: type.species === "Dog" && index % 2 === 0 ? "House" : "Apartment",
    activity_level:
      index % 3 === 0 ? "High" : index % 3 === 1 ? "Moderate" : "Low",
    is_spayed_neutered: index % 7 !== 0,
    is_vaccinated: index % 9 !== 0,
    has_special_care: index % 29 === 0,
    primary_image_url: `https://images.unsplash.com/${type.images[index % type.images.length]}?auto=format&fit=crop&w=700&q=82`,
    shelter,
  });
}
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};
const json = (response, status, value) => {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(value));
};
const error = (response, status, message) =>
  json(response, status, { error: { message } });

const RATE_WINDOW_MS = 60_000;
const requestTimes = new Map();

function allowRequest(request, response, route, limit) {
  const now = Date.now();
  const forwardedFor =
    process.env.VERCEL === "1" ? request.headers["x-forwarded-for"] : undefined;
  const trustedIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(",")[0]?.trim();
  const ip = trustedIp || request.socket?.remoteAddress || "unknown";
  const key = `${route}:${ip}`;
  const recent = (requestTimes.get(key) || []).filter(
    (time) => now - time < RATE_WINDOW_MS,
  );
  if (recent.length >= limit) {
    const retryAfter = Math.max(
      1,
      Math.ceil((RATE_WINDOW_MS - (now - recent[0])) / 1000),
    );
    response.setHeader("Retry-After", String(retryAfter));
    response.setHeader("RateLimit-Limit", String(limit));
    response.setHeader("RateLimit-Remaining", "0");
    return error(response, 429, "Too many requests. Please try again shortly.");
  }
  recent.push(now);
  requestTimes.set(key, recent);
  response.setHeader("RateLimit-Limit", String(limit));
  response.setHeader("RateLimit-Remaining", String(limit - recent.length));
  if (requestTimes.size > 10_000) {
    for (const [entryKey, times] of requestTimes) {
      if (!times.some((time) => now - time < RATE_WINDOW_MS))
        requestTimes.delete(entryKey);
    }
  }
  return true;
}

function validationError(response, result) {
  const message = result.error.issues
    .map((issue) => `${issue.path.join(".") || "request"}: ${issue.message}`)
    .join("; ");
  return error(response, 400, message);
}

function petSearch(url, response) {
  const parsed = PetSearchQuerySchema.safeParse(
    Object.fromEntries(url.searchParams),
  );
  if (!parsed.success) return validationError(response, parsed);
  const {
    species,
    breed,
    size,
    shelter_id: shelterId,
    status,
    min_age_months: min,
    max_age_months: max,
    good_with_kids: kids,
    good_with_pets: otherPets,
    page,
    limit,
  } = parsed.data;
  const matched = pets.filter(
    (p) =>
      p.status === status &&
      (!species ||
        p.species === species ||
        (species === "Other" && p.species === "Rabbit")) &&
      (!breed || p.breed.toLowerCase().includes(breed.toLowerCase())) &&
      (min === undefined || p.age_months >= min) &&
      (max === undefined || p.age_months <= max) &&
      (!size || p.size === size) &&
      (kids === undefined || p.good_with_kids === kids) &&
      (otherPets === undefined || p.good_with_pets === otherPets) &&
      (!shelterId || p.shelter.id === shelterId),
  );
  const start = (page - 1) * limit;
  json(response, 200, {
    data: matched.slice(start, start + limit),
    pagination: {
      current_page: page,
      per_page: limit,
      total_records: matched.length,
      total_pages: Math.ceil(matched.length / limit),
    },
  });
}

function facets(response) {
  const available = pets.filter((p) => p.status === "available");
  json(response, 200, {
    species: Object.entries(Object.groupBy(available, (p) => p.species)).map(
      ([species, rows]) => ({ species, pet_count: rows.length }),
    ),
    sizes: Object.entries(Object.groupBy(available, (p) => p.size)).map(
      ([size, rows]) => ({ size, pet_count: rows.length }),
    ),
    combinations: [
      ...new Set(available.map((p) => `${p.species}\u0000${p.size}`)),
    ].map((key) => {
      const [species, size] = key.split("\u0000");
      const rows = available.filter(
        (p) => p.species === species && p.size === size,
      );
      return {
        species,
        size,
        pet_count: rows.length,
        kids_friendly_count: rows.filter((p) => p.good_with_kids).length,
        pets_friendly_count: rows.filter((p) => p.good_with_pets).length,
      };
    }),
  });
}

async function readJson(request) {
  if (request.body !== undefined) {
    const body = request.body;
    const serialized = typeof body === "string" ? body : JSON.stringify(body);
    if (Buffer.byteLength(serialized || "", "utf8") > 64 * 1024)
      throw new Error("Request body exceeds 64 KB.");
    try {
      return typeof body === "string" ? JSON.parse(body || "{}") : body;
    } catch {
      throw new Error("Request body must be valid JSON.");
    }
  }
  let byteLength = 0;
  const chunks = [];
  for await (const chunk of request) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    byteLength += bytes.byteLength;
    if (byteLength > 64 * 1024) throw new Error("Request body exceeds 64 KB.");
    chunks.push(bytes);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    throw new Error("Request body must be valid JSON.");
  }
}

function scoreMatch(pet, input) {
  let possible = 0,
    earned = 0;
  const reasons = [];
  const preferred = input.preferred_species;
  if (preferred?.length) {
    possible += 30;
    if (preferred.includes(pet.species)) {
      earned += 30;
      reasons.push(`Matches your preferred species: ${pet.species}.`);
    }
  }
  if (input.preferred_sizes?.length) {
    possible += 10;
    if (input.preferred_sizes.includes(pet.size)) {
      earned += 10;
      reasons.push(`A size you prefer: ${pet.size}.`);
    }
  }
  if (typeof input.has_children === "boolean") {
    possible += 25;
    if (!input.has_children || pet.good_with_kids) {
      earned += 25;
      if (input.has_children)
        reasons.push("Shelter records say this pet is good with children.");
    }
  }
  if (typeof input.has_other_pets === "boolean") {
    possible += 20;
    if (!input.has_other_pets || pet.good_with_pets) {
      earned += 20;
      if (input.has_other_pets)
        reasons.push("Shelter records say this pet is good with other pets.");
    }
  }
  if (input.housing_type) {
    possible += 15;
    const fits =
      input.housing_type === "Apartment" ? pet.housing === "Apartment" : true;
    if (fits) {
      earned += 15;
      reasons.push(
        input.housing_type === "Apartment"
          ? "Listed as a fit for apartment living."
          : "Your home type is compatible with this pet.",
      );
    }
  }
  if (input.activity_level) {
    possible += 15;
    const levels = { low: 1, moderate: 2, high: 3 };
    const fit =
      levels[pet.activity_level.toLowerCase()] <= levels[input.activity_level];
    if (fit) {
      earned += 15;
      reasons.push(
        `Activity level (${pet.activity_level.toLowerCase()}) fits your preference.`,
      );
    }
  }
  if (
    Number.isInteger(input.min_age_months) ||
    Number.isInteger(input.max_age_months)
  ) {
    possible += 10;
    if (
      (!Number.isInteger(input.min_age_months) ||
        pet.age_months >= input.min_age_months) &&
      (!Number.isInteger(input.max_age_months) ||
        pet.age_months <= input.max_age_months)
    ) {
      earned += 10;
      reasons.push("Within your preferred age range.");
    }
  }
  if (typeof input.open_to_special_care === "boolean") {
    possible += 10;
    const fits = input.open_to_special_care || !pet.has_special_care;
    if (fits) {
      earned += 10;
      if (pet.has_special_care)
        reasons.push("You’re open to a pet who may need extra care.");
    }
  }
  if (pet.is_spayed_neutered)
    reasons.push("Spayed/neutered according to shelter records.");
  if (pet.is_vaccinated)
    reasons.push("Vaccinated according to shelter records.");
  return {
    match_score: possible ? Math.round((earned * 100) / possible) : 0,
    match_reasons: reasons,
  };
}

async function handle(request, response) {
  let url;
  try {
    url = new URL(request.url, "http://localhost");
  } catch {
    return error(response, 400, "Invalid URL.");
  }
  if (url.pathname === "/api/v1/pets" && request.method === "GET") {
    if (!allowRequest(request, response, "pet-search", 60)) return;
    return petSearch(url, response);
  }
  if (url.pathname === "/api/v1/pets/facets" && request.method === "GET") {
    if (!allowRequest(request, response, "pet-search", 60)) return;
    return facets(response);
  }
  if (url.pathname === "/api/v1/pets/match" && request.method === "POST") {
    if (!allowRequest(request, response, "pet-match", 30)) return;
    if (
      !request.headers["content-type"]
        ?.toLowerCase()
        .startsWith("application/json")
    )
      return error(response, 415, "Content-Type must be application/json.");
    let input;
    try {
      input = await readJson(request);
    } catch (e) {
      return error(
        response,
        e.message === "Request body exceeds 64 KB." ? 413 : 400,
        e.message,
      );
    }
    const parsed = LifestyleMatchSchema.safeParse(input);
    if (!parsed.success) return validationError(response, parsed);
    input = parsed.data;
    const ranked = pets
      .filter(
        (p) =>
          p.status === "available" &&
          (!input.preferred_species?.length ||
            input.preferred_species.includes(p.species)) &&
          (!input.preferred_sizes?.length ||
            input.preferred_sizes.includes(p.size)) &&
          (!Number.isInteger(input.min_age_months) ||
            p.age_months >= input.min_age_months) &&
          (!Number.isInteger(input.max_age_months) ||
            p.age_months <= input.max_age_months),
      )
      .map((p) => ({ pet: p, ...scoreMatch(p, input) }))
      .sort(
        (a, b) =>
          b.match_score - a.match_score || a.pet.age_months - b.pet.age_months,
      )
      .slice(0, input.limit || 10)
      .map(({ pet, match_score, match_reasons }) => ({
        match_score,
        match_reasons,
        pet: {
          id: pet.id,
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          age_months: pet.age_months,
          size: pet.size,
          primary_image_url: pet.primary_image_url,
          shelter: pet.shelter,
        },
      }));
    return json(response, 200, { matches: ranked });
  }
  if (url.pathname.startsWith("/api/"))
    return error(response, 404, "API endpoint not found.");
  if (request.method !== "GET" && request.method !== "HEAD")
    return error(response, 405, "Method not allowed.");
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }
  const requested =
    pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = path.resolve(root, requested);
  if (!filePath.startsWith(root + path.sep)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  fs.readFile(filePath, (e, contents) => {
    if (e) {
      response
        .writeHead(e.code === "ENOENT" ? 404 : 500)
        .end(e.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }
    response.writeHead(200, {
      "Content-Type":
        contentTypes[path.extname(filePath)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    if (request.method === "HEAD") response.end();
    else response.end(contents);
  });
}

export function vercelHandler(request, response) {
  return handle(request, response).catch(() => {
    if (!response.headersSent) error(response, 500, "Unexpected server error.");
  });
}

if (process.env.VERCEL !== "1") {
  http
    .createServer(vercelHandler)
    .listen(port, "127.0.0.1", () =>
      console.log(`Kaydoption preview at http://127.0.0.1:${port}`),
    );
}
