pipeline {
    agent any

    environment {
        IMAGE_NAME = "shandeep04/online-learning-platform"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        KUBE_DEPLOYMENT = "online-learning-deployment"
        KUBE_NAMESPACE = "default"
        REGISTRY_CREDENTIALS = 'dockerhub-creds' // Jenkins credentials ID
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/Shandeepsugumar/online-learning-platform.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('Push to Docker Registry') {
            steps {
                withDockerRegistry(credentialsId: "${REGISTRY_CREDENTIALS}", url: '') {
                    script {
                        docker.image("${IMAGE_NAME}:${IMAGE_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Update image in Kubernetes deployment
                    sh """
                    kubectl set image deployment/${KUBE_DEPLOYMENT} \
                    ${KUBE_DEPLOYMENT}=${IMAGE_NAME}:${IMAGE_TAG} \
                    -n ${KUBE_NAMESPACE}
                    """

                    // Optional: Wait for rollout
                    sh """
                    kubectl rollout status deployment/${KUBE_DEPLOYMENT} -n ${KUBE_NAMESPACE}
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment to Kubernetes was successful.'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
