import { useEffect, useRef, useState } from "react";

type Story = {
  pet: string;
  family: string;
  place: string;
  image: string;
  quote: string;
  note: string;
  mark: string;
};

const stories: Story[] = [
  {
    pet: "Maple",
    family: "The Parkers",
    place: "Portland, OR",
    image: "photo-1552053831-71594a27632d",
    quote:
      "We thought we were bringing home a dog. Maple somehow brought our whole family outside, laughing, and together again.",
    note: "Now: trail guide and expert couch napper",
    mark: "M",
  },
  {
    pet: "Olive",
    family: "Sam & Olive",
    place: "Beaverton, OR",
    image: "photo-1573865526739-10659fec78a5",
    quote:
      "Olive took her time settling in. These days she greets me at the door like I’ve been away for years—even if it’s just the mailbox.",
    note: "Now: chief window watcher",
    mark: "O",
  },
  {
    pet: "Scout",
    family: "The Nguyen family",
    place: "Lake Oswego, OR",
    image: "photo-1543466835-00a7907e9de1",
    quote:
      "Scout was the missing piece. He and our daughter became best friends before we’d even unpacked his treats.",
    note: "Now: backyard zoomies champion",
    mark: "S",
  },
  {
    pet: "Clover",
    family: "Jamie & Clover",
    place: "Portland, OR",
    image: "photo-1535241749838-299277b6305f",
    quote:
      "I’d never had a rabbit before. Clover made my quiet apartment feel like the happiest little home in the world.",
    note: "Now: parsley enthusiast and binky pro",
    mark: "C",
  },
];

// Ten more pages of adoption stories, four families on each page.
const additionalPages: Array<
  Array<[string, string, string, string, string, string]>
> = [
  [
    [
      "Waffles",
      "The Rivera family",
      "Salem, OR",
      "photo-1525253086316-d0c936c814f8",
      "our shy pup now races to the door when the kids get home",
      "Now: official school-run greeter",
    ],
    [
      "Miso",
      "Taylor & Miso",
      "Eugene, OR",
      "photo-1514888286974-6c03e2ca1dba",
      "she turned every sunny windowsill into her own little kingdom",
      "Now: champion sunbeam snoozer",
    ],
    [
      "Juniper",
      "The Brooks family",
      "Bend, OR",
      "photo-1548199973-03cce0bbc87b",
      "weekend hikes became our favorite family tradition",
      "Now: mountain trail scout",
    ],
    [
      "Pippin",
      "Morgan & Pippin",
      "Hillsboro, OR",
      "photo-1533738363-b7f9aef128ce",
      "he made our first home feel warm from the very first evening",
      "Now: keeper of the coziest corners",
    ],
  ],
  [
    [
      "Biscuit",
      "The Chen family",
      "Tigard, OR",
      "photo-1517849845537-4d257902454a",
      "she patiently learned the neighborhood and made friends on every block",
      "Now: neighborhood hello expert",
    ],
    [
      "Fig",
      "Alex & Fig",
      "Portland, OR",
      "photo-1543852786-1cf6624b9987",
      "his purrs have become the soundtrack to our slow mornings",
      "Now: breakfast table supervisor",
    ],
    [
      "Marlow",
      "The Johnsons",
      "Gresham, OR",
      "photo-1551717743-49959800b1f6",
      "he brought a little more adventure to every ordinary day",
      "Now: fetch champion",
    ],
    [
      "Peaches",
      "Riley & Peaches",
      "Corvallis, OR",
      "photo-1495360010541-f48722b34f7d",
      "she fit right into our quiet routine and made it brighter",
      "Now: gentle lap companion",
    ],
  ],
  [
    [
      "Otis",
      "The Flores family",
      "Lake Oswego, OR",
      "photo-1534361960057-19889db9621e",
      "he helped our family slow down and enjoy our evening walks",
      "Now: sunset stroll specialist",
    ],
    [
      "Nori",
      "Casey & Nori",
      "Beaverton, OR",
      "photo-1526336024174-e58f5cdd8e13",
      "she picked her favorite chair and somehow made it everyone’s favorite",
      "Now: living-room host",
    ],
    [
      "Blue",
      "The Adams family",
      "Vancouver, WA",
      "photo-1505628346881-b72b27e84530",
      "he’s the first to greet guests and the last to leave the cuddle pile",
      "Now: certified cuddle captain",
    ],
    [
      "Dottie",
      "Sky & Dottie",
      "Portland, OR",
      "photo-1513360371669-4adf3dd7dff8",
      "she made our little apartment feel like a very lively home",
      "Now: curious-house explorer",
    ],
  ],
  [
    [
      "Teddy",
      "The Wilson family",
      "Salem, OR",
      "photo-1544568100-847a948585b9",
      "he made new routines feel like something to look forward to",
      "Now: morning walk motivator",
    ],
    [
      "Poppy",
      "Reese & Poppy",
      "Eugene, OR",
      "photo-1513245543132-31f507417b26",
      "her tiny chirps are our favorite reminder to take a break",
      "Now: home-office companion",
    ],
    [
      "Ranger",
      "The Morales family",
      "Bend, OR",
      "photo-1561037404-61cd46aa615b",
      "he loves every trail and makes sure we notice every view",
      "Now: trail-side photographer’s muse",
    ],
    [
      "Mochi",
      "Avery & Mochi",
      "Hillsboro, OR",
      "photo-1495360010541-f48722b34f7d",
      "she found her confidence one gentle hello at a time",
      "Now: brave little greeter",
    ],
  ],
  [
    [
      "Bowie",
      "The Patel family",
      "Portland, OR",
      "photo-1552053831-71594a27632d",
      "he has a way of turning rainy days into play days",
      "Now: indoor game inventor",
    ],
    [
      "Suki",
      "Drew & Suki",
      "Tigard, OR",
      "photo-1573865526739-10659fec78a5",
      "she claimed the bookshelf nook and our hearts in the same week",
      "Now: book-nook guardian",
    ],
    [
      "Cedar",
      "The Green family",
      "Gresham, OR",
      "photo-1543466835-00a7907e9de1",
      "he’s made every walk a chance to meet a new friend",
      "Now: best-dressed on the block",
    ],
    [
      "Lulu",
      "Quinn & Lulu",
      "Lake Oswego, OR",
      "photo-1535241749838-299277b6305f",
      "she taught us that a little patience makes room for a lot of joy",
      "Now: happy-hop specialist",
    ],
  ],
  [
    [
      "Finn",
      "The Carter family",
      "Beaverton, OR",
      "photo-1525253086316-d0c936c814f8",
      "he settled in beside our old dog like they’d always been a team",
      "Now: best-friend sidekick",
    ],
    [
      "Pearl",
      "Jamie & Pearl",
      "Corvallis, OR",
      "photo-1514888286974-6c03e2ca1dba",
      "her soft purrs helped our new place feel like home",
      "Now: nap-time companion",
    ],
    [
      "Arlo",
      "The Kim family",
      "Vancouver, WA",
      "photo-1548199973-03cce0bbc87b",
      "he’s happiest when the whole family is together outside",
      "Now: park-day enthusiast",
    ],
    [
      "Hazel",
      "Robin & Hazel",
      "Portland, OR",
      "photo-1533738363-b7f9aef128ce",
      "she made friends with the whole building one curious sniff at a time",
      "Now: hallway ambassador",
    ],
  ],
  [
    [
      "Cosmo",
      "The Bell family",
      "Salem, OR",
      "photo-1517849845537-4d257902454a",
      "his silly antics have become the highlight of every dinner",
      "Now: family comedian",
    ],
    [
      "Chai",
      "Emery & Chai",
      "Eugene, OR",
      "photo-1543852786-1cf6624b9987",
      "she chose a favorite blanket and made it a family gathering spot",
      "Now: blanket-sharing pro",
    ],
    [
      "Banjo",
      "The Scott family",
      "Bend, OR",
      "photo-1534361960057-19889db9621e",
      "he’s helped us discover the quiet paths right in our own town",
      "Now: local pathfinder",
    ],
    [
      "Daisy",
      "Lee & Daisy",
      "Hillsboro, OR",
      "photo-1526336024174-e58f5cdd8e13",
      "she brings a happy little welcome to every day",
      "Now: devoted door greeter",
    ],
  ],
  [
    [
      "Nacho",
      "The Brooks family",
      "Tigard, OR",
      "photo-1505628346881-b72b27e84530",
      "he turned our backyard into the place everyone wants to be",
      "Now: garden patrol officer",
    ],
    [
      "Kiki",
      "Sam & Kiki",
      "Portland, OR",
      "photo-1513245543132-31f507417b26",
      "she likes to supervise dinner, then curl up nearby for stories",
      "Now: bedtime-story listener",
    ],
    [
      "Rufus",
      "The Nguyen family",
      "Lake Oswego, OR",
      "photo-1561037404-61cd46aa615b",
      "he found his rhythm with us and now greets each day with a wag",
      "Now: cheerful morning buddy",
    ],
    [
      "Tansy",
      "Milan & Tansy",
      "Gresham, OR",
      "photo-1513360371669-4adf3dd7dff8",
      "she has made even the quietest afternoons feel special",
      "Now: afternoon sun seeker",
    ],
  ],
  [
    [
      "Louie",
      "The Rivera family",
      "Vancouver, WA",
      "photo-1544568100-847a948585b9",
      "he’s happiest on a neighborhood walk with his favorite people",
      "Now: leash-and-coffee companion",
    ],
    [
      "Pesto",
      "Alex & Pesto",
      "Beaverton, OR",
      "photo-1495360010541-f48722b34f7d",
      "she found a cozy home base and now explores at her own pace",
      "Now: confident little adventurer",
    ],
    [
      "Koda",
      "The Adams family",
      "Bend, OR",
      "photo-1551717743-49959800b1f6",
      "he has made playtime a daily appointment for the whole family",
      "Now: toy-box enthusiast",
    ],
    [
      "Millie",
      "Taylor & Millie",
      "Corvallis, OR",
      "photo-1526336024174-e58f5cdd8e13",
      "she’s the gentle company we didn’t know our home was missing",
      "Now: peaceful homebody",
    ],
  ],
];

const allStories = [
  ...stories,
  ...additionalPages.flatMap((page) =>
    page.map(([pet, family, place, image, detail, note]) => ({
      pet,
      family,
      place,
      image,
      quote: `Since ${pet} came home, ${detail}. We can’t imagine life without them.`,
      note,
      mark: pet[0],
    })),
  ),
];

const STORIES_PER_PAGE = 4;
const PAGE_COUNT = Math.ceil(allStories.length / STORIES_PER_PAGE);
const AUTOPLAY_MS = 3500;

export function HappyTailsStories() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const dragStartX = useRef<number | null>(null);
  const dragPointerId = useRef<number | null>(null);

  const goToPage = (nextPage: number) => {
    const wrappedPage = (nextPage + PAGE_COUNT) % PAGE_COUNT;
    setDirection(wrappedPage === (page + 1) % PAGE_COUNT ? "next" : "previous");
    setPage(wrappedPage);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setDirection("next");
      setPage((current) => (current + 1) % PAGE_COUNT);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [page]);

  const visibleStories = allStories.slice(
    page * STORIES_PER_PAGE,
    (page + 1) * STORIES_PER_PAGE,
  );

  return (
    <section
      id="stories"
      className="happy-tails"
      aria-labelledby="happy-tails-title"
    >
      <div className="happy-tails-heading">
        <div>
          <div className="eyebrow muted">
            THE BEST PART IS WHAT HAPPENS NEXT
          </div>
          <h2 id="happy-tails-title">
            Happy tails, <em>full hearts.</em>
          </h2>
        </div>
        <p>Little beginnings that turned into a whole lot of love.</p>
      </div>
      <div
        className={`story-carousel story-carousel-${direction}`}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          dragStartX.current = event.clientX;
          dragPointerId.current = event.pointerId;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          if (
            dragPointerId.current !== event.pointerId ||
            dragStartX.current === null
          )
            return;
          const delta = event.clientX - dragStartX.current;
          if (Math.abs(delta) > 45) goToPage(page + (delta < 0 ? 1 : -1));
          dragStartX.current = null;
          dragPointerId.current = null;
        }}
        onPointerCancel={() => {
          dragStartX.current = null;
          dragPointerId.current = null;
        }}
        aria-label="Happy Tails stories. Drag left or right to change pages."
      >
        <div className="story-grid" key={page}>
          {visibleStories.map((story, index) => (
            <article className="story-card" key={story.pet}>
              <div
                className="story-photo"
                role="img"
                aria-label={`${story.pet}, happily adopted`}
                style={{
                  backgroundImage: `url(https://images.unsplash.com/${story.image}?auto=format&fit=crop&w=800&q=82)`,
                }}
              >
                <span className="story-number">
                  {String(page * STORIES_PER_PAGE + index + 1).padStart(2, "0")}
                </span>
                <span className="story-adopted">♥ adopted</span>
              </div>
              <div className="story-copy">
                <div className="story-quote-mark" aria-hidden="true">
                  “
                </div>
                <blockquote>{story.quote}</blockquote>
                <div className="story-byline">
                  <span className="story-avatar">{story.mark}</span>
                  <span>
                    <strong>{story.family}</strong>
                    <small>{story.place}</small>
                  </span>
                </div>
                <div className="story-note">{story.note}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div
        className="story-pagination"
        aria-label="Happy Tails carousel controls"
      >
        <button
          className="story-page-arrow"
          onClick={() => goToPage(page - 1)}
          aria-label="Previous stories"
        >
          ←
        </button>
        <div
          className="story-page-dots"
          role="group"
          aria-label="Choose a story page"
        >
          {Array.from({ length: PAGE_COUNT }, (_, index) => (
            <button
              key={index}
              className={`story-page-dot${page === index ? " active" : ""}`}
              onClick={() => goToPage(index)}
              aria-label={`Go to Happy Tails page ${index + 1}`}
              aria-current={page === index ? "page" : undefined}
            />
          ))}
        </div>
        <span className="story-page-count">
          {page + 1} / {PAGE_COUNT}
        </span>
        <button
          className="story-page-arrow"
          onClick={() => goToPage(page + 1)}
          aria-label="Next stories"
        >
          →
        </button>
      </div>
      <a className="stories-cta" href="#discover">
        Your story could start here <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}
