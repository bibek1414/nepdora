import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { orderApi } from "@/services/api/owner-sites/admin/orders";
import { messageStore } from "@/lib/message-store";
import { getApiBaseUrl } from "@/config/site";
import { cookies } from "next/headers";
import { decodeJWT, isTokenExpired, JWTPayload } from "@/lib/jwt-utils";

// Types for Wit.ai response
interface WitEntity {
  value: string;
  confidence: number;
  type?: string;
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
}

const VERIFY_TOKEN =
  process.env.FACEBOOK_VERIFY_TOKEN || "nepdora_verify_token";
const WIT_TOKEN = process.env.NEXT_PUBLIC_WIT_API_KEY;
const PAGE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_PAGE_ACCESS_TOKEN;

// ✅ Helper function to get subdomain from JWT
async function getSubdomainFromJWT(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("authToken")?.value;

    if (!authToken) {
      console.warn("⚠️ No authToken found in cookies");
      return null;
    }

    const payload = decodeJWT(authToken) as JWTPayload;

    if (!payload || isTokenExpired(payload.exp)) {
      console.warn("⚠️ JWT token is invalid or expired");
      return null;
    }

    console.log("🔑 Subdomain from JWT:", payload.sub_domain);
    return payload.sub_domain;
  } catch (error) {
    console.error("❌ Error extracting subdomain from JWT:", error);
    return null;
  }
}

// ✅ Helper function to post transformed webhook data to dynamic API
async function postWebhookDataToApi(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messageData: any,
  subdomain?: string | null
) {
  try {
    // Use subdomain from JWT if available, otherwise fallback to default
    const actualSubdomain = subdomain || "vapebox";

    const webhookApiEndpoint = `https://${actualSubdomain}.nepdora.baliyoventures.com/api/webhook/`;

    console.log("🌐 Posting transformed message data to:", webhookApiEndpoint);
    console.log(`   Using subdomain: ${actualSubdomain}`);
    console.log("📦 Message data being sent:");
    console.log(JSON.stringify(messageData, null, 2));

    const response = await axios.post(webhookApiEndpoint, messageData, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    console.log("✅ Successfully posted to API:", response.status);
    console.log("📥 API Response:", JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof AxiosError
        ? error.response?.data || error.message
        : error instanceof Error
          ? error.message
          : "Unknown error";
    console.error("❌ Failed to post webhook data to API:", errorMessage);
    throw error;
  }
}

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 🔑 Extract subdomain from JWT at the start of processing
    const subdomain = await getSubdomainFromJWT();
    console.log(
      "🏪 Processing webhook for subdomain:",
      subdomain || "default (vapebox)"
    );

    // 🎯 ENHANCED LOGGING
    console.log("=".repeat(80));
    console.log("📩 REAL-TIME WEBHOOK EVENT RECEIVED");
    console.log("=".repeat(80));
    console.log("📦 Full Webhook Payload:");
    console.log(JSON.stringify(body, null, 2));
    console.log("-".repeat(80));

    if (body.object === "page") {
      for (const entry of body.entry) {
        console.log(`🏢 Page ID: ${entry.id}`);
        console.log(`⏰ Time: ${entry.time}`);

        for (const event of entry.messaging || []) {
          const senderId = event.sender.id;
          const message = event.message?.text;
          const recipientId = event.recipient?.id;
          const messageId = event.message?.mid;
          const timestamp = event.timestamp;

          console.log("💬 Message Details:");
          console.log(`   Sender ID: ${senderId}`);
          console.log(`   Recipient ID: ${recipientId}`);
          console.log(`   Message ID: ${messageId}`);
          console.log(`   Timestamp: ${timestamp}`);
          console.log(`   Message: "${message}"`);
          console.log(
            `   Message Type: ${event.message?.attachments ? "With Attachments" : "Text"}`
          );

          if (event.message?.attachments) {
            console.log(
              `   Attachments: ${JSON.stringify(event.message.attachments)}`
            );
          }

          if (!message) {
            console.log("⏩ Skipping - No text message");
            continue;
          }

          // 🎯 PREPARE MESSAGE DATA FOR API
          const formattedTimestamp = timestamp
            ? new Date(timestamp).toISOString()
            : new Date().toISOString();

          const conversationId = `t_${senderId}`;

          const messageData = {
            id: messageId,
            conversationId,
            message,
            from: {
              id: senderId,
              name: "Facebook User",
            },
            created_time: formattedTimestamp,
            pageId: recipientId,
            senderId,
            subdomain: subdomain || "vapebox", // Include subdomain in message data
          };

          console.log("💾 Prepared message data:");
          console.log(JSON.stringify(messageData, null, 2));

          // 🌐 POST TO DYNAMIC API FIRST (with subdomain)
          try {
            await postWebhookDataToApi(messageData, subdomain);
          } catch (apiError) {
            console.error(
              "⚠️ Warning: Failed to post to API, continuing webhook processing..."
            );
          }

          // 🎯 STORE IN LOCAL MESSAGE STORE
          try {
            messageStore.addMessage(messageData);
            console.log("✅ Message successfully stored in real-time store");
          } catch (storeError) {
            console.error("❌ Failed to add message to store:", storeError);
          }

          // 🧠 Process with Wit.ai
          console.log("🤖 Processing with Wit.ai...");

          if (!WIT_TOKEN) {
            console.error("❌ WIT_TOKEN is not configured");
            await sendFBMessage(
              senderId,
              "Sorry, there was an error processing your message. Please try again later."
            );
            continue;
          }

          let entities: WitEntities = {};
          try {
            const witRes = await axios.get("https://api.wit.ai/message", {
              params: { q: message, v: "20231030" },
              headers: {
                Authorization: `Bearer ${WIT_TOKEN}`,
                "Content-Type": "application/json",
              },
              timeout: 5000,
            });

            if (witRes.data && witRes.data.entities) {
              entities = witRes.data.entities;
              console.log("🧠 Wit.ai Entities Detected:");
              console.log(JSON.stringify(entities, null, 2));
            } else {
              console.log("ℹ️ No entities found in Wit.ai response");
            }
          } catch (error: unknown) {
            const errorMessage =
              error instanceof AxiosError
                ? error.response?.data || error.message
                : error instanceof Error
                  ? error.message
                  : "Unknown error";
            console.error("❌ Error calling Wit.ai:", errorMessage);
            entities = {};
          }

          // Extract entities and create order
          const name = entities["name:name"]?.[0]?.value || "Facebook User";
          const phone = entities["phone_number:phone_number"]?.[0]?.value || "";
          const address = entities["address:address"]?.[0]?.value || "";
          const item =
            entities["order_item:order_item"]?.[0]?.value ||
            entities["product:product"]?.[0]?.value ||
            entities["item:item"]?.[0]?.value ||
            "";
          const quantity = Number(
            entities["quantity:quantity"]?.[0]?.value ||
              entities["number:number"]?.[0]?.value ||
              1
          );

          console.log("📋 Extracted Order Details:");
          console.log(`   Name: ${name}`);
          console.log(`   Phone: ${phone}`);
          console.log(`   Address: ${address}`);
          console.log(`   Item: ${item}`);
          console.log(`   Quantity: ${quantity}`);
          console.log(`   Subdomain: ${subdomain || "vapebox"}`);

          if (!item) {
            console.log("❓ No item detected - asking user for clarification");
            await sendFBMessage(
              senderId,
              "Sorry 😔, I couldn't detect what you want to order. Could you please specify the item?"
            );
            continue;
          }

          // Create order with subdomain context
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
                product_id: 0,
                quantity: quantity,
                price: "0.00",
                product: {
                  id: 0,
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
            note: `Order from Facebook Messenger (ID: ${senderId}) - Store: ${subdomain || "vapebox"}`,
            order_status: "pending_verification",
            status: "pending_verification",
            is_manual: true,
            source: "facebook",
            facebook_id: senderId,
            store_subdomain: subdomain || "vapebox", // Include subdomain in order
          };

          try {
            console.log("🛒 Creating order in database...");
            const newOrder = await orderApi.createOrder(orderData);
            console.log("✅ Order created successfully:", newOrder);

            await sendFBMessage(
              senderId,
              `✅ Order received for ${quantity} ${item} to ${address || "your address"}.\nThank you, ${name || "there"}!`
            );
            console.log("📤 Confirmation message sent to user");
          } catch (err) {
            console.error("❌ Error creating order:", err);
            await sendFBMessage(
              senderId,
              "Sorry, something went wrong while placing your order."
            );
          }

          console.log("-".repeat(80));
        }
      }
    } else {
      console.log("⚠️ Not a page event - skipping");
    }

    console.log("=".repeat(80));
    console.log("✅ Webhook processing completed");
    console.log("=".repeat(80));

    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  } catch (err) {
    console.error("❌ CRITICAL ERROR in webhook:", err);
    return new NextResponse("Error", { status: 500 });
  }
}

// Helper function to send Facebook messages
async function sendFBMessage(recipientId: string, text: string) {
  try {
    console.log(`📤 Sending message to ${recipientId}: "${text}"`);
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
    console.log("✅ Message sent successfully");
  } catch (err) {
    console.error("❌ Failed to send FB message:", err);
  }
}
