import json
import os
import boto3
import uuid
import datetime
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')

GROUPS_TABLE_NAME = os.environ['GROUPS_TABLE_NAME']
ACTIVITIES_TABLE_NAME = os.environ['ACTIVITIES_TABLE_NAME']

groups_table = dynamodb.Table(GROUPS_TABLE_NAME)
activities_table = dynamodb.Table(ACTIVITIES_TABLE_NAME)

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            if obj % 1 == 0:
                return int(obj)
            else:
                return float(obj)
        return super(DecimalEncoder, self).default(obj)

def create_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Access-Control-Allow-Origin': '*', 
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
        },
        'body': json.dumps(body, cls=DecimalEncoder)
    }

def lambda_handler(event, context):
    http_method = event.get('httpMethod')
    path = event.get('path')
    
    if http_method == 'OPTIONS':
        return create_response(200, "")

    body = {}
    if event.get('body'):
        body = json.loads(event.get('body'))

    try:
        if http_method == 'GET' and path == '/board':
            response_body = get_board_data()
            return create_response(200, response_body)

        elif http_method == 'POST' and path == '/groups':
            response_body = create_group(body)
            return create_response(201, response_body) 

        elif http_method == 'PUT' and path.startswith('/groups/'):
            group_id = path.split('/')[-1]
            response_body = update_group_title(group_id, body)
            return create_response(200, response_body)
            
        elif http_method == 'DELETE' and path.startswith('/groups/'):
            group_id = path.split('/')[-1]
            response_body = delete_group(group_id)
            return create_response(200, response_body)

        elif http_method == 'POST' and path == '/activities':
            response_body = create_activity(body)
            return create_response(201, response_body)

        elif http_method == 'PUT' and path.startswith('/activities/') and not path.endswith('/move'):
            activity_id = path.split('/')[-1]
            response_body = update_activity(activity_id, body)
            return create_response(200, response_body)
            
        elif http_method == 'PUT' and path.endswith('/move'):
            activity_id = path.split('/')[-2]
            response_body = move_activity(activity_id, body)
            return create_response(200, response_body)

        elif http_method == 'DELETE' and path.startswith('/activities/'):
            activity_id = path.split('/')[-1]
            response_body = delete_activity(activity_id)
            return create_response(200, response_body)

        else:
            return create_response(404, {'error': f'Rota não encontrada: {http_method} {path}'})

    except Exception as e:
        print(f"ERRO: {e}") 
        return create_response(500, {'error': str(e)})

def get_board_data():
    groups_scan = groups_table.scan().get('Items', [])
    activities_scan = activities_table.scan().get('Items', [])
    
    groups_list = sorted(groups_scan, key=lambda g: g.get('orderIndex', 0))
    
    groups_map = {}
    activities_map = {}
    group_order = [] 

    for group in groups_list:
        group_id = group['groupId']
        group['activityIds'] = [] 
        groups_map[group_id] = group
        group_order.append(group_id)

    for activity in activities_scan:
        activity_id = activity['activityId']
        group_id = activity.get('groupId')
        
        activities_map[activity_id] = activity
        
        if group_id and group_id in groups_map:
            groups_map[group_id]['activityIds'].append(activity_id)
            
    for group_id in groups_map:
        groups_map[group_id]['activityIds'].sort(
            key=lambda act_id: activities_map[act_id].get('createdAt', '')
        )

    print("--- DEBUG get_board_data ---")
    print("Groups Map (antes de retornar):", json.dumps(groups_map, cls=DecimalEncoder, indent=2))
    print("Group Order (antes de retornar):", group_order)
    print("--- FIM DEBUG ---")
    
    return {
        "groups": groups_map,
        "activities": activities_map,
        "groupOrder": group_order
    }

def create_group(body):
    title = body.get('title')
    if not title:
        raise ValueError("O 'title' é obrigatório para criar um grupo.")
    group_count = groups_table.scan(Select='COUNT')['Count']
    new_group = {
        'groupId': str(uuid.uuid4()),
        'title': title,
        'orderIndex': group_count
    }
    groups_table.put_item(Item=new_group)
    return new_group