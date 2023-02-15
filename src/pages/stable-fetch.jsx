import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const Stable = () => {
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("/api/predictions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: e.target.prompt.value,
            }),
        });
        let prediction = await response.json();
        if (response.status !== 201) {
            setError(prediction.detail);
            return;
        }
        setPrediction(prediction);

        while (
            prediction.status !== "succeeded" &&
            prediction.status !== "failed"
        ) {
            await sleep(1000);
            const response = await fetch("/api/predictions/" + prediction.id);
            prediction = await response.json();
            if (response.status !== 200) {
                setError(prediction.detail);
                return;
            }
            console.log({ prediction });
            setPrediction(prediction);
        }
    };

    return (
        <div className="w-full">
            {/* <Head>
        <title>!Replicate + Next.js</title>
      </Head> */}
            <p>
                Dream something with Skin Code:
            </p>
            <form className="flex items-center" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="prompt"
                    placeholder="Enter a prompt to display an image"
                    className="input w-full input-bordered bg-base-200"
                />
                <button type="submit" className="btn btn-primary">Go!</button>
            </form>
            {prediction && (
                <div className="">
                    {prediction.output && prediction.output.map((image, index) => (
                        <div className={styles.imageWrapper} key={index}>
                            <Image
                                src={image}
                                alt="output"
                                width={256}
                                height={256}
                            />
                        </div>
                    ))}
                    <p>status: {prediction.status}</p>
                    {error && <div>{error}</div>}
                </div>
            )}
        </div>
    );
}

export default Stable;