import "./styles/styles.css";
import ToDo from "./modules/Todo";
import Project from "./modules/Project";
import ProjectManager from "./modules/ProjectManager";
import UI from "./ui/Ui";
import DOM from "./dom/DOM";
import Storage from "./Storage/Storage";
import ModalController from "./dom/ModalController";
import Tour from "./ui/Tour";

window.addEventListener('load', () => {
  const guide = new Tour();
  guide.start();
});

document.addEventListener("DOMContentLoaded", () => {
  const domInstance = new DOM();
  const uiInstance = new UI(domInstance);

  const projectManager = new ProjectManager();
  projectManager.initialize();

  uiInstance.initialize(); // Set up UI event listeners

  // For example, attach a click event to the "Add Task" button
  const addTaskBtn = document.querySelector('.button_add');
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', () => {
      const modalController = new ModalController();
      modalController.open();
    });
  }


  // Also attach an event to close the modal on click of modal container background
  const modalContainer = document.getElementById('modal-container');
  if (modalContainer) {
    modalContainer.addEventListener('click', () => {
      const modalController = new ModalController();
      modalController.close();
    });
  }
  
});

// test data :
const myTodo = new ToDo(
  "Complete Modularization",
  "Break app into modules",
  "2025-01-30",
  "High"
);



console.log(myTodo);
const task = new ToDo("complete To do app", "complete the to do list app", "2025-01-15", "High");
task.toggleCompletionStatus();
console.log(task);
const task2 = new ToDo("become a full stack", "Become a full stack engineer", "2025-08-27", "High");
console.log(task2);

const store = new Project('Agenda');
store.addTodo(myTodo);
store.addTodo(task);
store.addTodo(task2);
console.log(store);












