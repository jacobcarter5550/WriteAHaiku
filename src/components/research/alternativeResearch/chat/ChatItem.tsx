import { ClickableTile, TextArea } from "@carbon/react";
import React, { useState } from "react";
import { ChatExchange, ChatTypeEnum } from "../../types.ts";
import { HtmlContent } from "./lib.tsx";
import ReactMarkdown from "react-markdown";

export const SERVER_URL = "https://aresearch-dev-eagle.linvest21.com";
const ChatItem: React.FC<{ data: ChatExchange }> = ({ data }) => {


  const transformSandboxLinks = (text: string) => {
    const regex = /\(sandbox:\/([^\)]+)\)/g;
    return text.replace(regex, `(${SERVER_URL}/download/$1)`);
  };

  console.log(data);
  function chatType(exchangeData: ChatExchange) {
    switch (exchangeData.sender) {
      case ChatTypeEnum.HUMAN:
        // console.log(exchangeData.data.query);
        console.log(exchangeData);
        return (
          <aside style={{backgroundColor:'#f8f8f8', padding:'3rem 4rem'}}>
            <h3 style={{ margin: "2rem 0px" }}>{exchangeData.text}</h3>
            <div>
              {exchangeData.events &&
                exchangeData.events.map((event) => {
                  return (
                    <span
                      style={{
                        fontSize: "1rem",
                        display: "flex",
                        alignItems: "center",
                        margin: ".75rem",
                      }}
                    >
                      {event.text}
                      {event.done ? (
                        <img
                          style={{ width: "1.3rem" }}
                          src="/checkMark.svg"
                          alt=""
                        />
                      ) : (
                        "loading"
                      )}
                    </span>
                  );
                })}
            </div>
          </aside>
        );
      case ChatTypeEnum.AI:
        return (
          <section className="chat-content" style={{padding:'3rem 4rem'}}>
            <div
              style={{
                marginTop: "1vh",
                fontSize: "1.2rem",
                resize: "none",
                borderBlockEnd: "0px",
              }}
            >
              <ReactMarkdown>
                {transformSandboxLinks(exchangeData.text)}
              </ReactMarkdown>
            </div>
          </section>
        );
      default:
        return null;
    }
  }

  return chatType(data);
};

export default ChatItem;
