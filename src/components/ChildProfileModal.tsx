import React, { useState } from 'react';
import { ChildProfile, AgeGroup } from '../types';
import { sound } from '../services/soundService';
import { X, Plus, Star, Check } from 'lucide-react';

interface ChildProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: ChildProfile[];
  currentProfile: ChildProfile;
  onSelectProfile: (profile: ChildProfile) => void;
  onCreateProfile: (profile: ChildProfile) => void;
}

export const ChildProfileModal: React.FC<ChildProfileModalProps> = ({
  isOpen,
  onClose,
  profiles,
  currentProfile,
  onSelectProfile,
  onCreateProfile,
}) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('🐼');
  const [newAge, setNewAge] = useState<AgeGroup>('5-6');

  if (!isOpen) return null;

  const avatars = ['🐼', '🦁', '🐰', '🐯', '🐘', '🦄', '🚀', '⭐'];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProfile: ChildProfile = {
      id: 'profile-' + Date.now(),
      name: newName.trim(),
      avatar: newAvatar,
      ageGroup: newAge,
      language: 'english',
      stars: 5,
      completedLessons: [],
      favoriteMascot: 'Panda',
      createdAt: Date.now(),
      timeSpentMinutes: 0,
    };

    sound.playSuccess();
    onCreateProfile(newProfile);
    setShowCreate(false);
    setNewName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-4 border-sky-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-black text-slate-900 font-display mb-1 flex items-center gap-2">
          <span>👶 Who is Learning Today?</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Select or add a child profile to track your stars!
        </p>

        {!showCreate ? (
          <div className="space-y-3">
            {profiles.map((p) => {
              const isSelected = p.id === currentProfile.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    sound.playPop();
                    onSelectProfile(p);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-1 bg-white rounded-xl shadow-2xs border border-slate-100">
                      {p.avatar}
                    </span>
                    <div className="text-left">
                      <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        <span>{p.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-sky-600 stroke-[3]" />}
                      </div>
                      <div className="text-[11px] font-bold text-slate-500">
                        Ages {p.ageGroup}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 rounded-full text-xs font-black text-amber-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{p.stars}</span>
                  </div>
                </button>
              );
            })}

            <button
              onClick={() => setShowCreate(true)}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-sky-300 hover:border-sky-500 text-sky-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors hover:bg-sky-50"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Little Learner</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Nickname
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Ayan, Maya, Leo"
                maxLength={15}
                required
                autoFocus
                className="w-full py-2 px-3 rounded-xl border border-slate-300 text-sm font-bold focus:border-sky-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Pick Avatar
              </label>
              <div className="flex gap-2 flex-wrap">
                {avatars.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setNewAvatar(av)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border-2 ${
                      newAvatar === av
                        ? 'border-sky-500 bg-sky-50 scale-105'
                        : 'border-slate-200'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Age Group
              </label>
              <select
                value={newAge}
                onChange={(e) => setNewAge(e.target.value as AgeGroup)}
                className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="2-4">Ages 2–4 (Preschool)</option>
                <option value="5-6">Ages 5–6 (Kindergarten)</option>
                <option value="7-8">Ages 7–8 (Junior Genius)</option>
                <option value="9-10">Ages 9–10 (Smart Explorer)</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-black text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-xs"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
