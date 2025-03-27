stage('Verify & Create Missing YAML Files') {
    steps {
        script {
            echo "Checking for missing YAML files..."
            sh '''
                mkdir -p k8s  # Ensure k8s directory exists
                
                # Check and create Prometheus config file if missing
                if [ ! -f "k8s/prometheus-configmap.yaml" ]; then
                    echo "Creating missing k8s/prometheus-configmap.yaml"
                    cat <<EOF > k8s/prometheus-configmap.yaml
                    apiVersion: v1
                    kind: ConfigMap
                    metadata:
                      name: prometheus-config
                    data:
                      prometheus.yml: |
                        global:
                          scrape_interval: 15s
                        scrape_configs:
                          - job_name: 'kubernetes'
                            static_configs:
                              - targets: ['localhost:9090']
                    EOF
                fi

                # Check and create Prometheus deployment file if missing
                if [ ! -f "k8s/prometheus-deployment.yaml" ]; then
                    echo "Creating missing k8s/prometheus-deployment.yaml"
                    cat <<EOF > k8s/prometheus-deployment.yaml
                    apiVersion: apps/v1
                    kind: Deployment
                    metadata:
                      name: prometheus
                    spec:
                      replicas: 1
                      selector:
                        matchLabels:
                          app: prometheus
                      template:
                        metadata:
                          labels:
                            app: prometheus
                        spec:
                          containers:
                          - name: prometheus
                            image: prom/prometheus
                            ports:
                            - containerPort: 9090
                    EOF
                fi

                # Check and create Grafana deployment file if missing
                if [ ! -f "k8s/grafana-deployment.yaml" ]; then
                    echo "Creating missing k8s/grafana-deployment.yaml"
                    cat <<EOF > k8s/grafana-deployment.yaml
                    apiVersion: apps/v1
                    kind: Deployment
                    metadata:
                      name: grafana
                    spec:
                      replicas: 1
                      selector:
                        matchLabels:
                          app: grafana
                      template:
                        metadata:
                          labels:
                            app: grafana
                        spec:
                          containers:
                          - name: grafana
                            image: grafana/grafana
                            ports:
                            - containerPort: 3000
                    EOF
                fi
            '''
        }
    }
}
