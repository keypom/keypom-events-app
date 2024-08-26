import { http, HttpResponse } from 'msw'
 
export const handlers = [
  // Intercept "GET https://example.com/journeys" requests...
  http.get('https://example.com/journeys', () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json([
      {
        title: "NEAR Sponsor Scavenger Hunt",
        description: "4 of 4 found",
        progress: 100,
        bgColor: "#0282A2",
      },
      {
        title: "NEAR Purple Scavenger Hunt",
        description: "2 of 4 found",
        progress: 50,
        bgColor: "#7269E1",
      },
      {
        title: "Chain Abstraction Adventure",
        description: "0 of 4 found",
        progress: 0,
        bgColor: "#F44738",
      },
      {
        title: "Another Adventure",
        description: "0 of 4 found",
        progress: 0,
        bgColor: "#62EBE4",
      },
    ])
  }),
]