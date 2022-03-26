/* eslint-disable eqeqeq */
/* eslint-disable import/no-anonymous-default-export */
import React, { useRef, FC, ForwardedRef, useImperativeHandle } from 'react';
import { useEventEmitter,useReactive } from 'ahooks';
import { EventEmitter } from 'ahooks/lib/useEventEmitter';//type

//props是一个对象
type BoxType = {
  bus$:EventEmitter<void | string>
}

/* eventBus给兄弟组件和父组件发送消息 */
const Box1: FC<BoxType> = function ({bus$}) {
  return (
    <div style={{ paddingBottom: 24 }}>
      <p>You received a message</p>
      {/* 1.这里通知兄弟节点做事情 */}
      <p>
        <button
          type="button"
          onClick={() => {
            bus$.emit();
          }}
        >
          To brother
        </button>
      </p>

      {/* 2.也可以父子通信的撒 */}
      <p>You received a message</p>
      <p> 
          <button
            type="button"
            onClick={()=>{
              bus$.emit("parent");
            }}
          > 
            Send to Parent
          </button>
      </p>
    </div>
  );
};

/* 接收兄弟组件的消息，test */
const Box2: FC<BoxType> = function ({bus$}) {
  const inputRef = useRef<any>();
  /* 兄弟节点接收到信息该干嘛干嘛 */
  bus$.useSubscription((res) => {
    if(!res) inputRef.current.focus();
  });
  return (
    <input ref={inputRef} placeholder="Enter reply" style={{ width: '100%', padding: '4px' }} />
  );
};

type Box3Type = {
  actionRef:ForwardedRef<any>
}

/* useImperativeHandle 给父组件外置数据和方法 */
const Box3:FC<Box3Type> = function({actionRef}){
  useImperativeHandle(
    actionRef,
    () => ({
      say:()=> {
        console.log('from box3 test');
      },
      test: "test test test"
    }),
    [],
  )

  return(<div style={{paddingTop:20}} > 
    --box3--
  </div>)
}


export default function () {

  const actionRef = React.useRef<any>(null);
  const bus$ = useEventEmitter<void | string>();

  const state = useReactive({
    message:""
  })

  bus$.useSubscription((res)=>{
    if((res as string) == "parent")  state.message = res as string;    
  })


  return (
    <>
      <Box1 bus$={bus$} />
      <Box2 bus$={bus$} />
      <Box3 actionRef = {actionRef} />
      <p>{state.message}</p>
      <p> 
        <button onClick={()=>{actionRef.current.say()}}> 
          fuction test
       </button>
       <button onClick={()=>console.log("--property--",actionRef.current.test)}> 
          property
       </button>
      </p>
    </>
  );
}