"use client";

import Image from "next/image";
import { parseEther as viemParseEther } from "viem";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import { useWriteContract } from "wagmi";

// Component to display a progress bar based on completed tasks
function ProgressBar({ todos }: { todos: { completed: boolean }[] }) {
  const completedCount = todos.filter((t) => t.completed).length;
  const percentage = Math.round((completedCount / todos.length) * 100);

  return (
    <div style={{ width: "100%", marginBottom: "1rem" }}>
      <p style={{ marginBottom: "0.25rem" }}>
        ✅ Completed: {completedCount} / {todos.length} ({todos.length ? percentage : 0}%)
      </p>
      <div style={{ height: "10px", background: "#eee", borderRadius: "4px" }}>
        <div
          style={{
            height: "100%",
            width: `${todos.length ? percentage : 0}%`,
            background: "#4caf50",
            borderRadius: "4px",
            transition: "width 0.3s ease",
          }}
        ></div>
      </div>
    </div>
  );
}

export default function Home() {
  // Define the Todo type
  type Todo = { completed: boolean; text: string };

  // State to store the list of todos
  const [todos, setodos] = useState<Todo[]>([]);
  
  // Reference to the input element
  const inputref = useRef<HTMLInputElement>(null);
  
  // Wagmi contract writing hook
  const { writeContract } = useWriteContract();

  // Contract configuration: address and ABI
  const wagmiConfig = {
    address: "0x0e963Fad6704c6B142858eE5086a6F509CDbf5a9" as `0x${string}`,
    abi: [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_content",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "addFirstTask",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_content",
				"type": "string"
			}
		],
		"name": "addTask",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "completeTask",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawStakeIfDone",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stakeAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userStakes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userTasks",
		"outputs": [
			{
				"internalType": "string",
				"name": "content",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "completed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userTasksCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]};

  // Call smart contract to add the first task with a small ETH stake
  const firstask = async (content: string, index: number) => {
    await writeContract({
      ...wagmiConfig,
      functionName: "addFirstTask",
      args: [content, index],
      value: viemParseEther("0.0001"), // 0.0001 ETH
    });
  };

  // Call smart contract to add subsequent tasks
  const addtask = async (content: string) => {
    await writeContract({
      ...wagmiConfig,
      functionName: "addTask",
      args: [content],
    });
  };

  // Mark task as completed on-chain
  const finishTask = async (index: number) => {
    await writeContract({
      ...wagmiConfig,
      functionName: "completeTask",
      args: [index],
    });
  };

  // Withdraw stake only if all tasks are completed
  const withdrawStakeIfDone = async () => {
    await writeContract({
      ...wagmiConfig,
      functionName: "withdrawStakeIfDone",
    });
  };


  //---------------------
  // Add a new task from input
  const getText = async () => {
    if (inputref.current) {
      const text = inputref.current.value;
      const items = { completed: false, text };
      setodos([...todos, items]);

      // If first task, send ETH stake; otherwise, just add task
      console.log(todos.length);
      if (todos.length === 0) {
        console.log(todos.length);
        await firstask(text, todos.length);
      } else {
        await addtask(text);
      }

      inputref.current.value = "";
    }
  };

  // Handle click to toggle task completion and update blockchain
  const handelClich = async (index: number) => {
    const newlist = [...todos];
    newlist[index].completed = !newlist[index].completed;
    setodos(newlist);
    await finishTask(index);

    // Count how many tasks are done (not used here, but useful for debugging)
    let done = 0;
    for (let i = 0; i < newlist.length; i++) {
      if (newlist[i].completed === true) {
        done++;
      }
    }
  };

  // Check if all tasks completed, then withdraw the stake
  const gtstake = async () => {
    const allCompleted = todos.every(todo => todo.completed === true);
    if (allCompleted) {
      await withdrawStakeIfDone();
    } else {
      console.log("❌ Not all tasks completed yet.");
    }
  };

  // Delete a task from the list
  const deletItem = (index: number) => {
    const newlist = [...todos];
    newlist.splice(index, 1);
    setodos(newlist);
  };

  // UI rendering
  return (
    <div className={styles.App}>
      <h1>To Do List</h1>
      <div className={styles.toDoCountaner}>
        <ProgressBar todos={todos} />
        <ul>
          {todos.map((item, index) => {
            return (
              <div className={styles.chek}>
                <li
                  className={item.completed ? styles.Don : ""}
                  onClick={() => handelClich(index)}
                >
                  {item.text}
                </li>
                <span onClick={() => deletItem(index)} className={styles.sp}>
                  X
                </span>
              </div>
            );
          })}
        </ul>
        <input ref={inputref} placeholder="enter item ..." />
        <button onClick={getText}>Add</button>
        <button onClick={gtstake}>gitstak</button>
        <w3m-button></w3m-button>
      </div>
    </div>
  );
}
