import { GetStaticProps } from "next";
import Head from "next/head";
import { getPrismicClient } from "../../services/prismic";
import styles from "./styles.module.scss";
import Prismic from "@prismicio/client"

export default function Posts() {
    return (
        <>
            <Head>
                <title>Posts | Ingnews </title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    <a href="#">
                        <time>12 de março de 2022</time>
                        <strong>Um título muito legal pro post</strong>
                        <p> Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. </p> 
                    </a>

                    <a href="#">
                        <time>12 de março de 2022</time>
                        <strong>Um título muito legal pro post</strong>
                        <p> Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. </p> 
                    </a>

                    <a href="#">
                        <time>12 de março de 2022</time>
                        <strong>Um título muito legal pro post</strong>
                        <p> Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. </p> 
                    </a>
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient()

    const response = await prismic.query([
        Prismic.predicates.at("document.type", "post")
    ], {
        fetch: ["publication.title", "publication.content"],
        pageSize: 100,
    })

    console.log(JSON.stringify(response, null, 2))

    return {
        props: {

        }
    }
}