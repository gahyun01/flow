// Desc : 그래프에서 Edge ( 노드 간의 연결선 ) 를 업데이트하는 기능을 제공하는 커스텀 훅


import _ from "lodash";
import { useReactFlow } from "reactflow";

function useUpdateEdge() {
  // 현재 그래프의 Edge ( 연결선 ) 를 업데이트하는 함수
  const { setEdges } = useReactFlow();

  // Edge 업데이트를 처리하는 함수 정의
  const handleSubmitEdge = (data, currentNode) => {
    setEdges((edges) => {
      // Edge 배열을 복제하여 새로운 Edge 배열을 생성
      // ( 불변성을 유지하기 위해 새로운 배열 생성 )
      const clonededges = [...edges];

      // Edge 배열을 순회하며 현재 선택된 노드의 ID와 일치하는 Edge를 찾아 업데이트
      const maped = clonededges.map((item) => {

        // Edge의 source 노드와 target 노드가 현재 선택된 노드와 일치하는 경우
        if (currentNode.id === item.id) {
          // description이 없으면 빈 문자열을 설정
          item.data.condition = data.description ?? "";
          return item;
        }
        return item;
      });
      // 업데이트된 Edge 배열 반환
      return maped;
    });
  };

  return { handleSubmitEdge };
}

export default useUpdateEdge;
