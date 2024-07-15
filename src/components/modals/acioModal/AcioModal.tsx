import React, { useCallback, useEffect, useState } from "react";
import ModalType, { ModalTypeEnum } from "../../../ui-elements/modals/ModalType.tsx";
import Button from "../../../ui-elements/buttonTP.tsx";
import ImageComponent from "../../../ui-elements/ImageComponent.tsx";
import Mermaid from "../../advisor/Mermaid.tsx";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import axios from "axios";
import { MermaidResponse } from "./acioTypes.ts";
import { Skeleton } from "@mui/material";
import { Tab, TabList, Tabs } from "@carbon/react";
import { toast } from "react-toastify";
import isEqual from "lodash/isEqual";
import MERMAID_CONFIG from "./mermaidConfig.ts";

export enum AcioViewOptions {
  TAB1 = "Pilot",
  TAB2 = "Formal",
}

// We are using the enum values directly as tab labels for simplicity and direct mapping
export const tabData = [
  AcioViewOptions.TAB1,
  AcioViewOptions.TAB2,
];

const loading = `graph TD
style A fill:#f0f0f0,stroke:#333,stroke-width:2px
style B fill:#f0f0f0,stroke:#333,stroke-width:2px
style C fill:#f0f0f0,stroke:#333,stroke-width:2px

A[<div style="width: 100px; height: 100px;"></div>] --> B[<div style="width: 100px; height: 100px;"></div>]
B --> C[<div style="width: 100px; height: 100px;"></div>]`;

const dummy = `graph TD
subgraph parent_0 ["US Equity Research Team"]
  subgraph child_1 ["Macro Research Team"]
  macro_triggers_generate["Research Analyst"]
  macro_triggers_review["Supervisor"]
  macro_triggers_consistency["Fact Checker"]
  end
  subgraph child_2 ["Micro Research Team"]
  micro_triggers_generate["Research Analyst"]
  micro_triggers_review["Supervisor"]
  micro_triggers_consistency["Fact Checker"]
  end
end

subgraph parent_3 ["Portfolio Management Team"]
  direction LR
  portfolio_optimize["Portfolio Manager"]
  pm_supervisor["Supervisor"]
end

subgraph parent_5 ["Client Portfolio Management Team"]
  subgraph child_6 ["CPM (Detailed Commentator)"]
  explainable_investing_generate["Analyst"]
  explainable_investing_review["Supervisor"]
  explainable_investing_consistency["Fact Checker"]
  end
  subgraph child_7 ["CPM (Briefing Commentator)"]
  brief_generate["Analyst"]
  brief_review["Supervisor"]
  brief_consistency["Fact Checker"]
  end
end

subgraph parent_8 ["US Equity Team"]
  subgraph child_9 ["Macro Analyst Team"]
  macro_node["Macro Analyst"]
  macro_supervisor["Supervisor"]
  end
  subgraph child_10 ["Micro Analyst Team"]
  micro_node["Micro Analyst"]
  micro_supervisor["Supervisor"]
  end
end

parent_0 --> parent_8

parent_8 --> parent_3

parent_3 --> parent_5

macro_node <--> macro_supervisor

micro_node <--> micro_supervisor

portfolio_optimize <--> pm_supervisor

macro_triggers_generate <--> macro_triggers_review

macro_triggers_generate <--> macro_triggers_consistency

micro_triggers_generate <--> micro_triggers_review

micro_triggers_generate <--> micro_triggers_consistency

explainable_investing_generate <--> explainable_investing_review

explainable_investing_generate <--> explainable_investing_consistency

brief_generate <--> brief_review

brief_generate <--> brief_consistency
click macro_triggers_generate clickNode "Click to view Research Analyst's latest report";
click macro_triggers_review clickNode "Click to view Supervisor's latest report";
click macro_triggers_consistency clickNode "Click to view Fact Checker's latest report";
click micro_triggers_generate clickNode "Click to view Research Analyst's latest report";
click micro_triggers_review clickNode "Click to view Supervisor's latest report";
click micro_triggers_consistency clickNode "Click to view Fact Checker's latest report";
click macro_node clickNode "Click to view Macro Analyst's latest report";
click micro_node clickNode "Click to view Micro Analyst's latest report";
click portfolio_optimize clickNode "Click to view Portfolio Manager's latest report";
click explainable_investing_generate clickNode "Click to view Analyst's latest report";
click explainable_investing_review clickNode "Click to view Supervisor's latest report";
click explainable_investing_consistency clickNode "Click to view Fact Checker's latest report";
click brief_generate clickNode "Click to view Analyst's latest report";
click brief_review clickNode "Click to view Supervisor's latest report";
click brief_consistency clickNode "Click to view Fact Checker's latest report";
click macro_supervisor clickNode "Click to view Supervisor's latest report";
click micro_supervisor clickNode "Click to view Supervisor's latest report";
click pm_supervisor clickNode "Click to view Supervisor's latest report";
classDef activeNode fill:#AFE1AF;
`;

interface NodeData {
  node: string;
  sequence: number;
  text: string;
}

const createInitialNodeData = (
  node: string = "",
  sequence: number = 0,
  text: string = ""
): NodeData => ({
  node,
  sequence,
  text,
});

const AcioModal: React.FC<{
  acioModal: boolean;
  setAcioModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ acioModal, setAcioModal }) => {
  const [allNodeData, setAllNodeData] = useState<NodeData[]>([]);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const [savedMerState, setSavedMerState] = useState<MermaidResponse[] | null>(null);
  const [mermaidState, setMermaidState] = useState<MermaidResponse | Partial<MermaidResponse> | null>(null);
  const [displayedNode, setDisplayedNode] = useState<NodeData | null>(createInitialNodeData());
  const [maxSequenceObj, setMaxSequenceObj] = useState<any>({});
  const [running, setRunning] = useState<boolean>(true);
  const [sequenceObjects, setSequenceObjects] = useState<any>([]);  
  const [selectedTab, setSelectedTab] = useState<AcioViewOptions>(AcioViewOptions.TAB1);

  const handleTabChange = (selectedIndex: number) => {
    setSelectedTab(tabData[selectedIndex]); // Convert index to enum value
  };

  // Function to find the index of the current selected enum in tabData
  const findTabIndex = (currentEnum: AcioViewOptions): number => {
    return tabData.indexOf(currentEnum);
  };

  const getLatestNode = useCallback((): NodeData | null => {
    if (!allNodeData.length) return null;
    const data = allNodeData.reduce((latestNode, currentNode) => {
      return currentNode.sequence > latestNode.sequence ? currentNode : latestNode;
    }, allNodeData[0]);
    return data;
  }, [allNodeData]);

  const viewNode = useCallback((nodeToSet: NodeData | null) => {
    if (nodeToSet) {
      let { text } = nodeToSet;
      setDisplayedNode({ ...nodeToSet, text });
    } else {
      setDisplayedNode(null);
    }
  }, []);

  const switchToLatestNode = () => {
    const latestNode = getLatestNode();
    setActiveNode(latestNode?.node);
    viewNode(latestNode);
  };

  async function openStream() {
    try {
      await fetch(`${"https://dev-eagle-ocio.linvest21.com"}/ocio/start/dynamic?model_name=GPT-4o`, { method: "POST" })
      .then(() => {
        setRunning(false);
        return new Promise(async (resolve, reject) => {
          await fetchEventSource(
            `${"https://dev-eagle-ocio.linvest21.com"}/ocio/events/static`,
            {
              onmessage(ev) {
                try {
                  let data: MermaidResponse = JSON.parse(ev.data);
                  setMermaidState(data);

                  const nodeDataArray: NodeData[] = [];
                  for (const node in data.node_outputs) {
                    nodeDataArray.push(...data.node_outputs[node]);
                  }
                  nodeDataArray.sort((a, b) => a.sequence - b.sequence);

                  setAllNodeData(nodeDataArray);

                  const latestNode = getLatestNode();
                  setActiveNode(latestNode?.node);
                  viewNode(latestNode);

                  const maxSeq = getMaxSequenceObj(data.node_outputs);
                  setMaxSequenceObj(maxSeq);
                  setStepIndex(maxSeq.sequence || 0);

                  data.mermaid_graph += `\n${maxSeq.node}:::active;\nclassDef active fill:#383C93,stroke:#333,stroke-width:2px,color:#fff;\nclassDef cluster fill:#fff,stroke:#000,stroke-width:2px,rx:0,ry:0,paddingTop:200px;\n`;
                  
                  setSavedMerState(prevState => (prevState ? [...prevState, data] : [data]));
                } catch (e) {
                  console.error(e);
                }
              },
              onerror(ev) {
                resolve(ev);
              },
              onclose() {
                resolve("");
              },
            }
          );
        });
      });
    } catch (e) {
      toast.error("Error Beginning Report");
    }
  }

  async function stop() {
    setRunning(true);
    await fetch(`${"https://dev-eagle-ocio.linvest21.com"}/ocio/stop/dynamic`, { method: "POST" });
  }

  function getMaxSequenceObj(response) {
    let maxSequenceObj;
    let maxSequence = -Infinity;

    for (const key in response) {
      if (response.hasOwnProperty(key)) {
        const itemsArray = response[key];
        if (Array.isArray(itemsArray)) {
          for (const item of itemsArray) {
            if (item.sequence > maxSequence) {
              maxSequence = item.sequence;
              maxSequenceObj = item;
            }
          }
        }
      }
    }

    return maxSequenceObj;
  }

  useEffect(() => {
    const maxSeq = getMaxSequenceObj(mermaidState?.node_outputs || {});
    setMaxSequenceObj(maxSeq);
  }, [stepIndex, mermaidState]);

  const handleClickNode = (nodeId: string) => {
    const filteredNodes = allNodeData.filter((node) => node.node === nodeId);
    const latestNodeOfGivenType = filteredNodes[filteredNodes.length - 1];
    viewNode(latestNodeOfGivenType);
    setActiveNode(nodeId);
  };

  useEffect(() => {
    const extractedSequenceObjects: any = [];
    for (const key in mermaidState) {
      if (mermaidState.hasOwnProperty(key)) {
        const value = mermaidState[key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item && item.sequence !== undefined) {
              extractedSequenceObjects.push(item);
            }
          });
        } else if (typeof value === "object" && value !== null) {
          for (const subKey in value) {
            if (value.hasOwnProperty(subKey)) {
              const subValue = value[subKey];
              if (Array.isArray(subValue)) {
                subValue.forEach((item) => {
                  if (item && item.sequence !== undefined) {
                    extractedSequenceObjects.push(item);
                  }
                });
              }
            }
          }
        }
      }
    }
    setSequenceObjects(extractedSequenceObjects);
  }, [mermaidState]);

  const renderIframe = () => {
    return <div className="fullscreen-container">
            <iframe
              className="fullscreen-iframe"
              src="http://localhost:5172"
              title="Acio Agent"
            ></iframe>
          </div>
          };

  const renderACIO = () => {
    return (
      <section style={{ width: '100%' }}>
        <h1 style={{ textAlign: 'left', paddingLeft: '3vw', margin: '1.5rem 0px' }}>
          Agentic CIO
        </h1>
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{ width: '40vw', margin: '1.5rem 0 0 0', marginRight: 'auto', marginLeft: 'auto' }}
            id="mermaidcomponenetimported"
          >
            {mermaidState?.mermaid_graph ? (
              <Mermaid config={MERMAID_CONFIG} chart={mermaidState?.mermaid_graph} />
            ) : (
              <Button
                onClick={openStream}
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  display: 'block',
                  position: 'relative',
                  top: '30vh',
                }}
                label="Generate"
              />
            )}
          </div>
          <section
            className="advisorReport"
            style={{
              width: '50vw',
              backgroundColor: '#dadada',
              padding: '1rem',
              height: '85vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
            }}
          >
            <aside
              style={{
                overflowY: mermaidState?.node_outputs?.macro_triggers_generate ? 'scroll' : '',
              }}
            >
              {mermaidState?.node_outputs?.macro_triggers_generate && !mermaidState.loading ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: sequenceObjects[(stepIndex && stepIndex - 1) || 0]?.text || '',
                  }}
                />
              ) : (
                <section
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                  }}
                >
                  <Skeleton variant="text" sx={{ fontSize: '10rem' }} />
                  <Skeleton variant="circular" width={70} height={70} />
                  <Skeleton variant="rectangular" width={700} height={150} />
                  <Skeleton variant="rounded" width={700} height={150} />
                </section>
              )}
            </aside>
            <div
              style={{
                display: 'flex',
                padding: '1rem',
                paddingLeft: '0',
                alignItems: 'center',
              }}
            >
              {mermaidState?.graph_built && (
                <>
                  {running ? (
                    <Button label="Generate" onClick={openStream} />
                  ) : (
                    <Button label="Stop" onClick={stop} />
                  )}
                </>
              )}
              <ImageComponent
                src="previous.svg"
                alt="previous-icon"
                onClick={() => (stepIndex && stepIndex >= 1 ? setStepIndex((prev) => prev! - 1) : null)}
              />
              <div>{stepIndex && stepIndex}</div>
              <ImageComponent
                src="next.svg"
                alt="next-icon"
                onClick={() =>
                  stepIndex && stepIndex <= sequenceObjects.length - 1 ? setStepIndex((prev) => prev! + 1) : null
                }
              />
            </div>
          </section>
        </div>
      </section>
    );
  };

  (window as any).clickNode = handleClickNode;

  const viewRenderer = (secState: AcioViewOptions) => {
    // switch (secState) {
    //   case AcioViewOptions.TAB1:
    //     return renderACIO();
    //   case AcioViewOptions.TAB2:
        return renderIframe();
    //   default:
    //     return null;
    // }
  };

  return (
    <ModalType
      style={{ padding: '0px', paddingTop:'2rem' }}
      buttonStyles={{ display: 'none' }}
      type={ModalTypeEnum.LARGE}
      open={acioModal}
      closeDialog={() => setAcioModal(false)}
    > 
      {/* <div style={{margin: '1rem 0 2rem 0'}} className="acio-modal-tabs">
          <Tabs selectedIndex={findTabIndex(selectedTab)} onChange={(tabInfo) => handleTabChange(tabInfo.selectedIndex)}>
            <TabList aria-label="Financial Data Tabs">
              {tabData.map((tab, index) => (
                <Tab key={index}>{tab}</Tab>
              ))}
            </TabList>
          </Tabs>
      </div> */}
      {/* <section style={{paddingTop:'1rem'}}> */}

      {viewRenderer(selectedTab)}
      {/* </section> */}
    </ModalType>
  );
};

export default AcioModal;
