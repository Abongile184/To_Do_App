import Chart from 'chart.js/auto';
import Storage from '../Storage/Storage';
import { isFuture, parseISO } from 'date-fns'; 
import getChartConfig from './chartConfig';

class Statistics {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'taskChart';

        const container = document.querySelector('.content');
        if (container) {
            container.innerHTML = ''; // Clear previous charts
            container.appendChild(this.canvas);
        }
    }

    generateChart() {
        const tasks = Storage.getTasks();
        
        const completedTasks = tasks.filter(task => task.complete).length;
        const upcomingTasks = tasks.filter(task => isFuture(parseISO(task.dueDate)) && !task.complete).length;
        const pendingTasks = tasks.length - (completedTasks + upcomingTasks);

        const ctx = document.getElementById('taskChart').getContext('2d');
        new Chart(ctx, getChartConfig(completedTasks, upcomingTasks, pendingTasks));
    }
}

export default Statistics;