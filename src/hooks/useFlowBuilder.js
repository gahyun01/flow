// Desc : 그래프와 노드를 생성하고, 노드를 클릭했을 때의 이벤트를 처리하는 커스텀 훅


import _ from "lodash";
import { useMemo, useState } from "react";
import { getConnectedEdges, getIncomers, useReactFlow } from "reactflow";
import {
  EdgeTypes,
  NodeTypes,
  addEmptyNode,
  addNewEdge,
  addNewFlowNode,
  addNewNode,
} from "../flowbuilder/Utils";
import InputNode from "../flowbuilder/InputNode";
import StepNode from "../flowbuilder/StepNode";
import ConditionNode from "../flowbuilder/ConditionNode";
import StartNode from "../flowbuilder/StartNode";
import EndNode from "../flowbuilder/EndNode";
import BridgeEdge from "../flowbuilder/BridgeEdge";
import CustomEdge from "../flowbuilder/CustomEdge";


import FlowNode from "../flowbuilder/FlowNode";

function useFlowBuilder() {
  const { setNodes, setEdges, getNodes, getNode, getEdges } = useReactFlow();

  const nodes = getNodes();
  const edges = getEdges();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentEdge, setCurrentEdge] = useState({});
  const [currentNode, setCurrentNode] = useState({});
  const [currentSideData, setCurrentSideData] = useState({}); // 사이드 데이터 상태

  // 사용 가능한 노드 유형을 설정 ( memoized로 최적화 )
  const nodeTypes = useMemo(
    () => ({
      InputNode: InputNode,
      StepNode: StepNode,
      Condition: ConditionNode,
      startNode: StartNode,
      FlowNode: FlowNode,
      EndNode: EndNode,
    }),
    []
  );

  // 사용 가능한 엣지 유형을 설정 ( memoized로 최적화 )
  const edgeTypes = useMemo(
    () => ({
      bridge: BridgeEdge,
      custom: CustomEdge,
    }),
    []
  );

  // 함수는 특정 노드에 대해 동작을 처리하는 함수
  const stepActionHandle = (item) => {

    // 현재 선택된 노드를 배열로 감싸서 처리
    const currentClickedNode = new Array(currentNode);
    // 새로운 노드를 추가하는 유틸리티 함수
    const getNewNode = addNewNode(item, currentNode);
    // 새로운 빈 노드를 추가하는 유틸리티 함수
    const getNewEmptyNode = addEmptyNode(item, currentNode);
    // 현재 노드와 연결된 엣지들 가져오기
    const connectedEdge = getConnectedEdges(currentClickedNode, edges);
    // 현재 노드로 들어오는 노드들 가져오기
    const getIcomingNodes = getIncomers(currentNode, nodes, edges);

    // 연결된 엣지가 여러 개 있을 때
    if (connectedEdge.length > 1) {
      if (
        getIcomingNodes[0].type === NodeTypes.Condition ||
        getIcomingNodes[0].type === NodeTypes.startNode ||
        getIcomingNodes[0].type === NodeTypes.StepNode
      ) {
        // 새로운 플로트 노드를 추가
        const getNewFlowNode = addNewFlowNode(currentNode);
        setNodes((nodes) => {
          const newCopy = [...nodes];
          const nodesCopy = newCopy.filter(
            // 현재 노드는 제외하고 새로운 노드 추가
            (item) => item.id !== currentNode.id
          );
          const newNodes =
            getNewNode.type === NodeTypes.End
              ? [...nodesCopy, getNewNode]  // End 타입이면 새로운 노드만 추가
              : [...nodesCopy, getNewNode, getNewFlowNode]; // 그 외에는 플로트 노드도 함께 추가
          return newNodes;
        });

        // 이전 노드 가져오기
        const prevNode = getNode(connectedEdge[0]?.source);
        // 연결된 엣지 복제
        const standAloneEdge = _.cloneDeep(connectedEdge[0]);
        // 엣지의 타겟을 새로운 노드로 설정
        standAloneEdge.target = getNewNode.id;
        // 엣지의 소스를 이전 노드로 설정
        standAloneEdge.source = prevNode.id;

        // 조건에 따라 엣지 타입 설정
        standAloneEdge.type = connectedEdge[0]?.data?.condition
          ? EdgeTypes.custom
          : EdgeTypes.bridge;
        
        // 조건 데이터 설정
        standAloneEdge.data.condition = connectedEdge[0]?.data?.condition ?? "";
        // 조건 아이콘 설정
        standAloneEdge.data.icon = connectedEdge[0]?.data?.condition
          ? true
          : false;
        setEdges((edges) => {
          const edgesCopy = edges.filter(
            // 기존 엣지 중 삭제할 엣지 제외
            (item) => item.id !== connectedEdge[0].id
          );

          // 새로운 플로트 엣지 추가
          const newlyFlowEdge = addNewEdge(
            getNewNode.id,
            getNewFlowNode.id,
            "default"
          );

          // 새로운 엣지 배열에 추가
          edgesCopy.push(newlyFlowEdge);
          // 복제한 엣지 배열에 추가
          edgesCopy.push(standAloneEdge);
          return edgesCopy;
        });
      } else {
        const getNewFlowNode = addNewFlowNode();
        setNodes((nodes) => {
          const newCopy = [...nodes];
          const nodesCopy = newCopy.filter(
            (item) => item.id !== currentNode.id
          );
          const newNodes = [...nodesCopy, getNewNode];
          return newNodes;
        });
        const prevNode = getNode(connectedEdge[0]?.source);
        // Edges actions or update
        const standAloneEdge = _.cloneDeep(connectedEdge[0]);
        standAloneEdge.target = getNewTimerNode.id;
        standAloneEdge.source = prevNode.id;
        standAloneEdge.type = connectedEdge[0]?.data?.condition
          ? EdgeTypes.custom
          : EdgeTypes.bridge;
        standAloneEdge.data.condition = connectedEdge[0]?.data?.condition ?? "";
        standAloneEdge.data.icon = connectedEdge[0]?.data?.condition
          ? true
          : false;
        setEdges((edges) => {
          const edgesCopy = edges.filter(
            (item) => item.id !== connectedEdge[0].id
          );
          const newlyBindedTimerEdge = addNewEdge(
            getNewTimerNode.id,
            getNewNode.id,
            "default"
          );
          const newlyFlowEdge = addNewEdge(
            getNewNode.id,
            getNewFlowNode.id,
            "default"
          );
          edgesCopy.push(newlyFlowEdge);
          edgesCopy.push(standAloneEdge);
          edgesCopy.push(newlyBindedTimerEdge);
          return edgesCopy;
        });
        // fitView({ duration: 300 });
      }
    } else {
      setNodes((nodes) => {
        const newCopy = [...nodes];
        const newNodes = [...newCopy, getNewEmptyNode];
        return newNodes;
      });
    }
    setIsModalOpen(false);
    setCurrentEdge({});
    setCurrentNode({});
  };
  return {
    isModalOpen,
    currentEdge,
    currentNode,
    currentSideData,
    nodeTypes,
    edgeTypes,
    stepActionHandle,
    setCurrentNode,
    setCurrentEdge,
    setIsModalOpen,
    setCurrentSideData,
  };
}

export default useFlowBuilder;
