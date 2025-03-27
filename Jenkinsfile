pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "shandeep04/docker_jenkins_task2:latest"
        K8S_DEPLOYMENT = "k8s/doctor-app-deployment.yaml"
        K8S_SERVICE = "k8s/doctor-app-service.yaml"
        PROMETHEUS_DEPLOYMENT = "k8s/prometheus-deployment.yaml"
        PROMETHEUS_CONFIG = "k8s/prometheus-configmap.yaml"
        GRAFANA_DEPLOYMENT = "k8s/grafana-deployment.yaml"
        KUBECONFIG = "/home/shandeep/.kube/config"
        WORK_DIR = "${WORKSPACE}"
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                echo "🧹 Cleaning workspace..."
                cleanWs()
            }
        }

        stage('Clone Repository') {
            steps {
                echo "📥 Cloning repository..."
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

        stage('Create YAML Files') {
            steps {
                script {
                    echo '📝 Creating necessary YAML files...'
                    sh '''
                    mkdir -p k8s
                    cat <<EOF > k8s/deployment.yaml
                    apiVersion: apps/v1
                    kind: Deployment
                    metadata:
                      name: my-app
                    spec:
                      replicas: 1
                      selector:
                        matchLabels:
                          app: my-app
                      template:
                        metadata:
                          labels:
                            app: my-app
                        spec:
                          containers:
                          - name: my-app
                            image: ${DOCKER_IMAGE}
                    EOF
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "🐳 Building Docker Image: ${DOCKER_IMAGE}"
                    sh '''
                        cd ${WORK_DIR}
                        echo "🔨 Starting Docker Build..."
                        docker build -t "$DOCKER_IMAGE" .
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    echo "📤 Pushing Docker Image to Docker Hub..."
                    withCredentials([string(credentialsId: 'docker-hub-credential', variable: 'DOCKER_HUB_TOKEN')]) {
                        sh """
                            echo "🔐 Logging in to Docker Hub..."
                            echo "\$DOCKER_HUB_TOKEN" | docker login -u "shandeep04" --password-stdin
                            echo "🚀 Pushing Docker Image: ${DOCKER_IMAGE}..."
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
                    echo "🚀 Starting Minikube and Deploying Application..."
                    sh '''
                        sudo sysctl fs.protected_regular=0
                        minikube start --driver=docker
                        kubectl apply -f k8s/doctor-app-deployment.yaml
                        kubectl apply -f k8s/doctor-app-service.yaml
                        echo "🔍 Checking Pods Status..."
                        kubectl get pods
                    '''
                }
            }
        }

        stage('Deploy Monitoring Stack') {
            steps {
                script {
                    echo "📊 Deploying Prometheus and Grafana..."
                    sh '''
                        echo "📌 Applying Prometheus Config..."
                        kubectl apply -f k8s/prometheus-configmap.yaml
                        echo "📌 Applying Prometheus Deployment..."
                        kubectl apply -f k8s/prometheus-deployment.yaml
                        echo "📌 Applying Grafana Deployment..."
                        kubectl apply -f k8s/grafana-deployment.yaml
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    echo "✅ Verifying Kubernetes Deployment..."
                    sh '''
                        echo "🔍 Listing Pods..."
                        kubectl get pods
                        echo "🔍 Listing Services..."
                        kubectl get svc
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "🎉 Deployment Successful!"
        }
        failure {
            echo "❌ Deployment Failed! Check logs for details."
        }
    }
}
