import publishBoxStyles from "../styles/PublishBox.module.css";
import homeStyles from "../styles/Home.module.css";
import html2canvas from 'html2canvas';
import React, { useState, useEffect } from "react";

export default function PublishBox({ image1, image2, text }) {
    const [count, setCount] = useState(0); 
    const contentRef = React.useRef();
    useEffect(() => {
        /*const contentNode = contentRef.current;
        html2canvas(contentNode).then(function(canvas) {
            document.body.appendChild(canvas);
        });*/
        html2canvas(document.body).then(canvas => {
            console.log("screenshot captured")})
    }, [count]);

    return (
      <div className={homeStyles.container}>
        <h3>Step 3: Send It Out</h3>
        <div className={publishBoxStyles.contentContainer}>
            <div className={publishBoxStyles.previewCase}>
                <p className={publishBoxStyles.preview}>Preview of Selections</p>
                <div ref={contentRef} id="content" className={publishBoxStyles.previewContent}>
                    <p className={publishBoxStyles.prompt}>{text.prompt}</p>
                    <div className={publishBoxStyles.imageCase}>
                        <ImageDisplay number="First" image={image1} label={text.label1}/>
                        <div className={publishBoxStyles.or}>OR</div>
                        <ImageDisplay number="Second" image={image2} label={text.label2}/>
                    </div>
                </div>   
            </div>  
            <PublishForm image1={image1} image2={image2} text={text} count={count} setCount={setCount}/>   
        </div>
      </div>
    );
  }

function ImageDisplay( {number, image, label} ) {
    return (
        <div className={publishBoxStyles.imageContainer}>
            <p className={publishBoxStyles.textContainer}>{`${number} Image Not Selected`}</p>
            {image ? <img src={image.link} alt={image.title}></img> : null}
            <p className={publishBoxStyles.labels}>{label}</p>
        </div>
    )
    
}

function PublishForm({image1, image2, text, count, setCount}) { 
    const handleSubmit = (event) => {
        event.preventDefault();
        /*if (event.target.elements.email.value === "") {
            alert("Please enter an email address");
            return;
        } else if (!image1 || !image2) {
            alert("Make sure both images are selected");
            return;
        } else if (!text.prompt) {
            alert("You forgot to input a prompt");
            return;
        }*/
        setCount(count + 1);

        /*
        const body = "Test";
        Email.send({
            SecureToken : process.env.NEXT_PUBLIC_EMAIL_TOKEN,
            To : event.target.elements.email.value,
            From : process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
            Subject : "This or That!",
            Body : body,
        })
        alert("Your message has been sent to " + event.target.elements.email.value);*/
        event.target.elements.email.value = "";
    };
  
    return (
      <form className={publishBoxStyles.sendBox} onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
        />
        <button type="submit">Send</button>
      </form>
    );
}