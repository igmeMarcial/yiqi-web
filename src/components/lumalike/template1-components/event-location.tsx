import { useState, useEffect } from 'react'

export function EventLocation({ location }: { location: string }) {
  const [googleMapsURL, setGoogleMapsURL] = useState('')

  useEffect(() => {
    const encodedLocation = encodeURIComponent(location)
    setGoogleMapsURL(
      `https://www.google.com/maps/embed/v1/place?q=${encodedLocation}&key=YOUR_GOOGLE_MAPS_API_KEY`
    )
  }, [location])

  return (
    <div className="space-y-4 ml-0">
      <h2 className="text-2xl font-semibold text-primary-foreground">
        Ubicación
      </h2>
      <hr className="my-6 border-t border-solid border-white-opacity-40 w-[100%] ml-0 mx-auto" />
      <div className="space-y-2">
        <p className="text-lg">{location}</p>
      </div>

      <div className="mt-4 rounded-lg overflow-hidden shadow-md w-full lg:w-[70%] ml-0">
        <iframe
          width="100%"
          height="400"
          src={googleMapsURL}
          allowFullScreen
          className="rounded-lg"
        ></iframe>
      </div>
    </div>
  )
}
