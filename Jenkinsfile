pipeline {
    agent any

    environment {
        KUBECONFIG = '/var/lib/jenkins/.kube/config'
        IMAGE_NAME = "shandeep04/online-learning-platform"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        KUBE_DEPLOYMENT = "online-learning-platform"
        KUBE_NAMESPACE = "default"
        DOCKER_USER = "shandeep04"
        DOCKER_PASS = "Shandeep-4621"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Shandeepsugumar/online-learning-platform.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('Start Minikube') {
            steps {
                script {
                    sh '''
                        echo "🧹 Cleaning up old Minikube..."
                        minikube delete || true

                        echo "🚀 Starting Minikube..."
                        minikube start --driver=docker
                        
                        echo "🔧 Setting up kubeconfig..."
                        minikube update-context
                    '''
                }
            }
        }

        stage('Check K8s Context') {
            steps {
                sh 'kubectl config get-contexts'
                sh 'kubectl get nodes'
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    sh """
                        echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                        docker logout
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
           steps {
               script {
                   sh """
                       kubectl apply -f deployment.yaml -n ${KUBE_NAMESPACE}
                       kubectl set image deployment/${KUBE_DEPLOYMENT} \
                       online-learning-platform=${IMAGE_NAME}:${IMAGE_TAG} \
                       -n ${KUBE_NAMESPACE}
                       kubectl rollout status deployment/${KUBE_DEPLOYMENT} -n ${KUBE_NAMESPACE}
                   """
               }
           }
       }
    }

    post {
        success {
            echo '✅ Deployment to Kubernetes was successful.'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}
