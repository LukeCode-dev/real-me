import { useState } from 'react';
import VirtualWorldScene from '../components/world/VirtualWorldScene';
import WorldHUD from '../components/world/WorldHUD';
import LoadingScreen from '../components/ui/LoadingScreen';
import { useWorldStore } from '../hooks/useStore';

export default function VirtualWorld() {
  const { isLoading } = useWorldStore();

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 64px)' }}>
      {isLoading && <LoadingScreen />}
      <VirtualWorldScene />
      <WorldHUD />
    </div>
  );
}
