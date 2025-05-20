import ToDo from "../modules/Todo";
import TaskDisplay from "./TaskDisplay"; 
import Storage from "../Storage/Storage";
import { parseISO, isToday, isBefore, isFuture, startOfDay } from "date-fns";
import Statistics from '../stats/Statistics';
import notificationSound from '../sound/mixkit-happy-bells-notification.wav';

class UI {
    constructor(domInstance) {
        this.dom = domInstance; // Store the DOM instance
        this.taskDisplay = new TaskDisplay();
        this.paragraph = null; // Store reference to the message element
    }

    initialize() {
        //  Load tasks from localStorage immediately
        this.loadTasksFromStorage();
        this.displayOverDueTasks();

        // 🕒 ✅ Check again every 60 seconds
    setInterval(() => {
        this.displayOverDueTasks();
    }, 60000); 
    
        const inboxButton = document.querySelector('.fa-inbox');
        const todayButton = document.querySelector('.fa-star');
        const upcomingButton = document.querySelector('.fa-calendar');
        const completedTasks = document.querySelector('.fa-check');
        const allTasks = document.querySelector('.fa-tasks');
        const Stats = document.querySelector('.fa-chart-simple');
    
        if (inboxButton) {
            inboxButton.addEventListener('click', () => {
                console.log("📩 Inbox clicked: Reloading all tasks...");
        
                //  Render the UI for tasks
                const contentData = this.dom.renderContent({ message: 'No Tasks added yet!' });
                this.paragraph = contentData.paragraph;
        
                //  Ensure .button_add is always present
                if (contentData && contentData.addtaskbtn) {
                    this.attachAddTaskListener(contentData.addtaskbtn);
                }
                
        
                //  Always reload all tasks when switching back
                this.loadTasksFromStorage();
            });
        }

        if (todayButton) { //to display today's tasks only
            todayButton.addEventListener('click', () => {
                this.displayTodayTasks(); //  Filter today's tasks
            });
        }

        if (upcomingButton){//future or upcoming tasks 
            upcomingButton.addEventListener('click', () => {
                this.displayUpcomingTasks();
            })
        }

        if (completedTasks){
            completedTasks.addEventListener('click', () => {
                this.displayCompletedTasks();
            })
        }

        if (allTasks){
            allTasks.addEventListener('click', () => {
                this.displayAllTasks();
            })
        }

        if (Stats){
            Stats.addEventListener('click', () => {
                this.Statistics();
            })
        }

    }

    attachAddTaskListener(button) {
        button.addEventListener('click', () => {
            this.dom.renderForm(); // Show the form when "Add Task" is clicked
    
            setTimeout(() => {
                const submitTask = document.querySelector(".action-button");
                if (submitTask) {
                    submitTask.addEventListener("click", (event) => {
                        event.preventDefault(); 
    
                        const title = document.getElementById("input").value.trim();
                        const description = document.getElementById("textbox").value.trim();
                        const dueDate = document.getElementById("duedate").value;
                        const priority = document.getElementById("select").value;
    
                        if (!title || !dueDate || priority === "priority") {
                            alert("Please fill in all required fields.");
                            return;
                        }

                        // const folderName = document.getElementById("folderSelect").value;  
                        const newTask = new ToDo(title, description, dueDate, priority);
                        console.log(" New Task Created:", newTask);

    
                        //  Update message that shows if task is present or not
                        if (this.paragraph) {
                            this.paragraph.textContent = "Task(s) added!";
                        }
    
                        // 🔹 Use TaskDisplay instance to render the task
                        this.taskDisplay.renderTask(newTask);
    
                        //  Save task to localStorage
                        this.saveTaskToStorage(newTask);
    
                        document.getElementById("modal-container").remove(); // Close modal
    
                    }, { once: true });
                }
            }, 50);
        });
    }

    //methond to display today's tasks:
    displayTodayTasks() {
        let tasks = Storage.getTasks(); //  Get all tasks
        
        //  Filter tasks due today
        let todayTasks = tasks.filter(task => isToday(parseISO(task.dueDate)));
        
        //  Clear the content area before displaying today's tasks
        const contentData = this.dom.renderContent({ message: "Today's Tasks" });
        this.paragraph = contentData.paragraph;
    
        //  Remove `.button_add`
        const addTaskBtn = document.querySelector(".button_add");
        if (addTaskBtn) addTaskBtn.remove();
    
        if (todayTasks.length === 0) {
            this.paragraph.textContent = "No tasks due today!";
            return;
        }

        if (tasks.length > 0) {
            tasks.forEach(task => {
                const taskDate = parseISO(task.dueDate);
                
                // Ensure the task is upcoming AND not completed
                if (isToday(taskDate) && !task.complete) {
                    this.taskDisplay.renderTask(task);
                }
            });
        }
    
        //  Display today's tasks
      //  todayTasks.forEach(task => this.taskDisplay.renderTask(task));
    }

    //upcoming tasks method:
    displayUpcomingTasks() {
        let tasks = Storage.getTasks(); //  Get all tasks
    
        //  Filter tasks that have a future due date
        let upcomingTasks = tasks.filter(task => isFuture(parseISO(task.dueDate)));
    
        //  Clear content before displaying upcoming tasks
        const contentData = this.dom.renderContent({ message: "Upcoming Tasks" });
        this.paragraph = contentData.paragraph;
    
        //  Remove `.button_add` (if needed)
        const addTaskBtn = document.querySelector(".button_add");
        if (addTaskBtn) addTaskBtn.remove();
    
        if (upcomingTasks.length === 0) {
            this.paragraph.textContent = "No upcoming tasks!";
            return;
        }

        if (tasks.length > 0) {
            tasks.forEach(task => {
                const taskDate = parseISO(task.dueDate);
                
                // Ensure the task is upcoming AND not completed
                if (isFuture(taskDate) && !task.complete) {
                    this.taskDisplay.renderTask(task);
                }
            });
        }
    
        //  Display upcoming tasks
       // upcomingTasks.forEach(task => this.taskDisplay.renderTask(task));
    }

    displayCompletedTasks() {
        let tasks = Storage.getTasks(); // ✅ Retrieve tasks from localStorage
    
        // ✅ Get only completed tasks
        let completedTasks = tasks.filter(task => task.complete);
    
        // ✅ Render UI for completed tasks
        const contentData = this.dom.renderContent({ message: "Completed Tasks" });
        this.paragraph = contentData.paragraph;
    
        // ✅ Remove `.button_add`
        const addTaskBtn = document.querySelector(".button_add");
        if (addTaskBtn) addTaskBtn.remove();
    
        if (completedTasks.length === 0) {
            this.paragraph.textContent = "No Completed Tasks!";
            return;
        }
    
        // ✅ Render completed tasks & apply `.completedTask` styling
        completedTasks.forEach(task => {
            this.taskDisplay.renderTask(task);
    
            // ✅ Select the last rendered task instance
            const taskElements = document.querySelectorAll(".taskwrapper");
            const lastTaskElement = taskElements[taskElements.length - 1];
    
            if (lastTaskElement) {
                // ✅ Apply .completedTask class (for styling)
                lastTaskElement.classList.add("completedTask");
    
                // ✅ Disable `completebtn` to prevent toggling
                const completeBtn = lastTaskElement.querySelector(".completeTask");
                const editBtn = lastTaskElement.querySelector(".fa-pen-to-square");
                if (completeBtn) {
                    completeBtn.disabled = true;
                    completeBtn.textContent = "Task Complete"; // Ensure correct text
                    console.log(editBtn)
                }

                if (editBtn) {
                    editBtn.style.pointerEvents = "none"; // Prevent clicks
                    editBtn.style.opacity = "0.5";        // Optional: dim it visually
                    editBtn.title = "Editing disabled";   // Optional: show tooltip
                }

                console.log(editBtn)
                
            }
        });
    }
    
    displayAllTasks() {
        let tasks = Storage.getTasks(); // ✅ Retrieve all tasks
    
        const contentData = this.dom.renderContent({ message: "All The Tasks" });
        this.paragraph = contentData.paragraph;
    
        // ✅ Remove `.button_add`
        const addTaskBtn = document.querySelector(".button_add");
        if (addTaskBtn) addTaskBtn.remove();
    
        if (tasks.length === 0) {
            this.paragraph.textContent = "There are no Tasks Created";
            return;
        }
    
        // ✅ Loop through all tasks and render them
        tasks.forEach(task => this.taskDisplay.renderTask(task));
    }

    displayOverDueTasks() {
        const tasks = Storage.getTasks(); // 🔍 Get all stored tasks
        const menu = document.querySelector(".menu-selection");
        const today = startOfDay(new Date());
    
        // ✅ Filter overdue tasks (incomplete + date before today)
        const overdueTasks = tasks.filter(task => {
            const taskDate = startOfDay(parseISO(task.dueDate));
            return isBefore(taskDate, today) && !task.complete;
        });
    
        const existingItem = menu.querySelector(".overdue-menu-item");
    
        // ✅ Create the menu item if it doesn't exist
        if (overdueTasks.length > 0 && !existingItem) {
            const li = document.createElement("li");
            li.classList.add("overdue-menu-item");
            li.innerHTML = `<i class="fa-solid fa-hourglass"></i> Overdue Tasks`;
    
            const statsMenuItem = menu.querySelector(".fa-chart-simple")?.parentElement;
            if (statsMenuItem) {
                menu.insertBefore(li, statsMenuItem);
            } else {
                menu.appendChild(li); // fallback
            }

            alert('you have tasks  overdue')
            const sound = new Audio(notificationSound);
            sound.play()
            console.log(sound)
            // ✅ Defer task display until user clicks
            li.addEventListener("click", () => {
                this.showOverdueTaskView(overdueTasks);
    
                // 🔈 Play sound only after user clicks (to avoid autoplay block)
                
            });

            
        }
    
        // ❌ Remove if overdue menu exists but no overdue tasks
        if (overdueTasks.length === 0 && existingItem) {
            existingItem.remove();
        }
    }

    showOverdueTaskView(overdueTasks) {
        const contentData = this.dom.renderContent({ message: "All Overdue Task(s)" });
        this.paragraph = contentData.paragraph;
    
        const addTaskBtn = document.querySelector(".button_add");
        if (addTaskBtn) addTaskBtn.remove();
    
        if (overdueTasks.length === 0) {
            this.paragraph.textContent = "You're all caught up!";
            return;
        }
    
        overdueTasks.forEach(task => {
            this.taskDisplay.renderTask(task);
        });
    }
    

    Statistics(){
        const stats = new Statistics();
        stats.generateChart();
    }

    //local storge: 
    saveTaskToStorage(task) {
        let tasks = Storage.getTasks(); // Call method from instance
        tasks.push(task);
        Storage.saveTasks(tasks);
    }

    //  Load tasks from localStorage if they exist
    loadTasksFromStorage() {
        let tasks = Storage.getTasks();
        
        //  If tasks exist, render them
        if (tasks.length > 0) {
            //  Ensure the content UI is set up correctly
            const contentData = this.dom.renderContent({ message: "Task(s) added!" });
            this.paragraph = contentData.paragraph; 
            
            if (contentData && contentData.addtaskbtn) {
                this.attachAddTaskListener(contentData.addtaskbtn);
            }
    
            //  Render all stored tasks
            tasks.forEach(task => this.taskDisplay.renderTask(task));
        }
    }

}

export default UI;