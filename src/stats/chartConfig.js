const getChartConfig = (completed, upcoming, pending, overdue) => ({
    type: 'doughnut',
    data: {
        labels: ['Completed Tasks', 'Upcoming Tasks', 'Pending Tasks', 'Over Due'],
        datasets: [{
            label: 'Task Overview',
            data: [completed, upcoming, pending, overdue],
            backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#4d04fe'], // Green, Orange, Red
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            }
        }
    }
});

export default getChartConfig;
