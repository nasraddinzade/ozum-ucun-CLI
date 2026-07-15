# Google Play — Data Safety form answers (Özüm üçün)

Fill these into **Play Console → App content → Data safety**.

Key principle: the app stores everything **only on the device** and never sends
data off the device. In Google's terms, on-device-only processing is **not**
"collection." So almost every answer is **No**.

---

## 1. Data collection and security

**Does your app collect or share any of the required user data types?**
→ **No.**

> Justification (keep for your records): All data (journal reflections, check-ins,
> progress, settings) is stored only in a local database on the user's device. The
> app has no backend server, no account system, and no network transmission of user
> data. Therefore no data is "collected" or "shared" as defined by Google Play.

**Is all of the user data collected by your app encrypted in transit?**
→ Not applicable / N/A (no data is transmitted). If the form forces a choice,
choose the option indicating no data is collected or transferred.

**Do you provide a way for users to request that their data is deleted?**
→ **Yes** — users can delete all data in-app via **Settings → Delete all data**,
and uninstalling removes everything. (There is no server-side data.)

---

## 2. Data types — answer NO to every category

For each data type below, select **"No, my app does not collect or share this":**

- Location (approximate, precise) → No
- Personal info (name, email, user IDs, address, phone, race, political, etc.) → No
- Financial info → No
- Health and fitness → No
- Messages (emails, SMS, in-app) → No
- Photos and videos → No
- Audio files → No
- Files and docs → No
- Calendar → No
- Contacts → No
- App activity (interactions, search history, installed apps) → No
- Web browsing → No
- App info and performance (crash logs, diagnostics) → No
- Device or other IDs → No

> Note: The journal/reflection text the user writes never leaves the device, so it
> is **not** reported as "Messages" or "Personal info" collection.

---

## 3. Other Play Console sections to complete

**Privacy policy URL** (App content → Privacy policy):
`https://ozum-ucun-privacy.netlify.app/`
(Live and hosted on Netlify — repo stays private.)

**Content rating questionnaire** (App content → Content rating):
- Category: Reference, News, or Education (choose Education/Reference).
- Violence: None. Sexuality: None (themes discuss love/relationships
  philosophically, no explicit content). Profanity: None. Controlled substances:
  None. Gambling: None.
- Expected rating: Everyone / PEGI 3–7 (mature *themes* but no explicit content;
  if asked about "mature/suggestive themes," answer honestly — mild).

**Ads:** Does your app contain ads? → **No.**

**Target audience and content** (App content → Target audience):
- Target age: 13+ (teen and up) — recommended, given the philosophical themes.
- Not designed for children.

**App access:** All functionality is available without special access / login →
declare "All functionality is available without restrictions."

**Government apps / Financial features / Health:** → No to all.

---

## Privacy policy hosting — DONE

The privacy policy is live at **https://ozum-ucun-privacy.netlify.app/**
(hosted on Netlify from the standalone `docs/index.html`; the GitHub repo can stay
private). Use this exact URL in Play Console → App content → Privacy policy.
