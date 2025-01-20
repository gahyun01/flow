// 사용자 정의 엣지(연결선)를 렌더링하기 위함


import React from "react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "reactflow";

// BridgeEdge 컴포넌트 정의
const BridgeEdge = ({
  sourceX, // 엣지의 시작점 X 좌표
  sourceY, // 엣지의 시작점 Y 좌표
  targetX, // 엣지의 끝점 X 좌표
  targetY, // 엣지의 끝점 Y 좌표
  sourcePosition, // 엣지의 시작점 위치 정보 (예: 상단, 하단, 왼쪽, 오른쪽)
  targetPosition, // 엣지의 끝점 위치 정보 (예: 상단, 하단, 왼쪽, 오른쪽)
  style = {}, // 엣지 스타일 (기본값은 빈 객체)
  markerEnd, // 엣지 끝의 마커 (화살표 등 시각적 효과)
}) => {

  // getBezierPath 함수로 베지어 곡선 경로 계산
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, // 시작점 X 좌표
    sourceY, // 시작점 Y 좌표
    sourcePosition, // 시작점 위치 정보
    targetX, // 끝점 X 좌표
    targetY, // 끝점 Y 좌표
    targetPosition, // 끝점 위치 정보
  });

  return (
    <>
      {/* BaseEdge 컴포넌트를 사용하여 베지어 곡선 그림 */}
      <BaseEdge
        path={edgePath} // 계산된 베지어 경로 설정
        markerEnd={markerEnd} // 엣지 끝에 마커 추가
        style={{ stroke: "black", strokeWidth: "1" }} // 기본 스타일 (검은색 선, 두께 1)
      />

      {/* EdgeLabelRenderer를 사용하여 엣지 라벨을 렌더링 */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute", // 라벨 위치를 절대 위치로 설정
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`, // 라벨의 중앙 정렬 및 위치 조정
            fontSize: 12, // 폰트 크기 설정
            pointerEvents: "all", // 마우스 이벤트가 라벨에 적용되도록 설정
          }}
          className="nodrag nopan" // 드래그 및 팬 동작 방지 클래스
        ></div>
      </EdgeLabelRenderer>
    </>
  );
};
export default BridgeEdge;
