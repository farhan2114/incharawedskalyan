import React, { useState } from "react";
import { weddingConfig } from "../wedding.config";
import { Ornament, SpinningMandala } from "./Ornaments";
import { RevealOnScroll } from "./RevealOnScroll";
import { saveRsvp } from "../lib/supabase";

type AttendanceMap = Record<string, "attending" | "declining" | null>;

interface RsvpData {
  name: string;
  contact: string;
  guestCount: number;
  attendance: AttendanceMap;
  note: string;
  submittedAt: string;
  submissionId?: string;
  originalContact?: string;
  originalName?: string;
}

const STORAGE_KEY = "rsvp_submission_inchara_kalyan";

export const RsvpSection: React.FC = () => {
  const { couple, events } = weddingConfig;

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [attendance, setAttendance] = useState<AttendanceMap>(
    Object.fromEntries(events.map((e) => [e.name, null]))
  );
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalContact, setOriginalContact] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [submissionId, setSubmissionId] = useState("");

  const [submitted, setSubmitted] = useState<RsvpData | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as RsvpData;
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string | null>(null);

  const toggleAttendance = (eventName: string, status: "attending" | "declining") => {
    setAttendance((prev) => ({
      ...prev,
      [eventName]: prev[eventName] === status ? null : status,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!contact.trim()) {
      setError("Please enter your email or phone number.");
      return;
    }
    const anySelected = Object.values(attendance).some((v) => v !== null);
    if (!anySelected) {
      setError("Please select your attendance for at least one celebration.");
      return;
    }

    const attendingList = events
      .filter((ev) => attendance[ev.name] === "attending")
      .map((ev) => ev.name)
      .join(", ");

    const declinedList = events
      .filter((ev) => attendance[ev.name] === "declining")
      .map((ev) => ev.name)
      .join(", ");

    const currentSubmissionId =
      submissionId ||
      submitted?.submissionId ||
      `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const prevContact = originalContact || contact.trim();
    const prevName = originalName || name.trim();

    const data: RsvpData = {
      name: name.trim(),
      contact: contact.trim(),
      guestCount,
      attendance,
      note: note.trim(),
      submittedAt: new Date().toISOString(),
      submissionId: currentSubmissionId,
      originalContact: prevContact,
      originalName: prevName,
    };

    setIsSubmitting(true);
    await saveRsvp({
      name: data.name,
      email: data.contact,
      guest_count: data.guestCount,
      attending_events: attendingList || "None",
      declined_events: declinedList || "None",
      haldi: attendance["Haldi"] === "attending" ? "Yes" : "No",
      sangeet: attendance["Sangeet"] === "attending" ? "Yes" : "No",
      wedding: attendance["Wedding"] === "attending" ? "Yes" : "No",
      note: data.note || "",
      isUpdate: isEditing,
      originalEmail: prevContact,
      originalName: prevName,
      submissionId: currentSubmissionId,
    });
    setIsSubmitting(false);
    setIsEditing(false);
    setOriginalContact(data.contact);
    setOriginalName(data.name);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore storage errors
    }

    setSubmitted(data);
  };

  const handleEditRsvp = () => {
    if (!submitted) return;
    setName(submitted.name);
    setContact(submitted.contact);
    setGuestCount(submitted.guestCount);
    setAttendance(submitted.attendance);
    setNote(submitted.note);
    setOriginalContact(submitted.originalContact || submitted.contact);
    setOriginalName(submitted.originalName || submitted.name);
    setSubmissionId(
      submitted.submissionId ||
      `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    );
    setIsEditing(true);
    setSubmitted(null);
  };

  const inputClass =
    "w-full border-b border-gold/40 bg-transparent px-1 py-3 font-sans text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-gold";

  const attendingEvents = submitted
    ? events.filter((e) => submitted.attendance[e.name] === "attending")
    : [];

  return (
    <section id="rsvp" className="relative overflow-hidden px-5 py-12 sm:py-16">
      <SpinningMandala className="-right-20 top-1/2 w-48 sm:w-64" />
      <Ornament variant="gold" className="-left-8 top-14 w-36 rotate-6 sm:w-48" />
      <Ornament variant="leaf" className="-right-10 bottom-10 w-36 -rotate-6 sm:w-52" />

      <div className="relative mx-auto max-w-4xl">
        <RevealOnScroll className="text-center">
          <p className="eyebrow">Join us in celebration</p>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl">RSVP</h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Let us know which celebrations you will be joining. We cannot wait to celebrate with you!
          </p>
        </RevealOnScroll>

        <div className="mt-10">
          {submitted ? (
            <RevealOnScroll>
              <div className="paper-card mx-auto max-w-xl px-7 py-10 text-center sm:px-12 sm:py-14">
                <span className="text-4xl">🎉</span>
                <p className="eyebrow mt-6">RSVP Confirmed</p>
                <h3 className="mt-4 font-display text-3xl sm:text-4xl">
                  Thank you, {submitted.name}!
                </h3>
                <div className="rule-gold mx-auto mt-6 w-24" />

                {attendingEvents.length > 0 ? (
                  <>
                    <p className="mt-6 text-sm text-muted-foreground">
                      We are so excited to celebrate with you at:
                    </p>
                    <ul className="mt-4 space-y-2">
                      {attendingEvents.map((ev) => (
                        <li key={ev.name} className="font-title text-sm tracking-wider">
                          <span className="text-gold font-semibold">{ev.name}</span>
                          <span className="ml-2 text-muted-foreground text-xs">
                            — {ev.day}, {ev.time}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Guest count:{" "}
                      <span className="font-title text-foreground">{submitted.guestCount}</span>
                    </p>
                  </>
                ) : (
                  <p className="mt-6 text-sm text-muted-foreground">
                    We will miss you! Wishing you all the best from afar.
                  </p>
                )}

                {submitted.note && (
                  <p className="mx-auto mt-6 max-w-sm text-xs italic leading-relaxed text-muted-foreground">
                    "{submitted.note}"
                  </p>
                )}

                <button
                  onClick={handleEditRsvp}
                  className="mt-9 inline-block border border-gold/50 px-6 py-3 text-[0.7rem] uppercase tracking-[0.28em] text-gold transition-colors hover:bg-gold/10"
                >
                  Edit my RSVP
                </button>
              </div>
            </RevealOnScroll>
          ) : (
            <RevealOnScroll>
              <form
                onSubmit={handleSubmit}
                className="paper-card mx-auto max-w-2xl px-7 py-10 sm:px-12 sm:py-14"
              >
                {isEditing && (
                  <div className="mb-6 flex items-center justify-between rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-xs text-gold-deep">
                    <span className="font-serif">✏️ Updating your existing response (same row will be updated)</span>
                    <button
                      type="button"
                      onClick={() => {
                        const saved = localStorage.getItem(STORAGE_KEY);
                        if (saved) setSubmitted(JSON.parse(saved));
                        setIsEditing(false);
                      }}
                      className="underline hover:text-foreground ml-2 text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <div className="grid gap-6 sm:grid-cols-2">
                  <input
                    className={inputClass}
                    placeholder="Your full name *"
                    maxLength={80}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Email or phone number *"
                    maxLength={100}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Number of guests attending (including yourself)
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                      className="h-9 w-9 border border-gold/50 text-lg text-gold transition-colors hover:bg-gold/10"
                    >
                      −
                    </button>
                    <span className="font-title text-2xl w-8 text-center">{guestCount}</span>
                    <button
                      type="button"
                      onClick={() => setGuestCount((g) => Math.min(20, g + 1))}
                      className="h-9 w-9 border border-gold/50 text-lg text-gold transition-colors hover:bg-gold/10"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-9">
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground mb-5">
                    Which celebrations will you be joining? *
                  </p>
                  <div className="space-y-4">
                    {events.map((ev) => (
                      <div
                        key={ev.name}
                        className="border border-gold/20 px-5 py-4 sm:px-6"
                      >
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="font-title text-sm font-semibold break-words leading-snug">
                              {ev.name}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {ev.day} · {ev.time}
                            </p>
                          </div>
                          <div className="flex gap-2 mt-3 sm:mt-0 sm:flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => toggleAttendance(ev.name, "attending")}
                              className={`px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.2em] border transition-colors ${
                                attendance[ev.name] === "attending"
                                  ? "bg-gold/20 border-gold text-gold font-semibold"
                                  : "border-gold/30 text-muted-foreground hover:border-gold/60"
                              }`}
                            >
                              ✓ Attending
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleAttendance(ev.name, "declining")}
                              className={`px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.2em] border transition-colors ${
                                attendance[ev.name] === "declining"
                                  ? "bg-maroon/10 border-maroon/60 text-maroon font-semibold"
                                  : "border-gold/30 text-muted-foreground hover:border-gold/60"
                              }`}
                            >
                              ✕ Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <textarea
                  className={`${inputClass} mt-8 resize-none`}
                  placeholder={`A note for ${couple.bride} & ${couple.groom} (optional)`}
                  rows={3}
                  maxLength={400}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />

                {error && (
                  <p className="mt-4 text-center font-title text-xs tracking-wider text-maroon">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-9 w-full border border-gold/60 py-4 text-[0.7rem] uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (isEditing ? "Updating RSVP..." : "Submitting RSVP...") : isEditing ? "Update RSVP Response" : "Submit RSVP"}
                </button>
              </form>
            </RevealOnScroll>
          )}
        </div>
      </div>
    </section>
  );
};
