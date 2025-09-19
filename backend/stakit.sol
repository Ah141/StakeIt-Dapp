// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract ToDoDapp {
    // Fixed stake amount required to start
    uint public constant stakeAmount = 0.0001 ether;

    // Task structure with content and completion status
    struct Task {
        string content;
        bool completed;
    }

    // Mapping from user address to their tasks
    mapping(address => mapping(uint => Task)) public userTasks;
    // Mapping from user address to their number of tasks
    mapping(address => uint) public userTasksCount;
    // Mapping from user address to their staked amount
    mapping(address => uint) public userStakes;

    // Function to add the first task (requires staking)
    function addFirstTask(string memory _content, uint _index) public payable {
        require(msg.value == stakeAmount, "Must stake exactly 0.0001 ETH");
        require(_index == 0, "First task index must be 0");

        userStakes[msg.sender] = msg.value;
        userTasks[msg.sender][0] = Task(_content, false);
        userTasksCount[msg.sender] = 1;
    }

    // Function to add additional tasks (no staking required)
    function addTask(string memory _content) public {
        require(userTasksCount[msg.sender] > 0, "Start with addFirstTask first");

        uint index = userTasksCount[msg.sender];
        userTasks[msg.sender][index] = Task(_content, false);
        userTasksCount[msg.sender]++;
    }

    // Function to mark a task as completed
    function completeTask(uint _index) public {
        require(_index < userTasksCount[msg.sender], "Invalid task index");

        userTasks[msg.sender][_index].completed = true;
    }

    // Function to withdraw staked amount if all tasks are completed
    function withdrawStakeIfDone() public {
        require(userStakes[msg.sender] > 0, "No stake found");

        uint taskCount = userTasksCount[msg.sender];
        for (uint i = 0; i < taskCount; i++) {
            if (!userTasks[msg.sender][i].completed) {
                revert("All tasks must be completed");
            }
        }

        // Reset user's data
        uint amount = userStakes[msg.sender];
        userStakes[msg.sender] = 0;
        userTasksCount[msg.sender] = 0;

        //clean up user tasks from storage
        for (uint i = 0; i < taskCount; i++) {
            delete userTasks[msg.sender][i];
        }

        // Transfer the stake back to the user
        payable(msg.sender).transfer(amount);
    }
}