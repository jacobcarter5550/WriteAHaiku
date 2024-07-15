export type SourceMData = {
  type: string;
  date: string;
  displayed_link: string;
  favicon: string;
  source_text: string;
  "sec-filing_type": string;
};

export type QueryMData = {
  search_query: "SMP500 market trend";
};


export enum ChatTypeEnum {
  LLM = "LLM",
  USER = "User",
}

export type LLMReponse = {
  type: ChatTypeEnum.LLM;
  data: string;
};

export type UserInputData = {
  query: string;
};

export type UserInput = {
  type: ChatTypeEnum.USER;
  data: UserInputData;
};

export type ChatExchange = UserInput | LLMReponse;

export type CombinedChatData = {
  chat: ChatExchange[] | null;
  sourceData: any;
  chatId: string | null;
}[];

type mresponse = {
  text: string;
  dataSources: {
    uri: string;
    text: string;
    uuid: number | string;
    title: string;
    text_id: number;
    query_metadatas: {
      search_query: string;
    }[];
    source_metadata: {
      date: string;
      type: string;
      favicon: string;
      source_text: string;
      displayed_link: string;
      "sec-filing_type": string;
    };
  }[];
}[];
