"use client";

import Image from "next/image";
import { parseEther as viemParseEther } from "viem";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import { useWriteContract } from "wagmi";
import { CheckCircle, Plus, Trash2, Trophy, Target, TrendingUp } from "lucide-react";

// Component to display a progress bar based on completed tasks
function ProgressBar({ todos }: { todos: { completed: boolean }[] }) {
  const completedCount = todos.filter((t) => t.completed).length;
  const percentage = Math.round((completedCount / todos.length) * 100);

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <div className={styles.progressInfo}>
          <TrendingUp className={styles.progressIcon} />
          <span className={styles.progressText}>
            Progress: {completedCount} of {todos.length} tasks completed
          </span>
        </div>
        <span className={styles.progressPercentage}>
          {todos.length ? percentage : 0}%
        </span>
      </div>
      <div className={styles.progressBarTrack}>
        <div
          className={styles.progressBarFill}
          style={{
            width: `${todos.length ? percentage : 0}%`,
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
      const text = inputref.current.value.trim();
      if (!text) return; // Don't add empty tasks
      
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

  // Handle Enter key press in input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      getText();
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

  // Check if all tasks are completed
  const allTasksCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  // UI rendering
  return (
    <div className={styles.container}>
      {/* Background decoration */}
      <div className={styles.backgroundDecoration}>
        <div className={styles.blurCircleTop}></div>
        <div className={styles.blurCircleBottom}></div>
      </div>

      <div className={styles.app}>
        <header className={styles.header}>
          <div className={styles.iconContainer}>
            <Target className={styles.headerIcon} />
          </div>
          <h1 className={styles.title}>Task Manager</h1>
          <p className={styles.subtitle}>Stay organized and achieve your goals</p>
        </header>

        {todos.length > 0 && <ProgressBar todos={todos} />}

        <div className={styles.inputSection}>
          <div className={styles.inputGroup}>
            <input 
              ref={inputref} 
              className={styles.taskInput}
              placeholder="What needs to be done?" 
              onKeyPress={handleKeyPress}
            />
            <button 
              onClick={getText}
              className={styles.addButton}
              aria-label="Add task"
            >
              <Plus className={styles.addIcon} />
            </button>
          </div>
        </div>

        {todos.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconContainer}>
              <Target className={styles.emptyIcon} />
            </div>
            <h3 className={styles.emptyTitle}>Ready to get started?</h3>
            <p className={styles.emptyText}>Add your first task and begin your journey to productivity!</p>
          </div>
        ) : (
          <div className={styles.tasksSection}>
            <div className={styles.tasksList}>
              {todos.map((item, index) => {
                return (
                  <div key={index} className={styles.taskItem}>
                    <div className={styles.taskContent}>
                      <button 
                        className={`${styles.checkbox} ${item.completed ? styles.checked : ''}`}
                        onClick={() => handelClich(index)}
                        aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {item.completed && <CheckCircle className={styles.checkIcon} />}
                      </button>
                      <span 
                        className={`${styles.taskText} ${item.completed ? styles.completed : ''}`}
                        onClick={() => handelClich(index)}
                      >
                        {item.text}
                      </span>
                    </div>
                    <button 
                      onClick={() => deletItem(index)} 
                      className={styles.deleteButton}
                      aria-label="Delete task"
                    >
                      <Trash2 className={styles.deleteIcon} />
                    </button>
                  </div>
                );
              })}
            </div>

            {allTasksCompleted && (
              <div className={styles.completionSection}>
                <div className={styles.completionContent}>
                  <Trophy className={styles.trophyIcon} />
                  <div className={styles.completionText}>
                    <h3 className={styles.completionTitle}>Congratulations!</h3>
                    <p className={styles.completionMessage}>All tasks completed! You can now withdraw your stake.</p>
                  </div>
                </div>
                <button 
                  onClick={gtstake}
                  className={styles.withdrawButton}
                >
                  <span>Withdraw Stake</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}