import Project from "./Project";
import Storage from "../Storage/Storage";
import TaskDisplay from "../ui/TaskDisplay";
import UI from "../ui/Ui";
import DOM from "../dom/DOM";

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
        alert('hi there Abongile s Dev Team is working on this feature');
        /* ✅ Clear existing content and render h2 + button
        const { addtaskbtn, paragraph } = this.dom.renderContent({
            message: `Tasks for ${projectName}`,
            clear: true
        });

        // ✅ Ensure the "Add Task" button opens the modal when clicked
        addtaskbtn.addEventListener('click', () => this.dom.renderForm());

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
        this.projects.splice(index, 1); // Remove project
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