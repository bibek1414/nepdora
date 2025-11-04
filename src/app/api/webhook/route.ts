import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { orderApi } from "@/services/api/owner-sites/admin/orders";
import { messageStore } from "@/lib/message-store";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 🎯 ENHANCED LOGGING - This will show in your terminal
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

          // 🎯 REAL-TIME MESSAGE STORAGE
          try {
            if (recipientId && messageId) {
              const formattedTimestamp = timestamp
                ? new Date(timestamp * 1000).toISOString()
                : new Date().toISOString();

              const conversationId = `t_${recipientId}_${senderId}`;

              const messageData = {
                id: messageId,
                conversationId,
                message,
                from: {
                  id: senderId,
                  name: "Facebook User",
                  profile_pic: undefined,
                },
                created_time: formattedTimestamp,
                pageId: recipientId,
                senderId,
              };

              console.log("💾 Storing message in real-time store:");
              console.log(JSON.stringify(messageData, null, 2));

              messageStore.addMessage(messageData);

              console.log("✅ Message successfully stored in real-time store");
            }
          } catch (storeError) {
            console.error("❌ Failed to add message to store:", storeError);
          }

          // 🧠 Process with Wit.ai (your existing logic)
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

          // Extract entities and create order (your existing logic)
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

          if (!item) {
            console.log("❓ No item detected - asking user for clarification");
            await sendFBMessage(
              senderId,
              "Sorry 😔, I couldn't detect what you want to order. Could you please specify the item?"
            );
            continue;
          }

          // Create order (your existing logic)
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
            note: `Order from Facebook Messenger (ID: ${senderId})`,
            order_status: "pending_verification",
            status: "pending_verification",
            is_manual: true,
            source: "facebook",
            facebook_id: senderId,
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

// Helper function remains the same
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
