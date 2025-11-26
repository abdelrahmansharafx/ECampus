import { Ride, DriverProfile, Student } from '../types';

// Mock driver profile
export const mockDriverProfile: DriverProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  role: 'driver',
  profileImage: 'https://via.placeholder.com/150',
  vehicleInfo: {
    model: 'Mercedes Sprinter',
    plate: 'ABC-123',
    color: 'Yellow',
    capacity: 12,
  },
  licenseNumber: 'DL123456',
  totalRides: 156,
  rating: 4.8,
  completedRides: 150,
  cancelledRides: 2,
  earnings: 8450,
  currentLocation: {
    latitude: 40.7128,
    longitude: -74.006,
  },
};

// Mock students
export const mockStudents: Student[] = [
  {
    id: 'student-1',
    name: 'Alice Johnson',
    grade: '5th',
    pickupLocation: {
      latitude: 40.7289,
      longitude: -73.9965,
    },
    parentId: 'parent-1',
  },
  {
    id: 'student-2',
    name: 'Bob Smith',
    grade: '4th',
    pickupLocation: {
      latitude: 40.7505,
      longitude: -73.9972,
    },
    parentId: 'parent-2',
  },
  {
    id: 'student-3',
    name: 'Charlie Brown',
    grade: '3rd',
    pickupLocation: {
      latitude: 40.7614,
      longitude: -73.9776,
    },
    parentId: 'parent-3',
  },
];

// Mock upcoming rides
export const mockUpcomingRides: Ride[] = [
  {
    id: 'ride-1',
    driverId: '1',
    studentIds: ['student-1', 'student-2'],
    startTime: new Date(Date.now() + 15 * 60000), // 15 minutes from now
    estimatedEndTime: new Date(Date.now() + 45 * 60000), // 45 minutes from now
    status: 'scheduled',
    pickupPoints: [
      {
        latitude: 40.7289,
        longitude: -73.9965,
      },
      {
        latitude: 40.7505,
        longitude: -73.9972,
      },
    ],
    destinationLocation: {
      latitude: 40.6943,
      longitude: -73.9249,
    },
    totalDistance: 12.5,
    totalDuration: 30,
    notes: 'Regular route',
  },
  {
    id: 'ride-2',
    driverId: '1',
    studentIds: ['student-3'],
    startTime: new Date(Date.now() + 90 * 60000), // 90 minutes from now
    estimatedEndTime: new Date(Date.now() + 150 * 60000), // 150 minutes from now
    status: 'scheduled',
    pickupPoints: [
      {
        latitude: 40.7614,
        longitude: -73.9776,
      },
    ],
    destinationLocation: {
      latitude: 40.6943,
      longitude: -73.9249,
    },
    totalDistance: 8.3,
    totalDuration: 25,
    notes: 'Afternoon pickup',
  },
];

// Mock completed rides
export const mockCompletedRides: Ride[] = [
  {
    id: 'ride-completed-1',
    driverId: '1',
    studentIds: ['student-1', 'student-2', 'student-3'],
    startTime: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
    estimatedEndTime: new Date(Date.now() - 1.5 * 60 * 60000),
    actualEndTime: new Date(Date.now() - 1.4 * 60 * 60000),
    status: 'completed',
    pickupPoints: [
      {
        latitude: 40.7289,
        longitude: -73.9965,
      },
      {
        latitude: 40.7505,
        longitude: -73.9972,
      },
      {
        latitude: 40.7614,
        longitude: -73.9776,
      },
    ],
    destinationLocation: {
      latitude: 40.6943,
      longitude: -73.9249,
    },
    totalDistance: 18.2,
    totalDuration: 35,
  },
  {
    id: 'ride-completed-2',
    driverId: '1',
    studentIds: ['student-1'],
    startTime: new Date(Date.now() - 5 * 60 * 60000), // 5 hours ago
    estimatedEndTime: new Date(Date.now() - 4.5 * 60 * 60000),
    actualEndTime: new Date(Date.now() - 4.4 * 60 * 60000),
    status: 'completed',
    pickupPoints: [
      {
        latitude: 40.7289,
        longitude: -73.9965,
      },
    ],
    destinationLocation: {
      latitude: 40.6943,
      longitude: -73.9249,
    },
    totalDistance: 9.8,
    totalDuration: 28,
  },
];

export default {
  mockDriverProfile,
  mockStudents,
  mockUpcomingRides,
  mockCompletedRides,
};
