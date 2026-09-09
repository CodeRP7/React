import styles from "./App.module.css";
import { Chat } from "./components/Chat/Chat";
import { useState } from "react";
import {GoogleGenerativeAI} from "@google/generative-ai";
import { Controls } from "./components/Controls/Controls";
import { Assistant } from "./assistants/googleai";
import { Loader } from "./components/Loader/Loader";


 function App() {

  const assistant = new Assistant()
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  function updateLastMessageContent(content) {
    setMessages((prevMessages) =>
      prevMessages.map((message, index) =>
        index === prevMessages.length - 1
          ? { ...message, content: `${message.content}${content}` }
          : message
      )
    );
  }

  function addMessage(message){
    setMessages((prevMessages) => [...prevMessages, message] )
    
  }

  async function  handleContentSend(content){
    addMessage({content,role: 'user'})
    setIsLoading(true);
    try {
      const result = await assistant.chatStream(content, messages)
      let isFirstChunk = false;
     
      for await(const chunk of result) {
        if(!isFirstChunk){
          isFirstChunk = true;
          addMessage({ content:"", role: "assistant" })
          setIsLoading(false);
          setIsStreaming(true);
        }

        updateLastMessageContent(chunk)
      }

       setIsStreaming(false);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      addMessage({content: "Sorry, i couldn't process your request. Please try again",role: 'system'});
      setIsLoading(false);
       setIsStreaming(false);
    } 
  }

  return (
   <div className={styles.App}>
    {isLoading &&<Loader />}
    <header className={styles.Header}>
      <img className={styles.Logo} src="chat-bot.png" alt="" />
      <h2 className={styles.Title}>AI ChatBot</h2>
    </header>
    <div className={styles.ChatContainer}>
      <Chat messages={messages} />
      </div>
      <Controls isDisabled={isLoading || isStreaming} onSend={handleContentSend} />
    </div>
  )
}



export default App
