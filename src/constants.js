export const uid = () => Math.random().toString(36).slice(2, 9);
export const now = () => new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });

export const PRESET_COVERS = [
  { id:"book-cover", label:"Book Journal", style:{ backgroundImage:"url(/covers/book-journal.jpeg)", backgroundSize:"cover", backgroundPosition:"center" } },
  { id:"cooking-cover", label:"Cooking Journal", style:{ backgroundImage:"url(/covers/cooking-journal.jpeg)", backgroundSize:"cover", backgroundPosition:"center" } },
  { id:"movie-cover", label:"Movie Journal", style:{ backgroundImage:"url(/covers/movie-journal.jpeg)", backgroundSize:"cover", backgroundPosition:"center" } },
  { id:"todo-cover", label:"To-Do Journal", style:{ backgroundImage:"url(/covers/todo-journal.jpeg)", backgroundSize:"cover", backgroundPosition:"center" } },
  { id:"marble-cover", label:"Marble Texture", style:{ backgroundImage:"url(/covers/marble.jpeg)", backgroundSize:"cover", backgroundPosition:"center" } },
  { id:"paint-cover", label:"Paint Splotches", style:{ backgroundImage:"url(/covers/paint.jpeg)", backgroundSize:"cover", backgroundPosition:"center" } },
];

export const TEMPLATES = [
  { id:"dotted-1", label:"Dotted [Narrow]", tier:"free", path:"/templates/free/dotted-1.png"},
  { id:"dotted-2", label:"Dotted [Wide]", tier:"free", path:"/templates/free/dotted-2.png"},
  { id:"grid-2", label:"Grid [Narrow]", tier:"free", path:"/templates/free/grid-2.png"},
  { id:"grid-1", label:"Grid [Wide]", tier:"free", path:"/templates/free/grid-1.png"},
  { id:"lined-1", label:"Lined", tier:"free", path:"/templates/free/lined-1.png"},
  { id:"lined-2", label:"Lined [Columns]", tier:"free", path:"/templates/free/lined-2.png"},

  { id:"planner-1", label:"Day [Dotted]",  tier:"pro", category:"Planner", path:"/templates/pro/planner-1.png"},
  { id:"planner-2", label:"2 Days [Dotted]",  tier:"pro", category:"Planner", path:"/templates/pro/planner-2.png"},
  { id:"planner-3", label:"2 Days [Blank]",  tier:"pro", category:"Planner", path:"/templates/pro/planner-3.png"},
  { id:"planner-4", label:"Day [Blank]",  tier:"pro", category:"Planner", path:"/templates/pro/planner-4.png"},
  { id:"planner-5", label:"Month 1",  tier:"pro", category:"Planner", path:"/templates/pro/planner-5.png"},
  { id:"planner-6", label:"Month 2",  tier:"pro", category:"Planner", path:"/templates/pro/planner-6.png"},

  { id:"cooking-1", label:"Recipe Page",  tier:"pro", category:"Cooking", path:"/templates/pro/cooking-1.png"},
  { id:"cooking-2", label:"Meal Planner", tier:"pro", category:"Cooking", path:"/templates/pro/cooking-2.png"},
  { id:"cooking-3", label:"Cook's Notes", tier:"pro", category:"Cooking", path:"/templates/pro/cooking-3.png"},
  { id:"cooking-4", label:"Cooking Journal", tier:"pro", category:"Cooking", path:"/templates/pro/cooking-4.png"},

  { id:"reading-1", label:"Book Log", tier:"pro", category:"Reading", path:"/templates/pro/reading-1.png"},
  { id:"reading-2", label:"Book Review", tier:"pro", category:"Reading", path:"/templates/pro/reading-2.png"},
  { id:"reading-3", label:"TBR List", tier:"pro", category:"Reading", path:"/templates/pro/reading-3.png"},

  { id:"movie-1", label:"Watch Log", tier:"pro", category:"Movie", path:"/templates/pro/movie-1.png"},
  { id:"movie-2", label:"Film Review", tier:"pro", category:"Movie", path:"/templates/pro/movie-2.png"},
  { id:"movie-3", label:"Watchlist", tier:"pro", category:"Movie", path:"/templates/pro/movie-3.png"},

  { id:"academic-1", label:"Vocabulary List", tier:"pro", category:"Academic", path:"/templates/pro/academic-1.png"},
  { id:"academic-2", label:"Research Notes", tier:"pro", category:"Academic", path:"/templates/pro/academic-2.png"},
  { id:"academic-3", label:"Study Schedule", tier:"pro", category:"Academic", path:"/templates/pro/academic-3.png"},

  { id:"mood-1", label:"Mood Log", tier:"pro", category:"Mood", path:"/templates/pro/mood-1.png"},
  { id:"mood-2", label:"Emotion Tracker", tier:"pro", category:"Mood", path:"/templates/pro/mood-2.png"},

  { id:"todo-1", label:"To-Do List", tier:"pro", category:"Todo", path:"/templates/pro/todo-1.png"},
  { id:"todo-2", label:"Task Manager", tier:"pro", category:"Todo", path:"/templates/pro/todo-2.png"},
  { id:"todo-3", label:"Goal Tracker", tier:"pro", category:"Todo", path:"/templates/pro/todo-3.png"},

  { id:"tracker-1", label:"30 Day Challenge Tracker [Split]", tier:"pro", category:"Tracker", path:"/templates/pro/tracker-1.png"},
  { id:"tracker-2", label:"30 Day Challenge Tracker + Notes", tier:"pro", category:"Tracker", path:"/templates/pro/tracker-2.png"},
  { id:"tracker-3", label:"100 Day Challenge Tracker", tier:"pro", category:"Tracker", path:"/templates/pro/tracker-3.png"},
];

export const PRO_CATEGORIES = ["Planner", "Cooking", "Reading", "Movie", "Tracker", "Academic", "Mood", "Todo"];

export function getCoverStyle(j) {
  if (j.coverType === "preset") {
    const preset = PRESET_COVERS.find(c => c.id === j.coverId);
    return preset?.style || {};
  }
  if (j.coverType === "image" || j.coverType === "unsplash") {
    return j.coverImg
      ? {
          backgroundImage: `url(${j.coverImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }
      : {};
  }
  return {};
}

export const PACK_DETAILS = {
  "Planner": {
    desc: "Daily, weekly & monthly planning spreads to organise your days.",
    templates: TEMPLATES.filter(t => t.category === "Planner"),
  },
  "Cooking": {
    desc: "Recipe pages, meal planners and cook's notes for the kitchen.",
    templates: TEMPLATES.filter(t => t.category === "Cooking"),
  },
  "Reading": {
    desc: "Book logs, reviews and TBR lists for avid readers.",
    templates: TEMPLATES.filter(t => t.category === "Reading"),
  },
  "Movie": {
    desc: "Watch logs, film reviews and watchlists for cinephiles.",
    templates: TEMPLATES.filter(t => t.category === "Movie"),
  },
  "Tracker": {
    desc: "Habit trackers, mood logs and goal trackers to stay on track.",
    templates: TEMPLATES.filter(t => t.category === "Tracker"),
  },
  "Academic": {
    desc: "Vocabulary lists, research notes and study schedules for students.",
    templates: TEMPLATES.filter(t => t.category === "Academic"),
  },
  "Mood": {
    desc: "Mood logs and emotion trackers for mental wellness.",
    templates: TEMPLATES.filter(t => t.category === "Mood"),
  },
  "Todo": {
    desc: "To-do lists, task managers and goal trackers for productivity.",
    templates: TEMPLATES.filter(t => t.category === "Todo"),
  },
};

/* Sticker images — add your own sticker URLs here */
export const STICKERS = [
  { id:"s1", src:"/stickers/cooking-1.png" },
  { id:"s2", src:"/stickers/cooking-2.png" },
  { id:"s3", src:"/stickers/cooking-3.png" },
  { id:"s4", src:"/stickers/cooking-4.png" },
  { id:"s5", src:"/stickers/cooking-5.png" },
  { id:"s6", src:"/stickers/cooking-6.png" },
  { id:"s7", src:"/stickers/cooking-7.png" },
  { id:"s8", src:"/stickers/cooking-8.png" },
  { id:"s9", src:"/stickers/cooking-9.png" },
  { id:"s10", src:"/stickers/cooking-10.png" },
  { id:"s11", src:"/stickers/cooking-11.png" },
  { id:"s12", src:"/stickers/cooking-12.png" },
  { id:"s13", src:"/stickers/cooking-13.png" },
  { id:"s14", src:"/stickers/cooking-14.png" },
  { id:"s15", src:"/stickers/cooking-15.png" },
  { id:"s16", src:"/stickers/cooking-16.png" },
  { id:"s17", src:"/stickers/cooking-17.png" },
  { id:"s18", src:"/stickers/movies-1.png" },
  { id:"s19", src:"/stickers/movies-2.png" },
  { id:"s20", src:"/stickers/movies-3.png" },
  { id:"s21", src:"/stickers/movies-4.png" },
  { id:"s22", src:"/stickers/movies-5.png" },
  { id:"s23", src:"/stickers/movies-6.png" },
  { id:"s24", src:"/stickers/movies-7.png" },
  { id:"s25", src:"/stickers/movies-8.png" },
  { id:"s26", src:"/stickers/books-1.png" },
  { id:"s27", src:"/stickers/books-2.png" },
  { id:"s28", src:"/stickers/books-3.png" },
  { id:"s29", src:"/stickers/books-4.png" },
  { id:"s30", src:"/stickers/books-5.png" },
  { id:"s31", src:"/stickers/books-6.png" },
  { id:"s32", src:"/stickers/books-7.png" },
];