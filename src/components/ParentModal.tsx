import React, { useState } from 'react';
import { ChildProfile, AppLanguage, AgeGroup } from '../types';
import { sound } from '../services/soundService';
import {
  Lock,
  Unlock,
  CheckCircle,
  X,
  Volume2,
  Clock,
  Trash2,
  User,
  Star,
  Award,
} from 'lucide-react';

interface ParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: ChildProfile[];
  currentProfile: ChildProfile;
  onSelectProfile: (profile: ChildProfile) => void;
  onUpdateProfile: (updated: ChildProfile) => void;
  onResetProgress: () => void;
}

export const ParentModal: React.FC<ParentModalProps> = ({
  isOpen,
  onClose,
  profiles,
  currentProfile,
  onSelectProfile,
  onUpdateProfile,
  onResetProgress,
}) => {
  // Math gate challenge: generate random addition
  const [num1] = useState(() => Math.floor(Math.random() * 8) + 3);
  const [num2] = useState(() => Math.floor(Math.random() * 8) + 2);
  const correctAnswer = num1 + num2;

  const [enteredAnswer, setEnteredAnswer] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [gateError, setGateError] = useState(false);

  // Edit profile state
  const [editingName, setEditingName] = useState(currentProfile.name);
  const [editingAge, setEditingAge] = useState<AgeGroup>(currentProfile.ageGroup);
  const [editingLang, setEditingLang] = useState<AppLanguage>(currentProfile.language);
  const [editingAvatar, setEditingAvatar] = useState(currentProfile.avatar);
  const [screenLimit, setScreenLimit] = useState(30);

  if (!isOpen) return null;

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(enteredAnswer.trim(), 10) === correctAnswer) {
      sound.playSuccess();
      setIsUnlocked(true);
      setGateError(false);
    } else {
      sound.playBoing();
      setGateError(true);
      setEnteredAnswer('');
    }
  };

  const handleSaveProfile = () => {
    sound.playSuccess();
    onUpdateProfile({
      ...currentProfile,
      name: editingName.trim() || 'Little Genius',
      ageGroup: editingAge,
      language: editingLang,
      avatar: editingAvatar,
    });
    onClose();
  };

  const avatarOptions = ['🐼', '🦁', '🐰', '🐯', '🐘', '🦄', '🚀', '⭐'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-amber-200 p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Screen (Parental Gate) */}
        {!isUnlocked ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-300 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 font-display">
              Parents Zone Access
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xs mx-auto">
              To verify you are a parent, please answer this simple question:
            </p>

            <form onSubmit={handleVerifyGate} className="mt-6 flex flex-col items-center gap-4">
              <div className="px-6 py-3 rounded-2xl bg-amber-50 border-2 border-amber-200 text-xl font-black text-amber-900 font-mono tracking-wider">
                {num1} + {num2} = ?
              </div>

              <input
                type="number"
                value={enteredAnswer}
                onChange={(e) => setEnteredAnswer(e.target.value)}
                placeholder="Enter answer"
                autoFocus
                className="w-40 text-center py-2.5 px-4 text-xl font-bold rounded-xl border-2 border-slate-300 focus:border-amber-500 focus:outline-hidden"
              />

              {gateError && (
                <span className="text-xs font-bold text-rose-500">
                  Oops! That's not quite right. Please try again!
                </span>
              )}

              <button
                type="submit"
                className="py-3 px-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md active:scale-95 transition-transform btn-3d"
              >
                Unlock Parent Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked Parent Dashboard */
          <div>
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl">
                <Unlock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 font-display">
                  Parent Dashboard & Settings
                </h2>
                <p className="text-xs text-slate-500">
                  Manage profiles, monitor progress, and child safety controls
                </p>
              </div>
            </div>

            {/* Child Learning Progress Summary */}
            <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 rounded-2xl p-4 mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-sky-600" />
                <span>Learning Analytics: {currentProfile.name}</span>
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded-xl p-2.5 shadow-2xs border border-sky-100">
                  <div className="text-lg font-black text-amber-600 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{currentProfile.stars}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">Stars Earned</span>
                </div>
                <div className="bg-white rounded-xl p-2.5 shadow-2xs border border-sky-100">
                  <div className="text-lg font-black text-emerald-600">
                    {currentProfile.completedLessons.length}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">Lessons Completed</span>
                </div>
                <div className="bg-white rounded-xl p-2.5 shadow-2xs border border-sky-100">
                  <div className="text-lg font-black text-indigo-600">
                    {currentProfile.ageGroup}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">Age Tier</span>
                </div>
              </div>
            </div>

            {/* Child Profile Settings */}
            <div className="space-y-4 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-500" />
                <span>Child Profile Details</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Child's Nickname (No real names needed)
                </label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  maxLength={15}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Choose Favorite Mascot Avatar
                </label>
                <div className="flex gap-2 flex-wrap">
                  {avatarOptions.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setEditingAvatar(av)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-transform ${
                        editingAvatar === av
                          ? 'border-sky-500 bg-sky-50 scale-110 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Age Group
                  </label>
                  <select
                    value={editingAge}
                    onChange={(e) => setEditingAge(e.target.value as AgeGroup)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:outline-hidden"
                  >
                    <option value="2-4">Ages 2–4 (Preschool)</option>
                    <option value="5-6">Ages 5–6 (Kindergarten)</option>
                    <option value="7-8">Ages 7–8 (Junior Genius)</option>
                    <option value="9-10">Ages 9–10 (Smart Explorer)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Learning Language
                  </label>
                  <select
                    value={editingLang}
                    onChange={(e) => setEditingLang(e.target.value as AppLanguage)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:outline-hidden"
                  >
                    <option value="english">English Primary</option>
                    <option value="urdu">Urdu (اردو) Primary</option>
                    <option value="roman-urdu">Roman Urdu Support</option>
                  </select>
                </div>
              </div>

              {/* Screen Time Limit */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Daily Session Screen-Time Suggestion</span>
                  </span>
                  <span className="text-sky-700">{screenLimit} Minutes</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="90"
                  step="15"
                  value={screenLimit}
                  onChange={(e) => setScreenLimit(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset all earned stars and lesson history for this profile?')) {
                    onResetProgress();
                    onClose();
                  }
                }}
                className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Stars</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-5 py-2 text-xs font-black text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-md transition-all active:scale-95"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
