import React, { useEffect, useRef, useState } from "react";
import BreadCrumb from "../../portfolio/misc/breadcrumbTP.tsx";
import Questions from "./chat/Questions.tsx";
import PromptWindow from "./chat/PromptWindow.tsx";
import Output from "./chat/Output.tsx";
import axios from "axios";
import { ChatExchange, CombinedChatData } from "../types.ts";
import "../../../styles/research.scss";
import Status from "../../portfolio/misc/statusTP.tsx";
import ChatHistory from "../history/index.tsx";
import { useAppSelector } from "../../../store/index.ts";
import { createClient } from "@supabase/supabase-js";
import { staticGetUser } from "../../../store/user/selectors.ts";
import { getCurrentOpen } from "../../../store/nonPerstistant/selectors.ts";
import IframeComponent from "./IframeComponent.tsx";

const supabase = createClient(
  "https://ojmzolmasgweporwgbih.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qbXpvbG1hc2d3ZXBvcndnYmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ3NzgwODUsImV4cCI6MjAzMDM1NDA4NX0.eYQKLTqmq8nutw7QfUvn4DST-7TyCZXxiQF0k0sLIq0"
);

const Research = () => {
  const user = useAppSelector(staticGetUser);

  const [history, setHistory] = useState<any>();
  const [prevSession, setPrevSession] = useState<{
    id: string;
    title: string;
  } | null>(null);

  async function getHistory(user: any) {
    const { data: user_chat_history, error } = await supabase
      .from("user_chat_history")
      .select("*")
      .eq("id", user.email);

    console.log(user_chat_history);
    if (user_chat_history?.length == 0) {
      const { data, error } = await supabase
        .from("user_chat_history")
        .insert([{ id: user.email, chat_history: [] }]);
      console.log(data);
    } else {
      user_chat_history && setHistory(user_chat_history[0].chat_history);
      console.log("user exists");
    }
  }

  useEffect(() => {
    if (user) {
      getHistory(user);
    }
  }, []);

  const currentOpen = useAppSelector(getCurrentOpen);

  const [chat, setChat] = useState<ChatExchange[] | null>(null);
  const [combinedChatData, setCombinedChatData] =
    useState<CombinedChatData | null>([]);

  const [loginResponse, setLoginResponse] = useState<any | null>(null);

  const client = axios.create({
    baseURL: "https://test.generativealpha.ai/devtest",
  });

  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = () => {
    if (divRef.current) {
      const { offsetWidth, offsetHeight } = divRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  };

  useEffect(() => {
    updateDimensions();

    // Add event listener for window resize
    window.addEventListener("resize", updateDimensions);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);
  useEffect(() => {
    async function testGAlpha() {
      try {
        const loginResponse = await client.post(
          "/login",
          {
            username: "testuser",
            password: "password123",
          },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        setLoginResponse(loginResponse.data);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }

    if (loginResponse == null) {
      testGAlpha();
    }
  }, []);

  const [question, setQuestion] = useState<string | null>(null);

  return (
    <>
      <section>
        {/* <section className={`portfolio-section ${currentOpen ? "show" : "hide"}`}> */}
        {/* <div
          className="flex-box-wrapper research-container"
          style={{ maxHeight: "92%%" }}
        >
          <div className="block-one flex-7 left-block">
            <ChatHistory
              setHistory={setHistory}
              historyIds={history}
              setPrevSession={setPrevSession}
            />
            <PromptWindow
              prevSession={prevSession}
              historyIds={history}
              question={question}
              loginResponse={loginResponse}
              setChat={setChat}
              setQuestion={setQuestion}
              chat={chat}
              combinedChatData={combinedChatData}
              setCombinedChatData={setCombinedChatData}
            />
          </div>
          <div style={{ overflow: "hidden" }} className="block-two flex-3">
            <img src="graphSC.png" alt="" style={{ width: "100%" }} />
          </div>
        </div> */}
        <div style={{ position: "relative" }}>
          <div
            className="empty-div"
            style={{
              width: "10rem",
              height: `${dimensions.height - 1}px`,
              backgroundColor: "#e2e8f0",
              position: "absolute",
            }}
          ></div>
          <div className="iframe-wrapper" ref={divRef}>
            <IframeComponent />
          </div>
        </div>
        <Status />
      </section>
    </>
  );
};

export default Research;
