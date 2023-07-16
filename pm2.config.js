module.exports = {
    apps: [
      {
        name: 'user-api',
        script: './user-api/dist/main.js', // Path to the entry file of your first API
        instances: 1, // Number of instances you want to run
        exec_mode: 'cluster', // Run instances in cluster mode for better performance
        cwd: './user-api', // Path to the API1 directory (optional)
      },
      {
        name: 'rdv-api',
        script: './rdv-api/dist/main.js', // Path to the entry file of your second API
        instances: 1, // Number of instances you want to run
        exec_mode: 'cluster', // Run instances in cluster mode for better performance
        cwd: './rdv-api', // Path to the API2 directory (optional)
      },
      {
        name: 'lieu-api',
        script: './lieu-api/dist/main.js', // Path to the entry file of your third API
        instances: 1, // Number of instances you want to run
        exec_mode: 'cluster', // Run instances in cluster mode for better performance
        cwd: './lieu-api', // Path to the API3 directory (optional)
      },
    ],
  };