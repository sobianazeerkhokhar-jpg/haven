"""
Authentication Blueprint (Registration, Login, Logout, Password Reset, RBAC Decorators)
"""
from functools import wraps
from flask import Blueprint, request, jsonify, abort
from flask_login import login_user, logout_user, login_required, current_user
from app.models import User
from app.extensions import db

auth_bp = Blueprint("auth", __name__)


def admin_required(f):
    """Enforces server-side Role-Based Access Control for Admin routes."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_staff:
            abort(403, description="Admin or staff privileges required.")
        return f(*args, **kwargs)
    return decorated_function


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or request.form
    full_name = (data.get("full_name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    phone = (data.get("phone") or "").strip()
    password = data.get("password") or ""

    if not full_name or not email or not phone or len(password) < 6:
        return jsonify({"error": "All fields are required and password must be at least 6 characters."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "An account with this email already exists."}), 409

    user = User(full_name=full_name, email=email, phone=phone, role="customer")
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    login_user(user)
    return jsonify({
        "message": "Registration successful.",
        "user": {"id": user.id, "full_name": user.full_name, "email": user.email, "role": user.role}
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or request.form
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password."}), 401

    if not user.is_active:
        return jsonify({"error": "Account has been deactivated."}), 403

    login_user(user, remember=True)
    return jsonify({
        "message": "Authenticated successfully.",
        "user": {"id": user.id, "full_name": user.full_name, "email": user.email, "role": user.role}
    }), 200


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully."}), 200
