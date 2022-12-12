import { Database } from "@redux/interfaces";

export function customJsonStringify(database: Database) {
   const string = JSON.stringify(database, undefined, 1)

   const matches = string.match(/"(stat|multiplier|weaponTypes)": \[[^]+?\]/g)
   if (matches === null) return string

   const newString = matches.reduce((acc, match) => {
      acc = acc.replace(match, match.replaceAll('\n', '').replace(/  +/g, ' '))
      return acc
   }, string)

   return newString
}