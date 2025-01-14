import { getOutgoers, useReactFlow } from "reactflow";

function useDeleteConditionEdge() {
  const { setNodes, setEdges, getEdges, getNodes } = useReactFlow();
  const edges = getEdges();

  const handleDeleteConditionEdge = (target) => {
    setEdges((edges) => {
      const clonedEdges = [...edges]; // 엣지 배열 복제
      const filteredEdges = clonedEdges.filter(
        (x) => x.target !== target
      );
      console.log("filteredEdges:", filteredEdges);
      return filteredEdges;
    })
  };
  return { handleDeleteConditionEdge };
}

export default useDeleteConditionEdge;
