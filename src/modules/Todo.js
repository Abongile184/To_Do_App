 class ToDo {
    constructor(title, description, dueDate, priority, complete = false){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.complete = complete; 
    }


    toggleCompletionStatus(){
        this.complete = !this.complete;  // Toggle between true/false
    }

}

export default ToDo;
