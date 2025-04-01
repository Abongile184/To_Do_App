const getChartConfig = (completed, upcoming, pending) => ({
    type: 'doughnut',
    data: {
        labels: ['Completed Tasks', 'Upcoming Tasks', 'Pending Tasks'],
        datasets: [{
            label: 'Task Overview',
            data: [completed, upcoming, pending],
            backgroundColor: ['#4caf50', '#ff9800', '#f44336'], // Green, Orange, Red
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