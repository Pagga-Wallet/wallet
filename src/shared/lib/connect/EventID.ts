class EventIdService {
    private readonly eventIdStorageKey = "ton-connect-service-event-id";

    private eventId: number = 0;

    constructor() {
        const storedEventId = localStorage.getItem(this.eventIdStorageKey);
        this.eventId = storedEventId ? Number(storedEventId) : 0;
    }

    public getId() {
        this.eventId++;

        localStorage.setItem(this.eventIdStorageKey, String(this.eventId));

        return this.eventId;
    }
}

export const TCEventID = new EventIdService();
