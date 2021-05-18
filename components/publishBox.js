import publishBoxStyles from "../styles/PublishBox.module.css";
import homeStyles from "../styles/Home.module.css";
import React, { useState, createRef } from "react";

export default function PublishBox({ image1, image2, text }) {
  const ref = createRef();
  const [check, setCheck] = useState(false);
  const checkStyle = {fontSize: 24,
    color: 'rgba(96, 191, 161, 1)'
  }

  const previewContentstyle = {
    backgroundColor: "rgb(94, 94, 99)",
    padding: "15px",
    paddingBottom: "22px",
    textAlign: "center",
    borderSpacing: "3px",
    maxWidth: "800px"
  }
  
  const promptStyle = {
    fontSize: "22px",
    padding: "5px",
    paddingBottom: "10px",
    color: "rgb(231, 231, 231)",
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
  }
  
  const orStyle = {
    color: "rgb(93, 173, 148)",
    fontWeight: "bold",
    height: "60px",
    width: "40px",
    textAlign: "center",
    lineHeight: "58px",
    fontSize: "28px",
    borderRadius: "30px",
    zIndex: "2",
  }

  const imageContainerStyle = {
    color: "rgb(31, 42, 53)",
    width: "300px",
    height: "300px",
    borderRadius: "5px",
  }

  const imageContainerImgStyle = {
    backgroundColor: "white",
    zIndex: "1",
    borderRadius: "5px",
  }

  const labelsStyle = {
    color: "rgb(231, 231, 231)",
    fontSize: "18px",
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    if (event.target.elements.email.value === "") {
        alert("Please enter an email address");
        return;
    } else if (!image1 || !image2) {
        alert("Make sure both images are selected");
        return;
    } else if (!text.prompt) {
        alert("You forgot to input a prompt");
        return;
    }
    
    Email.send({
      SecureToken : process.env.NEXT_PUBLIC_EMAIL_TOKEN,
      To : email,
      From : process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
      Subject : "This or That!",
      Body : document.getElementById("email-content").innerHTML,
    }).then(
        message => {
          if (message === "OK") {
            alert("Your message has been sent to " + email);
          } else {
            alert(message);
          }
        }
      );
    setCheck(true);
    event.target.elements.email.value = "";
  };

  return (
    <div className={homeStyles.container}>
      <h3>Step 3: Send It Out<span style={checkStyle}>{check ? ' ✔' : null }</span></h3>
      <div className={publishBoxStyles.contentContainer}>
        <div className={publishBoxStyles.previewCase}>
          <p className={publishBoxStyles.preview}>Preview of Selections</p>
            <div className={publishBoxStyles.previewContent}>
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
          <div  id="email-content" style={{display: "none"}}>
            <table style={previewContentstyle}>
              <tbody>
                <tr>
                  <td colSpan="3"style={promptStyle}>{text.prompt}</td>
                </tr>
                <tr>
                  <td>
                    <ImageDisplay number="First" image={image1} containerStyle={imageContainerStyle} imageStyle={imageContainerImgStyle}/>
                  </td>
                  <td>
                    <div style={orStyle}>OR</div>
                  </td>
                  <td>
                    <ImageDisplay number="Second" image={image2} containerStyle={imageContainerStyle} imageStyle={imageContainerImgStyle}/>
                  </td>
                </tr>
                <tr>
                  <td style={labelsStyle}>{text.label1}</td>
                  <td></td>
                  <td style={labelsStyle}>{text.label2}</td>
                </tr>
              </tbody>
            </table> 
          </div> 
        </div>
      </div>
    );
  }

function ImageDisplay( {number, image, label, containerStyle, imageStyle} ) {
  return (
      <div className={publishBoxStyles.imageContainer} style={containerStyle}>
          <p className={publishBoxStyles.textContainer}>{image ? null : `${number} Image Not Selected`}</p>
          {image ? <img src={image.link} alt={image.title} style={imageStyle}  width="300" height="300"></img> : null}
          <p className={publishBoxStyles.labels}>{label}</p>
      </div>
  )
    
}

function PublishForm({handleSubmit}) { 
  return (
    <form method="post" className={publishBoxStyles.sendBox} onSubmit={handleSubmit}>
      <label htmlFor="email">Email:</label>
      <input
        id="email"
        name="email"
      />
      <button type="submit">Send</button>
    </form>
  );
}