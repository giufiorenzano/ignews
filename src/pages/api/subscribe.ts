import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { stripe } from "../../services/stripe";

type User = {
    ref: {
        id: string
    },
    data: {
        stripe_customer_id:string
    }
}

/* eslint-disable */
export default async (req:NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        //com o next-auth eu consigo pegar nos cookies o cliente, 
        //pra assim poder salvar no DB do Stripe - antes eu so tinha essa info no front, no faunadb
        const session = await getSession({req})

        
        //pegando pelo email no fauna db um usuário cadastrado
        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index("user_by_email"),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id

        if (!customerId) {
            //criando um cliente novo no stripe - é gerado um id automático no stripe
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
                //metadata
            })

            // atualizando o user no faunadb! primeiro se encontra o user no faunadb com o user.ref.id q pegamos ali em cima
            // e vamos fazer update nesse user com o ID gerado pelo stripe
            await fauna.query(
                q.Update(
                    q.Ref(q.Collection("users"), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )

            customerId = stripeCustomer.id
        }

        

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
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