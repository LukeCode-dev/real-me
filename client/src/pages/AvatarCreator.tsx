import { useState } from 'react';
import BodyScanner from '../components/avatar/BodyScanner';
import MeasurementForm from '../components/avatar/MeasurementForm';
import AvatarPreview from '../components/avatar/AvatarPreview';
import AppearanceCustomizer from '../components/avatar/AppearanceCustomizer';

const TABS = ['Scan', 'Measurements', 'Appearance', 'Preview'];

export default function AvatarCreator() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">
          Create Your <span className="gradient-text">Digital Twin</span>
        </h1>
        <p className="text-dark-200">
          Build a photorealistic avatar that matches your exact body. Use the camera scanner or enter measurements manually.
        </p>
      </div>

      {/* Step tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === i
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                : i < activeTab
                ? 'bg-neon-green/10 text-neon-green border border-neon-green/20'
                : 'bg-dark-600 text-dark-200 hover:bg-dark-500'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              activeTab === i ? 'bg-white/20' : i < activeTab ? 'bg-neon-green/20' : 'bg-dark-500'
            }`}>
              {i < activeTab ? '✓' : i + 1}
            </span>
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 0 && <BodyScanner />}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MeasurementForm />
            <AvatarPreview />
          </div>
        )}
        {activeTab === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AppearanceCustomizer />
            <AvatarPreview />
          </div>
        )}
        {activeTab === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AvatarPreview />
            </div>
            <div className="space-y-4">
              <div className="card">
                <h3 className="font-display font-semibold text-lg mb-4">Your Avatar Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-dark-300">Status</span>
                    <span className="text-neon-green font-semibold">Ready</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-300">Accuracy</span>
                    <span className="text-neon-blue font-semibold">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-300">Body Type</span>
                    <span className="text-white">Average</span>
                  </div>
                </div>
              </div>
              <button className="btn-primary w-full text-center">
                Save & Enter World
              </button>
              <button className="btn-secondary w-full text-center">
                Refine Avatar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
        <button
          onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
          disabled={activeTab === 0}
          className="btn-secondary disabled:opacity-30"
        >
          Previous
        </button>
        <button
          onClick={() => setActiveTab(Math.min(TABS.length - 1, activeTab + 1))}
          disabled={activeTab === TABS.length - 1}
          className="btn-primary"
        >
          {activeTab === TABS.length - 2 ? 'Finish' : 'Next Step'}
        </button>
      </div>
    </div>
  );
}
