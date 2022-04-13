module ApplicationHelper
  def event_json(tournament)
    JSON.generate({
      "@context" => 'https://schema.org',
      "@type" => 'Event',
      name: tournament.name,
      startDate: tournament.start_date,
      endDate: tournament.end_date,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: tournament.cancelled ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled',
      location: {
        "@type" => 'Place',
        name: tournament.location,
        address: {
          "@type" => 'PostalAddress',
          streetAddress: tournament.address,
          addressCountry: 'FI',
        },
      },
      image: [
        'https://www.fudisturnaus.com/logo.jpg'
      ],
      description: 'Jalkapalloturnaus',
      organizer: {
        "@type" => 'Organization',
        name: tournament.club&.name,
      }
    })
  end
end
