from flask import Blueprint, request
from auth.utils import user_required
from infrastructure.db import db  
from todolist.models import Todolist
from marshmallow import Schema, fields, ValidationError
from datetime import datetime, timedelta
from sqlalchemy.exc import SQLAlchemyError

todolist_blueprint = Blueprint("todolist", __name__)

class TodosSchema(Schema):
    activity = fields.String(required=True)
    priority = fields.String(required=True)
    status = fields.String(required=True)

@todolist_blueprint.route("/", methods=["POST"])
@user_required
def create_todolist(user_id):
    data = request.get_json()

    try:
        loaded_data = TodosSchema().load(data)
    except ValidationError as err:
        return {"success": False, "message": err.messages }, 400

    new_todo = Todolist(
        activity=loaded_data['activity'],
        priority=loaded_data['priority'],  
        status=loaded_data['status'],  
        dueDate=datetime.utcnow() + timedelta(days=7), 
        createdDate=datetime.utcnow(), 
        user_id=user_id
    )
    
    db.session.add(new_todo)
    db.session.commit()

    return {"success": True, "message": "Successfully created a todo", "data": data}, 200


@todolist_blueprint.route("/", methods=["GET"])
@user_required
def get_all_todolist():
    todos = Todolist.query.all()

    result_todos = []
    for todo in todos:
        serialized_todo = {
            "id": todo.id,
            "activity": todo.activity,
            "priority": todo.priority.value,  
            "status": todo.status.value, 
            "dueDate": todo.dueDate.strftime("%Y-%m-%d %H:%M:%S"),
            "createdDate": todo.createdDate.strftime("%Y-%m-%d %H:%M:%S")
        }
        result_todos.append(serialized_todo)

    return {"success": True, "message": "List of todos", "data": result_todos}, 200

@todolist_blueprint.route("/<int:todo_id>", methods=["PUT"])
@user_required
def update_todolist(user_id, todo_id):
    try:
        data = request.get_json()
        priority = data.get("priority")
        status = data.get("status")
        activity = data.get("activity")
        dueDate = data.get("dueDate")

        todo = Todolist.query.get(todo_id)
        if not todo:
            return {"error": "Todo item not found"}, 404

        # Update fields only if the respective data is provided in the request
        if priority is not None:
            todo.priority = priority
        if status is not None:
            todo.status = status
        if activity is not None:
            todo.activity = activity
        if dueDate is not None:
            todo.dueDate = dueDate

        db.session.commit()

        return {"success": True, "message": "Successfully updated a todo", "data": todo_id }, 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return {"error": "An error occurred while updating the todo"}, 500


@todolist_blueprint.route("/<int:todo_id>", methods=["DELETE"])
@user_required
def delete_todolist(user_id, todo_id):
    todo = Todolist.query.get(todo_id)
    if not todo:
        return {"error": "Todo item not found"}, 404

    db.session.delete(todo)
    db.session.commit()

    return {"success": True, "message": "Todo item deleted", "data": todo_id}, 200
