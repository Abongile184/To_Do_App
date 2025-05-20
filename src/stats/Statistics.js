import Chart from 'chart.js/auto';
import Storage from '../Storage/Storage';
import { isFuture, isBefore, startOfDay, parseISO } from 'date-fns';

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
    const today = startOfDay(new Date());

    const completedTasks = tasks.filter(task => task.complete).length;
    const upcomingTasks = tasks.filter(task => {
        const taskDate = parseISO(task.dueDate);
        return isFuture(taskDate) && !task.complete;
    }).length;
    const overdueTasks = tasks.filter(task => {
        const taskDate = startOfDay(parseISO(task.dueDate));
        return !task.complete && isBefore(taskDate, today);
    }).length;

    const pendingTasks = tasks.length - (completedTasks + upcomingTasks + overdueTasks);

    const ctx = document.getElementById('taskChart').getContext('2d');
    new Chart(ctx, getChartConfig(completedTasks, upcomingTasks, pendingTasks, overdueTasks));
    }
}

export default Statistics;