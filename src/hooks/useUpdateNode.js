//특정 노드와 엣지를 업데이트하거나 추가하는 역할


import { NodeTypes, addNewEdge, addNewNode } from "@/flowbuilder/Utils";
import _ from "lodash";
import { useReactFlow } from "reactflow";

function useUpdateNode() {
  // ReactFlow에서 제공하는 setNodes와 setEdges 가져오기 (노드와 엣지 상태 업데이트용 함수)
  const { setNodes, setEdges } = useReactFlow();

  // 노드를 업데이트하는 함수 정의
  const handleSubmitNode = (data, currentNode) => {

    // 현재 노드의 타입이 "Condition"인 경우
    if (currentNode.type === NodeTypes.Condition) {
      const { conditions } = data;

      // 새로 생성할 노드를 위한 조건 필터링 ( target이 정의되지 않은 경우 )
      const creatableNew = conditions.filter(
        (condition) => condition.target === undefined
      );

      const newNode = [];// 새로 추가될 노드를 저장할 배열

      // 조건 중에서 step ID가 없는 항목에 대해
      creatableNew
        .filter((item) => !item.step.id)  // step ID가 없는 조건만 필터링
        .forEach((node) => {
          // 새로운 노드를 생성하여 newNode 배열에 추가
          // newNode.push(
          //   addNewNode(
          //     { type: NodeTypes.StepNode, label: "Input" }, // StepNode 타입으로 노드 생성
          //     currentNode // 현재 노드를 부모 노드로 설정
          //   )
          // );

          alert("노드를 생성해주세요.")
        });

      // 기존 노드 상태 업데이트
      setNodes((nodes) => {
        const clonedNodes = [...nodes]; // 기존 노드 배열 복사

        // 현재 노드를 찾아 데이터 업데이트
        const maped = clonedNodes.map((item) => {
          if (currentNode.id === item.id) {
            item.data.description = data?.description ?? ""; // 새 설명 추가
            item.data.gotoStep = data?.gotoStep ?? ""; // 이동할 스텝 정보 추가
            item.data.conditions = data?.conditions ?? []; // 조건 정보 추가
            return item; // 업데이트된 노드 반환
          }
          return item; // 다른 노드는 그대로 반환
        });

        // 기존 노드 배열에 새로 생성된 노드 추가
        const newEmbeddedNode = [...maped, ...newNode];
        return newEmbeddedNode; // 업데이트된 노드 배열 반환
      });

      // 엣지 상태 업데이트
      setEdges((edges) => {
        const clonededges = [...edges]; // 기존 엣지 배열 복사

        // 새로운 엣지 생성
        const newEdge = creatableNew?.map((item, index) =>
          addNewEdge(
            currentNode.id, // 소스 노드 ID
            item?.step?.id ? item?.step?.id : newNode[index].id, // 타겟 노드 ID (새 노드 ID 사용)
            "custom", // 엣지 타입
            item.value // 엣지의 조건 값
          )
        );

        // 기존 엣지 배열에 새 엣지 추가
        const newUpdatedEdges = [...clonededges, ...newEdge];
        let uniqueArray = _.uniqBy(newUpdatedEdges, "id");  // 중복 엣지 제거 (ID 기준)

        // 기존 조건 데이터로 엣지를 업데이트
        conditions.forEach((item) => {
          const index = uniqueArray.findIndex((edge) => edge.id === item.id);  // 조건 ID에 해당하는 엣지 찾기
          if (index !== -1) {
            uniqueArray[index] = {
              ...uniqueArray[index],
              data: {
                id: item.id,
                condition: item.value,
                step: item.step,
              },
              target: item?.step?.id
                ? item?.step?.id
                : uniqueArray[index].target,
            };
          }
        });

        return uniqueArray; // 업데이트된 엣지 배열 반환
      });
    } 

    // 현재 노드의 타입이 "Condition"이 아닌 경우 처리
    else {
      setNodes((nodes) => {
        const clonedNodes = [...nodes]; // 기존 노드 배열 복사
        // 현재 노드를 찾아 데이터 업데이트
        const maped = clonedNodes.map((item) => {
          if (currentNode.id === item.id) {
            item.data.description = data?.description ?? ""; // 새 설명 추가
            item.data.gotoStep = data?.gotoStep ?? ""; // 이동할 스텝 정보 추가
            item.data.conditions = data?.conditions ?? []; // 조건 정보 추가
            return item; // 업데이트된 노드 반환
          }
          return item; // 다른 노드는 그대로 반환
        });
        return maped; // 업데이트된 노드 배열 반환
      });
    }
  };
  return { handleSubmitNode };
}

export default useUpdateNode;
