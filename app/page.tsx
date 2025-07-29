"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useRef, useState } from "react";

export default function Home() {
  
  const [todos , setodos] = useState([]);
  const inputref = useRef();
  const getText = () => {
    const text = inputref.current.value;
    const items = {completed:false,text}
    setodos([...todos,items]);
    inputref.current.value = "";
  }
  const handelClich = (index) => {
    const newlist = [...todos];
    newlist[index].completed = !newlist[index].completed;
    setodos(newlist);
  }
  const deletItem = (index)=>{
    const newlist = [...todos];
    newlist.splice(index , 1);
    setodos(newlist)
  }
  return (
    <div className={styles.App}>
      <h1>To Do List</h1>
      <div className={styles.toDoCountaner}>
        <ul>
          {
            todos.map((item,index) => {
              return(
                <div className={styles.chek}>
                <li className={item.completed ? styles.Don : ""} onClick={()=>handelClich(index)}>{item.text}</li>;
                <span onClick={()=>deletItem(index)} className={styles.sp}>X</span>
                </div>
              )
            }
            )
          }
        </ul>
        <input ref = {inputref} placeholder="enter item ..."/>
        <button onClick={getText}>Add</button>
      </div>
    </div>
  );
}
