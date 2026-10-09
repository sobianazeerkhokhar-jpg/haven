"""
Handmade Haven Flask Application Factory
Registers Storefront, Auth, Cart, Checkout, and Sobia's Protected Admin Blueprints.
"""
from flask import Flask, jsonify
from config import config_by_name
from app.extensions import db, migrate, login_manager, csrf


def create_app(config_name: str = "development") -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_by_name.get(config_name, config_by_name["development"]))

    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    csrf.init_app(app)

    from app.auth.routes import auth_bp
    from app.storefront.routes import storefront_bp
    from app.cart.routes import cart_bp
    from app.checkout.routes import checkout_bp
    from app.admin.routes import admin_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(storefront_bp, url_prefix="/api/storefront")
    app.register_blueprint(cart_bp, url_prefix="/api/cart")
    app.register_blueprint(checkout_bp, url_prefix="/api/checkout")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    @app.errorhandler(403)
    def handle_forbidden(err):
        return jsonify({"error": str(err.description or "Forbidden")}), 403

    @app.errorhandler(404)
    def handle_not_found(err):
        return jsonify({"error": "Resource not found."}), 404

    return app
