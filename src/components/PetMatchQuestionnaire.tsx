import { useState, type FormEvent } from "react";
import { usePetMatch } from "../hooks/usePetApi";
import type { LifestyleMatchParams, PetSize, Species } from "../types/pet";

type QuizData = Partial<LifestyleMatchParams> & {
  preferred_species: Species[];
  preferred_sizes: PetSize[];
  min_age_months?: number;
  open_to_special_care?: boolean;
};

type QuizKey =
  | "preferred_species"
  | "housing_type"
  | "owns_or_rents"
  | "has_children"
  | "has_other_pets"
  | "activity_level"
  | "preferred_sizes"
  | "age_range"
  | "open_to_special_care";

type QuizOption = {
  value: string;
  icon: string;
  label: string;
  detail: string;
};
type QuizQuestion = {
  key: QuizKey;
  prompt: string;
  note: string;
  multi?: boolean;
  options: QuizOption[];
};

const initialForm: QuizData = {
  preferred_species: [],
  preferred_sizes: [],
  open_to_special_care: undefined,
};

const questions: QuizQuestion[] = [
  {
    key: "housing_type",
    prompt: "What is your home like on an ordinary day?",
    note: "Consider your indoor space, shared walls, building rules, and where a new companion would settle in.",
    options: [
      {
        value: "House",
        icon: "⌂",
        label: "House",
        detail: "A private home, with its own layout and neighborhood routine",
      },
      {
        value: "Apartment",
        icon: "▤",
        label: "Apartment",
        detail: "A compact home where noise, stairs, and nearby walks matter",
      },
      {
        value: "Condo",
        icon: "⌂",
        label: "Condo",
        detail: "A shared building with community rules and common spaces",
      },
    ],
  },
  {
    key: "owns_or_rents",
    prompt: "What would it take to get a pet approved where you live?",
    note: "If you rent or live in a managed community, check pet limits, deposits, and any size or breed policies before applying.",
    options: [
      {
        value: "Own",
        icon: "⌂",
        label: "I own my home",
        detail: "I can make the household decisions about welcoming a pet",
      },
      {
        value: "Rent",
        icon: "⌑",
        label: "I rent",
        detail: "I’ll confirm permission, fees, and any pet restrictions first",
      },
    ],
  },
  {
    key: "has_children",
    prompt: "Who will be part of your pet’s day-to-day household?",
    note: "Think about children who live with you or visit often. A calm introduction and the pet’s individual history both matter.",
    options: [
      {
        value: "yes",
        icon: "♡",
        label: "Children are around",
        detail:
          "I’ll look for a pet whose known comfort with kids suits our household",
      },
      {
        value: "no",
        icon: "⌂",
        label: "Adults only",
        detail: "Children aren’t part of our regular household routine",
      },
    ],
  },
  {
    key: "has_other_pets",
    prompt: "How would a new pet fit with the animals already in your life?",
    note: "Include pets who share your home regularly. Slow introductions and each animal’s boundaries can shape a good transition.",
    options: [
      {
        value: "yes",
        icon: "🐾",
        label: "I have other pets",
        detail:
          "A careful introduction and compatible personalities will be important",
      },
      {
        value: "no",
        icon: "♡",
        label: "No other pets",
        detail: "This companion would be the only animal in my household",
      },
    ],
  },
  {
    key: "activity_level",
    prompt: "How much activity can you comfortably make part of most days?",
    note: "Picture a typical workday and weekend. Choose the pace you can sustain, including walks, play, enrichment, and downtime.",
    options: [
      {
        value: "low",
        icon: "☁",
        label: "A gentler routine",
        detail:
          "Short outings, calm enrichment, and plenty of relaxed time together",
      },
      {
        value: "moderate",
        icon: "☀",
        label: "A balanced routine",
        detail:
          "Regular walks or play, followed by a comfortable stretch of downtime",
      },
      {
        value: "high",
        icon: "✦",
        label: "An active routine",
        detail:
          "Longer outings, training, and daily activities are already part of my plans",
      },
    ],
  },
  {
    key: "preferred_sizes",
    prompt: "What size would work best in your home and routine?",
    note: "Think about handling, transport, available space, and any building restrictions. Select all sizes you can welcome.",
    multi: true,
    options: [
      {
        value: "Small",
        icon: "·",
        label: "Small",
        detail:
          "Easy to lift or travel with, while still needing daily care and attention",
      },
      {
        value: "Medium",
        icon: "··",
        label: "Medium",
        detail: "A middle ground for space, handling, and everyday activities",
      },
      {
        value: "Large",
        icon: "···",
        label: "Large",
        detail: "I have room and feel comfortable managing a larger companion",
      },
      {
        value: "Extra Large",
        icon: "♥",
        label: "Extra large",
        detail:
          "I can plan for the space, strength, and transport a giant friend may need",
      },
      {
        value: "any",
        icon: "✨",
        label: "Any size",
        detail:
          "I’m flexible, as long as the individual pet suits my household",
      },
    ],
  },
  {
    key: "age_range",
    prompt:
      "Which life stage best matches the time and patience you can offer?",
    note: "Young pets may need more structure and training; adults and seniors may have more established routines. Age is only one part of the picture.",
    options: [
      {
        value: "any",
        icon: "✦",
        label: "I’m open to any age",
        detail:
          "I’ll focus on the pet’s personality and needs more than their age",
      },
      {
        value: "young",
        icon: "☀",
        label: "Young",
        detail:
          "I can make time for learning, supervision, and a changing routine",
      },
      {
        value: "adult",
        icon: "♡",
        label: "Adult",
        detail: "I’d welcome a companion with a more established life stage",
      },
      {
        value: "senior",
        icon: "☁",
        label: "Senior",
        detail:
          "I can offer a comfortable home and plan around age-related needs",
      },
    ],
  },
  {
    key: "open_to_special_care",
    prompt: "What level of ongoing care are you prepared to take on?",
    note: "Extra care can mean medication, follow-up visits, mobility support, behavior training, or a slower adjustment. Ask the shelter what each pet specifically needs.",
    options: [
      {
        value: "yes",
        icon: "♡",
        label: "I can explore extra care",
        detail:
          "I’m willing to learn about a pet’s needs, costs, and available support",
      },
      {
        value: "no",
        icon: "✦",
        label: "I need a simpler routine",
        detail:
          "For now, I’m best prepared for a pet without known ongoing special care",
      },
    ],
  },
];

export function PetMatchQuestionnaire() {
  const { matches, loading, error, getMatches, resetMatches } = usePetMatch();
  const [form, setForm] = useState<QuizData>(initialForm);
  const [step, setStep] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const question = questions[step];

  const isSelected = (key: QuizKey, value: string) => {
    switch (key) {
      case "preferred_species":
        return value === "any"
          ? form.preferred_species.length === 0
          : form.preferred_species.includes(value as Species);
      case "housing_type":
        return form.housing_type === value;
      case "owns_or_rents":
        return form.owns_or_rents === value;
      case "has_children":
        return form.has_children === (value === "yes");
      case "has_other_pets":
        return form.has_other_pets === (value === "yes");
      case "activity_level":
        return form.activity_level === value;
      case "preferred_sizes":
        return value === "any"
          ? form.preferred_sizes.length === 0
          : form.preferred_sizes.includes(value as PetSize);
      case "age_range":
        if (value === "any")
          return (
            form.min_age_months === undefined &&
            form.max_age_months === undefined
          );
        if (value === "young") return form.max_age_months === 23;
        if (value === "adult")
          return (
            form.min_age_months === 24 && form.max_age_months === undefined
          );
        return form.min_age_months === 60 && form.max_age_months === undefined;
      case "open_to_special_care":
        return form.open_to_special_care === (value === "yes");
    }
  };

  const choose = (key: QuizKey, value: string) => {
    if (key === "preferred_species") {
      setForm((current) => ({
        ...current,
        preferred_species:
          value === "any"
            ? []
            : current.preferred_species.includes(value as Species)
              ? current.preferred_species.filter((species) => species !== value)
              : [...current.preferred_species, value as Species],
      }));
      return;
    }
    if (key === "preferred_sizes") {
      setForm((current) => ({
        ...current,
        preferred_sizes:
          value === "any"
            ? []
            : current.preferred_sizes.includes(value as PetSize)
              ? current.preferred_sizes.filter((size) => size !== value)
              : [...current.preferred_sizes, value as PetSize],
      }));
      return;
    }
    if (key === "age_range") {
      setForm((current) => ({
        ...current,
        min_age_months:
          value === "adult" ? 24 : value === "senior" ? 60 : undefined,
        max_age_months: value === "young" ? 23 : undefined,
      }));
      return;
    }
    if (key === "housing_type") {
      setForm((current) => ({
        ...current,
        housing_type: value as QuizData["housing_type"],
      }));
    } else if (key === "owns_or_rents") {
      setForm((current) => ({
        ...current,
        owns_or_rents: value as QuizData["owns_or_rents"],
      }));
    } else if (key === "has_children") {
      setForm((current) => ({ ...current, has_children: value === "yes" }));
    } else if (key === "has_other_pets") {
      setForm((current) => ({ ...current, has_other_pets: value === "yes" }));
    } else if (key === "activity_level") {
      setForm((current) => ({
        ...current,
        activity_level: value as QuizData["activity_level"],
      }));
    } else if (key === "open_to_special_care") {
      setForm((current) => ({
        ...current,
        open_to_special_care: value === "yes",
      }));
    }
  };

  const currentAnswered = question
    ? question.multi
      ? question.key === "preferred_species"
        ? true
        : true
      : question.options.some((option) =>
          isSelected(question.key, option.value),
        )
    : false;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < questions.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    try {
      await getMatches({
        housing_type: form.housing_type!,
        owns_or_rents: form.owns_or_rents!,
        has_yard: false,
        has_children: form.has_children!,
        has_other_pets: form.has_other_pets!,
        activity_level: form.activity_level!,
        preferred_species: form.preferred_species,
        preferred_sizes: form.preferred_sizes,
        min_age_months: form.min_age_months,
        max_age_months: form.max_age_months,
        open_to_special_care: form.open_to_special_care,
        limit: 6,
      });
      setShowResults(true);
    } catch {
      // Keep the last question visible so the adopter can see the error and retry.
    }
  };

  const restart = () => {
    setForm(initialForm);
    setStep(-1);
    setShowResults(false);
    resetMatches();
  };

  return (
    <section className="match-banner match-module" id="how">
      <div className="banner-blob">✳</div>
      <div className="match-module-content">
        <div className="eyebrow">A LITTLE HELP FROM US</div>
        <h2>
          Not sure who’s <em>your type?</em>
        </h2>
        <p className="match-intro-copy">
          Take a feel-good quiz about your home and everyday life. We’ll find
          the pets who could feel right at home with you.
        </p>

        {step === -1 && !showResults && (
          <div className="quiz-welcome">
            <div className="quiz-welcome-mark" aria-hidden="true">
              ✦
            </div>
            <div className="quiz-welcome-copy">
              <strong>
                Your next best friend, by the answers that feel like you.
              </strong>
              <span>
                8 thoughtful questions · about 5 minutes · no sign-up needed
              </span>
            </div>
            <button
              className="button button-dark quiz-start"
              onClick={() => setStep(0)}
            >
              Play the match game <span>↗</span>
            </button>
          </div>
        )}

        {question && !showResults && (
          <form className="match-quiz" onSubmit={submit}>
            <div className="quiz-progress-heading">
              <span>
                Question {step + 1} <small>of {questions.length}</small>
              </span>
              <span>
                {Math.round(((step + 1) / questions.length) * 100)}% complete
              </span>
            </div>
            <div
              className="quiz-progress-track"
              role="progressbar"
              aria-label="Quiz progress"
              aria-valuemin={0}
              aria-valuemax={questions.length}
              aria-valuenow={step + 1}
            >
              <span
                style={{ width: `${((step + 1) / questions.length) * 100}%` }}
              />
            </div>
            <fieldset className="quiz-question">
              <legend>{question.prompt}</legend>
              <p>{question.note}</p>
              <div className="quiz-choice-grid">
                {question.options.map((option) => (
                  <button
                    className={`quiz-choice${isSelected(question.key, option.value) ? " selected" : ""}`}
                    key={option.value}
                    type="button"
                    aria-pressed={isSelected(question.key, option.value)}
                    onClick={() => choose(question.key, option.value)}
                  >
                    <span className="quiz-choice-icon" aria-hidden="true">
                      {option.icon}
                    </span>
                    <span className="quiz-choice-text">
                      <strong>{option.label}</strong>
                      <small>{option.detail}</small>
                    </span>
                    <span className="quiz-choice-check" aria-hidden="true">
                      {isSelected(question.key, option.value) ? "✓" : ""}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
            {error && (
              <p className="quiz-submit-error" role="alert">
                We couldn’t load your matches. Your answers are saved here; try
                again in a moment. ({error})
              </p>
            )}
            <div className="quiz-navigation">
              <button
                className="quiz-back"
                type="button"
                onClick={() => setStep((current) => Math.max(0, current - 1))}
              >
                ← Back
              </button>
              <button
                className="button button-dark quiz-next"
                type="submit"
                disabled={!currentAnswered || loading}
              >
                {loading
                  ? "Finding your matches…"
                  : step === questions.length - 1
                    ? error
                      ? "Try again"
                      : "See my matches"
                    : "Keep going"}
                {!loading && (
                  <span>{step === questions.length - 1 ? "✦" : "→"}</span>
                )}
              </button>
            </div>
          </form>
        )}

        {showResults && (
          <div className="match-results">
            <div className="quiz-results-heading">
              <div>
                <div className="eyebrow">YOUR MATCH GAME RESULTS</div>
                <h3>
                  {matches.length
                    ? "Your kind of wonderful is waiting."
                    : "Your answers are ready."}
                </h3>
                <p>
                  {matches.length
                    ? `We found ${matches.length} pets whose profiles line up with your life.`
                    : "We couldn’t find a match just yet. Try widening your preferences and play again."}
                </p>
              </div>
              <button className="quiz-retake" type="button" onClick={restart}>
                Play again ↻
              </button>
            </div>
            {error && (
              <p className="api-error" role="alert">
                {error}
              </p>
            )}
            <div className="quiz-result-grid">
              {matches.map(({ pet, match_score, match_reasons }) => (
                <article className="quiz-result-card" key={pet.id}>
                  {pet.primary_image_url && (
                    <img src={pet.primary_image_url} alt={pet.name} />
                  )}
                  <div className="quiz-result-copy">
                    <div className="match-result-title">
                      <h4>{pet.name}</h4>
                      <span>{match_score}% fit</span>
                    </div>
                    <p>
                      {pet.breed} · {pet.size}
                    </p>
                    {match_reasons.length > 0 && (
                      <small>{match_reasons[0]}</small>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
      <span className="banner-doodle">♥</span>
    </section>
  );
}
