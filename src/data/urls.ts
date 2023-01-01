export const apiUrls = {
  versions:
    "https://api.github.com/repos/Ice-mourne/database-clarity/contents/versions.json",
  clarity:
    "https://api.github.com/repos/Ice-mourne/database-clarity/contents/descriptions/clarity.json",
  crayon:
    "https://api.github.com/repos/Ice-mourne/database-clarity/contents/descriptions/crayon.json",
  dim: "https://api.github.com/repos/Ice-mourne/database-clarity/contents/descriptions/dim.json",
  lightGG:
    "https://api.github.com/repos/Ice-mourne/database-clarity/contents/descriptions/lightGG.json",
  live: "https://api.github.com/repos/Database-Clarity/Live-Clarity-Database/contents/liveDescription.json",
  intermediate:
    "https://api.github.com/repos/Database-Clarity/Live-Clarity-Database/contents/intermediateDescriptions.json",
};

export const descriptionUrls = {
   clovis: 'https://raw.githubusercontent.com/Clarity-Control/database-clarity/test/descriptions.json' as const,
   // clovis: 'https://raw.githubusercontent.com/Clovis-Breh/database-clarity/test/descriptions.json' as const,
   iceWithEditor: 'https://raw.githubusercontent.com/Ice-mourne/database-clarity/test/descriptionsWithEditor.json' as const
}