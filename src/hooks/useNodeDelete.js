// 그래프에서 노드를 삭제하는 기능을 담당하는 커스텀 훅


import _ from "lodash";
import { getOutgoers, useReactFlow } from "reactflow";
import {
  NodeTypes,
  checkduplicity,
  removeSimilarById,
} from "../flowbuilder/Utils";

function useNodeDelete() {
  const { setNodes, setEdges, getEdges, getNodes } = useReactFlow();
  const nodesOrigin = getNodes();
  const edges = getEdges();

  // 노드를 삭제하는 함수
  const handleDelete = (deleteId) => {
    // 삭제하려는 노드 찾아오기
    const currentNode = nodesOrigin.find((item) => item.id === deleteId); // 삭제하려는 노드 찾아오기

    // 조건 노드일 경우, 해당 조건 노드의 하위 노드들을 삭제
    if (currentNode?.type === NodeTypes.Condition) {
      // 조건 노드에 연결된 하위 노드들 가져오기
      const azimData = removeTreeOfOutgoers(currentNode);
      // 하위 노드 중 중복된 노드 제거
      const checkDuplic = checkduplicity(azimData.flat());
      
      setNodes((nodes) => {
        const nodesCopy = [...nodes]; // 노드 배열 복제

        // 중복된 노드를 제거한 새로운 노드 배열 생성
        const combinedArray = removeSimilarById(nodesCopy, checkDuplic);

        // 노드 배열 업데이트
        const newNodes = [...combinedArray];

        return newNodes;
      });
      setEdges((edges) => {
        const clonedEdges = [...edges]; // 엣지 배열 복제
        
        // 조건 노드에 연결된 엣지들 가져오기

        // 조건 노드에 연결된 엣지들 중 하위 노드로 연결된 엣지들
        const incomingEdges = edges.filter((x) => x.target === deleteId);

        // 조건 노드에 연결된 엣지들 중 상위 노드로 연결된 엣지들
        const outgoingEdges = edges.filter((x) => x.source === deleteId);
        
        // 조건 노드에 연결된 엣지들을 제외한 새로운 엣지 배열 생성
        const filteredEdges = clonedEdges.filter(
          (x) =>
            x.target !== incomingEdges[0]?.target &&
            x.source !== outgoingEdges[0]?.source
        );
        return filteredEdges;
      });
    } 
    
    // 조건 노드가 아닐 경우, 해당 노드만 삭제
    else {
      setNodes((nodes) => {
        const clonedNodes = [...nodes];
        const maped = clonedNodes.filter((item) => item.id !== deleteId);
        return maped;
      });

      setEdges((edges) => {
        const clonedEdges = [...edges];
        const incomingEdges = edges.filter((x) => x.target === deleteId);
        const outgoingEdges = edges.filter((x) => x.source === deleteId);

        // 삭제할 노드에 연결된 엣지 필터링
        const filteredEdges = clonedEdges.filter(
          (x) =>
            x.target !== incomingEdges[0]?.target &&
            x.source !== outgoingEdges[0]?.source
        );
        return filteredEdges;
      });
    }
  };

  let storedData = [];
  function removeTreeOfOutgoers(newNode) {
    // 새로운 노드에서 나가는 엣지들 가져오기
    const outgoers = getOutgoers(newNode, nodesOrigin, edges);
    // 나가는 엣지들과 함께 저장
    storedData.push([...outgoers, newNode]);

    // 나가는 엣지가 있으면, 하위 노드들까지 재귀적으로 가져옴
    if (outgoers.length) {
      outgoers.forEach((outgoer) => removeTreeOfOutgoers(outgoer));
    }
    // 나가는 엣지들과 관련된 노드들 반환
    return storedData;
  }

  return { handleDelete };
}

export default useNodeDelete;
