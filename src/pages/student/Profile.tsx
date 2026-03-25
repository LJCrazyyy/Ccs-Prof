import React, { useState } from 'react';
import { Save, Edit, User } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    idNumber: '2023001',
    program: 'BSCS',
    year: '3rd',
    phone: '+63 9XX XXX XXXX',
    address: 'Cabuyao, Laguna',
    skills: 'React, JavaScript',
    image: ''
  });

  const [tempProfile, setTempProfile] = useState(profile);

  const handleChange = (field: string, value: string) => {
    setTempProfile({ ...tempProfile, [field]: value });
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfile({ ...tempProfile, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 shadow"
          >
            <Edit size={18} /> Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {tempProfile.image ? (
              <img src={tempProfile.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-gray-400" />
            )}
          </div>

          {isEditing && (
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          )}
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Name', field: 'name', editable: true },
            { label: 'ID Number', field: 'idNumber', editable: false },
            { label: 'Email', field: 'email', editable: true },
            { label: 'Program', field: 'program', editable: false },
            { label: 'Year', field: 'year', editable: false },
            { label: 'Phone', field: 'phone', editable: true }
          ].map((item) => (
            <div key={item.field}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {item.label}
              </label>
              <input
                type="text"
                value={(tempProfile as any)[item.field]}
                disabled={!isEditing || !item.editable}
                onChange={(e) => handleChange(item.field, e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  !item.editable ? 'bg-gray-100' : ''
                }`}
              />
            </div>
          ))}

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={tempProfile.address}
              disabled={!isEditing}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Skills */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Skills</label>
            <input
              type="text"
              value={tempProfile.skills}
              disabled={!isEditing}
              onChange={(e) => handleChange('skills', e.target.value)}
              placeholder="e.g. React, UI Design, SQL"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 shadow"
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
