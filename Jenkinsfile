String envByTagName() {
	 String tagName =  "${env.TAG_NAME}";
	 
	 String[] str = tagName.split('-');
	 for (String values: str) {
		 println(values);
		 
		 if (str[0] == 'dev' || str[0] == 'sit' || str[0] == 'uat' || str[0] == 'pte'|| str[0] == 'cpte'|| str[0] == 'prod') {
			return str[0].toString();
		 }
	 }
	 return 'dev';
}

void sendMail(String SUBJECT,String RECEIPIENTS,String MESSAGE){

	/*emailext body: "$MESSAGE",
			subject: "${SUBJECT}",
			to: "${RECEIPIENTS}";*/

	sh "mailx -s \"${SUBJECT}\" ${RECEIPIENTS} <<< \"${MESSAGE}\" ";

}

void sendMailAttach(String SUBJECT,String RECEIPIENTS, String MESSAGE,String ATTACHMENTS){

    /*emailext body: "$MESSAGE",
			subject: "${SUBJECT}",
			to: "${RECEIPIENTS}",
			attachmentsPattern: "${ATTACHMENTS}",
			attachLog: true; */

	sh "mailx -s \"${SUBJECT}\" -a \"${ATTACHMENTS}\" ${RECEIPIENTS} <<< \"${MESSAGE}\" ";

}

void sendNotify(){
	String body = "${currentBuild.currentResult}: Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\n More info at: ${env.BUILD_URL}";
	String subject= "Jenkins Build ${currentBuild.currentResult}: Job ${env.JOB_NAME}";
	String to= "${params.TOMAIL}";
	//sending mail after completion
	try {
		sendMail(subject,to,body);
	} catch (error) {
		echo "Mail Notify failed";
	}
}
void replaceByENV(String fileName){
	replaceInYAML("image","       image: ${env.ECRIMAGENAME}",fileName);
	replaceInYAML("replicas"," replicas: ${params.REPLICAS}",fileName);
}
void replaceInProp(String searchword,String newWord, String filename){
	sh "sed -i '/${searchword}/c\\${newWord}' ${filename} ";
}
void replaceInENV(String fileName,String pass){
	replaceInProp("TF_VAR_rdsPass","TF_VAR_rdsPass=${pass}",fileName);
}
void sendTestReportMail() {
	String body =  "Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} \n Please find attached Jacoco Report. \n More info at: ${env.BUILD_URL}";
	String subject =  "Jenkins Build Job ${env.JOB_NAME} - Jacoco Test Report";
	String to =  "${params.TOMAIL}";
	//sending mail after completion
	try {
		sendMailAttach(subject,to,body,'jreport.zip');
	} catch (error) {
		echo "Jacoco Report mail notify failed";
	}

}

void sendSonarReportMail() {
	String body =  "Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} \n Please find attached Sonar Report. \n More info at: ${env.BUILD_URL}";
	String subject =  "Jenkins Build Job ${env.JOB_NAME} - Sonar Report";
	String to =  "${params.TOMAIL}";
	//sending mail after completion
	try {
		sendMailAttach(subject,to,body,'sonar.zip');
	} catch (error) {
		echo "Sonar Report mail notify failed";
	}

}
def healthCheck() {
	def url= "${params.ENDPOINT}";
	def response = httpRequest url;
	echo "URL: "+ url +"---Status: "+ response.status;
	return response;
}

pipeline {
	agent any

    tools {
        maven 'Maven'
        jdk 'JDK8'
    }

    environment {
		USACTORS = "actors";
	}

//	environment {
//		BBCREDENTIALS = credentials('BBCREDENTIALS');
//		JENKINS_CREDENTIALS = credentials('jenkadm');
//	}

	// Set log rotation, timeout and timestamps in the console
	options {
		disableConcurrentBuilds()
		buildDiscarder(logRotator(numToKeepStr: '5'));
		timestamps();
		timeout(time: 10, unit: 'MINUTES');
		copyArtifactPermission(env.JOB_NAME);
	}

	parameters {
        choice( name: 'DEPLOY_ENV', choices: ['DEV','SIT','UAT','PRE','PROD'], description: 'Environment to Deploy from Branch!');
        booleanParam(name: 'SONAR_USE', defaultValue: true, description: 'Sonar Qube Check!');
        booleanParam(name: 'QUALITY_GATE', defaultValue: false, description: 'Quality Gate Check?');
        //string(name: 'TOMAIL', defaultValue: 'devops-support@morrisonsplc.co.uk', description: 'Default Recipient');
        string(name: 'TOMAIL', defaultValue: 'salih.kabay@morrisonsplc.co.uk', description: 'Default Recipient');
        string(name: 'RDS_PASS', defaultValue: 'xxxx', description: 'RDS Pass?');
    }

	stages {
            stage('Build') {
                steps {
                    script {
                        //input message: "Proceed to ${params.DEPLOY_ENV} deployment? (Click 'Proceed' to continue)";
                        echo "Build Started";
                            dir('./us/"${env.USACTORS}"/'){
                                try {
                                    sh 'docker stop "${env.USACTORS}"'
                                    sh 'docker rm "${env.USACTORS}"'
                                } catch (Exception e){
                                    echo "Build Stage "${env.USACTORS}" container not running"
                                }
                                try {
                                    sh 'docker rmi "${env.USACTORS}":latest'
                                } catch (Exception e){
                                    echo "Build Stage "${env.USACTORS}" image does not exist"
                                }
                                sh '/usr/bin/mvn install -f pom.xml';
                                sh 'cp /var/lib/jenkins/workspace/Movies_main/us/"${env.USACTORS}"/target/*.jar .';
                                sh 'ls -al';
                                sh 'docker build --tag "${env.USACTORS}" . '
                            }

                            dir('./us/movies/'){
                                sh 'docker stop movies'
                                sh 'docker rm movies'
                                sh 'docker rmi movies:latest'
                                sh '/usr/bin/mvn install -f pom.xml';
                                sh 'cp /var/lib/jenkins/workspace/Movies_main/us/movies/target/*.jar .';
                                sh 'ls -al';
                                sh 'docker build --tag movies . '
                            }

                            dir('./us/awards/'){
                                sh 'docker stop awards'
                                sh 'docker rm awards'
                                sh 'docker rmi awards:latest'
                                sh '/usr/bin/mvn install -f pom.xml';
                                sh 'cp /var/lib/jenkins/workspace/Movies_main/us/awards/target/*.jar .';
                                sh 'ls -al';
                                sh 'docker build --tag awards . '
                            }
                        sh "zip -r app.zip ./commercial-hbtw-camunda-range-change/target/*.jar Dockerfile ./commercial-hbtw-camunda-range-change/ops/runApp ./${env.configENVFile}";
                        archiveArtifacts artifacts: 'app.zip', excludes: null, fingerprint: true, onlyIfSuccessful: true;
                        echo "Build Completed";
                    }
                }
            }

        stage('Create infrastructure and deploy code to dev') {

            environment {
                API_KEY = 'true'
                API_SECRET = 'sqlite'
            }
            agent {
                node { label 'docker-slave-cluster' }
            }

            when { branch 'develop' }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'commercial-aws-admin']]) {
                    script {
						replaceInENV("commercial-hbtw-camunda-range-change/configs/develop/dev/application.properties","${params.RDS_PASS}");
                        dir("commercial-hbtw-camunda-range-change/ops/terraform/ecs-repo") {
                            sh ". ../../../utils.sh && execute runTerraform"
                        }
                        sh 'mvn -s mvn-settings.xml clean -Pdev';
                        sh 'mvn -s mvn-settings.xml install -f pom.xml -Dmaven.test.skip=true -Pdev';
                        sh '`aws ecr get-login --no-include-email --region eu-west-1`'
                       echo 'Docker DEV Infra Build..'
                      // copy into directory
                      dir('commercial-hbtw-camunda-range-change'){
                           sh 'mkdir -p docker_build_01'
                           sh 'cp -f target/camrra.jar docker_build_01/camrra.jar'

                           sh 'cp -rf ops/docker/* docker_build_01/'
                           sh 'cp -f ops/runApp docker_build_01/'
                           sh 'chmod 777 -R docker_build_01/*'
                           dir('docker_build_01'){
                                sh '. ../utils.sh && execute buildTagAndPushContainer dev Dockerfile'
                           }
                       }

                       dir("commercial-hbtw-camunda-range-change/ops/terraform/ecs-service") {
                            sh '. ../../../utils.sh && execute runTerraform'
                        }
                        echo 'Docker DEV Infra Build .. Completed'
                    }
                }
            }
        }
    }
	post {
		always {
			
			sendNotify(); /* Send Mail Notification */
			  sendTestReportMail();
			  sendSonarReportMail();
			  deleteDir() /* clean up our workspace */
			  cleanWs(); /* Clean up our workspace */
			
		}
	}
}