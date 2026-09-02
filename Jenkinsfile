pipeline {
    agent any

    environment {
        SSH_CREDENTIAL_ID = 'ec2-ssh-key'
        APP_SERVER_IP     = '10.0.1.173'
        APP_SERVER_USER   = 'ubuntu'
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
                echo '🚀 Deploying WinterArc to AWS EC2...'

                sshagent(credentials: [env.SSH_CREDENTIAL_ID]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no \
                            ${APP_SERVER_USER}@${APP_SERVER_IP} \
                            "mkdir -p ${TARGET_DIR}"

                        rsync -avz --delete \
                            --exclude='.git' \
                            --exclude='node_modules' \
                            --exclude='frontend/node_modules' \
                            --exclude='backend/node_modules' \
                            --exclude='frontend/dist' \
                            --exclude='backend/dist' \
                            -e "ssh -o StrictHostKeyChecking=no" \
                            ./ ${APP_SERVER_USER}@${APP_SERVER_IP}:${TARGET_DIR}/

                        ssh -o StrictHostKeyChecking=no \
                            ${APP_SERVER_USER}@${APP_SERVER_IP} "
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
                echo '🔍 Checking WinterArc containers...'

                sshagent(credentials: [env.SSH_CREDENTIAL_ID]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no \
                            ${APP_SERVER_USER}@${APP_SERVER_IP} "
                                docker ps \
                                --filter 'name=winterarc' \
                                --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}'
                            "
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ WinterArc deployment completed successfully!'
        }

        failure {
            echo '❌ WinterArc deployment failed. Check Jenkins logs.'
        }
    }
}
