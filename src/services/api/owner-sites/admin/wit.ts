// src/services/api/owner-sites/admin/wit.ts
import axios from "axios";

const WIT_API_URL = "https://api.wit.ai/message";
const WIT_API_VERSION = "20251028";
const WIT_TOKEN = process.env.NEXT_PUBLIC_WIT_API_KEY;

interface WitEntity {
  value?: string;
  body?: string;
  confidence?: number;
  [key: string]: unknown;
}

interface WitEntities {
  [key: string]: WitEntity[] | undefined;
}

export interface WitResponse {
  text: string;
  intents: Array<{ id: string; name: string; confidence: number }>;
  entities: WitEntities;
  traits: Record<
    string,
    Array<{ id: string; value: string; confidence: number }>
  >;
}

export interface ExtractedContact {
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  confidence: number;
  raw: WitResponse;
}

export const witApi = {
  async extract(message: string): Promise<ExtractedContact> {
    try {
      const response = await axios.get(WIT_API_URL, {
        headers: {
          Authorization: `Bearer ${WIT_TOKEN}`,
        },
        params: {
          v: WIT_API_VERSION,
          q: message,
        },
      });

      const data = response.data;
      const entities = data.entities || {};

      const pick = (key: string) => {
        const e = entities[key]?.[0];
        return e ? (e.value ?? e.body ?? null) : null;
      };

      return {
        name: pick("name"),
        email: pick("email"),
        phone: pick("phone_number"),
        address: pick("address"),
        confidence: entities.name?.[0]?.confidence || 1,
        raw: data,
      };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "object" &&
              err !== null &&
              "response" in err &&
              typeof err.response === "object" &&
              err.response !== null &&
              "data" in err.response
            ? String(err.response.data)
            : "Unknown error";
      console.error("❌ Wit.ai API error:", errorMessage);
      throw new Error("Failed to extract data from Wit.ai");
    }
  },
};
