pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'online-learning-platform'
        DOCKER_TAG = 'latest'
    }

   
        

        stage('Push Docker Image') {
    steps {
        script {
            def dockerUsername = 'shandeep04'
            def dockerPassword = 'shandeep-4621'

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

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('', 'dockerhub-credentials') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Assuming kubectl is configured
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
