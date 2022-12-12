/**
 ** removes
 **
 ** enhanced (
 **    text for enhanced perk
 ** )
 */
export function removeEnhanced(description: string) {
   const enhancedExports = description.match(/^enhanced \([\s\S]*?\n\)$/gm)

   if (enhancedExports) {
      enhancedExports.forEach((enhancedExport) => {
         description = description.replace(enhancedExport, '')
      })
   }

   description = description.replaceAll('#e', '')
   return description
}
