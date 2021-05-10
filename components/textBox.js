import React, { useEffect, useState } from "react";
import textBoxStyles from "../styles/TextBox.module.css";
import homeStyles from "../styles/Home.module.css";

export default function TextBox({ text, setText }) {  
    return (
      <div className={homeStyles.container}>
        <h3>Step 1: Choose Labels</h3>
        <div className={textBoxStyles.nav}>
            <Inputs text={text} setText={setText}/>
        </div>
      </div>
    );
  }

function Inputs({ text, setText }) {
    const handleSubmit = event => {
        event.preventDefault();
        if (!event.target.elements.prompt.value) {
            alert("You forgot to input a prompt");
            return;
        }
        const newText = {
            ...text,
            prompt: event.target.elements.prompt.value,
            label1: event.target.elements.label1.value === "ex: Frank's Red Hot Sauce" ? "" : event.target.elements.label1.value,
            label2: event.target.elements.label2.value === "ex: Sriracha Sauce" ? "" : event.target.elements.label2.value,
        };
        setText(newText);
        event.target.elements.prompt.value = "";
        event.target.elements.label1.value = "";
        event.target.elements.label2.value = "";
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={textBoxStyles.prompt}>
                <label htmlFor="prompt">Prompt:</label>
                <InputField field="prompt" startValue="ex: Select the superior hot sauce"></InputField>
            </div>
            <div className={textBoxStyles.label}>
                <label htmlFor="label1">Label for first image (optional):</label>
                <InputField field="label1" startValue="ex: Frank's Red Hot Sauce"></InputField>
            </div>
            <div className={textBoxStyles.label}>
                <label htmlFor="label2">Label for second image (optional):</label>
                <InputField field="label2" startValue="ex: Sriracha Sauce"></InputField>  
            </div>
            <button type="submit" className={textBoxStyles.button}>Submit</button>
        </form>
      );
}  

function InputField({ field, startValue }) {
    const [focus, setFocus] = useState(false);
    const boxStyle = {
        color: "rgb(170, 170, 170)"
      };

    return (
        <input
        id={field}
        name={field}
        defaultValue={startValue}
        onFocus={(event) => {
            if (event.target.value === startValue) {
                event.target.value = "";
            }
            setFocus(true);
        }}
        onBlur={(event) => {
            if (!event.target.value) {
            event.target.value = startValue;
            setFocus(false);
            }
        }}
        style={focus ? null : boxStyle}
        />
      );
}