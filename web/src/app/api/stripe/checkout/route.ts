import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import type { Session } from "next-auth";

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { mode, priceId, successUrl, cancelUrl, subscriptionsType } = body as {
    mode: "payment" | "subscription";
    priceId: string;
    successUrl?: string;
    cancelUrl?: string;
    subscriptionsType?: "1" | "2" | "3";
  };
  if (!mode || !priceId) return NextResponse.json({ error: "Missing mode or priceId" }, { status: 400 });

  const stripeSecret = process.env.STRIPE_SECRET_KEY as string;
  if (!stripeSecret) return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });

  const baseUrl = process.env.NEXTAUTH_URL || '';
  if (!baseUrl) {
    return NextResponse.json({ error: "Missing NEXTAUTH_URL for redirect URLs" }, { status: 500 });
  }
  const success = successUrl || `${baseUrl}/?checkout=success`;
  const cancel = cancelUrl || `${baseUrl}/?checkout=cancel`;

  const dbUserId = (session.user as unknown as { db_user_id?: string | null })?.db_user_id || "";

  const metadata: Record<string, string> = {};
  if (dbUserId) metadata.makeup_user_id = dbUserId;
  if (subscriptionsType) metadata.subscriptions_type = subscriptionsType;

  try {
    if (!priceId || !priceId.startsWith('price_')) {
      return NextResponse.json({ error: "Invalid priceId" }, { status: 400 });
    }
    if (mode === "payment") {
      const s = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: success,
        cancel_url: cancel,
        metadata,
      });
      return NextResponse.json({ url: s.url });
    } else {
      const s = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: success,
        cancel_url: cancel,
        metadata,
      });
      return NextResponse.json({ url: s.url });
    }
  } catch (err) {
    console.error('[stripe][checkout]', err);
    return NextResponse.json({ error: 'Stripe checkout failed', detail: String(err) }, { status: 500 });
  }
}


