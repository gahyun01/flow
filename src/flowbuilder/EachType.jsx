// 단일 항목(item)의 정보를 화면에 렌더링하는 컴포넌트
// item 데이터에서 label 값 표지 && 클릭 이벤트를 처리


const EachType = (props) => {
  const { item, actionHandle } = props;
  const { label } = item;
  return (
    // 클릭 이벤트가 발생하면 actionHandle 함수를 호출하며 현재 item을 전달
    <div
      className="w-[350px] h-[80] p-[16px] bg-white rounded-lg border border-gray-300 flex items-center gap-4 cursor-pointer"
      onClick={() => actionHandle(item)}
    >
      {/* 라벨을 표시하는 부분 */}
      <div className="w-[151px] text-black text-center text-base font-inter font-normal break-words">
        {label}
      </div>
    </div>
  );
};

export default EachType;
