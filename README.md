# David's Cool Components

A playful .NET 10 Blazor WebAssembly playground exploring how raw HTML, CSS,
and JavaScript examples can become interactive Blazor components.

## Getting started

Install the [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0).
From the repository root:

```powershell
dotnet restore NexCorp.slnx
dotnet run --project NexCorp.Client
```

Open the localhost URL printed in the terminal. You can also open
`NexCorp.slnx` in an IDE that supports .NET 10.

```powershell
dotnet build NexCorp.slnx
dotnet publish NexCorp.Client -c Release
```

This is a standalone client-side app: no database or application backend is
required. Published static files are under
`NexCorp.Client\bin\Release\net10.0\publish\wwwroot`.
Configure your static host to return `index.html` for client-side routes.

## Demos

| Page | Route | What it does |
| --- | --- | --- |
| Countdown | `/` | Displays colorful days, hours, minutes, and seconds cards until a chosen date. |
| Digital clock | `/clock` | Displays local date and time with configurable date, seconds, and 12/24-hour formatting. |
| Testimonial slider | `/testimonialslider` | Rotates three sample testimonials every 10 seconds, with pause/resume and slide selection. |

### Countdown

Right-click the red Days card to set a future date and time in the browser's
local time zone. Clicking, tapping, or keyboard-activating Days also opens the
editor. Escape cancels. The target is stored in this browser's local storage
and survives reloads. When the target is reached, all values stop at zero.

The first visit starts with an example countdown of 11 days, 4 hours, 25 minutes,
and 58 seconds. Smaller screens display the cards in a two-by-two grid.

### Digital clock

The clock uses the current time on the device running the browser and updates
every second. It is not a server-synchronized clock.

### Testimonial slider

The slider uses the app's dark/blue styling and locally stored portraits in
`wwwroot\images\testimonials`. If a portrait cannot load, the author's initials
and an unavailable notice are displayed.

The comments and generated portraits are demonstration content, not real
customer endorsements.

### Slide-out navigation

The shared header has an upper-right hamburger button on desktop and mobile.
It opens a left-side **Coding with David** navigation drawer containing all
three demos. Close it with the X, Escape, a click outside, or by selecting a page.
The native modal dialog keeps keyboard focus inside while open, and sliding
animations respect the browser's reduced-motion preference.

## Reusing components

### Countdown

Use `NexCorp.Client.Components.Countdown` on any Razor page:

```razor
@using NexCorp.Client.Components

<Countdown StorageKey="product-launch"
           InitialTargetDate="@new DateTimeOffset(2027, 1, 1, 0, 0, 0, TimeSpan.Zero)" />
```

Both parameters are optional. `StorageKey` defaults to
`cool-components.countdown.target`, preserving the home page's saved date.
Give separate countdowns different keys to save their dates independently.
`InitialTargetDate` is used only when no saved date exists; without it, the
example duration is used. Set these parameters when creating an instance;
changing them on an existing instance does not reset its countdown.

The component scales to its container and switches to two columns below a
600px container width. Its card/editor CSS is isolated; the full-screen dark
background belongs to the home page, not the component.

### Digital clock

```razor
@using NexCorp.Client.Components

<DigitalClock Title="MY CLOCK"
              ShowDate="true"
              ShowSeconds="true"
              Use24HourFormat="true" />
```

The default title is `DIGITAL CLOCK`; date and seconds are shown by default,
and the default time format is 12-hour with an AM/PM indicator.

### Shared header

```razor
@using NexCorp.Client.Components

<SiteHeader />
```

Include the header once on each page that should provide the shared branding
and navigation.

## Project structure

```text
NexCorp.slnx
NexCorp.Client\
  Components\       Countdown, DigitalClock, SiteHeader and isolated CSS
  Pages\            Home, Clock, TestimonialSlider and page styling
  wwwroot\
    css\            Shared typography and base styles
    images\         Local testimonial portraits
    js\             Countdown storage/date helpers and sidebar animation
BlogPost.md         Companion article for the component-building series
```

The project retains its original `NexCorp.Client` name; the visible app branding
is **David's Cool Components**.

## Implementation notes

Blazor state and event handlers drive the UI. JavaScript interop is limited to
browser-specific tasks such as local storage, local date parsing, and dialog
animation. Time-based components cancel and dispose their timer loops when
removed.

The countdown requires browser local storage to save its target and reports
load/save errors explicitly. Fonts are loaded from Google Fonts; browser
fallback fonts are used when that service is unavailable. The logo and
testimonial portraits are served locally.


