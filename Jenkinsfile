pipeline {
    agent none

    stages {
        stage('Build') {
            parallel {
                stage('Linux x64') {
                    agent {
                        dockerfile {
                            filename '.jenkins/Dockerfile'
                            additionalBuildArgs '--pull'
                            args '-v /usr/share/jenkins/cache:/build_cache'
                        }
                    }
                    environment {
                        CARGO_HOME = '/build_cache/cargo'
                    }
                    stages {
                        stage('Test') {
                            steps {
                                dir('packages/extension') {
                                    sh 'cargo test'
                                }
                            }
                        }
                        stage('Build') {
                            steps {
                                dir('packages/extension') {
                                    sh 'cargo build --release --message-format json > cargo-build.json'
                                }
                                fileOperations([
                                    folderCreateOperation('linux-x86_64'),
                                    fileCopyOperation(targetLocation: 'linux-x86_64/extensions/', includes: 'packages/extension/target/release/*_extension.so', flattenFiles: true)
                                ])
                                archiveArtifacts artifacts: 'linux-x86_64/**/*', fingerprint: true
                                //recordIssues failOnError: false, enabledForFailure: true, tool: cargo(pattern: 'cargo-build.json')
                            }
                        }
                    }
                    post {
                        always {
                            cleanWs()
                        }
                    }
                }

                stage('Windows x64') {
                    agent {
                        label "windows"
                    }
                    stages {
                        stage('Build') {
                            steps {
                                dir('packages/extension') {
                                    bat 'cargo build --release'
                                }
                                fileOperations([
                                    folderCreateOperation('win32-x86_64'),
                                    fileCopyOperation(targetLocation: 'win32-x86_64/extensions/', includes: 'packages/extension/target/release/*_extension.dll', flattenFiles: true)
                                ])
                                archiveArtifacts artifacts: 'win32-x86_64/**/*', fingerprint: true
                            }
                        }
                    }
                    post {
                        always {
                            cleanWs()
                        }
                    }
                }

                stage('macOS x64') {
                    agent {
                        label "osx"
                    }
                    stages {
                        stage('Build') {
                            steps {
                                dir('packages/extension') {
                                    sh 'cargo build --release --message-format json > cargo-build.json'
                                }
                                fileOperations([
                                    folderCreateOperation('osx-x86_64'),
                                    fileCopyOperation(targetLocation: 'osx-x86_64/extensions/', includes: 'packages/extension/target/release/*_extension.dylib', flattenFiles: true)
                                ])
                                archiveArtifacts artifacts: 'osx-x86_64/**/*', fingerprint: true
                            }
                        }
                    }
                    post {
                        always {
                            cleanWs()
                        }
                    }
                }

                stage('Api') {
                    agent {
                        label "docker"
                    }
                    stages {
                        stage('Build') {
                            steps {
                                script {
                                    docker.build("docker.pkg.github.com/rustic-music-player/party-mode/api:latest", './packages/api').push()
                                }
                            }
                        }
                    }
                }

                stage('Client') {
                    agent {
                        label "docker"
                    }
                    stages {
                        stage('Build') {
                            steps {
                                script {
                                    docker.build("docker.pkg.github.com/rustic-music-player/party-mode/client:latest", './packages/client').push()
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
