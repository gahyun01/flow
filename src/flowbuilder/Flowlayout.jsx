// Desc : FlowBuilder에서 사용되는 노드 컴포넌트 중 하나로, 노드의 레이아웃을 정의하고 삭제 버튼을 포함한 UI를 렌더링

// 클라이언트에서만 실행되는 React 컴포넌트임을 명시
// "use client";

import useNodeDelete from "@/hooks/useNodeDelete";
import LabelRenderer from "./NodeHelper/LabelRenderer";
import { TrashIcon } from "@heroicons/react/24/outline";  // 삭제 아이콘
import { NodeTypes } from "./Utils";  // 노드의 유형을 정의한 유틸리티 상수
import Image from "next/image";

const Flowlayout = (props) => {
  const { handleDelete } = useNodeDelete();   // useNodeDelete 커스텀 훅을 사용하여 handleDelete 함수를 가져옴
  const { data, selected } = props.nodeData;  // props에서 전달된 노드 데이터와 선택 상태를 구조 분해 할당

  // 아이콘 동적 렌더링
  const getImageSrc = (type) => {
    switch (type) {
      case NodeTypes.startNode: // NodeTypes가 startNode인 경우
        return "/icons/start.png";
      case NodeTypes.InputNode: // NodeTypes가 inputNode인 경우
        return "/icons/input.png";
      case NodeTypes.Condition: // NodeTypes가 condition인 경우
        return "/icons/condition.png";
      case NodeTypes.End: // NodeTypes가 end인 경우
        return "/icons/end.png";
      default: // 기본값 (이미지가 없는 경우)
        return "/icons/default.png";
    }
  };

  // PopoverHandler 컴포넌트: 삭제 버튼을 포함한 UI를 렌더링
  const PopoverHandler = () => {
    return (
      <>
        <>
          {/* 조건에 따라 TrashIcon(휴지통 아이콘) 표시 */}
          {props.nodeData.type !== NodeTypes.startNode ? (  // 노드가 startNode 타입이 아닌 경우
            <span
              className="nopan nodrag cursor-pointer" // 커서 스타일 추가 및 특정 기능 제한 클래스
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(props.nodeData.id);
                // props.nodeData.id === state.nodeSideBarOpen.activeId &&
              }}
            >
              <TrashIcon className="w-5 h-5 mr-4 text-black hover:text-blue-500" />
            </span>
          ) : (
            <span className="nopan nodrag" style={{ visibility: "hidden" }}>
              a {/* startNode인 경우 삭제 버튼을 숨김 */}
            </span>
          )}
        </>
      </>
    );
  };

  // Flowlayout 컴포넌트의 전체 UI를 렌더링
  return (
      <div
        style={{
          width: data?.width,
          height: data?.height,
        }}
        className={` flex justify-between items-center shadow-md min-h-[70px] w-[360px] relative bg-white text-black rounded-[10px] border-solid border border-[rgba(17, 24, 39, 0.10)] ${
          selected && "border border-[#6039DB] z-50"  // 노드가 선택된 경우 스타일 적용
        }`}
      >
        {/* LabelRenderer 컴포넌트와 PopoverHandler 컴포넌트 렌더링 */}
        <Image
        src={getImageSrc(props.nodeData.type)} // 동적으로 이미지 경로 결정
        alt={props.nodeData.type}
        width={32}
        height={32}
        className="w-8 h-8 ml-4"
      />
        <LabelRenderer props={props} data={data} /> {/* 노드 라벨 표시 */}
        <PopoverHandler />  {/* 삭제 버튼 포함 UI */}
      </div>
  );
};
export default Flowlayout;