import Head from "next/head";
import styles from "./styles.module.scss";

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