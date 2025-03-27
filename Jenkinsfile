pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "shandeep04/docker_jenkins_task2:latest"
        K8S_DEPLOYMENT = "k8s/doctor-app-deployment.yaml"
        K8S_SERVICE = "k8s/doctor-app-service.yaml"
        PROMETHEUS_DEPLOYMENT = "k8s/prometheus-deployment.yaml"
        PROMETHEUS_CONFIG = "k8s/prometheus-configmap.yaml"
        GRAFANA_DEPLOYMENT = "k8s/grafana-deployment.yaml"
        KUBECONFIG = "/home/shandeep/.kube/config"  // Updated for Linux
        WORK_DIR = "${WORKSPACE}" // Ensure the correct workspace directory
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                echo "Cleaning workspace..."
                cleanWs()
            }
        }

        stage('Clone Repository') {
            steps {
                echo "Cloning repository..."
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: 'main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Shandeepsugumar/online-learning-platform.git',
                        credentialsId: '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'
                    ]]
                ])
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker Image: ${DOCKER_IMAGE}"
                    sh '''
                        cd ${WORK_DIR}  // Ensure the correct directory
                        echo "Starting Docker Build..."
                        docker build -t "$DOCKER_IMAGE" .
                    '''
                }
            }
        }

        stage('Push Docker Image') {
    steps {
        script {
            echo "🔹 Starting Docker Image Push to Docker Hub..."

            def dockerUser = "shandeep04"
            def dockerPass = "shandeep-4621"
            def dockerImage = "shandeep04/docker_jenkins_task2:latest"

            sh """
                echo "🔐 Logging in to Docker Hub..."
                echo '${dockerPass}' | docker login -u '${dockerUser}' --password-stdin

                echo "📤 Pushing Docker Image: ${dockerImage}..."
                docker push ${dockerImage}

                echo "✅ Docker Image Push Successful!"
            """
        }
    }
}


        stage('Verify YAML Files') {
            steps {
                script {
                    echo "Verifying Kubernetes YAML Files..."
                    sh '''
                        if [ ! -f "$PROMETHEUS_CONFIG" ]; then
                            echo "ERROR: Prometheus config file not found!" >&2
                            exit 1
                        fi
                        if [ ! -f "$PROMETHEUS_DEPLOYMENT" ]; then
                            echo "ERROR: Prometheus deployment file not found!" >&2
                            exit 1
                        fi
                        if [ ! -f "$GRAFANA_DEPLOYMENT" ]; then
                            echo "ERROR: Grafana deployment file not found!" >&2
                            exit 1
                        fi
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "Deploying Doctor-App to Kubernetes..."
                    sh '''
                        kubectl apply -f "$K8S_DEPLOYMENT" --validate=false
                        kubectl apply -f "$K8S_SERVICE" --validate=false
                    '''
                }
            }
        }

        stage('Deploy Monitoring Stack') {
            steps {
                script {
                    echo "Deploying Prometheus and Grafana..."
                    sh '''
                        echo "Applying Prometheus Config: $PROMETHEUS_CONFIG"
                        kubectl apply -f "$PROMETHEUS_CONFIG"
                        
                        echo "Applying Prometheus Deployment: $PROMETHEUS_DEPLOYMENT"
                        kubectl apply -f "$PROMETHEUS_DEPLOYMENT"
                        
                        echo "Applying Grafana Deployment: $GRAFANA_DEPLOYMENT"
                        kubectl apply -f "$GRAFANA_DEPLOYMENT"
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    echo "Verifying Kubernetes Deployment..."
                    sh '''
                        echo "Listing Pods..."
                        kubectl get pods
                        echo "Listing Services..."
                        kubectl get svc
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Deployment Successful!"
        }
        failure {
            echo "Deployment Failed!"
        }
    }
}
