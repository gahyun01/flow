import { NodeTypes, addNewEdge, addNewNode } from "@/flowbuilder/Utils";
import _ from "lodash";
import { useReactFlow } from "reactflow";

function useUpdateNode() {
  const { setNodes, setEdges } = useReactFlow();

  const handleSubmitNode = (data, currentNode) => {
    // ReactFlow의 setNodes와 setEdges를 가져옴 ( 노드와 엣지 상태를 업데이트하는 함수 )
    if (currentNode.type === NodeTypes.Condition) {
      // 전달받은 데이터에서 조건 ( condition ) 목록 추출
      const { conditions } = data;

      // 조건 목록 중 target이 없는 조건을 추출
      const creatableNew = conditions.filter(
        (condition) => condition.target === undefined
      );

      // 새로운 노드를 저장할 배열 초기화
      const newNode = [];

      creatableNew
        .filter((item) => !item.step.id)
        .forEach((node) => {
          newNode.push(
            addNewNode(
              { type: NodeTypes.StepNode, label: "Input" },
              currentNode
            )
          );
        });

      setNodes((nodes) => {
        const clonedNodes = [...nodes];
        const maped = clonedNodes.map((item) => {
          if (currentNode.id === item.id) {
            item.data.description = data?.description ?? "";
            item.data.gotoStep = data?.gotoStep ?? "";
            item.data.conditions = data?.conditions ?? [];
            return item;
          }
          return item;
        });

        const newEmbeddedNode = [...maped, ...newNode];
        return newEmbeddedNode;
      });

      setEdges((edges) => {
        const clonededges = [...edges];

        const newEdge = creatableNew?.map((item, index) =>
          addNewEdge(
            currentNode.id,
            item?.step?.id ? item?.step?.id : newNode[index].id,
            "custom",
            item.value
          )
        );
        const newUpdatedEdges = [...clonededges, ...newEdge];
        let uniqueArray = _.uniqBy(newUpdatedEdges, "id");

        conditions.forEach((item) => {
          const index = uniqueArray.findIndex((edge) => edge.id === item.id);
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

        return uniqueArray;
      });
    } else {
      setNodes((nodes) => {
        const clonedNodes = [...nodes];
        const maped = clonedNodes.map((item) => {
          if (currentNode.id === item.id) {
            item.data.description = data?.description ?? "";
            item.data.gotoStep = data?.gotoStep ?? "";
            item.data.conditions = data?.conditions ?? [];
            return item;
          }
          return item;
        });
        return maped;
      });
    }
  };
  return { handleSubmitNode };
}

export default useUpdateNode;
