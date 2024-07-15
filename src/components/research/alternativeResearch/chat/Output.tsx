import React, { useEffect, useRef, useState } from "react";
import { ChatExchange, ChatTypeEnum } from "../../types.ts";
import ChatItem from "./ChatItem.tsx";
import SourceItem from "./SourceItem.tsx";
import LoadingSmall from "../../../../ui-elements/LoadingSmall.tsx";
import RelatedQuestions from "./RelatedQuestions.tsx";
import ReactMarkdown from "react-markdown";
import FollowupQuestionsBox from "./FollowupQuestionsBox.tsx";

export const SERVER_URL = "https://aresearch-dev-eagle.linvest21.com";

const Output: React.FC<{
  chat: ChatExchange[] | null;
  setChat: React.Dispatch<React.SetStateAction<ChatExchange[] | null>>;
  sourceData: any[] | null;
  loading: boolean;
  setQuestion: React.Dispatch<React.SetStateAction<string | null>>;
  messages: any;
  followups: any;
  handlePromptClick: any;
}> = ({
  chat,
  sourceData,
  loading,
  setQuestion,
  messages,
  followups,
  handlePromptClick,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log(sourceData);
  useEffect(() => {
    if (chat) {
      const clone = structuredClone(chat);

      const userMessages = clone.filter(
        (item) => item.type == ChatTypeEnum.USER
      );

      const llmMessages = clone.filter((item) => item.type == ChatTypeEnum.LLM);

      if (userMessages.length == llmMessages.length) {
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
    }
  }, [chat]);

  const transformSandboxLinks = (text: string) => {
    const regex = /\(sandbox:\/([^\)]+)\)/g;
    return text.replace(regex, `(${SERVER_URL}/download/$1)`);
  };
  const shouldShowAlphaCopilot = (index: number) => {
    if (index === 0) return messages[0].sender !== "human";
    const prevMessage = messages[index - 1];
    const currentMessage = messages[index];
    return (
      (currentMessage.sender === "ai" || currentMessage.sender === "ai_tool") &&
      prevMessage.sender === "human"
    );
  };

  const chatViewRef = useRef<HTMLDivElement>(null);
  //TODO Add type Guard here
  //@ts-ignore
  const initialQuestion = chat && chat?.length > 0 && chat[0]?.data?.query;


  useEffect(() => {
    if (chatViewRef.current) {
        chatViewRef.current.scrollTop = chatViewRef.current.scrollHeight;
    }
}, [messages, followups]);

  return (
    <aside
      style={{ width: "100%", height: messages.length == 0 ? "70%" : "90%" }}
    >
      <section className="output-box" ref={chatViewRef}>
        {messages.map((message, index) => {
          function messageSwitch(msg: any) {
            switch (msg.sender) {
              case "human":
                const occurringEvents = messages.filter(
                  (exchangeMessage) =>
                    exchangeMessage.sender === "ai_tool" &&
                    exchangeMessage.exchangeID === msg.exchangeID
                );
                return (
                  <ChatItem data={{ ...message, events: occurringEvents }} />
                );
              case "ai":
                return <ChatItem data={message} />;
            }
          }
          return messageSwitch(message);
        })}
        {loading && (
          <>
            <div style={{ height: "20rem" }} />
            <LoadingSmall />
          </>
        )}
      <FollowupQuestionsBox
        followups={followups}
        onPromptClick={handlePromptClick}
      />
      </section>
    </aside>
  );
};

export default Output;
