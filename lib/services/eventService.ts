import { LocalEvent } from '@/lib/types';
import { getStorageItem, setStorageItem } from '@/lib/utils/storage';
import { STORAGE_KEYS } from '@/lib/types';

interface TicketmasterEvent {
  id: string;
  name: string;
  type: string;
  url: string;
  locale: string;
  images: Array<{
    ratio: string;
    url: string;
    width: number;
    height: number;
  }>;
  sales: {
    public: {
      startDateTime: string;
      endDateTime: string;
    };
  };
  dates: {
    start: {
      localDate: string;
      localTime: string;
      dateTime: string;
    };
    timezone: string;
    status: {
      code: string;
    };
  };
  classifications: Array<{
    primary: boolean;
    segment: {
      id: string;
      name: string;
    };
    genre: {
      id: string;
      name: string;
    };
  }>;
  priceRanges?: Array<{
    type: string;
    currency: string;
    min: number;
    max: number;
  }>;
  _embedded: {
    venues: Array<{
      id: string;
      name: string;
      type: string;
      address: {
        line1: string;
        line2?: string;
      };
      city: {
        name: string;
      };
      state: {
        name: string;
        stateCode: string;
      };
      country: {
        name: string;
        countryCode: string;
      };
      postalCode: string;
      location: {
        longitude: string;
        latitude: string;
      };
    }>;
    attractions?: Array<{
      id: string;
      name: string;
    }>;
  };
}

interface TicketmasterResponse {
  _embedded: {
    events: TicketmasterEvent[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

const mapTicketmasterEvent = (event: TicketmasterEvent): LocalEvent => {
  const venue = event._embedded.venues[0];
  const classification = event.classifications[0];
  const image = event.images.find(img => img.ratio === '16_9' && img.width >= 1024) || event.images[0];

  return {
    id: event.id,
    title: event.name,
    description: `${classification?.segment?.name || 'Event'} - ${classification?.genre?.name || ''}`,
    date: event.dates.start.localDate,
    time: event.dates.start.localTime || '',
    location: venue
      ? `${venue.name}, ${venue.city.name}, ${venue.state.stateCode}`
      : 'Location TBD',
    category: classification?.segment?.name || 'Other',
    imageUrl: image?.url,
    price: event.priceRanges?.[0]?.min,
    organizer: event._embedded.attractions?.[0]?.name,
    tags: [
      classification?.segment?.name,
      classification?.genre?.name,
    ].filter(Boolean) as string[],
  };
};

export const searchEventsFromAPI = async (
  keyword: string,
  city?: string,
  size: number = 20
): Promise<{ events: LocalEvent[]; error: null } | { events: []; error: string }> => {
  const apiKey = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;

  if (!apiKey) {
    return { events: [], error: 'Ticketmaster API key is not configured' };
  }

  try {
    const params = new URLSearchParams({
      apikey: apiKey,
      keyword: keyword,
      size: size.toString(),
      sort: 'date,asc',
    });

    if (city) {
      params.append('city', city);
    }

    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`
    );

    if (!response.ok) {
      if (response.status === 429) {
        return {
          events: [],
          error: 'Rate limit exceeded. Please try again later.',
        };
      }

      const errorData = await response.json().catch(() => ({}));
      
      if (errorData.fault?.faultstring) {
        return {
          events: [],
          error: errorData.fault.faultstring,
        };
      }

      return {
        events: [],
        error: errorData.error?.message || `API error: ${response.status}`,
      };
    }

    const data: TicketmasterResponse = await response.json();

    if (!data._embedded?.events) {
      return { events: [], error: null };
    }

    const events = data._embedded.events.map(mapTicketmasterEvent);

    return { events, error: null };
  } catch (error: any) {
    return {
      events: [],
      error: error.message || 'Failed to fetch events',
    };
  }
};

export const getEventByIdFromAPI = async (
  eventId: string
): Promise<{ event: LocalEvent | null; error: null } | { event: null; error: string }> => {
  const apiKey = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;

  if (!apiKey) {
    return { event: null, error: 'Ticketmaster API key is not configured' };
  }

  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events/${eventId}.json?apikey=${apiKey}`
    );

    if (!response.ok) {
      if (response.status === 429) {
        return {
          event: null,
          error: 'Rate limit exceeded. Please try again later.',
        };
      }

      const errorData = await response.json().catch(() => ({}));
      
      if (errorData.fault?.faultstring) {
        return {
          event: null,
          error: errorData.fault.faultstring,
        };
      }

      return {
        event: null,
        error: `Failed to fetch event: ${response.status}`,
      };
    }

    const data: TicketmasterEvent = await response.json();
    const event = mapTicketmasterEvent(data);

    return { event, error: null };
  } catch (error: any) {
    return {
      event: null,
      error: error.message || 'Failed to fetch event',
    };
  }
};

export const getSavedEvents = (): LocalEvent[] => {
  return getStorageItem<LocalEvent[]>(STORAGE_KEYS.SAVED_EVENTS) ?? [];
};

export const saveEvent = (event: LocalEvent): boolean => {
  const savedEvents = getSavedEvents();
  
  if (savedEvents.some((e) => e.id === event.id)) {
    return false;
  }

  const updatedEvents = [...savedEvents, event];
  return setStorageItem(STORAGE_KEYS.SAVED_EVENTS, updatedEvents);
};

export const removeSavedEvent = (eventId: string): boolean => {
  const savedEvents = getSavedEvents();
  const updatedEvents = savedEvents.filter((e) => e.id !== eventId);
  return setStorageItem(STORAGE_KEYS.SAVED_EVENTS, updatedEvents);
};

export const isEventSaved = (eventId: string): boolean => {
  const savedEvents = getSavedEvents();
  return savedEvents.some((e) => e.id === eventId);
};

export const filterEventsByCategory = (
  events: LocalEvent[],
  category: string
): LocalEvent[] => {
  return events.filter((event) => event.category === category);
};

export const filterEventsByDateRange = (
  events: LocalEvent[],
  startDate: string,
  endDate: string
): LocalEvent[] => {
  return events.filter((event) => {
    const eventDate = new Date(event.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return eventDate >= start && eventDate <= end;
  });
};

export const searchEvents = (
  events: LocalEvent[],
  query: string
): LocalEvent[] => {
  const lowerQuery = query.toLowerCase();
  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description.toLowerCase().includes(lowerQuery) ||
      event.location.toLowerCase().includes(lowerQuery) ||
      event.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};

