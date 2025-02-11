import React, { Fragment, useEffect, useState } from "react";
import SideBarTopPortion from "./SideBarTopPortion";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

// 화면 전환 애니메이션
import { Transition } from "@headlessui/react";

// 노드 업데이트 훅
import useUpdateNode from "@/hooks/useUpdateNode";

// 고유 아이디 생성 함수
import { nanoid } from "nanoid";

// 자동 완성 컴포넌트
import AutoComplete from "./AutoComplete";

import { Button } from "@/components/button";
import { NodeTypes } from "../Utils";
import { getConnectedEdges, useReactFlow } from "reactflow";
import useUpdateEdge from "@/hooks/useUpdateEdge";
import useDeleteConditionEdge from "@/hooks/useDeleteConditionEdge";
import { add } from "lodash";


// 사이드바 컴포넌트 정의 ( 필요한 props 전달받음 )
const SideBar = ({ sideBarOpen, currentSideData, setOpenSidebar }) => {
  // React Flow에서 노드와 엣지를 가져오는 훅
  const { getNodes, getEdges } = useReactFlow();

  // 현재 노드 목록에서 시작 노드와 FlowNode를 제외한 노드들만 필터링
  const allNodes = getNodes();
  const except = allNodes.filter((item) => item.type !== NodeTypes.startNode);
  const exceptFlow = except.filter(
    (item) => item.type !== NodeTypes.FlowNode
  );
  const FinalNode = exceptFlow.filter(
    (item) => item.id !== currentSideData.id
  );

  // 필터링된 노드 목록에서 각 노드의 description과 id만 추출
  const renderNodes = FinalNode.map((item) => ({
    node: item.data.description,
    id: item.id,
  }));

  // 입력 추가 함수 ( 새로운 입력 필드를 추가 )
  const addInput = () => {
    append({ id: nanoid(8), value: "", step: "" });
  };

  const initialDefault = {
    description: "",  // 기본값 ( 설명 )
    gotoStep: "",  // 기본값 ( 이동할 단계 )
  };

  // 상태 초기화
  const [defaultValues, setdefaultValues] = useState(initialDefault);
  const [inputNodes, setInputNodes] = useState([]);
  const [activeIdx, setActiveIdx] = useState();
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);
  const [selectedSubItem, setSelectedSubItem] = useState("");

  // 드롭다운 더미데이터
  const adminMenu = [
    { idx: 1, name: "Sample 1", subMenu: [{ name: "Sample 1-1" }, { name: "Sample 1-2" }] },
    { idx: 2, name: "Sample 2", subMenu: [{ name: "Sample 2-1" }] },
    { idx: 3, name: "FCTI", subMenu: [{ name: "get email info" }, { name: "delete table" }, { name: "get ip info" }, {name: "get domain info" }, {name: "get domain info" }, {name: "get file info" }] },
  ];

  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
    reset,
    setValue,  // 🔹 setValue 추가
  } = useForm({
    defaultValues,  // 기본값 설정
    mode: "onChange",  // 변경 시마다 폼 상태를 업데이트
  }); 

  const { handleSubmitNode } = useUpdateNode();  // 노드 업데이트 훅
  const { handleSubmitEdge } = useUpdateEdge();  // 엣지 업데이트 훅

  // 현재 노드와 연결된 엣지 목록을 필터링
  const edges = getConnectedEdges([currentSideData], getEdges()).filter(
    (item) => item.source !== "start-node" && item.source === currentSideData.id
  );

  const { handleDeleteConditionEdge } = useDeleteConditionEdge();
  const handleRemoveCondition = (index, item) => {
    remove(index);  // 조건 삭제
    handleDeleteConditionEdge(item.target);  // 엣지 삭제
  };

  // 입력 노드의 key-value 상태에 추가
  const handleSave = () => {
    // 각 key, value 필드에서 입력된 값을 가져와서 상태에 저장
    const finalKeyValuePairs = fields.map((item, index) => {
      // 각 입력 필드에서 key 값을 가져옴
      const key = document.getElementById(`key.${index}.value`).value;
      // 각 입력 필드에서 value 값을 가져옴
      const value = document.getElementById(`value.${index}.value`).value;

      // key와 value를 객체로 반환
      return { key, value };
    });
    console.log("finalKeyValuePairs", finalKeyValuePairs);
    addKeyValuePair(item.id, finalKeyValuePairs);  // key-value 쌍 추가
  };

  // key-value 쌍을 추가하는 함수
  const addKeyValuePair = (finalKeyValuePairs) => {
    setInputNodes((prev) => {
      // prev가 배열인지 확인하고, 배열이 아닐 경우 빈 배열로 초기화
      const currentNodes = Array.isArray(prev) ? prev : [];
  
      // finalKeyValuePairs 배열을 순회하면서 각 항목을 처리
      const updatedInput = [...currentNodes]; // 기존 노드를 복사
  
      finalKeyValuePairs.forEach(({ nodeId, key, value }) => {
        // console.log("nodeId", nodeId);
        console.log("key", key);
        console.log("value", value);
        // nodeId가 이미 존재하는지 확인
        const existingNodeIndex = updatedInput.findIndex((node) => node.id === nodeId);
  
        if (existingNodeIndex === -1) {
          // 노드가 존재하지 않는 경우 새 노드 추가
          updatedInput.push({
            id: nodeId,
            keyValuePairs: [{ key, value }], // 새 노드에 key-value 추가
          });
        } else {
          // 노드가 존재하는 경우 해당 노드의 keyValuePairs에 추가
          updatedInput[existingNodeIndex].keyValuePairs = [
            ...updatedInput[existingNodeIndex].keyValuePairs,
            { key, value },
          ];
        }
      });
      console("updatedInput", updatedInput);
      return updatedInput;
    });
  };

  const AdminMenu = ({ menuItem, idx, activeIdx, active, setActiveIdx, subMenu }) => {
    return (
      <>
        <div
          className=" w-[300px] h-[65px] bg-[#FCFCFC] border-[1px] border-black rounded-lg flex justify-center items-center cursor-pointer hover:bg-blue-gray-50 transition-all"
          onClick={() => {
            setActiveIdx(idx);  
          }}
        >
          {menuItem}
        </div>
        <div
          className={`${active ? "visibile" : "invisible"} ${
            active && subMenu.length > 0 ? "h-[100px]" : "h-0"
          } transition-all duration-300`}
        >
          {active &&
            subMenu.map((submenu, index) => {
              return (
                <div
                  key={index}
                  className="w-[300px] h-[50px] bg-white flex justify-center items-center cursor-pointer hover:bg-blue-gray-50 transition-all"
                >
                  {submenu.name}
                </div>
              );
            })}
        </div>
      </>
    );
  };
   

  // 입력 필드 삭제 함수
  // const removeKeyValuePair = (nodeId, index) => {
  //   setInputNodes((prev) =>
  //     prev.map((node) => {
  //       if (node.id === nodeId) {
  //         const updatedKeyValuePairs = node.keyValuePairs.filter(
  //           (_, idx) => idx !== index
  //         );
  //         return { ...node, keyValuePairs: updatedKeyValuePairs };
  //       }
  //       return node;
  //     })
  //   );
  // };

  useEffect(() => {
    if (currentSideData) {
      setdefaultValues((prev) => ({
        ...prev,
        description:
          currentSideData?.data?.description ||
          currentSideData?.data?.condition,
        gotoStep: currentSideData?.data?.gotoStep,
        conditions: edges.map((item) => {
          const step = FinalNode.find((i) => i.id === item.target).data;
          return {
            id: item.id,
            value: item.data.condition,
            step: { id: item.target, node: step.description },
            target: item.target,
          };
        }),
      }));
    }
  }, [currentSideData]);  // currentSideData가 변경될 때마다 실행

  useEffect(() => {
    reset(defaultValues);  // 폼을 defaultValues로 리셋
  }, [reset, defaultValues]);

    // step
    useEffect(() => {
      if (selectedSubItem) {
        setValue("description", selectedSubItem); // 선택한 하위 요소를 입력 필드에 반영
      }
    }, [selectedSubItem, setValue]);

  // 조건 필드 추가, 제거, 수정 등을 처리하는 훅
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: "conditions",  // 조건 배열을 위한 필드
  });

  console.log(fields)
  // 폼 제출 처리
  const onSubmit = async (data) => {
    if (currentSideData.source) {
      handleSubmitEdge(data, currentSideData);  // 엣지 업데이트
    } else {
      handleSubmitNode(data, currentSideData);  // 노드 업데이트
    }
    reset();  // 폼 리셋
    setOpenSidebar(false);  // 사이드바 닫기
  };

  return (
    // 화면 전환 효과 (사이드바 애니메이션)
    <Transition appear show={sideBarOpen} as={Fragment}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div
          style={{
            width: sideBarOpen ? "40%" : "0%",  // 사이드바가 열릴 때 너비 설정
            overflow: "auto",  // 내용이 넘칠 경우 스크롤 처리
          }}
          className="sidebarWrapper shadow-lg"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <div className="p-4">

              {/* 사이드바 상단 부분 렌더링 */}
              <SideBarTopPortion item={currentSideData} />
              <div className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor=""
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none text-black select-none"
                  >
                    {/* 현재 노드 타입 표시 */}
                    {`Type : ${currentSideData.type}`}
                  </label>
                </div>

                {/* 클릭한 노드 타입에 따라 다른 폼을 렌더링 */}               
                {currentSideData.type === NodeTypes.startNode ||
                currentSideData.type === NodeTypes.End ? (
                  // 시작 노드 || 끝 노드
                  <div className="space-y-2">
                    <label htmlFor="" className="text-gray-900">
                      Description :
                    </label>
                    {/* 사용자로부터 'description'을 입력받는 텍스트 입력 필드 */}
                    <input
                      type="text"
                      {...register("description", {
                        required: {
                          value: true,  // 필수 입력값
                          message: "Please fill the title of message",  // 필수 입력 오류 메시지
                        },
                      })}
                      className={`w-full px-6 py-4 mt-5 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none text-black`}
                      placeholder="Begin the process"
                    />
                    {/* 'description' 필드에 대한 오류 메시지 출력 */}
                    <ErrorMessage errors={errors} name="description" />

                    <Button type="submit">Save</Button>
                  </div>
                ) : currentSideData.type === NodeTypes.InputNode ? (
                  <>
                    {/* 입력 노드 */}
                    <div className="space-y-2">
                      <label htmlFor="" className="text-gray-900">
                        Description :
                      </label>
                      {/* 사용자로부터 'description'을 입력받는 텍스트 입력 필드 */}
                      <input
                        type="text"
                        {...register("description", {
                          required: {
                            value: true,  // 필수 입력값
                            message: "Please fill the title of message",  // 필수 입력 오류 메시지
                          },
                        })}
                        className={`w-full px-6 py-4 mt-5 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none text-black`}
                        placeholder="Begin the process"
                      />
                      {/* 'description' 필드에 대한 오류 메시지 출력 */}
                      <ErrorMessage errors={errors} name="description" />
                    </div>

                    {/* 입력 필드 반복 렌더링 */}
                    {fields.map((item, index) => (
                      <div key={item.id} className="flex gap-x-3">
                        {/* 키 입력 필드 */}
                        <div className="space-y-2 pt-3">
                          <label
                            htmlFor={`key.${index}.value`}
                            className="text-gray-900"
                          >
                            key {index + 1}:
                          </label>
                          <input
                            id={`key.${index}.value`}
                            type="text"
                            {...register(`key.${index}.value`)}  // 키 값 등록
                            className={`w-full px-6 py-4 mt-5 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none text-black`}
                            placeholder="Write key here"
                          />
                          {/* 'key.{index}.value' 필드와 관련된 오류 메시지를 표시 */}
                          <ErrorMessage errors={errors} name={`key.${index}.value`} />
                        </div>

                        {/* 값 입력 필드 */}
                        <div className="space-y-2 pt-3 relative mb-10">
                          <label
                            htmlFor={`value.${index}.value`}
                            className="text-gray-900"
                          >
                            value:
                          </label>
                          {/* 'value.{index}.value' 필드에 대해 Controller를 사용하여 상태 제어 */}
                          <input
                            id={`value.${index}.value`}
                            type="text"
                            {...register(`value.${index}.value`)}  // 키 값 등록
                            className={`w-full px-6 py-4 mt-5 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none text-black`}
                            placeholder="Write value here"
                          />
                          {/* 'key.{index}.step' 필드와 관련된 오류 메시지를 표시 */}
                          <ErrorMessage errors={errors} name={`key.${index}.step`} />

                          {/* input 제거 버튼 */}
                          <span
                            onClick={() => remove(index)}
                            className="text-red-700 py-1 cursor-pointer absolute right-0 top-full mt-0"
                          >
                            Remove
                          </span>
                          <ErrorMessage
                            errors={errors}
                            name={`key.${index}.step`}
                          />
                        </div>
                      </div>
                    ))}

                    {/* input 추가 및 저장 버튼 */}
                    <div className="flex gap-2 pt-3">
                      {/* 'Add Condition' 버튼: 조건 추가 */}
                      {currentSideData.type !== "custom" && (
                        <button
                          type="button"
                          onClick={addInput}  // 조건 추가 핸들러 호출
                          className="bg-blue-400"
                        >
                          Add Input
                        </button>
                      )}
                      <Button onClick={handleSave} type="submit">Save</Button>
                    </div>
                  </>
                ) : currentSideData.type === NodeTypes.StepNode ? (
                  <>
                    {/* 단계 노드 */}
                    <div className="space-y-2">
                      <label htmlFor="" className="text-gray-900">Description :</label>
                      <input
                        type="text"
                        {...register("description", {
                          required: { value: true, message: "Description field is required" }
                        })}
                        className="w-full px-6 py-4 mt-5 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none text-black"
                        placeholder="Write description here"
                      />
                      <ErrorMessage errors={errors} name="description" />
                    </div>

                    {/* 드롭다운 */}
                    <div className="flex flex-col gap-[10px] items-center justify-center">
                      {adminMenu.map((menu, index) => {
                        const active = activeIdx === index + 1 ? true : false; // Check if the current menu is active
                        return (
                          <div key={index} className="flex flex-col gap-[10px] items-center justify-center w-full">
                            {/* Main menu button */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveIdx(activeIdx === index + 1 ? null : index + 1); // Toggle active state
                              }}
                              className={`w-[300px] h-[65px] p-2 border border-black rounded-md ${active ? 'bg-gray-300' : 'bg-white'} hover:bg-[#3a3a78] hover:text-white hover:border-black`}
                            >
                              {menu.name}
                            </button>

                            {/* Submenu items (shown only if the current menu is active) */}
                            {active && (
                              <div className="ml-4 mt-2 space-y-1">
                                {menu.subMenu.map((sub, subIndex) => (
                                  <button
                                    key={subIndex}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedSubItem(sub.name); // Set the selected submenu item
                                    }}
                                    className="block w-[250px] p-2 text-center border rounded-md bg-white hover:bg-gray-200 hover:border-black"
                                  >
                                    {sub.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="fixed bottom-5">
                      <button type="submit" className="p-2 bg-black text-white rounded-md">
                        Save
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* 조건 노드 */}
                    <div className="space-y-2">
                      <label htmlFor="" className="text-gray-900">
                        Description :
                      </label>
                      {/* 사용자로부터 'description'을 입력받는 텍스트 입력 필드 */}
                      <input
                        type="text"
                        {...register("description", {
                          required: {
                            value: true,  // 필수 입력
                            message: "Description is required", // 필수 입력 메시지
                          },
                        })}
                        className={`w-full px-6 py-4 mt-5 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none text-black`}
                        placeholder="Write description here"
                      />
                      {/* 'description' 필드에 대한 오류 메시지 출력 */}
                      <ErrorMessage errors={errors} name="description" />
                    </div>

                    {/* 조건 입력 필드 반복 렌더링 */}
                    {fields.map((item, index) => (
                      <div key={item.id} className="flex gap-x-3">
                        {/* 조건 값 입력 필드 */}
                        <div className="space-y-2">
                          <label
                            htmlFor={`conditions.${index}.value`}
                            className="text-gray-900"
                          >
                            Condition {index + 1} (Validation): {/* 조건 번호 표시 */}
                          </label>
                          <input
                            id={`conditions.${index}.value`}
                            type="text"
                            {...register(`conditions.${index}.value`)}  // 조건 값 등록
                            className={`w-full px-6 py-4 mt-5 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none text-black`}
                            placeholder="Write description here"
                          />
                          {/* 'conditions.{index}.value' 필드와 관련된 오류 메시지를 표시 */}
                          <ErrorMessage errors={errors} name={`conditions.${index}.value`} />
                        </div>

                        {/* 'Go to step' 입력 필드 */}
                        <div className="space-y-2">
                          <label
                            htmlFor={`conditions.${index}.step`}
                            className="text-gray-900"
                          >
                            Go to step: {/* 연결 단계 입력 안내 */}
                          </label>
                          {/* 'conditions.{index}.step' 필드에 대해 Controller를 사용하여 상태 제어 */}
                          <Controller
                            name={`conditions.${index}.step`}
                            control={control} // React Hook Form의 control 객체
                            render={({ field: { onChange, value, onBlur } }) => (
                              <AutoComplete
                                value={value} // 현재 값
                                onChange={onChange} // 값 변경 이벤트
                                onBlur={onBlur} // 입력 필드 포커스 해제 이벤트
                                renderNodes={renderNodes} // 렌더링할 노드들
                                currentSideData={currentSideData} // 현재 사이드 데이터를 전달
                              />
                            )}
                          />
                          {/* 'conditions.{index}.step' 필드와 관련된 오류 메시지를 표시 */}
                          <ErrorMessage errors={errors} name={`conditions.${index}.step`} />

                          {/* 조건 제거 버튼 */}
                          <span
                            onClick={() => handleRemoveCondition(index, item)}  // 조건 삭제와 엣지 삭제 처리
                            className="text-red-700 py-1 cursor-pointer"
                          >
                            Remove
                          </span>
                          <ErrorMessage
                            errors={errors}
                            name={`conditions.${index}.step`}
                          />
                        </div>
                      </div>
                    ))}

                     {/* 조건 추가 및 저장 버튼 */}
                    <div className="flex gap-2">
                      {/* 'Add Condition' 버튼: 조건 추가 */}
                      {currentSideData.type !== "custom" && (
                        <button
                          type="button"
                          onClick={addInput}  // 조건 추가 핸들러 호출
                          className="bg-blue-400"
                        >
                          Add Condition
                        </button>
                      )}
                      <Button type="submit">Save</Button>
                    </div>
                  </>
                )}
                <ErrorMessage errors={errors} name="email_subject" />
              </div>
            </div>
          </form>
        </div>
      </Transition.Child>
    </Transition>
  );
};

export default SideBar;