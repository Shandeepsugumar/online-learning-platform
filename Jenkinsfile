pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "shandeep04/docker_jenkins_task2:latest"
        WORK_DIR = "Responsive-animated-login-signup-form"
        K8S_DEPLOYMENT = "${WORK_DIR}/k8s/doctor-app-deployment.yaml"
        K8S_SERVICE = "${WORK_DIR}/k8s/doctor-app-service.yaml"
        PROMETHEUS_DEPLOYMENT = "${WORK_DIR}/k8s/prometheus-deployment.yaml"
        PROMETHEUS_CONFIG = "${WORK_DIR}/k8s/prometheus-configmap.yaml"
        GRAFANA_DEPLOYMENT = "${WORK_DIR}/k8s/grafana-deployment.yaml"
        KUBECONFIG = "/home/shandeep/.kube/config"  // Updated for Linux
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
                    dir(WORK_DIR) {
                        echo "Building Docker Image: ${DOCKER_IMAGE}"
                        sh '''
                            echo "Starting Docker Build..."
                            docker build -t "$DOCKER_IMAGE" .
                        '''
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    echo "Pushing Docker Image to Docker Hub..."
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                            echo "Logging in to Docker Hub..."
                            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                            echo "Pushing Image: $DOCKER_IMAGE"
                            docker push "$DOCKER_IMAGE"
                        '''
                    }
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
