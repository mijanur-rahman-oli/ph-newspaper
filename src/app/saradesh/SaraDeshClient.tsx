'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import DistrictSearch from '../../components/map/DistrictSearch';
import DistrictModal from '../../components/map/DistrictModal';

const BangladeshMap = dynamic(() => import('../../components/map/BangladeshMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

interface DistrictNewsCount {
  district: string;
  count: number;
  coordinates: [number, number];
}

interface NewsItem {
  _id: string;
  title: string;
  category: string;
  thumbnail: string;
  views: number;
  createdAt: string;
}

interface SaraDeshClientProps {
  districtData: DistrictNewsCount[];
  newsMap: Record<string, NewsItem[]>;
}

export default function SaraDeshClient({ districtData, newsMap }: SaraDeshClientProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDistrictClick = (district: string) => {
    setSelectedDistrict(district);
    setIsModalOpen(true);
  };

  const handleDistrictSearch = (district: string, coordinates: [number, number]) => {
    // The map will fly to the coordinates automatically
    // We can also open the modal if needed
    setSelectedDistrict(district);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDistrict(null);
  };

  const selectedNews = selectedDistrict ? newsMap[selectedDistrict] || [] : [];

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Search Districts</h2>
        <DistrictSearch onDistrictSelect={handleDistrictSearch} />
      </div>

      {/* Map */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Interactive News Map</h2>
        <p className="text-gray-600 mb-4">
          Click on any district marker to view news articles from that region. The size and color of markers indicate the number of articles available.
        </p>
        <BangladeshMap districtData={districtData} onDistrictClick={handleDistrictClick} />
      </div>

      {/* Modal */}
      <DistrictModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        district={selectedDistrict}
        news={selectedNews}
      />
    </div>
  );
}