import { useLayoutEffect, useRef, useState } from "react";
import { usePetSearch } from "../hooks/usePetApi";
import type { Pet, PetSize, Species } from "../types/pet";

const formatAge = (months: number) =>
  months < 12
    ? `${months} months`
    : `${Math.floor(months / 12)} ${Math.floor(months / 12) === 1 ? "year" : "years"}${months % 12 ? ` ${months % 12} months` : ""}`;

export function PetSearchDirectory() {
  const { pets, pagination, loading, error, params, updateFilters, setPage } =
    usePetSearch();
  const [category, setCategory] = useState<"all" | "Dog" | "Cat" | "Other">(
    "all",
  );
  const [saved, setSaved] = useState<string[]>([]);
  const [pageDirection, setPageDirection] = useState<"forward" | "backward">(
    "forward",
  );
  const touchStartX = useRef<number | null>(null);
  const pendingScrollY = useRef<number | null>(null);

  const changePage = (page: number) => {
    if (loading) return;
    pendingScrollY.current = window.scrollY;
    setPageDirection(
      page > (pagination?.current_page ?? 1) ? "forward" : "backward",
    );
    setPage(page);
  };

  useLayoutEffect(() => {
    if (pendingScrollY.current === null) return;
    window.scrollTo({ top: pendingScrollY.current, behavior: "instant" });
    pendingScrollY.current = null;
  }, [pagination?.current_page]);

  const updateCategory = (value: "all" | "Dog" | "Cat" | "Other") => {
    setCategory(value);
    updateFilters({
      species: value === "all" ? undefined : value,
      good_with_kids: undefined,
      good_with_pets: undefined,
    });
  };

  const toggleSaved = (id: string) =>
    setSaved((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id],
    );

  return (
    <>
      <section className="search-wrap" id="discover">
        <div className="search-head">
          <div>
            <div className="eyebrow muted">THEIR NEXT CHAPTER STARTS HERE</div>
            <h2>
              Find your kind of <em>pet.</em>
            </h2>
          </div>
          <a className="match-button" href="#how">
            <span className="match-button-icon" aria-hidden="true">
              ✦
            </span>
            <span className="match-button-copy">
              <strong>Take the quiz</strong>
              <small>8 thoughtful questions · about 5 minutes</small>
            </span>
            <span className="match-button-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
        <div className="filters typed-filters">
          <label className="filter-field">
            <span>I'm looking for</span>
            <select
              value={params.species ?? ""}
              onChange={(event) => {
                const species = (event.target.value || undefined) as
                  Species | undefined;
                setCategory(
                  species === "Dog" || species === "Cat"
                    ? species
                    : species
                      ? "Other"
                      : "all",
                );
                updateFilters({ species });
              }}
            >
              <option value="">Any kind of friend</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
              <option value="Other">Others</option>
            </select>
          </label>
          <label className="filter-field">
            <span>Size</span>
            <select
              value={params.size ?? ""}
              onChange={(event) =>
                updateFilters({
                  size: (event.target.value || undefined) as
                    PetSize | undefined,
                })
              }
            >
              <option value="">Any size</option>
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
              <option>Extra Large</option>
            </select>
          </label>
          <label className="filter-field">
            <span>Age</span>
            <select
              value={
                params.max_age_months === 23
                  ? "young"
                  : params.min_age_months === 24
                    ? "adult"
                    : ""
              }
              onChange={(event) =>
                updateFilters(
                  event.target.value === "young"
                    ? { min_age_months: undefined, max_age_months: 23 }
                    : event.target.value === "adult"
                      ? { min_age_months: 24, max_age_months: undefined }
                      : {
                          min_age_months: undefined,
                          max_age_months: undefined,
                        },
                )
              }
            >
              <option value="">Any age</option>
              <option value="young">Under 2 years</option>
              <option value="adult">2 years and up</option>
            </select>
          </label>
          <button
            className="search-button"
            onClick={() =>
              document
                .querySelector(".pets-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            aria-label="View search results"
          >
            ⌕
          </button>
        </div>
        <div className="tag-row">
          <button
            className={`tag ${category === "all" ? "active" : ""}`}
            onClick={() => updateCategory("all")}
          >
            All pets
          </button>
          <button
            className={`tag ${category === "Cat" ? "active" : ""}`}
            onClick={() => updateCategory("Cat")}
          >
            Cats
          </button>
          <button
            className={`tag ${category === "Dog" ? "active" : ""}`}
            onClick={() => updateCategory("Dog")}
          >
            Dogs
          </button>
          <button
            className={`tag ${category === "Other" ? "active" : ""}`}
            onClick={() => updateCategory("Other")}
          >
            Others
          </button>
          <span className="results-note">
            <span className="online-dot" />
            {pagination?.total_records ?? "…"} pets in this result
          </span>
        </div>
      </section>
      <section className="pets-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow muted">A FEW FACES TO FALL FOR</div>
            <h2>
              Waiting for <em>you.</em>
            </h2>
          </div>
          <span className="view-all">
            Page {pagination?.current_page ?? 1}
            {pagination?.total_pages ? ` of ${pagination.total_pages}` : ""}
          </span>
        </div>
        {loading && pets.length === 0 ? (
          <div className="loading-state" role="status">
            Finding lovely pets…
          </div>
        ) : error ? (
          <div className="api-error" role="alert">
            {error}
          </div>
        ) : pets.length === 0 ? (
          <div className="empty-state show">
            <span>♡</span>
            <h3>No matches just yet</h3>
            <p>Try adjusting your filters to meet more lovely pets.</p>
            <button
              className="button button-dark"
              onClick={() => {
                setCategory("all");
                updateFilters({
                  species: undefined,
                  size: undefined,
                  min_age_months: undefined,
                  max_age_months: undefined,
                  good_with_kids: undefined,
                  good_with_pets: undefined,
                });
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div
              className={`pet-carousel carousel-page carousel-${pageDirection}`}
              key={pagination?.current_page ?? 1}
              aria-busy={loading}
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0]?.clientX ?? null;
              }}
              onTouchEnd={(event) => {
                if (touchStartX.current === null || !pagination || loading)
                  return;
                const distance =
                  event.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(distance) > 55) {
                  const nextPage =
                    distance < 0
                      ? Math.min(
                          pagination.current_page + 1,
                          pagination.total_pages,
                        )
                      : Math.max(pagination.current_page - 1, 1);
                  if (nextPage !== pagination.current_page)
                    changePage(nextPage);
                }
                touchStartX.current = null;
              }}
            >
              {Array.from(
                { length: Math.ceil(pets.length / 4) },
                (_, rowIndex) => {
                  const rowPets = pets.slice(rowIndex * 4, rowIndex * 4 + 4);
                  const cards = rowPets.map((pet) => (
                    <PetCard
                      key={pet.id}
                      pet={pet}
                      saved={saved.includes(pet.id)}
                      onSave={() => toggleSaved(pet.id)}
                    />
                  ));

                  return rowIndex === 1 &&
                    pagination &&
                    pagination.total_pages > 1 ? (
                    <div
                      className="pet-carousel-row pet-carousel-row-with-controls"
                      key={rowIndex}
                    >
                      <button
                        className="pet-carousel-arrow"
                        disabled={loading || pagination.current_page <= 1}
                        onClick={() => changePage(pagination.current_page - 1)}
                        aria-label="Show previous pets"
                      >
                        {"<"}
                      </button>
                      <div className="pet-grid">{cards}</div>
                      <button
                        className="pet-carousel-arrow"
                        disabled={
                          loading ||
                          pagination.current_page >= pagination.total_pages
                        }
                        onClick={() => changePage(pagination.current_page + 1)}
                        aria-label="Show next pets"
                      >
                        {">"}
                      </button>
                    </div>
                  ) : (
                    <div className="pet-carousel-row pet-grid" key={rowIndex}>
                      {cards}
                    </div>
                  );
                },
              )}
            </div>
            {pagination && pagination.total_pages > 1 && (
              <div className="pagination">
                <button
                  className="tag"
                  disabled={loading || pagination.current_page <= 1}
                  onClick={() => changePage(pagination.current_page - 1)}
                  aria-label="Show previous pets"
                >
                  ← Previous
                </button>
                <span>
                  Page {pagination.current_page} of {pagination.total_pages}
                </span>
                <button
                  className="tag"
                  disabled={
                    loading || pagination.current_page >= pagination.total_pages
                  }
                  onClick={() => changePage(pagination.current_page + 1)}
                  aria-label="Show next pets"
                >
                  Next →
                </button>
                <div
                  className="carousel-dots"
                  role="group"
                  aria-label="Pet pages"
                >
                  {Array.from(
                    { length: pagination.total_pages },
                    (_, index) => (
                      <button
                        key={index + 1}
                        className={`carousel-dot${pagination.current_page === index + 1 ? " active" : ""}`}
                        aria-label={`Go to pet page ${index + 1}`}
                        aria-current={
                          pagination.current_page === index + 1
                            ? "page"
                            : undefined
                        }
                        disabled={loading}
                        onClick={() => changePage(index + 1)}
                      />
                    ),
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

function PetCard({
  pet,
  saved,
  onSave,
}: {
  pet: Pet;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <article className="pet-card">
      <div
        className="pet-photo"
        style={{
          backgroundImage: pet.primary_image_url
            ? `url('${pet.primary_image_url}')`
            : undefined,
        }}
      >
        <span className="pet-badge">{pet.display_status ?? pet.status}</span>
        <button
          className={`favorite ${saved ? "saved" : ""}`}
          aria-label={saved ? `Unsave ${pet.name}` : `Save ${pet.name}`}
          aria-pressed={saved}
          onClick={onSave}
        >
          {saved ? "♥" : "♡"}
        </button>
        <span className="pet-photo-caption">
          {pet.species === "Dog" ? "🐾" : pet.species === "Cat" ? "🐈" : "✿"}{" "}
          &nbsp;Waiting at {pet.shelter.name}
        </span>
      </div>
      <div className="pet-info">
        <div className="pet-title">
          <h3>{pet.name}</h3>
          <span className="sex">
            {pet.gender === "Female" ? "♀" : pet.gender === "Male" ? "♂" : "•"}
          </span>
        </div>
        <div className="pet-meta">
          {pet.breed || "Unknown mix"} · {formatAge(pet.age_months)}
        </div>
        {pet.bio && <p className="pet-bio">{pet.bio}</p>}
        <div className="pet-traits">
          {pet.good_with_kids && <span>Good with kids</span>}
          {pet.good_with_pets && <span>Pet friendly</span>}
        </div>
        <div className="pet-distance">
          <span>
            ⌖ {pet.shelter.city}, {pet.shelter.state}
          </span>
          <b>{pet.size}</b>
        </div>
      </div>
    </article>
  );
}
