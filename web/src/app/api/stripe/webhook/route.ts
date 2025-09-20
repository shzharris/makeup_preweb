import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { insertSubscriptionRecord } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string | undefined;
  if (!stripeSecret) return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });

  const buf = await req.arrayBuffer();
  const rawBody = Buffer.from(buf);
  let event: Stripe.Event;
  try {
    if (webhookSecret) {
      const hdrs = await headers();
      const sig = hdrs.get("stripe-signature") as string;
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      event = JSON.parse(rawBody.toString());
    }
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${String(err)}` }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const mode = session.mode; // 'payment' | 'subscription'
      const price = Number(session.amount_total ? session.amount_total / 100 : 0);
      // 这里未绑定 makeup_user_id，若在创建 checkout session 时通过 metadata 传了，则可读取
      const makeupUserId = (session.metadata?.makeup_user_id as string | undefined) || "";
      if (makeupUserId) {
        const now = new Date();
        const fmt = (d: Date) => `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
        const typeMeta = (session.metadata?.subscriptions_type as '1'|'2'|'3'|undefined);
        if (mode === "payment") {
          // 一次性
          await insertSubscriptionRecord({
            makeupUserId,
            subscriptionsType: '1',
            price,
            payResult: 'paid',
            startTime: fmt(now),
            endTime: null,
          });
        } else if (mode === "subscription") {
          const type = typeMeta || '2';
          if (type !== '2' && type !== '3') throw new Error('Invalid subscriptions_type');
          const days = type === '2' ? 30 : 181;
          const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
          await insertSubscriptionRecord({
            makeupUserId,
            subscriptionsType: type,
            price,
            payResult: 'paid',
            startTime: fmt(now),
            endTime: fmt(end),
          });
        } else {
          throw new Error('Invalid checkout mode');
        }
      }
    }
  } catch (e) {
    return NextResponse.json({ received: true, error: String(e) });
  }

  return NextResponse.json({ received: true });
}


