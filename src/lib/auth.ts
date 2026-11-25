import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo.mongoClient ??
  new MongoClient(
    process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017",
  );
globalForMongo.mongoClient = mongoClient;

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  database: mongodbAdapter(mongoClient.db("mentorlagbe"), {
    client: mongoClient,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ["student", "tutor"],
        required: true,
        defaultValue: "student",
        input: true,
      },
      plan: {
        type: ["free", "student-plus", "tutor-pro"],
        required: true,
        defaultValue: "free",
        input: false,
      },
      planStatus: {
        type: ["inactive", "active", "past_due", "canceled"],
        required: true,
        defaultValue: "inactive",
        input: false,
      },
      phone: {
        type: "string",
        required: false,
        input: false,
      },
      bio: {
        type: "string",
        required: false,
        input: false,
      },
      bannerImage: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        },
      }
    : {}),
});

export function assertAuthConfiguration() {
  if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be configured in production.");
  }

  if (process.env.NODE_ENV === "production" && !process.env.BETTER_AUTH_SECRET) {
    throw new Error("BETTER_AUTH_SECRET must be configured in production.");
  }
}
