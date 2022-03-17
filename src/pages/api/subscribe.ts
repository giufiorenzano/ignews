import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { stripe } from "../../services/stripe";

/* eslint-disable */
export default async (req:NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        //com o next-auth eu consigo pegar nos cookies o cliente, 
        //pra assim poder salvar no DB do Stripe - antes eu so tinha essa info no front, no faunadb
        const session = await getSession({req})

        //criando um cliente novo no stripe 
        const stripeCustomer = await stripe.customers.create({
            email: session.user.email,
            //metadata
        })

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomer.id,
            payment_method_types: ["card"],
            billing_address_collection: "required",
            line_items: [
                {price: "price_1KcARNIqNBVgmNfiCEWmZmCf", quantity: 1}
            ],
            mode: "subscription",
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        })

        return res.status(200).json({ sessionId: stripeCheckoutSession.id})
    } else {
        res.setHeader("Allow", "POST")
        res.status(405).end("Method not allowed")  
    }
}