export const apiUrls = {
   versions: 'https://api.github.com/repos/Ice-mourne/database-clarity/contents/versions.json',

   clarity: 'https://api.github.com/repos/Ice-mourne/database-clarity/contents/descriptions/clarity.json',
   crayon: 'https://api.github.com/repos/Ice-mourne/database-clarity/contents/descriptions/crayon.json',
   dim: 'https://api.github.com/repos/Ice-mourne/database-clarity/contents/descriptions/dim.json',
   lightGG: 'https://api.github.com/repos/Ice-mourne/database-clarity/contents/descriptions/lightGG.json',

   live: 'https://api.github.com/repos/Ice-mourne/database-clarity/contents/descriptionsWithEditor.json',
   // intermediate: 'https://api.github.com/repos/Clovis-Breh/database-clarity/contents/descriptions.json'
   intermediate: 'https://api.github.com/repos/Clarity-Control/database-clarity/contents/descriptions.json'
}

export const descriptionUrls = {
   clovis: 'https://raw.githubusercontent.com/Clarity-Control/database-clarity/test/descriptions.json' as const,
   // clovis: 'https://raw.githubusercontent.com/Clovis-Breh/database-clarity/test/descriptions.json' as const,
   iceWithEditor: 'https://raw.githubusercontent.com/Ice-mourne/database-clarity/test/descriptionsWithEditor.json' as const
}