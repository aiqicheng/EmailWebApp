import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for all entities
  const [profiles, setProfiles] = useState([]);
  const [lists, setLists] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  
  // Form states
  const [profileForm, setProfileForm] = useState({ email: '', name: '', custom_fields: '' });
  const [listForm, setListForm] = useState({ name: '', description: '' });
  const [campaignForm, setCampaignForm] = useState({ 
    name: '', 
    subject: '', 
    content_html: '', 
    target_list_id: '' 
  });
  
  // Loading and error states
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [listsLoading, setListsLoading] = useState(false);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [profilesError, setProfilesError] = useState(null);
  const [listsError, setListsError] = useState(null);
  const [campaignsError, setCampaignsError] = useState(null);

  const API_BASE = 'http://localhost:5001/api';

  // Health check
  const checkBackendHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/health`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setHealthStatus(data.status);
    } catch (err) {
      setError('Failed to connect to backend');
      setHealthStatus(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch functions
  const fetchProfiles = async () => {
    setProfilesLoading(true);
    try {
      const response = await fetch(`${API_BASE}/profiles`);
      const data = await response.json();
      setProfiles(data);
    } catch (err) {
      setProfilesError('Failed to fetch profiles');
    } finally {
      setProfilesLoading(false);
    }
  };

  const fetchLists = async () => {
    setListsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/lists`);
      const data = await response.json();
      setLists(data);
    } catch (err) {
      setListsError('Failed to fetch lists');
    } finally {
      setListsLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    setCampaignsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/campaigns`);
      const data = await response.json();
      setCampaigns(data);
    } catch (err) {
      setCampaignsError('Failed to fetch campaigns');
    } finally {
      setCampaignsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchLists();
    fetchCampaigns();
  }, []);

  // Form handlers
  const handleProfileInputChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleListInputChange = (e) => {
    setListForm({ ...listForm, [e.target.name]: e.target.value });
  };

  const handleCampaignInputChange = (e) => {
    setCampaignForm({ ...campaignForm, [e.target.name]: e.target.value });
  };

  // Create functions
  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setProfilesError(null);
    try {
      const response = await fetch(`${API_BASE}/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create profile');
      }
      setProfileForm({ email: '', name: '', custom_fields: '' });
      fetchProfiles();
    } catch (err) {
      setProfilesError(err.message);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    setListsError(null);
    try {
      const response = await fetch(`${API_BASE}/lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listForm),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create list');
      }
      setListForm({ name: '', description: '' });
      fetchLists();
    } catch (err) {
      setListsError(err.message);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setCampaignsError(null);
    try {
      const response = await fetch(`${API_BASE}/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...campaignForm,
          target_list_id: parseInt(campaignForm.target_list_id)
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create campaign');
      }
      setCampaignForm({ name: '', subject: '', content_html: '', target_list_id: '' });
      fetchCampaigns();
    } catch (err) {
      setCampaignsError(err.message);
    }
  };

  // Delete functions
  const handleDeleteProfile = async (id) => {
    try {
      await fetch(`${API_BASE}/profiles/${id}`, { method: 'DELETE' });
      fetchProfiles();
    } catch (err) {
      setProfilesError('Failed to delete profile');
    }
  };

  const handleDeleteList = async (id) => {
    try {
      await fetch(`${API_BASE}/lists/${id}`, { method: 'DELETE' });
      fetchLists();
    } catch (err) {
      setListsError('Failed to delete list');
    }
  };

  const handleDeleteCampaign = async (id) => {
    try {
      await fetch(`${API_BASE}/campaigns/${id}`, { method: 'DELETE' });
      fetchCampaigns();
    } catch (err) {
      setCampaignsError('Failed to delete campaign');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Email Campaign Web App</h1>
        
        {/* Health Check */}
        <div style={{ marginTop: 32 }}>
          <button onClick={checkBackendHealth} disabled={loading}>
            {loading ? 'Checking...' : 'Check Backend Health'}
          </button>
          {healthStatus && (
            <div style={{ marginTop: 16, color: 'lightgreen' }}>
              Backend status: {healthStatus}
            </div>
          )}
          {error && (
            <div style={{ marginTop: 16, color: 'salmon' }}>
              {error}
            </div>
          )}
        </div>

        <hr style={{ margin: '32px 0', width: '100%' }} />

        {/* Profiles Section */}
        <section style={{ width: '100%', maxWidth: 600, marginBottom: 32 }}>
          <h2>Profiles</h2>
          <form onSubmit={handleCreateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <input
              name="email"
              placeholder="Email"
              value={profileForm.email}
              onChange={handleProfileInputChange}
              required
            />
            <input
              name="name"
              placeholder="Name"
              value={profileForm.name}
              onChange={handleProfileInputChange}
            />
            <textarea
              name="custom_fields"
              placeholder="Custom Fields (JSON)"
              value={profileForm.custom_fields}
              onChange={handleProfileInputChange}
              rows={2}
            />
            <button type="submit">Create Profile</button>
          </form>
          {profilesError && <div style={{ color: 'salmon', marginTop: 8 }}>{profilesError}</div>}
          
          <h3>Existing Profiles</h3>
          {profilesLoading ? (
            <div>Loading profiles...</div>
          ) : profiles.length === 0 ? (
            <div>No profiles found.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {profiles.map((p) => (
                <li key={p.id} style={{ marginBottom: 8, border: '1px solid #444', borderRadius: 4, padding: 8 }}>
                  <div><strong>{p.name || 'No name'}</strong> ({p.email})</div>
                  {p.custom_fields && <div>Custom: {p.custom_fields}</div>}
                  <button style={{ marginTop: 4 }} onClick={() => handleDeleteProfile(p.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Lists Section */}
        <section style={{ width: '100%', maxWidth: 600, marginBottom: 32 }}>
          <h2>Lists</h2>
          <form onSubmit={handleCreateList} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <input
              name="name"
              placeholder="List Name"
              value={listForm.name}
              onChange={handleListInputChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={listForm.description}
              onChange={handleListInputChange}
              rows={2}
            />
            <button type="submit">Create List</button>
          </form>
          {listsError && <div style={{ color: 'salmon', marginTop: 8 }}>{listsError}</div>}
          
          <h3>Existing Lists</h3>
          {listsLoading ? (
            <div>Loading lists...</div>
          ) : lists.length === 0 ? (
            <div>No lists found.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {lists.map((l) => (
                <li key={l.id} style={{ marginBottom: 8, border: '1px solid #444', borderRadius: 4, padding: 8 }}>
                  <div><strong>{l.name}</strong></div>
                  {l.description && <div>{l.description}</div>}
                  <button style={{ marginTop: 4 }} onClick={() => handleDeleteList(l.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Campaigns Section */}
        <section style={{ width: '100%', maxWidth: 600 }}>
          <h2>Campaigns</h2>
          <form onSubmit={handleCreateCampaign} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <input
              name="name"
              placeholder="Campaign Name"
              value={campaignForm.name}
              onChange={handleCampaignInputChange}
              required
            />
            <input
              name="subject"
              placeholder="Subject"
              value={campaignForm.subject}
              onChange={handleCampaignInputChange}
              required
            />
            <textarea
              name="content_html"
              placeholder="HTML Content"
              value={campaignForm.content_html}
              onChange={handleCampaignInputChange}
              required
              rows={4}
            />
            <select
              name="target_list_id"
              value={campaignForm.target_list_id}
              onChange={handleCampaignInputChange}
              required
            >
              <option value="">Select a list</option>
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
            <button type="submit">Create Campaign</button>
          </form>
          {campaignsError && <div style={{ color: 'salmon', marginTop: 8 }}>{campaignsError}</div>}
          
          <h3>Existing Campaigns</h3>
          {campaignsLoading ? (
            <div>Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div>No campaigns found.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {campaigns.map((c) => (
                <li key={c.id} style={{ marginBottom: 16, border: '1px solid #444', borderRadius: 8, padding: 16 }}>
                  <div><strong>{c.name}</strong></div>
                  <div>Subject: {c.subject}</div>
                  <div>Status: {c.status}</div>
                  <div>Target List ID: {c.target_list_id}</div>
                  <div>Content: {c.content_html}</div>
                  <button style={{ marginTop: 8 }} onClick={() => handleDeleteCampaign(c.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </header>
    </div>
  );
}

export default App;
