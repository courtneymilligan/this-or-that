import React, { useState } from "react";
import TextBox from "../components/textBox.js"
import ImageBox from "../components/images.js";
import PublishBox from "../components/publishBox.js"
import styles from "../styles/Home.module.css";
import Head from 'next/head';

export default function App() {
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [text, setText] = useState({
    prompt: "",
    label1: "",
    label2: ""
  })
  
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/question.png" />
        <script src="https://smtpjs.com/v3/smtp.js"></script>
      </Head>
      <main>
        <div className={styles.header}>
          <h1 className={styles.title}>This or That</h1>
          <img src="/question.png" alt="?" />
        </div>
        <TextBox text={text} setText={setText}/>
        <ImageBox image1={image1} image2={image2} setImage1={setImage1} setImage2={setImage2}/>
        <PublishBox image1={image1} image2={image2} text={text}/>
      </main>
    </>
  );
}
