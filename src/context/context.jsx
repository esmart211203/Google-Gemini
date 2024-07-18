import { createContext, useState } from "react";
import run from "../configs/gemini";
export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");   
    const [prevPrompts, setPrevprompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord)
        }, 75 * index);
    }
    
    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }
    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        if (prompt !== undefined) {
            response = await run(prompt);
            setRecentPrompt(prompt);
        }else{
            setPrevprompts(prev=>[...prev, input])
            setRecentPrompt(input)
            response = await run(input);
        }
    
        let responseArr = response.split("**");
        let newResponse = "";
    
        for (let i = 0; i < responseArr.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArr[i];
            } else {
                newResponse += "<b>" + responseArr[i] + "</b>";
            }
        }
    
        let newResponse2 = newResponse.split("*").join("</br>");
        let newResponseArray = newResponse2.split(" ");
        for (let index = 0; index < newResponseArray.length; index++) {
            const nextWord = newResponseArray[index];
            delayPara(index, nextWord+ " ");
        }
        setResultData(newResponse2);
        setLoading(false);
        setInput("");
    }
    

    const contextValue = {
        prevPrompts,
        setPrevprompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;