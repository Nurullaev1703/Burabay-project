import { createFileRoute } from '@tanstack/react-router'
import { BookingBan } from '../../../pages/announcements/BookingBan'
import { UseGetAnnouncement } from '../../../pages/announcements/announcement/announcement-util';
import { Loader } from '../../../components/Loader';

export const Route = createFileRoute('/announcements/bookingBan/$adId')({
  component: BookingBanRoute,
})

function BookingBanRoute() {
  const { adId } = Route.useParams();
  const { data, isLoading } = UseGetAnnouncement(adId);
  if (isLoading) {
    return <Loader />
  }
  if (data) {
    return <BookingBan adId={adId} announcement={data}/>;
  }
} 