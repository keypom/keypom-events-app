import { http, HttpResponse } from 'msw'
import collectibles from './data/collectibles.ts'
import journeys from './data/journeys.ts'
import alerts from './data/alerts.ts'

export const handlers = [
  // Intercept "GET https://example.com/journeys" requests...
  http.get('https://example.com/journeys', () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json(journeys)
  }),
  http.get('https://example.com/journeys/:id', (req) => {
    const { id } = req.params;
    const journey = journeys.find((item) => item.id === id);
    if (journey) {
      return HttpResponse.json(journey);
    } else {
      return new HttpResponse("Not found", { status: 404 });
    }
  }),
  http.get('https://example.com/collectibles', () => {
    return HttpResponse.json(collectibles)
  }),
  http.get('https://example.com/collectibles/:id', (req) => {
    const { id } = req.params;
    const collectible = collectibles.find((item) => item.id === id);
    if (collectible) {
      return HttpResponse.json(collectible);
    } else {
      return new HttpResponse("Not found", { status: 404 });
    }
  }),
  http.get('https://example.com/alerts', () => {
    return HttpResponse.json(alerts)
  }),
  http.get('https://example.com/alerts/:id', (req) => {
    const { id } = req.params;
    const collectible = alerts.find((item) => item.id === id);
    if (collectible) {
      return HttpResponse.json(collectible);
    } else {
      return new HttpResponse("Not found", { status: 404 });
    }
  }),
]