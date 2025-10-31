import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { orderApi } from "@/services/api/owner-sites/admin/orders";

// Types for Wit.ai response
interface WitEntity {
  value: string;
  confidence: number;
  type?: string;
  // Add other Wit.ai entity properties as needed
}

interface WitEntities {
  [key: string]: WitEntity[];
}

interface WitResponse {
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intents: any[];
  entities: WitEntities;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  traits: any;
  // Add other Wit.ai response properties as needed
}

const VERIFY_TOKEN =
  process.env.FACEBOOK_VERIFY_TOKEN || "nepdora_verify_token";
const WIT_TOKEN = process.env.NEXT_PUBLIC_WIT_API_KEY;
const PAGE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_PAGE_ACCESS_TOKEN;

// ✅ 1. Facebook verifies your webhook
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified!");
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse("Forbidden", { status: 403 });
  }
}

// ✅ 2. Facebook sends messages here
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📩 Received webhook event:", JSON.stringify(body, null, 2));

    if (body.object === "page") {
      for (const entry of body.entry) {
        for (const event of entry.messaging || []) {
          const senderId = event.sender.id;
          const message = event.message?.text;

          if (!message) continue;
          console.log(`💬 Message from ${senderId}: ${message}`);

          // 🧠 Step 1: Validate message and token
          if (!message.trim()) {
            console.log("Empty message received, skipping");
            continue;
          }

          if (!WIT_TOKEN) {
            console.error("WIT_TOKEN is not configured");
            await sendFBMessage(
              senderId,
              "Sorry, there was an error processing your message. Please try again later."
            );
            continue;
          }

          let entities: WitEntities = {};
          try {
            // Send message to Wit.ai
            const witRes = await axios.get("https://api.wit.ai/message", {
              params: {
                q: message,
                v: "20231030", // Using the latest stable API version
              },
              headers: {
                Authorization: `Bearer ${WIT_TOKEN}`,
                "Content-Type": "application/json",
              },
              timeout: 5000, // 5 second timeout
            });

            if (witRes.data && witRes.data.entities) {
              entities = witRes.data.entities;
              console.log(
                "🧠 Wit Entities:",
                JSON.stringify(entities, null, 2)
              );
            } else {
              console.log("No entities found in Wit.ai response");
            }
          } catch (error: unknown) {
            const errorMessage =
              error instanceof AxiosError
                ? error.response?.data || error.message
                : error instanceof Error
                  ? error.message
                  : "Unknown error";

            console.error("Error calling Wit.ai:", errorMessage);
            // Continue with empty entities to allow manual order creation
            entities = {};
          }

          // 🧩 Step 2: Extract entity values with fallbacks
          const name = entities["name:name"]?.[0]?.value || "Facebook User";
          const phone = entities["phone_number:phone_number"]?.[0]?.value || "";
          const address = entities["address:address"]?.[0]?.value || "";

          // Try different entity names that might contain the order item
          const item =
            entities["order_item:order_item"]?.[0]?.value ||
            entities["product:product"]?.[0]?.value ||
            entities["item:item"]?.[0]?.value ||
            "";

          // Ensure quantity is a number
          const quantity = Number(
            entities["quantity:quantity"]?.[0]?.value ||
              entities["number:number"]?.[0]?.value ||
              1
          );

          if (!item) {
            // Ask user again if Wit couldn’t detect order item
            await sendFBMessage(
              senderId,
              "Sorry 😔, I couldn’t detect what you want to order. Could you please specify the item?"
            );
            continue;
          }

          // 🛒 Step 3: Create manual order via your Django API
          const orderData = {
            customer_name: name || "Facebook User",
            customer_email: `${senderId}@facebook.com`,
            customer_phone: phone || "",
            customer_address: address || "",
            shipping_address: address || "",
            city: "",
            total_amount: "0.00",
            delivery_charge: "0.00",
            items: [
              {
                product_id: 0, // Will need to be mapped to an actual product ID
                quantity: quantity,
                price: "0.00",
                product: {
                  id: 0, // Map to actual product ID
                  name: item || "Product",
                  slug: item
                    ? item.toLowerCase().replace(/\s+/g, "-")
                    : "product",
                  price: "0.00",
                  market_price: "0.00",
                  thumbnail_image: "",
                  thumbnail_alt_description: "",
                },
              },
            ],
            note: `Order from Facebook Messenger (ID: ${senderId})`,
            order_status: "pending_verification",
            status: "pending_verification",
            is_manual: true,
            source: "facebook",
            facebook_id: senderId,
          };

          try {
            const newOrder = await orderApi.createOrder(orderData);
            console.log("✅ Order created:", newOrder);

            // 💬 Step 4: Send confirmation back
            await sendFBMessage(
              senderId,
              `✅ Order received for ${quantity} ${item} to ${address || "your address"}.\nThank you, ${name || "there"}!`
            );
          } catch (err) {
            console.error("❌ Error creating order:", err);
            await sendFBMessage(
              senderId,
              "Sorry, something went wrong while placing your order."
            );
          }
        }
      }
    }

    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  } catch (err) {
    console.error("❌ Error in webhook:", err);
    return new NextResponse("Error", { status: 500 });
  }
}

// Helper function to send messages back to Facebook
async function sendFBMessage(recipientId: string, text: string) {
  try {
    await fetch(
      `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text },
        }),
      }
    );
  } catch (err) {
    console.error("❌ Failed to send FB message:", err);
  }
}
