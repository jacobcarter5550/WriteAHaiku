/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { useAppSelector } from "../../../store/index.ts";
import { staticGetUser } from "../../../store/user/selectors.ts";

const supabase = createClient(
  "https://ojmzolmasgweporwgbih.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qbXpvbG1hc2d3ZXBvcndnYmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ3NzgwODUsImV4cCI6MjAzMDM1NDA4NX0.eYQKLTqmq8nutw7QfUvn4DST-7TyCZXxiQF0k0sLIq0"
);

const ChatHistory: React.FC<{
  historyIds: { id: string; title: string }[];
  setPrevSession: React.Dispatch<
    React.SetStateAction<{ id: string; title: string } | null>
  >;
  setHistory: React.Dispatch<any>;
}> = ({ historyIds, setPrevSession, setHistory }) => {
  const user = useAppSelector(staticGetUser);

  return (
    <div className="history-container">
      <div className="new-chat">
        <p>New Chat</p>
        <img src="newChat.svg" />
      </div>
      {historyIds?.map((chat) => {
        return (
          <div
            className="history-item"
            onClick={() => {
              setPrevSession(chat);
            }}
          >
            <div>
              <img src="/chat.svg" />
              <p
                style={{
                  width: "10rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {chat.title}
              </p>
            </div>
            <div>
              <img src="/editHistory.svg" />
              <img
                src="/deleteHistory.svg"
                onClick={async () => {
                  await supabase
                    .from("user_chat_history")
                    .select()
                    .eq("id", user.email)
                    .then(async (res) => {
                      const removed = res.data![0].chat_history.filter(
                        (item) => item.id !== chat.id
                      );
                      await supabase
                        .from("user_chat_history")
                        .update({ chat_history: removed })
                        .eq("id", user.email)
                        .then(async () => {
                          await supabase
                            .from("chat_index")
                            .delete()
                            .eq("id", chat.id)
                            .then((res) => {
                              setHistory((prev) =>
                                prev.filter((item) => item.id !== chat.id)
                              );
                            });
                        });
                    });
                }}
              />
            </div>
          </div>
        );
      })}

      <div className="separator"></div>
      <div className="clear-conversation">
        <img src="deleteHistory.svg" />
        <p>Clear conversations</p>
      </div>
    </div>
  );
};

export default ChatHistory;
