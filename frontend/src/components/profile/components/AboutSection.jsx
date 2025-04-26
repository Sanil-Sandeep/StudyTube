import React from 'react';

const AboutSection = ({
  user,
  isEditing,
  editForm,
  setEditForm,
  handleEditSubmit,
  handleSkillChange,
  isUploading,
  imageUpload,
  imagePreview,
  setImageUpload,
  setImagePreview,
  triggerFileInput,
  fileInputRef
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-lg font-semibold text-ExtraDarkColor mb-4 flex items-center border-b pb-2">
        <i className='bx bx-user-circle text-xl mr-2 text-DarkColor'></i>About
      </h2>
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {/* Mobile profile picture upload */}
          <div className="md:hidden mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
            <button
              type="button"
              onClick={triggerFileInput}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <i className='bx bx-camera mr-2'></i>
              {imageUpload ? 'Change Image' : 'Upload Image'}
            </button>
            {imagePreview && (
              <div className="mt-2 relative h-24 w-24 mx-auto">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageUpload(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                >
                  <i className='bx bx-x'></i>
                </button>
              </div>
            )}
          </div>

          {/* Personal information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-DarkColor transition-colors">First Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <i className='bx bx-user'></i>
                </span>
                <input
                  type="text"
                  value={editForm.firstName || ''}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-DarkColor focus:border-DarkColor transition-colors bg-gray-50 hover:bg-white"
                  placeholder="First Name"
                />
              </div>
            </div>
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-DarkColor transition-colors">Last Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <i className='bx bx-user'></i>
                </span>
                <input
                  type="text"
                  value={editForm.lastName || ''}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-DarkColor focus:border-DarkColor transition-colors bg-gray-50 hover:bg-white"
                  placeholder="Last Name"
                />
              </div>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-DarkColor transition-colors flex items-center">
              <i className='bx bx-message-square-detail mr-1 text-gray-500'></i> Bio
            </label>
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-DarkColor focus:border-DarkColor transition-colors bg-gray-50 hover:bg-white"
              rows="4"
              placeholder="Tell us about yourself"
            ></textarea>
            <div className="text-xs text-gray-500 mt-1 text-right">
              {editForm.bio ? editForm.bio.length : 0} characters
            </div>
          </div>
          
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-DarkColor transition-colors flex items-center">
              <i className='bx bx-code-alt mr-1 text-gray-500'></i> Skills
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <i className='bx bx-list-ul'></i>
              </span>
              <input
                type="text"
                value={editForm.skills.join(', ')}
                onChange={handleSkillChange}
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-DarkColor focus:border-DarkColor transition-colors bg-gray-50 hover:bg-white"
                placeholder="JavaScript, React, etc."
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Separate skills with commas
            </div>
            
            {/* Preview of skills as tags */}
            {editForm.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {editForm.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-DarkColor text-xs rounded-full border border-gray-200">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full px-4 py-3 bg-gradient-to-r from-DarkColor to-ExtraDarkColor text-white rounded-lg hover:opacity-90 transition-all shadow-sm flex items-center justify-center ${isUploading ? 'opacity-50 cursor-not-allowed' : 'transform hover:-translate-y-1'}`}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <i className='bx bx-save mr-2'></i> Save Changes
              </>
            )}
          </button>
        </form>
      ) : (
        <>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-lg mb-6 border-l-4 border-DarkColor shadow-sm">
            {user.bio ? (
              <p className="text-gray-700 leading-relaxed italic">{user.bio}</p>
            ) : (
              <p className="text-gray-500 italic text-center">No bio provided yet.</p>
            )}
          </div>
          
          <h3 className="text-md font-semibold text-ExtraDarkColor mb-3 flex items-center">
            <i className='bx bx-code-alt text-DarkColor mr-2'></i>Skills
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {user.skills && user.skills.length > 0 ? (
              user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-DarkColor rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-gray-300"
                >
                  {skill}
                </span>
              ))
            ) : (
              <div className="w-full text-center py-4 bg-gray-50 rounded-lg">
                <i className='bx bx-code-alt text-3xl text-gray-300 mb-2'></i>
                <p className="text-gray-500 text-sm">No skills added yet.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AboutSection;