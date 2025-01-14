// Desc : DOM 요소 ( ref ) 밖에서 사용자가 클릭하면, 지정된 콜백 함수 ( callback ) 를 실행


import { useEffect, useRef } from "react";

const useClickAwayListen = (ref, callback) => {
  // ref: 특정 DOM 요소를 참조하는 객체
  // callback: 클릭 이벤트가 해당 요소 외부에서 발생했을 때 실행할 함수

  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      // ref.current: 참조된 DOM 요소가 존재하는지 확인
      // contains: 클릭된 요소가 참조된 DOM 요소 내부에 포함되지 않을 경우 true 반환
      callback();
    }
  };

  useEffect(() => {
    // 전역적으로 클릭 이벤트 리스너 등록
    document.addEventListener("click", handleClick);

    // 컴포넌트가 언마운트되거나 의존성이 변경될 때 실행
    return () => {
      // 등록된 이벤트 리스너 제거
      document.removeEventListener("click", handleClick);
    };

     // 의존성 배열 : ref와 callback이 변경될 때마다 useEffect 다시 실행
  }, [ref, callback]);
};

export default useClickAwayListen;
