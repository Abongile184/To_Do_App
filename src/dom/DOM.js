import ModalController from './ModalController';

class DOM {
  renderContent({ message, clear = true }) {
    const content = document.querySelector('.content');
    if (clear) content.innerHTML = '';

    // Check if .task-message already exists
    let paragraph = content.querySelector('.task-message');
    if (!paragraph) {
        paragraph = document.createElement('h2');
        paragraph.textContent = message;
        paragraph.classList.add('task-message');
        content.appendChild(paragraph);
    } else {
        paragraph.textContent = message;
    }

    // Check if .button_add already exists
    let addtaskbtn = content.querySelector('.button_add');
    if (!addtaskbtn) {
        const btnwrap = document.createElement('div');
        btnwrap.classList.add('wrap');

        addtaskbtn = document.createElement('button');
        addtaskbtn.innerHTML = "Add Task";
        addtaskbtn.classList.add('button_add');
        addtaskbtn.id = "seven";

        btnwrap.appendChild(addtaskbtn);
        content.appendChild(btnwrap);
    }

    return { addtaskbtn, paragraph };
}

  renderForm() {
    const content = document.querySelector('.content');
    //if (document.querySelector('#modal-container')) return;

    const modal_container = document.createElement('div');
    modal_container.id = 'modal-container';
    const modal_background = document.createElement('div');
    modal_background.classList.add('modal-background');
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const form = document.createElement("form");//main  parent for modal contents
    form.classList.add('input-form');

    const input = document.createElement("input")
    input.id = "input";
    input.type = "text";
    input.required = true; 
    input.placeholder = "Enter task name";

    const textarea = document.createElement("textarea");
    textarea.id = "textbox";
    textarea.placeholder = "Description of the task";
    textarea.required = true;
    textarea.setAttribute("maxlength", "200");

    const dateContainer = document.createElement("div");
    dateContainer.classList.add("date-container");

    const icon = document.createElement("span");
    icon.classList.add("material-symbols-outlined");
    icon.textContent = "calendar_month";

    const dateLabel = document.createElement("label");
    dateLabel.textContent = "Due Date:";
    dateLabel.htmlFor = "duedate";

    const duedate = document.createElement("input")
    duedate.type = "date";
    duedate.id = "duedate";

    const today = new Date().toISOString().split("T")[0];//prevent user from selecting previous dates
    duedate.min = today;

    // Create a wrapper to hold both Priority and Button
    const priorityWrapper = document.createElement("div");
    priorityWrapper.classList.add("priority-wrapper");

    const icon2 = document.createElement("span");
    icon2.classList.add("material-symbols-outlined");
    icon2.textContent = "priority_high";

    const menuoption = ["Priority", "Low", "Medium", "High"];
    
    const selectmenu = document.createElement("select");
    selectmenu.id = "select";
    
    // Loop to create options
    menuoption.forEach((optionText, index) => {
      const option = document.createElement("option");
      option.value = optionText.toLowerCase(); 
      option.textContent = optionText; 

     // If it's the first item (Priority), make it disabled
    if (index === 0) {
      option.disabled = true;
      option.selected = true;
    }
    
    selectmenu.appendChild(option);});
     // Create container for dropdown
    const prioritycontainer = document.createElement("div");
    prioritycontainer.classList.add("prioritycontainer");
    prioritycontainer.appendChild(icon2)
    prioritycontainer.appendChild(selectmenu);

    // Create Button (Opposite to Priority)
    const actionButton = document.createElement("button");
    actionButton.textContent = "Add New Task"; // Change as needed
    actionButton.classList.add("action-button");
    actionButton.setAttribute('type', 'submit');
    priorityWrapper.appendChild(prioritycontainer);
    priorityWrapper.appendChild(actionButton);
   
    dateContainer.appendChild(icon);
    dateContainer.appendChild(dateLabel);
    dateContainer.appendChild(duedate);
   
    //append all to the main parent
    form.appendChild(input);
    form.appendChild(textarea);
    form.appendChild(dateContainer);
    form.appendChild(priorityWrapper);
    modal.appendChild(form);
    modal_background.appendChild(modal);
    modal_container.appendChild(modal_background);
    content.appendChild(modal_container);

    // Delay adding the 'seven' class to trigger animation
    setTimeout(() => modal_container.classList.add('seven'), 10);

    // Use ModalController if further logic is needed
    const modalController = new ModalController();
    modalController.open();
    return actionButton;
  }

  
}

export default DOM;