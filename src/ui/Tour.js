// Import driver.js and its CSS
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

class Tour {
    constructor() {
        // You can set up any default properties if necessary
        this.driverObj = null;
    }

    // Method to initialize and start the guide
    start() {
        this.driverObj = driver({
            showProgress: true,
            steps: [
                { 
                    element: '.fa-inbox', 
                    popover: { 
                        title: 'Inbox', 
                        description: 'This is where default tasks are created so click here to start', 
                        side: "left", 
                        align: 'start' 
                    }
                },

                {
                    element: '.button_add', 
                    popover: { 
                        title: 'Add Tasks Button', 
                        description: 'This is the button that calls the modal that will take user info and create a task instance so click here to start', 
                        side: "left", 
                        align: 'start' 
                    }
                },

                {
                    element: '.fa-chart-simple',
                    popover: { 
                        title: 'Statistics', 
                        description: 'This button here gives you an overview of all tasks present, where complete or upcoming so click here to start', 
                        side: "left", 
                        align: 'start' 
                    }
                },

                {
                    element: '.fa-pen-to-square',
                    popover: { 
                        title: 'Edit button', 
                        description: 'This button allows you to edit any tasks created so click here to start', 
                        side: "left", 
                        align: 'start' 
                    }
                },

                {
                    element: '#project-button',
                    popover: { 
                        title: 'Project Button', 
                        description: 'This button is mainly for creating Project based tasks, these are normally catalogued into folders so click here to start', 
                        side: "left", 
                        align: 'start' 
                    }
                }
            ]
        });
        
        this.driverObj.drive();
    }
}


export default Tour;