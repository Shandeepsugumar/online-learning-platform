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
        WORK_DIR = "${WORKSPACE}"  // Ensure the correct workspace directory
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
                        credentialsId: 'github-credentials-id'
                    ]]
                ])
            }
        }

        stage('Verify & Create Missing YAML Files') {
            steps {
                script {
                    echo "Checking for missing YAML files..."
                    sh '''
                        mkdir -p k8s
                        
                        if [ ! -f "$PROMETHEUS_CONFIG" ]; then
                            echo "Creating missing Prometheus Config file..."
                            cat <<EOF > $PROMETHEUS_CONFIG
                            apiVersion: v1
                            kind: ConfigMap
                            metadata:
                              name: prometheus-config
                              namespace: monitoring
                            data:
                              prometheus.yml: |
                                global:
                                  scrape_interval: 15s
                            EOF
                        fi

                        if [ ! -f "$PROMETHEUS_DEPLOYMENT" ]; then
                            echo "ERROR: Prometheus deployment file missing!"
                            exit 1
                        fi

                        if [ ! -f "$GRAFANA_DEPLOYMENT" ]; then
                            echo "ERROR: Grafana deployment file missing!"
                            exit 1
                        fi
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker Image: ${DOCKER_IMAGE}"
                    sh '''
                        cd ${WORK_DIR}
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

                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            echo "🔐 Logging in to Docker Hub..."
                            echo '${DOCKER_PASS}' | docker login -u '${DOCKER_USER}' --password-stdin

                            echo "📤 Pushing Docker Image: ${DOCKER_IMAGE}..."
                            docker push ${DOCKER_IMAGE}

                            echo "✅ Docker Image Push Successful!"
                        """
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "🚀 Deploying Application to Kubernetes..."
                    sh """
                        sudo -u shandeep kubectl apply -f k8s/doctor-app-deployment.yaml
                        sudo -u shandeep kubectl apply -f k8s/doctor-app-service.yaml
                        sudo -u shandeep kubectl get pods
                    """
                }
            }
        }

        stage('Deploy Monitoring Stack') {
            steps {
                script {
                    echo "Deploying Prometheus and Grafana..."
                    sh '''
                        echo "Applying Prometheus Config: $PROMETHEUS_CONFIG"
                        sudo -u shandeep kubectl apply -f "$PROMETHEUS_CONFIG"
                        
                        echo "Applying Prometheus Deployment: $PROMETHEUS_DEPLOYMENT"
                        sudo -u shandeep kubectl apply -f "$PROMETHEUS_DEPLOYMENT"
                        
                        echo "Applying Grafana Deployment: $GRAFANA_DEPLOYMENT"
                        sudo -u shandeep kubectl apply -f "$GRAFANA_DEPLOYMENT"
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
                        sudo -u shandeep kubectl get pods
                        echo "Listing Services..."
                        sudo -u shandeep kubectl get svc
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}
