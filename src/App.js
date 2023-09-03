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
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGPT",
      sender: "ChatGPT",
    },
  ]);
  return (
    <div className="App">
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList>
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
