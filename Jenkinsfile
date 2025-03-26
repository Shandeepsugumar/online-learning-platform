pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    credentialsId: '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',  // Use the credentials ID from Jenkins
                    url: 'https://github.com/Shandeepsugumar/online-learning-platform.git'
            }
        }
    }
}
