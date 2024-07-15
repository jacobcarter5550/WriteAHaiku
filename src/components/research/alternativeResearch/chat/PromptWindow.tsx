import { TextInput } from "@carbon/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { ChatExchange, ChatTypeEnum, CombinedChatData } from "../../types.ts";
import { transformResponseToHtml } from "./lib.tsx";
import Questions from "./Questions.tsx";
import CustomDropdown from "../../../../ui-elements/carbonDropdownTP.tsx";
import Output from "./Output.tsx";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import LoadingSmall from "../../../../ui-elements/LoadingSmall.tsx";
import { useAppSelector } from "../../../../store/index.ts";
import { staticGetUser } from "../../../../store/user/selectors.ts";
import {v4} from "uuid";
import InfoBoxView from "./InfoBoxView.tsx";
import { CompanyInfo, InfoBox, Message, SalesInfo } from "./types.ts";
import FollowupQuestionsBox from "./FollowupQuestionsBox.tsx";


export const SERVER_URL = "https://aresearch-dev-eagle.linvest21.com";


const PromptWindow: React.FC<{
  setChat: React.Dispatch<React.SetStateAction<ChatExchange[] | null>>;
  question: string | null;
  setQuestion: React.Dispatch<React.SetStateAction<string | null>>;
  chat: ChatExchange[] | null;
  loginResponse: any;
  historyIds: string[];
  prevSession: { id: string; title: string } | null;
  setCombinedChatData: React.Dispatch<
    React.SetStateAction<CombinedChatData | null>
  >;
  combinedChatData: CombinedChatData | null;
}> = ({
  prevSession,
  historyIds,
  loginResponse,
  setChat,
  question,
  setQuestion,
  chat,
  combinedChatData,
  setCombinedChatData,
}) => {
  const user = useAppSelector(staticGetUser);

  const [currentExchange, setCurrentExchange] = useState<string | null>(null);
const currentExchangeRef = useRef<string | null>(null);

// Update the ref whenever currentExchange changes
useEffect(() => {
  currentExchangeRef.current = currentExchange;
}, [currentExchange]);

  const [session, setSession] = useState<any | null>(null);
  const [sourceData, setSourceData] = useState<any>([]);
  const [chatId, setChatId] = useState<string>("");
  const [curretQuery, setCurrentQuery] = useState<string>("");

  async function initSession() {
    console.log(loginResponse);
    try {
      const sessionResponse = await client.post(
        "/get_new_session_id",
        {},
        {
          headers: {
            Authorization: `Bearer ${loginResponse?.access_token}`,
          },
        }
      );
      console.log(sessionResponse.data);
      const access = {
        access_token: loginResponse?.access_token,
        ...sessionResponse.data,
      };
      setSession(access);
    } catch (error) {
      console.error("Error fetching new session ID:", error);
    }
  }

  type ChatIndexResponse = {
    id: string;
    chat_owner: string;
    user_prompts: string[];
    machine_responses: { text: string; dataSources: any[] }[];
  };

  function formatChat(response: ChatIndexResponse) {
    return response.user_prompts.map((prompt, index) => {
      const html = transformResponseToHtml(
        { data: { response: response.machine_responses[index].text } },
        response.machine_responses[index].dataSources
      );

      const val: ChatExchange[] = [
        { data: { query: prompt }, type: ChatTypeEnum.USER },
        {
          data: html.html,
          type: ChatTypeEnum.LLM,
        },
      ];

      // setSourceData(
      //   html.numbersArray?.filter((data) => {
      //     return transformed?.numbersArray.includes(data.uuid);
      //   })
      // );
      return val;
    });
  }



  const [loading, setLoading] = useState<boolean>(false);

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  function debounce(func, delay: number) {
    return function (...args: []) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        func(...args);
        debounceTimeout.current = null;
      }, delay);
    };
  }

  const [isKeydown, setIsKeydown] = useState(false);

  function setFalseAfterDelay() {
    setIsKeydown(false);
  }

  const client = axios.create({
    baseURL: "https://test.generativealpha.ai/devtest",
  });
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    // if (question !== null) {
    //   setText(question);
    //   setTimeout(() => {
    //     sendToGAlpha(question);
    //   }, 500);
    // }
  }, [question]);

 
  useEffect(() => {
    if (chat && sourceData && chatId) {
      const combinedChat = {
        chatId: chatId,
        chat: chat,
        sourceData: sourceData,
      };

      setCombinedChatData((prevState) => {
        if (prevState === null) {
          return [combinedChat];
        } else {
          const existingIndex = prevState.findIndex(
            (item) => item.chatId === combinedChat.chatId
          );

          if (existingIndex !== -1) {
            prevState[existingIndex] = combinedChat;
            return [...prevState];
          } else {
            return [...prevState, combinedChat];
          }
        }
      });
    }
  }, [chat, sourceData]);

  const onKeyDown = useCallback(
    async (event) => {
      switch (event.key) {
        case "Enter":
          console.log(chat);
          submitInputBox();
          break;
      }
    },
    [client, setChat, text]
  );

  useEffect(() => {
    const links = document.querySelectorAll(".source-link");
    links.forEach((link) => {
      link.setAttribute("target", "_blank");
    });
  }, [sourceData]);
  const handleKeydownDebounced = debounce(setFalseAfterDelay, 1000);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [infoBoxes, setInfoBoxes] = useState<InfoBox[]>([]);
  const [followups, setFollowups] = useState<string[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  const validInfoboxTools = ["show_company_info", "sales"];
  const addIncomingInfobox = (data: any) => {
    const content: string = data.content;
    console.log("show company info: " + content);
    try {
      let newData = JSON.parse(content);

      let inferredData: InfoBox;
      if (data.tool_name === "show_company_info") {
        console.log("company info")
        inferredData = newData as CompanyInfo;
      } else if (data.tool_name === "sales") {
        console.log("sales info")
        inferredData = newData as SalesInfo;
      } else {
        throw new Error("Unknown tool name");
      }

      setInfoBoxes((prevInfoBoxes) => {
        // Check for duplicate infobox using JSON.stringify for deep comparison
        const exists = prevInfoBoxes.some(
          (infoBox: InfoBox) =>
            JSON.stringify(infoBox) === JSON.stringify(inferredData)
        );
        console.log(exists)
        if (!exists) {
          console.log(inferredData)
          return [...prevInfoBoxes, inferredData];
        }
        console.warn("Infobox already exists:", inferredData);
        return prevInfoBoxes;
      });
    } catch (error) {
      console.error("Failed to parse content as JSON:", content);
      console.error(error);
    }
  };

  const handleServerMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data);
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];

      if (data.type === "session") {
        setSessionId(data.content.session_id);
        return prevMessages;
      } else if (data.type === "message") {

        if (lastMessage && lastMessage.sender === "ai") {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            text: lastMessage.text + data.content,
          };
          return updatedMessages;
        } else {
          return [...prevMessages, { sender: "ai", text: data.content, exchangeID: currentExchangeRef.current }];
        }
      } else if (data.type === "tool_start") {

        return [
          ...prevMessages,
          {
            sender: "ai_tool",
            text: data.content,
            toolName: data.tool_name,
            done: false,
            exchangeID: currentExchangeRef.current
          },
        ];
      } else if (data.type === "tool_done") {

        // console.log(data.tool_name);
        if (validInfoboxTools.includes(data.tool_name)) {
          addIncomingInfobox(data);
        }
        // console.log("TOOL DONE: " + data.content)
        // Find the latest undone tool message with matching name and mark it as done
        const updatedMessages = [...prevMessages];
        for (let i = updatedMessages.length - 1; i >= 0; i--) {
          if (
            updatedMessages[i].sender === "ai_tool" &&
            updatedMessages[i].toolName === data.tool_name &&
            !updatedMessages[i].done
          ) {
            updatedMessages[i] = { ...updatedMessages[i], done: true };
            // console.log("found tool")
            break;
          }
        }
        return updatedMessages;
      } else if (data.type === "followup") {
        try {
          // Extract questions
          const followupQuestions = data.content.questions.map(
            (fq: { text: string; suggestedTool: string }) => fq.text
          );
          setFollowups(followupQuestions);
        } catch (error) {
          console.error("Failed to process followup questions", error);
          setFollowups([]);
        }
      }

      return prevMessages;
    });
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      if (text.trim() && !isLoading) {
        setIsLoading(true);
        const newExchangeID = v4();
        setCurrentExchange(newExchangeID)
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "human", text, exchangeID: newExchangeID},
        ]);

        const url = sessionId
          ? `${SERVER_URL}/aresearch/chat/static?question=${encodeURIComponent(text)}&session_id=${sessionId}`
          : `${SERVER_URL}/aresearch/chat/static?question=${encodeURIComponent(text)}`;

        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = handleServerMessage;

        eventSource.onerror = (error) => {
          setCurrentExchange(null)
          console.error("EventSource failed:", error);
          eventSource.close();
          setIsLoading(false);
        };

        eventSource.addEventListener("message", (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "end") {
            eventSource.close();
            setIsLoading(false);
          }
        });
      }
    },
    [isLoading, handleServerMessage, sessionId]
  );

  const submitInputBox = useCallback(() => {
    if (text && text.trim() && !isLoading) {
      sendMessage(text);
      setText("");
    }
  }, [text, isLoading, sendMessage]);

  const handlePromptClick = (promptText: string) => {
    setFollowups([]);
    sendMessage(promptText);
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);
  console.log(infoBoxes)

  return (
    <>
    <div
    style={{width : infoBoxes.length == 0 ? "100%" : ""}}
      className={`prompt-container ${chat ? "prompt-container-justified" : ""}`}
    >

      {messages && (
        <>
        <Output
          loading={loading}
          chat={chat}
          setChat={setChat}
          sourceData={sourceData}
          setQuestion={setQuestion}
          messages={messages}
          followups={followups}
          handlePromptClick={handlePromptClick}
          />

          </>
      )}

      <div className="question-container">
        {messages.length == 0 && (
          <Questions
            setQuestion={setText}
            session={session}
            initSession={initSession}
          />
        )}
        <div className="query-input-wrapper">
          <span className="query-input-icons">
            <div>
              <img src="/micInputResearch.svg" />
              <img src="/imageIcon.svg" />
            </div>
          </span>

          <span className="query-input-icons-end">
            <span>
              <img src="/ellipsisInputResearch.svg" />
            </span>
          </span>
          <div className="query-input">
            <TextInput
              onClick={() => {
                // if (session == null) {
                //   initSession();
                // }
              }}
              id="text-input-1"
              type="text"
              labelText=""
              placeholder="Ask a Question"
              value={text || ""}
              onChange={(e) => {
                setIsKeydown(true);
                handleKeydownDebounced();
                setText(e.target.value);
              }}
              onKeyDown={(e) => onKeyDown(e)}
              required={true}
            />
          </div>
        </div>
        <div className="chartHolder">
        </div>
      </div>
    </div>
        <InfoBoxView infoBoxes={infoBoxes} />
    </>
  );
};

export default PromptWindow;
