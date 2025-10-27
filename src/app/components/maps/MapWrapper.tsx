'use client';
import dynamic from 'next/dynamic';

const Map = dynamic(
  () => import('./Map'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full bg-gray-100 animate-pulse flex items-center justify-center">
        <p>Memuat peta...</p>
      </div>
    )
  }
);

export default Map;