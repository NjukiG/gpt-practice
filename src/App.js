import logo from "./logo.svg";
import "./App.css";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useState } from "react";
function App() {
  // console.log(process.env.REACT_APP_API_KEY);
  const API_KEY = process.env.REACT_APP_API_KEY;
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGPT",
      sender: "ChatGPT",
    },
  ]);
  const [typing, setTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    // All the old mesages plus the new one after.
    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setTyping(true);
    // Process mesages to chatgpt (send it and see responce)
    await processMessageToChatGPT(newMessages);
  };

  const processMessageToChatGPT = async (chatMessages) => {
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system",
      content: "Explain all concepts like I'm a 10 year old!",
    };
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...apiMessages,
        // {
        //   "role": "system",
        //   "content": "You are a helpful assistant."
        // },
        // {
        //   "role": "user",
        //   "content": "Hello!"
        // }
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data.choices[0].message.content);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setTyping(false);
      })
      .catch((err) => {
        setTyping(false);
        console.log("An error occured", err);
      });
  };
  return (
    <div className="App">
      <div style={{ position: "relative", height: "700px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                typing ? (
                  <TypingIndicator content="ChatGPT is typing responce" />
                ) : null
              }
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput
              placeholder="Ask a question here..."
              onSend={handleSend}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
