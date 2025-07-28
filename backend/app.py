from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, Profile, List, Campaign, Event, EmailLog
import os

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///email_campaign.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
CORS(app)

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'ok'})

# Profile endpoints
@app.route('/api/profiles', methods=['GET'])
def list_profiles():
    try:
        profiles = Profile.query.all()
        return jsonify([{
            'id': p.id,
            'email': p.email,
            'name': p.name,
            'custom_fields': p.custom_fields,
            'created_at': p.created_at.isoformat(),
            'updated_at': p.updated_at.isoformat()
        } for p in profiles])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profiles', methods=['POST'])
def create_profile():
    try:
        data = request.get_json()
        if not data or 'email' not in data:
            return jsonify({'error': 'Email is required'}), 400
        
        profile = Profile(
            email=data['email'],
            name=data.get('name'),
            custom_fields=data.get('custom_fields')
        )
        db.session.add(profile)
        db.session.commit()
        
        return jsonify({
            'id': profile.id,
            'email': profile.email,
            'name': profile.name,
            'custom_fields': profile.custom_fields,
            'created_at': profile.created_at.isoformat(),
            'updated_at': profile.updated_at.isoformat()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# List endpoints
@app.route('/api/lists', methods=['GET'])
def list_lists():
    try:
        lists = List.query.all()
        return jsonify([{
            'id': l.id,
            'name': l.name,
            'description': l.description,
            'created_at': l.created_at.isoformat(),
            'updated_at': l.updated_at.isoformat()
        } for l in lists])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/lists', methods=['POST'])
def create_list():
    try:
        data = request.get_json()
        if not data or 'name' not in data:
            return jsonify({'error': 'Name is required'}), 400
        
        list_obj = List(
            name=data['name'],
            description=data.get('description')
        )
        db.session.add(list_obj)
        db.session.commit()
        
        return jsonify({
            'id': list_obj.id,
            'name': list_obj.name,
            'description': list_obj.description,
            'created_at': list_obj.created_at.isoformat(),
            'updated_at': list_obj.updated_at.isoformat()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Campaign endpoints (updated to use database)
@app.route('/api/campaigns', methods=['GET'])
def list_campaigns():
    try:
        campaigns = Campaign.query.all()
        return jsonify([{
            'id': c.id,
            'name': c.name,
            'subject': c.subject,
            'content_html': c.content_html,
            'status': c.status,
            'scheduled_time': c.scheduled_time.isoformat() if c.scheduled_time else None,
            'target_list_id': c.target_list_id,
            'created_at': c.created_at.isoformat(),
            'updated_at': c.updated_at.isoformat()
        } for c in campaigns])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/campaigns', methods=['POST'])
def create_campaign():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ('name', 'subject', 'content_html', 'target_list_id')):
            return jsonify({'error': 'Missing required fields'}), 400
        
        campaign = Campaign(
            name=data['name'],
            subject=data['subject'],
            content_html=data['content_html'],
            target_list_id=data['target_list_id'],
            status=data.get('status', 'draft'),
            scheduled_time=data.get('scheduled_time')
        )
        db.session.add(campaign)
        db.session.commit()
        
        return jsonify({
            'id': campaign.id,
            'name': campaign.name,
            'subject': campaign.subject,
            'content_html': campaign.content_html,
            'status': campaign.status,
            'scheduled_time': campaign.scheduled_time.isoformat() if campaign.scheduled_time else None,
            'target_list_id': campaign.target_list_id,
            'created_at': campaign.created_at.isoformat(),
            'updated_at': campaign.updated_at.isoformat()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/campaigns/<int:campaign_id>', methods=['DELETE'])
def delete_campaign(campaign_id):
    try:
        campaign = Campaign.query.get_or_404(campaign_id)
        db.session.delete(campaign)
        db.session.commit()
        return jsonify({'result': 'deleted'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001) 