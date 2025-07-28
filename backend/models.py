from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSON

db = SQLAlchemy()

# Association table for many-to-many relationship between profiles and lists
profile_list = db.Table('profile_list',
    db.Column('profile_id', db.Integer, db.ForeignKey('profile.id'), primary_key=True),
    db.Column('list_id', db.Integer, db.ForeignKey('list.id'), primary_key=True)
)

class Profile(db.Model):
    __tablename__ = 'profile'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    name = db.Column(db.String(255), nullable=True)
    custom_fields = db.Column(db.Text, nullable=True)  # JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    lists = db.relationship('List', secondary=profile_list, back_populates='profiles')
    email_logs = db.relationship('EmailLog', back_populates='profile')
    events = db.relationship('Event', back_populates='profile')

class List(db.Model):
    __tablename__ = 'list'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    profiles = db.relationship('Profile', secondary=profile_list, back_populates='lists')
    campaigns = db.relationship('Campaign', back_populates='target_list')

class Campaign(db.Model):
    __tablename__ = 'campaign'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    subject = db.Column(db.String(255), nullable=False)
    content_html = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='draft', nullable=False)  # draft, scheduled, sending, sent, failed
    scheduled_time = db.Column(db.DateTime, nullable=True)
    target_list_id = db.Column(db.Integer, db.ForeignKey('list.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    target_list = db.relationship('List', back_populates='campaigns')
    email_logs = db.relationship('EmailLog', back_populates='campaign')

class Event(db.Model):
    __tablename__ = 'event'
    
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('profile.id'), nullable=False)
    event_type = db.Column(db.String(100), nullable=False)
    event_data = db.Column(db.Text, nullable=True)  # JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    profile = db.relationship('Profile', back_populates='events')

class EmailLog(db.Model):
    __tablename__ = 'email_log'
    
    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaign.id'), nullable=False)
    profile_id = db.Column(db.Integer, db.ForeignKey('profile.id'), nullable=False)
    postmark_message_id = db.Column(db.String(255), nullable=True, index=True)
    status = db.Column(db.String(50), nullable=False)  # sent, delivered, opened, clicked, bounced, failed
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    event_details = db.Column(db.Text, nullable=True)  # JSON string for webhook payload
    
    # Relationships
    campaign = db.relationship('Campaign', back_populates='email_logs')
    profile = db.relationship('Profile', back_populates='email_logs')