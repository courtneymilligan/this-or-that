import publishBoxStyles from "../styles/PublishBox.module.css";
import homeStyles from "../styles/Home.module.css";
import html2canvas from 'html2canvas';
import React, { useState, useEffect, createRef } from "react";

export default function PublishBox({ image1, image2, text }) {
    const ref = createRef();

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
      const contentNode = ref.current;
      const email = event.target.elements.email.value;
      html2canvas(contentNode, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#25272b",
        scrollY: -window.scrollY,
        scrollX: -window.scrollX - 5
      }).then(function(canvas) {
        const image = canvas.toDataURL("image/png");
        Email.send({
          SecureToken : process.env.NEXT_PUBLIC_EMAIL_TOKEN,
          To : email,
          From : process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
          Subject : "This or That!",
          Body : "Test",
          Attachments : [
            {
              name : "this-or-that.png",
              path : "https://www.sciencemag.org/sites/default/files/styles/inline__450w__no_aspect/public/dogs_1280p_0.jpg?itok=h6VBayx-"
            }]
        });
        document.getElementById("screenshot").src = image;
        alert("Your message has been sent to " + email);
      });
      //event.target.elements.email.value = "";
  };

    return (
      <div className={homeStyles.container}>
        <h3>Step 3: Send It Out</h3>
        <div className={publishBoxStyles.contentContainer}>
            <div className={publishBoxStyles.previewCase}>
                <p className={publishBoxStyles.preview}>Preview of Selections</p>
                <div id="content" className={publishBoxStyles.previewContent}>
                  <div ref={ref}>
                      <p className={publishBoxStyles.prompt}>{text.prompt}</p>
                      <div className={publishBoxStyles.imageCase}>
                          <ImageDisplay number="First" image={image1} label={text.label1}/>
                          <div className={publishBoxStyles.or}>OR</div>
                          <ImageDisplay number="Second" image={image2} label={text.label2}/>
                      </div>
                      </div>
                </div>   
            </div>  
            <PublishForm handleSubmit={handleSubmit}/>
            <img id="screenshot" width="300px"></img>
        </div>
      </div>
    );
  }

function ImageDisplay( {number, image, label} ) {
    return (
        <div className={publishBoxStyles.imageContainer}>
            <p className={publishBoxStyles.textContainer}>{image ? null : `${number} Image Not Selected`}</p>
            {image ? <img src={image.link} alt={image.title}></img> : null}
            <p className={publishBoxStyles.labels}>{label}</p>
        </div>
    )
    
}

function PublishForm({handleSubmit}) { 
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