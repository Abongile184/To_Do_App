import confetti from 'canvas-confetti';
import Storage from  '../Storage/Storage';
import ToDo from "../modules/Todo";

class TaskDisplay {
    constructor() {
        this.contentContainer = document.querySelector(".content");
    }

    renderTask(task) {
        const taskContainer = document.createElement("div");
        taskContainer.classList.add("taskwrapper");

         // ✅ Apply border color based on priority
        switch (task.priority.toLowerCase()) {
            case "low":
                taskContainer.style.borderTop = "4px solid limegreen";
                break;
            case "medium":
                taskContainer.style.borderTop = "4px solid yellow";
                break;
            case "high":
                taskContainer.style.borderTop = "4px solid red";
                break;
            default:
                taskContainer.style.borderTop = "none";
        }

        const edit = document.createElement("i");
        edit.classList.add("fa-solid", "fa-pen-to-square");

        const heading = document.createElement("h2");
        heading.classList.add("titleTask");
        heading.textContent = task.title;

        const taskDetails = document.createElement("p");
        taskDetails.classList.add("taskDescription");
        taskDetails.textContent = task.description;

        const dueDate = document.createElement("span");
        dueDate.classList.add("completionDate");
        dueDate.textContent = `Due: ${task.dueDate}`;

        const controlSwrapper = document.createElement("div");
        controlSwrapper.classList.add("controlsContainer");

        const completebtn = document.createElement("button");
        completebtn.classList.add("completeTask");
       // completebtn.innerHTML = "Not Complete";
        completebtn.textContent = task.complete ? "Task Complete" : "Not Complete";
        if (task.complete) {
            taskContainer.classList.add("completedTask");
            heading.classList.add("completed");
            completebtn.classList.add("completed");
        }

        const deletebtn = document.createElement("button");
        deletebtn.classList.add("deleteTask");
        deletebtn.innerHTML = "Delete Task";

        // Append elements to the task container first, then query them
        taskContainer.appendChild(edit);
        taskContainer.appendChild(heading);
        taskContainer.appendChild(taskDetails);
        taskContainer.appendChild(dueDate);
        controlSwrapper.appendChild(completebtn);
        controlSwrapper.appendChild(deletebtn);
        taskContainer.appendChild(controlSwrapper);

        // Now get references to the title, description, and due date elements
        const titleTask = taskContainer.querySelector(".titleTask");
        const taskDescription = taskContainer.querySelector(".taskDescription");
        const dueDateElement = taskContainer.querySelector(".completionDate");

        // Toggle the completion status when the button is clicked
        completebtn.addEventListener("click", () => {
            task.toggleCompletionStatus();

            //completebtn.innerHTML = task.complete ? "Task Complete" : "Not Complete";

            titleTask.classList.toggle("completed", task.complete);
            taskDescription.classList.toggle("completed", task.complete);
            dueDate.classList.toggle("completed", task.complete);
            completebtn.classList.toggle("completed", task.complete);
            taskContainer.classList.toggle("completedTask", task.complete);

            // 🎉 Confetti for completed tasks
            if (task.complete) {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }

            // ✅ Update Local Storage
            console.log("Task completion toggled:", task.complete);
            Storage.updateTaskInStorage(task);
        });
        

        //  Delete task and check if message needs to be reset
        deletebtn.addEventListener("click", () => {
            this.contentContainer.removeChild(taskContainer);
            if (this.contentContainer.querySelectorAll(".taskwrapper").length === 0) {
                const messageElement = document.querySelector(".task-message");
                if (messageElement) {
                    messageElement.textContent = "No Tasks added yet!";
                }
            }
            Storage.deleteTaskFromStorage(task);
        });

        edit.addEventListener("click", () => {//call the edit function
            this.editTask(task, taskContainer);
        });

    
        // Append the task container to the content container
        if (task.folder) {
            const folderContainer = this.findOrCreateFolderContainer(task.folder);
            folderContainer.appendChild(taskContainer);
        } else {
            this.contentContainer.appendChild(taskContainer);
        }
        
    }

    findOrCreateFolderContainer(folderName) {
        let folderContainer = document.querySelector(`.folder[data-folder="${folderName}"]`);
    
        if (!folderContainer) {
            folderContainer = document.createElement("div");
            folderContainer.classList.add("folder");
            folderContainer.dataset.folder = folderName;
    
            const folderHeading = document.createElement("h3");
            folderHeading.textContent = folderName;
            folderContainer.appendChild(folderHeading);
    
            this.contentContainer.appendChild(folderContainer);
        }
    
        return folderContainer;
    }
    


    //  Function to Remove Task from Local Storage
    deleteTaskFromStorage(taskToRemove) {
        let tasks = Storage.getTasks(); // Get all tasks
        if (!Array.isArray(tasks)) tasks = []; // Prevent errors
    
        //  Remove the matching task by checking all properties (to avoid removing wrong tasks)
        tasks = tasks.filter(task =>
            task.title !== taskToRemove.title ||
            task.description !== taskToRemove.description ||
            task.dueDate !== taskToRemove.dueDate
        );
    
        Storage.saveTasks(tasks); // Save updated tasks to localStorage
    }

    //  Function to Update Task in Local Storage
    updateTaskInStorage(updatedTask) {
        let tasks = Storage.getTasks();
        if (!Array.isArray(tasks)) tasks = []; // Prevent errors
    
        tasks = tasks.map(task =>
            task.title === updatedTask.title &&
            task.description === updatedTask.description &&
            task.dueDate === updatedTask.dueDate
                ? { ...task, complete: updatedTask.complete }
                : task
        );
    
        Storage.saveTasks(tasks); // Save updated tasks
    }
    

    editTask(task, taskContainer) {
        const titleTask = taskContainer.querySelector(".titleTask");
        const taskDescription = taskContainer.querySelector(".taskDescription");
        const dueDateElement = taskContainer.querySelector(".completionDate");
    
        //  Create input fields for editing
        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.value = task.title;
    
        const descriptionInput = document.createElement("textarea");
        descriptionInput.value = task.description;
    
        const dueDateInput = document.createElement("input");
        dueDateInput.type = "date";
        dueDateInput.value = task.dueDate;
    
        //  Priority selection dropdown
        let prioritySelect = document.createElement("select");
        prioritySelect.classList.add("editSelection");
    
        const priorityOptions = ["Low", "Medium", "High"];
        priorityOptions.forEach(option => {
            const optElement = document.createElement("option");
            optElement.value = option.toLowerCase();
            optElement.textContent = option;
    
            if (task.priority.toLowerCase() === option.toLowerCase()) {
                optElement.selected = true;
            }
    
            prioritySelect.appendChild(optElement);
        });
    
        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.classList.add("editSave");
    
        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.classList.add("cancelSave");
    
        //  Replace existing text with input fields
        taskContainer.replaceChild(titleInput, titleTask);
        taskContainer.replaceChild(descriptionInput, taskDescription);
        taskContainer.replaceChild(dueDateInput, dueDateElement);
        taskContainer.appendChild(prioritySelect);
        taskContainer.appendChild(saveButton);
        taskContainer.appendChild(cancelButton);
    
        //  Save Changes Event
        saveButton.addEventListener("click", () => {
            //  Get updated values
            const updatedTitle = titleInput.value.trim();
            const updatedDescription = descriptionInput.value.trim();
            const updatedDueDate = dueDateInput.value;
            const updatedPriority = prioritySelect.value;
    
            if (!updatedTitle || !updatedDueDate) {
                alert("Title and due date are required.");
                return;
            }
    
            //  Update task properties
            task.title = updatedTitle;
            task.description = updatedDescription;
            task.dueDate = updatedDueDate;
            task.priority = updatedPriority;
    
            //  Update UI
            titleTask.textContent = task.title;
            taskDescription.textContent = task.description;
            dueDateElement.textContent = `Due: ${task.dueDate}`;
    
            //  Update Local Storage ( Fix applied here)
            Storage.updateTaskInStorage(task);
    
            //  Restore original UI
            taskContainer.replaceChild(titleTask, titleInput);
            taskContainer.replaceChild(taskDescription, descriptionInput);
            taskContainer.replaceChild(dueDateElement, dueDateInput);
            taskContainer.removeChild(prioritySelect);
            taskContainer.removeChild(saveButton);
            taskContainer.removeChild(cancelButton);
    
            //  Update border color based on priority
            switch (task.priority) {
                case "low":
                    taskContainer.style.borderTop = "4px solid limegreen";
                    break;
                case "medium":
                    taskContainer.style.borderTop = "4px solid yellow";
                    break;
                case "high":
                    taskContainer.style.borderTop = "4px solid red";
                    break;
                default:
                    taskContainer.style.borderTop = "none";
            }
    
            alert("Task updated!");
        });
    
        //  Cancel Editing
        cancelButton.addEventListener("click", () => {
            taskContainer.replaceChild(titleTask, titleInput);
            taskContainer.replaceChild(taskDescription, descriptionInput);
            taskContainer.replaceChild(dueDateElement, dueDateInput);
            taskContainer.removeChild(prioritySelect);
            taskContainer.removeChild(saveButton);
            taskContainer.removeChild(cancelButton);
        });
    }

    updateTaskInStorage(updatedTask) {
        let tasks = Storage.getTasks();
        if (!Array.isArray(tasks)) tasks = []; // Prevent errors
    
        tasks = tasks.map(task =>
            task.title === updatedTask.title &&
            task.dueDate === updatedTask.dueDate
                ? { ...task, description: updatedTask.description, priority: updatedTask.priority }
                : task
        );
    
        Storage.saveTasks(tasks); // Save updated tasks
    }
    
    
}

export default TaskDisplay;
