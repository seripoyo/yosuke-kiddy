import { Button } from "./Button";

const VENUE_ADDRESS = "東京都足立区千住仲町19-3";
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("稲垣葬儀社 稲垣ホール " + VENUE_ADDRESS)}`;

export function GoogleMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div>
      {apiKey ? (
        <div className="overflow-hidden rounded-[2px]">
          <iframe
            title="稲垣葬儀社 稲垣ホールの地図"
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent("稲垣葬儀社 稲垣ホール " + VENUE_ADDRESS)}`}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : (
        <div className="flex h-[300px] items-center justify-center rounded-[2px] border border-border bg-[#F5F5F5]">
          <div className="text-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#BDBDBD"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-2"
              aria-hidden="true"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <p className="text-[14px] text-sub">地図を読み込めません</p>
          </div>
        </div>
      )}

      <div className="mt-[34px] text-center">
        <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" type="button">
            地図を開く
          </Button>
        </a>
      </div>
    </div>
  );
}
