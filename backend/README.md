# Backend - API Serverless (Kanban Board)

Esta pasta contém o código-fonte da API serverless para o sistema de controle de atividades.

A API é construída usando AWS Lambda (Python), API Gateway e DynamoDB, e é gerenciada pelo AWS SAM (Serverless Application Model).

## 🛠️ Tecnologias
* Python 3.11
* Boto3 (AWS SDK para Python)
* AWS SAM CLI
* AWS Lambda
* AWS API Gateway
* AWS DynamoDB

## 📦 Pré-requisitos

Para fazer o deploy desta API, você precisará ter instalado:
* [AWS CLI](https://aws.amazon.com/cli/) (configurado com suas credenciais)
* [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
* Python 3.8 ou superior

## 🚀 Deploy da API

1.  **Buildar o Projeto:**
    * No terminal, dentro desta pasta (`/backend`), execute o comando:
    * `sam build`

2.  **Fazer o Deploy (Interativo):**
    * Execute o comando de deploy guiado. Ele fará perguntas sobre o nome da "stack", região da AWS, etc.
    * `sam deploy --guided`
    * (Você pode aceitar a maioria dos padrões. Confirme as permissões de criação de roles do IAM quando solicitado).

3.  **Sucesso!**
    * Ao final do deploy, o terminal do SAM exibirá as "Outputs".
    * Procure pelo valor da `ApiUrl`. Esta é a URL base da sua API (ex: `https://xxxxxx.execute-api.us-east-1.amazonaws.com/Prod/`).
    * Você precisará desta URL para configurar o frontend.

## 🔀 Endpoints da API

A API expõe os seguintes endpoints (todos sob a `ApiUrl`):

* `GET /board`: Retorna o estado completo do quadro (grupos, atividades e ordem).
* `POST /groups`: Cria um novo grupo.
    * Body: `{ "title": "Novo Grupo" }`
* `PUT /groups/{groupId}`: Atualiza o título de um grupo.
    * Body: `{ "title": "Título Atualizado" }`
* `POST /activities`: Cria uma nova atividade.
    * Body: `{ "description": "...", "dueDate": "...", "isCompleted": false, "groupId": "..." }`
* `PUT /activities/{activityId}`: Atualiza os dados de uma atividade.
    * Body: `{ "description": "...", "dueDate": "...", "isCompleted": true }`
* `PUT /activities/{activityId}/move`: Move uma atividade para um novo grupo.
    * Body: `{ "newGroupId": "g-destino-xxx" }`