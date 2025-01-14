// Desc : 특정 DOM 요소의 크기를 실시간으로 추적하기 위해 사용


import { useState, useEffect, useRef } from "react";

function useElementSize() {
  // `elementSize` 상태 : DOM 요소의 가로(`width`)와 세로(`height`) 크기를 저장 <- 초기값: { width: 0, height: 0 }
  const [elementSize, setElementSize] = useState({ width: 0, height: 0 });

  // 추적할 DOM 요소를 참조하기 위한 `ref` 객체
  const elementRef = useRef(null);

  useEffect(() => {
    // ResizeObserver가 호출될 때 실행되는 콜백 함수
    const updateSize = (entries) => {
      if (entries[0].contentRect) {
        const { width, height } = entries[0].contentRect;

        // 요소의 가로와 세로 크기를 상태로 업데이트
        setElementSize({ width, height });
      }
    };

    // 요소 크기 변화를 관찰하는 브라우저 API
    const resizeObserver = new ResizeObserver(updateSize);

    // 참조된 DOM 요소가 존재하는지 확인
    if (elementRef.current) {
      // ResizeObserver를 사용해 해당 요소 크기를 관찰 시작
      resizeObserver.observe(elementRef.current);
    }

    return () => {
      // 클린업 함수 : ResizeObserver 연결 해제 (메모리 누수 방지)
      resizeObserver.disconnect();
    };
  }, []);

  return [elementSize, elementRef];
}
export default useElementSize;
