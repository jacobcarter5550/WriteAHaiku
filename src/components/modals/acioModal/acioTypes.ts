export type MermaidResponse = {
  mermaid_graph: string;
  node_outputs: {
    macro_triggers_generate: {
      text: string;
      node: string;
      sequence: number;
    }[];
    macro_triggers_review: {
      text: string;
      node: string;
      sequence: number;
    }[];
    macro_triggers_consistency: {
      text: string;
      node: string;
      sequence: number;
    }[];
    macro_node: {
      text: string;
      node: string;
      sequence: number;
    }[];
    macro_supervisor: {
      text: string;
      node: string;
      sequence: number;
    }[];
    micro_node: {
      text: string;
      node: string;
      sequence: number;
    }[];
    micro_supervisor: {
      text: string;
      node: string;
      sequence: number;
    }[];
  };
  thinking_node: string[];
  running: boolean;
  graph_built: boolean;
  available_models: string[];
  loading?: boolean;
};
