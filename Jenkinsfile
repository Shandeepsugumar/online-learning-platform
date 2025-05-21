pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'shandeep04/online-learning-platform'
        DOCKER_TAG = 'latest'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    def dockerUsername = 'shandeep04'
                    def dockerPassword = 'Shandeep-4621'

                    sh """
                        echo "${dockerPassword}" | docker login -u "${dockerUsername}" --password-stdin
                        docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                        docker logout
                    """
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    echo 'No automated tests configured yet. Skipping…'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh 'kubectl apply -f deployment.yaml'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
