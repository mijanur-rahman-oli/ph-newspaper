import { DistrictData } from '../../types';

export const BANGLADESH_DISTRICTS: DistrictData[] = [
  // Dhaka Division
  { name: 'Dhaka', division: 'Dhaka', coordinates: [23.8103, 90.4125] },
  { name: 'Gazipur', division: 'Dhaka', coordinates: [24.0022, 90.4264] },
  { name: 'Narayanganj', division: 'Dhaka', coordinates: [23.6238, 90.4996] },
  { name: 'Tangail', division: 'Dhaka', coordinates: [24.2513, 89.9167] },
  { name: 'Manikganj', division: 'Dhaka', coordinates: [23.8617, 90.0003] },
  { name: 'Munshiganj', division: 'Dhaka', coordinates: [23.5422, 90.5305] },
  { name: 'Narsingdi', division: 'Dhaka', coordinates: [23.9229, 90.7176] },
  { name: 'Faridpur', division: 'Dhaka', coordinates: [23.6070, 89.8429] },
  { name: 'Gopalganj', division: 'Dhaka', coordinates: [23.0050, 89.8266] },
  { name: 'Madaripur', division: 'Dhaka', coordinates: [23.1642, 90.1896] },
  { name: 'Rajbari', division: 'Dhaka', coordinates: [23.7574, 89.6444] },
  { name: 'Shariatpur', division: 'Dhaka', coordinates: [23.2423, 90.4348] },
  { name: 'Kishoreganj', division: 'Dhaka', coordinates: [24.4260, 90.7760] },
  
  // Chittagong Division
  { name: 'Chittagong', division: 'Chittagong', coordinates: [22.3569, 91.7832] },
  { name: 'Coxs Bazar', division: 'Chittagong', coordinates: [21.4272, 92.0058] },
  { name: 'Comilla', division: 'Chittagong', coordinates: [23.4607, 91.1809] },
  { name: 'Feni', division: 'Chittagong', coordinates: [23.0159, 91.3976] },
  { name: 'Brahmanbaria', division: 'Chittagong', coordinates: [23.9608, 91.1115] },
  { name: 'Rangamati', division: 'Chittagong', coordinates: [22.7324, 92.2985] },
  { name: 'Noakhali', division: 'Chittagong', coordinates: [22.8696, 91.0995] },
  { name: 'Chandpur', division: 'Chittagong', coordinates: [23.2332, 90.6712] },
  { name: 'Lakshmipur', division: 'Chittagong', coordinates: [22.9447, 90.8282] },
  { name: 'Khagrachhari', division: 'Chittagong', coordinates: [23.1193, 91.9847] },
  { name: 'Bandarban', division: 'Chittagong', coordinates: [22.1953, 92.2183] },
  
  // Rajshahi Division
  { name: 'Rajshahi', division: 'Rajshahi', coordinates: [24.3745, 88.6042] },
  { name: 'Bogra', division: 'Rajshahi', coordinates: [24.8465, 89.3770] },
  { name: 'Pabna', division: 'Rajshahi', coordinates: [24.0064, 89.2372] },
  { name: 'Natore', division: 'Rajshahi', coordinates: [24.4206, 89.0000] },
  { name: 'Sirajganj', division: 'Rajshahi', coordinates: [24.4533, 89.7006] },
  { name: 'Chapainawabganj', division: 'Rajshahi', coordinates: [24.5965, 88.2775] },
  { name: 'Naogaon', division: 'Rajshahi', coordinates: [24.7936, 88.9318] },
  { name: 'Joypurhat', division: 'Rajshahi', coordinates: [25.0968, 89.0227] },
  
  // Khulna Division
  { name: 'Khulna', division: 'Khulna', coordinates: [22.8456, 89.5403] },
  { name: 'Jessore', division: 'Khulna', coordinates: [23.1634, 89.2182] },
  { name: 'Satkhira', division: 'Khulna', coordinates: [22.7185, 89.0705] },
  { name: 'Bagerhat', division: 'Khulna', coordinates: [22.6602, 89.7895] },
  { name: 'Jhenaidah', division: 'Khulna', coordinates: [23.5450, 89.1539] },
  { name: 'Magura', division: 'Khulna', coordinates: [23.4855, 89.4198] },
  { name: 'Narail', division: 'Khulna', coordinates: [23.1163, 89.5840] },
  { name: 'Chuadanga', division: 'Khulna', coordinates: [23.6401, 88.8410] },
  { name: 'Kushtia', division: 'Khulna', coordinates: [23.9012, 89.1200] },
  { name: 'Meherpur', division: 'Khulna', coordinates: [23.7622, 88.6318] },
  
  // Barisal Division
  { name: 'Barisal', division: 'Barisal', coordinates: [22.7010, 90.3535] },
  { name: 'Patuakhali', division: 'Barisal', coordinates: [22.3596, 90.3298] },
  { name: 'Bhola', division: 'Barisal', coordinates: [22.6859, 90.6482] },
  { name: 'Pirojpur', division: 'Barisal', coordinates: [22.5791, 89.9759] },
  { name: 'Barguna', division: 'Barisal', coordinates: [22.1521, 90.1119] },
  { name: 'Jhalokati', division: 'Barisal', coordinates: [22.6406, 90.1987] },
  
  // Sylhet Division
  { name: 'Sylhet', division: 'Sylhet', coordinates: [24.8949, 91.8687] },
  { name: 'Moulvibazar', division: 'Sylhet', coordinates: [24.4829, 91.7774] },
  { name: 'Habiganj', division: 'Sylhet', coordinates: [24.3745, 91.4152] },
  { name: 'Sunamganj', division: 'Sylhet', coordinates: [25.0657, 91.3950] },
  
  // Rangpur Division
  { name: 'Rangpur', division: 'Rangpur', coordinates: [25.7439, 89.2752] },
  { name: 'Dinajpur', division: 'Rangpur', coordinates: [25.6217, 88.6354] },
  { name: 'Gaibandha', division: 'Rangpur', coordinates: [25.3285, 89.5280] },
  { name: 'Kurigram', division: 'Rangpur', coordinates: [25.8073, 89.6295] },
  { name: 'Lalmonirhat', division: 'Rangpur', coordinates: [25.9923, 89.2847] },
  { name: 'Nilphamari', division: 'Rangpur', coordinates: [25.9317, 88.8560] },
  { name: 'Panchagarh', division: 'Rangpur', coordinates: [26.3411, 88.5541] },
  { name: 'Thakurgaon', division: 'Rangpur', coordinates: [26.0336, 88.4616] },
  
  // Mymensingh Division
  { name: 'Mymensingh', division: 'Mymensingh', coordinates: [24.7471, 90.4203] },
  { name: 'Jamalpur', division: 'Mymensingh', coordinates: [25.0831, 89.9410] },
  { name: 'Netrokona', division: 'Mymensingh', coordinates: [24.8105, 90.7272] },
  { name: 'Sherpur', division: 'Mymensingh', coordinates: [25.0204, 90.0152] },
];