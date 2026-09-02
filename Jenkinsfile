pipeline {
    agent any

    environment {
        // ID of the SSH Private Key credential added in Jenkins Credentials Manager
        SSH_CREDENTIAL_ID = 'ec2-ssh-key'
        
        // Target EC2 App Server IP (replace with your App Server's IP address or set via Jenkins environment parameters)
        APP_SERVER_IP = '10.0.1.173'
        APP_SERVER_USER   = 'ubuntu'
        
        // Path on EC2 instance where application files will reside (/opt/apps/winterarc)
        TARGET_DIR        = '/opt/apps/winterarc'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo '📥 Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('Deploy to EC2 Host') {
            steps {
                echo '🚀 Deploying code to AWS EC2 instance via SSH...'
                sshagent(credentials: [env.SSH_CREDENTIAL_ID]) {
                    sh '''
                        # 1. Ensure target directory exists on EC2
                        ssh -o StrictHostKeyChecking=no ${APP_SERVER_USER}@${APP_SERVER_IP} "mkdir -p ${TARGET_DIR}"

                        # 2. Sync codebase to EC2 target directory (excluding node_modules, .git, and local dist)
                        rsync -avz --delete \
                          --exclude='.git' \
                          --exclude='node_modules' \
                          --exclude='frontend/node_modules' \
                          --exclude='backend/node_modules' \
                          --exclude='frontend/dist' \
                          --exclude='backend/dist' \
                          -e "ssh -o StrictHostKeyChecking=no" \
                          ./ ${APP_SERVER_USER}@${APP_SERVER_IP}:${TARGET_DIR}/

                        # 3. Create .env file on EC2 if it does not exist (using .env.example as baseline if needed)
                        ssh -o StrictHostKeyChecking=no ${APP_SERVER_USER}@${APP_SERVER_IP} "
                            cd ${TARGET_DIR}
                            if [ ! -f .env ]; then
                                echo 'Creating default .env from .env.example...'
                                cp .env.example .env
                            fi
                        "

                        # 4. Run Docker Compose to build and start containers
                        ssh -o StrictHostKeyChecking=no ${APP_SERVER_USER}@${APP_SERVER_IP} "
                            cd ${TARGET_DIR}
                            docker compose down --remove-orphans
                            docker compose up -d --build
                            docker image prune -f
                        "
                    '''
                }
            }
        }

        stage('Health & Status Check') {
            steps {
                echo '🔍 Verifying running containers on EC2...'
                sshagent(credentials: [env.SSH_CREDENTIAL_ID]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ${APP_SERVER_USER}@${APP_SERVER_IP} "
                            docker ps --filter 'name=winterarc' --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}'
                        "
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successfully completed!'
        }
        failure {
            echo '❌ Deployment failed. Please inspect stage logs.'
        }
    }
}
