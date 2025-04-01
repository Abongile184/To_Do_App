import ToDo from "../modules/Todo"; // Ensure correct import

class Storage {
    constructor() {
        this.tasksKey = "tasks";
        this.projectsKey = "projects";
    }

    saveTasks(tasks) {
        console.log("Saving to LocalStorage:", tasks); 
        localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
    }

    getTasks() {
        const tasks = localStorage.getItem(this.tasksKey);
        if (!tasks) return [];
    
        return JSON.parse(tasks).map(taskData => 
            new ToDo(
                taskData.title, 
                taskData.description, 
                taskData.dueDate, 
                taskData.priority, 
                taskData.complete // 🔥 Ensure we restore the completion status
        
            )
        );
        console.log(taskData.complete)
    }

    updateTaskInStorage(updatedTask) {
        let tasks = this.getTasks(); // Fetch stored tasks
        console.log("Before update:", tasks); // ✅ Log before update
    
        tasks = tasks.map(task => {
            if (task.title === updatedTask.title && task.description === updatedTask.description) {
                console.log("Updating task:", updatedTask); // ✅ Log the task being updated
                return { ...task, complete: updatedTask.complete };
            }
            return task;
        });
    
        console.log("After update:", tasks); // ✅ Log after update
        this.saveTasks(tasks); // Save the updated list
    }
    

    deleteTaskFromStorage(taskToRemove) {
        let tasks = this.getTasks();
        tasks = tasks.filter(task => task.title !== taskToRemove.title);
        this.saveTasks(tasks);
    }

    saveProjects(projects) {
        localStorage.setItem(this.projectsKey, JSON.stringify(projects));
    }

    getProjects() {
        const projects = localStorage.getItem(this.projectsKey);
        return projects ? JSON.parse(projects) : [];
    } 
}

export default new Storage();