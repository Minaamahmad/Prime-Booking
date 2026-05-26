import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const cardBase = 'rounded-3xl bg-white border border-gray-200 p-4 shadow-sm';

export const HotelCardSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className={cardBase}>
        <Skeleton height={220} borderRadius={24} />
        <div className="mt-4 space-y-3">
          <Skeleton height={24} width="70%" />
          <Skeleton height={18} width="40%" />
          <Skeleton count={2} height={14} width="100%" />
        </div>
      </div>
    ))}
  </div>
);

export const BookingCardSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
        <Skeleton height={180} borderRadius={20} />
        <div className="mt-4 space-y-3">
          <Skeleton height={22} width="60%" />
          <Skeleton height={16} width="80%" />
          <Skeleton height={16} width="45%" />
        </div>
      </div>
    ))}
  </div>
);

export const DashboardSkeleton = () => (
  <div className="px-4 sm:px-6 lg:px-8 py-8">
    <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <Skeleton height={16} width="50%" />
          <Skeleton height={40} width="80%" className="mt-6" />
          <Skeleton height={14} width="60%" className="mt-4" />
        </div>
      ))}
    </div>
  </div>
);

export const HotelDetailsSkeleton = () => (
  <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
    <div className="max-w-7xl mx-auto space-y-6">
      <Skeleton height={30} width="40%" />
      <Skeleton height={20} width="30%" />
      <Skeleton height={360} borderRadius={28} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton height={180} borderRadius={24} />
          <Skeleton count={4} height={18} />
          <Skeleton height={220} borderRadius={24} />
        </div>
        <div className="space-y-4">
          <Skeleton height={60} borderRadius={24} />
          <Skeleton count={5} height={18} />
        </div>
      </div>
    </div>
  </div>
);

export const RoomManagementSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <Skeleton height={24} width="40%" />
        <Skeleton height={160} borderRadius={20} className="mt-6" />
        <div className="mt-6 space-y-3">
          <Skeleton height={14} width="90%" />
          <Skeleton height={14} width="70%" />
          <Skeleton height={14} width="80%" />
        </div>
      </div>
    ))}
  </div>
);

export const ChatSkeleton = () => (
  <div className="flex flex-col flex-1 justify-between" style={{ height: '100dvh' }}>
    <div className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
      <Skeleton height={24} width="40%" />
      <Skeleton height={16} width="30%" className="mt-2" />
    </div>
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className={`max-w-[75%] ${index % 2 === 0 ? 'ml-auto' : ''}`}>
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <Skeleton count={3} height={14} />
          </div>
        </div>
      ))}
    </div>
    <div className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6">
      <Skeleton height={44} />
    </div>
  </div>
);

export const AdminUsersSkeleton = ({ count = 6 }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-slate-200 text-left">
      <thead className="bg-slate-50 text-slate-700">
        <tr>
          <th className="px-4 py-3 text-sm font-semibold">Name</th>
          <th className="px-4 py-3 text-sm font-semibold">Email</th>
          <th className="px-4 py-3 text-sm font-semibold">Role</th>
          <th className="px-4 py-3 text-sm font-semibold">Banned</th>
          <th className="px-4 py-3 text-sm font-semibold">Joined</th>
          <th className="px-4 py-3 text-sm font-semibold">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 bg-white">
        {Array.from({ length: count }).map((_, index) => (
          <tr key={index}>
            <td className="px-4 py-4"><Skeleton height={18} width="90%" /></td>
            <td className="px-4 py-4"><Skeleton height={18} width="80%" /></td>
            <td className="px-4 py-4"><Skeleton height={18} width="60%" /></td>
            <td className="px-4 py-4"><Skeleton height={18} width="30%" /></td>
            <td className="px-4 py-4"><Skeleton height={18} width="50%" /></td>
            <td className="px-4 py-4"><Skeleton height={32} width="70%" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
