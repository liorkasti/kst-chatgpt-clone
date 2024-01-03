import { useEffect, useState } from "react";

export interface Message {
  title: string;
  role: "user" | "assistant";
  content: string;
}
const defaultMessage: Message = {
  title: "",
  role: "user",
  content: "",
};

const App = () => {
  const [currentTitle, setCurrentTitle] = useState("");
  const [previousChats, setPreviousChats] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const [message, setMessage] = useState<Message>(defaultMessage);

  const sendMessage = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: messageContent,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch("http://localhost:8000/api/chat", options);
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.log("Error in sendMessage: ", error);
    }
  };

  useEffect(() => {
    // initiating a new chat
    if (!currentTitle && messageContent && message) {
      setCurrentTitle(messageContent);
    }

    // initiating an existing chat
    if (currentTitle && messageContent && message) {
      setPreviousChats(
        (prev) =>
          [
            ...prev,
            {
              title: currentTitle,
              role: "user",
              message: messageContent,
            },
            {
              title: currentTitle,
              role: message.role,
              content: message.content,
            },
          ] as Message[]
      );
    }
  }, [message, currentTitle]);

  const createNewChat = () => {
    setMessage(defaultMessage);
    setMessageContent("");
    setCurrentTitle("");
  };

  const selectExistingChat = (title: string) => {
    setCurrentTitle(title);
    setMessage(defaultMessage);
    setMessageContent("");
  };

  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );

  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );

  return (
    <div className='app'>
      <section className='side-bar'>
        <button onClick={createNewChat}>+ New chat</button>
        <ul className='history'>
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => selectExistingChat(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <p className='powered-by'>Github @LiorKasti</p>
        </nav>
      </section>
      <section className='main'>
        {!currentTitle && <h1>KST-GPT</h1>}
        <ul className='feed'>
          {currentChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className='role'>{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className='bottom-section'>
          <div className='input-container'>
            <input
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
            <div id='submit' onClick={sendMessage}>
              ➢
            </div>
          </div>
          <p className='info'>
            ChatGPT is a free-to-use AI system. Use it for engaging
            conversations, gain insights, automate tasks, and witness the future
            of AI, all in one place.
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
