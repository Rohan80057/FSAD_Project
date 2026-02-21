import { User, Mail, Phone, MapPin, Shield, Camera, Save, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authService } from '../../utils/auth';
import { toast } from 'sonner';

export function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
    idType: 'Passport',
    idNumber: '****6789',
    idStatus: 'verified',
    accountType: 'Premium',
    memberSince: '2024-01-15',
  });

  useEffect(() => {
    const loadProfile = async () => {
      const user = await authService.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      
      setProfile(prev => ({
        ...prev,
        name: user.user_metadata?.name || 'User',
        email: user.email || '',
      }));
      setLoading(false);
    };

    loadProfile();
  }, [navigate]);

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully!');
    // In production, this would call your API to update the profile
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      toast.success('Signed out successfully!');
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12 flex items-center justify-center">
        <div className="text-xl text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16 flex items-center justify-between">
          <div>
            <h1 className="text-6xl tracking-tight mb-4">Profile Settings</h1>
            <p className="text-xl text-muted-foreground">Manage your account information and preferences</p>
          </div>
          {!isEditing ? (
            <div className="flex space-x-4">
              <button
                onClick={handleSignOut}
                className="px-6 py-3 border border-border hover:bg-muted transition-colors flex items-center"
              >
                <LogOut size={20} className="mr-2" />
                Sign Out
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 border border-border hover:bg-muted transition-colors"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center"
              >
                <Save size={20} className="mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Profile Photo */}
        <div className="border border-border p-8 mb-8">
          <h2 className="text-2xl tracking-tight mb-6">Profile Photo</h2>
          <div className="flex items-center space-x-6">
            <div className="w-32 h-32 bg-muted border border-border flex items-center justify-center">
              <User size={48} className="text-muted-foreground" />
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Upload a profile photo to personalize your account</p>
              <button className="inline-flex items-center px-4 py-2 border border-border hover:bg-muted transition-colors text-sm">
                <Camera size={16} className="mr-2" />
                Upload Photo
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="border border-border mb-8">
          <div className="p-8 border-b border-border">
            <h2 className="text-2xl tracking-tight">Personal Information</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm tracking-wide">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wide">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wide">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ID Verification */}
        <div className="border border-border mb-8">
          <div className="p-8 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl tracking-tight">Identity Verification</h2>
              <span className={`text-xs px-3 py-1 border ${
                profile.idStatus === 'verified' 
                  ? 'border-success text-success' 
                  : 'border-muted-foreground text-muted-foreground'
              }`}>
                {profile.idStatus.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-start space-x-4 p-6 bg-muted/30">
              <Shield size={24} className="text-success flex-shrink-0 mt-1" />
              <div>
                <div className="font-medium mb-1">Your identity has been verified</div>
                <p className="text-sm text-muted-foreground">
                  Your account is fully verified and you have access to all features.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm tracking-wide">ID Type</label>
                <input
                  type="text"
                  value={profile.idType}
                  disabled
                  className="w-full px-4 py-3 border border-border bg-muted opacity-50"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wide">ID Number</label>
                <input
                  type="text"
                  value={profile.idNumber}
                  disabled
                  className="w-full px-4 py-3 border border-border bg-muted opacity-50"
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              * For security reasons, ID information cannot be changed. Contact support if you need to update this information.
            </p>
          </div>
        </div>

        {/* Account Information */}
        <div className="border border-border">
          <div className="p-8 border-b border-border">
            <h2 className="text-2xl tracking-tight">Account Information</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Account Type</div>
                <div className="text-lg tracking-tight">{profile.accountType}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Member Since</div>
                <div className="text-lg tracking-tight">
                  {new Date(profile.memberSince).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <button className="text-sm text-destructive hover:underline">
                Close Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}