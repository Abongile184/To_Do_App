import Project from "./Project";
import Storage from "../Storage/Storage";
import TaskDisplay from "../ui/TaskDisplay";
import UI from "../ui/Ui";
import DOM from "../dom/DOM";
import ToDo from "../modules/Todo";

class ProjectManager {
    constructor() {
        this.projects = this.loadProjects(); // Load projects from storage
        this.taskDisplay = new TaskDisplay();
        this.ui = new UI();
        this.dom = new DOM();
        this.projectButton = document.querySelector("#project-button");
        this.projectsContainer = document.querySelector(".projects"); 
    }

    initialize() {
        if (this.projectButton) {
            this.projectButton.addEventListener("click", () => this.addProjectPrompt());
        }
        this.renderProjects(); // ✅ Render stored projects on page load
    }

    addProjectPrompt() {
        const projectName = prompt("Enter Project Name:");
        if (!projectName || this.getProject(projectName)) {
            alert("Project name cannot be empty or already exists!");
            return;
        }

        const newProject = new Project(projectName);
        this.projects.push(newProject);
        this.saveProjects();
        this.renderProjects();
    }

    renderProjects() {
        let projectList = document.querySelector(".project-list");
    
        if (!projectList) {
            projectList = document.createElement("div");
            projectList.classList.add("project-list");
            this.projectsContainer.appendChild(projectList);
        }
    
        projectList.innerHTML = "";
    
        this.projects.forEach((project, index) => {
            const projectElement = document.createElement('div');
            projectElement.classList.add('ProjectWrapper');
            
            const folderIcon = document.createElement("i");
            folderIcon.classList.add("fa", "fa-folder");

            const projectText = document.createElement("span");
            projectText.textContent = ` ${project.name}`;
        
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "❌";
            deleteBtn.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevent folder click when deleting
                this.deleteProject(index);
        });

        projectElement.appendChild(folderIcon);
        projectElement.appendChild(projectText);
        projectElement.appendChild(deleteBtn);
        projectList.appendChild(projectElement);

          // ✅ Clicking on a folder will switch to that project
        projectElement.addEventListener("click", () => this.openProject(project.name));
        
        });
    }

    openProject(projectName) {
        const project = this.getProject(projectName);
        if (!project) return;
        
        // ✅ Clear existing content and render h2 + button
        const { addtaskbtn, paragraph } = this.dom.renderContent({
            message: `Tasks for ${projectName}`,
            clear: true
        });

        // ✅ Ensure the "Add Task" button opens the modal when clicked
       // addtaskbtn.addEventListener('click', () => this.dom.renderForm());
        addtaskbtn.addEventListener('click', (event) =>{
           
            this.dom.renderForm()
            const form = document.querySelector(".input-form"); 
            if (form) {
                form.addEventListener("submit", (event) => {
                    event.preventDefault();   // ✅ Stop page reload
                    
                    const title = document.getElementById("input").value.trim();
                    const description = document.getElementById("textbox").value.trim();
                    const dueDate = document.getElementById("duedate").value;
                    const priority = document.getElementById("select").value;
                    
                    if (!title || !dueDate || priority === "priority") {
                        alert("Please fill in all required fields.");
                        return;}
                    
                    // ✅ Create new task & add to current project
                    const newTask = new ToDo(title, description, dueDate, priority);
                    project.todos.push(newTask); // Add to this project
                    this.saveProjects();

                     // ✅ Render task in UI
                    this.taskDisplay.renderTask(newTask);

                    // ✅ Close modal
                    const modal = document.getElementById("modal-container");
                    if (modal) modal.remove();
                    
                    console.log(`🆕 Task added to project: ${project.name}`, newTask);
                }, { once: true }); // ✅ This prevents duplicate listeners
            }
                console.log(`ProjectManager ${addtaskbtn}`)
        })
        // ✅ Render only tasks belonging to the selected project */
        this.renderProjectTasks(project);
    }

    renderProjectTasks(project) {
        const contentContainer = document.querySelector(".content");

        // ✅ Display only tasks that belong to the project
        project.todos.forEach(task => {
            this.taskDisplay.renderTask(task); // 🔥 Reusing the existing method
        });
    }
    

    deleteProject(index) {
    const deletedProject = this.projects[index];
    const content = document.querySelector(".content");

    // Get the current project displayed
    const currentTitle = content.querySelector(".task-message")?.textContent || "";
    const currentProjectName = currentTitle.replace("Tasks for ", "").trim();

    // ❌ If we are viewing the project being deleted, clear UI
    if (deletedProject.name === currentProjectName) {
        content.innerHTML = ""; // Clear task area
    }

    // ✅ Remove project from array and storage
    this.projects.splice(index, 1);
    this.saveProjects();
    this.renderProjects();
    }


    deleteTaskFromProject(projectName, todoToRemove) {
        const project = this.getProject(projectName);
        if (!project) return;

        project.removeTodo(todoToRemove); // Remove task from project
        this.saveProjects();
    }

    getProject(projectName) {
        return this.projects.find(project => project.name === projectName);
    }

    saveProjects() {
        Storage.saveProjects(this.projects);
    }

    loadProjects() {
        return Storage.getProjects() || [];
    }
}

export default ProjectManager;